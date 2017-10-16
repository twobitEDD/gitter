import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import string from 'rollup-plugin-string';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  entry: 'src/Gitter.js',
  dest: 'dist/gitter.js',
  format: 'umd', // immediately-invoked function expression — suitable for <script> tags
  name: 'Gitter',
  plugins: [
    resolve(),
    // uglify(), // minify, but only in production
    string({
      include: '**/*.svg'
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs() // converts date-fns to ES modules
  ],
  sourceMap: true
};