---
last_update:
  date: 2026-10-14
---

# 开发一个原语

本例把底盘命令与里程计组织成标准原语，帮助你确定硬件适配边界。开始前按[软件包骨架](package-structure.md)准备空部署目录与 Python 环境，并安装示例使用的 ROS 2 和 colcon；在部署根目录操作。代码不包含真实厂商 SDK，接入实车还需完成分阶段验收。

## 创建原语并声明能力

原语负责把厂商 SDK、总线或 ROS 2 驱动适配为标准接口。以底盘的一次性移动命令为例：

```bash
rbnx package-new base_chassis --type primitive
```

在 `primitives/base_chassis/package_manifest.yaml` 中列出本例实现的标准能力约定：

```yaml
capabilities:
  - name: robonix/primitive/chassis/move
  - name: robonix/primitive/chassis/odom
```

## 准备构建与启动脚本

下面的示例导入 `nav_msgs.msg.Odometry` 并发布 ROS 2 数据，因此还要构建并加载代码生成的 ROS 2 叠加层。将脚手架的构建脚本改为：

```bash title="primitives/base_chassis/scripts/build.sh"
#!/usr/bin/env bash
set -euo pipefail
PKG="${RBNX_PACKAGE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
ROS_SETUP="${RBNX_ROS_SETUP:-/opt/ros/humble/setup.bash}"

source "$ROS_SETUP"
rbnx codegen -p "$PKG" --mcp --ros2
cd "$PKG/rbnx-build/codegen/ros2_idl"
colcon build
```

启动脚本必须先加载系统 ROS 2 环境，再加载本软件包生成的叠加层：

```bash title="primitives/base_chassis/scripts/start.sh"
#!/usr/bin/env bash
set -euo pipefail
PKG_ROOT="${RBNX_PACKAGE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
ROS_SETUP="${RBNX_ROS_SETUP:-/opt/ros/humble/setup.bash}"

source "$ROS_SETUP"
source "$PKG_ROOT/rbnx-build/codegen/ros2_idl/install/setup.bash"
cd "$PKG_ROOT"
export PYTHONPATH="$(rbnx path robonix-api):$PKG_ROOT:${PYTHONPATH:-}"
exec python3 -m base_chassis.main
```

目标平台不是 ROS 2 Humble 时，在构建和启动前把 `RBNX_ROS_SETUP` 设为该平台的 `setup.bash`。系统 ROS 2 提供运行时；Robonix 能力约定使用的消息和服务类型仍必须来自随后加载的代码生成叠加层。

## 实现原语

```python title="primitives/base_chassis/base_chassis/main.py"
import json

from robonix_api import Primitive, Ok
import chassis_pb2
import std_msgs_pb2
from nav_msgs.msg import Odometry

chassis = Primitive(id="base_chassis", namespace="robonix/primitive/chassis")

@chassis.on_init
def init(cfg: dict):
    # create_publisher 会立即向 Atlas 声明能力，因此应在 provider 注册后的
    # 生命周期处理函数中调用，不要在模块导入阶段调用。
    chassis.create_publisher(
        contract_id="robonix/primitive/chassis/odom",
        topic="/odom",
        msg_type=Odometry,
        qos="best_effort",
    )
    return Ok()

@chassis.grpc("robonix/primitive/chassis/move")
def move(req, _ctx):
    linear_x = req.command.linear_x
    angular_z = req.command.angular_z
    # 将速度传给厂商 SDK，并在实现中施加限速、超时和看门狗。
    return chassis_pb2.ExecuteMoveCommand_Response(
        status=std_msgs_pb2.String(
            data=json.dumps({"accepted": True, "linear_x": linear_x, "angular_z": angular_z})
        )
    )

if __name__ == "__main__":
    chassis.run()
```

ROS 2 话题可以通过便捷层创建并自动向 Atlas 声明。上面的 `on_init` 已创建发布者；产生里程计消息后发布：

```python
chassis.emit("robonix/primitive/chassis/odom", odom_message)
```

支持的字符串 QoS 为 `best_effort`、`reliable` 和 `latched`。也可传整数队列深度或原生 `QoSProfile`。原语既可以使用这些便捷接口，也可以直接使用 `rclpy`；无论哪种方式，都必须保证实际话题类型、方向和声明一致。

## 加入部署清单

在部署清单的 `primitive` 列表中加入：

```yaml
primitive:
  - name: base_chassis
    path: ./primitives/base_chassis
    config: {}
```

## 验证

```bash
rbnx validate ./primitives/base_chassis
rbnx build -p ./primitives/base_chassis
```

按[部署运行步骤](package-deployment.md#构建启动与停止)启动部署后，`rbnx caps -v` 应显示 `base_chassis` 为 `ACTIVE`，并分别以 gRPC 和 ROS 2 传输列出 `move` 与 `odom`。本例没有真实 SDK，不要把移动接口用于实车；接入厂商驱动后再按本体接入指南的无运动、单设备和整机阶段验收。


## 下一步

接下来[组装并运行部署](package-deployment.md)。真实硬件的验证顺序见[本体适配指南](../integration-guide/vendor-onboarding.md)。
