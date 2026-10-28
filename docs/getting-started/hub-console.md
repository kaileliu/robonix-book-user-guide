---
title: Hub 与 Console 使用指南
description: 按是否有实体机器人选择仿真或本体使用路线，以 Ranger 仿真和云深处 Lite3 为例，完成安装、配置、Client 交互和日常管理。
toc_max_heading_level: 3
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './hub-console.module.css';

<div className={styles.guide}>

# Hub 与 Console 使用指南

本页介绍 Robonix 的两条使用路线：**仿真路线**和**本体路线**。没有实体机器人时，从电脑中的仿真环境开始；已有实体机器人时，在完成适配的本体上安装并运行。选择适合自己条件的路线，完成“安装配置 → 启动 → 连接 → 执行任务”，再按需使用建图、导航、配置备份等功能。

**仿真路线**：[没有实体机器人：运行仿真](#没有实体机器人运行仿真)。完成后，仿真环境与 Robonix 正常运行，Client 能连接仿真机器人并发送任务。

**本体路线**：[有实体机器人：安装并使用](#有实体机器人安装并使用)。完成后，机器人本体和所需组件正常运行，Client 能连接实体机器人并进行交互。

下面分别以**松灵 Ranger Mini V3 的 MuJoCo 仿真**和**云深处 Lite3 四足机器人**展示操作。它们是两条路线的示例；使用其他仿真或本体时，按对应整机配置准备环境、驱动和设备。两条路线都通过 Hub 选择配置，在 Console 检查和管理配置，再用 Client 下达任务；具体构建与启动方式以所用整机说明为准。

| 工具 | 用途与位置 |
|---|---|
| [Hub](https://hub.robonix.ai/discover) | 云端网站：查找整机配置和功能包，保存与分享配置备份 |
| Console | 安装在机器人主机或仿真电脑：管理配置、更新、运行和日志，通过浏览器操作 |
| Client | 安装在操作者电脑：与机器人对话、下达任务、查看进度和结果，可与 Console 共用一台电脑 |

**第一次使用，按所选路线从头操作。** 连接成功后，再按需使用[建图、导航与场景](#运行之后建图导航与场景)；后续改配置、恢复历史和备份，查阅[日常管理](#日常管理部署历史与云端备份)。

## 没有实体机器人：运行仿真

仿真路线通过电脑中的虚拟机器人体验 Robonix。以下以**松灵 Ranger Mini V3 移动机器人仿真**为例：带 Piper 机械臂，在 MuJoCo 中运行。Console、仿真和 Client 可以安装在同一台电脑上。按示例完成后，你应能看到仿真房间和机器人，并通过 Client 连接、发送文本任务。

### 准备运行仿真的电脑

本示例使用 [Ranger Mini V3 MuJoCo 整机配置](https://hub.robonix.ai/package/robonix.robot.agilex.ranger_with_piper_mujoco)的 **native 后端**。软件包 README 的端到端测试环境是 **Ubuntu 22.04、x86_64、ROS 2 Humble 和 Docker**；这不是任意操作系统或硬件的兼容保证。准备以下条件：

- Docker Engine 与 Compose 插件，当前用户能够直接运行 Docker。
- Node.js 20 或更高版本、npm、Python 3、Git 和 curl。
- 可用的 X11 / WSLg 桌面会话与硬件 OpenGL；native 窗口及相机渲染需要 GPU 支持，软件渲染不属于本示例的启动方式。
- 可访问 GitHub、npm 和容器镜像源的网络，构建期间保持连接畅通。
- 可用的 Hub 账户，以及支持图像理解和工具调用的模型服务地址、密钥、模型名。

先在终端检查：

```bash
git --version
curl --version
node --version
npm --version
python3 --version
docker ps
docker compose version
```

各命令应正常退出，Node.js 主版本不低于 20，Compose 为 v2。`docker ps` 报权限错误时，先处理 Docker 的当前用户权限，再继续；不要用 `sudo` 启动整个安装或仿真流程。

[Webots 命令行教程](quickstart.md)介绍另一种仿真实现，其环境要求和启动脚本与本示例不同。下面使用 Ranger MuJoCo 软件包自己的脚本。

### 在仿真电脑安装 Console

#### 准备 Hub 账户

[准备 Hub 账户](https://hub.robonix.ai/auth/login?flow=f30d0183-c9b3-48db-8ee5-f5d0616abb10)。打开账户页面后，没有账户时点底部“注册”，按页面提示完成注册与协议确认；已有账户可直接登录。收到邀请时也可使用邀请链接完成激活。开启两步验证时准备验证码。

#### 执行安装命令

在仿真电脑终端，以平时使用电脑的普通用户执行：

```bash
curl -fsSL https://hub.robonix.ai/install | bash
```

不要使用 root，也不要在命令前加 `sudo`。安装器会检查主机、准备依赖、校验发布文件并显示服务条款和隐私政策；阅读后按提示接受。补齐系统依赖时，可能单独询问 sudo 密码。

#### 等待安装完成

等待 Console 安装。已有 `rbnx` 时安装器使用现有安装；没有时会下载并构建 Robonix。首次构建可能较久。若安装器报告 Robonix 构建失败，先处理报错；Console 页面能打开不代表 Robonix 已安装成功。

<figure>
  <img src={useBaseUrl('/img/hub/console-install-progress.png')} alt="Console 安装器显示检查、下载和服务配置进度" width="1251" height="1026" loading="lazy" />
  <figcaption>等待终端给出安装结果和管理页面地址；失败时保留报错和构建日志。</figcaption>
</figure>

#### 设置模型服务

按提示填写模型服务的三个字段。密钥输入时不会直接显示；不要把密钥写进公开仓库或截图。

| 字段 | 变量 | 填写内容 |
|---|---|---|
| VLM 终端 URL | `VLM_BASE_URL` | 模型服务的 Chat Completions 兼容接口地址 |
| VLM KEY | `VLM_API_KEY` | 该服务的访问密钥 |
| VLM 模型 | `VLM_MODEL` | 支持图像理解和工具调用的模型名 |

安装时跳过了这些字段，或需要修改时，打开 Console“设置 → 机器人环境变量”，添加这三项并保存。本机已有值时，安装器会询问是否保留，核对后选择。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-model-settings.png')} alt="Console 设置页中的模型地址、密钥和模型名" width="1736" height="739" loading="lazy" />
  <figcaption>在“设置 → 机器人环境变量”填写①中的三项，模型地址与模型名以你使用的服务为准。</figcaption>
</figure>

#### 登录本机 Console

安装结束后，在同一台电脑浏览器打开 [http://127.0.0.1:4880](http://127.0.0.1:4880)。填写 Hub 邮箱和密码，点“登录”；有两步验证时继续输入验证码。若提示尚未同意协议，先在 Hub 完成确认，再返回登录。

<figure className={styles.compactFigure}>
  <img src={useBaseUrl('/img/hub/hub-account-login-register.png')} alt="Hub 账户页面中的邮箱密码登录与注册入口" width="453" height="484" loading="lazy" />
  <figcaption>图为 Hub 账户登录与注册入口；Console 使用同一 Hub 账户。完成本机 Console 登录后，应能进入概览和配置页面。</figcaption>
</figure>

### 安装 Ranger 配置并完成构建

#### 选择 Ranger 仿真配置

在本机 Console 打开“目录 → 机器人”，搜索 `Ranger`，找到“松灵 Ranger Mini V3 移动机器人”的**仿真 / MuJoCo**条目。核对包名为 `robonix.robot.agilex.ranger_with_piper_mujoco`，不要选择真机包。

#### 确认并安装配置

查看条目的 README 和依赖，点下图①的“安装”，在确认框中核对内容和安装位置后确认。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-mujoco-install.png')} alt="松灵 Ranger Mini V3 MuJoCo 仿真条目及安装按钮" width="1410" height="616" loading="lazy" />
  <figcaption>确认“仿真”和 MuJoCo 标记，点①处安装按钮。图片中的安装次数会变化。</figcaption>
</figure>

#### 检查 Robonix 安装

安装配置后，在仿真电脑终端确认 Robonix 已正确安装：

```bash
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
rbnx --version
rbnx path root
```

`rbnx --version` 显示当前运行的 Robonix 命令行程序版本，用来确认 `rbnx` 可执行；`rbnx path root` 显示登记的 Robonix 源码根目录，整机脚本会据此查找所需源码和 API。两条命令都应正常退出，返回的目录应实际存在。它们检查的是 Robonix 安装，不代表整机软件包已经构建完成。找不到命令或源码时，先处理安装报错，再继续。

#### 更新并构建软件包

回到 Console，打开左侧①“更新”，点击②“更新全部软件包”。保持网络畅通，等待软件下载和构建完成。首次可预留**约 40 分钟**，实际耗时取决于网络、硬件和已有缓存。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-update-packages.png')} alt="Console 更新页中的 Ranger 软件包列表和更新全部软件包按钮" width="1763" height="840" loading="lazy" />
  <figcaption>①进入更新页，②开始更新全部软件包。</figcaption>
</figure>

成功时，任务显示“已完成”，构建汇总中的失败数为 `0`。核对本次任务的日志，不要只看按钮已恢复可点击；有失败时先处理日志中第一个报错。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-build-complete.png')} alt="Ranger 软件包更新任务已完成，构建汇总显示失败数为零" width="1763" height="718" loading="lazy" />
  <figcaption>图中本次任务为“已完成”，汇总为 `Failed: 0`；软件包数量会随配置变化。</figcaption>
</figure>

#### 手动启动 MuJoCo

**手动启动 MuJoCo 仿真。** 这一步仅仿真需要：Robonix 不负责管理仿真进程的生命周期，构建完成后仍需单独启动仿真。

在 Console“设置”的部署列表中查看当前部署的路径。部署目录是放置 `robonix_manifest.yaml`、`primitives/`、`sim/` 等文件的目录；列表若显示清单文件路径，取其所在文件夹。默认部署通常位于 Console 数据目录下的 `deployments/default`，即 `~/.local/share/robonix-console/deployments/default`；设置了其他数据目录或新建部署时，以页面实际路径为准。

将 `DEPLOYMENT_DIR` 替换为上述部署目录的绝对路径，在仿真电脑终端执行：

```bash
cd "DEPLOYMENT_DIR"
bash sim/start.sh --backend native
```

本示例使用 native 后端，需要可用的 X11 / WSLg 图形会话和硬件 OpenGL。保持终端打开，等待 MuJoCo 窗口显示场景；下面是 `scenesmith_house_187` 场景的启动画面。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-native-viewer.png')} alt="MuJoCo native 窗口显示 Ranger 仿真房间中的沙发与茶几" width="1213" height="706" loading="lazy" />
  <figcaption>仿真窗口已出现。此时只启动了仿真，下一步才启动 Robonix。</figcaption>
</figure>

#### 在 Console 启动 Robonix

切换回 Console“概览”，核对当前是刚安装的 Ranger 仿真部署，点“启动”，等待运行状态更新。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-console-start.png')} alt="Console 概览页中启动 Ranger 仿真部署的按钮" width="1767" height="749" loading="lazy" />
  <figcaption>先确认当前部署，再点“启动”。连接 Client 时使用本机显示的地址和端口。</figcaption>
</figure>

#### 查看本次启动日志

在左侧①“日志”中选择②本次运行记录，查看 `rbnx 输出` 和各组件日志，确认启动过程与原语注册情况。出现失败或长期停留在等待注册时，先查看对应组件日志，确认仿真已启动。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-console-startup-log.png')} alt="Console 日志页显示 Ranger 本次运行及原语注册日志" width="1761" height="833" loading="lazy" />
  <figcaption>①进入日志页，②选择本次运行；“运行中”还需结合后续组件日志确认，不能只看启动按钮。</figcaption>
</figure>

### 安装 Client 并连接仿真机器人

[Robonix Client](https://github.com/syswonder/robonix-client) 提供机器人对话界面。先准备 Python **3.11 或更高版本**，在操作者电脑用于保存源码的目录打开终端；下面以 Linux / macOS 为例：

```bash
git clone https://github.com/syswonder/robonix-client.git
cd robonix-client
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
robonix-client --robot-host 127.0.0.1
```

`python3` 应指向符合版本要求的解释器。Windows 安装与可选音频依赖按仓库 README 操作；Ranger 当前仿真包未配置音频，本示例先用文本交互。

打开 [http://127.0.0.1:7860](http://127.0.0.1:7860)，将 **Robot Host** 填为 Robonix 所在电脑的地址，同机运行使用 `127.0.0.1`；**Atlas Port** 填 Console 概览显示的端口，**Liaison Endpoint** 通常留空，点 **Connect** 等待在线。然后在 Chat 中输入一条简单文本任务并发送，查看响应。

Client 在另一台电脑时，按 Console 的提示允许其他机器连接，保存并重启 Robonix，确保 Atlas 和发现的组件可达。更多平台安装与连接说明见 [Client README](https://github.com/syswonder/robonix-client#install-guide)。

### 观看安装与仿真部署演示

下面的视频展示 Ranger Mini V3 与 Piper 的 Console 安装、整机部署和交互过程。跟随操作时使用本机的路径、模型设置和地址。

<video controls preload="none" style={{width: '100%'}} aria-label="Ranger Mini V3 MuJoCo 的 Console 安装与仿真部署演示">
  <source src={useBaseUrl('/video/simulation-start-demo.mp4')} type="video/mp4" />
  浏览器不支持视频播放时，可下载视频后观看。
</video>

[下载演示视频](/video/simulation-start-demo.mp4)

## 有实体机器人：安装并使用

本体路线在已适配的实体机器人上运行 Robonix。以下以**云深处 Lite3 四足机器人**为例，使用 [Lite3 整机配置](https://hub.robonix.ai/package/robonix.robot.deep_robotics.lite3)。Console 和 Robonix 安装在机器人计算主机上，Client 安装在操作者电脑上。按示例完成后，应能连接机器人、查看状态并进行文本交互。其他本体按各自整机说明核对硬件、依赖和启动方式。

### 准备 Lite3 与机器人主机

当前整机配置面向 Jetson 原生运行，使用 ROS 2 Humble，配套 **Livox MID-360 雷达和 Orbbec Gemini 330 系列 RGB-D 相机**。先核对实际设备与 [整机 README](https://github.com/syswonder/robot-deep_robotics-lite3)；Console 安装成功不会替代驱动、ROS 依赖和传感器标定。

- 按厂家说明完成上电、联网、遥控和急停检查，预留平整、空旷的测试区域。
- 确认机器人主机能够访问 Lite3 运动主机、雷达和相机，并能下载 GitHub 软件包及其依赖。
- 准备 ROS 2 Humble 和各原语所需的系统依赖，核对 `/opt/ros/humble/setup.bash` 存在。
- 准备 Hub 账户、模型地址、密钥和模型名。先使用文本交互；启用语音还需单独配置语音服务。

这份 Lite3 配置没有机械臂和夹爪，不提供抓取、搬运等操作。第一次启动先检查状态，完成定位和运动验证后再尝试导航。

### 在机器人主机安装 Console

在机器人主机的终端中，以日常使用的普通用户执行，不要在整条命令前加 `sudo`：

```bash
curl -fsSL https://hub.robonix.ai/install | bash
```

按提示阅读并接受协议、安装依赖和 Robonix，再填写 `VLM_BASE_URL`、`VLM_API_KEY`、`VLM_MODEL`。安装时跳过了模型设置，可以稍后在“设置 → 机器人环境变量”补填。

<figure>
  <img src={useBaseUrl('/img/hub/ranger-model-settings.png')} alt="Console 设置页中的模型地址、密钥和模型名" width="1736" height="739" loading="lazy" />
  <figcaption>仿真和真机使用同一组模型设置，填写自己的服务地址、密钥和模型名。</figcaption>
</figure>

在机器人主机终端检查安装：

```bash
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
rbnx --version
rbnx path root
```

两条命令应正常退出，分别显示程序版本和 Robonix 源码根目录。

本机浏览器打开 [http://127.0.0.1:4880](http://127.0.0.1:4880)，使用 Hub 账户登录。从操作者电脑管理时，将 `ROBOT_USER` 替换为机器人主机的用户名、`ROBOT_HOST` 替换为其实际地址，建立隧道：

```bash
ssh -N -L 4880:127.0.0.1:4880 ROBOT_USER@ROBOT_HOST
```

保持终端打开，在操作者电脑访问同一本地地址。这个隧道只转发 Console 页面，Client 的连接需另外保证组件端口可达。

### 安装 Lite3 配置并检查本机参数

在机器人 Console 的“目录 → 机器人”中搜索 `Lite3`，打开“云深处 Lite3 四足机器人”，核对包名 **`robonix.robot.deep_robotics.lite3`** 和真机说明，再点“安装”并确认目标部署。

<figure>
  <img src={useBaseUrl('/img/hub/console-install-confirm.png')} alt="Console 整机配置安装确认对话框" width="2048" height="1600" loading="lazy" />
  <figcaption>安装确认界面示意。这里应显示 Lite3 的安装内容和目标目录，以实际页面为准。</figcaption>
</figure>

安装完成后，进入“配置”逐项核对：

| 配置位置 | 要检查的内容 |
|---|---|
| `lite3_quadruped` | `target_ip` 为实际运动主机地址；核对 `target_port`、`local_port`、`app_port`，避免其他控制程序占用反馈端口 |
| `mid360_lidar` | `lidar_ip` 与 `host_ip` 分别对应实际雷达和接收数据的主机网卡 |
| `orbbec_camera` | 相机型号、彩色图与深度图配置匹配实际设备 |
| 本体和导航配置 | `soma.yaml`、`urdf/Lite3.urdf` 的安装外参与实际标定一致；保留 Lite3 自己的导航参数和行为树 |
| `mapping` | 默认使用 RTAB-Map，示例设为定位模式并引用 `3f_full_lite3`；这张地图需要在本机实际存在 |

**第一次建图时**，将 `mapping.config.map_mode` 改为 `mapping`，不要尝试加载仓库中的示例地图 ID。等[保存自己的地图](#创建并保存室内地图)后，再配置 `map_mode: localization`、自己的 `map_id` 和相同的 `SCENE_MAP_ID`。

<figure>
  <img src={useBaseUrl('/img/hub/console-configuration.png')} alt="Console 配置页的系统组件、软件包和参数分组" width="1008" height="805" loading="lazy" />
  <figcaption>配置页操作示意；按上表核对 Lite3 的实际条目，不照抄截图中的机器人参数。</figcaption>
</figure>

修改完成后点“保存为新版本”，填写说明并检查差异。记录“设置”中本次 Lite3 部署目录的绝对路径，后续命令都在该目录运行。

### 准备凭据并构建 Lite3 软件包

Lite3 仓库提供 `build.sh`、`start.sh` 和 `stop.sh`。其中启动脚本还处理 ROS 环境、通信进程和启动前清理，本示例使用这组脚本，不将 Console“启动”按钮视为它的完整替代。

将 `DEPLOYMENT_DIR` 替换为上一步记录的 **Lite3 部署目录**，在机器人主机终端进入该目录。首次创建本机配置时执行：

```bash
cd "DEPLOYMENT_DIR"
cp -n .env.example .env
nano .env
```

`cp -n` 保留已有 `.env`；`nano` 可换为你熟悉的编辑器。填入模型的三项实际值。脚本直接运行时会读取这里的配置，不应假定 Console 中保存的本机变量会自动进入这个终端。`.env` 不提交到仓库，也不随配置备份分享。

当前清单启用了腾讯语音，保留它时还需填写 `TENCENT_ASR_APPID`、`TENCENTCLOUD_SECRET_ID`、`TENCENTCLOUD_SECRET_KEY`；仅做文本测试时，可在 Console 停用 `speech` 服务并保存。不要留着启用的服务却缺少必填凭据。

核对 `.env` 中的 ROS 中间件设置：示例文件使用 Fast DDS，而清单的默认值是 Zenoh。按本机已安装的中间件，统一 `.env` 中的 `RMW_IMPLEMENTATION`、`ROBONIX_RMW_IMPLEMENTATION` 和清单环境变量中的 `RMW_IMPLEMENTATION`，例如选择 Fast DDS 时均设为 `rmw_fastrtps_cpp`，不能让各组件混用。

在同一目录构建：

```bash
bash build.sh
```

保持网络畅通，等待依赖下载和构建结束。检查构建汇总，确认失败数为 `0`；失败时保留日志并先处理第一个报错。构建耗时取决于主机、网络和缓存。

### 启动 Lite3 并检查日志

确认测试区域已清空、急停可用，机器人已按厂家要求做好运行准备，在同一部署目录执行：

```bash
bash start.sh
```

真机不需要启动 MuJoCo，也不运行 `sim/start.sh`。保持终端打开，查看启动输出和部署目录下 `rbnx-boot/logs/` 的组件日志；确认底盘、雷达、相机以及所需服务注册成功，再连接 Client。

<figure>
  <img src={useBaseUrl('/img/hub/console-logs.png')} alt="Console 日志页的运行记录和组件标签" width="1458" height="680" loading="lazy" />
  <figcaption>日志界面示意：Console 管理的运行可按记录和组件查看。上述脚本运行先以终端及部署目录中的日志为准，不假定会出现在同一条 Console 运行记录中。</figcaption>
</figure>

结束本次运行时，在同一部署目录的另一终端执行 `bash stop.sh`。它还会清理属于本部署的残留进程并检查 Lite3 反馈端口；不要同时从 Console 再启动一套部署。

### 安装 Client 并连接 Lite3

在操作者电脑准备 Python 3.11 或更高版本，打开保存源码的目录。以下以 Linux / macOS 的文本交互为例：

```bash
git clone https://github.com/syswonder/robonix-client.git
cd robonix-client
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
robonix-client --robot-host ROBOT_HOST
```

`ROBOT_HOST` 替换为**机器人计算主机**的实际地址，不是操作者电脑或 Lite3 运动主机的地址。Client 已安装时，只需激活原虚拟环境并运行最后一条命令。

在操作者电脑打开 [http://127.0.0.1:7860](http://127.0.0.1:7860)，核对 **Robot Host**，**Atlas Port** 默认 `50051`，**Liaison Endpoint** 留空，点 **Connect**。两台电脑之间需能访问 Atlas、Executor 和 Liaison；当前 Lite3 清单默认端口分别为 `50051`、`50061` 和 `50081`，仅在可信局域网或 Tailscale 网络中使用。

<figure>
  <img src={useBaseUrl('/img/hub/client-connected.png')} alt="Client 中的机器人地址、Atlas 端口和连接状态" width="2048" height="680" loading="lazy" />
  <figcaption>连接界面示意。用 Lite3 主机的实际地址替换截图地址，确认连接成功。</figcaption>
</figure>

先发“请列出当前可用能力，不要移动机器人”，检查响应；再在 **Vitals** 查看可用的硬件和模块状态。后续移动任务需先完成地图、定位与现场检查，不以模型回复代替实际状态。

需要语音时，按 [Client 安装说明](https://github.com/syswonder/robonix-client#install-guide)补装 `audio` 依赖和系统音频库，再在 **Audio** 将输入、输出提供方选为 `audio_client_bridge`。该部署的桥接端口为 `60002`，腾讯语音凭据也需已配置。

## 运行之后：建图、导航与场景

先完成所选使用路线，确认机器人与 Client 正常连接，再使用整机已有的功能。本页 Ranger 仿真和 Lite3 本体两个示例均配置了建图、导航与场景相关组件；其他整机需分别核对能力与依赖，启动模式和硬件参数以各自配置为准。**Console 用于管理部署，地图和场景在各服务自己的界面中操作。**

本节按书中的[建图与定位](../components/mapping.md)、[导航](../components/navigation.md)和[场景服务](../components/scene.md)指南整理；内测手册中的配置、运行和日志操作仍适用。

### 创建并保存室内地图

#### 选择建图模式

在 Console“配置”中展开 `mapping`，核对传感器提供方，首次建图使用 `map_mode: mapping`，保存后按所选路线重新启动。Lite3 示例默认是加载已有地图的定位模式，需要先修改；Ranger 同样应以当前清单为准。

建图模式从新的会话开始，不是续写某张已保存地图。开始前确认底盘、里程计和传感器正常；真机低速运行，清空通道并确认急停可用。

#### 打开地图界面

在机器人主机打开 [http://127.0.0.1:50107/user](http://127.0.0.1:50107/user)。这是场景服务的地图与标注页面，默认端口为 `50107`；没有启用场景服务时，使用[建图服务自己的界面](../components/mapping.md)。

从操作者电脑访问时，将 `ROBOT_USER`、`ROBOT_HOST` 替换为机器人主机用户名和地址，建立单独的隧道：

```bash
ssh -N -L 50107:127.0.0.1:50107 ROBOT_USER@ROBOT_HOST
```

保持终端打开，在操作者电脑访问上面的本地地址。Console 的 `4880` 隧道不会转发这里的页面；修改过服务端口时同步调整转发。

<figure>
  <img src={useBaseUrl('/img/ui/scene-user.webp')} alt="地图与标注页面中的地图 ID、保存和加载入口" width="1280" height="800" loading="lazy" />
  <figcaption>核对当前地图和运行模式；未保存的实时会话显示 `unsaved live`。</figcaption>
</figure>

#### 采集并保存地图

使用当前机器人已经验证的控制方式，低速走过要记录的区域，观察地图与现场是否相符。自主探索还需要探索技能及建图、导航依赖就绪，不能只凭建图服务自动完成；探索期间不叠加其他移动任务。

在 **Map ID** 填写新的地图 ID，例如 `office_3f_v1`，点 **Save current**，检查状态行的保存结果。保存的是当前地图快照；继续移动得到的新内容不会自动写回该快照。重新保存空间地图需使用新 ID。

#### 加载地图并确认定位

先保存需要保留的内容，再在地图列表点 **Load**。加载会替换当前会话并进入定位模式，等待地图及房间、对象恢复完成。

检查机器人位置与现场是否一致。明显错位时点 **Pose estimate**，按提示在地图上指定实际位置，等待定位稳定。不要在定位错误时继续导航。

下次直接以定位模式启动时，将 `mapping.config.map_mode` 设为 `localization`，`map_id` 设为刚保存的 ID，核对场景使用的地图 ID 一致后保存、重启。地图文件需确实保存在本机；云端配置备份不会携带它们。

### 在地图上指定导航目标

先完成地图加载与定位，确认 `nav2`、底盘里程计和雷达就绪。保留各整机自己的 Nav2 参数：Lite3 的四足参数不能直接换成 Ranger 的轮式参数。

在当前地图选取附近、可通行的目标位置，取得坐标 `x`、`y` 和朝向 `yaw`。前两者单位为米，朝向单位为弧度。通过 Client 描述目标，例如“导航到地图坐标 x=目标横坐标、y=目标纵坐标，最终朝向 yaw=目标朝向”，发送前将中文占位内容替换为实际数值。

查看任务与导航状态，并对照现场确认机器人在目标附近停止。模型回复“开始导航”只说明收到请求，不能证明已经到达。

| 现象 | 优先检查 |
|---|---|
| 提交后没有运动 | 组件是否就绪、目标是否实际执行、是否有其他探索或导航任务 |
| 找不到路径 | 地图、定位、目标是否落在可通行区域 |
| 中途反复停止或取消 | 导航日志、障碍物、速度守卫与取消原因 |
| 到达位置偏离 | 初始定位、地图匹配情况和目标容差 |

取消时使用当前 Client 的停止操作，并继续检查导航或探索是否结束、底盘是否实际停止；异步探索任务还需按技能接口取消并核对其运行状态。真机出现危险时使用物理急停。参数说明见[导航指南](../components/navigation.md)。

### 标注房间并查看场景

在 `/user` 加载已保存地图，确认 Map ID 和定位，再依次操作：

1. 点 **Annotate room**，沿房间边界依次点击至少三个角点。
2. 双击或按 Enter 完成，按 Esc 取消。
3. 在右侧列表填写房间名称。
4. 在已加载地图的定位模式下点 **Save current**，保存房间与对象快照。
5. 重新加载同一地图，确认名称和边界保留。

此时保存不会覆盖空间地图本身。房间由人手工标注；地图重建后，过期标注会显示黄色，确认仍有效时点 **Still valid**，错位时重画。

场景服务的同一端口还提供以下页面：

| 路径 | 查看内容 |
|---|---|
| `/cam` | 感知实际收到的彩色图、深度图和时间戳 |
| `/2d` | 地图上的对象与机器人位置 |
| `/3d` | 对象点云与包围盒 |

<figure>
  <img src={useBaseUrl('/img/ui/scene-2d.webp')} alt="场景二维视图中的地图、对象与机器人位置" width="1280" height="800" loading="lazy" />
  <figcaption>先确认相机与定位正常，再检查对象是否出现在正确的位置。</figcaption>
</figure>

没有物体时先看 `/cam`：无画面或时间戳不更新，检查相机和坐标变换；画面正常却没有对象，再查感知配置和日志。Lite3 当前清单关闭了场景图生成，不能把“能打开界面”当作完整场景图已经就绪。详见[场景指南](../components/scene.md)。

## 日常管理：部署、历史与云端备份

两条路线都在目标机器的 Console 管理配置。每次操作先核对**当前部署**，再区分“配置清单”“软件包代码”和“地图等本机资源”；它们的保存与恢复范围不同。

### 修改配置并保存

打开“配置”，展开需要修改的系统组件、原语、服务或技能，按参数说明编辑；需要指定提供方时，选择当前部署中的实际条目名称。首次运行保留整机已有的组合，不随意关闭其他组件依赖的条目。

<figure>
  <img src={useBaseUrl('/img/hub/console-parameters.png')} alt="Console 中展开软件包并修改参数" width="1240" height="691" loading="lazy" />
  <figcaption>展开条目后编辑参数；长说明可点“更多”查看。</figcaption>
</figure>

模型地址和密钥等本机共用值放在“设置 → 机器人环境变量”；“配置”中的环境变量只对当前部署生效，同名时以部署为准。Lite3 的命令行脚本另需读取部署目录中的 `.env`，按[Lite3 示例的凭据设置](#准备凭据并构建-lite3-软件包)维护，不把密钥写进清单。

需要添加功能时，在对应分组点“添加软件包”，先核对 [Hub 目录](https://hub.robonix.ai/discover)中的能力与依赖，再添加、设置参数。已有条目不能重复添加；本机包需在部署目录中有 `package_manifest.yaml`。

修改后点“保存为新版本”，填写修改说明，核对差异后保存。新增或更换软件包需重新构建；启动时读取的参数需重启后生效。

<figure>
  <img src={useBaseUrl('/img/hub/console-save-version.png')} alt="保存配置新版本时的修改说明和差异" width="2048" height="832" loading="lazy" />
  <figcaption>先核对差异再保存，随后在“历史”中确认新记录。</figcaption>
</figure>

### 管理多套部署

“设置”的部署列表显示名称和路径，“概览”上方可切换当前部署。一套部署对应一个目录及其独立历史，可分别保存仿真、本体或实验配置。

| 操作 | 结果与检查 |
|---|---|
| 新建空白部署 | 只填写名称，Console 创建空目录；随后在“配置”添加软件包并保存第一个版本 |
| 登记已有目录 | 新建时填写已有目录的路径，Console 使用该目录；先检查清单和附带文件 |
| 安装整机配置 | 当前部署为空则放入其中；已有配置时新建并切换，保留原部署 |
| 切换部署 | 只改变当前操作对象，不自动停止原来的运行；先停止原运行再启动另一套 |
| 重命名或删除 | 在“设置”操作；Console 创建的目录删除时连同文件删除，登记的外部目录只移除记录 |

最后一套部署不能删除。同一主机不要同时启动多套 Robonix；Lite3 经脚本启动时，也要先用自己的停止脚本结束运行，再操作其他部署。

默认部署通常在 `~/.local/share/robonix-console/deployments/default`，其他部署以“设置”中的实际路径为准。清单历史不包含目录中的全部文件，删除前另外备份本机资源。

### 查看与恢复配置历史

打开“历史”，查看最新记录和“当前”标记。选择旧版本，点“与当前对比”，确认差异。

<figure>
  <img src={useBaseUrl('/img/hub/console-history.png')} alt="配置历史中的版本与对比入口" width="1400" height="680" loading="lazy" />
  <figcaption>先对比，再决定是否回滚；核对当前部署名称。</figcaption>
</figure>

需要恢复时，选择目标版本，点“回滚到此版本”并确认，回到“配置”检查结果，再按原启动方式重启。回滚本身不新增版本，也不会还原软件包代码、地图或标定文件。

“导出历史”保存当前部署的全部配置版本；“导入历史”会替换当前部署已有历史，导入前先导出留底。直接在本机修改过清单时，Console 会在下一次保存或回滚前先记下该改动。

### 备份、恢复与分享配置

云端副本包含**部署清单与配置历史**，最多保留最新 200 个版本；不包含本机软件包、`.env`、地图、模型与标定资源。恢复一份清单不等于还原了一台可运行的机器人。

#### 上传当前部署

在“概览 → 云端备份”核对部署名称，点“上传此部署”，检查将发送的主机、系统、版本信息和密钥替换提示，确认后上传。在 [Hub 我的机器人](https://hub.robonix.ai/robots)查看副本。

<figure>
  <img src={useBaseUrl('/img/hub/console-cloud-backup.png')} alt="Console 中的云端上传与下载入口" width="1568" height="680" loading="lazy" />
  <figcaption>云端备份卡片作用于当前部署；上传前检查名称和内容。</figcaption>
</figure>

各部署分别备份，同一部署再次上传会替换自己的上一份云端副本。换用其他账户后，副本属于该账户。

#### 在另一台机器恢复

在目标机器安装 Console，登录同一 Hub 账户，点“从云端下载”并选择“机器人・部署”。**默认创建新部署，当前部署保持不变**；只有显式勾选覆盖，才替换当前部署的清单和历史。

下载后核对硬件、设备地址和路径，补齐软件包、本机凭据、地图与资源，再按对应路线构建、启动、验证。仿真配置不能直接替代实体机器人的适配配置。

#### 分享配置

在“我的机器人”中点已上传副本旁的“分享”，检查密钥替换方式后确认并复制链接。分享的是密钥替换为环境变量引用的副本，自己的记录不受影响；点“停止分享”后链接立即失效。

接收者无需登录即可查看分享页。安装时在自己 Console 的云端备份卡片点“导入分享链接”，粘贴、打开并安装；空部署直接使用，已有配置时新建部署。分享链接不携带作者的本机文件，安装后仍需自行补齐。

[Hub 用量](https://hub.robonix.ai/usage)显示当前空间占用与额度。超限时先整理不需要的副本，额度以页面为准。

### 使用 AI 配置助手

Console 右侧的“AI 机器人配置助手”用于读配置、查软件包、改参数和读日志；给机器人发任务使用 Client。助手使用“设置”中的模型三项，模型接口需兼容 Chat Completions 并支持工具调用。

可以先输入“检查当前配置有没有问题”。修改配置、回滚、启动停止、上传云端等改变状态的操作会先展示确认卡片；核对对象和差异后点“同意”，不合适则点“拒绝”。

<figure>
  <img src={useBaseUrl('/img/hub/console-assistant.png')} alt="AI 配置助手读取配置并请求确认修改" width="2352" height="1800" loading="lazy" />
  <figcaption>从读取到修改分步检查，不跳过确认卡片中的差异。</figcaption>
</figure>

配置修改会保存为带“(AI)”说明的新版本，可在历史中恢复。设置本机环境变量时，在专用输入框中填写值，不将密钥发到聊天正文。助手不代替 Lite3 启动脚本，也不负责物理急停。

### 更新程序与软件包

| 更新对象 | 操作与验证 |
|---|---|
| Console | “更新”页检查版本；自动更新保留部署、历史与日志，不更新机器人软件包 |
| Robonix | 在“更新”选择发布版本或提交 ID，按页面执行升级；流程会停止 Robonix、切换源码、编译并重建软件包，完成后重新验证 |
| 软件包 | 核对当前部署与来源；Ranger 在 Console 更新全部软件包，Lite3 按整机脚本重新构建并检查结果 |

Console 在启动时和此后每 6 小时检查更新；协议变化、构建或升级任务进行中、关闭自动更新时，需按页面提示处理。升级前保留可用配置，并先结束通过脚本启动的 Lite3 运行；配置回滚不能撤销代码升级。

“设置”还可调整日志保留数量、下载镜像、构建和运行前加载的环境脚本、本机变量与访问账户。默认保留最近 10 次 Console 运行日志。需要访问页面时优先使用 SSH 隧道；Console 页面访问权限与 Client 组件连接是两回事。

<details>
<summary>重新安装或卸载 Console</summary>

再次执行安装命令即可重新安装，部署与历史会保留。卸载前先结束任务，按当前路线停止 Robonix；Lite3 脚本运行需自行停止。在安装 Console 的普通用户账户下执行：

```bash
curl -fsSL https://hub.robonix.ai/install | bash -s -- --uninstall
```

卸载移除 Console 服务并停止其管理的运行和后台任务，保留部署、历史与日志。后续清理目录前，另行备份需要保留的资源。

</details>

## 遇到问题：排查与反馈

先保留报错，从最后一个正常步骤往下查；真机有危险时先急停，再排查。不要通过反复重装跳过具体错误。

### 按现象定位

| 现象 | 先检查什么 |
|---|---|
| 无法登录 Hub 或 Console | 账户注册或激活、协议确认、密码和二次验证；有网络异常时查看 [Hub 服务状态](https://hub.robonix.ai/status) |
| Console 页面打不开 | 安装结果、本机 `127.0.0.1:4880`；远程使用时检查 SSH 转发 |
| 找不到 `rbnx` 或源码 | 安装报错、终端 PATH，以及 `rbnx --version`、`rbnx path root` 的结果 |
| Ranger 更新软件包失败 | 网络、Docker 权限和“更新”页任务日志中的第一个报错 |
| MuJoCo 窗口不出现 | 是否在正确部署目录运行脚本，X11 / WSLg 与硬件 OpenGL 是否可用 |
| Lite3 构建或启动失败 | ROS 2 Humble、原语依赖、`.env`、中间件一致性、设备地址及反馈端口占用 |
| Lite3 找不到示例地图 | 首次改为建图模式；定位模式需指向自己保存且实际存在的地图 |
| Client 离线 | 填的是机器人计算主机地址，Atlas、Executor 和 Liaison 已启动且网络可达 |
| 模型或语音不可用 | 模型地址、密钥、模型名和网络；语音另查腾讯凭据、Client 音频依赖及桥接端口 |
| 参数修改未生效 | 当前部署、是否保存、是否构建和重启；Lite3 脚本的 `.env` 是否仍覆盖旧值 |
| 地图、导航或场景异常 | 按上面的对应章节检查传感器、定位、地图 ID 和组件日志 |
| 云端恢复后不能运行 | 本机文件、凭据、地图和驱动是否补齐，清单是否适用当前机器人 |

### 找到对应日志

Console 下载和构建任务看“更新”页的任务日志；通过 Console 启动的运行看“日志”，选择本次记录，再看 `rbnx 输出` 和具体组件标签。用筛选定位错误，必要时显示全部或下载完整日志。

Lite3 脚本运行先保留终端输出和部署目录 `rbnx-boot/logs/` 中的相关日志；Zenoh 路由进程的输出还可能位于 `logs/rmw_zenohd.log`。不要只提供“启动失败”四个字。

### 提交反馈

1. 点 Console 或 Hub 侧栏底部的反馈按钮；手机从右上角进入。
2. 选择反馈对象，写清复现步骤、期望结果、实际现象和完整报错。
3. 点“查看”检查随附信息，保留相关日志；按需勾选当前部署清单。
4. 确认内容后发送，检查发送成功提示。

<figure>
  <img src={useBaseUrl('/img/hub/console-feedback.png')} alt="反馈表单中的问题描述、附件预览和发送入口" width="1680" height="1232" loading="lazy" />
  <figcaption>发送前查看附件，核对本次问题所需日志，避免在描述中直接粘贴密钥。</figcaption>
</figure>

Console 反馈可附系统与硬件、版本、最近日志和管理程序设置；当前部署清单默认不勾选，选中后其中的密钥会替换为占位符。Hub 网页反馈附浏览器信息。通过 Lite3 脚本启动时，检查附件是否包含本次运行日志，缺失时另外整理提供。

一条反馈描述一个问题，注明使用的是仿真还是本体路线、机器人型号、软件版本和发生时间。Console 无法连接 Hub 时，可“下载反馈包”交给维护者。需要恢复配置时，先导出历史留底，再对比、回滚并重启；本机资源与代码另行检查。

## 查阅常用概念

| 名称 | 本页中的含义 |
|---|---|
| Robonix | 组织机器人能力并执行任务的软件；仿真进程独立运行 |
| Hub | 云端的账户、软件包目录、配置备份与分享服务 |
| Console | 安装在机器人主机或仿真电脑上的管理页面，管理部署、配置、更新与运行 |
| Client | 操作者使用的对话与状态界面，连接运行中的 Robonix |
| 整机配置 | 为特定本体和环境组织的软件包、参数与附带文件；真机和仿真配置需区分 |
| 部署目录 | 放置 `robonix_manifest.yaml` 和相关本机文件的目录 |
| 部署清单 | `robonix_manifest.yaml`，记录组件、包来源、参数和环境变量引用 |
| 配置版本 | 一次保存的清单快照；不是全部代码、地图和文件的备份 |
| 云端副本 | 上传到 Hub 的清单与历史；恢复时仍需准备本机资源 |
| 原语（Primitive） | 相机、底盘、雷达等硬件能力的接入组件 |
| 服务（Service） | 建图、导航、语音等可复用功能 |
| 技能（Skill） | 使用已有能力完成探索、找物等任务的组件 |
| 提供方 ID | 当前部署中提供某项能力的实例名称，例如 `mid360_lidar` |
| 构建 | 下载并准备代码、依赖和可执行产物；成功后还需启动与验证 |
| 环境变量与 `.env` | 运行时设置；Console 本机变量、部署变量和脚本读取的文件各有自己的作用范围 |
| 地图 ID | 已保存地图及其房间、对象关联使用的标识；同名配置不代表本机已有地图文件 |
| 建图 / 定位 | 前者采集新的空间地图，后者在已保存地图中确定机器人位置 |
| Atlas | Robonix 的能力注册与发现组件；Client 连接它取得其他组件信息 |
| `rbnx` | Robonix 命令行工具；`path root` 返回源码根目录，不是部署目录 |

</div>
