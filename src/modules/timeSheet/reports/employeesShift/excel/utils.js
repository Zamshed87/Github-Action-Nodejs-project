import { Workbook } from 'exceljs';

export const getWorkBook = ({ creator = '', createTime = new Date() }) => {
  const workbook = new Workbook();
  workbook.creator = creator;
  workbook.created = createTime;
  return workbook;
};


export const getIndex = char => {
  return char?.toUpperCase()?.charCodeAt() - 64;
};