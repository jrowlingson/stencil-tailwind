import postcss from 'postcss';

export { Plugin } from 'rollup'

export interface PluginOptions {

  tailwind?: postcss.AcceptedPlugin;
  inputFile?: string,
  includeTailwindCss?: boolean

}

export default function tailwind(opts?: PluginOptions): Plugin
