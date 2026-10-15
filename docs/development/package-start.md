---
last_update:
  date: 2026-10-14
---

# 开发第一个软件包

本教程使用不依赖真实硬件的模板，帮助你构建、启动并通过模型调用一项技能。需要先准备 Robonix 工具链、可用的模型服务和 Python 环境。完成后，你应能看到能力注册、收到问候结果，并停止系统。

## 准备模板与环境

最快的学习入口是可独立启动的 [`template-rbnx`](https://github.com/syswonder/template-rbnx/tree/60dc85834c2714022b1821e6fce6c629c0314699)。它包含一个模拟底盘原语、一个导航服务和一个问候技能，不需要真实机器人或仿真器。

先按 [Webots 快速上手](../getting-started/quickstart.md#1-检查主机)安装 Git、Rust、Python、Docker 和 Robonix，再执行：

## 下载并启动模板

```bash
git clone https://github.com/syswonder/template-rbnx.git
cd template-rbnx
git switch --detach 60dc85834c2714022b1821e6fce6c629c0314699

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install 'grpcio-tools==1.76.0' 'mcp>=1.27,<2' 'fastmcp>=3,<5' PyYAML

cp .env.example .env
# 编辑 .env，填写可用的 VLM_BASE_URL、VLM_API_KEY 和 VLM_MODEL。
set -a
source .env
set +a

rbnx build
rbnx boot
```

执行 `rbnx build` 和 `rbnx boot` 时保持虚拟环境处于激活状态。

## 检查能力并提交任务

在另一个终端检查运行状态并提交任务：

```bash
rbnx caps -v
rbnx chat
```

在交互界面输入 `Say hello to Alice.`。系统应首次激活 `say_hello` 技能并返回问候语。

## 停止系统

退出交互界面后，在部署终端按 `Ctrl+C`；也可以从另一个终端执行：

```bash
rbnx shutdown
```

本例安装的依赖分别用于 gRPC 类型生成、模型上下文协议服务器与工具层，以及 YAML 配置读取。若构建或启动报告 Python 模块不存在，先确认当前终端仍在 `.venv` 中，再补装报错指出的模块。

:::tip[从模板开始修改]

- 替换 `primitives/mock_chassis/` 中的模拟驱动，可以接入真实底盘。
- 替换 `services/my_navigate/` 中的占位规划逻辑，可以接入 Nav2 或其他导航器。
- 复制 `skills/say_hello/`，可以建立带自定义能力约定的技能。

:::


## 下一步

接下来阅读[软件包概念](package-concepts.md)与[创建骨架](package-structure.md)，再选择原语、服务或技能示例。
