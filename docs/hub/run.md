---
last_update:
  date: 2026-10-15
---

# 构建并启动机器人

完成[配置并保存](configure.md)后，依次构建软件包、准备运行环境、启动 Robonix。整机需要的驱动、设备权限和环境脚本，以 [Hub 机器人条目](https://hub.robonix.ai/discover/robot)的 README 为准。

真机首次运行前，按[本体接入指南](../integration-guide/vendor-onboarding.md)完成停止行为、限速和急停检查，清空测试区域。

## 构建所需软件包

打开“更新”，点“更新全部软件包”。Console 会拉取代码并逐个构建；随整机安装的包显示“本地目录”，尚未下载的远程包显示“未下载”。

上方任务日志会显示进度与结果。构建成功后继续；失败时先查看出错的软件包和原因。确认缓存损坏时，点“清理缓存”再重新构建。

<details>
<summary>查看软件包列表示例</summary>

![更新页中的软件包列表、来源与构建状态](/img/hub/console-package-list.png)

*在“更新”页核对软件包来源、版本和构建状态。*

</details>

## 仿真先启动环境

使用 TIAGo Webots 时，在启动 Robonix 前先启动仿真。将 `DEPLOYMENT_DIR` 换成“设置”中显示的部署目录，在机器人主机的终端执行：

```bash
cd "DEPLOYMENT_DIR"
bash sim/start.sh
```

保持终端运行，等待仿真和传感器就绪。其他仿真按整机 README 操作；完整示例见[运行 TIAGo 仿真](../getting-started/simulation.md)。真机完成自己的驱动准备后，直接进入下一步。

## 启动 Robonix

在“概览”核对当前部署，点“启动”。正常时状态依次变为“启动中”“运行中”，按钮变为“停止”。失败时，页面给出 `rbnx` 报告的原因。

![机器人运行状态和 Client 所需的地址与 Atlas 端口](/img/hub/console-running.png)

*确认“运行中”（1）；停止按钮为（2）。连接 Client 时，复制本机显示的地址（3）和 Atlas 端口（4）。*

同一台机器人一次只能运行一套部署。另一套正在运行时，页面显示它的名称，可点“停止它”后再启动当前部署。“开机自启”同样只能设置一套。

状态变为“运行中”后，使用概览中的机器人地址和 Atlas 端口[安装并连接 Client](../getting-started/client.md)。

## 查看日志

点“查看运行日志”或“日志”，选择要检查的那次运行。每次启动对应一条记录，默认保留最近 10 次。

![选择运行记录并筛选 rbnx 日志](/img/hub/console-logs.png)

*选择运行记录（1）和日志标签（2）；用关键词筛选（3），“跟随最新”（4）可自动滚动。*

| 想检查什么 | 看哪里 |
|---|---|
| 下载、构建失败 | “更新”页的任务日志 |
| 启动过程 | “rbnx 输出” |
| 某项功能异常 | 对应组件、原语、服务或技能的标签 |

用关键词筛选日志；“跟随最新”会随新输出滚动。内容较长时可“显示全部”或“下载完整日志”。

## 停止运行

结束任务后，在“概览”点“停止”。仿真环境按整机说明另行结束；Client 的取消操作见[第一条任务](../getting-started/first-task.md#调整或结束任务)。真机出现危险时使用物理急停。

下一步：[安装与使用 Client](../getting-started/client.md)，再[完成第一条任务](../getting-started/first-task.md)。
