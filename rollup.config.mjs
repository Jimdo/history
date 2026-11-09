import { readFileSync } from 'node:fs';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const input = './modules/index.js';
const globalName = 'History';

function external(id) {
  return !id.startsWith('.') && !id.startsWith('/');
}

function replaceNodeEnv(value) {
  return replace({
    preventAssignment: true,
    values: { 'process.env.NODE_ENV': JSON.stringify(value) }
  });
}

const bundledHelpers = () =>
  babel({ exclude: /node_modules/, babelHelpers: 'bundled' });

const runtimeHelpers = () =>
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
    plugins: [['@babel/transform-runtime', { useESModules: true }]]
  });

const cjsOutput = { format: 'cjs', esModule: true, interop: 'compat' };

const cjs = [
  {
    input,
    output: { ...cjsOutput, file: `cjs/${pkg.name}.js` },
    external,
    plugins: [bundledHelpers(), replaceNodeEnv('development')]
  },
  {
    input,
    output: { ...cjsOutput, file: `cjs/${pkg.name}.min.js` },
    external,
    plugins: [bundledHelpers(), replaceNodeEnv('production'), terser()]
  }
];

const esm = [
  {
    input,
    output: { file: `esm/${pkg.name}.js`, format: 'esm' },
    external,
    plugins: [runtimeHelpers()]
  }
];

const umd = [
  {
    input,
    output: { file: `umd/${pkg.name}.js`, format: 'umd', name: globalName },
    plugins: [
      runtimeHelpers(),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      replaceNodeEnv('development')
    ]
  },
  {
    input,
    output: {
      file: `umd/${pkg.name}.min.js`,
      format: 'umd',
      name: globalName
    },
    plugins: [
      runtimeHelpers(),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      replaceNodeEnv('production'),
      terser()
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs;
    break;
  case 'esm':
    config = esm;
    break;
  case 'umd':
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

export default config;
