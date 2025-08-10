// 导入样式
import './styles.css';

// 导入运行时 API 进行测试
import {
  transformValue,
  transformStyleObject,
  transformCSSString,
} from 'css-transform-matrix-plugin/runtime';

console.log('🎯 CSS Transform Matrix Plugin 示例启动');

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function () {
  console.log('📦 开始测试转换功能...');

  // 测试各种变换
  const tests = [
    {
      id: 'translate-result',
      original: 'translateX(50px) translateY(30px)',
      selector: '.translate-demo',
    },
    {
      id: 'rotate-result',
      original: 'rotate(45deg)',
      selector: '.rotate-demo',
    },
    {
      id: 'scale-result',
      original: 'scale(1.2, 0.8)',
      selector: '.scale-demo',
    },
    {
      id: 'skew-result',
      original: 'skewX(15deg) skewY(5deg)',
      selector: '.skew-demo',
    },
    {
      id: 'complex-result',
      original: 'translateX(20px) rotate(30deg) scale(1.1)',
      selector: '.complex-demo',
    },
    {
      id: 'transform3d-result',
      original: 'rotateX(20deg) rotateY(30deg) translateZ(50px)',
      selector: '.transform3d-demo',
    },
  ];

  // 运行测试
  tests.forEach((test) => {
    try {
      // 使用运行时 API 转换
      const transformed = transformValue(test.original);

      // 显示结果
      const resultElement = document.getElementById(test.id);
      if (resultElement) {
        resultElement.innerHTML = `转换后: ${transformed}`;
        resultElement.style.color = '#4caf50'; // 绿色表示成功
      }

      // 获取实际应用的样式（由插件转换的）
      const element = document.querySelector(test.selector);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const actualTransform = computedStyle.transform;

        console.log(`✅ ${test.selector}:`);
        console.log(`   原始: transform: ${test.original}`);
        console.log(`   API转换: ${transformed}`);
        console.log(`   实际应用: ${actualTransform}`);
        console.log('   ---');
      }
    } catch (error) {
      console.error(`❌ 转换失败 ${test.selector}:`, error);
      const resultElement = document.getElementById(test.id);
      if (resultElement) {
        resultElement.innerHTML = `转换失败: ${error.message}`;
        resultElement.style.color = '#f44336'; // 红色表示失败
      }
    }
  });

  // 测试样式对象转换
  console.log('\n🧪 测试样式对象转换:');
  const styleObject = {
    transform: 'translateX(100px) rotate(90deg)',
    background: 'red',
    width: '200px',
  };

  const transformedStyleObject = transformStyleObject(styleObject);
  console.log('原始样式对象:', styleObject);
  console.log('转换后样式对象:', transformedStyleObject);

  // 测试 CSS 字符串转换
  console.log('\n🧪 测试 CSS 字符串转换:');
  const cssString = `
    .test1 { transform: translateX(50px); }
    .test2 { transform: rotate(45deg) scale(1.2); }
    .test3 { background: blue; }
  `;

  const transformedCSS = transformCSSString(cssString);
  console.log('原始 CSS:', cssString);
  console.log('转换后 CSS:', transformedCSS);

  // 性能测试
  console.log('\n⚡ 性能测试:');
  const startTime = performance.now();

  // 批量转换测试
  const testTransforms = [
    'translateX(10px)',
    'rotate(45deg)',
    'scale(1.5)',
    'translateX(20px) rotate(30deg)',
    'scale(1.2) translateY(50px) rotate(60deg)',
  ];

  testTransforms.forEach((transform, index) => {
    const result = transformValue(transform);
    console.log(
      `测试 ${index + 1}: ${transform} -> ${result.substring(0, 50)}...`
    );
  });

  const endTime = performance.now();
  console.log(`⏱️ 批量转换耗时: ${(endTime - startTime).toFixed(2)}ms`);

  // 检查 GPU 加速
  checkGPUAcceleration();

  // 添加交互功能
  addInteractiveFeatures();
});

// 检查 GPU 加速
function checkGPUAcceleration() {
  console.log('\n🖥️ GPU 加速检查:');

  const testElements = document.querySelectorAll('.demo-box');
  testElements.forEach((element, index) => {
    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform;

    const isGPUAccelerated =
      transform.includes('matrix3d') || transform.includes('matrix');
    console.log(
      `元素 ${index + 1}: ${isGPUAccelerated ? '✅ GPU 加速' : '❌ 无 GPU 加速'} - ${transform}`
    );
  });
}

// 添加交互功能
function addInteractiveFeatures() {
  // 点击切换变换
  const demoBoxes = document.querySelectorAll('.demo-box');
  demoBoxes.forEach((box) => {
    box.addEventListener('click', function () {
      // 临时添加额外的变换
      const currentTransform = window.getComputedStyle(this).transform;
      console.log(`🖱️ 点击元素，当前变换: ${currentTransform}`);

      // 添加一个临时的缩放效果
      this.style.transform += ' scale(1.1)';

      setTimeout(() => {
        this.style.transform = this.style.transform.replace(' scale(1.1)', '');
      }, 200);
    });
  });

  // 键盘快捷键
  document.addEventListener('keydown', function (e) {
    if (e.key === 'r') {
      console.log('🔄 重新加载演示');
      location.reload();
    }
    if (e.key === 'c') {
      console.clear();
      console.log('🧹 控制台已清理');
    }
  });
}

// 输出插件信息
console.log(`
🎯 CSS Transform Matrix Plugin 演示
=================================
✨ 功能: 自动将 CSS transform 转换为 matrix3d
🚀 优势: GPU 加速，更好的性能
🔧 使用: Webpack 插件 + PostCSS 插件 + 运行时 API
📱 兼容: 支持所有现代浏览器

💡 提示:
- 按 'r' 键重新加载
- 按 'c' 键清理控制台
- 点击方块查看变换效果
- 查看控制台了解转换详情
`);
