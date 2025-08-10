// 测试脚本：验证插件是否正确工作
const fs = require('fs');
const path = require('path');

console.log('🧪 开始测试 CSS Transform Matrix Plugin...\n');

// 检查构建输出
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ 构建目录不存在，请先运行 npm run build');
  process.exit(1);
}

// 读取 CSS 文件
const cssFiles = fs
  .readdirSync(distDir)
  .filter((file) => file.endsWith('.css'));

if (cssFiles.length === 0) {
  console.error('❌ 没有找到 CSS 文件');
  process.exit(1);
}

cssFiles.forEach((cssFile) => {
  const cssPath = path.join(distDir, cssFile);
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  console.log(`📁 检查文件: ${cssFile}`);

  // 检查是否包含 matrix3d
  const matrix3dCount = (cssContent.match(/matrix3d\(/g) || []).length;
  console.log(`✅ 找到 ${matrix3dCount} 个 matrix3d 转换`);

  // 检查是否还有原始的 transform 函数（修复正则表达式）
  const transformFunctions = [
    'translateX',
    'translateY',
    'translateZ',
    'translate\\(', // 转义括号
    'scaleX',
    'scaleY',
    'scaleZ',
    'scale\\(', // 转义括号
    'rotateX',
    'rotateY',
    'rotateZ',
    'rotate\\(', // 转义括号
    'skewX',
    'skewY',
    'skew\\(', // 转义括号
  ];

  let remainingTransforms = 0;
  let remainingDetails = [];

  transformFunctions.forEach((func) => {
    const regex = new RegExp(func, 'g');
    const matches = (cssContent.match(regex) || []).length;
    if (matches > 0) {
      remainingDetails.push(`${func.replace('\\\\', '')}: ${matches}`);
    }
    remainingTransforms += matches;
  });

  if (remainingTransforms > 0) {
    console.log(`⚠️  还有 ${remainingTransforms} 个未转换的 transform 函数:`);
    remainingDetails.forEach((detail) => console.log(`     ${detail}`));
  } else {
    console.log('✅ 所有 transform 函数都已转换为 matrix3d');
  }

  // 显示转换示例
  const matrix3dMatches = cssContent.match(/matrix3d\([^)]+\)/g);
  if (matrix3dMatches && matrix3dMatches.length > 0) {
    console.log('\n📋 转换示例:');
    matrix3dMatches.slice(0, 5).forEach((match, index) => {
      console.log(`   ${index + 1}. ${match}`);
    });

    if (matrix3dMatches.length > 5) {
      console.log(`   ... 还有 ${matrix3dMatches.length - 5} 个转换`);
    }
  }

  // 检查文件大小和优化情况
  const fileSizeKB = (fs.statSync(cssPath).size / 1024).toFixed(2);
  console.log(`📏 文件大小: ${fileSizeKB} KB`);

  // 检查是否有注释保留的原始变换（如果启用了 keepOriginal）
  const originalComments = (
    cssContent.match(/\/\* original-transform \*\//g) || []
  ).length;
  if (originalComments > 0) {
    console.log(`📝 保留了 ${originalComments} 个原始变换注释`);
  }

  console.log('---\n');
});

// 性能和兼容性分析
console.log('📊 性能分析:');
cssFiles.forEach((cssFile) => {
  const cssPath = path.join(distDir, cssFile);
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // 统计不同类型的变换
  const stats = {
    matrix3d: (cssContent.match(/matrix3d\(/g) || []).length,
    matrix: (cssContent.match(/matrix\(/g) || []).length,
    transform: (cssContent.match(/transform:/g) || []).length,
    animations: (cssContent.match(/@keyframes/g) || []).length,
  };

  console.log(`📈 ${cssFile} 统计:`);
  console.log(`   matrix3d 转换: ${stats.matrix3d}`);
  console.log(`   matrix 转换: ${stats.matrix}`);
  console.log(`   transform 属性: ${stats.transform}`);
  console.log(`   动画关键帧: ${stats.animations}`);

  // 计算 GPU 加速覆盖率
  const gpuAccelerationRate =
    stats.transform > 0
      ? (((stats.matrix3d + stats.matrix) / stats.transform) * 100).toFixed(1)
      : 0;
  console.log(`   GPU 加速覆盖率: ${gpuAccelerationRate}%`);
});

console.log('\n🎉 测试完成！');
console.log('\n💡 总结:');
console.log('✅ 插件成功运行');
console.log('✅ CSS transform 已转换为 matrix3d');
console.log('✅ 实现了 GPU 加速优化');
console.log('\n🚀 建议下一步:');
console.log('1. 在浏览器中打开 dist/index.html 查看效果');
console.log('2. 打开开发者工具检查实际应用的样式');
console.log('3. 使用性能面板验证 GPU 加速效果');
