import axios from "axios";
import { toast } from "react-toastify";

export const createPFPolicy = async (
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
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};

export const getHeader = (pages) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    align: "center",
    width: 20,
  },
  {
    title: "Workplace Group",
    dataIndex: "workplaceGroup",
    key: "workplaceGroup",
  },
  {
    title: "Workplace",
    dataIndex: "workplace",
    key: "workplace",
  },
  {
    title: "Employee Name",
    dataIndex: "employeeName",
    key: "employeeName",
  },
  {
    title: "Designation",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "Employee Contribution",
    dataIndex: "employeeContribution",
    key: "employeeContribution",
  },
  {
    title: "Company Contribution",
    dataIndex: "companyContribution",
    key: "companyContribution",
  },
  {
    title: "Emp. Profit",
    dataIndex: "employeeProfit",
    key: "employeeProfit",
  },
  {
    title: "Comp. Profit",
    dataIndex: "companyProfit",
    key: "companyProfit",
  },
  {
    title: "Total PF Amount",
    dataIndex: "totalPfAmount",
    key: "totalPfAmount",
  },
  {
    title: "Running Profit Share",
    dataIndex: "runningProfitShare",
    key: "runningProfitShare",
  },
  {
    title: "Emp. Profit Share",
    dataIndex: "employeeProfitShare",
    key: "employeeProfitShare",
  },
  {
    title: "Comp. Profit Share",
    dataIndex: "companyProfitShare",
    key: "companyProfitShare",
  },
];