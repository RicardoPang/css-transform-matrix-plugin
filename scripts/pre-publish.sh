#!/bin/bash

echo "🚀 Starting pre-publish checks..."

# 检查是否已登录 npm
echo "📋 Checking npm authentication..."
npm whoami || {
  echo "❌ Not logged in to npm. Please run 'npm login' first."
  exit 1
}

# 清理构建
echo "🧹 Cleaning build..."
rm -rf dist/

# 运行测试
echo "🧪 Running tests..."
npm run test || {
  echo "❌ Tests failed!"
  exit 1
}

# 代码检查
echo "🔍 Running linter..."
npm run lint || {
  echo "❌ Linting failed!"
  exit 1
}

# 构建
echo "📦 Building..."
npm run build || {
  echo "❌ Build failed!"
  exit 1
}

# 检查包内容
echo "📋 Checking package contents..."
npm pack --dry-run

echo "✅ All checks passed! Ready to publish."
echo "Run 'npm publish' to publish to npm."