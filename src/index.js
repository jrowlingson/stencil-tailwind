const MagicString = require('magic-string')
const fs = require('fs')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const { red, blue, yellow } = require('chalk')

const debug = require('debug')('rollup-tw')
const logtime = require('debug')('rollup-tw:t')

let stylesTree

function rollupPluginTailwind() {

  return {
    name: 'rollup-plugin-tailwind',

    buildStart() {
      logtime('build start')
      fs.readFile('src/app.css', (err, css) => {
        postcss([
          tailwindcss()
        ])
        .process(css)
        .then(result => {
          stylesTree = result
          logtime('style tree built')
          fs.writeFile('www/build/tailwind.css', result.css, () => true)
        })
      })
    },

    async transform(code, id) {
      if (id.includes('.scss')) {
        return await _transformStyles(code)
      }
      if (id.includes('/components')) {
        return _transformTsx(code)
      }
    },

  }

}

function _transformTsx(code) {
  let match = /= (.*?Style);/.exec(code)
  if (match) {
    const s = new MagicString(code)
    const styles = _staticStyles(code)
    if (styles) {
      s.overwrite(match.index, match.index + match[1].length + 2,`= \`${styles} \${${match[1]}}\``)
    }
    return {
      code: s.toString().replace(/\\:/g, '\\\\:')
    }
  }
}

async function _transformStyles(code) {
  const match = /(.* = ")(.*)(";[\s|\S]*)/.exec(code)
  const transformedStyles = await postcss([ tailwindcss() ])
    .process(match[2].replace(/\(\\"/g, '("').replace(/\\"\)/g, '")').replace(/\\n/g, ''))
    .then(result => match[1] + result.toString() + match[3])
  return {
    code: transformedStyles.replace(/[\n\r]*/g, '')
  }
}

function _staticStyles(code) {
  const classes = _parseClasses(code)
  debug(classes)
  if (classes) {
    return stylesTree.root.nodes.reduce((acc, node) =>
      node.selector && classes.includes(node.selector.substring(1).replace(/\\/, '').replace(/(?<=:.*):.*/, ''))
        ? node.toString().replace(/(\r\n|\n|\r)/gm, '') + ' \\n' + acc
        : acc, '')
  }
}

function _parseClasses(code) {
  const classAttrs = code.match(/class: .*?["`](.+?)["`]/gs)
  if (classAttrs) {
    return classAttrs
      .map(str => str.replace(/this.\S+|:\s|\S+<|[\n'{}$?<>+=|()]+/gm, ''))
      .map(str => str.match(/["`](.*)["`]/)[1])
      .map(_parseExperimentalDsl)
      .join(' ')
      .split(' ')
      .filter(str => str !== '')
  }
}

function _parseExperimentalDsl(str) {
  const matches = str.match(/\S+\[(.*?)]/g)
  if (matches) {
    const expanded = matches.reduce((acc, token) => {
      const tokens = token.match(/(\S+)\[(.*?)]/)
      return `${acc} ${tokens[1]} ${tokens[1]}${tokens[2].split(' ')[0]} ${tokens[1]}${tokens[2].split(' ')[1]}`
    }, '')
    return `${str} ${expanded}`
  }
  return str
}

module.exports = rollupPluginTailwind
