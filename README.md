# CSS Transform Matrix Plugin

一个 Webpack 插件，自动将 CSS 中的 `transform` 属性转换为 `matrix3d` 形式，实现 GPU 加速优化。

## 🚀 功能特性

- ✅ 自动将各种 `transform` 函数转换为 `matrix3d`
- ✅ 支持所有常见的变换函数：`translate`, `rotate`, `scale`, `skew` 等
- ✅ 支持组合变换的正确矩阵运算
- ✅ TypeScript 编写，提供完整的类型支持
- ✅ 灵活的配置选项
- ✅ 详细的错误处理和日志输出
- ✅ 支持市场占有率 > 1% 的现代浏览器

## 📦 安装

```bash
npm install css-transform-matrix-plugin --save-dev
```

## 🛠️ 集成方式

### 方式一：Webpack 插件（推荐用于生产构建）

```javascript
// webpack.config.js
const CSSTransformMatrixPlugin = require('css-transform-matrix-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 必须使用 extract 才能被插件处理
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // 在 MiniCssExtractPlugin 之后添加
    new CSSTransformMatrixPlugin({
      enabled: process.env.NODE_ENV === 'production',
      verbose: true,
    }),
  ],
};
```

### 方式二：PostCSS 插件（推荐用于开发环境）

```javascript
// postcss.config.js
const { createPostCSSPlugin } = require('css-transform-matrix-plugin');

module.exports = {
  plugins: [
    require('autoprefixer'),
    createPostCSSPlugin({
      enabled: true,
      verbose: process.env.NODE_ENV === 'development',
    }),
    require('cssnano')({ preset: 'default' }),
  ],
};
```

```javascript
// webpack.config.js (配合 PostCSS 使用)
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // 会自动读取 postcss.config.js
        ],
      },
    ],
  },
};
```

### 方式三：运行时转换

```javascript
import { transformStyleObject } from 'css-transform-matrix-plugin/runtime';

// CSS-in-JS 使用
const styles = transformStyleObject({
  transform: 'translateX(10px) rotate(45deg)',
  background: 'red',
});
// 结果: { transform: 'matrix3d(...)', background: 'red' }
```

## ⚡ 性能优化

### GPU 加速验证

```css
/* 原始 - 可能不触发 GPU 加速 */
.element {
  transform: translateX(100px) rotate(45deg) scale(1.2);
}

/* 转换后 - 强制 GPU 加速 */
.element {
  transform: matrix3d(
    0.849,
    -0.849,
    0,
    0,
    1.019,
    1.019,
    0,
    0,
    0,
    0,
    1.2,
    0,
    120,
    0,
    0,
    1
  );
}
```

### 最佳实践

#### 生产环境配置

```javascript
new CSSTransformMatrixPlugin({
  enabled: true,
  extensions: ['.css', '.scss', '.less'],
  keepOriginal: false, // 生产环境移除原始代码
  verbose: false, // 关闭日志
});
```

#### 开发环境配置

```javascript
new CSSTransformMatrixPlugin({
  enabled: true,
  keepOriginal: true, // 保留原始代码便于调试
  verbose: true, // 开启详细日志
});
```

#### 性能监控

开启 `verbose: true` 查看转换日志：

```
[CSS Transform Matrix] Processing: main.css
[CSS Transform Matrix] translateX(10px) rotate(45deg) -> matrix3d(...)
[CSS Transform Matrix] Transformed main.css: 1250 -> 1180 bytes
```

## ⚙️ 配置选项

```typescript
interface PluginOptions {
  // 是否启用插件
  enabled?: boolean; // 默认: true

  // 需要处理的文件扩展名
  extensions?: string[]; // 默认: ['.css', '.scss', '.sass', '.less']

  // 是否保留原始 transform 作为注释
  keepOriginal?: boolean; // 默认: false

  // 是否启用详细日志
  verbose?: boolean; // 默认: false
}
```

### 完整配置示例

```javascript
new CSSTransformMatrixPlugin({
  enabled: process.env.NODE_ENV === 'production',
  extensions: ['.css', '.scss'],
  keepOriginal: true,
  verbose: false,
});
```

## 🎯 支持的变换函数

| 函数            | 示例                            | 说明               |
| --------------- | ------------------------------- | ------------------ |
| `translateX()`  | `translateX(10px)`              | X轴平移            |
| `translateY()`  | `translateY(20px)`              | Y轴平移            |
| `translateZ()`  | `translateZ(30px)`              | Z轴平移            |
| `translate()`   | `translate(10px, 20px)`         | 2D平移             |
| `translate3d()` | `translate3d(10px, 20px, 30px)` | 3D平移             |
| `scaleX()`      | `scaleX(1.5)`                   | X轴缩放            |
| `scaleY()`      | `scaleY(2)`                     | Y轴缩放            |
| `scaleZ()`      | `scaleZ(0.5)`                   | Z轴缩放            |
| `scale()`       | `scale(1.5, 2)`                 | 2D缩放             |
| `scale3d()`     | `scale3d(1.5, 2, 0.5)`          | 3D缩放             |
| `rotate()`      | `rotate(45deg)`                 | Z轴旋转            |
| `rotateX()`     | `rotateX(30deg)`                | X轴旋转            |
| `rotateY()`     | `rotateY(60deg)`                | Y轴旋转            |
| `rotateZ()`     | `rotateZ(90deg)`                | Z轴旋转            |
| `skewX()`       | `skewX(15deg)`                  | X轴倾斜            |
| `skewY()`       | `skewY(25deg)`                  | Y轴倾斜            |
| `skew()`        | `skew(15deg, 25deg)`            | 2D倾斜             |
| `matrix()`      | `matrix(a,b,c,d,e,f)`           | 2D矩阵             |
| `matrix3d()`    | `matrix3d(...)`                 | 3D矩阵（跳过处理） |

## 🌐 浏览器支持

支持市场占有率 > 1% 的现代浏览器：

- ✅ Chrome 36+
- ✅ Firefox 16+
- ✅ Safari 9+
- ✅ Edge 12+
- ✅ iOS Safari 9+
- ✅ Android Browser 4.4+

## 🔧 开发

### 本地开发设置

```bash
# 克隆仓库
git clone <repo-url>
cd css-transform-matrix-plugin

# 安装依赖
npm install

# 运行测试
npm run test

# 构建项目
npm run build

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 项目结构

```
css-transform-matrix-plugin/
├── src/
│   ├── plugin/           # Webpack 插件核心
│   ├── parser/           # CSS transform 解析器
│   ├── transformer/      # 矩阵转换器
│   ├── utils/           # 工具函数
│   └── types/           # TypeScript 类型定义
├── test/               # 测试文件
├── examples/          # 使用示例
└── dist/             # 构建输出
```

## 🧪 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 测试覆盖率
npm run test -- --coverage
```

## 📝 更新日志

### v1.0.0

- ✨ 初始版本发布
- ✅ 支持所有常见 transform 函数
- ✅ 完整的 TypeScript 支持
- ✅ 全面的测试覆盖

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- 灵感来源于 [CSS-Matrix3d](https://github.com/Zhangdroid/CSS-Matrix3d) 项目
- 感谢所有贡献者和使用者
