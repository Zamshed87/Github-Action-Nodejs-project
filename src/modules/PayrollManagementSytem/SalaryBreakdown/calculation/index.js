import axios from "axios";
import { defaultCalculation } from "./defaultCalculation";
import { desiFarmerCalculation } from "./desiFarmer";
import { iFarmerCalculation } from "./iFarmar";

export const payrollGroupCalculation = (
  accId,
  employeeId,
  payload,
  singleData,
  state,
  dynamicForm,
  values,
  setLoading,
  callback
) => {
  switch (accId) {
    case 10026:
      return desiFarmerCalculation(
        employeeId,
        payload,
        singleData,
        state,
        dynamicForm,
        values,
        setLoading,
        callback
      );

    case 10015:
      return iFarmerCalculation(
        employeeId,
        payload,
        singleData,
        state,
        dynamicForm,
        values,
        setLoading,
        callback
      );

    default:
      return defaultCalculation(
        employeeId,
        payload,
        singleData,
        state,
        dynamicForm,
        values,
        setLoading,
        callback
      );
  }
};

export const payrollGroupElementList = async (accId, autoId, setter) => {
  try {
    const res = await axios.get(
      `/Payroll/GetAllAppliedSalaryBreakdownElement?SalaryBreakdownHeaderId=${autoId}`
    );
    if (res?.data) {
      let modifyData = [];

      switch (accId) {
        case 10015:
          modifyData = res?.data?.map((itm) => {
            return {
              ...itm,
              intDependsOn: itm?.strDependOn === "Gross" ? 1 : 2,
              [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
                itm?.strBasedOn === "Amount"
                  ? itm?.numAmount
                  : itm?.strDependOn === "Basic"
                  ? itm?.numNumberOfPercent
                  : itm?.numNumberOfPercent,
              showPercentage:
                itm?.strDependOn === "Basic"
                  ? itm?.numNumberOfPercent
                  : itm?.numNumberOfPercent,
              levelVariable: itm?.strPayrollElementName
                .toLowerCase()
                .split(" ")
                .join(""),
            };
          });
          break;

        default:
          modifyData = res?.data?.map((itm) => {
            return {
              ...itm,
              intDependsOn: itm?.strDependOn === "Gross" ? 1 : 2,
              [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
                itm?.strBasedOn === "Amount"
                  ? itm?.numAmount
                  : itm?.strDependOn === "Basic"
                  ? itm?.numNumberOfPercent
                  : itm?.numNumberOfPercent,
              showPercentage:
                itm?.strDependOn === "Basic"
                  ? itm?.numNumberOfPercent
                  : itm?.numNumberOfPercent,
              levelVariable: itm?.strPayrollElementName
                .toLowerCase()
                .split(" ")
                .join(""),
            };
          });
      }
      setter(modifyData);
    }
  } catch (error) {}
};
