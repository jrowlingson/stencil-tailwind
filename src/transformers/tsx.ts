import MagicString from 'magic-string'
import debug from '../util/debug'
import walk from 'acorn-walk'
import { Node } from 'acorn'
import { root, AtRule, ChildNode, Root, Rule } from 'postcss'
import { TransformResult } from 'rollup'

export default function transformTsx(code: string, node: Node, cssRoot: Root): TransformResult {
  let match = /= (.*?Style);/.exec(code)
  if (match) {
    debug.red('transformTsx:code:\n',code)
    const s = new MagicString(code)
    const utilityClasses = _buildTailwindClassList(node, cssRoot)
    if (utilityClasses) {
      s.overwrite(match.index, match.index + match[1].length + 2,`= \`${utilityClasses} \${${match[1]}}\``)
    }
    return {
      code: s.toString().replace(/\\/g, '\\\\')
    }
  }
}

function _buildTailwindClassList(node: Node, cssRoot: Root): string | undefined {
  const classes = _parseClasses(node)
  if (classes.length) {
    const nodes = cssRoot?.nodes?.filter(isRule).filter(rule => {
      const match = rule.selector.replace(/\\/g, '').match(/([a-zA-Z0-9-]+$|[a-zA-Z0-9-]+:[a-zA-Z0-9-]+)/)
      if (match && classes.includes(match[0])) {
        return rule
      }
    });

    const atRules = cssRoot?.nodes?.filter(isAtRule).map(atRule => {
      atRule.nodes = atRule.nodes?.filter(isRule).filter(rule => {
        const match = rule.selector.replace(/\\/g, '').match(/([a-zA-Z0-9-]+$|[a-zA-Z0-9-]+:[a-zA-Z0-9-]+)/);
        if (match && classes.includes(match[0])) {
          return rule
        }
      });
      return atRule;
    }).filter(rule => rule.nodes !== []);
    const newRoot = root({})

    if (nodes) {
      newRoot.append(nodes);
    }
    if (atRules) {
      newRoot.append(atRules);
    }

    return newRoot.toString();
  }
}

function _parseClasses(node: Node) {
  return _parseStyleDecorator(node).concat(_parseInlineClasses(node)).filter(c => c !== "")
}

function _parseInlineClasses(node: Node) {
  let result: string[] = []
  walk.simple(node, {
    Property(prop: any) {
      if (prop?.key?.name === 'class') {
        walk.simple(prop?.value, {
          Literal(n: any) {
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
    CallExpression(ce: any) {
      if (ce.callee?.name === '__decorate') {
        walk.simple(ce, {
          Literal(lit: any) {
            walk.simple(node, {
              AssignmentExpression(ae: any) {
                if(ae.left.property?.name === lit.value) {
                  walk.simple(ae.right.body, {
                    Property(prop: any) {
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

function isRule(node: ChildNode): node is Rule {
  return node.type === "rule";
}

function isAtRule(node: ChildNode): node is AtRule {
  return node.type === "atrule"
}