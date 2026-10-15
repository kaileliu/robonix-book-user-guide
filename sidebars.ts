import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// 日常使用按用户目标组织；代码开发、适配和字段参考保留独立入口。
const sidebars: SidebarsConfig = {
  handbook: [
    {type: 'doc', id: 'home', label: '认识 Robonix'},
    {
      type: 'category', label: '快速体验',
      items: [
        'getting-started/online-demo',
        'getting-started/simulation',
      ],
    },
    {
      type: 'category', label: '安装与连接',
      link: {type: 'doc', id: 'integration-guide/index'},
      items: [
        'hub/install', 'hub/catalog', 'hub/configure', 'hub/run',
        'getting-started/client', 'getting-started/first-task',
      ],
    },
    {
      type: 'category', label: '机器人任务',
      link: {type: 'doc', id: 'tasks/index'},
      items: ['tasks/mapping', 'tasks/navigation', 'tasks/scene'],
    },
    {
      type: 'category', label: '日常管理',
      link: {type: 'doc', id: 'hub/index'},
      items: ['hub/deployments', 'hub/history', 'hub/cloud', 'hub/assistant', 'hub/maintenance'],
    },
    'troubleshooting/index',
    'concepts/glossary',
    {
      type: 'category', label: '开发与进阶适配',
      link: {type: 'doc', id: 'development/index'},
      items: [
        {
          type: 'category', label: '开发软件包',
          items: [
            'developer-guide',
            'development/package-start',
            'development/package-concepts',
            'development/package-structure',
            'development/implement-primitive',
            'development/implement-service',
            'development/implement-skill',
            'development/package-deployment',
            'development/python-api',
            'development/package-reference',
            {type: 'doc', id: 'tutorials/existing-python-feature', label: '抓积木接入示例'},
            'integration-guide/packaging-spec',
            'integration-guide/build-and-codegen',
            'integration-guide/package-catalog',
            'integration-guide/result-verification',
          ],
        },
        {
          type: 'category', label: '适配新机器人',
          items: [
            'development/robot-support',
            'integration-guide/vendor-onboarding',
            {type: 'doc', id: 'integration-guide/mujoco-simulation-onboarding', label: 'MuJoCo 仿真本体接入'},
          ],
        },
        {
          type: 'category', label: '命令行与多平台部署',
          items: [
            {type: 'doc', id: 'getting-started/quickstart', label: 'Webots 命令行部署'},
            {type: 'doc', id: 'components/rbnx', label: 'rbnx 命令行'},
            'architecture/deployment-and-startup',
            'architecture/multiplatform-deployment',
            {type: 'doc', id: 'getting-started/x86-ubuntu-la-arch/README', label: 'x86 仿真 + LoongArch 部署'},
            {type: 'doc', id: 'getting-started/jetson-x86-webots/README', label: 'x86 仿真 + ARM64 部署'},
          ],
        },
        {
          type: 'category', label: '组件配置详解',
          items: [
            {type: 'doc', id: 'components/mapping', label: '建图与定位'},
            {type: 'doc', id: 'components/navigation', label: '导航'},
            {type: 'doc', id: 'components/scene', label: '场景服务'},
            {type: 'doc', id: 'appendix/speech-backends', label: '语音后端配置'},
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '工作原理',
      items: [
        'architecture/components',
        'architecture/runtime-communication',
        'architecture/namespace-and-contracts',
        'architecture/atlas',
        'background/eaios',
      ],
    },
    {
      type: 'category',
      label: '接口目录',
      items: [
        {type: 'doc', id: 'interface-catalog/index', label: '接口目录总览'},
        {
          type: 'category',
          label: '原语',
          items: [
            {type: 'doc', id: 'interface-catalog/primitive/index', label: '原语概览'},
            {type: 'doc', id: 'interface-catalog/primitive/chassis', label: '底盘'},
            {type: 'doc', id: 'interface-catalog/primitive/arm', label: '机械臂'},
            {type: 'doc', id: 'interface-catalog/primitive/hand', label: '灵巧手'},
            {type: 'doc', id: 'interface-catalog/primitive/quadruped', label: '四足底盘'},
            {type: 'doc', id: 'interface-catalog/primitive/camera', label: '相机'},
            {type: 'doc', id: 'interface-catalog/primitive/lidar', label: '激光雷达'},
            {type: 'doc', id: 'interface-catalog/primitive/imu', label: '惯性测量单元'},
            {type: 'doc', id: 'interface-catalog/primitive/audio', label: '音频'},
            {type: 'doc', id: 'interface-catalog/primitive/health', label: '设备健康'},
            {type: 'doc', id: 'interface-catalog/primitive/robot-description', label: '机器人描述'},
          ],
        },
        {
          type: 'category',
          label: '服务',
          items: [
            {type: 'doc', id: 'interface-catalog/service/index', label: '服务概览'},
            {type: 'doc', id: 'interface-catalog/service/map', label: '空间地图'},
            {type: 'doc', id: 'interface-catalog/service/navigation', label: '导航'},
            {type: 'doc', id: 'interface-catalog/service/speech', label: '语音'},
            {type: 'doc', id: 'interface-catalog/service/voiceprint', label: '声纹'},
            {type: 'doc', id: 'interface-catalog/service/memory', label: '记忆'},
            {type: 'doc', id: 'interface-catalog/service/verifier', label: '结果验证'},
          ],
        },
        {
          type: 'category',
          label: '技能',
          items: [{type: 'doc', id: 'interface-catalog/skill/index', label: '技能概览'}],
        },
        {
          type: 'category',
          label: '系统',
          items: [
            {type: 'doc', id: 'interface-catalog/system/index', label: '系统概览'},
            {type: 'doc', id: 'interface-catalog/system/soma', label: '本体模型'},
            {type: 'doc', id: 'interface-catalog/system/vitals', label: '健康评估'},
            {type: 'doc', id: 'interface-catalog/system/pilot', label: '规划与决策'},
            {type: 'doc', id: 'interface-catalog/system/executor', label: '任务执行'},
            {type: 'doc', id: 'interface-catalog/system/liaison', label: '用户交互'},
            {type: 'doc', id: 'interface-catalog/system/scene', label: '场景理解'},
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '自动生成的参考',
      items: [
        {type: 'doc', id: 'reference/index', label: '生成说明'},
        'reference/contracts',
        'reference/idl',
        'reference/api',
      ],
    },
    {
      type: 'category',
      label: '参与维护',
      items: [
        {type: 'doc', id: 'contributing/robonix', label: '贡献 Robonix 代码'},
        {type: 'doc', id: 'contributing/documentation', label: '维护文档'},
      ],
    },
  ],
};

export default sidebars;
