const fs = require('fs');
const XLSX = require('xlsx');
//读取typescript语言包转换成xlsx文件的方法
function convertLocalesToExcel(zhCNContent, enUSContent, outputPath) {
  // 删除已存在的文件
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log(`已删除已存在的文件: ${outputPath}`);
  }

  // 提取键值对
  const zhCNData = extractKeyValuePairs(zhCNContent);
  const enUSData = extractKeyValuePairs(enUSContent);

  // 创建工作簿和工作表
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);

  // 添加表头
  const header = ['key', '中文', '英文'];
  XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

  // 添加数据
  let row = 2;
  for (const key in zhCNData) {
    const zhValue = zhCNData[key];
    const enValue = enUSData[key] || '';

    const data = [key, zhValue, enValue];
    XLSX.utils.sheet_add_aoa(worksheet, [data], { origin: `A${row}` });
    row++;
  }

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Menu');

  // 保存为.xlsx文件
  XLSX.writeFile(workbook, outputPath);
  console.log(`转换完成，生成的${outputPath}文件已保存。`);
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
const zhCNContent = fs.readFileSync('./src/locales/zh-CN/menu.ts', 'utf-8');
const enUSContent = fs.readFileSync('./src/locales/en-US/menu.ts', 'utf-8');
const outputPath = './menu.xlsx';
// const zhCNContent = fs.readFileSync('./src/locales/zh-CN/automaticExtraction.ts', 'utf-8');
// const enUSContent = fs.readFileSync('./src/locales/en-US/automaticExtraction.ts', 'utf-8');
// const outputPath = './automaticExtraction.xlsx';

convertLocalesToExcel(zhCNContent, enUSContent, outputPath);