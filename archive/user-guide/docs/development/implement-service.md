---
last_update:
  date: 2026-10-14
---

# 开发一个服务

本例创建导航服务的可运行骨架，说明如何暴露任务、查询状态和取消能力。开始前按[软件包骨架](package-structure.md)准备空部署目录与 Python 环境，在部署根目录执行下面的命令。这里的状态表不包含真正的导航算法。

## 创建服务并声明能力

下面的教学服务复用标准导航能力约定，因此不复制全局 TOML。软件包清单列出提交目标、查询状态和取消目标三条能力约定，生命周期 Driver 由框架自动补上；运行时再把每条约定绑定为该服务提供的能力。示例中的状态表只是可运行骨架，接入真正规划器时必须由规划器回调更新状态。

```bash
rbnx package-new my_navigate --type service
```

将 `package_manifest.yaml` 中的能力约定列表改为：

```yaml title="services/my_navigate/package_manifest.yaml"
capabilities:
  - name: robonix/service/navigation/navigate
  - name: robonix/service/navigation/navigate/status
  - name: robonix/service/navigation/navigate/cancel
```

## 实现任务、状态与取消

将 `scripts/build.sh` 中的代码生成命令改为 `rbnx codegen -p "$PKG" --mcp`，然后实现：

```python title="services/my_navigate/my_navigate/main.py"
from __future__ import annotations

import uuid

from robonix_api import Service, Ok
from navigation_mcp import (
    CancelNavigation_Request,
    CancelNavigation_Response,
    GetNavigationStatus_Request,
    GetNavigationStatus_Response,
    Navigate_Request,
    Navigate_Response,
)

navigate_service = Service(
    id="my_navigate",
    namespace="robonix/service/navigation",
)
runs: dict[str, str] = {}
latest_run_id: str | None = None

@navigate_service.on_init
def init(cfg: dict):
    return Ok()

@navigate_service.mcp("robonix/service/navigation/navigate")
def navigate(req: Navigate_Request) -> Navigate_Response:
    """Accept a map-frame navigation goal."""
    global latest_run_id
    run_id = str(uuid.uuid4())
    # 在这里把 req.goal 交给真正的规划器。
    runs[run_id] = "RUNNING"
    latest_run_id = run_id
    return Navigate_Response(
        accepted=True,
        run_id=run_id,
        detail="goal accepted",
    )

@navigate_service.mcp("robonix/service/navigation/navigate/status")
def status(req: GetNavigationStatus_Request) -> GetNavigationStatus_Response:
    run_id = req.run_id or latest_run_id
    state = runs.get(run_id) if run_id is not None else None
    return GetNavigationStatus_Response(
        known=state is not None,
        state=state or "",
        detail="known goal" if state is not None else "unknown run_id",
    )

@navigate_service.mcp("robonix/service/navigation/navigate/cancel")
def cancel(req: CancelNavigation_Request) -> CancelNavigation_Response:
    run_id = req.run_id or latest_run_id
    if run_id is None or run_id not in runs:
        return CancelNavigation_Response(accepted=False, detail="unknown run_id")
    runs[run_id] = "CANCELED"
    return CancelNavigation_Response(accepted=True, detail="cancel requested")

if __name__ == "__main__":
    navigate_service.run()
```

## 加入部署清单

在部署清单中加入：

```yaml
service:
  - name: my_navigate
    path: ./services/my_navigate
    config: {}
```

## 按需连接其他能力

清单里的 `name` 会在启动时覆盖 `Service(id="my_navigate", ...)` 里的 `id`，按约定写成一致便于对照。该新清单省略 Driver 条目，框架会选择共享 `robonix/lifecycle/driver`；`provider.run()` 根据生成代码声明同一条 Driver 能力，启动流程连接它并发送 `CMD_INIT`，服务随后进入激活阶段。服务若需要底盘，应在 `on_activate` 中发现并连接目标运行实例：

```python
from robonix_api import ATLAS, Deferred, Ok
from robonix_api.atlas_types import Channel, Transport

move_channel: Channel | None = None

@navigate_service.on_activate
def activate():
    global move_channel
    if move_channel is not None:
        move_channel.close()
        move_channel = None
    matches = ATLAS.find_capability(
        contract_id="robonix/primitive/chassis/move",
        transport=Transport.GRPC,
        provider_id="base_chassis",
    )
    if not matches:
        return Deferred("base_chassis is not ready")
    move_channel = navigate_service.connect_capability(
        matches[0],
        "robonix/primitive/chassis/move",
        Transport.GRPC,
    )
    return Ok()

@navigate_service.on_deactivate
def deactivate():
    global move_channel
    if move_channel is not None:
        move_channel.close()
        move_channel = None
    return Ok()

@navigate_service.on_shutdown
def shutdown():
    return deactivate()
```

长期连接由获得它的生命周期阶段持有，并在停用阶段显式关闭。`Channel.close()` 是幂等操作，因此关闭阶段可以安全兜底。只为一次调用建立连接时使用 `with navigate_service.connect_capability(...) as channel:`；`with` 退出后不得继续使用其端点。

## 验证

```bash
rbnx validate ./services/my_navigate
rbnx build -p ./services/my_navigate
```

两条命令都成功后，按[部署运行步骤](package-deployment.md#构建启动与停止)启动部署。`rbnx caps -v` 应显示 `my_navigate` 为 `ACTIVE`，并列出提交目标、查询状态和取消目标三条 MCP 业务能力；`rbnx tools` 应显示对应工具。若只出现 Driver，说明处理函数没有完成注册或代码生成产物未加载。


## 下一步

接下来[组装并运行部署](package-deployment.md)，验证能力注册、任务状态与取消行为。
