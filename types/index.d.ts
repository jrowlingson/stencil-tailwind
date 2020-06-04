export { Plugin } from 'rollup'

export interface PluginOptions {

  inputFile: string,
  includeTailwindCss: boolean

}

export default function tailwind(opts?: PluginOptions): Plugin
