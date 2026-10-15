---
last_update:
  date: 2026-10-14
---

# 组装并运行开发部署

本页帮助你把已实现的软件包加入部署清单，构建、启动、检查能力并停止。开始前准备好相关软件包和模型参数。没有真实硬件的开发者可先使用[模板教程](package-start.md)；下面的部署结构也供真实机器人适配参考，按实际实现选择条目。

## 部署目录

部署仓库负责选择软件包实例和机器人专属配置：

```text
robot-acme-rover/
├── robonix_manifest.yaml
├── soma.yaml
├── urdf/
│   └── acme_rover.urdf
├── config/
├── assets/
├── primitives/
├── services/
└── skills/
```

`primitives/`、`services/` 和 `skills/` 是推荐布局，不是运行时强制目录。部署清单中的 `path` 可以指向仓库内其他位置；可复用软件包通常使用 `url` 引用独立仓库。

从[创建软件包骨架](package-structure.md)继续操作时，当前目录已经是 `robot-acme-rover`，无需再次初始化。若从本节开始阅读，则先创建部署骨架：

```bash
rbnx init robot-acme-rover
cd robot-acme-rover
mkdir -p config primitives services skills urdf assets
```

`rbnx init` 当前只创建部署目录、`robonix_manifest.yaml` 和 `.gitignore`，其余目录需要按本体需要建立。

## 部署清单

```yaml
manifestVersion: 1
name: robot-acme-rover

catalog:
  name: robonix.robot.acme.rover
  version: 0.1.0
  description: Robonix deployment for ACME Rover.
  license: Apache-2.0
  tags: [robot, deploy, acme, rover]
  maintainers:
    - Your Name <you@example.com>

system:
  atlas: { listen: 127.0.0.1:50051, log: info }
  soma:
    listen: 127.0.0.1:50091
    robot_yaml: soma.yaml
    log: info
  vitals: { listen: 127.0.0.1:50093, log: info }
  scene:
    manifest: package_manifest.yaml
    config:
      web_port: 50107
  executor: { listen: 127.0.0.1:50061, log: info }
  pilot:
    listen: 127.0.0.1:50071
    log: info
    vlm:
      upstream: "${VLM_BASE_URL}"
      api_key: "${VLM_API_KEY}"
      model: "${VLM_MODEL}"
      api_format: openai
  liaison: { listen: 0.0.0.0:50081, log: info }

primitive:
  - name: base_chassis
    path: ./primitives/base_chassis
    config: {}

service:
  - name: my_navigate
    path: ./services/my_navigate
    config: {}

skill:
  - name: say_hello
    path: ./skills/say_hello
    config: {}
```

这个完整系统块包含七项：能力目录（Atlas）、本体状态（Soma）、健康状态（Vitals）、环境状态（Scene）、任务执行（Executor）、模型规划（Pilot）、交互入口（Liaison）。`scene.manifest` 选择 Scene 软件包的运行目标，`scene.config` 通过 Scene 的 Driver 传入；未指定 `camera_provider_id` 时，Scene 按能力约定自动发现可用观测源。

实例 `config` 在初始化时通过 Driver 发送。软件包应在 `on_init(cfg)` 中校验字段并返回清楚的错误，公开字段同时写入 `config.spec`。

远程软件包使用 `url`，本地软件包使用 `path`。`manifest` 选择软件包提供的平台清单，例如 Jetson 原生清单。提供平台变体时仍要保留默认 `package_manifest.yaml`；完整字段见[软件包与部署清单规范](../integration-guide/packaging-spec.md)。

## 构建、启动与停止

在部署目录执行：

```bash
rbnx build
rbnx boot
```

启动时可以依赖以下阶段顺序：

1. 未使用 `--skip-system` 时，启动清单中声明的 Atlas、Executor；存在原语或技能时，未显式声明的 Soma 会被自动补入并启动；
2. Soma 启动原语；没有原语时跳过；
3. 启动清单中声明的其余内置组件（如 Vitals、Pilot、Liaison）、额外系统软件包和服务；
4. Soma 启动技能并通过其唯一 Driver 发送 `CMD_INIT`，技能停在 `INACTIVE`；没有技能时跳过。

使用 `--skip-system` 时，`rbnx` 跳过整个 `system` 块和由本次启动管理的 Soma 原语/技能阶段，只连接外部 Atlas 并启动服务。此模式下，操作方必须另行保证外部系统、原语和技能已经就绪。

`rbnx boot` 输出启动摘要后，按以下结果判断成功：

1. 摘要没有 `failures`、`[FAIL]` 或失败的软件包；
2. `rbnx caps -v` 包含清单中预期的每个提供方及能力；
3. 原语和服务通常为 `ACTIVE`，尚未调用的技能通常为 `INACTIVE`；
4. `rbnx logs -t <provider_id>` 没有初始化、连接或配置错误。

常用诊断：

```bash
rbnx caps -v
rbnx tools
rbnx channels
rbnx inspect
rbnx logs --list-tags
rbnx logs -t my_navigate -l warn
rbnx logs -t my_navigate -f
```

以上命令应在机器人部署目录执行；从其他目录读取时使用 `rbnx logs -d /path/to/deploy/rbnx-boot/logs ...`。不带 `-f` 会读取并按时间排序已有记录；`-f` 从当前已经存在的日志文件末尾开始，只显示后续新增记录。每次 `rbnx boot` 会清空本次日志目录中已有的 `*.log`，复现故障前先保存需要保留的日志。

启动阶段需要实时逐行观察 INFO、WARN 和 ERROR 时使用：

```bash
rbnx boot -v -f robonix_manifest.yaml
```

`-v` 会关闭 spinner 与光标回写，但不会启用 DEBUG；完整记录仍写入 `rbnx-boot/logs/`。

停止当前部署：

```bash
rbnx shutdown
```

该命令读取原部署清单，依次发送生命周期关闭、执行软件包 `stop` 钩子，并终止受管进程。原部署清单必须仍然存在且可解析。容器化软件包还应在自己的 `stop` 钩子中删除或停止由它创建的容器。


## 下一步

准备交付时，检查[软件包规范](../integration-guide/packaging-spec.md)并完成[结果验证](../integration-guide/result-verification.md)。
