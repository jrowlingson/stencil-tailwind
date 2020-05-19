export default async function(bundle, customOptions = {}) {
  const options = Object.assign({ format: 'cjs' }, customOptions);
  return (await bundle.generate(options)).output[0].code;
}

