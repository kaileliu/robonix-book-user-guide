---
last_update:
  date: 2026-10-14
---

# 开发一个技能

本例创建问候技能，展示自定义能力约定和技能激活。开始前按[软件包骨架](package-structure.md)准备空部署目录与 Python 环境，在部署根目录操作。完成后，将技能加入部署，确认它能被发现并在任务调用时激活。

## 创建技能并定义接口

技能通常使用 `robonix/skill/<name>` 命名空间，使 Executor 能识别并在第一次调用前激活。自定义技能接口需要软件包内 IDL 和能力约定：

```bash
rbnx package-new say_hello --type skill
```

```text
skills/say_hello/capabilities/
├── say.v1.toml
└── lib/say_hello/srv/SayHello.srv
```

```toml title="capabilities/say.v1.toml"
[contract]
id = "robonix/skill/say_hello/say"
version = "1"
kind = "skill"
idl = "say_hello/srv/SayHello.srv"

[mode]
type = "rpc"
```

```text title="capabilities/lib/say_hello/srv/SayHello.srv"
string name
---
string greeting
```

## 声明软件包能力

在 `skills/say_hello/package_manifest.yaml` 中引用软件包内的业务能力约定；生命周期 Driver 由框架自动提供：

```yaml
capabilities:
  - name: robonix/skill/say_hello/say
    path: capabilities/say.v1.toml
```

## 实现技能

将构建脚本的代码生成命令设为 `rbnx codegen -p "$PKG" --mcp`，然后实现技能：

```python title="skills/say_hello/say_hello/main.py"
from robonix_api import Skill, Ok
from say_hello_mcp import SayHello_Request, SayHello_Response

skill = Skill(id="say_hello", namespace="robonix/skill/say_hello")
active = False

@skill.on_init
def init(cfg: dict):
    return Ok()

@skill.on_activate
def activate():
    global active
    active = True
    return Ok()

@skill.on_deactivate
def deactivate():
    global active
    active = False
    return Ok()

@skill.mcp("robonix/skill/say_hello/say")
def say(req: SayHello_Request) -> SayHello_Response:
    """Greet the named person."""
    return SayHello_Response(greeting=f"Hello, {req.name}!")

if __name__ == "__main__":
    skill.run()
```

MCP 处理函数必须恰好接收一个参数，并为输入和返回值提供代码生成类型注解。显式 `description=` 优先作为 Atlas 中供 Pilot 使用的描述；未传时使用函数文档字符串。

## 加入部署清单

在部署清单的 `skill` 列表中加入：

```yaml
skill:
  - name: say_hello
    path: ./skills/say_hello
    config: {}
```

## 验证

```bash
rbnx validate ./skills/say_hello
rbnx build -p ./skills/say_hello
```

按[部署运行步骤](package-deployment.md#构建启动与停止)启动部署后，`rbnx caps -v` 应显示 `say_hello` 为 `INACTIVE`，`rbnx tools` 应列出 `robonix/skill/say_hello/say`。通过 `rbnx chat` 提交 `Say hello to Alice.` 后，技能应只激活一次并返回问候语。

已有 Python 脚本直接调用厂商 SDK 时，不要把整段硬件访问包装进技能。先把 SDK 适配为标准原语，再让任务级技能调用原语。完整迁移示例见[以抓积木为例接入现有 Python 功能](../tutorials/existing-python-feature.md)。


## 下一步

接下来[组装并运行部署](package-deployment.md)，检查技能首次调用、结果与停止行为。
