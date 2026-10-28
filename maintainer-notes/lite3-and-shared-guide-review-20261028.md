# Lite3 与共用章节审查（2026-10-28）

## 结构和依据

删除“安装、配置与交互详解”整章，将修改参数、添加软件包、保存版本等仍需保留的操作移入日常管理。全页保留六个二级章节：Ranger 仿真、Lite3 真机、地图与场景、日常管理、排错、概念。

内测手册来源：本地 `RobonixHub内测使用手册-20261003-01.pdf`，SHA-256 为 490f425c6cfdce1cc566aaafc50de8e7560240bafb7fbf93940248a3167faa64。

- 配置、保存、包依赖：手册 §8。
- Console 构建、运行、日志、Client 网络：§9。
- 配置对比、回滚不新增版本、导入替换历史：§10。
- 部署切换不等于停止、删除目录来源区别：§11。
- 云端副本范围、最多200版本、分享、用量：§12；下载新部署的默认行为取 §12 的专项说明，避免与 §11 概述混淆。
- AI 助手确认、模型输入与权限：§13。
- 更新和设置：§15–16。程序名称与路径按当前 Console 安装器和已提供的新截图，未恢复手册旧 robonix-hub 路径。
- 反馈范围、默认不附清单、离线包：§4。

地图和场景的具体操作不是内测手册的内容，保持以当前书 docs/components/mapping.md、navigation.md、scene.md 为依据，正文已明示。保留 RTAB-Map 新会话、不可覆盖空间地图、定位模式保存语义、人工房间标注等约束；删除不相关的 Webots RViz2 折叠教程。

## Lite3 来源与关键差异

当日直接读取 Hub API `https://hub.robonix.ai/api/v1/packages/robonix.robot.deep_robotics.lite3`。返回版本 0.2.0，readme_base 指向 syswonder/robot-deep_robotics-lite3 的 ac50c58ff649acbe0985ae92e93a98c551f38057。核对 README.md、robonix_manifest.yaml、.env.example、build.sh、start.sh、stop.sh、soma.yaml。

- 真机配置为 Jetson native / ROS Humble，MID-360、Orbbec Gemini330；不照搬 Ranger 的 Docker / MuJoCo 准备。
- Lite3 默认 map_mode=localization、map_id=3f_full_lite3，首次没有该地图需先改 mapping；地图保存后再配置自己的定位 ID。
- build.sh/start.sh 加载本机 .env 和 ROS；start.sh 还清理本部署进程、检查 UDP43897，Zenoh 时管理路由进程。因此使用原仓库脚本，不凭 Console 通用按钮宣称等价、不宣称脚本运行自动纳入 Console 日志记录。
- .env.example 默认 Fast DDS，manifest 默认 Zenoh，必须把 .env 两个中间件变量和 manifest 环境变量统一。没有假定两处优先级一致。
- speech 当前启用且依赖腾讯凭据；文本路线可停用，保留语音则补齐三个字段。
- Client 网络端口取自清单50051/50061/50081；音频桥接60002；用户主机、运动主机、Client主机明确区分。
- soma.yaml 明确没有机械臂或夹爪；不写抓取任务。SCENE_GRAPH_ENABLED=false，不承诺完整场景图生成。
- Client 命令及 Python>=3.11 与当日 robonix-client README/pyproject 核对，沿用基础文本安装，可选音频另行安装。

截图沿用既有资产，Lite3 中使用通用安装确认、配置、日志和连接界面，图注注明示意，不将 Ranger 条目冒充 Lite3。未新增生成图片。所有图改为语义 figure/figcaption，保留固有宽高、按比例缩放，高度限制520px，窄图最大420px；样式为页面局部 CSS module，不影响全书。

这里只完成来源、命令脚本和网站构建/浏览器检查，没有实际接入或运行 Lite3。上游 PR #28 继续关闭，本轮仅发布个人预览；本地候选同步相同文档和局部样式。
