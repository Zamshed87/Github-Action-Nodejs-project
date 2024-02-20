import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Drawer from "@mui/material/Drawer";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IconButton } from "@mui/material";
import {
  createEmployeeSalaryAssign,
  getBreakdownListDDL,
  getEmployeeSalaryInfo,
} from "./helper";
import DrawerBody from "./DrawerBody/index";
import { useFormik } from "formik";
import { DefaultSalaryValidationSchema } from "./DrawerBody/utils";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";

// initial date
let date = new Date();
let initYear = date.getFullYear(); // 2022
let initMonth = date.getMonth() + 1; // 6
let modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

export default function SalaryDrawer(props) {
  const {
    isOpen,
    setIsOpen,
    styles,
    setRowDto,
    setAllData,
    loading,
    setLoading,
    orgId,
    status,
    setBreakDownList,
    defaultPayrollElement,
    salaryInfoId,
    setSingleData,
    singleData,
    employeeId,
    payrollElementDDL,
    finalPayrollElement,
    breakDownList,
    policyData,
    defaultSalaryInitData,
    setOpenIncrement,
    pages,
    setPages,
    setIsBulk,
    isBulk,
    setStep,
    step,
    selectedEmployee,
    setSelectedEmployee,
    cbLanding,
  } = props;
  const { buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);

  // const closeHandler = () => {
  //    let confirmObject = {
  //       closeOnClickOutside: false,
  //       message: `Are you sure?`,
  //       yesAlertFunc: () => {
  //          setIsOpen(false);
  //          if (defaultPayrollElement?.length > 0) {
  //             getBreakdownListDDL(
  //                "BREAKDOWN ELEMENT BY ID",
  //                orgId,
  //                buId,
  //                defaultPayrollElement[0]?.value,
  //                defaultPayrollElement[0]?.isManually,
  //                0,
  //                setBreakDownList
  //             );
  //          } else {
  //             setBreakDownList([]);
  //          }
  //       },
  //       noAlertFunc: () => {

  //       },
  //    };
  //    IConfirmModal(confirmObject);
  // };

  const { handleSubmit, resetForm, values, errors, touched, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        effectiveDate:
          singleData[0]?.Status === "Assigned"
            ? `${singleData[0]?.EffectiveYear}-${
                singleData[0]?.EffectiveMonth <= 9
                  ? `0${singleData[0]?.EffectiveMonth}`
                  : singleData[0]?.EffectiveMonth
              }`
            : `${initYear}-${modifyMonthResult}`,

        effectiveMonth:
          singleData[0]?.Status === "Assigned"
            ? singleData[0]?.EffectiveMonth
            : initMonth,

        effectiveYear:
          singleData[0]?.Status === "Assigned"
            ? singleData[0]?.EffectiveYear
            : initYear,

        employee: "",

        isPerdaySalary: singleData[0]?.isPerdaySalary || false,

        payrollElement: singleData[0]?.intSalaryBreakdownHeaderId
          ? {
              intSalaryBreakdownHeaderId:
                singleData[0]?.intSalaryBreakdownHeaderId,
              isDefault: singleData[0]?.isDefault,
              strDependOn: singleData[0]?.strDependOn,
              strSalaryBreakdownTitle: singleData[0]?.strSalaryBreakdownTitle,
              isPerday: singleData[0]?.isPerdaySalary,
              value: singleData[0]?.intSalaryBreakdownHeaderId,
              label: singleData[0]?.strSalaryBreakdownTitle,
            }
          : defaultPayrollElement?.length > 0
          ? finalPayrollElement[0]
          : "",

        totalGrossSalary: singleData[0]?.numGrossSalary
          ? singleData[0]?.numGrossSalary
          : "",

        perDaySalary: singleData[0]?.numGrossSalary
          ? singleData[0]?.numGrossSalary
          : "",

        finalGrossSalary: singleData[0]?.numGrossSalary
          ? singleData[0]?.numGrossSalary
          : "",
        bankPay:
          singleData[0]?.BankPayInAmount ||
          (singleData[0]?.DigitalPayInAmount + singleData[0]?.CashPayInAmount >
          1
            ? 0
            : singleData[0]?.numGrossSalary),
        digitalPay: singleData[0]?.DigitalPayInAmount || 0,
        netPay: singleData[0]?.CashPayInAmount || 0,
      },
      validationSchema: DefaultSalaryValidationSchema,
      onSubmit: (values) => {
        saveHandler(values, () => {
          // resetForm(defaultSalaryInitData);
        });
      },
    });
  const netGross = () => {
    let amount = 0;
    amount = breakDownList
      .filter((itm) => itm?.strBasedOn === "Percentage")
      .reduce((sum, itm) => sum + +itm?.numAmount, 0);

    // Number.parseFloat(x).toFixed(2)
    return Math.round(Number.parseFloat(amount).toFixed(2));
  };

  useEffect(() => {
    if (breakDownList?.length > 0) {
      let amount = breakDownList
        .filter((itm) => itm?.strBasedOn === "Amount")
        .reduce((sum, itm) => sum + +itm?.numAmount, 0);
      setTotalAmount(amount);

      let total = 0;

      total = breakDownList.reduce((sum, itm) => sum + +itm?.numAmount, 0);

      setTotalAmount(amount);

      setFinalTotalAmount(Math.round(Number.parseFloat(total).toFixed(2)));
    }
  }, [breakDownList, values]);

  const addHandler = (values) => {
    if (!values?.employee) return toast.warn("Please select employee");

    let existEmployee = selectedEmployee.filter(
      (item) => item?.EmployeeCode === values?.employee?.EmployeeCode
    );

    if (existEmployee?.length > 0) return toast.warn("Already employee exists");

    const data = [...selectedEmployee];

    data.push(values?.employee);

    setSelectedEmployee(data);
  };

  const deleteHandler = (index) => {
    const newData = selectedEmployee.filter((item, ind) => ind !== index);
    setSelectedEmployee(newData);
  };

  const rowDtoHandler = (name, index, value, setBreakDownList) => {
    const data = [...breakDownList];
    data[index][name] = value;

    const modifyArr = data?.map((itm) => {
      return {
        ...itm,
        numAmount: itm[`${name}`] >= 0 ? itm[`${name}`] : +itm?.numAmount,
        // numAmount: +itm[name] || +itm?.numAmount
      };
    });

    let filterArray = modifyArr.filter((itm) => itm?.strBasedOn === "Amount");

    let amount = filterArray.reduce((sum, itm) => sum + itm?.numAmount, 0);

    let amountTotal = modifyArr.reduce((sum, itm) => sum + itm?.numAmount, 0);

    setTotalAmount(amount);

    setFinalTotalAmount(Math.round(Number.parseFloat(amountTotal).toFixed(2)));

    setBreakDownList(modifyArr);
  };

  const saveHandler = (values, cb) => {
    if (!values?.payrollElement) {
      return toast.warning("Payroll Element is required!!!");
    }
    let grossCal = +values?.bankPay + +values?.netPay + +values?.digitalPay;

    if (
      !values?.payrollElement?.isPerday &&
      +values?.totalGrossSalary !== grossCal
    ) {
      return toast.warning(
        "Bank Pay, Cash Pay and Digital pay must be equal to Gross Salary!!!"
      );
    }
    if (
      values?.payrollElement?.isPerday &&
      +values?.perDaySalary !== grossCal
    ) {
      return toast.warning(
        "Bank Pay, Cash Pay and Digital pay must be equal to Gross Salary!!!"
      );
    }

    // for perday salary
    if (values?.payrollElement?.isPerday && !values?.perDaySalary) {
      return toast.warning("Perday salary is required!!!");
    }
    if (values?.payrollElement?.isPerday && values?.perDaySalary < 0) {
      return toast.warning("Perday salary must be greater than zero!!!");
    }

    const callback = () => {
      cb();

      if (isBulk) {
        setIsOpen(false);
        setIsBulk(false);
        setStep("");
        setSelectedEmployee([]);

        getEmployeeSalaryInfo(
          setAllData,
          setRowDto,
          {
            partType: "SalaryAssignLanding",
            businessUnitId: buId,
            workplaceGroupId: wgId || 0,
            departmentId: 0,
            workplaceId: wId || 0,
            designationId: 0,
            supervisorId: 0,
            employeeId: 0,
            strStatus: "NotAssigned",
            strSearchTxt: "",
            pageNo: pages?.current,
            pageSize: pages?.pageSize,
            isPaginated: true,
          },
          "NotAssigned",
          setLoading,
          "",
          pages,
          setPages
        );
      } else {
        getEmployeeSalaryInfo(
          setAllData,
          setSingleData,
          {
            partType: "EmployeeSalaryInfoByEmployeeId",
            businessUnitId: buId,
            workplaceGroupId: wgId || 0,
            workplaceId: wId || 0,
            departmentId: 0,
            designationId: 0,
            supervisorId: 0,
            employeeId: singleData[0]?.EmployeeId || 0,
            strStatus: "Assigned",
          },
          "Assigned",
          setLoading
        );
      }
    };

    const modifySelectedEmployee = selectedEmployee.map((itm) => {
      return {
        intEmployeeId: itm?.EmployeeId,
      };
    });

    let payload = {
      intEmployeeIdList: isBulk
        ? modifySelectedEmployee
        : [
            {
              intEmployeeId: singleData[0]?.EmployeeId,
            },
          ],
      effectiveMonth: 0,
      effectiveYear: 0,
      intCreateBy: employeeId,
    };

    if (values?.payrollElement?.isPerday) {
      payload = {
        ...payload,
        intSalaryBreakdownHeaderId: values?.payrollElement?.value,
        strSalaryBreakdownHeaderTitle: values?.payrollElement?.label,
        isPerdaySalary: values?.payrollElement?.isPerday,
        numBasicORGross: 0,
        numNetGrossSalary: 0,
        numGrossAmount: +values?.finalGrossSalary,
        numCashPayInPercent: +(
          (+values?.netPay * 100) /
          +values?.perDaySalary
        ).toFixed(6),
        numBankPayInPercent: +(
          (+values?.bankPay * 100) /
          +values?.perDaySalary
        ).toFixed(6),

        numDigitalPayInPercent: +(
          (+values?.digitalPay * 100) /
          +values?.perDaySalary
        ).toFixed(6),
      };
      createEmployeeSalaryAssign(payload, setLoading, callback);
    } else {
      if (!values?.totalGrossSalary) {
        return toast.warning("Gross salary is required!!!");
      }

      if (values?.totalGrossSalary <= 0) {
        return toast.warning("Gross salary must be greater than zero!!!");
      }

      if (!values?.payrollElement) {
        return toast.warning("Payroll element is required!!!");
      }

      if (+values?.totalGrossSalary !== +finalTotalAmount) {
        return toast.warning("Total gross salary must be equal net salary !!!");
      }

      const modifyBreakdownList = breakDownList?.map((itm) => {
        let name = itm?.levelVariable;
        return {
          intSalaryBreakdownRowId: itm?.intSalaryBreakdownRowId,
          intPayrollElementTypeId: itm?.intPayrollElementTypeId,
          dependOn: itm?.strDependOn,
          numAmount: +itm[name],
          numberOfPercent: itm?.showPercentage || 0,
        };
      });

      const basicSalaryList = breakDownList?.filter(
        (itm) => itm?.isBasicSalary
      );

      if (defaultPayrollElement?.length > 0) {
        payload = {
          ...payload,
          intSalaryBreakdownHeaderId: values?.payrollElement?.value,
          strSalaryBreakdownHeaderTitle: values?.payrollElement?.label,
          isPerdaySalary: values?.payrollElement?.isPerday,
          numNetGrossSalary: +values?.totalGrossSalary,
          numBasicORGross: basicSalaryList[0]?.numAmount,
          numGrossAmount: finalTotalAmount,
          breakdownElements: modifyBreakdownList,
          numCashPayInPercent: +(
            (+values?.netPay * 100) /
            +values?.totalGrossSalary
          ).toFixed(6),
          numBankPayInPercent: +(
            (+values?.bankPay * 100) /
            +values?.totalGrossSalary
          ).toFixed(6),

          numDigitalPayInPercent: +(
            (+values?.digitalPay * 100) /
            +values?.totalGrossSalary
          ).toFixed(6),
        };
        // const roundValue = roundAndAdjustPercentages({
        //   numCashPayInPercent: +(
        //     (+values?.netPay * 100) /
        //     +values?.totalGrossSalary
        //   ).toFixed(6),
        //   numBankPayInPercent: +(
        //     (+values?.bankPay * 100) /
        //     +values?.totalGrossSalary
        //   ).toFixed(6),

        //   numDigitalPayInPercent: +(
        //     (+values?.digitalPay * 100) /
        //     +values?.totalGrossSalary
        //   ).toFixed(6)
        // })
        // console.log({payload, roundValue, text: "defaultPayrollElement?.length > 0"})
        createEmployeeSalaryAssign(payload, setLoading, callback);
      } else {
        payload = {
          ...payload,
          intSalaryBreakdownHeaderId: values?.payrollElement?.value,
          strSalaryBreakdownHeaderTitle: values?.payrollElement?.label,
          isPerdaySalary: values?.payrollElement?.isPerday,
          numNetGrossSalary: +values?.totalGrossSalary,
          numBasicORGross: basicSalaryList[0]?.numAmount,
          numGrossAmount: finalTotalAmount,
          breakdownElements: modifyBreakdownList || [],
          numCashPayInPercent: +(
            (+values?.netPay * 100) /
            +values?.totalGrossSalary
          ).toFixed(6),
          numBankPayInPercent: +(
            (+values?.bankPay * 100) /
            +values?.totalGrossSalary
          ).toFixed(6),

          numDigitalPayInPercent: +(
            (+values?.digitalPay * 100) /
            +values?.totalGrossSalary
          ).toFixed(6),
        };
        // const roundValue = roundAndAdjustPercentages({
        //   numCashPayInPercent: +(
        //     (+values?.netPay * 100) /
        //     +values?.totalGrossSalary
        //   ).toFixed(6),
        //   numBankPayInPercent: +(
        //     (+values?.bankPay * 100) /
        //     +values?.totalGrossSalary
        //   ).toFixed(6),

        //   numDigitalPayInPercent: +(
        //     (+values?.digitalPay * 100) /
        //     +values?.totalGrossSalary
        //   ).toFixed(6)
        // })
        // console.log({payload, roundValue})

        createEmployeeSalaryAssign({...payload}, setLoading, callback);
      }
    }
  };
  function roundAndAdjustPercentages(obj) {
    const roundedBankPercentage = Math.round(obj.numBankPayInPercent * 100) / 100;
  const roundedCashPercentage = Math.round(obj.numCashPayInPercent * 100) / 100;
  const roundedDigitalPercentage = Math.round(obj.numDigitalPayInPercent * 100) / 100;

  // Calculate the sum of the rounded percentages
  const sum = roundedBankPercentage + roundedCashPercentage + roundedDigitalPercentage;

  // Adjust all percentages proportionally to ensure the sum is 100%
  const adjustedBankPercentage = (roundedBankPercentage / sum) * 100;
  const adjustedCashPercentage = (roundedCashPercentage / sum) * 100;
  const adjustedDigitalPercentage = (roundedDigitalPercentage / sum) * 100;

  // Return the updated object
  return {
    numBankPayInPercent: adjustedBankPercentage,
    numCashPayInPercent: adjustedCashPercentage,
    numDigitalPayInPercent: adjustedDigitalPercentage,
  };
  }

  return (
    <>
      {loading && <Loading />}
      <div className="position-relative">
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={() => {
            resetForm(defaultSalaryInitData);

            setBreakDownList([]);
            getEmployeeSalaryInfo(
              setAllData,
              setRowDto,
              {
                partType: "SalaryAssignLanding",
                businessUnitId: buId,
                workplaceGroupId: values?.workplace?.value || wgId || 0,
                departmentId: 0,
                workplaceId: wId || 0,
                designationId: 0,
                supervisorId: 0,
                employeeId: 0,
                strStatus: status || "NotAssigned",
                strSearchTxt: "",
                pageNo: pages?.current,
                pageSize: pages?.pageSize,
                isPaginated: true,
              },
              status || "NotAssigned",
              setLoading,
              "",
              pages,
              setPages
            );
            setIsOpen(false);
            setIsBulk(false);
            setStep("");
            setSingleData("");
            setSelectedEmployee([]);
          }}
          sx={{
            "& .MuiPaper-root": {
              // position: "relative",
              left: "50%",
              width: "50%",
              ...styles,
            },
            "& .MuiDrawer-paperAnchorRight": {
              overflowY: "visible",
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "-35px",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "white",
                transform: "translateY(-50%)",
                display: "flex",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              <IconButton
                onClick={() => {
                  // getEmployeeSalaryInfo(
                  //   setAllData,
                  //   setRowDto,
                  //   {
                  //     partType: "SalaryAssignLanding",
                  //     businessUnitId: buId,
                  //     workplaceGroupId: wgId || 0,
                  //     departmentId: 0,
                  //     workplaceId: wId || 0,
                  //     designationId: 0,
                  //     supervisorId: 0,
                  //     employeeId: 0,
                  //     strStatus: "NotAssigned",
                  //     strSearchTxt: "",
                  //     pageNo: pages?.current,
                  //     pageSize: pages?.pageSize,
                  //     isPaginated: true,
                  //   },
                  //   "NotAssigned",
                  //   setLoading,
                  //   "",
                  //   pages,
                  //   setPages
                  // );
                  cbLanding?.();
                  setIsOpen(false);
                  setIsBulk(false);
                  setStep("");
                  setSelectedEmployee([]);
                  resetForm(defaultSalaryInitData);

                  if (defaultPayrollElement?.length > 0) {
                    getBreakdownListDDL(
                      "BREAKDOWN ELEMENT BY ID",
                      orgId,
                      defaultPayrollElement[0]?.value,
                      0,
                      setBreakDownList,
                      "",
                      wId
                    );
                  } else {
                    setBreakDownList([]);
                  }
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </span>
            <DrawerBody
              salaryInfoId={salaryInfoId}
              setSingleData={setSingleData}
              singleData={singleData}
              buId={buId}
              orgId={orgId}
              employeeId={employeeId}
              payrollElementDDL={payrollElementDDL}
              defaultPayrollElement={defaultPayrollElement}
              finalPayrollElement={finalPayrollElement}
              breakDownList={breakDownList}
              setBreakDownList={setBreakDownList}
              policyData={policyData}
              setAllData={setAllData}
              status={status}
              defaultSalaryInitData={defaultSalaryInitData}
              netGross={netGross}
              totalAmount={totalAmount}
              finalTotalAmount={finalTotalAmount}
              setIsOpen={setIsOpen}
              setOpenIncrement={setOpenIncrement}
              setLoading={setLoading}
              loading={loading}
              wId={wId}
              // formik
              rowDtoHandler={rowDtoHandler}
              resetForm={resetForm}
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
              touched={touched}
              wgId={wgId}
              setIsBulk={setIsBulk}
              isBulk={isBulk}
              setStep={setStep}
              step={step}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              wgId-={wgId}
              addHandler={addHandler}
              deleteHandler={deleteHandler}
            />
          </form>
        </Drawer>
      </div>
    </>
  );
}
