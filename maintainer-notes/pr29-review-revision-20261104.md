# PR #29 评审修订（2026-11-04）

对应 enkerewpo 的 review 5753772304 与九条行内评论：

- 4455934317 / 4455934387：移除所有 static/video 文件及视频/下载入口。原演示均对应暂时移除的 Ranger、Lite3 流程，不把这些内容另行嵌入 TIAGo 教程。PR 从 origin/main 重新构建无视频的单提交，并以明确 lease 替换原分支，避免仅删除工作树后大文件仍留在提交历史。本地旧提交和原视频保留。
- 4455934333：账户入口改为 https://hub.robonix.ai/auth/login。
- 4455934343：Pilot 只说明 OpenAI 兼容地址、密钥、模型名，删除图像输入和工具调用要求；AI 配置助手保留工具调用说明。
- 4455934353：全文统一 Robonix Hub / Robonix Console / Robonix Client；产品原界面按钮文字保留；说明中的云端副本改称配置备份。
- 4455934365：建图、导航、场景只列权威章节链接，概念表改为架构与命令行文档链接。
- 4455934376：正文不使用“你”。
- 4455934397：本版移除 Lite3 本体路线，清理相关日常管理和排错内容及截图。
- 4455934405：仿真改为 PAL Robotics TIAGo Webots，使用概览的整机配置与 Boot hooks（Before boot: bash sim/start.sh --detach / After exit: bash sim/stop.sh），允许远程连接后从 Robonix Console 启动，并通过 Robonix Client 提交首个任务。

来源：robonix 默认分支为 dev（main README 仍为旧流程）；已读取并按固定提交 76cfca2888933f4f16e219d857ccdf37ee0411dd 的 README Quick Start/Robonix Console 核对。TIAGo Hub 发布包 0.1.0 指向 1ccbcb88ba6492b403d8b3bacff31b36c2e7ba20。原内测手册继续用作部署、历史、备份、助手和反馈操作依据。

检查：make check；个人 Pages 构建、带前缀链接及旧地址检查；320/390/768/1440 宽度浏览器检查。10 张图片正常、比例正确、无页面溢出、页内锚点完整、先登录再设置模型。页面无视频、一次性登录参数、Ranger/Lite3/MuJoCo 流程或第二人称残留。首次任务与启动步骤逐项对照 README；未在本轮重新安装 Docker 或启动 TIAGo 实例，不声明现场实测。
