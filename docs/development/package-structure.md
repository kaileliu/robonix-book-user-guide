---
last_update:
  date: 2026-10-14
---

# 创建软件包骨架

本页帮助你建立一个空部署和软件包目录，理解清单、构建脚本与 Python 入口。开始前先完成[模板教程](package-start.md)并停止它；独立使用本页时，先进入你准备存放新部署的父目录。

## 软件包结构

### 生成骨架

在准备存放新部署的父目录中创建空部署。如果沿用[模板教程](package-start.md)，先退出模板仓库；不要在已有 `my_navigate` 和 `say_hello` 的模板内重复创建同名软件包。

```bash
rbnx init robot-acme-rover
cd robot-acme-rover
mkdir -p config primitives services skills urdf assets
```

随后创建需要开发的软件包：

```bash
rbnx package-new my_camera --type primitive
rbnx package-new my_mapper --type service
rbnx package-new my_skill --type skill
```

命令分别写入 `primitives/`、`services/` 和 `skills/`。也可以指定准确目录：

```bash
rbnx package-new my_camera --type primitive --path ./packages/my_camera
```

`--path` 只改变目标目录；`--type` 仍决定生成原语、服务还是技能的提供方类、命名空间和默认软件包名称，两者都必须正确。`package-new` 会生成清单、`build.sh`、`start.sh`、Python 模块和空的 `capabilities/`。开始实现后补上配置说明；如果软件包还需要释放框架之外的进程或资源，再增加幂等的 `stop.sh`。发布前的目录应整理为：

```text
primitives/my_camera/
├── .gitignore
├── package_manifest.yaml
├── capabilities/
│   └── .gitkeep
├── scripts/
│   ├── build.sh
│   ├── start.sh
│   └── stop.sh          # 使用清单 stop 时添加
├── config.spec             # 说明部署 config；无公开配置时可省略
└── my_camera/
    ├── __init__.py
    └── main.py
```

`config.spec` 说明公开配置的类型、单位、默认值和约束。`stop.sh` 不是必须的；只有清单声明 `stop:` 时才需要它，且重复执行不应报错或重复破坏资源。

`rbnx package-new` 只创建软件包目录，不会修改部署仓库的 `robonix_manifest.yaml`。要随整机启动新软件包，必须根据类型把它作为一条实例显式加入清单的 `primitive:`、`service:` 或 `skill:` 列表。

生成的清单不需要包含 Driver 条目；框架会自动补上共享生命周期 Driver。`main.py` 包含 `@provider.on_init` 占位实现。`rbnx boot` 会把部署项的 `config` 传入初始化回调。如果某个生命周期回调未实现，运行时记录警告并执行安全空操作；回调明确返回错误时，启动仍然失败。

### 软件包清单

```yaml
manifestVersion: 1

package:
  name: robonix.service.example.my_service
  version: 0.1.0
  description: Example Robonix service.
  license: Apache-2.0
  tags: [service, example]
  maintainers:
    - Your Name <you@example.com>

build: bash scripts/build.sh
start: bash scripts/start.sh
stop: bash scripts/stop.sh

capabilities:
  - name: robonix/service/example/hello
    path: capabilities/hello.v1.toml

depends:
  - name: robonix.lib.example
    path: ../example-lib
```

运行时要求 `package.name`、`version`、`description`、`license` 和 `start` 非空。`tags` 与 `maintainers` 对目录发布很重要，但当前运行时不把它们当成必填字段，也不解析版本是否严格符合语义化版本。

对于由 `rbnx boot` 或 Soma 管理的软件包，`stop` 是可选的 shell 命令；上面的完整示例假定仓库已提供 `scripts/stop.sh`。受管关闭顺序为 Driver `CMD_SHUTDOWN`、`stop`、进程组 TERM/KILL；命令在软件包根目录执行。单独执行 `rbnx start` 当前不会自动运行 `stop`。软件包没有框架外资源需要清理时，删除清单中的 `stop:` 和对应脚本，不要保留无意义的空钩子。

`capabilities` 列出软件包声明的全部能力约定。标准约定只写 `name`；尚未进入全局目录的约定放在本包 `capabilities/`，并用 `path` 引用相对软件包根目录的 TOML。旧字段名 `definition` 仍作为 `path` 的别名读取。清单不会替代码声明运行时能力；普通业务能力仍需通过 `@provider.mcp`、`@provider.grpc`、`create_publisher` 等 API 注册。

Driver 约定的数量和启动行为见[生命周期接口与处理函数](package-concepts.md#生命周期接口与处理函数)。

`depends` 每项使用 `name`，并可带 `path`、`url` 和 `branch`。这些字段当前只被解析为依赖元数据，不会自动克隆、安装依赖或修改 `PYTHONPATH`；构建脚本仍需自行处理依赖。

### 构建与启动脚本

代码生成默认使用当前 `python3` 生成 gRPC 类型；解释器可用 `rbnx codegen --python <interpreter>` 或环境变量 `RBNX_CODEGEN_PYTHON` 指定，优先级为命令行标志 → 环境变量 → `python3`。先在软件包实际使用的 Python 环境中安装并验证依赖：

```bash
python3 -m pip install grpcio-tools
python3 -c 'import grpc_tools'
```

第二条命令应以状态码 0 结束。若软件包使用虚拟环境，执行 `rbnx build` 和 `rbnx start` 时都要保持该环境处于激活状态。

纯 Python MCP 软件包的最小构建脚本：

```bash title="scripts/build.sh"
#!/usr/bin/env bash
set -euo pipefail
PKG="${RBNX_PACKAGE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
rbnx codegen -p "$PKG" --mcp
```

启动脚本：

```bash title="scripts/start.sh"
#!/usr/bin/env bash
set -euo pipefail
PKG_ROOT="${RBNX_PACKAGE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$PKG_ROOT"
export PYTHONPATH="$(rbnx path robonix-api):$PKG_ROOT:${PYTHONPATH:-}"
exec python3 -m my_service.main
```

更多构建方式见 [构建与代码生成](../integration-guide/build-and-codegen.md)。

## Python 接口（API）速览

```python
from robonix_api import Service, Ok
from hello_mcp import Hello_Request, Hello_Response

service = Service(id="my_service", namespace="robonix/service/example")

@service.on_init
def init(cfg: dict):
    return Ok()

@service.mcp("robonix/service/example/hello")
def hello(req: Hello_Request) -> Hello_Response:
    """Return a greeting for the requested name."""
    return Hello_Response(message=f"Hello, {req.name}!")

service.run()
```

常用返回值：

- `Ok()`：生命周期动作成功；
- `Err("reason")`：不可恢复错误；
- `Deferred("reason")`：依赖尚未就绪，保持当前状态并把原因写入 `state_detail`。当前 `rbnx boot` 和 Executor 不会自动重试；调用方或操作方需要在修复依赖后重新发起生命周期流程。

已实现的生命周期处理函数都必须返回 `Ok`、`Err` 或 `Deferred`；抛出的异常会转换为错误，漏写返回值或返回其他类型会触发 `TypeError` 并使 Driver RPC 失败。不需要处理某个阶段时，直接省略对应回调，由框架记录警告并执行安全空操作。


## 下一步

接下来按目标选择[开发服务](implement-service.md)、[开发原语](implement-primitive.md)或[开发技能](implement-skill.md)，最后[组装运行](package-deployment.md)。
