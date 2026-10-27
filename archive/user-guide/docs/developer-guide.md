---
last_update:
  date: 2026-10-15
---

# 软件包开发指南

<span id="开发者指南"></span>

本指南帮助你把已有代码或新功能做成可由 Robonix 发现、调用和管理的软件包。需要编写 Python 或相应语言的实现，并能使用终端准备构建环境。只想安装已有机器人配置时，从[使用我的机器人](integration-guide/index.md)开始。

## 选择开发目标

| 你现在要做什么 | 阅读入口 | 完成后应得到什么 |
|---|---|---|
| 第一次了解软件包开发 | [开发第一个软件包](development/package-start.md) | 不连接真实硬件，完成构建、任务调用和停止 |
| 判断应该写原语、服务还是技能 | [软件包概念与生命周期](development/package-concepts.md) | 明确接口职责、身份和运行阶段 |
| 新建一个项目 | [创建软件包骨架](development/package-structure.md) | 清单、脚本、代码与配置说明的目录结构 |
| 接入硬件 SDK 或驱动 | [开发一个原语](development/implement-primitive.md) | 标准硬件能力与生命周期实现 |
| 提供可复用算法功能 | [开发一个服务](development/implement-service.md) | 任务调用、状态查询和取消接口 |
| 封装任务级行为 | [开发一个技能](development/implement-skill.md) | 可被模型发现并按需激活的技能 |
| 已有 Python 代码，想迁移 | [抓积木接入示例](tutorials/existing-python-feature.md) | 硬件访问与任务逻辑各有明确边界 |
| 把软件包放到机器人上运行 | [组装并运行开发部署](development/package-deployment.md) | 已验证的能力注册、任务与停止结果 |

首次开发建议按“模板教程 → 必要概念 → 创建骨架 → 选择一种实现 → 组装运行”的顺序。模板使用问候技能，服务和原语示例是教学骨架；不要把占位算法当作已经适配的导航器或实车驱动。

## 查询与交付

- [Python 接口参考](development/python-api.md)：提供方、能力发现、连接、ROS 2、MCP 和 gRPC。
- [命令与清单字段速查](development/package-reference.md)：开发命令及清单字段的当前含义。
- [打包规范](integration-guide/packaging-spec.md)、[构建与代码生成](integration-guide/build-and-codegen.md)：构建、配置与兼容约束。
- [发布到目录](integration-guide/package-catalog.md)与[结果验证](integration-guide/result-verification.md)：交付给其他人使用前的准备。

开发示例使用本仓库根目录 `ROBONIX_SOURCE_REVISION` 所记录的 Robonix 源码版本；需要复现实例时，先按该版本准备源码。

## 旧版章节入口

原来集中在本页的内容已按任务拆分。原有章节链接仍可使用，请从对应行进入完整内容。

