import Excel from "exceljs";
import { toast } from "react-toastify";

export const excelFileToArray = (file, sheetName, firstRow = 1) => {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    const data = [];
    workbook.xlsx
      .load(file)
      .then(function () {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) return toast.warning("Sheet name does not match");
        const firstRowValues = worksheet.getRow(firstRow).values;

        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex !== 1) {
            data.push(createObject(firstRowValues, row.values));
          }
        });
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
export const excelFileToJSON = (file) => {
  return JSON.parse(excelFileToArray(file));
};

function createObject(keys, values) {
  const obj = {};
  for (let index = 0; index < keys.length; index++) {
    // eslint-disable-next-line eqeqeq
    if (keys[index] != null && keys[index] != undefined) {
      obj[keys[index]] = values[index];
    }
  }
  return obj;
}
