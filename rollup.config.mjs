import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declarationDir: 'dist/types',
    }),
    postcss({
      extract: 'styles.css',
      minimize: true,
    }),
  ],
  external: ['react', 'react-dom', 'antd', '@ant-design/icons', '@tiptap/react', '@tiptap/pm', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-underline', '@tiptap/extension-text-align', '@tiptap/extension-placeholder', '@tiptap/extension-link', '@tiptap/extension-highlight', '@tiptap/extension-code-block-lowlight', 'tiptap-markdown', 'lowlight'],
}
