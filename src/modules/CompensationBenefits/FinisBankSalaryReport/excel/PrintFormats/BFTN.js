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
      fontSize: 7,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}
const getTableData = (row, BankName) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(String(index + 1), "center", "text").getCell(),
      new Cell(item?.accountName || "N/A", "left", "text").getCell(),
      new Cell(item?.employeeId || "N/A", "center", "text").getCell(),
      new Cell(item?.financialInstitution || "N/A", "left", "text").getCell(),
      new Cell(item?.branchName || "N/A", "center", "text").getCell(),
      new Cell(item?.accType || "N/A", "center", "text").getCell(),
      new Cell(item?.accountNo || "N/A", "left", "text").getCell(),
      new Cell(item?.numNetPayable || "N/A", "right", "money").getCell(),
      new Cell(item?.reason || "N/A", "left", "text").getCell(),
      new Cell(item?.adviceType || "N/A", "center", "text").getCell(),
      new Cell(item?.routingNumber || "N/A", "left", "text").getCell(),
      new Cell(item?.employeeCode || "N/A", "center", "text").getCell(),
    ];
  });
  return data;
};

export const formatBEFTN = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  bankAccountNo,
  total,
  totalInWords,
  buAddress,
  values
) => {
  const excel = {
    name: "Bank Advice",
    sheets: [
      {
        name: "Bank Advice",
        gridLine: false,
        rows: [
          [
            {
              text: businessUnit,
              fontSize: 16,
              bold: true,
              cellRange: "A1:L1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 12,
              bold: true,
              cellRange: "A1:L1",
              merge: true,
              alignment: "center:middle",
              margins: {
                insetmode: "custom",
                inset: [1, 1, 1, 1],
              },
            },
          ],
          [
            {
              text: "Bank Advice Report",
              fontSize: 12,
              underline: true,
              bold: true,
              cellRange: "A1:L1",
              merge: true,
              alignment: "center",
            },
          ],
          [
            {
              text: `${values?.bankAdviceFor?.value === 2 ? "Bonus" : "Salary"} For the month of ${comapanyNameHeader.toUpperCase()}`,
              fontSize: 12,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center",
            },
          ],
          ["_blank*2"],
          // [
          //   {
          //     text: "To",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:J1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          //   {
          //     text: comapanyNameHeader,
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "K1:L1",
          //     merge: true,
          //   },
          // ],
          // [
          //   {
          //     text: "The Manager",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: bankAccountNo?.BankName,
          //     fontSize: 9,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "",
          //     fontSize: 9,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: `Subject : Payment Instruction by BEFTN for ${comapanyNameHeader}`,
          //     fontSize: 9,
          //     bold: true,
          //     underline: true,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "Dear Sir,",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: `We do hereby requesting you to make payment by transferring the amount to the respective Account Holder as shown below in detailed `,
          //     fontSize: 8,
          //     italic: true,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: `by debiting our CD Account No. ${bankAccountNo.label} `,
          //     fontSize: 8,
          //     bold: true,
          //     italic: true,
          //     cellRange: "A1:L1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          [
            {
              text: "Detailed particulars of each Account Holder:",
              fontSize: 9,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*2"],
          [
            {
              text: "SL No",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Account Name",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Code No",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Bank Name",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Branch Name",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "A/C Type",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Account No",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Amount",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Payment Info",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Comments",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Routing No",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Instrument No",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
          ],
          ...getTableData(rowDto, bankAccountNo?.BankName),
          [
            {
              text: "Total",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: total,
              fontSize: 7,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
          ],
          ["_blank*1"],
          [
            {
              text: `In Word : ${totalInWords} Taka Only.`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*3"],
          [
            {
              text: `For : ${businessUnit}`,
              fontSize: 10,
              bold: true,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*2"],
          [
            {
              text: `Authorize Signature`,
              fontSize: 10,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left:middle",
            },
            // {
            //   text: `Authorize Signature`,
            //   fontSize: 10,
            //   bold: true,
            //   cellRange: "D1:F1",
            //   merge: true,
            //   alignment: "left:middle",
            // },
          ],
          ["_blank*2"],
          [
            {
              text: `System Generated Report ${moment().format("ll")}`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center:middle",
            },
          ],
        ],
      },
    ],
  };
  createFile(excel, false);
};
