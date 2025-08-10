import { TransformParser } from '../src/parser/index';
import { MatrixTransformer } from '../src/transformer/index';

describe('Integration Tests', () => {
  it('should correctly transform translateX(10px)', () => {
    const functions = TransformParser.parseTransformValue('translateX(10px)');
    const matrix = MatrixTransformer.transformsToMatrix3D(functions);
    const css = MatrixTransformer.matrixToCSS(matrix);

    expect(matrix.m41).toBe(10); // translateX 应该在 m41 位置
    expect(css).toBe(
      'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 0, 0, 1)'
    );
  });

  it('should correctly transform translateY(20px)', () => {
    const functions = TransformParser.parseTransformValue('translateY(20px)');
    const matrix = MatrixTransformer.transformsToMatrix3D(functions);
    const css = MatrixTransformer.matrixToCSS(matrix);

    expect(matrix.m42).toBe(20); // translateY 应该在 m42 位置
    expect(css).toBe(
      'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 20, 0, 1)'
    );
  });

  it('should correctly transform scale(2)', () => {
    const functions = TransformParser.parseTransformValue('scale(2)');
    const matrix = MatrixTransformer.transformsToMatrix3D(functions);
    const css = MatrixTransformer.matrixToCSS(matrix);

    expect(matrix.m11).toBe(2); // scaleX 应该在 m11 位置
    expect(matrix.m22).toBe(2); // scaleY 应该在 m22 位置
    expect(css).toBe(
      'matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
    );
  });

  it('should handle combination transforms', () => {
    const functions = TransformParser.parseTransformValue(
      'translateX(10px) scale(2)'
    );
    const matrix = MatrixTransformer.transformsToMatrix3D(functions);
    const css = MatrixTransformer.matrixToCSS(matrix);

    console.log('Combined transform result:', css);

    // 验证最终矩阵包含了两个变换的效果
    expect(matrix.m11).toBe(2); // scale
    expect(matrix.m22).toBe(2); // scale
    expect(matrix.m41).toBe(20); // translateX * scaleX = 10 * 2
  });
});
