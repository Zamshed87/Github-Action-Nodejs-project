import axios from "axios";
import { toast } from "react-toastify";

export const total = (arr, property) => {
  return arr.reduce((sum, item) => sum + item[property], 0);
};

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
export const getSalaryReport = async (
  partName,
  accId,
  busId,
  wgId,
  monthId,
  yearId,
  salaryCode,
  reqId,
  moneyTransactionProcess,
  employeeId,
  setter,
  setAllData,
  settertableData,
  setLoading,
  setTableAllowanceHead,
  setTableDeductionHead
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/SalaryDetailsReport?intAccountId=${accId}&intBusinessUnitId=${busId}&intMonthId=${monthId}&intYearId=${yearId}&strSalaryCode=${salaryCode}&intWorkplaceGroupId=${wgId}`
    );
    if (res?.status === 200) {
      try {
        const tableResData = await axios.get(
          `/Payroll/SalarySelectQueryAll?partName=${partName}&intAccountId=${accId}&intBusinessUnitId=${busId}&intMonthId=${monthId}&intYearId=${yearId}&intSalaryGenerateRequestId=${
            +res?.data?.[0]?.intSalaryGenerateRequestId || reqId || 0
          }&intBankOrWalletType=${
            moneyTransactionProcess || 0
          }&intEmployeeId=${employeeId}&intWorkplaceGroupId=${wgId}`
        );
        if (tableResData?.status === 200) {
          let primarySalaryHead = [];
          let salaryAllowanceHead = [];
          let salaryDeductionHead = [];
          if (tableResData?.data[0]?.PrimarySalaryHead) {
            primarySalaryHead =
              tableResData?.data[0]?.PrimarySalaryHead.replace(
                /[[\]']+/g,
                ""
              ).split(",");
          }
          if (tableResData?.data[0]?.SalaryAllowanceHead) {
            salaryAllowanceHead =
              tableResData?.data[0]?.SalaryAllowanceHead.replace(
                /[[\]']+/g,
                ""
              ).split(",");
          }
          if (tableResData?.data[0]?.SalaryDeductionHead) {
            salaryDeductionHead = tableResData?.data[0]?.SalaryDeductionHead
              ? tableResData?.data[0]?.SalaryDeductionHead.replace(
                  /[[\]']+/g,
                  ""
                ).split(",")
              : "";
          }
          settertableData?.([...primarySalaryHead]);
          setTableAllowanceHead?.([...salaryAllowanceHead]);
          setTableDeductionHead?.([...salaryDeductionHead]);
          const allHead = [
            ...primarySalaryHead,
            ...salaryAllowanceHead,
            ...salaryDeductionHead,
            "numGrossSalary",
            "numPFAmount",
            "numTaxAmount",
            "numArearSalary",
            "numPFCompany",
            "numGratuity",
            "TotalPfNGratuity",
            "numNetPayableSalary",
            "TotalCostOfSalary",
            "TotalSalary",
          ];
          const mdifiedObj = {};
          allHead.forEach((key) => {
            mdifiedObj[key] = 0;
          });
          let i = 1;
          let tempArr = res?.data?.map((item, idx) => {
            if (item?.DeptName.trim()) {
              return {
                ...item,
                DeptName: item?.DeptName,
                sl: null,
                numTotalGrossSalary: 0,
              };
            } else {
              return {
                ...item,
                sl: i++,
                numTotalGrossSalary:
                  (item?.numGrossSalary || 0) + (item?.numTotalAllowance || 0),
              };
            }
          });
          for (let i = 0; i < tempArr.length; ) {
            let curr = tempArr[i];
            let temp = {
              ...mdifiedObj,
            };
            i++;
            if (i < tempArr.length) {
              while (
                i < tempArr.length &&
                tempArr[i].DeptName?.trim()?.length === 0
              ) {
                for (let key in temp) {
                  temp[key] += tempArr[i]?.[key];
                }
                i++;
              }
              tempArr = tempArr.map((item) => {
                if (item.DeptName === curr.DeptName) {
                  return { ...item, ...temp };
                } else {
                  return item;
                }
              });
            }
          }
          let temp = [];
          let prev = { ...tempArr[0] };
          temp.push(prev);
          for (let i = 1; i < tempArr.length; i++) {
            if (tempArr[i].DeptName.trim()?.length > 0) {
              temp.push({ ...prev, DeptName: "Sub-Total:" });
              prev = { ...tempArr[i] };
              temp.push(tempArr[i]);
            } else {
              temp.push(tempArr[i]);
            }
          }
          temp.push({ ...prev, DeptName: "Sub-Total:" });
          setter?.(temp);
          setAllData?.(temp);
          setLoading && setLoading(false);
        }
      } catch (error) {
        setLoading && setLoading(false);
      }
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getSalaryDetailsReportRDLC = async ({
  partName,
  intMonthId,
  intYearId,
  strSalaryCode,
  intAccountId,
  setLoading,
  buId,
  setterData,
  cb,
  url,
  wgId,
}) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      url
        ? url
        : `/PdfAndExcelReport/${partName}?intAccountId=${intAccountId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${intMonthId}&intYearId=${intYearId}&strSalaryCode=${strSalaryCode}`
    );
    if (res?.data) {
      setterData?.(res?.data);
      cb?.(res?.data);
      setLoading?.(false);
    } else {
      toast.warn("No data received !");
      setLoading?.(false);
    }
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
