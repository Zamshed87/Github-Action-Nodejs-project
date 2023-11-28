import Excel from "exceljs";
import { toast } from "react-toastify";

export const excelFileToArray = (file, sheetName) => {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    const data = [];
    workbook.xlsx
      .load(file)
      .then(function () {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) return toast.warning("Sheet name does not match");
        const firstRowValues = worksheet.getRow(1).values;

        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex !== 1) {
            data.push(createObject(firstRowValues, row.values));
          }
        });
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const excelFileToJSON = (file) => {
  return JSON.parse(excelFileToArray(file));
};

function createObject(keys, values) {
  let obj = {};
  for (let index = 0; index < keys.length; index++) {
    // eslint-disable-next-line eqeqeq
    if (keys[index] != null && keys[index] != undefined) {
      obj[keys[index]] = values[index];
    }
  }
  return obj;
}
