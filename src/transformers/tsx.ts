import MagicString from 'magic-string'
import debug from '../util/debug'
import walk from 'acorn-walk'
import { Node } from 'acorn'
import { Root } from 'postcss'
import { TransformResult } from 'rollup'

export default function transformTsx(code: string, node: Node, cssRoot: Root): TransformResult {
  let match = /= (.*?Style);/.exec(code)
  if (match) {
    debug.red(code)
    const s = new MagicString(code)
    const styles = _staticStyles(node, cssRoot)
    if (styles) {
      s.overwrite(match.index, match.index + match[1].length + 2,`= \`${styles} \${${match[1]}}\``)
    }
    return {
      code: s.toString().replace(/\\:/g, '\\\\:')
    }
  }
}

function _staticStyles(node: Node, cssRoot: Root): string | undefined {
  const classes = _parseClasses(node)
  if (classes.length) {
    return cssRoot?.nodes?.reduce((acc: any, node: any) =>
      node.selector && classes.includes(node.selector.replace(/\\/, '').match(/([a-zA-Z0-9-]+$|[a-zA-Z0-9-]+:[a-zA-Z0-9-]+)/)[0])
        ? node.toString().replace(/(\r\n|\n|\r)/gm, '') + ' \\n' + acc
        : acc, '')
  }
}

function _parseClasses(node: Node) {
  return _parseStyleDecorator(node).concat(_parseInlineClasses(node))
}

function _parseInlineClasses(node: Node) {
  let result: string[] = []
  walk.simple(node, {
    Property(prop: any) {
      if (prop?.key?.name === 'class') {
        walk.simple(prop?.value, {
          Literal(n) {
            // @ts-ignore
            result = result.concat(_trimSizingDslSyntax(n.value).split(' '))
          }
        })
      }
    }
  })
  return result
}

function _parseStyleDecorator(node: Node) {
  let result: string[] = []
  walk.simple(node, {
    CallExpression(ce) {
      // @ts-ignore
      if (ce.callee?.name === '__decorate') {
        walk.simple(ce, {
          Literal(lit) {
            walk.simple(node, {
              AssignmentExpression(ae) {
                // @ts-ignore
                if(ae.left.property?.name === lit.value) {
                  // @ts-ignore
                  walk.simple(ae.right.body, {
                    Property(prop) {
                      // @ts-ignore
                      result = result.concat(_trimSizingDslSyntax(prop.key.value).split(' '))
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

function _trimSizingDslSyntax(s: string) {
  return s.toString().replace(/\S+<|[<>]/gm, '')
}
