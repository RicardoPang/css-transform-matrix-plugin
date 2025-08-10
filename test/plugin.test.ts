import CSSTransformMatrixPlugin from '../src/plugin/index';

describe('CSSTransformMatrixPlugin', () => {
  let plugin: CSSTransformMatrixPlugin;

  beforeEach(() => {
    plugin = new CSSTransformMatrixPlugin({
      verbose: false,
    });
  });

  it('should create plugin instance with default options', () => {
    expect(plugin).toBeInstanceOf(CSSTransformMatrixPlugin);
  });

  it('should process simple transform', async () => {
    const css = '.box { transform: translateX(10px); }';
    const result = await (
      plugin as unknown as { processCSS(css: string): Promise<string> }
    ).processCSS(css);

    expect(result).toContain('matrix3d');
    // 根据实际输出：matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 0, 0, 1)
    // translateX(10px) 在第13个位置（从1开始计数），即 "0, 1, 0, 10"
    expect(result).toContain('0, 1, 0, 10');
  });

  it('should process complex transform', async () => {
    const css = '.box { transform: translateX(10px) rotate(90deg) scale(2); }';
    const result = await (
      plugin as unknown as { processCSS(css: string): Promise<string> }
    ).processCSS(css);

    expect(result).toContain('matrix3d');
    expect(result).not.toContain('translateX');
    expect(result).not.toContain('rotate');
    expect(result).not.toContain('scale');
  });

  it('should ignore non-transform properties', async () => {
    const css = '.box { background: red; color: blue; }';
    const result = await (
      plugin as unknown as { processCSS(css: string): Promise<string> }
    ).processCSS(css);

    expect(result).toBe(css); // Should remain unchanged
  });

  it('should handle transform: none', async () => {
    const css = '.box { transform: none; }';
    const result = await (
      plugin as unknown as { processCSS(css: string): Promise<string> }
    ).processCSS(css);

    expect(result).toBe(css); // Should remain unchanged
  });

  it('should skip already processed matrix3d', async () => {
    const css =
      '.box { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1); }';
    const result = await (
      plugin as unknown as { processCSS(css: string): Promise<string> }
    ).processCSS(css);

    expect(result).toBe(css); // Should remain unchanged
  });

  it('should process translateY correctly', async () => {
    const css = '.box { transform: translateY(20px); }';
    const result = await (
      plugin as unknown as { processCSS(css: string): Promise<string> }
    ).processCSS(css);

    expect(result).toContain('matrix3d');
    // translateY(20px) 应该在第14个位置
    expect(result).toContain('0, 20, 0, 1');
  });
});
