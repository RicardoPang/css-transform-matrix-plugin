import CSSTransformMatrixPlugin from '../src/plugin/index';
import { createPostCSSPlugin } from '../src/postcss-plugin';
import { transformValue, transformStyleObject } from '../src/runtime';

describe('Integration Tests', () => {
  describe('Runtime API', () => {
    it('should transform single value', () => {
      const result = transformValue('translateX(10px) rotate(45deg)');
      expect(result).toContain('matrix3d');
      expect(result).not.toContain('translateX');
    });

    it('should transform style object', () => {
      const result = transformStyleObject({
        transform: 'translateX(10px)',
        background: 'red',
      });

      expect(result.background).toBe('red');
      expect(typeof result.transform).toBe('string');
      expect(result.transform as string).toContain('matrix3d');
    });

    it('should handle invalid transform gracefully', () => {
      const result = transformValue('invalid-transform');
      expect(result).toBe('invalid-transform'); // 应该返回原值
    });
  });

  describe('PostCSS Plugin', () => {
    it('should create valid PostCSS plugin', () => {
      const plugin = createPostCSSPlugin();
      expect(plugin.postcssPlugin).toBe('css-transform-matrix');
      expect(typeof plugin.Declaration).toBe('function');
    });
  });

  describe('Performance Tests', () => {
    it('should handle large number of transforms efficiently', () => {
      const transforms = Array(1000).fill('translateX(10px) rotate(45deg)');

      const start = performance.now();
      transforms.forEach(transformValue);
      const end = performance.now();

      expect(end - start).toBeLessThan(1000); // 应该在1秒内完成
    });
  });
});
