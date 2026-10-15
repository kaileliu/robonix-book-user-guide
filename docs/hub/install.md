---
last_update:
  date: 2026-10-15
---

# 安装 Console 并登录

在机器人主机上安装 Console，完成账户登录和模型设置后，就可以安装整机配置。

## 激活账户

收到邀请邮件后，打开链接、输入验证码，阅读并确认页面中的告知与许可协议，再设置密码。链接和验证码在 72 小时内有效。已有可用账户可直接继续。

在 [Hub](https://hub.robonix.ai/discover)确认账户可以登录。尚未同意许可协议时，Console 会提示先到 Hub 完成；开启二次验证的账户还需验证码。

## 在目标机器安装

安装器支持 `x86_64` 和 `aarch64`（包括 Jetson）。在机器人主机上，以运行 Robonix 的普通用户执行：

```bash
curl -fsSL https://hub.robonix.ai/install | bash
```

不要使用 root 或在命令前加 `sudo`。安装器会在补充系统软件包时询问权限，随后校验发布文件、显示许可协议并安装。已有 Robonix 时直接使用；没有时下载源码并构建，最后配置当前用户的自动启动服务。

安装结束会检查页面是否响应，并给出访问地址。机器人驱动和仿真环境仍按 [Hub 整机条目](https://hub.robonix.ai/discover/robot)的 README 准备。

## 设置模型服务

安装时按提示填写下列三项；也可跳过，稍后在“设置 → 机器人环境变量”填写。

| 页面字段 | 变量 | 填什么 |
|---|---|---|
| VLM 终端 URL | `VLM_BASE_URL` | 兼容接口地址 |
| VLM KEY | `VLM_API_KEY` | 访问密钥 |
| VLM 模型 | `VLM_MODEL` | 模型名 |

Pilot 和配置助手使用这组设置。配置助手要求模型兼容 Chat Completions 并支持工具调用；[Webots 教程](../getting-started/simulation.md)的图像任务还要求视觉语言模型。三项只保存在本机，不随部署上传。

## 打开 Console

在机器人本机打开 [http://127.0.0.1:4880](http://127.0.0.1:4880)，填写 Hub 账户邮箱和密码，点“登录”。默认只允许本机访问。

![Console 登录页：填写邮箱和密码，再点登录](/img/hub/console-login.png)

*填写邮箱（1）和密码（2），点“登录”（3）。*

从另一台电脑访问时，先建立 SSH 隧道。将 `ROBOT_USER`、`ROBOT_HOST` 换成机器人用户名和地址：

```bash
ssh -N -L 4880:127.0.0.1:4880 ROBOT_USER@ROBOT_HOST
```

保持终端打开，在这台电脑的浏览器访问同一个本地地址。这个隧道只连接 Console 管理页面；Client 另有[连接要求](../getting-started/client.md#准备机器人端)。

能看到“概览”和“配置”页面后，继续[选择并安装整机配置](catalog.md)。无法登录或打开页面时，见[问题排查](../troubleshooting/index.md)。
