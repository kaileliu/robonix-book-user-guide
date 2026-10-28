# 单页入门文档核查（2026-10-28）

## 合并范围

上游基线：syswonder/robonix-book `b24850725ac7af2867ec609d7e96b659089a0812`。最终提交草稿位于本地 upstream-ready 工作树；只增加入门单页、其引用的图片和视频，以及入门侧栏一项。不替换上游首页、主题、配置、其他正文或发布流程。本仓库 Pages 配置仅供个人预览。

个人预览同步了该上游版本的 11 篇维护中文档，以避免预览沿用旧接口说明。最终上游草稿不重复修改这些文件。

## 已查证和修正

- 当前安装器及 RELEASE（2026-10-28）：Console 0.1.0-beta.47；缺少 Robonix 时使用 v1.1.0-beta.1。路径采用 robonix-console 而非旧 robonix-hub，说明 XDG_DATA_HOME 与旧路径迁移；仅支持 Linux x86_64/aarch64。
- 服务条款/隐私链接改为 TERMS.md、PRIVACY.md；参数采用 --show-terms / --accept-terms。保留安装器按需请求系统依赖权限的事实。
- 原书 CLI 教程固定 Robonix 223675d9，与当前在线安装器版本分开说明，避免混用。
- TIAGo 条目 API 返回 robot-pal_robotics-tiago_webots，源码快照 dda9f64ceeb9776f5c4091eb5c85e26dcace32c7。已检查该快照 manifest、README 与 sim/start.sh；补充 ROBONIX_SOURCE_PATH、脚本存在检查及 Console 环境变量设置。没有把 full 模式写为可用抓取能力。
- Client 按原书固定 739f84999c5aef120f2ca46641952fb4bee45d93，三个平台的安装步骤均显式 checkout，避免自动使用未知最新版。
- 配置、云端、历史、助手和管理员语义来源：《RobonixHub 内测使用手册》2026-10-03 beta.22，PDF SHA-256 490f425c6cfdce1cc566aaafc50de8e7560240bafb7fbf93940248a3167faa64。不能据此推断 beta.47 功能逐项实测通过。
- 原始截图清单中的 18 项文件摘要与 PDF 提取资源一致。图示保留版本说明；安装截图、目录截图的本体和按钮差异在图下注明。
- 云端下载按手册专节的“默认新建部署；显式选择覆盖时替换当前配置/历史”说明；管理员删除标明永久删除整机与版本历史。
- 建图、导航、场景按原书相应组件文档保留前提；未声称执行过真机、云端恢复或 beta.47 全功能验收。

## 视频

原始录像是 Ranger MuJoCo，不是 TIAGo。原始文件 143069993 字节，SHA-256 a12eacbc2d782135eee535b64da3fcb0bbfff32cbb2d050e5eea91d0875f51b9。

个人预览沿用 640×360 / 15 fps / 无音轨的轻量版本（1479128 字节），不等待完整视频上传。

最终上游草稿单独准备 1920×1080 / 30 fps / AAC 双声道的完整转码文件（23192877 字节，约 510.12 秒），SHA-256 88bd6a099488a501ad4a8eff33803a18505f29e050c8fed827e2ad92d26b7d21。已执行全时长解码检查。视频最终提交时携带 provenance README；不得误用个人预览轻量版本。

## 提交约束

本轮仅发布个人预览。尚未向 syswonder/robonix-book 推送或创建 PR；待用户确认再提交。未来提交前应重新核对上游变化、媒体摘要和文档构建。
