const MagicString = require('magic-string')
const fs = require('fs')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

// const log = console.log
// const { blue, magenta, red } = require('chalk')

let stylesTree

function _staticStyles(code) {
  if (code.match(/class: "(.+?)"/gs)) {
    let tokens = code.replace(/[\n'}]+/gm, '').match(/class: "(.+?)"/gs)
    tokens = tokens
      .map(str =>  str.match(/"(.*)"/)[1])
      .join(' ')
      .split(' ')
      .filter(s => s !== '')
    const result = stylesTree.root.nodes.reduce((acc, node) => {
      if (node.selector && tokens.includes(node.selector.substring(1))) {
        return node.toString().replace(/(\r\n|\n|\r)/gm, '') + ' \\n' + acc
      }
      return acc
    }, '')
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
          let match = /= (.*?Style);/.exec(code)
          if (match) {
            const s = new MagicString(code)
            const styles = _staticStyles(code)
            if (styles) {
              s.overwrite(match.index, match.index + match[1].length + 2,`= \`${styles} \${${match[1]}}\``)
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

