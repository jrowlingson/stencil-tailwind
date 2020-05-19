import MagicString from 'magic-string'
import chalk from 'chalk'
import debug from 'debug'
import fs from 'fs'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import walk from 'acorn-walk'

const { red, blue, yellow } = chalk
const log = debug('rollup-tw')
const logtime = debug('rollup-tw:t')

let stylesTree

export default function rollupPluginTailwind() {

  return {

    name: 'rollup-plugin-tailwind',

    async buildStart() {
      logtime('build start')
      return fs.readFile('src/app.css', (err, css) => {
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
        return _transformTsx(code, this.parse(code))
      }
    },

  }

}

function _transformTsx(code,node) {
  let match = /= (.*?Style);/.exec(code)
  if (match) {
    log(red(code))
    const s = new MagicString(code)
    const styles = _staticStyles(node)
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
  log(red(classes))
  if (classes) {
    return stylesTree.root.nodes.reduce((acc, node) =>
      node.selector && classes.includes(node.selector.replace(/\\/, '').match(/([a-zA-Z0-9-]+$|[a-zA-Z0-9-]+:[a-zA-Z0-9-]+)/)[0])
        ? node.toString().replace(/(\r\n|\n|\r)/gm, '') + ' \\n' + acc
        : acc, '')
  }
}

function _parseClasses(node) {
  return _parseStyleDecorator(node).concat(_parseInlineClasses(node))
}

function _parseInlineClasses(node) {
  let result = []
  walk.simple(node, {
    Property({ key: { name }, value }) {
      if (name === 'class') {
        walk.simple(value, {
          Literal(n) {
            result = result.concat(_trimSizingDsl(n.value).split(' '))
          }
        })
      }
    }
  })
  return result
}

function _parseStyleDecorator(node) {
  let result = []
  walk.simple(node, {
    CallExpression(ce) {
      if (ce.callee.name === '__decorate') {
        walk.simple(ce, {
          Literal(lit) {
            walk.simple(node, {
              AssignmentExpression(ae) {
                if(ae.left.property.name === lit.value) {
                  walk.simple(ae.right.body, {
                    Property(p) {
                      result = result.concat(_trimSizingDsl(p.key.value).split(' '))
                    }
                  })
                }
              }
            })
          }
        })
      }
    },

  })
  return result
}

function _trimSizingDsl(string) {
  return string.replace(/\S+<|[<>]/gm, '')
}
