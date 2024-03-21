import axios from "axios";

export const total = (arr, property) => {
  return arr.reduce((sum, item) => sum + (item?.[property] || 0), 0);
};

export const currentYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return currentYear;
};

export const getSalaryReport = async (
  partName,
  accId,
  busId,
  wgId,
  monthId,
  yearId,
  fromDate,
  toDate,
  reqId,
  moneyTransactionProcess,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);

  let fromDateParams = fromDate ? `&GenerateFromDate=${fromDate}` : "";
  let toDateParams = toDate ? `&GenerateToDate=${toDate}` : "";

  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=${partName}&intAccountId=${accId}&intBusinessUnitId=${busId}&intMonthId=${monthId}&intWorkplaceGroupId=${wgId}&intYearId=${yearId}&intSalaryGenerateRequestId=${
        reqId || 0
      }&intBankOrWalletType=${
        moneyTransactionProcess || 0
      }${fromDateParams}${toDateParams}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
