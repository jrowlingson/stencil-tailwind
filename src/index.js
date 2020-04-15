const MagicString = require('magic-string')
const fs = require('fs')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

// const log = console.log
// const { blue, magenta, red } = require('chalk')

let stylesTree

function rollupPluginTailwind(path) {

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

        // TODO: jrowlingson - enable @theme()
        // postcss([
        //   tailwindcss()
        // ])
        //   .process(match[1].replace(/\\"/gm, '"'))
        //   .then(result => {
        //     log(red(result))
        //   })
      }
    },

  }

}

function _staticStyles(code) {
  const classes = _parseClasses(code)
  // log(blue(classes))
  if (classes) {
    return stylesTree.root.nodes.reduce((acc, node) =>
      node.selector && classes.includes(node.selector.substring(1))
        ? node.toString().replace(/(\r\n|\n|\r)/gm, '') + ' \\n' + acc
        : acc, '')
  }
}

function _parseClasses(code) {
  const classAttrs = code.match(/class: ["`](.+?)["`]/gs)
  if (classAttrs) {
    return classAttrs
      .map(str => str.replace(/[\n'{}$:?]+/gm, ''))
      .map(str => str.match(/["`](.*)["`]/)[1])
      .join(' ')
      .split(' ')
      .filter(str => str !== '')
  }
}

module.exports = rollupPluginTailwind

