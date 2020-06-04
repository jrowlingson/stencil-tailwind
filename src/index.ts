import debug from './util/debug'
import postcss, { Root } from 'postcss'
import tailwindcss from 'tailwindcss'
import transformSass from './transformers/sass'
import transformTsx from './transformers/tsx'
import { Plugin, PluginOptions } from '../types'
import { promises as fsPromises } from 'fs'

const { readFile } = fsPromises

let postcssRoot: Root

export default function tailwind(opts?: PluginOptions): Plugin {

  const options = _buildOptions(opts)

  return {

    name: 'tailwind',

    async buildStart() {
      debug.time('build start')
      return readFile(options.inputFile).then(async css =>
        postcss([ tailwindcss() ])
          .process(css, { from: options.inputFile })
          .then(async result => {
            debug.time('style tree built')
            if (options.includeTailwindCss) {
              this.emitFile({
                type: 'asset',
                source: result.toString(),
                fileName: 'tailwind.css'
              })
            }
            postcssRoot = result.root!
          })
      )
    },

    async transform(sourceText, fileName) {
      if (fileName.includes('.scss')) {
        return await transformSass(sourceText)
      } else if (fileName.includes('.tsx')) {
        return transformTsx(sourceText, this.parse(sourceText, {}), postcssRoot)
      }
    },

  }

}

function _buildOptions(opts?: PluginOptions): PluginOptions {
  const defaults: PluginOptions = {
    inputFile: 'src/app.css',
    includeTailwindCss: true
  }
  return Object.assign({}, defaults, opts)
}
