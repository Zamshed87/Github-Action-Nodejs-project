import { PInput } from "Components";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export const getHeader = (pages, handleInputChange) => [
  {
    title: "Employee Code",
    dataIndex: "strEmployeeCode",
    width: 80,
  },
  {
    title: "Employee Name",
    dataIndex: "strEmployeeName",
    width: 120,
  },
  {
    title: "Employement Type",
    dataIndex: "strEmploymentType",
    width: 120,
  },
  {
    title: "Joining Date",
    dataIndex: "dteJoiningDate",
    render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    width: 100,
  },
  {
    title: "Service Length",
    dataIndex: "intServiceLengthInMonth",
    width: 120,
  },
  {
    title: "PF Code",
    dataIndex: "StrPfCode",
    width: 120,
    render: (text, record) => (
      <PInput
        type="text"
        value={text || ""}
        onChange={(e) => handleInputChange(record, "StrPfCode", e.target.value)}
        placeholder="Enter PF Code"
        style={{ width: "100%" }}
      />
    ),
  },
  {
    title: "Effective Month *",
    dataIndex: "DteEffectiveMonthF",
    width: 120,
    render: (text, record) => (
      <PInput
        type="month"
        value={text || ""}
        onChange={(value) => {
          const startOfMonth = moment(value, "YYYY-MM")
            .startOf("month")
            .format("YYYY-MM-DD");
          handleInputChange(record, "DteEffectiveMonth", startOfMonth);
          handleInputChange(record, "DteEffectiveMonthF", value);
        }}
        placeholder="Select Month"
        style={{ width: "100%" }}
        format="YYYY-MM"
      />
    ),
  },
];

export const assignPFPolicy = async (payload, setLoading, resetData) => {
  setLoading?.(true);
  try {
    const res = await axios.post(`/PfPolicy/AssignEmployeeToPfPolicy`, payload);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(
      error?.response?.data?.data?.[0]?.errorMessage || "Something went wrong"
    );
    setLoading?.(false);
  }
};
