---
last_update:
  date: 2026-10-14
---

# 开发与进阶适配

本部分面向需要编写代码、调整部署清单或适配新硬件的读者。如果只想使用已有机器人，请先从[使用我的机器人](../integration-guide/index.md)开始，日常配置使用 [Console](../hub/index.md) 即可。

## 本章导览

开发内容按“写能力 → 组织部署 → 连接组件”的顺序展开：

| 子目录 | 你会在这里完成什么 |
|---|---|
| 开发软件包 | 从一个最小软件包开始，实现原语、服务或技能，并写清配置、构建和验证方式 |
| 命令行与多平台部署 | 使用 `rbnx`，理解部署清单，处理 Webots、Orin、x86 等跨设备运行 |
| 组件配置详解 | 调整建图、导航、场景和语音后端，让能力适合具体机器人和环境 |
| 机器人适配 | 把尚未支持的实体机器人或仿真本体接入，完成整机验收并准备发布 |

如果你还没有实体机器人，先从[运行 TIAGo 仿真](../getting-started/simulation.md)验证开发环境，再回到本章编写和测试功能。

## 按交付目标选择路线

| 你要交付什么 | 阅读入口 | 完成标准 |
|---|---|---|
| 把已有 Python 功能交给机器人使用 | [抓积木接入示例](../tutorials/existing-python-feature.md) | 能发现能力、执行任务并检查结果 |
| 新的原语、服务或技能 | [软件包开发指南](../developer-guide.md) | 标准清单、配置说明、可构建的软件包和验证记录 |
| 一台尚未适配的机器人 | [机器人适配路线](robot-support.md) | 整机部署在明确型号与版本上通过验证 |
| 厂商提供的 MuJoCo 仿真 | [MuJoCo 本体接入](../integration-guide/mujoco-simulation-onboarding.md) | 仿真工程、能力适配与可重复运行的部署 |
| 可复用的部署配置 | [打包规范](../integration-guide/packaging-spec.md)与[构建指南](../integration-guide/build-and-codegen.md) | 来源、版本、实例与依赖明确 |
| 发布给其他人使用的软件包 | [发布与目录收录](../integration-guide/package-catalog.md) | 仓库信息完整、构建检查通过、使用边界明确 |

## 已有部署需要深入排查

使用命令行时，从 [Webots 命令行快速上手](../getting-started/quickstart.md)与 [rbnx 命令](../components/rbnx.md)开始。跨设备部署见[多平台部署](../architecture/multiplatform-deployment.md)，单机启动结构见[部署与启动](../architecture/deployment-and-startup.md)。

调建图、导航和场景服务时，分别查看[建图与定位](../components/mapping.md)、[导航](../components/navigation.md)和[场景服务](../components/scene.md)。配置字段以目标软件包的 `config.spec` 为准，不能直接照搬其他型号的参数。

需要理解系统之间如何协作时，阅读[架构组件](../architecture/components.md)与[运行时通信](../architecture/runtime-communication.md)；需要准确的接口签名时，查[接口目录](../interface-catalog/index.md)和[自动生成的参考](../reference/index.md)。
