const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: [
    './src/Gitter.js'
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'gitter.js',
    library: 'Gitter',
    libraryTarget: 'umd'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets/css', to: 'css' },
      { from: 'assets/bpmn-font', to: 'bpmn-font' },
      { from: 'assets/audio', to: 'audio' }
    ])
  ]
};
