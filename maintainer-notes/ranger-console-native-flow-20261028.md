# Console 实操截图流程修订（2026-10-28）

本轮以用户明确给出的 Console 实操顺序为准，替代上一轮主线中的手动 bootstrap、.env、环境脚本和 Web 后端步骤。更新后的主线是：目录安装 → 检查 rbnx → Console 更新软件包 → 手动 native 仿真 → Console 启动 → 日志 → 简要 Client。

## 可核查依据

- `rbnx --version`、`rbnx path root`：原书 getting-started/quickstart.md 的安装检查，当前安装器也调用 `rbnx path root`。作用分别为程序版本和已登记源码根目录，不证明整机包已构建。
- 更新软件包、启动、日志：提供的内测手册 §9；本轮新增实际 Ranger 软件包更新与启动截图。约 40 分钟来自用户提供的实操经验，正文写为预留估计，不承诺固定时长。
- 默认 Console 数据根目录：在线安装器 ROOT 与现有截图；部署目录以设置页为准。路径为 deployments/default，不是 delopments。
- `bash sim/start.sh --backend native`：Ranger 快照 f5b9a5d7ddec9b0971451539e22b7d48fd115964 的 README、sim/start.sh；图5终端也显示 native(viewer)。Robonix 与仿真生命周期分离在 README/stop 脚本中有明确说明。
- Client 简介根据 syswonder/robonix-client/main/README.md（当日读取），Python >=3.11、源码安装与 robot-host/7860/Atlas 字段。主线仅用文本；基础安装不包含可选 audio extra。详细 Client 小节仍注明其旧版739f8499来源。
- 用户提供的 Hub 登录链接已 HTTP 200 检查；按要求使用原链接。其页面展示邮箱登录/注册，不将截图冒充本机 Console 登录界面。

## 七张截图

- PixPin_2026-10-28_16-41-45.png → ranger-model-settings.png，模型设置。
- PixPin_2026-10-28_16-45-26.png → hub-account-login-register.png，Hub账户入口。
- PixPin_2026-10-28_17-03-05.png → ranger-update-packages.png，更新按钮。
- PixPin_2026-10-28_17-04-38.png → ranger-build-complete.png，已完成及Failed:0。
- PixPin_2026-10-28_17-10-09.png → ranger-native-viewer.png，裁切到MuJoCo窗口。
- PixPin_2026-10-28_17-13-01.png → ranger-console-start.png，去掉浏览器工具栏。
- PixPin_2026-10-28_17-15-10.png → ranger-console-startup-log.png，去掉浏览器工具栏。

按要求删除主线中的“观察相机并提交探索任务”“结束仿真”，修复其旧页内引用。保留演示视频。PR #28 继续关闭；本轮只发布个人预览。资料与语法/网站检查不等于本机完成了整套仿真运行验收。
