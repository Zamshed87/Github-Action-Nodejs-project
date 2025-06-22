import axios from "axios";
import { toast } from "react-toastify";

export const createPFProfitShare = async (
  payload,
  setLoading,
  resetData,
  setVisible
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/PFProfitShare/Create
`,
      payload
    );
    toast.success(res?.data?.message?.[0] || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    setVisible?.({
      open: true,
      data: error?.response?.data?.message?.[0] || "Something went wrong",
    });
    toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
    setLoading?.(false);
  }
};

export const getHeader = (pages) => {
  return [
    {
      title: "SL",
      render: (_, __, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroupName",
      render: (text) => text ?? "-",
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      render: (text) => text ?? "-",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (text) => text ?? "-",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      render: (text) => text ?? "-",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      render: (text) => text ?? "-",
    },
    {
      title: "Employee Contribution",
      dataIndex: "employeeContribution",
      render: (text) => text ?? "-",
    },
    {
      title: "Company Contribution",
      dataIndex: "companyContribution",
      render: (text) => text ?? "-",
    },
    {
      title: "Emp. Profit",
      dataIndex: "employeeProfit",
      render: (text) => text ?? "-",
    },
    {
      title: "Comp. Profit",
      dataIndex: "companyProfit",
      render: (text) => text ?? "-",
    },
    {
      title: "Total PF Amount",
      dataIndex: "totalPFAmount",
      render: (text) => text ?? "-",
    },
    {
      title: "Running Profit Share",
      dataIndex: "runningProfitShare",
      render: (value) => {
        return value ?? "-";
      },
    },
    {
      title: "Emp. Profit Share",
      dataIndex: "employeeProfitShare",
      render: (value) => {
        return value ?? "-";
      },
    },
    {
      title: "Comp. Profit Share",
      dataIndex: "companyProfitShare",
      render: (text) => text ?? "-",
    },
  ];
};
