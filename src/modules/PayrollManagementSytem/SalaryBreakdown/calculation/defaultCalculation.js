import { toast } from "react-toastify";
import { salaryBreakdownCreateNApply } from "../helper";
import { todayDate } from "./../../../../utility/todayDate";
import { isUniq } from "./../../../../utility/uniqChecker";

export const defaultSetter = (values, dynamicForm, payload, setDynamicForm) => {
  // basic element check
  if (
    values?.dependsOn?.value === 2 &&
    values?.payrollElement?.isBasic === true &&
    values?.basedOn?.value === 1
  ) {
    return toast.warn("Based on always provide amount option!!!");
  }

  if (values?.dependsOn?.value === 2 && values?.basedOn?.value === 1) {
    const withBasicElement = dynamicForm.filter((itm) => itm?.isBasic === true);

    if (withBasicElement?.length <= 0) {
      return toast.warn("Basic Element must be provide!!!");
    }

    const withBasicAmount = dynamicForm.filter(
      (itm) => itm?.isBasic === true && itm?.strBasedOn === "Amount"
    );

    if (withBasicAmount?.length > 0) {
      return toast.warn("Payroll Element must be amount!!!");
    }
  }

  if (isUniq("levelVariable", payload?.levelVariable, dynamicForm)) {
    setDynamicForm([...dynamicForm, payload]);
  }
};

export const defaultCalculation = (
  employeeId,
  payload,
  singleData,
  state,
  dynamicForm,
  values,
  setLoading,
  callback
) => {
  const withBasicElement = dynamicForm.filter((itm) => itm?.isBasic === true);

  if (withBasicElement?.length <= 0 && values?.isFlat === false) {
    return toast.warn("Basic Element must be provide!!!");
  }

  // modifyPayrollElementList
  const modifyPayrollElementList = dynamicForm
    ?.filter((itm) => itm?.strBasedOn === "Percentage")
    ?.map((itm) => {
      let name = itm?.levelVariable;
      return {
        intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId || 0,
        intSalaryBreakdownHeaderId: itm?.intSalaryBreakdownHeaderId || 0,
        intDependsOn: itm?.intDependsOn,
        strDependOn: itm?.strDependOn,
        isBasic: itm?.isBasic,
        strBasedOn: itm?.strBasedOn,
        intPayrollElementTypeId: itm?.intPayrollElementTypeId,
        strPayrollElementName: itm?.strPayrollElementName,
        numNumberOfPercent:
          +itm[name] || +itm[name] === 0
            ? +itm[name]
            : +itm?.numNumberOfPercent,
        numAmount: 0,
        isActive: true,
        dteCreatedAt: todayDate(),
        intCreatedBy: employeeId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
    });

  // modifyAmountPayrollElementList
  const modifyAmountPayrollElementList = dynamicForm
    ?.filter((itm) => itm?.strBasedOn === "Amount")
    ?.map((itm) => {
      let name = itm?.levelVariable;
      return {
        intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId || 0,
        intSalaryBreakdownHeaderId: itm?.intSalaryBreakdownHeaderId || 0,
        strDependOn: itm?.strDependOn,
        strBasedOn: itm?.strBasedOn,
        intPayrollElementTypeId: itm?.intPayrollElementTypeId,
        strPayrollElementName: itm?.strPayrollElementName,
        numNumberOfPercent: 0,
        numAmount:
          +itm[name] || +itm[name] === 0 ? +itm[name] : +itm?.numAmount,
        isActive: true,
        dteCreatedAt: todayDate(),
        intCreatedBy: employeeId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
    });

  // zero value check
  let isZeroCheckLength = modifyPayrollElementList?.filter(
    (itm) => +itm?.numNumberOfPercent < 0 && itm?.strBasedOn === "Percentage"
  );

  if (isZeroCheckLength?.length > 0) {
    return toast.warn("Every form should be given valid value!!!");
  }

  // negative value check
  let isNegativeBasicArr = modifyPayrollElementList?.filter(
    (itm) => +itm?.numNumberOfPercent < 0
  );

  if (isNegativeBasicArr?.length > 0) {
    return toast.warn("Every form should be given Positive value!!!");
  }

  // for amount
  let isNegativeArr = modifyPayrollElementList?.filter(
    (itm) => +itm?.numNumberOfPercent < 0 && itm?.strBasedOn === "Amount"
  );

  if (isNegativeArr?.length > 0) {
    return toast.warn("Every form should be given Positive value!!!");
  }

  // based on basic calculation

  const finalModifyPayrollElement = modifyPayrollElementList.map((itm) => {
    return {
      intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId || 0,
      intSalaryBreakdownHeaderId: itm?.intSalaryBreakdownHeaderId || 0,
      strDependOn: itm?.strDependOn,
      strBasedOn: itm?.strBasedOn,
      intPayrollElementTypeId: itm?.intPayrollElementTypeId,
      strPayrollElementName: itm?.strPayrollElementName,
      numNumberOfPercent: itm?.numNumberOfPercent,
      numAmount: 0,
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };
  });

  // for percentage
  // let isPercentageLength = finalModifyPayrollElement?.filter(
  //   (itm) => itm?.strBasedOn === "Percentage"
  // );
  // let totalPercentage = isPercentageLength.reduce((sum, itm) => {
  //   return sum + +itm?.numNumberOfPercent;
  // }, 0);

  // if (isPercentageLength?.length <= 0) {
  //   return toast.warn(
  //     "Percentage element must be provide for depends on gross!!!"
  //   );
  // }

  // totalPercentage = Math.round(totalPercentage);

  // if (isPercentageLength?.length > 0) {
  //   if (totalPercentage !== 100)
  //     return toast.warn("Percentage must be equal 100!!!");
  // }

  payload = {
    ...payload,
    intSalaryBreakdownHeaderId:
      singleData?.intSalaryBreakdownHeaderId ||
      state?.intSalaryBreakdownHeaderId ||
      dynamicForm[0]?.intSalaryBreakdownHeaderId ||
      0,
    strDependOn: "",
    pyrSalaryBreakdowRowList: [
      ...finalModifyPayrollElement,
      ...modifyAmountPayrollElementList,
    ],
  };

  salaryBreakdownCreateNApply(payload, setLoading, callback);
};
