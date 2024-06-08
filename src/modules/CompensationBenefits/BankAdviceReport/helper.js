import axios from "axios";
import * as Yup from "yup";
import { numberWithCommas } from "../../../utility/numberWithCommas";

export const bankAdviceInitialValues = {
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  description: "",
  monthYear: "" /* moment().format("YYYY-MM") */,
  payrollGroup: "",
  adviceName: "",
  adviceTo: "",
  bankAccountNo: "",
  monthId: "" /* new Date().getMonth() + 1 */,
  yearId: "" /* new Date().getFullYear() */,
  search: "",
  bank: "",
  account: "",

  // new 08-06-2024
  bankAdviceFor: "",
  bonusName: "",
  bonusCode: [],
};

export const bankAdviceValidationSchema = Yup.object().shape({
  // adviceName: Yup.object()
  //   .shape({
  //     value: Yup.string().required("Salary Code is required"),
  //     label: Yup.string().required("Salary Code is required"),
  //   })
  //   .typeError("Salary Code is required"),
  workplaceGroup: Yup.object()
    .shape({
      value: Yup.string().required("Workplace Group is required"),
      label: Yup.string().required("Workplace Group is required"),
    })
    .typeError("Workplace Group is required"),

  workplace: Yup.object()
    .shape({
      value: Yup.string().required("Workplace is required"),
      label: Yup.string().required("Workplace is required"),
    })
    .typeError("Workplace is required"),

  account: Yup.object()
    .shape({
      value: Yup.string().required("Account is required"),
      label: Yup.string().required("Account is required"),
    })
    .typeError("Advice To is required"),
  bank: Yup.object()
    .shape({
      value: Yup.string().required("Bank is required"),
      label: Yup.string().required("Bank is required"),
    })
    .typeError("Bank is required"),
  monthYear: Yup.date().required("Payroll month is required"),
});

// salary generate landing
export const getBankAdviceRequestLanding = async (
  orgId,
  buId,
  wgId,
  pages,
  values,
  setPages,
  setter,
  setLoading,
  searchTxt = "",
  isForXl = false,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const payload = {
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intMonthId: values?.monthId,
      intYearId: values?.yearId,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      intBankId: values?.bank?.value,
      intSalaryGenerateRequestId: values?.adviceName?.value,
      bankAccountNo: values?.account?.AccountNo,
      intBankOrWalletType: 1,
      strAdviceType: "",
      isForXl: isForXl,
      searchTxt: searchTxt,
      pageNo: pages?.current,
      pageSize: pages?.pageSize,
    };

    const res = await axios.post(`/Payroll/BankAdvaiceReport`, payload);
    if (res?.data?.data) {
      const modifiedData = res.data.data.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setter && setter(modifiedData);
      cb?.(modifiedData);
      setPages?.({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getBankAdviceBonusRequestLanding = async (
  orgId,
  buId,
  wgId,
  pages,
  values,
  setPages,
  setter,
  setLoading,
  searchTxt = "",
  isForXl = false,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const concatBonusCode = values?.bonusCode?.map((item) => item?.value)
    const payload = {
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intMonthId: values?.monthId,
      intYearId: values?.yearId,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      intBankId: values?.bank?.value,
      intSalaryGenerateRequestId: values?.adviceName?.value || 0,
      bankAccountNo: values?.account?.AccountNo,
      intBankOrWalletType: 1,
      strAdviceType: "",
      isForXl: isForXl,
      searchTxt: searchTxt,
      pageNo: pages?.current,
      pageSize: pages?.pageSize,
      intBonunHeaderList: concatBonusCode || [],
    };

    const res = await axios.post(`/Payroll/BonusBankAdvaiceReport`, payload);
    if (res?.data?.data) {
      const modifiedData = res.data.data.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setter && setter(modifiedData);
      cb?.(modifiedData);
      setPages?.({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const bankAdviceColumnData = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "workPlaceGroupName",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Workplace/Concern",
      dataIndex: "workPlaceName",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Emp ID ",
      dataIndex: "employeeCode",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name ",
      dataIndex: "employeeName",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Bank Acc No",
      dataIndex: "accountNo",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Bank",
      dataIndex: "financialInstitution",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Receiving Bank Routing",
      dataIndex: "routingNumber",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    // {
    //   title: "Acc Type",
    //   dataIndex: "accType",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    {
      title: "Amount",
      dataIndex: "numNetPayable",
      render: (record) => numberWithCommas(record?.numNetPayable),
      sort: true,
      filter: false,
      fieldType: "number",
    },
    // {
    //   title: "Receiver ID",
    //   dataIndex: "employeeCode",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Receiver Name",
    //   dataIndex: "accountName",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    {
      title: "Sender Acc Number",
      dataIndex: "bankAccountNumber",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },
    // {
    //   title: "Advice Type",
    //   dataIndex: "adviceType",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
  ];
};
