const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CSSTransformMatrixPlugin } = require('css-transform-matrix-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
            }),
            new CSSTransformMatrixPlugin({
              enabled: true,
              verbose: true,
              keepOriginal: true,
            }),
          ]
        : []),
    ],
    devServer: {
      static: './dist',
      hot: true,
    },
  };
};
