---
last_update:
  date: 2026-10-15
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 安装与使用 Client

[Robonix Client](https://github.com/syswonder/robonix-client) 是你的机器人对话窗口：发送任务、查看进度，也可以使用电脑的麦克风和扬声器。它安装在操作者电脑上，支持 Linux、macOS 和 Windows。

![Client：左侧会话，中间对话，右侧当前目标与执行记录](/img/ui/cl-chat-live.webp)

<span id="1-准备机器人端"></span>

## 准备机器人端

先按 [Hub 机器人目录](https://hub.robonix.ai/discover/robot)中的配置[启动 Robonix](../hub/run.md)。在 Console“概览 → 连接 robonix-client”复制机器人地址和 Atlas 端口。

从另一台电脑连接时，若概览提示组件只监听本机，点“允许其他机器连接”并确认。Console 会修改监听地址、保存为新版本，重新启动后生效。只在可信局域网或 Tailscale 中开放。

<details>
<summary>手动配置连接和音频桥</summary>

Client 通过 Atlas 找到 Liaison、Executor 等组件，再直接连接它们。机器人清单至少应让下列端点可达；使用健康页还需 Soma、Vitals 可达。Pilot 可以只监听机器人本机。

```yaml
system:
  atlas:
    listen: 0.0.0.0:50051
  executor:
    listen: 0.0.0.0:50061
  liaison:
    listen: 0.0.0.0:50081
```

使用操作者电脑的音频设备时，机器人需有 [audio_client_bridge](https://hub.robonix.ai/package/robonix.primitive.audio.client_bridge)。已有整机配置可能自带；没有时按[添加软件包](../hub/configure.md#添加软件包)操作：

```yaml
primitive:
  - name: audio_client_bridge
    url: https://github.com/syswonder/primitive-audio-client-bridge-rbnx
    branch: main
    config:
      transport: reverse
      listen_host: 0.0.0.0
      listen_port: 60002
```

Client 会从 Atlas 发现音频桥的地址，无需另填端口。以上端点不要直接暴露到公网。

</details>

<span id="2-安装"></span>

## 安装 Client

需要 Python 3.11 或更高版本。在操作者电脑上操作：

<Tabs groupId="client-platform">
<TabItem value="linux" label="Linux">

```bash
sudo apt update
sudo apt install -y libportaudio2 portaudio19-dev python3-venv
git clone https://github.com/syswonder/robonix-client.git
cd robonix-client
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -e '.[audio]'
```

</TabItem>
<TabItem value="macos" label="macOS">

先安装 Homebrew，再执行：

```bash
brew install portaudio
git clone https://github.com/syswonder/robonix-client.git
cd robonix-client
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -e '.[audio]'
```

</TabItem>
<TabItem value="windows" label="Windows">

在 PowerShell 中执行：

```powershell
git clone https://github.com/syswonder/robonix-client.git
cd robonix-client
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -e '.[audio]'
```

`sounddevice` 通常自带 PortAudio DLL。仍找不到音频设备时，[PyAudio 预编译版本](https://github.com/elibroftw/pyaudio_portaudio/releases)可供排查。

</TabItem>
</Tabs>

<span id="3-启动并连接"></span>

## 启动并连接

保持虚拟环境已激活，将 `ROBOT_HOST` 换成 Console 给出的机器人地址；同机运行可用 `127.0.0.1`：

```bash
robonix-client --robot-host ROBOT_HOST
```

打开 [http://127.0.0.1:7860/](http://127.0.0.1:7860/)，填写 **Robot Host**、**Atlas Port**，点 **Connect**。**Liaison Endpoint** 通常留空，让 Client 自动发现。

`--robot-host` 是机器人地址；`--host` 是 Client 网页的本机监听地址，通常保留默认值。

连接后可先问“目前有哪些能力？”，再按[第一条任务](first-task.md)试试相机。

<span id="4-使用页面"></span>

## 使用 Client 的四个页面

Chat 用于任务，Vitals 用于健康状态，Audio 用于声音设备，Settings 用于连接与录音设置。连接完成后，先从 Chat 开始。

### 聊天（Chat）

输入任务，点 **Send**。任务执行中再发送一句，是调整当前任务，消息会标记 `ADDED TO RUNNING TASK`。红色 **ABORT ALL TASKS** 用来取消正在执行的任务。

![执行中追加要求，会加入同一任务](/img/ui/cl-chat-multi.webp)

**New session** 开新会话，各会话有独立的任务上下文；悬停历史会话可 **Rename** 或 **Delete**。**Clear 会删除全部历史会话并新建空会话**；只删一条时，使用该会话的 Delete。

右侧用来查看机器人正在做什么：

| 面板 | 看什么 |
|---|---|
| **Current Goal** | 当前目标和调用的能力；`EXECUTOR VERIFIED` 表示本次调用已校验 |
| **RTDL Forest / Active RTDL** | 当前执行方案，节点颜色表示等待、执行、成功或失败 |
| **Execution history** | 已结束的执行记录 |
| **Node detail** | 点节点，查看参数、返回结果和耗时 |
| **Event Log** | 带时间的状态记录，帮助判断卡在哪一步 |

一个任务可能分成多轮方案。当前方案结束后，其树会消失；回看时使用 **Execution history**。`DONE` 和最终回复用于检查任务结果，仍需结合实际现场确认。

### 健康状态（Vitals）

查看电量、温度、关节等硬件状态。点击左侧 **Body** 部件树，中间模型会高亮，右侧显示详情；**Alerts** 打开告警。任务进度看 Chat。

![Vitals：部件树、机器人模型与健康详情](/img/ui/cl-vitals.webp)

<details>
<summary>健康指示与数据来源</summary>

顶栏显示硬件、软件健康计数，电池和更新时间，以及 Soma、Hardware、Modules、Atlas 的连接状态。底部 **Modules** 和 **Providers** 列出模块与能力提供方；`SELF_REPORTED` 表示自行上报，TTL 是状态有效期。部件详情显示身份、健康和原始信号；`No direct health signals` 表示没有直接上报的信号。

</details>

### 音频（Audio）

![Audio：选择声音从哪里来、播放到哪里](/img/ui/cl-audio.webp)

Client 启动时会自动启动本机音频服务。按以下顺序检查：

1. **Audio Device Server** 仍显示 offline 时，点 **Start Audio**。
2. 点 **Refresh Route**。输入、输出选 `audio_client_bridge` 使用这台电脑的设备；选 `audio_driver` 使用机器人的设备。
3. 选择麦克风和扬声器，点 **Apply Route**。
4. 点 **Test Microphone** 应看到输入电平，点 **Test Speaker** 应听到声音；两项正常后，再按 `F2` 或录音按钮说话。

设备列表不全时点 **Refresh Devices**。免按键语音需另外打开 **Hands-free**。启用声纹访问控制时，在 **Voiceprint → Enroll Voice** 注册当前用户。

打不开设备时看 **Audio Log**；桥连接异常时看 **Client Bridge Diagnostics**。

### 设置（Settings）

![Settings：连接信息与录音设置](/img/ui/cl-settings.webp)

可修改 **Robot Host**、**Atlas Port**、**Liaison Endpoint**、**User ID** 和 **Voice Record Limit (s)**。点 **Save Settings** 保存；改机器人地址后重新 Connect。

设置存于 `~/.config/robonix-client/settings.yaml`，浏览器也保留一份。User Name 在 Audio 页的 Voiceprint 区域设置。

<span id="5-最小验收"></span>

## 检查连接与交互

按以下顺序检查：

1. Connect 后状态在线。
2. 发送“目前有哪些能力？”并收到文本回复；有相机和图像理解能力时，再问“你能看到什么？”。
3. 发送持续几秒的任务，在执行中追加要求，确认它成为当前任务的调整指令。
4. 打开 **Active RTDL**，确认显示的运行节点与 Executor 的执行状态一致。
5. 点 **ABORT ALL TASKS**，按钮短暂显示 **Aborting**，随后任务结束、界面回到空闲。
6. 使用音频桥时，完成麦克风、扬声器测试，再完成一次 F2 语音任务。

## 排错

| 现象 | 先检查 |
|---|---|
| 一直离线 | 机器人是否运行，地址是否正确；Atlas 和发现的组件是否可达 |
| 音频设备为空 | 系统麦克风权限、PortAudio、Refresh Devices |
| 音频桥不可用 | 是否启用桥，Atlas 是否公布 `robonix/primitive/audio/bridge_info`；按公布的地址检查连接 |
| 文本可用、语音失败 | 机器人 Speech 是否正常，Liaison 能否发现音频与语音能力；查看对应日志 |

Linux / macOS 可用 `nc -vz ROBOT_HOST 50051` 检查默认 Atlas 端口；将地址与端口换成 Console 显示的实际值。更多现象见[问题排查](../troubleshooting/index.md)。

下一步：按[第一条任务](first-task.md)完成一次相机观察；已经验证通过后，可继续[机器人任务](../tasks/index.md)。

<details>
<summary>Client 版本</summary>

安装示例对应 Client 源码版本 [`739f8499`](https://github.com/syswonder/robonix-client/tree/739f8499)。

</details>
