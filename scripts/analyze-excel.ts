/**
 * Analyze Excel file structure and preview data
 * Run with: npx tsx scripts/analyze-excel.ts
 */

import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const filePath = path.join(
  __dirname,
  '../data/InterSolutionsEmployeeReportwB.xlsx'
);

console.log('📊 Analyzing Excel File...\n');
console.log(`File: ${filePath}\n`);

try {
  const workbook = XLSX.readFile(filePath);

  console.log('📑 Sheets in workbook:');
  workbook.SheetNames.forEach((name, i) => {
    console.log(`   ${i + 1}. ${name}`);
  });
  console.log('');

  // Analyze first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON to analyze
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  }) as unknown[][];

  console.log(`📋 Analyzing sheet: "${firstSheetName}"`);
  console.log(`   Total rows: ${data.length}`);
  console.log('');

  // Get headers (first row)
  const headers = data[0] as string[];
  console.log('📝 Columns (headers):');
  headers.forEach((header, i) => {
    console.log(`   ${i + 1}. ${header}`);
  });
  console.log('');

  // Show sample data (first 3 rows after header)
  console.log('👀 Sample data (first 3 records):');
  for (let i = 1; i <= Math.min(3, data.length - 1); i++) {
    console.log(`\n   Record ${i}:`);
    const row = data[i] as unknown[];
    headers.forEach((header, j) => {
      const value = row[j];
      if (value !== undefined && value !== null && value !== '') {
        console.log(`   - ${header}: ${value}`);
      }
    });
  }

  // Column mapping analysis
  console.log('\n\n📊 Column Mapping to Azure SQL (InterTalentShowcase):');
  console.log('─'.repeat(60));

  const azureColumns = [
    'Office',
    'ProfessionType',
    'Status',
    'PersonID',
    'Name',
    'PhoneNumber',
    'EmailAddress',
    'AssignmentID',
    'HireDate',
    'Address',
    'City',
    'State',
    'ZipCode',
    'ProfessionalSummary',
    'Skill',
    'RunDate',
    'RunTime',
    'OnAssignment',
  ];

  console.log('\nExcel Column → Azure SQL Column:');
  headers.forEach((excelCol) => {
    const normalizedExcel = excelCol.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matchedAzure = azureColumns.find(
      (az) => az.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedExcel
    );
    if (matchedAzure) {
      console.log(`   ✅ "${excelCol}" → ${matchedAzure}`);
    } else {
      console.log(`   ❓ "${excelCol}" → (no direct match)`);
    }
  });

  // Export to CSV with proper date handling
  const csvFileName = 'InterSolutionsEmployeeReportwB.csv';
  const csvPath = path.join(__dirname, '../data', csvFileName);

  // Use sheet_to_csv with dateNF option for proper date formatting
  const csvData = XLSX.utils.sheet_to_csv(worksheet, { dateNF: 'yyyy-mm-dd' });
  fs.writeFileSync(csvPath, csvData);

  console.log(`\n\n✅ Exported to CSV: data/${csvFileName}`);
  console.log(`   Total records: ${data.length - 1} (excluding header)`);
} catch (error) {
  console.error('❌ Error reading Excel file:', error);
}
