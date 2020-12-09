import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import clear from 'rollup-plugin-clear'
import babel from 'rollup-plugin-babel'

const esmPackage = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.esm.js',
    format: 'esm',
    name: 'shatter',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    clear({
      targets: ['dist']
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true
    }),
    babel({
      extensions: [".js", ".ts"],
      exclude: "node_modules/**"
    })
  ]
}
const cjsPackage = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    name: 'shatter',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    babel({
      extensions: [".js", ".ts"],
      exclude: "node_modules/**"
    })
  ]
}
const localDebug = {
  input: 'src/index.ts',
  output: {
    file: `${process.cwd()}/dist/bundle.js`,
    format: 'esm',
    name: 'shatter'
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    babel({
      extensions: [".js", ".ts"],
      exclude: "node_modules/**"
    })
  ]
}
const iifePackage = {
  input: 'src/index.ts',
  output: {
    file: 'build/index.min.js',
    format: 'iife',
    name: 'shatter'
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    clear({
      targets: ['build']
    }),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    terser(),
    babel({
      extensions: [".js", ".ts"],
      exclude: "node_modules/**"
    })
  ]
}
const examplePackage = {
  input: 'src/index.ts',
  output: {
    file: 'examples/shatter.js',
    format: 'iife',
    name: 'shatter'
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    typescript({
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    babel({
      extensions: [".js", ".ts"],
      exclude: "node_modules/**"
    })
  ]
}
const total = {
  esmPackage,
  iifePackage,
  examplePackage,
  localDebug,
  cjsPackage
}
let result = total
const ignore = process.env.IGNORE
const include = process.env.INCLUDE
console.log(`ignore: ${ignore}, include: ${include}`)
if (ignore) {
  delete total[ignore]
  result = total
}
if (include) {
  result = [total[include]]
}
export default [...Object.values(result)]