import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  // 主插件
  {
    input: 'src/plugin/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: false,
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: ['postcss', 'postcss-value-parser'],
  },
  // 运行时版本 (包含所有依赖)
  {
    input: 'src/runtime.ts',
    output: {
      file: 'dist/runtime.js',
      format: 'umd',
      name: 'CSSTransformMatrix',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: [], // 运行时版本包含所有依赖
  },
  // PostCSS 插件版本
  {
    input: 'src/postcss-plugin.ts',
    output: {
      file: 'dist/postcss.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: false,
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: ['postcss', 'postcss-value-parser'],
  },
];
