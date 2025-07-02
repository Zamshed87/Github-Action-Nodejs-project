import { PButton } from "Components";
import axios from "axios";
import { toast } from "react-toastify";

export const getHeader = (pages, handlePreview) => [
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
export const assignPFPolicy = async (
  payload,
  setLoading,
  resetData,
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(`/PfPolicy/Save
`, payload);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.data?.[0]?.errorMessage || "Something went wrong");
    setLoading?.(false);
  }
};
