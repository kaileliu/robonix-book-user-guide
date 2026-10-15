---
title: 安装并连接机器人
last_update:
  date: 2026-10-15
---

# 安装并连接机器人

<span id="接入路线"></span>

先从 [Hub 目录](https://hub.robonix.ai/discover)找到自己的型号，再在机器人上安装配置、启动，用 Client 下达任务。

## 开始前确认型号与环境

打开 [Hub 机器人目录](https://hub.robonix.ai/discover/robot)，浏览或[搜索型号](https://hub.robonix.ai/discover?kind=robot)。查看条目说明和仓库 README，确认型号、传感器、运行环境与你的设备一致。

没有真机？可先[体验页面](../getting-started/online-demo.md)，或[运行 TIAGo 仿真](../getting-started/simulation.md)。

## 按顺序完成安装与连接

1. [安装 Console](../hub/install.md)：在机器人主机执行安装命令，打开页面并登录。
2. [安装整机配置](../hub/catalog.md)：在 Console“目录”选择同一型号，确认后安装。
3. [检查参数](../hub/configure.md)：补齐设备地址和模型服务，保存为新版本。
4. [构建并启动](../hub/run.md)：完成型号 README 的准备，构建软件包，在“概览”启动。
5. [安装并连接 Client](../getting-started/client.md)：在操作者电脑打开客户端，确认在线。
6. [完成第一条任务](../getting-started/first-task.md)：先询问能力；有相机和图像理解能力时，再试一次观察任务。

完成连接后，继续[机器人任务](../tasks/index.md)或[日常管理](../hub/index.md)。需要更多功能，可在 [Hub 的服务包](https://hub.robonix.ai/discover/service)和[技能包](https://hub.robonix.ai/discover/skill)中查找，按[添加能力](../hub/configure.md#添加软件包)安装。

## 没有匹配型号

维护者给了仓库时，先按 README 准备，再[登记已有目录](../hub/deployments.md#登记已有目录)；给了分享链接时，可以[导入分享](../hub/cloud.md#导入分享链接)。

已有本机软件包但没有整机清单时，可[从空白部署开始配置](../hub/deployments.md#新建空白部署)。硬件驱动尚未适配时，再进入[开发与适配](../development/index.md)。

<details>
<summary>开发者的适配与验证要求</summary>

<span id="何时可以声明本体已支持"></span>

目录收录不代表整机已验证，查看[支持判定要求](../development/robot-support.md#何时可以声明本体已支持)。

<span id="完整机器人接入的交付物"></span>

新本体需要哪些文件与说明，查看[适配交付物](../development/robot-support.md#完整机器人接入的交付物)。

<span id="推荐完成顺序"></span>

编写驱动与适配的顺序，查看[机器人适配路线](../development/robot-support.md#推荐完成顺序)。

</details>
