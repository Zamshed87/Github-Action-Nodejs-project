import moment from "moment";
import { createFile } from "./createFile";

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 7.5,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}
const getTableData = (row, comapanyNameHeader) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(index + 1, "center", "text").getCell(),
      new Cell(item?.accountNo || "N/A", "left", "text").getCell(),
      new Cell(item?.numNetPayable || 0, "right", "money").getCell(),
      new Cell(item?.reason || "N/A", "left", "text").getCell(),

      new Cell(item?.accountName || "N/A", "left", "text").getCell(),
      new Cell("Cr", "center", "text").getCell(),
      new Cell(comapanyNameHeader, "center", "text").getCell(),
      new Cell("BDT" || "N/A", "center", "text").getCell(),
      new Cell("N/A", "left", "text").getCell(),
    ];
  });
  return data;
};

export const topSheet = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  values,
  total,
  totalInWords,
  buAddress
) => {
  console.log({ values });
  const excel = {
    name: `${values?.bank?.label} Top Sheet`,
    sheets: [
      {
        name: `${values?.bank?.label} Top Sheet`,
        gridLine: false,
        rows: [
          [
            {
              text: businessUnit,
              fontSize: 16,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 12,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center",
            },
          ],
          [
            {
              text: "Bank Advice Report",
              fontSize: 12,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center",
            },
          ],
          ["_blank*2"],
          [
            {
              text: `${moment().format("DD-MMMM-yyyy")}`,
              fontSize: 10,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left",
            },
          ],
          [
            {
              text: "To,",
              fontSize: 10,
              bold: true,
              cellRange: "A1:D1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text:
                values?.bank?.label === "Standard Chartered Bank" ||
                values?.bank?.label === "Dhaka Bank Limited "
                  ? "Branch Manager"
                  : "The Manager",
              fontSize: 10,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: values?.bank?.label,
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text:
                values?.bank?.label === "Standard Chartered Bank"
                  ? "Dhanmondi Road# 5 Branch "
                  : values?.bank?.label === "Dhaka Bank Limited "
                  ? "Imamganj Branch Dhaka"
                  : "Local Office Branch, Dilkusha Dhaka.",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text:
                values?.bank?.label === "Standard Chartered Bank"
                  ? "House 6, Road 5, Dhanmondi R/A, Dhaka-1209."
                  : "",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `Subject : REQUEST TO DISBURSE EMPLOYEE SALARY ${comapanyNameHeader.toUpperCase()}`,
              fontSize: 10,
              bold: true,
              underline: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
          [
            {
              text: "Dear Recipients,",
              fontSize: 9,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `With due respect, please disburse the net payable amount BDT ${total} (${totalInWords} Only) as Employee Salary ${comapanyNameHeader} to the all-account holders as per attached sheet from our Company Account ${values?.account?.AccountNo} `,
              fontSize: 9,
              cellRange: "A2:H1",
              merge: true,
              alignment: "left:middle",
              wrapText: true,
            },
          ],
          ["_blank*1"],
          [
            {
              text: "We are looking forward for your kind cooperation.",
              fontSize: 9,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
          [
            {
              text: "Thanking You",
              fontSize: 9,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
        ],
      },
    ],
  };
  createFile(excel, true);
};
