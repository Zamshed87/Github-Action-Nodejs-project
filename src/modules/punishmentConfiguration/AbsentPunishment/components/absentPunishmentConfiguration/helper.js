import axios from "axios";
import { PButton } from "Components";
import { toast } from "react-toastify";

export const createAbsentPunishment = async (
  payload,
  setLoading,
  setDetailList,
  history
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(`/AbsentPunishment/Create`, payload);
    console.log(res);
    toast.success(res?.data?.message?.[0] || "Submitted Successfully");
    setLoading?.(false);
    setDetailList?.([]);
    history.push("/administration/punishmentConfiguration/absentPunishment");
  } catch (error) {
    toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
    setLoading?.(false);
    setDetailList?.([]);
  }
};

export const detailsHeader = (setDetailList, absentCalculationType, action=true) => {
  const eachDay = absentCalculationType == 1;
  return [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
    },
    ...(eachDay
      ? [
          {
            title: "Each Day Count By",
            dataIndex: "eachDayCountBy",
          },
        ]
      : []),
    ...(!eachDay
      ? [
          {
            title: "Day Range",
            dataIndex: "dayRange",
            render: (val) => {
              console.log(val);
              if (val) {
                const [from, to] = val
                  .split("-")
                  .map((v) => parseInt(v.trim(), 10));
                return `${from} to ${to} day${to > 1 ? "s" : ""}`;
              }
              return "";
            },
          },
        ]
      : []),
    ...(eachDay
      ? [
          {
            title: "Consecutive Day",
            dataIndex: "consecutiveDay",
            render: (val) => (val ? "Yes" : "No"),
          },
        ]
      : []),
    {
      title: "Amount Deduction Type",
      dataIndex: "amountDeductionTypeName",
      render: (val) => val ?? "-",
    },
    {
      title: "% of Amount",
      dataIndex: "amountDeductionAmountOrPercentage",
      render: (val) => `${val}%`,
    },
    ...(action
      ? [
          {
            title: "Action",
            render: (_, row, index) => (
              <PButton
                type="danger"
                content="Remove"
                onClick={() => {
                  setDetailList((prev) => prev.filter((_, i) => i !== index));
                }}
              />
            ),
          },
        ]
      : []),
  ];
};
