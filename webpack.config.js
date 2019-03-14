const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(c|le)ss/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.less'],
    alias: {
      'app-root': __dirname,
      'app-components': path.resolve(__dirname, 'src/components'),
      'app-containers': path.resolve(__dirname, 'src/containers'),
      'app-redux': path.resolve(__dirname, 'src/redux'),
      'app-utils': path.resolve(__dirname, 'src/utils'),
      'test-data': path.resolve(__dirname, 'data/test'),
    },
  },
  devServer: { historyApiFallback: true },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
