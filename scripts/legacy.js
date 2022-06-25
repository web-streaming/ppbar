const { DEFAULT_EXTENSIONS } = require('@babel/core')
const { createBabelInputPluginFactory } = require('@rollup/plugin-babel');

const plugin = createBabelInputPluginFactory(() => ({
  options() {
    return {
      pluginOptions: {
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts', '.tsx'
        ],
        babelHelpers: 'bundled',
      },
    };
  },
  config(config) {
    if (config.hasFilesystemConfig()) {
      return config.options;
    }
    return {
      ...config.options,
      plugins: (config.options.plugins || []).filter(Boolean),
      presets: [
        ...(config.options.presets || []),
        [
          require('@babel/preset-env'),
          {
            modules: false,
            bugfixes: true,
            loose: false,
            useBuiltIns:  false,
            shippedProposals: true
          },
        ]
      ]
    }
  },
}));

module.exports = () => ({
  ...plugin(),
  enforce: 'post',
})
