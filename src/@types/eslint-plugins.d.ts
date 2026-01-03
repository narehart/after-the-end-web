declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint, Linter } from 'eslint';

  interface JSXa11yPlugin extends ESLint.Plugin {
    flatConfigs: {
      recommended: Linter.Config;
      strict: Linter.Config;
    };
  }

  const plugin: JSXa11yPlugin;
  export default plugin;
}

declare module 'eslint-plugin-css-modules' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}
