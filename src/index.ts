import debug from './util/debug'
import postcss, { Root } from 'postcss'
import tailwindcss from 'tailwindcss'
import transformSass from './transformers/sass'
import transformTsx from './transformers/tsx'
import { Plugin } from 'rollup'
import { readFile, writeFile } from 'fs'

let stylesRoot: Root

export default function rollupPluginTailwind(): Plugin {

  return {

    name: 'rollup-plugin-tailwind',

    async buildStart() {
      debug.time('build start')
      return readFile('src/app.css', (_err, css) => {
        postcss([
          tailwindcss()
        ])
          .process(css)
          .then(result => {
            debug.time('style tree built')
            stylesRoot = result.root!
            writeFile('www/build/tailwind.css', result.css, () => true)
          })
      })
    },

    async transform(code, id) {
      if (id.includes('.scss')) {
        return await transformSass(code)
      } else if (id.includes('.tsx')) {
        return transformTsx(code, this.parse(code, {}), stylesRoot)
      }
    },

  }

}
