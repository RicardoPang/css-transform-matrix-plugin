import type { TransformFunction, Matrix3D } from '../types/index';
import { createIdentityMatrix, multiplyMatrices } from '../utils/index';

// CSS Transform 矩阵转换器
export class MatrixTransformer {
  // 将transform函数数组抓暖胃3D矩阵
  static transformsToMatrix3D(functions: TransformFunction[]): Matrix3D {
    let result = createIdentityMatrix();

    for (const func of functions) {
      const matrix = this.createMatrixFromFunction(func);
      result = multiplyMatrices(result, matrix);
    }

    return result;
  }

  // 根据单个transform函数创建矩阵
  private static createMatrixFromFunction(func: TransformFunction): Matrix3D {
    const { name, args } = func;
    switch (name) {
      case 'translateX':
        return this.createTranslateXMatrix(args[0] || 0);
      case 'translateY':
        return this.createTranslateYMatrix(args[0] || 0);
      case 'translateZ':
        return this.createTranslateZMatrix(args[0] || 0);
      case 'translate':
        return this.createTranslateMatrix(args[0] || 0, args[1] || 0);
      case 'translate3d':
        return this.createTranslate3DMatrix(
          args[0] || 0,
          args[1] || 0,
          args[2] || 0
        );
      case 'scaleX':
        return this.createScaleXMatrix(args[0] || 1);
      case 'scaleY':
        return this.createScaleYMatrix(args[0] || 1);
      case 'scaleZ':
        return this.createScaleZMatrix(args[0] || 1);
      case 'scale':
        return this.createScaleMatrix(args[0] || 1, args[1] || args[0] || 1);
      case 'scale3d':
        return this.createScale3DMatrix(
          args[0] || 1,
          args[1] || 1,
          args[2] || 1
        );
      case 'rotate':
      case 'rotateZ':
        return this.createRotateZMatrix(args[0] || 0);
      case 'rotateX':
        return this.createRotateXMatrix(args[0] || 0);
      case 'rotateY':
        return this.createRotateYMatrix(args[0] || 0);
      case 'skewX':
        return this.createSkewXMatrix(args[0] || 0);
      case 'skewY':
        return this.createSkewYMatrix(args[0] || 0);
      case 'skew':
        return this.createSkewMatrix(args[0] || 0, args[1] || 0);
      case 'matrix3d':
        if (args.length >= 16) {
          return this.createMatrix3DFromArray(args);
        } else {
          console.warn(`matrix3d requires 16 arguments, got ${args.length}`);
          return createIdentityMatrix();
        }
      case 'matrix':
        if (args.length >= 6) {
          return this.createMatrixFrom2D(args);
        } else {
          console.warn(`matrix requires 6 arguments, got ${args.length}`);
          return createIdentityMatrix();
        }
      default:
        console.warn(`Unsupported transform function: ${name}`);
        return createIdentityMatrix();
    }
  }

  // 位移矩阵
  private static createTranslateXMatrix(x: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m41 = x;
    return matrix;
  }

  private static createTranslateYMatrix(y: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m42 = y;
    return matrix;
  }

  private static createTranslateZMatrix(z: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m43 = z;
    return matrix;
  }

  private static createTranslateMatrix(x: number, y: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m41 = x;
    matrix.m42 = y;
    return matrix;
  }

  private static createTranslate3DMatrix(
    x: number,
    y: number,
    z: number
  ): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m41 = x;
    matrix.m42 = y;
    matrix.m43 = z;
    return matrix;
  }

  // 缩放矩阵
  private static createScaleXMatrix(sx: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m11 = sx;
    return matrix;
  }

  private static createScaleYMatrix(sy: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m22 = sy;
    return matrix;
  }

  private static createScaleZMatrix(sz: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m33 = sz;
    return matrix;
  }

  private static createScaleMatrix(sx: number, sy: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m11 = sx;
    matrix.m22 = sy;
    return matrix;
  }

  private static createScale3DMatrix(
    sx: number,
    sy: number,
    sz: number
  ): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m11 = sx;
    matrix.m22 = sy;
    matrix.m33 = sz;
    return matrix;
  }

  // 旋转矩阵
  private static createRotateXMatrix(angle: number): Matrix3D {
    const matrix = createIdentityMatrix();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    matrix.m22 = cos;
    matrix.m23 = -sin;
    matrix.m32 = sin;
    matrix.m33 = cos;

    return matrix;
  }

  private static createRotateYMatrix(angle: number): Matrix3D {
    const matrix = createIdentityMatrix();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    matrix.m11 = cos;
    matrix.m13 = sin;
    matrix.m31 = -sin;
    matrix.m33 = cos;

    return matrix;
  }

  private static createRotateZMatrix(angle: number): Matrix3D {
    const matrix = createIdentityMatrix();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    matrix.m11 = cos;
    matrix.m12 = -sin;
    matrix.m21 = sin;
    matrix.m22 = cos;

    return matrix;
  }

  // 倾斜矩阵
  private static createSkewXMatrix(angle: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m21 = Math.tan(angle);
    return matrix;
  }

  private static createSkewYMatrix(angle: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m12 = Math.tan(angle);
    return matrix;
  }

  private static createSkewMatrix(angleX: number, angleY: number): Matrix3D {
    const matrix = createIdentityMatrix();
    matrix.m12 = Math.tan(angleY);
    matrix.m21 = Math.tan(angleX);
    return matrix;
  }

  /**
   * 将矩阵转换为 CSS matrix3d 字符串
   */
  static matrixToCSS(matrix: Matrix3D): string {
    const values = [
      matrix.m11,
      matrix.m12,
      matrix.m13,
      matrix.m14,
      matrix.m21,
      matrix.m22,
      matrix.m23,
      matrix.m24,
      matrix.m31,
      matrix.m32,
      matrix.m33,
      matrix.m34,
      matrix.m41,
      matrix.m42,
      matrix.m43,
      matrix.m44,
    ];

    // 保留6位小数，移除尾随零
    const formattedValues = values.map((v) =>
      parseFloat(v.toFixed(6)).toString()
    );

    return `matrix3d(${formattedValues.join(', ')})`;
  }

  // 从 matrix3d 的 16 个参数创建矩阵
  private static createMatrix3DFromArray(args: number[]): Matrix3D {
    return {
      m11: args[0],
      m12: args[1],
      m13: args[2],
      m14: args[3],
      m21: args[4],
      m22: args[5],
      m23: args[6],
      m24: args[7],
      m31: args[8],
      m32: args[9],
      m33: args[10],
      m34: args[11],
      m41: args[12],
      m42: args[13],
      m43: args[14],
      m44: args[15],
    };
  }

  // 从 2D matrix 的 6 个参数创建 3D 矩阵
  private static createMatrixFrom2D(args: number[]): Matrix3D {
    return {
      m11: args[0],
      m12: args[1],
      m13: 0,
      m14: 0,
      m21: args[2],
      m22: args[3],
      m23: 0,
      m24: 0,
      m31: 0,
      m32: 0,
      m33: 1,
      m34: 0,
      m41: args[4],
      m42: args[5],
      m43: 0,
      m44: 1,
    };
  }
}
