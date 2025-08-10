// 工具函数
import type { Matrix3D } from '../types/index';

// 角度转换函数
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

// 创建单位矩阵
export function createIdentityMatrix(): Matrix3D {
  return {
    m11: 1,
    m12: 0,
    m13: 0,
    m14: 0,
    m21: 0,
    m22: 1,
    m23: 0,
    m24: 0,
    m31: 0,
    m32: 0,
    m33: 1,
    m34: 0,
    m41: 0,
    m42: 0,
    m43: 0,
    m44: 1,
  };
}

// 矩阵乘法 - 将两个 4x4 矩阵相乘
export function multiplyMatrices(a: Matrix3D, b: Matrix3D): Matrix3D {
  return {
    // 第一行
    m11: a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41,
    m12: a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42,
    m13: a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43,
    m14: a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44,

    // 第二行
    m21: a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41,
    m22: a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42,
    m23: a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43,
    m24: a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44,

    // 第三行
    m31: a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41,
    m32: a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42,
    m33: a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43,
    m34: a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44,

    // 第四行
    m41: a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41,
    m42: a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42,
    m43: a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43,
    m44: a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44,
  };
}

// 将矩阵转换为数组形式
export function matrixToArray(matrix: Matrix3D): number[] {
  return [
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
}

// 检查两个矩阵是否近似相等（处理浮点数精度问题）
export function matricesAreEqual(
  a: Matrix3D,
  b: Matrix3D,
  tolerance = 1e-10
): boolean {
  const arrayA = matrixToArray(a);
  const arrayB = matrixToArray(b);

  for (let i = 0; i < 16; i++) {
    if (Math.abs(arrayA[i] - arrayB[i]) > tolerance) {
      return false;
    }
  }

  return true;
}
