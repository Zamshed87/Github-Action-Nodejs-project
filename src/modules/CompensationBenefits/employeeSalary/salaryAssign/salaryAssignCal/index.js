import { iFarmarAssigneCal, iFarmarNotAssigneCal } from "./iFarmarSalaryApi";

export const getSalaryAssignDDL = (
  accId,
  res,
  grossSalaryAmount,
  setter,
  basicSalaryObj
) => {
  let modifyData = [];
  switch (accId) {
    case 10015:
      modifyData = iFarmarNotAssigneCal(res, grossSalaryAmount);
      setter(modifyData);
      break;

    default:
      let basicElement = res?.data?.filter((itm) => itm?.isBasicSalary);

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
                ((basicElement[0]?.numNumberOfPercent / 100) *
                  grossSalaryAmount) *
                0.01,
              numAmount:
                itm?.numNumberOfPercent *
                ((basicElement[0]?.numNumberOfPercent / 100) *
                  grossSalaryAmount) *
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

      setter(modifyData);
  }
};

export const getByIdSalaryAssignDDL = (
  accId,
  res,
  grossSalaryAmount,
  setter,
  basicSalaryObj
) => {
  let modifyData = [];
  switch (accId) {
    case 10015:
      modifyData = iFarmarAssigneCal(res, grossSalaryAmount);
      setter(modifyData);
      break;

    default:
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
                ((basicElement[0]?.numNumberOfPercent / 100) *
                  grossSalaryAmount) *
                0.01,
              numAmount:
                itm?.numNumberOfPercent *
                ((basicElement[0]?.numNumberOfPercent / 100) *
                  grossSalaryAmount) *
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
          levelVariable: itm?.strSalaryElement
            .toLowerCase()
            .split(" ")
            .join(""),
        };
      });
      setter(modifyData);
  }
};

/*

  [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
            itm?.strBasedOn === "Amount"
              ? itm?.numAmount
              : (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          numAmount:
            itm?.strBasedOn === "Amount"
              ? itm?.numAmount
              : (itm?.numNumberOfPercent * grossSalaryAmount) / 100,
          showPercentage:
            itm?.strDependOn === "Basic"
              ? reverseBasedOnBasicPercentage(
                  basicElement[0]?.numNumberOfPercent,
                  itm?.numNumberOfPercent
                )
              : itm?.numNumberOfPercent,

*/
