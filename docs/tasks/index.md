---
last_update:
  date: 2026-10-15
---

# 建图、导航与场景

先让机器人[完成基本连接与任务检查](../getting-started/client.md#检查连接与交互)，再使用已配置的功能。本教程使用的建图与导航参考实现面向室内场景。

## 先保存地图，再选择任务

| 顺序 | 要做的事 | 需要的功能 |
|---|---|---|
| 先做 | [创建并保存地图](mapping.md)，加载后确认定位 | [Hub 建图服务](https://hub.robonix.ai/package/robonix.service.mapping)、传感器与里程计 |
| 按需选择 | [在地图上指定导航目标](navigation.md) | [Hub 导航服务](https://hub.robonix.ai/package/robonix.service.navigation)与整机导航配置 |
| 按需选择 | [标注房间、查看场景](scene.md) | 场景服务；查看图像和物体还需对应感知能力 |

在 [Hub 目录](https://hub.robonix.ai/discover)核对功能、依赖与机器人型号。新增软件包的操作见[修改配置](../hub/configure.md#添加软件包)。

## 操作前检查

确认底盘、传感器和所需服务已正常启动；导航前还需定位与现场一致。移动时清空通道并确认急停可用。第一次使用可先按[TIAGo 仿真教程](../getting-started/simulation.md)准备环境。
