---
last_update:
  date: 2026-10-14
---

# 命令与清单字段速查

本页用于查找开发常用命令和清单字段，沿用手册固定源码基线。第一次开发先阅读[模板教程](package-start.md)；更完整的字段与兼容规则见[打包规范](../integration-guide/packaging-spec.md)。

## 常用命令行接口

| 命令 | 用途 |
|---|---|
| `rbnx setup [root]` | 登记 Robonix 源码根目录；省略时使用当前目录并向上查找源码根 |
| `rbnx path <key>` | 输出源码树中的绝对路径 |
| `rbnx init <name>` | 创建机器人部署骨架 |
| `rbnx package-new <name> --type <type>` | 创建软件包骨架 |
| `rbnx validate [path]` | 校验软件包清单 |
| `rbnx codegen -p <package> [--mcp] [--ros2] [--python <interpreter>]` | 生成 gRPC、MCP 或 ROS 2 接口代码；解释器优先级为 `--python` → `RBNX_CODEGEN_PYTHON` → `python3` |
| `rbnx build [-p <package> \| -f <manifest>]` | 构建软件包或整个部署 |
| `rbnx start [-p <package>]` | 单独启动软件包；生命周期行为见[生命周期说明](package-concepts.md#生命周期接口与处理函数) |
| `rbnx boot [-v] [-f <manifest>]` | 启动整套部署；`-v` 关闭动态启动动画并实时输出 INFO/WARN/ERROR |
| `rbnx shutdown [-f <manifest>]` | 停止对应部署 |
| `rbnx update [-p <package> \| -f <manifest>]` | 更新远程软件包 |
| `rbnx clean [-p <package> \| -f <manifest>] [--cache]` | 清理构建和运行产物 |
| `rbnx caps [-v]` | 查看提供方和能力 |
| `rbnx contracts [-v]` | 查看 Atlas 已加载的能力约定 |
| `rbnx describe --provider <id>` | 查看提供方的 `CAPABILITY.md` |
| `rbnx tools` | 查看 Pilot 可调用工具 |
| `rbnx channels` | 查看活动连接 |
| `rbnx inspect` | 输出完整运行时状态 |
| `rbnx ask "<prompt>"` | 非交互提交一次任务 |
| `rbnx chat` | 启动交互界面 |
| `rbnx docs` | 从 `capabilities/` 重新生成 contracts/idl 参考文档 |
| `rbnx config` | 查看/设置 rbnx 配置 |
| `rbnx logs [-d <dir>] [-t <tag>] [-l <level>] [-f] [--json]` | 读取、筛选或跟随 Scribe 结构化日志 |

`rbnx clean -f robonix_manifest.yaml` 默认保留 `rbnx-boot/cache/`；只有加 `--cache` 才删除远程软件包缓存。单独执行 `rbnx start --config <file>` 时仍会先读取软件包清单；启动器确认提供方只注册唯一的共享生命周期 Driver 后，通过 `CMD_INIT` 发送合并配置。配置文件路径不会暴露给提供方进程。

:::warning[后向兼容：`rbnx start` 启动旧软件包]
精确声明 `<provider-namespace>/driver` 和本地 Driver TOML 的旧软件包仍可使用 `rbnx start`。旧生成服务完全不存在时，这类软件包可按受管兼容标记单向使用共享运行时 Driver。该方式计划迁移，不能与共享 Driver 条目同时使用。完整规则见[软件包与部署清单规范](../integration-guide/packaging-spec.md#42-已有命名空间-driver-的兼容流程)。
:::

## 配置字段

### 软件包清单

| 字段 | 当前作用 |
|---|---|
| `manifestVersion` | 当前接受大于等于 1 的版本；新清单使用 1 |
| `package.name` | 软件包发布名，必填且非空；发布到目录时必须与 `catalog.yaml` 的 `packages[].name` 一致，不要求与本地目录名一致 |
| `package.version` | 版本字符串，必填；当前不强制解析语义化版本 |
| `package.description` | 软件包说明，必填 |
| `package.license` | 许可证字符串，必填；约定使用 SPDX 标识，当前只校验非空 |
| `package.tags` | 目录分类，可选 |
| `package.maintainers` | 维护者列表，可选 |
| `build` | 构建命令，可选；省略表示无构建步骤 |
| `start` | 启动命令，必填 |
| `stop` | 停止命令，可选；由 `rbnx boot` / Soma 受管关闭时，在 Driver `CMD_SHUTDOWN` 后、终止进程组前执行；单独 `rbnx start` 不自动执行 |
| `capabilities` | 能力约定引用和预期导出清单；每项含约定 ID `name`，可选业务约定 TOML `path`，不替代码声明普通业务能力。未列 Driver 时，框架自动选择共享 `robonix/lifecycle/driver`；显式选择共享 Driver 仍受支持，多条 Driver 会使启动失败 |
| `depends` | 依赖元数据；解析、安装和构建排序仍在设计中，当前只展示记录，不自动获取、安装或注入路径 |

:::warning[后向兼容：`capabilities` 中的命名空间 Driver]
旧软件包可暂时在 `capabilities` 中保留唯一的精确 `<provider-namespace>/driver` 及其本地 TOML `path`，但计划迁移到共享 Driver。完整兼容和迁移规则见[软件包与部署清单规范](../integration-guide/packaging-spec.md#42-已有命名空间-driver-的兼容流程)。
:::

### 部署清单

| 字段 | 当前作用 |
|---|---|
| `manifestVersion` | 文档中的部署格式标记；当前 `rbnx` 和 Soma 不读取或校验该字段 |
| `name` | 本次部署名称 |
| `catalog` | 整机目录发布元数据；运行时忽略 |
| `env` | 在解析其余标量前设置环境变量 |
| `system` | 内置系统配置与额外系统软件包 |
| `primitive`、`service`、`skill` | 软件包实例列表 |
| 实例 `name` | 运行时提供方 ID，必须与代码一致 |
| 实例 `path` / `url` | 本地路径或远程仓库；每个原语、服务和技能实例必须且只能设置其中一个 |
| 实例 `branch` | 仅与 `url` 一起使用；首次克隆远程仓库时选择分支或标签。不支持任意提交 SHA，已有缓存不会因字段变化自动切换 |
| 实例 `manifest` | 选择软件包内的目标清单 |
| 实例 `config` | 透传给该实例的配置映射 |

部署清单的相对路径以部署文件所在目录为基准。软件包如何解释 `config` 由其 `config.spec` 和实现共同定义。远程包缓存在 `rbnx-boot/cache/`；修改 `branch` 后需要手动切换缓存中的源码检出，或用 `rbnx clean -f <manifest> --cache` 删除缓存再重新构建。

### 能力约定 TOML

| 字段 | 含义 |
|---|---|
| `contract.id` | 合并后能力约定目录中的接口名 |
| `contract.version` | 能力约定版本 |
| `contract.kind` | 文档和代码生成使用的分类元数据 |
| `contract.idl` | 相对 IDL 根目录的数据类型路径 |
| `contract.cross_namespace` | 允许共享接口跨提供方命名空间而不提示 |
| `contract.description` | 能力约定的通用说明，消费时与实例说明合并 |
| `contract.llm_callable` | 是否向 Pilot 的工具目录暴露该约定 |
| `mode.type` | RPC 或话题方向 |

同一 ID 在有效合并目录中只保留一个描述；后加载根可能覆盖先加载描述。软件包应复用标准能力约定，只有明确需要时才新增自定义 ID，并通过 `rbnx contracts -v` 检查最终来源。
