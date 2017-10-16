import path from 'path';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import string from 'rollup-plugin-string';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

import ObjectRestSpreadTransform from 'babel-plugin-transform-object-rest-spread';
import ExternalHelpersTransform from 'babel-plugin-external-helpers';

export default {
  input: 'index.js',
  output: {
    file: 'dist/gitter.js',
    format: 'umd'
  },
  name: 'Gitter',
  plugins: [
    string({
      include: '**/*.svg'
    }),
    babel({
      babelrc: false,
      "presets": [
        [ "env", {
          "modules": false
        } ]
      ],
      "plugins": [
        ObjectRestSpreadTransform,
        ExternalHelpersTransform
      ]
    }),
    resolve(),
    commonjs({
      include: [
        '**',
        'node_modules/**',
        '/absolute/path/to/diagram-js/**'
      ]
    }),
    // uglify(), // minify, but only in production
  ],
  sourcemap: true
};