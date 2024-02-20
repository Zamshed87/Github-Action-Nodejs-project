export const getSalaryAssignDDL = (
  accId,
  res,
  grossSalaryAmount,
  setter,
  basicSalaryObj
) => {
  let modifyData = [];
  const basicElement = res?.data?.filter((itm) => itm?.isBasicSalary);
  modifyData = res?.data?.map((itm) => {
    let modifyObj;

    // for corporate
    if (itm?.strSalaryBreakdownTitle === "Corporate") {
      // basic salary
      if (itm?.isBasicSalary && itm?.strBasedOn === "Percentage") {
        modifyObj = {
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            basicSalaryObj.basicSalary || 0,
          numAmount: basicSalaryObj.basicSalary || 0,
          showPercentage: basicSalaryObj.numPercentageOfGross || 50,
        };
      }

      // basic dependency
      if (
        itm?.strBasedOn === "Percentage" &&
        itm?.strDependOn === "Basic" &&
        !itm?.isBasicSalary
      ) {
        modifyObj = {
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            itm?.numNumberOfPercent * basicSalaryObj.basicSalary * 0.01,
          numAmount:
            itm?.numNumberOfPercent * basicSalaryObj.basicSalary * 0.01,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
    }

    // Flat salary
    if (
      itm?.strPayrollElementName === "Flat Salary" ||
      itm?.strPayrollElementName === "Flat Gross Salary"
    ) {
      // without basic salary
      if (itm?.strBasedOn === "Percentage") {
        modifyObj = {
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
    }

    // others
    if (itm?.strSalaryBreakdownTitle !== "Corporate") {
      // basic salary
      if (itm?.isBasicSalary && itm?.strBasedOn === "Percentage") {
        modifyObj = {
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage: itm?.numNumberOfPercent,
        };
      }

      // basic dependency
      if (
        itm?.strBasedOn === "Percentage" &&
        itm?.strDependOn === "Basic" &&
        !itm?.isBasicSalary
      ) {
        modifyObj = {
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            itm?.numNumberOfPercent *
            ((basicElement[0]?.numNumberOfPercent / 100) * grossSalaryAmount) *
            0.01,
          numAmount:
            itm?.numNumberOfPercent *
            ((basicElement[0]?.numNumberOfPercent / 100) * grossSalaryAmount) *
            0.01,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
      // gross dependency
      if (
        itm?.strBasedOn === "Percentage" &&
        itm?.strDependOn === "Gross" &&
        !itm?.isBasicSalary
      ) {
        modifyObj = {
          // [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: itm?.numNumberOfPercent *((basicElement[0]?.numNumberOfPercent / 100) * grossSalaryAmount) *0.01,
          // numAmount: itm?.numNumberOfPercent * ((basicElement[0]?.numNumberOfPercent / 100) * grossSalaryAmount) * 0.01,
          // showPercentage: itm?.numNumberOfPercent,
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
    }

    // amount
    if (itm?.strBasedOn === "Amount" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName?.toLowerCase()?.split(" ").join("")]:
          itm?.numAmount,
        numAmount: itm?.numAmount,
      };
    }
    const returnObj = {
      ...itm,
      ...modifyObj,
      levelVariable: itm?.strPayrollElementName
        .toLowerCase()
        .split(" ")
        .join(""),
    };
    return returnObj;
  });

  setter(modifyData);
};

export const getByIdSalaryAssignDDL = (
  accId,
  res,
  grossSalaryAmount,
  setter,
  basicSalaryObj
) => {
  let modifyData = [];
  const basicElement = res?.data?.filter((itm) => itm?.isBasicSalary);

  modifyData = res?.data?.map((itm) => {
    let modifyObj;

    // for corporate
    if (itm?.strSalaryBreakdownTitle === "Corporate") {
      // basic salary
      if (itm?.isBasicSalary && itm?.strBasedOn === "Percentage") {
        modifyObj = {
          [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
            basicSalaryObj.basicSalary || 0,
          numAmount: basicSalaryObj.basicSalary || 0,
          showPercentage: basicSalaryObj.numPercentageOfGross || 50,
        };
      }

      // basic dependency
      if (
        itm?.strBasedOn === "Percentage" &&
        itm?.strDependOn === "Basic" &&
        !itm?.isBasicSalary
      ) {
        modifyObj = {
          [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
            itm?.numNumberOfPercent * basicSalaryObj.basicSalary * 0.01,
          numAmount:
            itm?.numNumberOfPercent * basicSalaryObj.basicSalary * 0.01,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
    }

    // Flat salary
    if (
      itm?.strPayrollElementName === "Flat Salary" ||
      itm?.strPayrollElementName === "Flat Gross Salary"
    ) {
      // without basic salary
      if (itm?.strBasedOn === "Percentage") {
        modifyObj = {
          [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
            (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
    }

    // others
    if (itm?.strSalaryBreakdownTitle !== "Corporate") {
      // basic salary
      if (itm?.isBasicSalary && itm?.strBasedOn === "Percentage") {

        modifyObj = {
          [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
            (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage: itm?.numNumberOfPercent,
        };
      }

      // basic dependency
      if (
        itm?.strBasedOn === "Percentage" &&
        itm?.strDependOn === "Basic" &&
        !itm?.isBasicSalary
      ) {
        // console.log("basic dependcy")
        modifyObj = {
          [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
            itm?.numNumberOfPercent *
            ((basicElement[0]?.numNumberOfPercent / 100) * grossSalaryAmount) *
            0.01,
          numAmount:
            itm?.numNumberOfPercent *
            ((basicElement[0]?.numNumberOfPercent / 100) * grossSalaryAmount) *
            0.01,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
      // gross dependency
      if (
        itm?.strBasedOn === "Percentage" &&
        itm?.strDependOn === "Gross" &&
        !itm?.isBasicSalary
      ) {
        modifyObj = {
          [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
            (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage: itm?.numNumberOfPercent,
        };
      }
      // Percentage && Percentage dependency 🔥🔥⚠ what is this ? 17/01/24
      // if (
      //   itm?.strBasedOn === "Percentage" &&  // Percentage && Percentage dependency 🔥🔥⚠ what is this ? 17/01/24
      //   itm?.strDependOn === "Percentage" &&  // Percentage && Percentage dependency 🔥🔥⚠ what is this ? 17/01/24
      //   !itm?.isBasicSalary
      // ) {
      //   modifyObj = {
      //     [itm?.strSalaryElement.toLowerCase().split(" ").join("")]: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      //     numAmount: (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
      //     showPercentage: itm?.numNumberOfPercent,
      //   };
      // }
    }

    // amount
    if (
      (itm?.strBasedOn === "Amount" && !itm?.isBasicSalary) ||
      (itm?.strBasedOn === "Amount" && itm?.isBasicSalary)
    ) {
      modifyObj = {
        [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
          itm?.numAmount,
        numAmount: itm?.numAmount,
      };
    }
    const returnObj = {
      ...itm,
      ...modifyObj,
      strPayrollElementName: itm?.strSalaryElement,
      intPayrollElementTypeId: itm?.intSalaryElementId,
      intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId,
      levelVariable: itm?.strSalaryElement.toLowerCase().split(" ").join(""),
    };
    return returnObj;
  });
  setter(modifyData);
};

export const getSalaryAssignDDLUpdate = ({
  breakDownList = [],
  grossSalaryAmount,
  setBreakDownList,
  salaryDependsOn = "",
}) => {
  const sorting = breakDownList
    ?.slice()
    ?.sort((a, b) => b?.numNumberOfPercent - a?.numNumberOfPercent);
  const modifyData = [];
  // modifyData = breakDownList?.map((itm) => {
  //   return {
  //     ...itm,
  //     [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
  //       itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
  //         ? Math.round(grossSalaryAmount)
  //         : itm?.strBasedOn === "Amount"
  //         ? Math.round(itm?.numAmount)
  //         : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
  //     numAmount:
  //       itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
  //         ? Math.round(grossSalaryAmount)
  //         : itm?.strBasedOn === "Amount"
  //         ? Math.round(itm?.numAmount)
  //         : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
  //     showPercentage: itm?.numNumberOfPercent,
  //     levelVariable: itm?.strPayrollElementName
  //       .toLowerCase()
  //       .split(" ")
  //       .join(""),
  //   };
  // });
  breakDownList?.forEach((itm) => {
    if (
      sorting?.[sorting?.length - 1]?.strPayrollElementName !==
      itm?.strPayrollElementName
    ) {
      const obj = {
        ...itm,
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.round(itm?.numAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        numAmount:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.round(itm?.numAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        levelVariable: itm?.strPayrollElementName
          .toLowerCase()
          .split(" ")
          .join(""),
      };
      modifyData.push(obj);
    } else {
      const totalAmountExcepLowElement = modifyData?.reduce(
        (acc, curr) => acc + +curr?.numAmount,
        0
      );
      const restAmount = grossSalaryAmount - totalAmountExcepLowElement;
      const obj = {
        ...itm,
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? grossSalaryAmount > restAmount
              ? grossSalaryAmount - (grossSalaryAmount - restAmount)
              : Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? itm?.numAmount > restAmount
              ? itm?.numAmount - (itm?.numAmount - restAmount)
              : Math.round(itm?.numAmount)
            : (itm?.numNumberOfPercent * grossSalaryAmount) / 100 > restAmount
            ? (itm?.numNumberOfPercent * grossSalaryAmount) / 100 -
              ((itm?.numNumberOfPercent * grossSalaryAmount) / 100 - restAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        numAmount:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? grossSalaryAmount > restAmount
              ? grossSalaryAmount - (grossSalaryAmount - restAmount)
              : Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? itm?.numAmount > restAmount
              ? itm?.numAmount - (itm?.numAmount - restAmount)
              : Math.round(itm?.numAmount)
            : (itm?.numNumberOfPercent * grossSalaryAmount) / 100 > restAmount
            ? (itm?.numNumberOfPercent * grossSalaryAmount) / 100 -
              ((itm?.numNumberOfPercent * grossSalaryAmount) / 100 - restAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        levelVariable: itm?.strPayrollElementName
          .toLowerCase()
          .split(" ")
          .join(""),
      };
      modifyData.push(obj);
    }
  });
  setBreakDownList(modifyData);
};

export const getByIdSalaryAssignDDLUpdate = (
  res,
  grossSalaryAmount,
  setter
) => {
  const list = [];
  const sorting = res?.data
    ?.slice()
    ?.sort((a, b) => b?.numNumberOfPercent - a?.numNumberOfPercent);
  res?.data?.forEach((itm) => {
    if (
      sorting?.[sorting?.length - 1]?.strPayrollElementName !==
      itm?.strPayrollElementName
    ) {
      // return
      const elemObj = {
        ...itm,
        [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
          itm?.strDependOn === "Basic" && itm?.strSalaryElement === "Basic"
            ? Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.round(itm?.numAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100), // (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
        numAmount:
          itm?.strDependOn === "Basic" && itm?.strSalaryElement === "Basic"
            ? Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.round(itm?.numAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        strPayrollElementName: itm?.strSalaryElement,
        intPayrollElementTypeId: itm?.intSalaryElementId,
        intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId,
        levelVariable: itm?.strSalaryElement.toLowerCase().split(" ").join(""),
      };
      list.push(elemObj);
    } else {
      const totalAmountExcepLowElement = list?.reduce(
        (acc, curr) => acc + +curr?.numAmount,
        0
      );
      const restAmount = grossSalaryAmount - totalAmountExcepLowElement;
      const lowestObj = {
        ...itm,
        [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
          itm?.strDependOn === "Basic" && itm?.strSalaryElement === "Basic"
            ? grossSalaryAmount > restAmount
              ? grossSalaryAmount - (grossSalaryAmount - restAmount)
              : Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? itm?.numAmount > restAmount
              ? itm?.numAmount - (itm?.numAmount - restAmount)
              : Math.round(itm?.numAmount)
            : (itm?.numNumberOfPercent * grossSalaryAmount) / 100 > restAmount
            ? (itm?.numNumberOfPercent * grossSalaryAmount) / 100 -
              ((itm?.numNumberOfPercent * grossSalaryAmount) / 100 - restAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100), // (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
        numAmount:
          itm?.strDependOn === "Basic" && itm?.strSalaryElement === "Basic"
            ? grossSalaryAmount > restAmount
              ? grossSalaryAmount - (grossSalaryAmount - restAmount)
              : Math.round(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? itm?.numAmount > restAmount
              ? itm?.numAmount - (itm?.numAmount - restAmount)
              : Math.round(itm?.numAmount)
            : (itm?.numNumberOfPercent * grossSalaryAmount) / 100 > restAmount
            ? (itm?.numNumberOfPercent * grossSalaryAmount) / 100 -
              ((itm?.numNumberOfPercent * grossSalaryAmount) / 100 - restAmount)
            : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100), // (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
        // itm?.strDependOn === "Basic" && itm?.strSalaryElement === "Basic"
        //   ? Math.round(grossSalaryAmount)
        //   : itm?.strBasedOn === "Amount"
        //   ? Math.round(itm?.numAmount)
        //   : Math.round((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        strPayrollElementName: itm?.strSalaryElement,
        intPayrollElementTypeId: itm?.intSalaryElementId,
        intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId,
        levelVariable: itm?.strSalaryElement.toLowerCase().split(" ").join(""),
      };
      list.push(lowestObj);
    }
  });
  setter(list);
};
