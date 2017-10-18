import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import string from 'rollup-plugin-string';
import legacy from 'rollup-plugin-legacy';

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
  context: 'window',
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
    legacy({
      'node_modules/p5/lib/p5.js': 'p5',
      'node_modules/p5/lib/addons/p5.sound.js': 'p5_sound'
    }),
    commonjs({
      include: [
        '**',
        'node_modules/**'
      ]
    })
  ],
  sourcemap: true
};