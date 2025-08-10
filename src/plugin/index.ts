import postcss from 'postcss';
import { TransformParser } from '../parser/index';
import { MatrixTransformer } from '../transformer/index';
import type {
  WebpackCompiler,
  WebpackCompilation,
  WebpackAssets,
  WebpackAsset,
  PostCSSDeclaration,
  PostCSSPlugin,
  PostCSSProcessor,
} from '../types/index';

interface PluginOptions {
  enabled?: boolean;
  extensions?: string[];
  keepOriginal?: boolean;
  verbose?: boolean;
}

class CSSTransformMatrixPlugin {
  private options: Required<PluginOptions>;

  constructor(options: PluginOptions = {}) {
    this.options = {
      enabled: true,
      extensions: ['.css', '.scss', '.sass', '.less'],
      keepOriginal: false,
      verbose: false,
      ...options,
    };
  }

  apply(compiler: WebpackCompiler): void {
    if (!this.options.enabled) {
      return;
    }

    const pluginName = 'CSSTransformMatrixPlugin';

    compiler.hooks.thisCompilation.tap(
      pluginName,
      (compilation: WebpackCompilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: pluginName,
            stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          async (assets: WebpackAssets, callback: (error?: Error) => void) => {
            try {
              await this.processAssets(assets, compilation);
              callback();
            } catch (error) {
              callback(
                error instanceof Error ? error : new Error(String(error))
              );
            }
          }
        );
      }
    );
  }

  private async processAssets(
    assets: WebpackAssets,
    compilation: WebpackCompilation
  ): Promise<void> {
    const cssAssets = Object.keys(assets).filter(
      (name) =>
        name.endsWith('.css') ||
        this.options.extensions.some((ext) => name.endsWith(ext))
    );

    for (const assetName of cssAssets) {
      try {
        const asset = assets[assetName];
        const source = asset.source();

        if (this.options.verbose) {
          console.log(`[CSS Transform Matrix] Processing: ${assetName}`);
        }

        const processed = await this.processCSS(source);
        assets[assetName] = this.createNewAsset(processed);

        if (this.options.verbose) {
          console.log(
            `[CSS Transform Matrix] Transformed ${assetName}: ${source.length} -> ${processed.length} bytes`
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        compilation.warnings.push(
          new Error(
            `CSS Transform Matrix Plugin: Error processing ${assetName}: ${errorMessage}`
          )
        );
      }
    }
  }

  private createNewAsset(content: string): WebpackAsset {
    return {
      source: (): string => content,
      size: (): number => content.length,
    };
  }

  private async processCSS(css: string): Promise<string> {
    const processor: PostCSSProcessor = postcss([this.createTransformPlugin()]);
    const result = await processor.process(css, { from: undefined });
    return result.css;
  }

  private createTransformPlugin(): PostCSSPlugin {
    return {
      postcssPlugin: 'css-transform-matrix',
      Declaration: (decl: PostCSSDeclaration): void => {
        if (decl.prop === 'transform' && decl.value !== 'none') {
          this.processTransformDeclaration(decl);
        }
      },
    };
  }

  private processTransformDeclaration(decl: PostCSSDeclaration): void {
    try {
      const originalValue = decl.value;

      if (originalValue.includes('matrix3d(')) {
        if (this.options.verbose) {
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

      if (this.options.keepOriginal) {
        decl.cloneBefore({
          prop: `/* original-transform */`,
          value: originalValue,
        });
      }

      decl.value = matrixCSS;

      if (this.options.verbose) {
        console.log(`[CSS Transform Matrix] ${originalValue} -> ${matrixCSS}`);
      }
    } catch (error) {
      if (this.options.verbose) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.warn(
          `[CSS Transform Matrix] Failed: ${decl.value}`,
          errorMessage
        );
      }
    }
  }
}

// 统一使用命名导出
export { CSSTransformMatrixPlugin };
export { createPostCSSPlugin } from '../postcss-plugin';
export {
  transformValue,
  transformStyleObject,
  transformCSSString,
  batchTransform,
} from '../runtime';
export { TransformParser } from '../parser/index';
export { MatrixTransformer } from '../transformer/index';

export default CSSTransformMatrixPlugin;
