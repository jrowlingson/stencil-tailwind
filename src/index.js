const MagicString = require('magic-string')
const fs = require('fs')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
// const { blue, magenta, red } = require('chalk')

// const log = console.log

let stylesTree

function _staticStyles(code) {
  if (code.match(/class: `(.+?)`/gs)) {
    let tokens = code.replace(/[\n'}]+/gm, '').match(/class: `(.+?)`/gs)
    console.log(tokens)
    tokens = tokens
      .map(str =>  str.match(/`(.*)`/)[1])
      .join(' ')
      .split(' ')
      .filter(s => s !== '')
    const result = stylesTree.root.nodes.reduce((acc, node) => {
        if (node.selector && tokens.includes(node.selector.substring(1))) {
          return node.toString().replace(/(\r\n|\n|\r)/gm, '') + ' \\n' + acc
        }
        return acc
      }, ' S')
    return result
  }
}

function rollupPluginTailwind() {

  return {
    name: 'rollup-plugin-tailwind',

    buildStart() {
      fs.readFile('src/app.css', (err, css) => {
        postcss([
          tailwindcss()
        ])
        .process(css)
        .then(result => {
          stylesTree = result
        })
      })
    },

    transform(code, id) {
      if (id.includes('components')) {
        if (id.includes('checkbox')) {
          let match = /STYLE_TEXT_PLACEHOLDER/.exec(code)
          if (match) {
            const s = new MagicString(code)
            // log(magenta("OVERWRITE:", s.toString()))
            const styles =  _staticStyles(code)
            if (styles) {
              s.overwrite(match.index, match.index + 1, styles)
            }
            return {
              code: s.toString()
            }
          }
        }
      }
    },

  }

}

module.exports = rollupPluginTailwind

