export const iFarmarNotAssigneCal = (res, grossSalaryAmount) => {
  let conveyanceAmount = res?.data?.filter(
    (itm) => itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
  );

  let modifyData = [];
  modifyData = res?.data?.map((itm) => {
    let modifyObj;

    if (itm?.strBasedOn === "Amount" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.numAmount,
        numAmount: itm?.numAmount,
      };
    }

    if (itm?.strBasedOn === "Amount" && itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6,
        numAmount: (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6,
      };
    }

    if (itm?.strBasedOn === "Percentage" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
        numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      };
    }

    return {
      ...itm,
      ...modifyObj,
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

  let basicAmount = modifyData?.filter(
    (itm) => itm?.strBasedOn === "Amount" && itm?.isBasicSalary
  );

  let finalModify = modifyData?.map((itm) => {
    let modifyObj;

    if (itm?.strBasedOn === "Amount" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.numAmount,
        numAmount: itm?.numAmount,
      };
    }

    if (
      itm?.strBasedOn === "Amount" &&
      itm?.isBasicSalary &&
      itm?.numAmount > 0
    ) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6,
        numAmount: (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6,
      };
    }

    if (
      itm?.strBasedOn === "Amount" &&
      itm?.isBasicSalary &&
      itm?.numAmount <= 0
    ) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: 0,
        numAmount: 0,
      };
    }

    if (
      itm?.strBasedOn === "Percentage" &&
      !itm?.isBasicSalary &&
      basicAmount[0]?.numAmount > 0
    ) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) / 100,
        numAmount: (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) / 100,
      };
    }

    if (
      itm?.strBasedOn === "Percentage" &&
      !itm?.isBasicSalary &&
      basicAmount[0]?.numAmount <= 0
    ) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: 0,
        numAmount: 0,
      };
    }

    return {
      ...itm,
      ...modifyObj,
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

  return finalModify;
};

export const iFarmarAssigneCal = (res, grossSalaryAmount) => {
  let conveyanceAmount = res?.data?.filter(
    (itm) => itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
  );

  let modifyData = [];
  modifyData = res?.data?.map((itm) => {
    return {
      ...itm,
      [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6
          : (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6
          : (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      showPercentage:
        itm?.strDependOn === "Basic"
          ? itm?.numNumberOfPercent
          : itm?.numNumberOfPercent,
      levelVariable: itm?.strSalaryElement.toLowerCase().split(" ").join(""),
      strPayrollElementName: itm?.strSalaryElement,
      intPayrollElementTypeId: itm?.intSalaryElementId,
      intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId,
    };
  });

  let basicAmount = modifyData?.filter(
    (itm) => itm?.strBasedOn === "Amount" && itm?.isBasicSalary
  );

  let finalModify = modifyData?.map((itm) => {
    return {
      ...itm,
      [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6
          : (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) / 100,
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6
          : (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) / 100,
    };
  });

  return finalModify;
};

/*
[itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6
          : (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (grossSalaryAmount - conveyanceAmount[0]?.numAmount) / 1.6
          : (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      showPercentage:
        itm?.strDependOn === "Basic"
          ? itm?.numNumberOfPercent
          : itm?.numNumberOfPercent,
      levelVariable: itm?.strPayrollElementName
        .toLowerCase()
        .split(" ")
        .join(""),

*/
