const fs = require('fs');

function convertLocalesToMarkdown(zhCNFilePath, enUSFilePath, mdFilePath) {
  // 读取文件内容
  const zhCNContent = fs.readFileSync(zhCNFilePath, 'utf-8');
  const enUSContent = fs.readFileSync(enUSFilePath, 'utf-8');

  // 提取键值对
  const zhCNData = extractKeyValuePairs(zhCNContent);
  const enUSData = extractKeyValuePairs(enUSContent);

  // 转换为.md文件格式
  let mdContent = '| key | 中文 | 英文 |\n';
  mdContent += '|-|-|-|\n';

  for (const key in zhCNData) {
    const zhValue = zhCNData[key];
    const enValue = enUSData[key] || '';

    mdContent += `| ${key} | ${zhValue} | ${enValue} |\n`;
  }

  // 写入到.md文件
  fs.writeFileSync(mdFilePath, mdContent, 'utf-8');

  console.log('转换完成，生成的menu.md文件已保存。');
}

// 提取键值对的辅助函数
function extractKeyValuePairs(content) {
  const keyValuePairs = {};
  const regex = /'([^']+)':\s*'([^']*)'/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const value = match[2];
    keyValuePairs[key] = value;
  }

  return keyValuePairs;
}

// 示例调用
const zhCNFilePath = './src/locales/zh-CN/menu.ts';
const enUSFilePath = './src/locales/en-US/menu.ts';
const mdFilePath = './menu.md';

convertLocalesToMarkdown(zhCNFilePath, enUSFilePath, mdFilePath);