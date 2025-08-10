// Transform 函数类型
export interface TransformFunction {
  name: string;
  args: number[];
}

// 2D 矩阵
export interface Matrix2D {
  a: number; // scaleX
  b: number; // skewY
  c: number; // skewX
  d: number; // scaleY
  e: number; // translateX
  f: number; // translateY
}

// 3D 矩阵 (4x4)
export interface Matrix3D {
  m11: number;
  m12: number;
  m13: number;
  m14: number;
  m21: number;
  m22: number;
  m23: number;
  m24: number;
  m31: number;
  m32: number;
  m33: number;
  m34: number;
  m41: number;
  m42: number;
  m43: number;
  m44: number;
}

// 解析结果
export interface ParseResult {
  functions: TransformFunction[];
  matrix3d: Matrix3D;
  originalValue: string;
}

// Webpack 相关类型
export interface WebpackAsset {
  source(): string;
  size(): number;
}

export interface WebpackAssets {
  [key: string]: WebpackAsset;
}

export interface WebpackCompilation {
  warnings: Error[];
  PROCESS_ASSETS_STAGE_OPTIMIZE: number;
  hooks: {
    processAssets: {
      tapAsync(
        options: { name: string; stage: number },
        callback: (
          assets: WebpackAssets,
          callback: (error?: Error) => void
        ) => void
      ): void;
    };
  };
}

export interface WebpackCompiler {
  hooks: {
    thisCompilation: {
      tap(
        name: string,
        callback: (compilation: WebpackCompilation) => void
      ): void;
    };
  };
}

// PostCSS 相关类型
export interface PostCSSDeclaration {
  prop: string;
  value: string;
  cloneBefore(props: { prop: string; value: string }): PostCSSDeclaration;
}

export interface PostCSSPlugin {
  postcssPlugin: string;
  Declaration?: (decl: PostCSSDeclaration) => void;
}

export interface PostCSSResult {
  css: string;
}

export interface PostCSSProcessor {
  process(
    css: string,
    options: { from: string | undefined }
  ): Promise<PostCSSResult>;
}
