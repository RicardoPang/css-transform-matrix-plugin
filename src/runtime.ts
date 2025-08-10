import { TransformParser } from './parser/index';
import { MatrixTransformer } from './transformer/index';

/**
 * 运行时转换单个 transform 值
 */
export function transformValue(transformValue: string): string {
  try {
    if (
      !transformValue ||
      transformValue === 'none' ||
      transformValue.includes('matrix3d(')
    ) {
      return transformValue;
    }

    const functions = TransformParser.parseTransformValue(transformValue);

    if (functions.length === 0) {
      return transformValue;
    }

    const matrix = MatrixTransformer.transformsToMatrix3D(functions);
    return MatrixTransformer.matrixToCSS(matrix);
  } catch (error) {
    console.warn(
      'CSS Transform Matrix Runtime: Failed to transform',
      transformValue,
      error
    );
    return transformValue; // 返回原值作为降级
  }
}

/**
 * 转换样式对象中的 transform 属性
 */
export function transformStyleObject(
  styles: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...styles };

  if (typeof result.transform === 'string') {
    result.transform = transformValue(result.transform);
  }

  return result;
}

/**
 * 转换 CSS 字符串中的所有 transform 属性
 */
export function transformCSSString(css: string): string {
  const transformRegex = /transform\s*:\s*([^;]+);/g;

  return css.replace(transformRegex, (match, transformValue) => {
    const transformed = transformValue(transformValue.trim());
    return `transform: ${transformed};`;
  });
}

/**
 * 批量转换多个 transform 值
 */
export function batchTransform(transforms: string[]): string[] {
  return transforms.map(transformValue);
}

// 为浏览器环境提供全局访问
declare const globalThis: {
  window?: {
    CSSTransformMatrix?: {
      transformValue: typeof transformValue;
      transformStyleObject: typeof transformStyleObject;
      transformCSSString: typeof transformCSSString;
      batchTransform: typeof batchTransform;
    };
  };
};

// 安全的浏览器环境检测
if (
  typeof globalThis !== 'undefined' &&
  typeof globalThis.window !== 'undefined'
) {
  globalThis.window.CSSTransformMatrix = {
    transformValue,
    transformStyleObject,
    transformCSSString,
    batchTransform,
  };
}
