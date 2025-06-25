import { PButton } from "Components";
import axios from "axios";

export const getHeader = (pages, handlePreview) => [
  // {
  //   title: "SL",
  //   render: (_, __, index) =>
  //     (pages?.current - 1) * pages?.pageSize + index + 1,
  //   width: 60,
  //   align: "center",
  //   fixed: "left",
  // },
  {
    title: "Employee Code",
    dataIndex: "strEmployeeCode",
    width: 80,
  },
  {
    title: "Employee Name",
    dataIndex: "strEmployee",
    width: 120,
  },
  {
    title: "Designation",
    dataIndex: "strDesignation",
    width: 120,
  },
  {
    title: "Department",
    dataIndex: "strDepartment",
    width: 120,
  },
  {
    title: "Section",
    dataIndex: "strSection",
    render: (text, record) => record?.strSection || "N/A",
    width: 100,
  },
  {
    title: "Joining Date",
    dataIndex: "dteJoiningDate",
    render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    width: 80,
  },
  {
    title: "TIN",
    dataIndex: "strTIN",
    width: 80,
  },
  {
    title: "Assessment Month Count",
    dataIndex: "intAssessmentMonth",
    width: 100,
  },
  {
    title: "Total Gross Salary & Allowance",
    dataIndex: "numGrossAmount",
    width: 120,
  },
  {
    title: "TDS on Salary",
    dataIndex: "numTaxAmount",
    width: 100,
  },
  {
    title: "Net Payment",
    dataIndex: "numNetPayment",
    width: 100,
  },
  {
    title: "Action",
    width: 120,
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="Preview"
          type="primary-outline"
          onClick={() => {
            handlePreview(record);
          }}
        />
      </div>
    ),
  },
];

/**
 * Calls the TaxSalaryCertificate API with the given format and employees.
 * @param {string} strformat - 'pdf' or 'html'
 * @param {Array} listOfEmployees - Array of { intEmployeeId, intFiscalYearId }
 * @param {object} axiosConfig - Optional axios config (e.g., { responseType: 'blob' })
 * @returns {Promise<any>} - API response
 */
export const fetchTaxSalaryCertificateApi = async (
  strformat,
  listOfEmployees,
  axiosConfig = {}
) => {
  const payload = {
    strformat,
    listOfEmployees,
  };
  const response = await axios.post(
    "/TaxReport/TaxSalaryCertificate",
    payload,
    axiosConfig
  );
  return response;
};
