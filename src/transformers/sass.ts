import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import { TransformResult } from 'rollup'

export default async function _transformSass(code: string): Promise<TransformResult> {
  const match = /(.* = ")(.*)(";[\s|\S]*)/.exec(code)
  // @ts-ignore
  const transformedStyles = await postcss([ tailwindcss() ])
    //@ts-ignore
    .process(match[2].replace(/\(\\"/g, '("').replace(/\\"\)/g, '")').replace(/\\n/g, ''))
    // @ts-ignore
    .then(result => match[1] + result.toString() + match[3])
  return {
    code: transformedStyles.replace(/[\n\r]*/g, '')
  }
}
