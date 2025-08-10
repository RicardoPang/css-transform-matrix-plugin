import { TransformParser } from './parser/index';
import { MatrixTransformer } from './transformer/index';
import type { PostCSSDeclaration, PostCSSPlugin } from './types/index';

interface PostCSSPluginOptions {
  enabled?: boolean;
  keepOriginal?: boolean;
  verbose?: boolean;
}

export function createPostCSSPlugin(
  options: PostCSSPluginOptions = {}
): PostCSSPlugin {
  const config = {
    enabled: true,
    keepOriginal: false,
    verbose: false,
    ...options,
  };

  return {
    postcssPlugin: 'css-transform-matrix',
    Declaration: (decl: PostCSSDeclaration): void => {
      if (
        !config.enabled ||
        decl.prop !== 'transform' ||
        decl.value === 'none'
      ) {
        return;
      }

      try {
        const originalValue = decl.value;

        // 跳过已经处理的 matrix3d
        if (originalValue.includes('matrix3d(')) {
          if (config.verbose) {
            console.log(`[CSS Transform Matrix] Skipping: ${originalValue}`);
          }
          return;
        }

        const functions = TransformParser.parseTransformValue(originalValue);

        if (functions.length === 0) {
          return;
        }

        const matrix = MatrixTransformer.transformsToMatrix3D(functions);
        const matrixCSS = MatrixTransformer.matrixToCSS(matrix);

        if (config.keepOriginal) {
          decl.cloneBefore({
            prop: `/* original-transform */`,
            value: originalValue,
          });
        }

        decl.value = matrixCSS;

        if (config.verbose) {
          console.log(
            `[CSS Transform Matrix] ${originalValue} -> ${matrixCSS}`
          );
        }
      } catch (error) {
        if (config.verbose) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.warn(
            `[CSS Transform Matrix] Failed: ${decl.value}`,
            errorMessage
          );
        }
      }
    },
  };
}

// PostCSS 插件标识
createPostCSSPlugin.postcss = true;
