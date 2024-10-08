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

export const getSalaryAssignDDLUpdate2 = ({
  breakDownList = [],
  grossSalaryAmount,
  setBreakDownList,
  salaryDependsOn = "",
  accId,
  basicSalaryObj,
}) => {
  if (breakDownList?.[0]?.isCustomPayrollFor10ms) {
    const res = tenMsNotAssignCal({ data: breakDownList }, grossSalaryAmount);
    setBreakDownList(res || []);
  } else if (accId === 9) {
    const res = addinNotAssignCal(
      { data: breakDownList },
      basicSalaryObj,
      grossSalaryAmount
    );
    setBreakDownList(res || []);
  } else if (accId === 7) {
    const res = bangJinNotAssignCal({ data: breakDownList }, grossSalaryAmount);
    setBreakDownList(res || []);
  } else {
    const modifyData = [];
    breakDownList?.forEach((itm) => {
      const obj = {
        ...itm,
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.ceil(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.ceil(itm?.numAmount)
            : Math.ceil((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        numAmount:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.ceil(grossSalaryAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.ceil(itm?.numAmount)
            : Math.ceil((itm?.numNumberOfPercent * grossSalaryAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        levelVariable: itm?.strPayrollElementName
          .toLowerCase()
          .split(" ")
          .join(""),
      };
      modifyData.push(obj);
    });
    const indexOfLowestAmount = modifyData.reduce(
      (minIndex, currentObject, currentIndex, array) => {
        return currentObject.numNumberOfPercent <
          array[minIndex].numNumberOfPercent
          ? currentIndex
          : minIndex;
      },
      0
    );
    adjustOverFollowAmount(
      modifyData,
      grossSalaryAmount,
      indexOfLowestAmount,
      setBreakDownList,
      `${modifyData[indexOfLowestAmount]?.strPayrollElementName
        .toLowerCase()
        .split(" ")
        .join("")}`
    );
  }
};

export const getByIdSalaryAssignDDLUpdate2 = (
  res,
  grossSalaryAmount,
  setter,
  accId,
  basicSalaryObj
) => {
  // console.log(res?.data)
  if (res?.data?.[0]?.isCustomPayrollFor10ms) {
    const update = tenMsAssignedCal(res, grossSalaryAmount);
    setter(update || []);
  } else if (accId === 9) {
    const update = addinAssignCal(
      { data: res?.data },
      basicSalaryObj,
      grossSalaryAmount
    );
    setter(update || []);
  } else if (accId === 7) {
    const update = bangJinAssignedCal(res, grossSalaryAmount);
    setter(update || []);
  } else {
    const breakdownList = res?.data || [];
    const demoList = [];
    breakdownList.forEach((element) => {
      const elemObj = {
        ...element,
        [element?.strSalaryElement.toLowerCase().split(" ").join("")]:
          element?.strDependOn === "Basic" &&
          element?.strSalaryElement === "Basic"
            ? Math.ceil(grossSalaryAmount)
            : element?.strBasedOn === "Amount"
            ? Math.ceil(element?.numAmount)
            : Math.ceil(
                (element?.numNumberOfPercent * grossSalaryAmount) / 100
              ), // (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
        numAmount:
          element?.strDependOn === "Basic" &&
          element?.strSalaryElement === "Basic"
            ? Math.ceil(grossSalaryAmount)
            : element?.strBasedOn === "Amount"
            ? Math.ceil(element?.numAmount)
            : Math.ceil(
                (element?.numNumberOfPercent * grossSalaryAmount) / 100
              ),
        showPercentage: element?.numNumberOfPercent,
        strPayrollElementName: element?.strSalaryElement,
        intPayrollElementTypeId: element?.intSalaryElementId,
        intSalaryBreakdownRowId: element?.intSalaryBreakdownRowId,
        levelVariable: element?.strSalaryElement
          .toLowerCase()
          .split(" ")
          .join(""),
      };
      demoList.push(elemObj);
    });
    const indexOfLowestAmount = demoList.reduce(
      (minIndex, currentObject, currentIndex, array) => {
        return currentObject.numNumberOfPercent <
          array[minIndex].numNumberOfPercent
          ? currentIndex
          : minIndex;
      },
      0
    );
    adjustOverFollowAmount(
      demoList,
      grossSalaryAmount,
      indexOfLowestAmount,
      setter,
      `${demoList[indexOfLowestAmount]?.strSalaryElement
        .toLowerCase()
        .split(" ")
        .join("")}`
    );
  }
};

const adjustOverFollowAmount = (
  array = [],
  grossSalaryAmount,
  indexOfLowestAmount,
  setterFunc,
  payrollElementName
) => {
  // console.log({ payrollElementName });
  const totalAmount = array.reduce((acc, obj) => acc + obj.numAmount, 0);
  const overFollowAmount = totalAmount - grossSalaryAmount;
  // console.log({
  //   totalAmount,
  //   elementList: array,
  //   grossSalaryAmount,
  //   overFollowAmount,
  // });
  if (overFollowAmount > 0) {
    // console.log({ isOverFollow: overFollowAmount });
    array[indexOfLowestAmount].numAmount =
      array[indexOfLowestAmount]?.numAmount - overFollowAmount;
    array[indexOfLowestAmount][payrollElementName] -= overFollowAmount;
  } else {
    // console.log({ isNotOverFollow: overFollowAmount });

    array[indexOfLowestAmount].numAmount =
      array[indexOfLowestAmount]?.numAmount + overFollowAmount * -1;
    array[indexOfLowestAmount][payrollElementName] += overFollowAmount * -1;
  }
  setterFunc(array);
};

export const tenMsNotAssignCal = (res, grossSalaryAmount) => {
  const conveyanceAmount = res?.data?.filter(
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
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.6
        ).toFixed(2),
        numAmount: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.6
        ).toFixed(2),
      };
    }

    if (itm?.strBasedOn === "Percentage" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (itm?.numNumberOfPercent * grossSalaryAmount) /
          100
        ).toFixed(2),
        numAmount: (
          (itm?.numNumberOfPercent * grossSalaryAmount) /
          100
        ).toFixed(2),
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

  const basicAmount = modifyData?.filter(
    (itm) => itm?.strBasedOn === "Amount" && itm?.isBasicSalary
  );

  const finalModify = modifyData?.map((itm) => {
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
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.6
        ).toFixed(2),
        numAmount: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.6
        ).toFixed(2),
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
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
          100
        ).toFixed(2),
        numAmount: (
          (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
          100
        ).toFixed(2),
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
export const addinNotAssignCal = (res, basicSalaryObj, grossSalaryAmount) => {
  let modifyData = [];
  const basicElement = res?.data?.filter((itm) => itm?.isBasicSalary);

  modifyData = res?.data?.map((itm) => {
    let modifyObj;

    // for corporate
    if (itm?.strSalaryBreakdownTitle === "Corporate") {
      console.log("t");
      console.log({ itm });
      // basic salary
      if (itm?.isBasicSalary && itm?.strBasedOn === "Percentage") {
        modifyObj = {
          [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            basicSalaryObj.basicSalary || 11,
          numAmount: basicSalaryObj.basicSalary || 11,
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
    // ------------
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
    }

    // amount
    if (itm?.strBasedOn === "Amount" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.numAmount,
        numAmount: itm?.numAmount,
      };
    }

    return {
      ...itm,
      ...modifyObj,
      levelVariable: itm?.strPayrollElementName
        .toLowerCase()
        .split(" ")
        .join(""),
    };
  });

  return modifyData;
};
export const addinAssignCal = (res, basicSalaryObj, grossSalaryAmount) => {
  console.log({ res });
  console.log({ basicSalaryObj });
  console.log({ grossSalaryAmount });
  let modifyData = [];
  let basicElement = res?.data?.filter((itm) => itm?.isBasicSalary);

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

    return {
      ...itm,
      ...modifyObj,
      strPayrollElementName: itm?.strSalaryElement,
      intPayrollElementTypeId: itm?.intSalaryElementId,
      intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId,
      levelVariable: itm?.strSalaryElement.toLowerCase().split(" ").join(""),
    };
  });
  return modifyData;
};
export const tenMsAssignedCal = (res, grossSalaryAmount) => {
  const conveyanceAmount = res?.data?.filter(
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
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.6
            ).toFixed(2)
          : ((itm?.numNumberOfPercent * grossSalaryAmount) / 100).toFixed(2),
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.6
            ).toFixed(2)
          : ((itm?.numNumberOfPercent * grossSalaryAmount) / 100).toFixed(2),
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

  const basicAmount = modifyData?.filter(
    (itm) => itm?.strBasedOn === "Amount" && itm?.isBasicSalary
  );

  const finalModify = modifyData?.map((itm) => {
    return {
      ...itm,
      [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.6
            ).toFixed(2)
          : (
              (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
              100
            ).toFixed(2),
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.6
            ).toFixed(2)
          : (
              (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
              100
            ).toFixed(2),
    };
  });

  return finalModify;
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

// ------------7
export const bangJinNotAssignCal = (res, grossSalaryAmount) => {
  const conveyanceAmount = res?.data?.filter(
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
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.5
        ).toFixed(2),
        numAmount: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.5
        ).toFixed(2),
      };
    }

    if (itm?.strBasedOn === "Percentage" && !itm?.isBasicSalary) {
      modifyObj = {
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (itm?.numNumberOfPercent * grossSalaryAmount) /
          100
        ).toFixed(2),
        numAmount: (
          (itm?.numNumberOfPercent * grossSalaryAmount) /
          100
        ).toFixed(2),
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

  const basicAmount = modifyData?.filter(
    (itm) => itm?.strBasedOn === "Amount" && itm?.isBasicSalary
  );

  const finalModify = modifyData?.map((itm) => {
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
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.6
        ).toFixed(2),
        numAmount: (
          (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
          1.6
        ).toFixed(2),
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
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]: (
          (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
          100
        ).toFixed(2),
        numAmount: (
          (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
          100
        ).toFixed(2),
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
export const bangJinAssignedCal = (res, grossSalaryAmount) => {
  const conveyanceAmount = res?.data?.filter(
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
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.5
            ).toFixed(2)
          : ((itm?.numNumberOfPercent * grossSalaryAmount) / 100).toFixed(2),
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.5
            ).toFixed(2)
          : ((itm?.numNumberOfPercent * grossSalaryAmount) / 100).toFixed(2),
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

  const basicAmount = modifyData?.filter(
    (itm) => itm?.strBasedOn === "Amount" && itm?.isBasicSalary
  );

  const finalModify = modifyData?.map((itm) => {
    return {
      ...itm,
      [itm?.strSalaryElement.toLowerCase().split(" ").join("")]:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.5
            ).toFixed(2)
          : (
              (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
              100
            ).toFixed(2),
      numAmount:
        itm?.strBasedOn === "Amount" && !itm?.isBasicSalary
          ? itm?.numAmount
          : itm?.strBasedOn === "Amount" && itm?.isBasicSalary
          ? (
              (grossSalaryAmount - conveyanceAmount[0]?.numAmount) /
              1.5
            ).toFixed(2)
          : (
              (itm?.numNumberOfPercent * basicAmount[0]?.numAmount) /
              100
            ).toFixed(2),
    };
  });

  return finalModify;
};
