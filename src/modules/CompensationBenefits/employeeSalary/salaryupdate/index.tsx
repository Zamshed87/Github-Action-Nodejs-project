import {
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PRadio,
  PSelect,
} from "Components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import { todayDate } from "utility/todayDate";
import { bankDetailsAction } from "modules/employeeProfile/aboutMe/helper";
import { Alert } from "@mui/material";
import { EmployeeInfo } from "./EmployeeInfo";
import { BankInfo } from "./BankInfo";
import { DigitalMFS } from "./DigitalMFS";

type TAttendenceAdjust = unknown;
const SalaryV2: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  function roundToDecimals(number = 0, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(number * multiplier) / multiplier;
  }
  const location = useLocation();
  const history = useHistory();
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // States
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState<any[]>([]);
  const [slabDDL, setSlabDDL] = useState<any[]>([]);
  const [accountsDto, setAccountsDto] = useState<any[]>([
    {
      accounts: "Bank Pay (0%)",
      key: "Bank Pay",
      numAmount: 0,
      percentage: 0,
    },
    {
      accounts: "Digital/MFS Pay (0%)",
      key: "Digital/MFS Pay",
      numAmount: 0,
      percentage: 0,
    },
    {
      accounts: "Cash Pay (0%)",
      key: "Cash Pay",

      percentage: 0,
      numAmount: 0,
    },
    {
      accounts: "Others/Additional Amount Transfer Into",
      numAmount: 0,
      isDDl: true,
      key: "Others/Additional Amount Transfer Into",
    },
  ]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const salaryAssign = useApiRequest([]);
  const bankDDL = useApiRequest([]);
  const payscaleApi = useApiRequest([]);
  const breakDownPolicyApi = useApiRequest([]);
  const employeeInfo = useApiRequest([]);
  const empBankInfo = useApiRequest([]);
  const getById = useApiRequest({});
  const assignBreakdownApi = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Salary Assign";
  }, []);

  const getPayscale = () => {
    payscaleApi?.action({
      urlKey: "GetPayScaleSetupDDLbyEmployee",
      method: "GET",
      params: {
        employeeId: (location?.state as any)?.EmployeeId,
      },
    });
  };
  const getAssignedBreakdown = () => {
    assignBreakdownApi?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId:
          (location?.state as any)?.intSalaryBreakdownHeaderId || 0,
        IntEmployeeId: (location?.state as any)?.EmployeeId,
        IntWorkplaceId: wId || 0,
      },
      onSuccess: (res) => {
        const modify = res?.map((i: any) => {
          return {
            ...i,
            // strBasedOn: i?.isBasicSalary ? "Amount" : "Percentage",
            strPayrollElementName: i?.strSalaryElement,
            strSalaryBreakdownTitle: i?.strSalaryBreakdownHeaderTitle,
            intSalaryBreakdownHeaderId: i?.intSalaryBreakdownHeaderId,
            intSalaryBreakdownRowId: i?.intSalaryBreakdownRowId,
            intPayrollElementTypeId: i?.intSalaryElementId,
            basedOn: i?.strBasedOn,
          };
        });
        if (employeeInfo?.data[0]?.isGradeBasedSalary) {
          const modifyforGrade = [...modify];
          // modifyforGrade[0].strBasedOn = "Amount";
          setRowDto(modifyforGrade);
        } else {
          setRowDto(modify);
          // new_gross_calculation();
        }
      },
    });
  };
  const getEmployeeInfo = () => {
    employeeInfo?.action({
      urlKey: "EmployeeSalaryManagement",
      method: "post",
      payload: {
        partType: "EmployeeSalaryInfoByEmployeeId",
        departmentId: 0,
        designationId: 0,
        supervisorId: 0,
        strStatus:
          (location?.state as any)?.Status === "Assigned"
            ? "Assigned"
            : "NotAssigned",
        employeeId: (location?.state as any)?.EmployeeId,

        accountId: orgId,
        businessUnitId: buId,
        WorkplaceGroupId: wgId,
        workplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        form.setFieldsValue({
          isHoldSalary: res[0]?.IsHold ? true : false,
          transferType:
            res[0]?.intOthersAdditionalAmountTransferInto || orgId === 12
              ? 1
              : 3,
        });
        const temp = [...accountsDto];
        temp[0].numAmount = res[0]?.BankPayInAmount || 0;
        temp[0].accounts = res[0]?.BankPayInPercent
          ? temp[0].key + " (" + res[0]?.BankPayInPercent + "%)"
          : temp[0].accounts;
        temp[1].numAmount = res[0]?.DigitalPayInAmount || 0;
        temp[1].accounts = res[0]?.DigitalPayInPercent
          ? temp[1].key + " (" + res[0]?.DigitalPayInPercent + "%)"
          : temp[1].accounts;

        temp[2].numAmount = res[0]?.CashPayInAmount || 0;
        temp[2].accounts = res[0]?.CashPayInPercent
          ? temp[2].key + "(" + res[0]?.CashPayInPercent + "%)"
          : temp[2].accounts;
      },
    });
  };

  const getPayrollGroupDDL = () => {
    payrollGroupDDL?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN DDL",
        IntEmployeeId: employeeId,
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: 0,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strSalaryBreakdownTitle;
          res[i].value = item?.intSalaryBreakdownHeaderId;
        });
      },
    });
  };
  const getBreakDownPolicyElements = () => {
    const { payrollGroup } = form.getFieldsValue(true);
    breakDownPolicyApi?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN ELEMENT BY ID",

        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: payrollGroup?.value || 0,
        IntWorkplaceId: 0,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].numAmount = roundToDecimals(item?.numAmount);
        });
        setRowDto(res);
      },
    });
  };

  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  const submitHandler = async () => {
    const values = form.getFieldsValue(true);
    if (!values?.grossAmount) {
      return toast.warn("Gross Amount is required ");
    }
    if (
      values?.salaryType?.value !== "Grade" &&
      !values?.basicAmount &&
      (values?.basedOn?.value === 2 || values?.basedOn === 2)
    ) {
      return toast.warn("Basic Amount is required ");
    }

    const accountSum =
      accountsDto[1].numAmount +
      accountsDto[2].numAmount +
      accountsDto[0].numAmount;
    if (Math.round(accountSum) !== Math.round(values?.grossAmount)) {
      return toast.warn(
        "Bank Pay, Cash Pay and Digital pay must be equal to Gross Salary!!!"
      );
    }
    if (
      (values?.transferType?.value == 1 || values?.transferType == 1) &&
      accountsDto[0].numAmount == 0
    ) {
      return toast.warn("Bank Pay is selected but no amount provided ");
    }
    if (
      (values?.transferType?.value == 2 || values?.transferType == 2) &&
      accountsDto[1].numAmount == 0
    ) {
      return toast.warn("Digital/MFS Pay is selected but no amount provided ");
    }
    if (
      (values?.transferType?.value == 3 || values?.transferType == 3) &&
      accountsDto[2].numAmount == 0
    ) {
      return toast.warn("Cash Pay is selected but no amount provided ");
    }
    const elementSum = rowDto?.reduce((acc, i) => acc + i?.numAmount, 0);

    if (Math.round(elementSum) !== Math.round(values?.grossAmount)) {
      return toast.warn(
        "Breakdonwn Elements Net Amount Must Be Equal To Gross Amount!!!"
      );
    }
    const payload = {
      partId: employeeInfo?.data[0]?.EmployeeId ? 2 : 1,
      intEmployeeBankDetailsId:
        +empBankInfo?.data?.empEmployeeBankDetail?.intEmployeeBankDetailsId ||
        0,
      intEmployeeBasicInfoId: +employeeInfo?.data[0]?.EmployeeId || 0,
      isPrimarySalaryAccount: true,
      isActive: true,
      intWorkplaceId: wId || 0,
      intBusinessUnitId: buId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intBankOrWalletType: 1,
      intBankWalletId: values?.bank?.value || 0,
      strBankWalletName: values?.bank?.label || "",
      strDistrict: "",
      intBankBranchId: values?.branch?.value || 0,
      strBranchName: values?.branch?.label || "",
      strRoutingNo: values?.routing || "",
      strAccountName: values?.account || "",
      strAccountNo: `${values?.accountNo}` || "",
      strSwiftCode: values?.swift || "",
    };
    const payloadMFS = {
      partId: employeeInfo?.data[0]?.EmployeeId ? 2 : 1,
      intEmployeeBankDetailsId:
        +empBankInfo?.data?.empEmployeeBankDetail?.intEmployeeBankDetailsId ||
        0,
      intEmployeeBasicInfoId: +employeeInfo?.data[0]?.EmployeeId || 0,
      isPrimarySalaryAccount: true,
      isActive: true,
      intWorkplaceId: wId || 0,
      intBusinessUnitId: buId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intBankOrWalletType: 2,
      intBankWalletId: values?.gateway?.value || 0,
      strBankWalletName: values?.gateway?.label || "",
      strDistrict: "",
      intBankBranchId: 0,
      strBranchName: "",
      strRoutingNo: "",
      strAccountName: "",
      strAccountNo: `${values?.mobile}` || "",
      strSwiftCode: "",
    };
    values?.gateway?.value &&
      bankDetailsAction(payloadMFS, setLoading, () => {});
    if (
      values?.transferType?.value === 1 ||
      values?.transferType === 1 ||
      accountsDto[0].numAmount > 0
    ) {
      bankDetailsAction(payload, setLoading, () => {});
    }

    const modifiedBreakDown = rowDto?.map((i) => {
      return {
        dependOn: i?.strDependOn,
        intPayrollElementTypeId: i?.intPayrollElementTypeId,
        intSalaryBreakdownRowId: i?.intSalaryBreakdownRowId,
        numAmount: i?.numAmount,
        numberOfPercent: i?.strBasedOn === "Amount" ? 0 : i?.numNumberOfPercent,
      };
    });
    const salaryAssignPayload = {
      intEmployeeIdList: [
        {
          intEmployeeId: (location?.state as any)?.EmployeeId,
        },
      ],
      effectiveMonth: 0,
      effectiveYear: 0,
      intCreateBy: 1,
      intSalaryBreakdownHeaderId: rowDto[0].intSalaryBreakdownHeaderId,
      strSalaryBreakdownHeaderTitle: rowDto[0].strSalaryBreakdownTitle,
      isPerdaySalary: false,
      numNetGrossSalary: values?.grossAmount,
      numBasicORGross: rowDto[0]?.numAmount,
      numGrossAmount: values?.grossAmount,
      breakdownElements: modifiedBreakDown,
      numCashPayInPercent: +accountsDto[2].percentage,
      numBankPayInPercent: +accountsDto[0].percentage,
      numDigitalPayInPercent: +accountsDto[1].percentage,
      numCashPayInAmount: accountsDto[2].numAmount || 0,
      numBankPayInAmount: accountsDto[0].numAmount || 0,
      numDigitalPayInAmount: accountsDto[1].numAmount || 0,
      IntOthersAdditionalAmountTransferInto:
        values?.transferType?.value || values?.transferType,
      isGradeBasedSalary: values?.salaryType?.value === "Grade" ? true : false,
      intSlabCount:
        values?.salaryType?.value === "Grade"
          ? values?.slabCount?.value || values?.slabCount?.value === 0
            ? values?.slabCount?.value
            : values?.slabCount
          : 0,
    };
    salaryAssign.action({
      urlKey: "EmployeeSalaryAssign",
      method: "post",
      payload: salaryAssignPayload,
      toast: true,
      onSuccess: () => {
        history.push(`/compensationAndBenefits/employeeSalary/salaryAssign`);
      },
    });
  };

  // accounts calculations
  const updateDtoHandler = (e: number, row: any, index: number): any => {
    const { grossAmount } = form.getFieldsValue(true);
    const originalIndex =
      row?.key === "Bank Pay" ? 0 : row?.key === "Digital/MFS Pay" ? 1 : 2;
    const temp = [...accountsDto];
    // Check for invalid input values
    if (e < 0) {
      return toast.warn(`${row?.key} can't be negative`);
    }
    if (e > grossAmount) {
      return toast.warn(`${row?.key} can't be greater than gross`);
    }

    // Update the selected index with the new amount
    temp[originalIndex].numAmount = e;
    temp[originalIndex].accounts = `${temp[originalIndex].key} (${(
      (e * 100) /
      grossAmount
    ).toFixed(6)}%)`;

    // Calculate the remaining amount to be distributed between the other two indexes
    const remainingAmount = grossAmount - e;
    const [index1, index2] = [0, 1, 2].filter((i) => i !== originalIndex); // get the other two indexes
    // console.log({ index });
    // Distribute remaining amount between the other two indexes
    // console.log({ temp }, { index }, temp[index].numAmount, remainingAmount);
    // console.log({ temp }, { index1 }, temp[index1].numAmount, remainingAmount);
    // console.log({ index2 }, temp[index2].numAmount, remainingAmount);
    if (temp[index1].numAmount > remainingAmount) {
      temp[index1].numAmount = remainingAmount;
      temp[index2].numAmount = 0;
    } else if (temp[index2].numAmount > remainingAmount) {
      temp[index2].numAmount = remainingAmount;
      temp[index1].numAmount = 0;
    } else {
      orgId === 12
        ? (temp[index1].numAmount = remainingAmount - temp[index2].numAmount)
        : (temp[index2].numAmount = remainingAmount - temp[index1].numAmount);
    }

    // Update accounts percentage for all indexes
    temp[index1].accounts = `${temp[index1].key} (${(
      (temp[index1].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;
    temp[index1].percentage = (
      (temp[index1].numAmount * 100) /
      grossAmount
    ).toFixed(6);
    temp[index2].accounts = `${temp[index2].key} (${(
      (temp[index2].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;
    temp[index2].percentage = (
      (temp[index2].numAmount * 100) /
      grossAmount
    ).toFixed(6);
    temp[originalIndex].accounts = `${temp[originalIndex].key} (${(
      (temp[originalIndex].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;
    temp[originalIndex].percentage = (
      (temp[originalIndex].numAmount * 100) /
      grossAmount
    ).toFixed(6);

    // Check for any negative values after adjustments
    if (temp[index1].numAmount < 0 || temp[index2].numAmount < 0) {
      return toast.warn(`Amounts can't be negative`);
    }

    setAccountsDto(temp);
  };
  // elements calculations
  const updateRowDtoHandler = (e: number, row: any, index: number): any => {
    const { grossAmount, salaryType, basedOn, slabCount } =
      form.getFieldsValue(true);
    const temp = [...rowDto];

    // Check for invalid input values
    if (e < 0) {
      return toast.warn(`${row?.strPayrollElementName} can't be negative`);
    }
    if (
      salaryType?.value !== "Grade" &&
      basedOn?.value === 1 &&
      e > grossAmount
    ) {
      return toast.warn(
        `${row?.strPayrollElementName} can't be greater than gross`
      );
    }

    // Update the selected index with the new amount
    // console.log({ temp }, { basedOn }, temp[index], temp[index].isBasicSalary);
    if (temp[index]?.basedOn === "Amount") {
      temp[index].numAmount = roundToDecimals(e) || 0;
    } else {
      temp[index].numAmount = e + e * (slabCount || 0);
    }
    if (temp[index].isBasicSalary) {
      temp[index].baseAmount = e;
    }
    setRowDto((prev) => {
      prev = temp;
      return prev;
    });

    if (basedOn?.value === 2 || salaryType?.value === "Grade") {
      basic_or_grade_calculation();
    }
    if (basedOn?.value === 1 && salaryType?.value !== "Grade") {
      new_gross_calculation();
    }
  };

  // const default_gross_calculation = (salaryDependsOn = "") => {
  //   const modifyData: any = [];
  //   const { grossAmount } = form.getFieldsValue(true);

  //   rowDto?.forEach((itm: any) => {
  //     const obj = {
  //       ...itm,
  //       [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
  //         itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
  //           ? Math.ceil(grossAmount)
  //           : itm?.strBasedOn === "Amount"
  //           ? Math.ceil(itm?.numAmount)
  //           : Math.ceil((itm?.numNumberOfPercent * grossAmount) / 100),
  //       numAmount:
  //         itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
  //           ? Math.ceil(grossAmount)
  //           : itm?.strBasedOn === "Amount"
  //           ? Math.ceil(itm?.numAmount)
  //           : Math.ceil((itm?.numNumberOfPercent * grossAmount) / 100),
  //       showPercentage: itm?.numNumberOfPercent,
  //       levelVariable: itm?.strPayrollElementName
  //         .toLowerCase()
  //         .split(" ")
  //         .join(""),
  //     };

  //     modifyData.push(obj);
  //   });
  //   const indexOfLowestAmount = modifyData.reduce(
  //     (minIndex: any, currentObject: any, currentIndex: any, array: any) => {
  //       return currentObject.numNumberOfPercent <
  //         array[minIndex].numNumberOfPercent
  //         ? currentIndex
  //         : minIndex;
  //     },
  //     0
  //   );
  //   adjustOverFollowAmount(
  //     modifyData,
  //     grossAmount,
  //     indexOfLowestAmount,
  //     setRowDto,
  //     `${modifyData[indexOfLowestAmount]?.strPayrollElementName
  //       .toLowerCase()
  //       .split(" ")
  //       .join("")}`
  //   );
  // };
  const new_gross_calculation = () => {
    const { grossAmount } = form.getFieldsValue(true);

    const modify = rowDto.map((item) => {
      if (item.strBasedOn === "Percentage") {
        return {
          ...item,
          numAmount: roundToDecimals(
            (grossAmount * item.numNumberOfPercent) / 100
          ),
        };
      }
      return item; // Leave as-is if based on "Amount"
    });
    setRowDto(modify);
  };
  const basic_or_grade_calculation = () => {
    let basicAmount = 0;
    const modified_data = [];
    const values = form.getFieldsValue(true);
    // const { basicAmount } = form.getFieldsValue(true);
    if (values?.salaryType?.value === "Grade") {
      basicAmount = rowDto[0]?.numAmount || 0;
      // basicAmount = rowDto[0]?.numAmount;
    } else {
      basicAmount = values?.basicAmount || 0;
    }
    for (const item of rowDto) {
      let amount;

      if (item?.isBasicSalary) {
        amount = basicAmount; // Use the basic salary directly
        item.numAmount = basicAmount;
        item.baseAmount =
          // item?.baseAmount ||
          values?.basedOn?.value !== 2
            ? item?.baseAmount || getById?.data?.payScaleElements[0]?.netAmount
            : values?.basicAmount;
      } else if (
        item.strBasedOn === "Percentage" ||
        item.strBasedOn === "Percent"
      ) {
        amount =
          roundToDecimals((item.numNumberOfPercent * basicAmount) / 100) || 0; // Calculate based on percentage of basic salary
        item.numAmount =
          roundToDecimals((item.numNumberOfPercent * basicAmount) / 100) || 0; // Calculate based on percentage of basic salary
      } else {
        amount = item.numAmount || 0; // Use the fixed amount if based on fixed amount
      }

      modified_data.push({
        ...item,
        amount: roundToDecimals(amount) || 0, // Round to nearest integer
      });
    }

    const total_gross_amount = modified_data.reduce(
      (total, item) => total + item.amount,
      0
    );
    form.setFieldsValue({
      grossAmount: total_gross_amount,
    });

    // const accounts = `Cash Pay (${100}%)`;
    // const temp = [...accountsDto];
    // temp[2].accounts = accounts;
    // temp[2].numAmount = total_gross_amount;
    // temp[0].numAmount = 0;
    // temp[1].numAmount = 0;
    // setAccountsDto([...temp]);
    if (orgId === 12) {
      accountDetailsSetup("bank", total_gross_amount);
    } else {
      accountDetailsSetup("cash", total_gross_amount);
    }

    setRowDto(modified_data);
  };

  const accountDetailsSetup = (account: any, gross: any) => {
    const temp = [...accountsDto];
    let accounts = `Cash Pay (${100}%)`;
    temp[2].accounts = accounts;
    temp[2].numAmount = gross;
    temp[0].numAmount = 0;
    temp[1].numAmount = 0;
    temp[1].accounts = "Digital/MFS Pay (0%)";
    temp[0].accounts = "Bank Pay (0%)";

    if (account === "bank") {
      accounts = `Bank Pay (${100}%)`;
      temp[0].accounts = accounts;
      temp[0].numAmount = gross;
      temp[2].numAmount = 0;
      temp[2].accounts = "Cash Pay (0%)";
      temp[1].accounts = "Digital/MFS Pay (0%)";

      temp[1].numAmount = 0;
    }
    if (account === "mfs") {
      accounts = `Digital/MFS Pay (${100}%)`;
      temp[1].accounts = accounts;
      temp[1].numAmount = gross;
      temp[2].numAmount = 0;
      temp[0].numAmount = 0;
      temp[2].accounts = "Cash Pay (0%)";
      temp[0].accounts = "Bank Pay (0%)";
    }

    setAccountsDto([...temp]);
  };

  // const adjustOverFollowAmount = (
  //   array = [],
  //   grossSalaryAmount: any,
  //   indexOfLowestAmount: any,
  //   setterFunc: any,
  //   payrollElementName: any
  // ): any => {
  //   // console.log({ payrollElementName });
  //   const totalAmount = array.reduce(
  //     (acc, obj) => acc + (obj as any).numAmount,
  //     0
  //   );
  //   const overFollowAmount = totalAmount - grossSalaryAmount;
  //   // console.log({
  //   //   totalAmount,
  //   //   elementList: array,
  //   //   grossSalaryAmount,
  //   //   overFollowAmount,
  //   // });
  //   if (overFollowAmount > 0) {
  //     // console.log({ isOverFollow: overFollowAmount });
  //     (array[indexOfLowestAmount] as any).numAmount =
  //       (array[indexOfLowestAmount] as any)?.numAmount - overFollowAmount;
  //     (array[indexOfLowestAmount] as any)[payrollElementName] -=
  //       overFollowAmount;
  //   } else {
  //     // console.log({ isNotOverFollow: overFollowAmount });

  //     (array[indexOfLowestAmount] as any).numAmount =
  //       (array[indexOfLowestAmount] as any)?.numAmount + overFollowAmount * -1;
  //     (array[indexOfLowestAmount] as any)[payrollElementName] +=
  //       overFollowAmount * -1;
  //   }
  //   setterFunc(array);
  // };
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      // fixed: "left",
    },
    {
      title: "Payroll Element",
      dataIndex: "strPayrollElementName",
    },
    {
      title: "Based On",
      dataIndex: "strBasedOn",
    },
    {
      title: "Amount/Percentage",
      render: (value: any, row: any) => (
        <>
          {row?.strBasedOn === "Amount"
            ? row?.numAmount
            : row?.numNumberOfPercent}
        </>
      ),
    },
    {
      title: "Net Amount",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            // name={`numAmount_${index}`}
            value={row?.numAmount}
            placeholder="Amount"
            onChange={(e: any) => {
              console.log({ e });
              if (isNaN(e)) {
                return toast.warn("Only numeric value allowed");
              }
              const values = form.getFieldsValue(true);
              if (
                values?.salaryType?.value !== "Grade" &&
                row?.strDependOn !== "Gross" &&
                index === 0
              ) {
                form.setFieldsValue({
                  basicAmount: +e,
                });
              }
              // if (values?.salaryType?.value == "Grade") {
              //   form.setFieldsValue({
              //     slabCount: 0,
              //   });
              //   if (index !== 0) {
              //     rowDto[0].numAmount =
              //       getById?.data?.payScaleElements[0]?.netAmount;
              //     rowDto[0].baseAmount =
              //       getById?.data?.payScaleElements[0]?.netAmount;
              //   }
              // }
              updateRowDtoHandler(+e, row, index);
            }}
            disabled={
              row?.strBasedOn !== "Amount" ||
              (row?.strDependOn !== "Gross" && row?.isBasicSalary)
            }
          />
        </>
      ),
    },
  ];
  const headerAccount: any = [
    {
      title: "",
      dataIndex: "accounts",
      width: 325,
    },
    {
      title: "",
      render: (value: any, row: any, index: number) => (
        <>
          {row?.isDDl ? (
            <PSelect
              options={[
                { value: 3, label: "Cash" },
                { value: 2, label: "Digital/MFS" },
                { value: 1, label: "Bank" },
              ]}
              name="transferType"
              // label="Transfer Type"
              placeholder="Transfer Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  transferType: op,
                });
              }}
              // rules={[{ required: true, message: "Salary Type is required" }]}
            />
          ) : (
            <PInput
              type="number"
              onChange={(e: any) => {
                updateDtoHandler(e, row, index);
              }}
              value={row?.numAmount}
              placeholder="Amount"
              // disabled={index === 2}
            />
          )}
        </>
      ),
    },
  ];
  const getBankDDL = () => {
    bankDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Bank",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.BankName;
          res[i].value = item?.BankID;
        });
      },
    });
  };

  useEffect(() => {
    getPayscale();
    getBankDDL();
    getPayrollGroupDDL();
    getEmployeeInfo();
  }, [wgId, buId, wId, location.state]);
  // for assigned
  useEffect(() => {
    if ((location?.state as any)?.Status === "Assigned") {
      getAssignedBreakdown();
      form.setFieldsValue({
        grossAmount: (location?.state as any)?.numNetGrossSalary,
        basicAmount: (location?.state as any)?.numBasicORGross,
        payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
          ? undefined
          : (location?.state as any)?.intSalaryBreakdownHeaderId,
        basedOn:
          (location?.state as any)?.strDependOn.toLowerCase() === "basic"
            ? { value: 2, label: "Basic" }
            : { value: 1, label: "Gross" },

        salaryType: employeeInfo?.data[0]?.isGradeBasedSalary
          ? "Grade"
          : "Non-Grade",
        // slabCount: {
        //   value: employeeInfo?.data[0]?.intSlabCount,
        //   label: employeeInfo?.data[0]?.intSlabCount,
        // },
      });
    }
    empBankInfo.action({
      urlKey: "EmployeeProfileView",
      method: "get",
      params: {
        employeeId: (location?.state as any)?.EmployeeId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        form.setFieldsValue({
          gateway:
            res?.empEmployeeBankDetail?.intBankOrWalletType === 2
              ? {
                  value: res?.empEmployeeBankDetail?.intBankWalletId,
                  label: res?.empEmployeeBankDetail?.strBankWalletName,
                }
              : "",
          mobile:
            res?.empEmployeeBankDetail?.intBankOrWalletType === 2
              ? res?.empEmployeeBankDetail?.strAccountNo
              : "",
          bank: res?.empEmployeeBankDetail?.intBankWalletId
            ? {
                value: res?.empEmployeeBankDetail?.intBankWalletId,
                label: res?.empEmployeeBankDetail?.strBankWalletName,
              }
            : undefined,
          routing: res?.empEmployeeBankDetail?.strRoutingNo
            ? res?.empEmployeeBankDetail?.strRoutingNo
            : undefined,
          swift: res?.empEmployeeBankDetail?.strSwiftCode,
          account: res?.empEmployeeBankDetail?.strAccountName
            ? res?.empEmployeeBankDetail?.strAccountName
            : undefined,
          accountNo: res?.empEmployeeBankDetail?.strAccountNo
            ? res?.empEmployeeBankDetail?.strAccountNo
            : undefined,
          branch: res?.empEmployeeBankDetail?.intBankBranchId
            ? {
                value: res?.empEmployeeBankDetail?.intBankBranchId,
                label: res?.empEmployeeBankDetail?.strBranchName,
              }
            : undefined,
        });
      },
    });
  }, [location?.state]);

  useEffect(() => {
    if (employeeInfo?.data[0]?.isGradeBasedSalary) {
      getById?.action({
        urlKey: "GetPayScaleSetupById",
        method: "get",
        params: {
          id: (location?.state as any)?.intSalaryBreakdownHeaderId,
        },

        onSuccess: (res: any) => {
          form.setFieldsValue({
            salaryType: { value: "Grade", label: "Grade" },
            payscale: (location?.state as any)?.intSalaryBreakdownHeaderId,
            payscaleJobLevel: {
              value: res?.jobLevelId,
              label: res?.jobLevelName,
            },
            payscaleGrade: {
              value: res?.jobGradeId,
              label: res?.jobGradeName,
            },
            payscaleClass: {
              value: res?.jobClassId,
              label: res?.jobClassName,
            },
            slabCount: {
              value: employeeInfo?.data[0]?.intSlabCount,
              label: `${
                employeeInfo?.data[0]?.intSlabCount > res?.incrementSlabCount
                  ? "Efficiency"
                  : "Slab"
              } ${employeeInfo?.data[0]?.intSlabCount}`,
            },
          });
          const temp = [];
          for (let i = 0; i <= res?.incrementSlabCount; i++) {
            temp.push({
              value: i,
              label: `Slab ${i}`,
            });
          }
          for (
            let i = 1;
            i <= res?.extendedIncrementSlabCount &&
            res?.extendedIncrementSlabCount !== 0;
            i++
          ) {
            temp.push({
              value: res?.incrementSlabCount + i,
              label: `Efficiency ${res?.incrementSlabCount + i}`,
            });
          }
          setSlabDDL(temp);

          // basic_or_grade_calculation();
        },
      });
    }
  }, [employeeInfo?.data[0]]);

  return employeeFeature?.isView ? (
    <PForm
      form={form}
      initialValues={{
        transferType: orgId === 12 ? { value: 1, label: "Bank" } : "Cash",
        bankOrMfs: 0,
      }}
      onFinish={submitHandler}
    >
      <PCard>
        <PCardHeader
          backButton
          title="Salary Assign"
          submitText="Save"
        ></PCardHeader>
        <EmployeeInfo
          employeeInfo={employeeInfo}
          getEmployeeInfo={getEmployeeInfo}
          setLoading={setLoading}
          orgId={orgId}
          loading={loading}
          form={form}
        />
        <Row gutter={[10, 2]} className="mb-3">
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={[
                { value: "Grade", label: "Grade" },
                { value: "Non-Grade", label: "Non-Grade" },
              ]}
              name="salaryType"
              label="Salary Type"
              placeholder="Salary Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  salaryType: op,
                  grossAmount: undefined,
                  slabCount: undefined,
                  payscale: undefined,
                  payrollGroup: undefined,
                  payscaleClass: undefined,
                  payscaleGrade: undefined,
                  payscaleJobLevel: undefined,
                  basedOn: undefined,
                  basicAmount: undefined,
                });
                setRowDto([]);
              }}
              rules={[{ required: true, message: "Salary Type is required" }]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { salaryType } = form.getFieldsValue(true);
              return salaryType?.value === "Grade" ? (
                <>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={payscaleApi?.data || []}
                      name="payscale"
                      label="Payscale"
                      placeholder="Payscale"
                      showSearch
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          payscale: op,
                          slabCount: undefined,
                          // payscaleClass: (op as any)?.jobClass,
                          // payscaleGrade: (op as any)?.jobGrade,
                          // payscaleJobLevel: (op as any)?.jobLevel,
                        });
                        getById?.action({
                          urlKey: "GetPayScaleSetupById",
                          method: "get",
                          params: {
                            id: value,
                          },

                          onSuccess: (res: any) => {
                            const modify = res?.payScaleElements?.map(
                              (i: any) => {
                                return {
                                  ...i,
                                  intSalaryBreakdownRowId: i?.id,
                                  intSalaryBreakdownHeaderId: value,
                                  strSalaryBreakdownTitle: (op as any)?.label,
                                  intPayrollElementTypeId: i?.payrollElementId,
                                  strPayrollElementName: i?.payrollElementName,
                                  strBasedOn: i?.basedOn,
                                  strDependOn: "Basic",
                                  baseAmount: i?.isBasic
                                    ? roundToDecimals(i?.netAmount)
                                    : 0,
                                  isBasicSalary: i?.isBasic,
                                  numNumberOfPercent: i?.amountOrPercentage,
                                  numAmount: roundToDecimals(i?.netAmount),
                                  numberOfPercent: i?.amountOrPercentage,
                                };
                              }
                            );
                            const gross = modify.reduce(
                              (acc: any, i: any) => acc + i?.numAmount,
                              0
                            );
                            form.setFieldsValue({
                              payscaleJobLevel: {
                                value: res?.jobLevelId,
                                label: res?.jobLevelName,
                              },
                              payscaleGrade: {
                                value: res?.jobGradeId,
                                label: res?.jobGradeName,
                              },
                              payscaleClass: {
                                value: res?.jobClassId,
                                label: res?.jobClassName,
                              },
                              grossAmount: Math.round(gross),
                            });
                            // accountsDto[2].numAmount = gross;
                            // accountsDto[2].accounts = `Cash Pay (${100}%)`;
                            // accountsDto[2].percentage = 100;

                            // accountsDto[0].numAmount = 0;
                            // accountsDto[0].accounts = `Bank Pay (${0}%)`;
                            // accountsDto[0].percentage = 0;
                            // accountsDto[1].numAmount = 0;
                            // accountsDto[1].accounts = `Digital/MFS Pay (${0}%)`;
                            // accountsDto[1].percentage = 0;
                            if (orgId === 12) {
                              accountDetailsSetup("bank", gross);
                            } else {
                              accountDetailsSetup("cash", gross);
                            }

                            const temp = [];
                            for (let i = 0; i <= res?.incrementSlabCount; i++) {
                              temp.push({
                                value: i,
                                label: `Slab ${i}`,
                              });
                            }
                            for (
                              let i = 1;
                              i <= res?.extendedIncrementSlabCount &&
                              res?.extendedIncrementSlabCount !== 0;
                              i++
                            ) {
                              temp.push({
                                value: res?.incrementSlabCount + i,
                                label: `Efficiency ${
                                  res?.incrementSlabCount + i
                                }`,
                              });
                            }
                            setSlabDDL(temp);
                            setRowDto(modify);
                            // basic_or_grade_calculation();
                          },
                        });
                      }}
                      rules={[
                        {
                          required: salaryType?.value === "Grade",
                          message: "Payscale is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={[]}
                      disabled={true}
                      name="payscaleClass"
                      label="Payscale Class"
                      placeholder="Payscale Class"
                      // onChange={(value, op) => {}}
                      // rules={[
                      //   {
                      //     required: salaryType?.value === "Grade",
                      //     message: "Payscale is required",
                      //   },
                      // ]}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={[]}
                      name="payscaleGrade"
                      label="Payscale Grade"
                      disabled={true}
                      placeholder="Payscale Grade"
                      // onChange={(value, op) => {

                      // }}
                      // rules={[
                      //   {
                      //     required: salaryType?.value === "Grade",
                      //     message: "Payscale is required",
                      //   },
                      // ]}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={[]}
                      name="payscaleJobLevel"
                      disabled={true}
                      label="Payscale Job Level"
                      placeholder="Payscale Job Level"
                      // onChange={(value, op) => {

                      // }}
                      // rules={[
                      //   {
                      //     required: salaryType?.value === "Grade",
                      //     message: "Payscale is required",
                      //   },
                      // ]}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={payrollGroupDDL?.data || []}
                      name="payrollGroup"
                      label="Payroll Group"
                      placeholder="Payroll Group"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          payrollGroup: op,
                          grossAmount: undefined,
                          basicAmount: undefined,
                          basedOn:
                            (op as any)?.strDependOn?.toLowerCase() === "basic"
                              ? { value: 2, label: "Basic" }
                              : { value: 1, label: "Gross" },
                        });
                        getBreakDownPolicyElements();
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Payroll Group is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={[
                        { value: 1, label: "Gross" },
                        { value: 2, label: "Basic" },
                      ]}
                      name="basedOn"
                      label="Based On"
                      disabled={true}
                      placeholder="Based On"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          basedOn: op,
                          basicAmount: undefined,
                          grossAmount: undefined,
                        });
                        getBreakDownPolicyElements();
                      }}
                      rules={[
                        { required: true, message: "Based On is required" },
                      ]}
                    />
                  </Col>
                </>
              );
            }}
          </Form.Item>
        </Row>
        <Row className="mb-2">
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { basedOn, grossAmount, basicAmount, salaryType } =
                form.getFieldsValue(true);
              if (salaryType?.value !== "Grade" && basedOn?.value === 2) {
                return (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="text"
                      value={basicAmount}
                      label={
                        <span>
                          <span className="text-danger ">* </span> Basic{" "}
                        </span>
                      }
                      placeholder="Basic"
                      onChange={(e: any) => {
                        if (isNaN(e?.target?.value)) {
                          toast.warn("Only numeric value allowed");
                          return;
                        } else {
                          form.setFieldsValue({
                            basicAmount: +e?.target?.value,
                          });
                          basic_or_grade_calculation();
                        }
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 2 || basedOn === 2,
                          message: "Basic is required",
                        },
                      ]}
                    />
                  </Col>
                );
              } else
                return salaryType?.value !== "Grade" ? (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="text"
                      // name="grossAmount"
                      value={grossAmount}
                      label={
                        <span>
                          <span className="text-danger ">* </span> Gross{" "}
                        </span>
                      }
                      placeholder="Gross"
                      onChange={(e: any) => {
                        if (isNaN(e?.target?.value)) {
                          return toast.warn("Only numeric value allowed");
                        } else {
                          // const temp = [...accountsDto];
                          if (orgId === 12) {
                            // const accounts = `Bank Pay (${100}%)`;
                            // temp[0].accounts = accounts;
                            // temp[0].numAmount = e;
                            // temp[2].numAmount = 0;
                            // temp[1].numAmount = 0;
                            accountDetailsSetup("bank", +e?.target?.value);
                          } else {
                            accountDetailsSetup("cash", +e?.target?.value);

                            // const accounts = `Cash Pay (${100}%)`;
                            // temp[2].accounts = accounts;
                            // temp[2].numAmount = e;
                            // temp[0].numAmount = 0;
                            // temp[1].numAmount = 0;
                            // (values?.bankPay * 100) /
                            //               values?.totalGrossSalary
                            //             )?.toFixed(6)
                          }
                          form.setFieldsValue({
                            grossAmount: +e?.target?.value,
                          });
                          new_gross_calculation();
                          // setAccountsDto([...temp]);
                        }
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 1 || basedOn === 1,
                          message: "Gross is required",
                        },
                      ]}
                    />
                  </Col>
                ) : salaryType?.value == "Grade" ? (
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={slabDDL}
                      name="slabCount"
                      label="Slab Count"
                      placeholder="Slab Count"
                      onChange={(value, op) => {
                        const temp = [...rowDto];
                        const efficiency =
                          value > getById?.data?.incrementSlabCount
                            ? value % getById?.data?.incrementSlabCount
                            : 0;
                        const actualSlab = value - efficiency;
                        temp[0].numAmount =
                          (temp[0].baseAmount ||
                            getById?.data?.payScaleElements[0]?.netAmount) +
                          actualSlab * getById?.data?.incrementAmount +
                          efficiency * getById?.data?.extendedIncrementAmount;

                        setRowDto((prev) => {
                          prev = temp;
                          return prev;
                        });
                        basic_or_grade_calculation();
                        form.setFieldsValue({
                          slabCount: value,
                        });
                      }}
                      rules={[
                        {
                          required: salaryType?.value == "Grade",
                          message: "Slab Count is required",
                        },
                      ]}
                    />
                  </Col>
                ) : undefined;
            }}
          </Form.Item>
          <Col xs={12}></Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { grossAmount } = form.getFieldsValue(true);

              return (
                <Col md={6} sm={12} xs={24}>
                  <PInput
                    type="number"
                    label="Gross Amount"
                    value={grossAmount}
                    placeholder="GROSS"
                    disabled={true}
                    // rules={[
                    //   {
                    //     required: basedOn?.value === 2,
                    //     message: "Basic is required",
                    //   },
                    // ]}
                  />
                </Col>
              );
            }}
          </Form.Item>
        </Row>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { grossAmount, salaryType } = form.getFieldsValue(true);
            const elementSum = rowDto?.reduce(
              (acc, i) => acc + i?.numAmount,
              0
            );
            return (
              grossAmount > 0 &&
              salaryType?.label !== "Grade" &&
              Math.round(elementSum) !== grossAmount && (
                <Alert
                  icon={<InfoOutlinedIcon fontSize="inherit" />}
                  severity="warning"
                  style={{
                    // width: "27rem",
                    // position: "sticky",
                    height: "84px",
                    margin: "10px 0",
                    top: "1px",
                  }}
                >
                  <div>
                    <div className="mb-3">
                      <h2>
                        Gross Amount and Breakdown Sum Amount Mismatch <br />
                        Adjust By
                        {elementSum > grossAmount ? " Reducing " : " Adding "}
                        Amount {Math.round(Math.abs(elementSum - grossAmount))}
                      </h2>
                    </div>
                    {/* <Divider orientation="left">Small Size</Divider> */}
                  </div>
                </Alert>
              )
            );
          }}
        </Form.Item>
        {rowDto?.length > 0 ? (
          <DataTable header={header} bordered data={rowDto || []} />
        ) : // <NoResult title="No Result Found" para="" />
        null}
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          Accounts
        </Divider>
        <Row gutter={[10, 1]} className="mb-3">
          <Col span={12}>
            <DataTable
              showHeader={false}
              header={headerAccount}
              bordered
              data={accountsDto.slice(0, 2) || []}
            />
          </Col>
          <Col span={12}>
            <DataTable
              showHeader={false}
              header={headerAccount}
              bordered
              data={accountsDto.slice(2) || []}
            />
          </Col>
        </Row>
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "6px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <PRadio
              name="bankOrMfs"
              type="group"
              options={
                orgId === 12
                  ? [
                      {
                        value: 0,
                        label: "Bank Details",
                      },
                    ]
                  : [
                      {
                        value: 0,
                        label: "Bank Details",
                      },
                      {
                        value: 1,
                        label: "Digital/MFS",
                      },
                    ]
              }
              onChange={(e: any) => {
                const value = e.target.value;
                form.setFieldsValue({
                  bankOrMfs: value,
                });
              }}
            />
            {/* <span>Promote?</span> */}
          </div>
        </Divider>
        {/* <Divider
          style={{
            marginBlock: "4px",
            marginTop: "16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        ></Divider> */}
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { bankOrMfs } = form.getFieldsValue(true);

            return bankOrMfs === 1 ? (
              <DigitalMFS
                form={form}
                wgId={wgId}
                buId={buId}
                accountsDto={accountsDto}
              />
            ) : (
              <BankInfo
                form={form}
                bankDDL={bankDDL}
                orgId={orgId}
                accountsDto={accountsDto}
              />
            );
          }}
        </Form.Item>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default SalaryV2;
