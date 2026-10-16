import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {existsSync} from 'node:fs';
import {robonixDark, robonixLight} from './src/prism-robonix';

const hasGitMetadata = existsSync('.git');

const config: Config = {
  title: 'Robonix 手册',
  tagline: '从第一次体验到机器人日常使用与开发适配',
  favicon: 'img/robonix-mark.svg',
  clientModules: [require.resolve('./src/prism-rosidl.ts')],
  url: 'https://book.robonix.ai',
  baseUrl: '/',
  organizationName: 'syswonder',
  projectName: 'robonix-book',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  trailingSlash: false,
  future: {v4: true},
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  plugins: ['docusaurus-plugin-image-zoom'],
  markdown: {mermaid: true},
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en', 'zh'],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/syswonder/robonix-book/edit/main/',
          showLastUpdateAuthor: hasGitMetadata,
          showLastUpdateTime: hasGitMetadata,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // 所有正文图片可点击放大；截图里的小字需要放大才看得清。
    // 字段名以 docusaurus-plugin-image-zoom 为准：themeConfig.zoom，子键是 config。
    zoom: {
      selector: '.markdown img',
      background: {light: 'rgba(248,249,251,.97)', dark: 'rgba(12,14,18,.97)'},
      config: {margin: 24, scrollOffset: 0},
    },
    announcementBar: {
      id: 'start-with-robonix',
      content: '<span class="source-baseline"><a href="https://hub.robonix.ai/discover">Hub 选配置</a> · <a href="/hub">Console 启动机器人</a> · <a href="/getting-started/first-task">Client 下达任务</a></span>',
      backgroundColor: '#eef1ff',
      textColor: '#283689',
      isCloseable: false,
    },
    image: 'img/robonix.svg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Robonix',
      logo: {
        alt: 'Robonix',
        src: 'img/robonix-mark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'handbook',
          position: 'left',
          label: '手册',
        },
        {
          href: 'https://hub.robonix.ai/discover',
          label: 'Hub 软件包目录',
          position: 'right',
        },
        {
          href: 'https://github.com/syswonder/robonix',
          label: 'Robonix 源码',
          position: 'right',
        },
        {
          href: 'https://github.com/syswonder/robonix-book',
          label: '文档仓库',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '快速入口',
          items: [
            {label: '运行 TIAGo 仿真', to: '/getting-started/simulation'},
            {label: '使用我的机器人', to: '/integration-guide'},
            {label: '问题排查', to: '/troubleshooting'},
            {label: '开发与进阶适配', to: '/development'},
          ],
        },
        {
          title: '社区',
          items: [
            {label: 'GitHub', href: 'https://github.com/syswonder/robonix'},
            {label: 'Hub 软件包目录', href: 'https://hub.robonix.ai/discover'},
            {label: '文档贡献', to: '/contributing/documentation'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Syswonder.`,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    prism: {
      theme: robonixLight,
      darkTheme: robonixDark,
      additionalLanguages: ['bash', 'rust', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
