import { MatrixTransformer } from '../src/transformer/index';
import { createIdentityMatrix } from '../src/utils/index';

describe('MatrixTransformer', () => {
  it('should create translateX matrix', () => {
    const result = MatrixTransformer.transformsToMatrix3D([
      { name: 'translateX', args: [10] },
    ]);

    const expected = createIdentityMatrix();
    expected.m41 = 10;

    expect(result).toEqual(expected);
  });

  it('should create rotate matrix', () => {
    const result = MatrixTransformer.transformsToMatrix3D([
      { name: 'rotate', args: [Math.PI / 2] }, // 90 degrees
    ]);

    // 90度旋转：cos(90°) = 0, sin(90°) = 1
    expect(result.m11).toBeCloseTo(0, 5);
    expect(result.m12).toBeCloseTo(-1, 5);
    expect(result.m21).toBeCloseTo(1, 5);
    expect(result.m22).toBeCloseTo(0, 5);
  });

  it('should combine multiple transforms correctly', () => {
    // translate(10px) scale(2) - 先平移10px，然后缩放2倍
    const result = MatrixTransformer.transformsToMatrix3D([
      { name: 'translateX', args: [10] },
      { name: 'scale', args: [2, 2] },
    ]);

    // 当先平移再缩放时，平移量也会被缩放
    expect(result.m11).toBe(2); // scaleX
    expect(result.m22).toBe(2); // scaleY
    expect(result.m41).toBe(20); // translateX * scaleX = 10 * 2 = 20
  });

  it('should handle reverse order transforms', () => {
    // scale(2) translate(10px) - 先缩放2倍，然后平移10px
    const result = MatrixTransformer.transformsToMatrix3D([
      { name: 'scale', args: [2, 2] },
      { name: 'translateX', args: [10] },
    ]);

    // 当先缩放再平移时，平移量不受缩放影响
    expect(result.m11).toBe(2); // scaleX
    expect(result.m22).toBe(2); // scaleY
    expect(result.m41).toBe(10); // translateX = 10 (不受缩放影响)
  });

  it('should convert matrix to CSS string', () => {
    const matrix = createIdentityMatrix();
    matrix.m41 = 10; // translateX
    matrix.m42 = 20; // translateY

    const css = MatrixTransformer.matrixToCSS(matrix);
    expect(css).toBe(
      'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1)'
    );
  });

  it('should handle complex transform combinations', () => {
    // 复杂变换：translate(10px, 5px) rotate(90deg) scale(2)
    const result = MatrixTransformer.transformsToMatrix3D([
      { name: 'translate', args: [10, 5] },
      { name: 'rotate', args: [Math.PI / 2] }, // 90度
      { name: 'scale', args: [2, 2] },
    ]);

    // 验证缩放
    expect(Math.abs(result.m11)).toBeCloseTo(0, 5); // 旋转后的 scaleX
    expect(Math.abs(result.m12)).toBeCloseTo(2, 5); // 旋转后的值
    expect(Math.abs(result.m21)).toBeCloseTo(2, 5); // 旋转后的值
    expect(Math.abs(result.m22)).toBeCloseTo(0, 5); // 旋转后的 scaleY
  });
});
