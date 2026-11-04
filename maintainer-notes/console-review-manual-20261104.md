# Console 使用指南：独立评审预览

原版保存：archive/two-route-videos-20261104，提交 81ebe71b4df86e5a06c616efb53d3b0fa0e21782。
原页 docs/getting-started/hub-console.md 及 static/video/ 保持逐字节一致。
新版 docs/getting-started/hub-console-review.md，未更新上游 PR #29。
上游候选保存在独立 worktree .preview/pr29-manual-candidate，页面最终仍使用 hub-console.md。

## 资料与优先顺序

- PR #29 review 5753772304、九条行内意见：2026-11-04 重新读取。
- RobonixHub内测使用手册-20261003-01.pdf，32 页，完整提取并核对。
- Robonix dev README 固定提交 76cfca2888933f4f16e219d857ccdf37ee0411dd；与本次获取的 dev README 字节一致。
- 当前 https://hub.robonix.ai/install，只下载阅读，未执行。
- Robonix Client README 和 book 当前组件章节。

手册中的 Robonix Hub（本机管理程序）按评审统一改称 Robonix Console；手册中的 Robonix Hub Cloud 攵称 Robonix Hub。界面标签采用当前页面与 dev README。手册 §9.2 的手动 Webots 命令按维护者要求替换为启动钩子。

## 评审处理

| 意见 | 本版处理 |
|---|---|
| 4317 / 4387：视频及链接 | 候选分支不含 static/video，也不含 MP4 历史对象。旧录像只保留在个人归档与原预览，不用于 TIAGo 教程 |
| 4333：一次性登录链接 | 使用 /auth/login，无 flow 参数 |
| 4343：模型要求 | Pilot 只列服务地址、密钥和模型名；工具调用要求仅写在 AI 配置助手 |
| 4353 / 4376：表述 | 统一三个产品名称；不使用第二人称 |
| 4365：重复内容 | 建图、导航、场景与概念改为链接到 book 对应章节 |
| 4397：Lite3 | 本版不含本体操作路线 |
| 4405：Ranger | 采用 TIAGo、Boot hooks 和 Console 启停 |

## 内测手册对应

| 新版内容 | 手册 PDF 页与章节 |
|---|---|
| 账户、安装、登录、模型变量 | PDF 4–7，§5–7；不再指导未受手册支持的自行注册 |
| 配置、参数、提供方、保存 | PDF 7–13，§8 |
| 下载与构建软件包 | PDF 13–14，§9.1；保留明确的 Console 操作与成功检查 |
| 运行、日志、客户端连接 | PDF 15–17，§9；启停用当前 dev README 的钩子替换手工终端 |
| 对比、回滚、导入导出 | PDF 17–18，§10 |
| 多部署与删除范围 | PDF 18–19，§11；默认路径按当前安装器更新 |
| 备份、恢复、分享、用量 | PDF 19–20，§12 |
| AI 助手及确认卡片 | PDF 20–21，§13 |
| 更新、卸载、设置 | PDF 23–25，§15–16；运行日志指 Robonix 运行，不指 Console 进程日志 |
| 反馈与离线包 | PDF 2–4，§4 |

不在用户教程中加入版本依据或管理员后台。没有现场启动 TIAGo 或连接真机；技术说明按上述来源核对，不声称完成端到端实测。

## 保存与验证结果

- 上游候选 `make check` 通过（3911 站内目标；42 个旧页面、191 个历史锚点）。
- 个人预览构建、资源与代码块检查通过（4112 站内目标）；320 / 390 / 768 / 1440 px 浏览器检查无溢出、图片变形、首行缩进和失效页内锚点。新版 9 张图均加载。
- 原页、原 CSS 与全部 static/video 对归档提交执行 git diff，零差异。

原有视频 SHA-256（归档与当前预览一致）：

- `lite3-control-demo.mp4`：`3df3127bacdc529cf0a47eb22cbfbe6e0012ec3e63599ee15270b135b1de287e`
- `lite3-setup-demo.mp4`：`2c7256c647e5c6217e57c9362402f67c31cda3f0fd31bb956d2adccf2720ef01`
- `simulation-start-demo.mp4`：`b83ae2b9175a3879782367a8b74f85645847fba403241b99e7575f4537e9c14a`
