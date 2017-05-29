const path = require('path');

const PROD = process.argv.indexOf('-p') !== -1;

module.exports = {
  entry: PROD
    ? [
      'webpack-dev-server/client?http://localhost:8000',
      // 'webpack/hot/only-dev-server',
      './src/index.js',
    ]
    : [
      './src/index.js',
    ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './dist',
    // hot: true,
    historyApiFallback: true,
  }
};
