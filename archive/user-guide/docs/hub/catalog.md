---
last_update:
  date: 2026-10-15
---

# 找到并安装整机配置

整机配置像一张“装配单”，把机器人要用的软件包、参数和附带文件放在一起。先在 [Hub 机器人目录](https://hub.robonix.ai/discover/robot)选好，再到本机 Console 安装。

## 在 Hub 选型号

在机器人分类浏览型号，或[按名称搜索](https://hub.robonix.ai/discover?kind=robot)。打开条目，查看说明、版本、“使用的软件包”和仓库 README，核对型号、传感器、计算平台及真机或仿真环境。

例如，[TIAGo Webots](https://hub.robonix.ai/package/robonix.robot.pal_robotics.tiago_webots) 是仿真配置；同名真机需要自己的适配。目录中的软件包链接可以继续查看具体功能和依赖。

<details>
<summary>查看机器人条目与安装确认</summary>

![Hub 中的机器人条目搜索结果](/img/hub/hub-robot-catalog-detail.png)

![机器人条目的说明、版本和使用的软件包](/img/hub/hub-robot-package.png)

*先看条目的型号和运行方式，再确认安装。*

</details>

![Hub 机器人目录：选择分类并搜索型号](/img/hub/robot-catalog.png)

*在 Hub [搜索 TIAGo](https://hub.robonix.ai/discover?kind=robot&q=tiago)的结果。*

## 在 Console 安装

1. [安装并登录 Console](install.md)，进入“目录 → 机器人”，找到同一条目。
2. 点“安装到这台机器人”，核对确认框中的内容和目录，再确认。
3. 等待下载完成，页面进入“配置”，并生成第一个配置版本。

![Console 机器人目录中的整机安装按钮](/img/hub/console-install-robot.png)

*截图中的“安装到本机”（1），在当前界面叫“安装到这台机器人”。*

![确认整机配置安装内容](/img/hub/console-install-confirm.png)

*确认框会列出将下载的清单、本机软件包、配置文件和仿真脚本。*

整机自带的本机软件包、配置文件和仿真脚本会一起下载。当前部署为空时放入其中；已有配置时，会新建部署并切换过去。远程软件包随后在“更新”页下载、构建。

Hub 网站用于查找和阅读；安装操作在机器人自己的 Console 中完成。

## 按需查找和收藏功能

找硬件驱动时看[原语包](https://hub.robonix.ai/discover/primitive)，找功能时看[服务包](https://hub.robonix.ai/discover/service)或[技能包](https://hub.robonix.ai/discover/skill)。在详情页阅读说明、依赖；需要接口细节时，点能力树查看定义。

<details>
<summary>查看软件包能力树示例</summary>

![软件包详情页中的能力树和接口说明](/img/hub/package-capabilities.png)

*点能力树中的节点，查看该能力的用途和定义。是否适用，仍需核对软件包的说明与依赖。*

能力详情会显示传输方式、版本、接口文件和定义方，并按数据流向列出输入、输出或发布/订阅消息。字段包含类型、名称和注释；字段类型如果还是另一条消息，可以继续点开查看。需要精确接入时，点“查看源文件”回到能力约定和接口文件原文。

![能力约定的字段、传输方式和接口定义](/img/hub/hub-capability-detail.png)

</details>

## 需要程序读取时使用 API

Hub Cloud 提供只读 REST API，地址前缀是 `https://hub.robonix.ai/api/v1`。软件包目录、软件包详情、统计数据和能力约定可以直接读取；账户信息、收藏和机器人信息需要个人访问令牌。

令牌在 Hub 个人主页的“API”区域生成，只显示一次，有效期 90 天，也可以随时吊销。请求时使用 `Authorization: Bearer <token>`；不要把令牌写进公开仓库或分享链接。

登录后可“收藏”，在 Console 和 [Hub 个人主页](https://hub.robonix.ai/profile)继续查看。添加功能时，在 Console 中点“添加到这台机器人”，再[检查参数并保存](configure.md)。

## 没找到合适的配置

- 已有部署仓库：按 README 准备，在“设置”登记已有目录，见[管理多套部署](deployments.md)。
- 已有本机软件包但没有清单：先[新建空白部署](deployments.md#新建空白部署)，再逐项添加。
- 只想增加功能：浏览 [服务包](https://hub.robonix.ai/discover/service)或[技能包](https://hub.robonix.ai/discover/skill)，按[添加软件包](configure.md#添加软件包)操作。
- 需要适配新机器人：进入[开发与适配](../development/robot-support.md)。

下一步：[修改参数](configure.md)，然后[构建并启动](run.md)。