| 旧版章节 | 现在的阅读入口 |
|---|---|
| <span id="1-5-分钟上手"></span>1. 5 分钟上手 | [阅读完整章节](development/package-start.md) |
| <span id="2-robonix-是什么"></span>2. Robonix 是什么 | [阅读完整章节](development/package-concepts.md#robonix-是什么) |
| <span id="3-原语服务与技能"></span>3. 原语、服务与技能 | [阅读完整章节](development/package-concepts.md#原语服务与技能) |
| <span id="31-原语服务与技能的职责"></span>3.1 原语、服务与技能的职责 | [阅读完整章节](development/package-concepts.md#原语服务与技能的职责) |
| <span id="32-运行时身份"></span>3.2 运行时身份 | [阅读完整章节](development/package-concepts.md#运行时身份) |
| <span id="33-能力寻址"></span>3.3 能力寻址 | [阅读完整章节](development/package-concepts.md#能力寻址) |
| <span id="34-能力目录atlas"></span>3.4 能力目录（Atlas） | [阅读完整章节](development/package-concepts.md#能力目录atlas) |
| <span id="4-能力约定"></span>4. 能力约定 | [阅读完整章节](development/package-concepts.md#能力约定) |
| <span id="41-描述文件与-idl"></span>4.1 描述文件与 IDL | [阅读完整章节](development/package-concepts.md#描述文件与-idl) |
| <span id="42-模式与传输"></span>4.2 模式与传输 | [阅读完整章节](development/package-concepts.md#模式与传输) |
| <span id="43-全局与软件包内能力约定"></span>4.3 全局与软件包内能力约定 | [阅读完整章节](development/package-concepts.md#全局与软件包内能力约定) |
| <span id="5-生命周期"></span>5. 生命周期 | [阅读完整章节](development/package-concepts.md#生命周期) |
| <span id="51-状态"></span>5.1 状态 | [阅读完整章节](development/package-concepts.md#状态) |
| <span id="52-生命周期接口与处理函数"></span>5.2 生命周期接口与处理函数 | [阅读完整章节](development/package-concepts.md#生命周期接口与处理函数) |
| <span id="6-软件包结构"></span>6. 软件包结构 | [阅读完整章节](development/package-structure.md#软件包结构) |
| <span id="61-生成骨架"></span>6.1 生成骨架 | [阅读完整章节](development/package-structure.md#生成骨架) |
| <span id="62-软件包清单"></span>6.2 软件包清单 | [阅读完整章节](development/package-structure.md#软件包清单) |
| <span id="63-构建与启动脚本"></span>6.3 构建与启动脚本 | [阅读完整章节](development/package-structure.md#构建与启动脚本) |
| <span id="7-python-接口api速览"></span>7. Python 接口（API）速览 | [阅读完整章节](development/package-structure.md#python-接口api速览) |
| <span id="8-开发服务"></span>8. 开发服务 | [阅读完整章节](development/implement-service.md) |
| <span id="81-验证"></span>8.1 验证 | [阅读完整章节](development/implement-service.md#验证) |
| <span id="9-开发原语"></span>9. 开发原语 | [阅读完整章节](development/implement-primitive.md) |
| <span id="91-验证"></span>9.1 验证 | [阅读完整章节](development/implement-primitive.md#验证) |
| <span id="10-开发技能"></span>10. 开发技能 | [阅读完整章节](development/implement-skill.md) |
| <span id="101-验证"></span>10.1 验证 | [阅读完整章节](development/implement-skill.md#验证) |
| <span id="11-部署目录"></span>11. 部署目录 | [阅读完整章节](development/package-deployment.md#部署目录) |
| <span id="12-部署清单"></span>12. 部署清单 | [阅读完整章节](development/package-deployment.md#部署清单) |
| <span id="13-构建启动与停止"></span>13. 构建、启动与停止 | [阅读完整章节](development/package-deployment.md#构建启动与停止) |
| <span id="14-python-接口"></span>14. Python 接口 | [阅读完整章节](development/python-api.md) |
| <span id="141-构造能力提供方"></span>14.1 构造能力提供方 | [阅读完整章节](development/python-api.md#构造能力提供方) |
| <span id="142-查询能力目录"></span>14.2 查询能力目录 | [阅读完整章节](development/python-api.md#查询能力目录) |
| <span id="143-连接能力"></span>14.3 连接能力 | [阅读完整章节](development/python-api.md#连接能力) |
| <span id="144-ros-2-便捷接口"></span>14.4 ROS 2 便捷接口 | [阅读完整章节](development/python-api.md#ros-2-便捷接口) |
| <span id="145-mcp-与-grpc"></span>14.5 MCP 与 gRPC | [阅读完整章节](development/python-api.md#mcp-与-grpc) |
| <span id="146-关闭行为"></span>14.6 关闭行为 | [阅读完整章节](development/python-api.md#关闭行为) |
| <span id="15-常用命令行接口"></span>15. 常用命令行接口 | [阅读完整章节](development/package-reference.md#常用命令行接口) |
| <span id="16-配置字段"></span>16. 配置字段 | [阅读完整章节](development/package-reference.md#配置字段) |
| <span id="161-软件包清单"></span>16.1 软件包清单 | [阅读完整章节](development/package-reference.md#软件包清单) |
| <span id="162-部署清单"></span>16.2 部署清单 | [阅读完整章节](development/package-reference.md#部署清单) |
| <span id="163-能力约定-toml"></span>16.3 能力约定 TOML | [阅读完整章节](development/package-reference.md#能力约定-toml) |
