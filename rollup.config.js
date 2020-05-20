import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  plugins: [ typescript() ],
  output: [
    { format: 'esm', file: pkg.module },
    { format: 'cjs', file: pkg.main }
  ],
  external: [ 'module', 'tailwindcss',  Object.keys(pkg.dependencies || {}) ]
}
