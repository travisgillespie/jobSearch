function openSheet() {
  var id = constants.docId;
  return SpreadsheetApp.openById(id);
}

function getSheet(doc, sheetName){
  return doc.getSheetByName(sheetName);
}

function getRange(sheet){
  var startingRow = 2; //for row 2
  var firstRow = 1; //for row 1
  var firstCol = 1; //for col A
  var lastRow = (sheet.getLastRow() <= 1) ? 1: sheet.getLastRow() - 1;
  var lastCol = sheet.getLastColumn() + 1;
  return sheet.getRange(startingRow,firstCol, lastRow, lastCol).getValues();
}

function getLastRow(sheet){
  return sheet.getLastRow();
}

function getFreeRow(sheet){
  return sheet.getLastRow() + 1;
}
