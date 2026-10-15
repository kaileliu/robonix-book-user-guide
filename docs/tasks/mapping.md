---
last_update:
  date: 2026-10-14
---

# 创建并保存室内地图

本页把原[建图与定位指南](../components/mapping.md)和[场景界面说明](../components/scene.md#操作界面怎么用)整理为操作步骤。完成后得到一张可重新加载、用于定位的地图。

## 准备传感器与服务

确认机器人已有雷达或 RGB-D 相机、底盘里程计和可用的 [建图服务](https://hub.robonix.ai/package/robonix.service.mapping)。下文使用场景服务的地图界面，因此还需启用场景服务。原参考实现按室内场景设计，不包含室外定位的适配。

## 以建图模式启动

建新图时，让建图服务以 `map_mode: mapping` 启动，或保留默认的建图模式，再[启动机器人](../hub/run.md)。不要先加载旧地图：加载会进入定位模式。

需要再建一张图时，以建图模式重启服务，使用新的地图 ID 保存；不要把“从定位切回建图”当成继续扩展旧地图的步骤。

<span id="1-打开地图界面"></span>

## 打开地图界面

在机器人本机打开 [http://127.0.0.1:50107/user](http://127.0.0.1:50107/user)。未保存的实时会话显示 `unsaved live`。没有场景服务时，可使用建图服务的[独立界面](../components/mapping.md)。

![地图界面：当前地图、保存与加载入口](/img/ui/scene-user.webp)

<details>
<summary>从另一台电脑打开</summary>

将 `ROBOT_USER`、`ROBOT_HOST` 换成机器人用户名和地址，在操作者电脑建立转发：

```bash
ssh -N -L 50107:127.0.0.1:50107 ROBOT_USER@ROBOT_HOST
```

保持终端打开，访问上面的本地地址。`50107` 是场景服务默认端口，修改过时按[场景配置](../components/scene.md)调整；Console 的 `4880` 隧道不会转发地图界面。

</details>

<span id="2-走遍要保存的区域"></span>

## 走遍要保存的区域

使用这台机器人已经验证的控制方式，低速走过房间和走廊。确认通道安全、急停可用，观察地图与现场是否相符。

原 Webots 教程提供[RViz2 检查方法](../getting-started/quickstart.md#终端-1webotsros-2-与-rviz2)。自动探索需另有 [探索技能](https://hub.robonix.ai/package/robonix.skill.explore)及其建图、导航依赖，不能仅凭建图服务自动完成。

<span id="3-保存为新的地图"></span>

## 保存为新的地图

在 **Map ID** 填写新 ID，例如 `office_3f_v1`，点 **Save current**。成功后状态行显示写入结果和房间数量。

记录这个 ID，后续地图与房间标注用它关联。已保存地图的空间文件不能直接覆盖；重新建图使用新 ID。

<span id="4-重新加载地图"></span>

## 重新加载并检查定位

先保存需要保留的建图结果，再在列表中点 **Load**。加载会替换当前建图会话，未保存的新增部分会丢失。

界面依次检查地图文件、切换到定位模式、等待新的地图画面并恢复房间与对象。完成后检查机器人位置是否与现场一致；明显不符时，点 **Pose estimate**，再点地图上的实际位置，等待定位稳定。

定位正确后，可[指定导航目标](navigation.md)或[标注房间](scene.md)。参数和排错见[原建图指南](../components/mapping.md)。
