const CSSTransformMatrixPlugin = require('../dist/index.js');
const path = require('path');

// 生产环境配置
const productionConfig = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer'), require('cssnano')],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // CSS Transform Matrix Plugin - 只在生产环境启用
    new CSSTransformMatrixPlugin({
      enabled: true,
      extensions: ['.css', '.scss', '.less'],
      keepOriginal: false, // 生产环境不保留原始代码
      verbose: false, // 生产环境关闭详细日志
    }),
  ],
};

// 开发环境配置
const developmentConfig = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'eval-source-map',
  plugins: [
    // 开发环境保留原始代码便于调试
    new CSSTransformMatrixPlugin({
      enabled: true,
      keepOriginal: true,
      verbose: true,
    }),
  ],
};

module.exports =
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
