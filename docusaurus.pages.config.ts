import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import config from './docusaurus.config';

// GitHub sets this automatically in Actions. Set it explicitly for local builds.
const repository = process.env.GITHUB_REPOSITORY;
if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository)) {
  throw new Error('Set GITHUB_REPOSITORY to your GitHub owner/repository.');
}
const [owner, name] = repository.split('/');
const baseUrl = name.toLowerCase() === `${owner.toLowerCase()}.github.io`
  ? '/'
  : `/${name}/`;
const [, classic] = config.presets![0] as [string, Preset.Options];
const docs = typeof classic.docs === 'object' ? classic.docs : {};
const theme = config.themeConfig as Preset.ThemeConfig;

export default {
  ...config,
  url: `https://${owner}.github.io`,
  baseUrl,
  organizationName: owner,
  projectName: name,
  presets: [[
    'classic',
    {
      ...classic,
      docs: {
        ...docs,
        editUrl: `https://github.com/${repository}/edit/user-guide/`,
        beforeDefaultRemarkPlugins: [
          ...(docs.beforeDefaultRemarkPlugins ?? []),
          [require('./scripts/remark-pages-links.cjs'), {baseUrl}],
        ],
      },
    } satisfies Preset.Options,
  ]],
  themeConfig: {
    ...theme,
    announcementBar: theme.announcementBar && {
      ...theme.announcementBar,
      content: theme.announcementBar.content?.replace(/href="\/(?!\/)/g, `href="${baseUrl}`),
    },
    navbar: {
      ...theme.navbar,
      items: theme.navbar?.items?.map((item) => item.label === '文档仓库'
        ? {...item, href: `https://github.com/${repository}`}
        : item),
    },
  } satisfies Preset.ThemeConfig,
} satisfies Config;
