---
last_update:
  date: 2026-10-15
---

# 运行 TIAGo 仿真

没有真机，也能在电脑里运行 TIAGo 仿真：先在 Console 启动，再用 Client 完成一次相机任务。

## 准备电脑

先查看 [Hub 中的 TIAGo 配置](https://hub.robonix.ai/package/robonix.robot.pal_robotics.tiago_webots)及其 README。[原 Webots 教程](quickstart.md)记录的完整验收路径使用 Ubuntu 22.04 或 Debian 13、`x86_64`、NVIDIA 图形环境和 Docker；按[主机检查](quickstart.md#1-检查主机)准备工具与设备权限。

这些条件属于原书的测试基线，目录整机版本需另按 README 核对。还需准备模型服务的地址、密钥和模型名；相机任务需要模型支持图像。首次构建会下载源码、镜像和仿真资源。

## 安装配置并构建

1. 在仿真电脑上[安装 Console 并登录](../hub/install.md)。
2. 打开 Console“目录”，选“机器人”，搜索 `tiago_webots`；核对它与 [Hub 条目](https://hub.robonix.ai/package/robonix.robot.pal_robotics.tiago_webots)是同一份配置，点安装。
3. 在“配置”补齐提示缺少的变量，修改参数后保存为新版本。
4. 在“更新”点“更新全部软件包”，等构建成功。

## 启动仿真与 Robonix

在“设置”查看当前部署路径。将 `DEPLOYMENT_DIR` 换为该目录的绝对路径，在仿真电脑终端运行：

```bash
cd "DEPLOYMENT_DIR"
bash sim/start.sh
```

保留终端，等待 Webots 窗口和传感器就绪，再到 Console“概览”点“启动”。启动失败时，看[运行日志](../hub/run.md#查看日志)。仿真脚本需单独执行；额外参数以该配置 README 为准。

## 连接 Client 并完成任务

按[第一条任务](first-task.md)连接 Client，让机器人用头部相机拍照并描述前方。回复应与仿真画面相符。

结束时，先在 Client 取消任务，再到 Console 停止 Robonix，最后按仓库说明结束仿真。接下来可以[创建地图](../tasks/mapping.md)，或浏览 [Hub 的其他仿真配置](https://hub.robonix.ai/discover?kind=robot&tag=simulation)。

需要固定源码部署或排查图形环境时，查看 [Webots 命令行指南](quickstart.md)。
