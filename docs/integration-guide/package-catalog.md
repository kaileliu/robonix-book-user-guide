---
last_update:
  date: 2026-10-15
---

# 软件包目录发布流程

本页面向发布软件包和维护目录元数据的开发者。查找并安装已有配置，请看[选择机器人配置](../hub/catalog.md)；仅分享部署清单，请看[备份与分享](../hub/cloud.md)。

## 向目录提交

Robonix 社区软件包和整机部署配置不放进 `syswonder/robonix` 主仓库。主仓库只保留核心运行时、内置参考服务和 Webots/Tiago 示例；可复用的原语、服务、技能软件包以及机器人部署仓库通过 [`syswonder/robonix-package-catalog`](https://github.com/syswonder/robonix-package-catalog) 汇总。

软件包目录的人工输入文件是 `syswonder/robonix-package-catalog` 仓库根目录的 [`catalog.yaml`](https://github.com/syswonder/robonix-package-catalog/blob/main/catalog.yaml)。向目录提交时只改这个文件。

普通软件包写在 `packages:` 下：

```yaml
packages:
  - name: robonix.service.mapping
    repo: https://github.com/syswonder/service-map-rbnx
```

整机部署仓库写在 `robots:` 下：

```yaml
robots:
  - name: robonix.robot.agilex.ranger_mini_v3
    repo: https://github.com/syswonder/robot-agilex-ranger_mini_v3
```

提交步骤：

1. 普通软件包仓库默认分支必须有根目录 `package_manifest.yaml`。
2. 机器人部署仓库默认分支必须有根目录 `robonix_manifest.yaml`。
3. 在 `syswonder/robonix-package-catalog` 提 PR，只向 `catalog.yaml` 增加一条 `name` + `repo`。
4. 目录的持续集成检查会通过 GitHub API 读取目标仓库默认分支，不克隆仓库。
5. 持续集成检查校验元数据、生成静态 API 和页面，并部署 GitHub Pages。

`catalog.yaml` 不重复写描述、标签、维护者、能力或部署依赖。普通软件包的这些信息来自 `package_manifest.yaml`；机器人部署仓库的这些信息来自 `robonix_manifest.yaml`。

## 普通软件包元数据

普通软件包指原语、服务或技能仓库。仓库根目录必须有 `package_manifest.yaml`，并且 `package.name` 必须与 `catalog.yaml` 里的 `packages[].name` 完全一致。

示例：

```yaml
manifestVersion: 1

package:
  name: robonix.primitive.intel.realsense_d435i.camera
  version: 0.1.0
  description: Intel RealSense D435i driver wrapper.
  tags: [primitive, camera, intel, realsense_d435i, rgbd]
  maintainers:
    - wheatfox <wheatfox17@icloud.com>
  license: Apache-2.0

build: bash scripts/build.sh
start: bash scripts/start.sh
stop: bash scripts/stop.sh

capabilities:
  - name: robonix/primitive/camera/rgb
  - name: robonix/primitive/camera/depth
```

这份完整清单对应的最小仓库结构如下；三个脚本都必须以可执行模式提交，`stop.sh` 必须可重复执行：

```text
.
├── package_manifest.yaml
├── camera_driver/
│   └── main.py
└── scripts/
    ├── build.sh
    ├── start.sh
    └── stop.sh
```

如果软件包没有 Driver 关闭之外的额外清理工作，可以同时省略 `stop:` 和 `scripts/stop.sh`。

软件包目录读取以下字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `package.name` | 是 | 软件包发布名，必须与 `catalog.yaml` 的 `packages[].name` 一致 |
| `package.version` | 是 | 软件包版本 |
| `package.description` | 是 | 一句话说明这个软件包做什么 |
| `package.license` | 是 | SPDX 许可证标识 |
| `package.tags` | 是 | 字符串列表，用于页面显示和过滤 |
| `package.maintainers` | 是 | 字符串列表，每项必须是 `Name <email@domain>` |
| `capabilities[].name` | 否 | 软件包声明的 Robonix 能力约定 ID |
| `capabilities[].path` | 否 | 软件包内能力约定 TOML 的相对路径 |

旧软件包清单中的 `package.vendor` 仍可读取，以保证已有软件包能继续构建和启动；运行时会忽略它，软件包目录也不使用该字段。新软件包使用 `package.name`、`package.tags` 和 `package.maintainers` 表达名称、分类和维护归属。

新软件包通常省略 Driver 条目，由框架自动提供 `robonix/lifecycle/driver`；显式声明共享 Driver 仍有效。

:::warning[后向兼容：已有命名空间 Driver]
已有软件包可以暂时继续发布唯一的 `<provider-namespace>/driver` 及其本地 Driver TOML；目录校验不会要求立即迁移。该方式计划迁移到共享 Driver，一个清单不能同时声明两种 Driver。
:::

## 机器人部署元数据

机器人部署仓库是整机部署配置仓库，核心文件是 `robonix_manifest.yaml`。它不需要额外的 `package_manifest.yaml`。

`robonix_manifest.yaml` 通过顶层 `catalog:` 块提供与普通软件包一致的目录元数据：

```yaml
manifestVersion: 1
name: robonix-ranger-mini-deploy

catalog:
  name: robonix.robot.agilex.ranger_mini_v3
  version: 0.1.0
  description: Robonix deploy manifest for the AgileX Ranger Mini v3 robot.
  license: Apache-2.0
  tags: [robot, deploy, agilex, ranger_mini_v3]
  maintainers:
    - wheatfox <wheatfox17@icloud.com>

primitive:
  - name: ranger_chassis
    url: https://github.com/syswonder/primitive-agilex-ranger_mini_v3-chassis-rbnx
    branch: main

service:
  - name: mapping
    url: https://github.com/syswonder/service-map-rbnx
    branch: main
```

机器人的 `catalog` 块使用与普通软件包相同的发布元数据字段：`name`、`version`、`description`、`license`、`tags` 和 `maintainers`。

软件包目录会解析 `primitive:`、`service:`、`skill:` 下的 `url`、`branch` 和 `name`，生成 `deploy_dependencies[]`，并在机器人详情页展示“这个整机部署由哪些普通软件包组成”。如果依赖仓库也已收录在目录中，页面会自动链接到对应软件包详情页。

## 仓库命名

推荐命名：

| 类型 | 仓库名格式 | 例子 |
|---|---|---|
| 机器人部署仓库 | `robot-[company]-[model]` | `robot-agilex-ranger_mini_v3` |
| 原语软件包 | `primitive-[company]-[model]-[primitive_type]-rbnx` | `primitive-intel-realsense_d435i-camera-rbnx` |
| 服务软件包 | `service-[name]-rbnx` | `service-navigation-rbnx` |
| 技能软件包 | `skill-[name]-rbnx` | `skill-explore-rbnx` |

`primitive_type` 要对应 Robonix 原语接口族，例如 `camera`、`lidar`、`imu`、`chassis`、`audio`。硬件型号内部可用 `_`，避免用 `-` 造成仓库名分段歧义。

## 网站和接口

用户现在从 [Hub 目录](https://hub.robonix.ai/discover)查找配置和软件包：

| 要找什么 | Hub 入口 |
|---|---|
| 整机配置 | [机器人](https://hub.robonix.ai/discover/robot) |
| 硬件连接 | [原语包](https://hub.robonix.ai/discover/primitive) |
| 通用功能 | [服务包](https://hub.robonix.ai/discover/service) |
| 任务组合 | [技能包](https://hub.robonix.ai/discover/skill) |

条目详情使用 `/package/<完整目录名称>`，例如 [mapping](https://hub.robonix.ai/package/robonix.service.mapping)。Hub 用于查看、收藏；在目标机器的 Console 中安装或添加，见[用户操作](../hub/catalog.md)。

提交合并后，还需等待 Hub 同步目录。以上仓库流程中的静态目录产物与 Hub 的 REST API 是不同接口；接入当前 Hub 时使用下表。

### Hub 只读 API

以下路径与返回字段按 2026-10-14 的官方 OpenAPI 核对，适用于 Hub 的 REST API。

地址前缀为 `https://hub.robonix.ai/api/v1`。公共目录和能力约定无需令牌；账户、收藏和机器人数据需要个人访问令牌。以 [OpenAPI](https://hub.robonix.ai/api/v1/openapi.json) 为准。

| GET 路径 | 用途 |
|---|---|
| `/packages` | 列表，返回 `{ total, items }`；支持 `q`、`kind`、`tag`、`provides`、`sort`、`limit`、`offset` |
| `/packages/{name}` | 条目元数据、版本、README、能力和依赖 |
| `/packages/{name}/stats` | 条目统计 |
| `/contracts?id=...&package=...` | 能力约定及接口定义 |
| `/contracts/type?name=...` | 接口引用的消息类型 |

示例：

```bash
curl -fsS 'https://hub.robonix.ai/api/v1/packages?kind=robot&q=tiago'
curl -fsS 'https://hub.robonix.ai/api/v1/packages/robonix.service.mapping'
```

查询普通包和机器人使用同一个 `/packages` 接口。详情中的 `uses` 可对照整机使用的软件包，`provides` 和 `modes` 可对照能力树；不要把实例名（如 `nav2`）当成目录发布名。

个人令牌在 [Hub 个人主页](https://hub.robonix.ai/profile)的 API 入口管理，只显示一次，有效期 90 天，请求头为 `Authorization: Bearer TOKEN`。
