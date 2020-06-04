import { RollupBuild, OutputOptions } from 'rollup'

export default async function(bundle: RollupBuild, customOptions: OutputOptions  = {}) {
  const options = Object.assign({ format: 'cjs' }, customOptions);
  return (await bundle.generate(options)).output[0].code;
}
