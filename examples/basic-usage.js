const { CSSTransformMatrixPlugin } = require('../dist/index.js');
// 或者使用默认导出
// const CSSTransformMatrixPlugin = require('../dist/index.js').default;

// Webpack 配置示例
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CSSTransformMatrixPlugin({
      enabled: true,
      keepOriginal: true,
      verbose: true,
    }),
  ],
};

module.exports = webpackConfig;
