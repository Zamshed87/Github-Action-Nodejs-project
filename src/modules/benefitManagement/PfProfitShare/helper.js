import axios from "axios";
import { PButton } from "Components";
import { toast } from "react-toastify";

export const getHeader = (pages, setOpenView) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    align: "center",
    width: 20,
  },
  {
    title: "Profit Share Date",
    dataIndex: "profitShareDate",
    render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    width: 120,
  },
  {
    title: "Total Employee Contribution",
    dataIndex: "totalEmployeeContribution",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 120,
  },
  {
    title: "Total Employer Contribution",
    dataIndex: "totalCompanyContribution",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 120,
  },
  {
    title: "Total Profit Earned",
    dataIndex: "totalProfitEarned",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 100,
  },
  {
    title: "Total PF Balance",
    dataIndex: "totalPFBalance",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 100,
  },
  {
    title: "Total Profit Share Amount",
    dataIndex: "totalProfitShareAmount",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 140,
  },
  {
    title: "Total Profit Share %",
    dataIndex: "totalProfitSharePercentage",
    render: (value) => (value != null ? `${value}%` : "-"),
    width: 100,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value) => value ?? "-",
    width: 100,
  },
  {
    title: "Action",
    align: "center",
    width: 140,
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => setOpenView?.({ open: true, data: record })}
        />
        {/* <PButton disabled content="Edit" type="primary" onClick={() => {}} /> */}
      </div>
    ),
  },
];
export const getViewHeader = (pages) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    align: "center",
    width: 50,
  },
  {
    title: "Workplace Group",
    dataIndex: "workplaceGroupName",
    width: 120,
  },
  {
    title: "Workplace",
    dataIndex: "workplaceName",
    width: 120,
  },
  {
    title: "Employee Name",
    dataIndex: "employeeName",
    width: 160,
  },
  {
    title: "Employee Code",
    dataIndex: "employeeCode",
    width: 120,
  },
  {
    title: "Designation",
    dataIndex: "designationName",
    width: 150,
  },
  {
    title: "Department",
    dataIndex: "departmentName",
    width: 150,
  },
  {
    title: "Employee Contribution",
    dataIndex: "employeeContribution",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 160,
  },
  {
    title: "Company Contribution",
    dataIndex: "companyContribution",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 160,
  },
  {
    title: "Employee Profit",
    dataIndex: "employeeProfit",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 140,
  },
  {
    title: "Company Profit",
    dataIndex: "companyProfit",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 140,
  },
  {
    title: "Employee Current Profit",
    dataIndex: "employeeCurrentProfit",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 180,
  },
  {
    title: "Company Current Profit",
    dataIndex: "companyCurrentProfit",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 180,
  },
  {
    title: "Total PF Amount",
    dataIndex: "totalPFAmount",
    render: (value) => value?.toLocaleString?.() ?? 0,
    align: "right",
    width: 160,
  },
];

export const viewPFProfitShare = async (
  query,
  setData,
  setLoading,
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/PFProfitShare/GetAllLanding?AccountId=${query?.accountId}&BusinessUnitId=${query?.buId}&HeaderId=${query?.headerId}`,
      query
    );
    setData?.(res?.data);
    setLoading?.(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};
