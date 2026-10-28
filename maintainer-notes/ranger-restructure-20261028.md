# Ranger 单页重构事实核查（2026-10-28）

PR #28 已按用户要求关闭；本轮仅发布个人预览，不重新打开或创建 PR。

## 仿真来源与修正

- Hub API：`https://hub.robonix.ai/api/v1/packages/robonix.robot.agilex.ranger_with_piper_mujoco`，版本 0.2.0，`readme_base` 固定到 `f5b9a5d7ddec9b0971451539e22b7d48fd115964`。
- 对照该快照 README（含中文）、部署清单、`scripts/bootstrap.sh`、`scripts/env.sh`、`scripts/resolve-robonix-paths.sh`、`.env.example`、`sim/start.sh` 和 `sim/stop.sh`。
- 默认 Web 后端、`scenesmith_house_187`、端口 5180 / 8766、Fast DDS、无音频配置均有源码/README 依据。未套用 TIAGo 的脚本或 Zenoh 环境。
- 完整写出 Console 安装、模型变量、Hub 登录、rbnx 检查、整机安装、路径检查、`.env`、bootstrap、环境脚本、Console 更新构建、仿真先启、Console 启动、Client 安装、相机观察及探索。bootstrap 不能被 Console 的纯软件包更新步骤替代。
- 新截图来自用户提供的 PixPin_2026-10-28_15-46-34.png（安装）和 PixPin_2026-10-28_15-51-36.png（探索）。截图只证明对应界面与任务受理，不当成完成验收。
- 探索能力文档 `syswonder/skill-explore-rbnx/main/CAPABILITY.md` 明确：返回 run_id，status 轮询，cancel 取消。增加异步取消说明，不能将 Client 的 ABORT/空闲状态等同于探索已停止。
- 默认 Web 图形要求与 native 模式分开；不照搬 Webots 完整验收环境为 Ranger 的兼容保证。

## 后续四部分

| 部分 | 对照材料 | 核查与处理 |
|---|---|---|
| 建图、导航与场景 | 原书 components/mapping.md、navigation.md、scene.md、Ranger README/manifest | 保留建图/定位模式、地图不可覆盖、加载会话丢失风险、场景标注手动产生、过期提示。Ranger 主导航改用 README 支持的地图坐标任务；RViz2 仅作为 Webots 独立参考，不宣称 Ranger 包自带同样窗口。 |
| 日常管理 | 提供的 2026-10-03 Hub 手册 §10–15、当前安装器 | 逐项检查部署删除范围、历史非代码备份、云端最多 200 版本/不含本机资源、下载默认新部署与显式覆盖、分享只含清单、助手确认、升级与卸载；保留边界，不把备份当完整环境迁移。 |
| 排查与反馈 | 手册 §4、原书 Client/组件排错 | 提交不等于完成；反馈默认不勾清单、附件预览/取消勾选、离线包、凭据处理均与材料一致。 |
| 常用概念 | 原书架构/组件、手册 | 作为日常概括，不把目录列出的能力当整机验收或真机适配证明。 |

已按要求删除正文的“版本与资料依据”“管理员补充：Hub 管理后台”。来源与核查记录保存在维护者文件，不重新加入用户正文。

验证范围是资料/命令语法与网站行为；未在本机启动 Ranger 仿真、执行机器人任务或云端恢复。高清 PR 候选视频仍保留完整 1080p60/原音轨，个人预览沿用轻量版。
