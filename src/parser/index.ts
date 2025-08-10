import valueParser from 'postcss-value-parser';
import type { TransformFunction } from '../types/index';

// 定义 postcss-value-parser 的类型接口
interface ValueParserNode {
  type: string;
  value: string;
  nodes?: ValueParserNode[];
}

interface ValueParserFunctionNode extends ValueParserNode {
  type: 'function';
  nodes: ValueParserNode[];
}

interface ParsedValue {
  walk: (callback: (node: ValueParserNode) => void) => void;
}

export class TransformParser {
  // 解析 transform 属性值
  static parseTransformValue(value: string): TransformFunction[] {
    const parsed: ParsedValue = valueParser(value);
    const functions: TransformFunction[] = [];

    parsed.walk((node: ValueParserNode) => {
      if (node.type === 'function') {
        const functionNode = node as ValueParserFunctionNode;
        const args = this.extractFunctionArgs(functionNode);
        functions.push({
          name: functionNode.value,
          args,
        });
      }
    });

    return functions;
  }

  // 提取函数参数并转换为数值
  private static extractFunctionArgs(node: ValueParserFunctionNode): number[] {
    const args: number[] = [];

    if (node.nodes) {
      node.nodes.forEach((arg: ValueParserNode) => {
        if (arg.type === 'word') {
          const numValue = this.parseNumericValue(arg.value);
          if (numValue !== null) {
            args.push(numValue);
          }
        }
      });
    }

    return args;
  }

  // 解析数值（支持 px, deg, % 等单位）
  private static parseNumericValue(value: string): number | null {
    // 移除单位，只保留数值
    const match = value.match(/^(-?\d*\.?\d+)(px|deg|%|em|rem)?$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];

      // 角度转弧度
      if (unit === 'deg') {
        return (num * Math.PI) / 180;
      }

      return num;
    }

    return null;
  }
}
