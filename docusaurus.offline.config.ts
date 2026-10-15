import config from './docusaurus.config';

// Render all sidebar entries and diagram sources before removing the SPA runtime.
export default {
  ...config,
  customFields: {...config.customFields, offline: true},
  presets: config.presets!.map((preset) => {
    if (!Array.isArray(preset) || preset[0] !== 'classic') return preset;
    const options = preset[1] as {docs: Record<string, unknown>};
    return [preset[0], {...options, docs: {...options.docs, sidebarCollapsed: false}}];
  }),
};
