import { TransformParser } from '../src/parser/index';

describe('TransformParser', () => {
  it('should parse translateX function', () => {
    const result = TransformParser.parseTransformValue('translateX(10px)');
    expect(result).toEqual([{ name: 'translateX', args: [10] }]);
  });

  it('should parse multiple transform functions', () => {
    const result = TransformParser.parseTransformValue(
      'translateX(10px) rotate(45deg)'
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'translateX', args: [10] });
    expect(result[1]).toEqual({ name: 'rotate', args: [Math.PI / 4] }); // 45deg in radians
  });
});
