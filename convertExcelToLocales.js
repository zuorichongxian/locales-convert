const fs = require('fs');
const XLSX = require('xlsx');
//读取xlsx文件转换成typescript的方法
function convertExcelToLocales(filePath, zhCNFilePath, enUSFilePath) {
  // 读取.xlsx文件
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Menu'];

  // 解析工作表数据
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // 转换为键值对对象
  const localesData = {};
  jsonData.forEach((row) => {
    const key = row.key;
    const zhValue = row['中文'];
    const enValue = row['英文'];

    localesData[key] = {
      'zh-CN': zhValue,
      'en-US': enValue,
    };
  });

  // 写入文件
  const zhCNContent = generateLocaleFileContent(localesData, 'zh-CN');
  const enUSContent = generateLocaleFileContent(localesData, 'en-US');

  fs.writeFileSync(zhCNFilePath, zhCNContent, 'utf-8');
  fs.writeFileSync(enUSFilePath, enUSContent, 'utf-8');

  console.log(`反向转换完成，写入文件成功。`);
}

// 生成对应语言的文件内容
function generateLocaleFileContent(localesData, language) {
  let content = '';

  for (const key in localesData) {
    const value = localesData[key][language];
    content += `'${key}': '${value}',\n`;
  }

  return `export default {\n${content}};\n`;
}

// 示例调用
// const filePath = './menu.xlsx';
// const zhCNFilePath = './src/locales/zh-CN/menu4.ts';
// const enUSFilePath = './src/locales/en-US/menu4.ts';

const filePath = './automaticExtraction.xlsx';
const zhCNFilePath = './src/locales/zh-CN/automaticExtraction1.ts';
const enUSFilePath = './src/locales/en-US/automaticExtraction1.ts';

convertExcelToLocales(filePath, zhCNFilePath, enUSFilePath);