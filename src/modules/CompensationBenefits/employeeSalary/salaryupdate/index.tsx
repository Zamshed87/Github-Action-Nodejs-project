import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import profileImg from "../../../../assets/images/profile.jpg";

import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { gray700, gray900 } from "utility/customColor";
import { APIUrl } from "App";
import { MovingOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import IncrementHistoryComponent from "../salaryAssign/DrawerBody/incrementHistoryView";
import IConfirmModal from "common/IConfirmModal";
import { salaryHoldAction } from "../salaryAssign/helper";
import { useHistory, useLocation } from "react-router-dom";
import { todayDate } from "utility/todayDate";
import { bankDetailsAction } from "modules/employeeProfile/aboutMe/helper";

type TAttendenceAdjust = unknown;
const SalaryV2: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
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
  const [openIncrement, setOpenIncrement] = useState(false);
  const handleIncrementClose = () => {
    setOpenIncrement(false);
  };
  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const salaryAssign = useApiRequest([]);
  const bankDDL = useApiRequest([]);
  const branchDDL = useApiRequest([]);
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
        IntSalaryBreakdownHeaderId: (location?.state as any)
          ?.intSalaryBreakdownHeaderId,
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
          };
        });
        if (employeeInfo?.data[0]?.isGradeBasedSalary) {
          const modifyforGrade = [...modify];
          // modifyforGrade[0].strBasedOn = "Amount";
          setRowDto(modifyforGrade);
        } else {
          setRowDto(modify);
          salaryBreakDownCalc();
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
          transferType: res[0]?.intOthersAdditionalAmountTransferInto || 3,
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
        IntSalaryBreakdownHeaderId: payrollGroup?.value,
        IntWorkplaceId: 0,
        intId: 0,
      },
      onSuccess: (res) => {
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
    const accountSum =
      accountsDto[1].numAmount +
      accountsDto[2].numAmount +
      accountsDto[0].numAmount;

    if (accountSum !== values?.grossAmount) {
      return toast.warn(
        "Bank Pay, Cash Pay and Digital pay must be equal to Gross Salary!!!"
      );
    }
    const elementSum = rowDto?.reduce((acc, i) => acc + i?.numAmount, 0);

    if (elementSum !== values?.grossAmount) {
      return toast.warn(
        "Breakdonwn Elements Net Amount Must Be Equal To Gross Amount!!!"
      );
    }
    const payload = {
      partId: 0,
      intEmployeeBankDetailsId:
        +employeeInfo?.data[0]?.empEmployeeBankDetail
          ?.intEmployeeBankDetailsId || 0,
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
    bankDetailsAction(payload, setLoading, () => {});

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
      numCashPayInAmount: accountsDto[2].numAmount,
      numBankPayInAmount: accountsDto[0].numAmount,
      numDigitalPayInAmount: accountsDto[1].numAmount,
      IntOthersAdditionalAmountTransferInto: values?.transferType?.value,
      isGradeBasedSalary: values?.salaryType?.value === "Grade" ? true : false,
      intSlabCount:
        values?.salaryType?.value === "Grade"
          ? values?.slabCount?.value || values?.slabCount
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
    let temp = [...accountsDto];

    // Check for invalid input values
    if (e < 0) {
      return toast.warn(`${row?.key} can't be negative`);
    }
    if (e > grossAmount) {
      return toast.warn(`${row?.key} can't be greater than gross`);
    }

    // Update the selected index with the new amount
    temp[index].numAmount = e;
    temp[index].accounts = `${temp[index].key} (${(
      (e * 100) /
      grossAmount
    ).toFixed(6)}%)`;

    // Calculate the remaining amount to be distributed between the other two indexes
    const remainingAmount = grossAmount - e;
    const [index1, index2] = [0, 1, 2].filter((i) => i !== index); // get the other two indexes

    // Distribute remaining amount between the other two indexes
    if (temp[index1].numAmount > remainingAmount) {
      temp[index1].numAmount = remainingAmount;
      temp[index2].numAmount = 0;
    } else if (temp[index2].numAmount > remainingAmount) {
      temp[index2].numAmount = remainingAmount;
      temp[index1].numAmount = 0;
    } else {
      temp[index2].numAmount = remainingAmount - temp[index1].numAmount;
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
    temp[index].accounts = `${temp[index].key} (${(
      (temp[index].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;
    temp[index].percentage = (
      (temp[index].numAmount * 100) /
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
    let temp = [...rowDto];

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
    temp[index].numAmount = e + e * (slabCount || 0);
    if (temp[index].isBasicSalary) {
      temp[index].baseAmount = e;
    }
    setRowDto((prev) => {
      prev = temp;
      return prev;
    });

    if (basedOn?.value === 2 || salaryType?.value === "Grade") {
      calculate_salary_breakdown();
    }
    if (basedOn?.value === 1 && salaryType?.value !== "Grade") {
      methodAb();
    }
  };
  const methodAb = () => {
    const { grossAmount } = form.getFieldsValue(true); // Get the gross amount input
    const basicElement = rowDto.find((item) => item.isBasicSalary); // Find the basic salary element
    const basicAmount = basicElement ? basicElement.numAmount : 0;

    // Calculate initial amounts based on dependencies
    const calculatedRowDto = rowDto.map((item) => {
      if (item.strBasedOn === "Percentage") {
        // Calculate based on Basic or Gross dependency
        if (item.strDependOn === "Basic" && basicAmount > 0) {
          item.numAmount = Math.ceil(
            (item.numNumberOfPercent * basicAmount) / 100
          );
        } else if (item.strDependOn === "Gross" && grossAmount > 0) {
          item.numAmount = Math.ceil(
            (item.numNumberOfPercent * grossAmount) / 100
          );
        }
      }
      // Retain fixed amounts where strBasedOn is "Amount"
      return item;
    });

    // Calculate the total amount
    let totalCalculatedAmount = calculatedRowDto.reduce(
      (sum, item) => sum + item.numAmount,
      0
    );

    // Determine if adjustment is needed
    const difference = grossAmount - totalCalculatedAmount;

    if (difference !== 0) {
      // Find the element with the lowest percentage or designated element for adjustment
      const adjustableElement = calculatedRowDto.reduce((minItem, item) =>
        item.numNumberOfPercent < minItem.numNumberOfPercent ? item : minItem
      );

      // Adjust to balance the difference with the Gross amount
      adjustableElement.numAmount += difference;
    }

    // Update the state with recalculated values
    setRowDto(calculatedRowDto);
  };

  const salaryBreakDownCalc = (salaryDependsOn = "") => {
    const modifyData: any = [];
    const { grossAmount } = form.getFieldsValue(true);

    rowDto?.forEach((itm: any) => {
      const obj = {
        ...itm,
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.ceil(grossAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.ceil(itm?.numAmount)
            : Math.ceil((itm?.numNumberOfPercent * grossAmount) / 100),
        numAmount:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.ceil(grossAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.ceil(itm?.numAmount)
            : Math.ceil((itm?.numNumberOfPercent * grossAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        levelVariable: itm?.strPayrollElementName
          .toLowerCase()
          .split(" ")
          .join(""),
      };

      modifyData.push(obj);
    });
    const indexOfLowestAmount = modifyData.reduce(
      (minIndex: any, currentObject: any, currentIndex: any, array: any) => {
        return currentObject.numNumberOfPercent <
          array[minIndex].numNumberOfPercent
          ? currentIndex
          : minIndex;
      },
      0
    );
    adjustOverFollowAmount(
      modifyData,
      grossAmount,
      indexOfLowestAmount,
      setRowDto,
      `${modifyData[indexOfLowestAmount]?.strPayrollElementName
        .toLowerCase()
        .split(" ")
        .join("")}`
    );
  };
  const calculate_salary_breakdown = () => {
    let basicAmount = 0;
    const modified_data = [];
    const values = form.getFieldsValue(true);
    // const { basicAmount } = form.getFieldsValue(true);
    if (values?.salaryType?.value === "Grade") {
      basicAmount = rowDto[0]?.numAmount;
      // basicAmount = rowDto[0]?.numAmount;
    } else {
      basicAmount = values?.basicAmount;
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
        amount = (item.numNumberOfPercent * basicAmount) / 100; // Calculate based on percentage of basic salary
        item.numAmount = (item.numNumberOfPercent * basicAmount) / 100; // Calculate based on percentage of basic salary
      } else {
        amount = item.numAmount; // Use the fixed amount if based on fixed amount
      }

      modified_data.push({
        ...item,
        amount: Math.ceil(amount), // Round to nearest integer
      });
    }

    const total_gross_amount = modified_data.reduce(
      (total, item) => total + item.amount,
      0
    );
    form.setFieldsValue({
      grossAmount: total_gross_amount,
    });
    const accounts = `Cash Pay (${100}%)`;
    const temp = [...accountsDto];
    temp[2].accounts = accounts;
    temp[2].numAmount = total_gross_amount;
    temp[0].numAmount = 0;
    temp[1].numAmount = 0;
    setRowDto(modified_data);
  };

  const adjustOverFollowAmount = (
    array = [],
    grossSalaryAmount: any,
    indexOfLowestAmount: any,
    setterFunc: any,
    payrollElementName: any
  ): any => {
    // console.log({ payrollElementName });
    const totalAmount = array.reduce(
      (acc, obj) => acc + (obj as any).numAmount,
      0
    );
    const overFollowAmount = totalAmount - grossSalaryAmount;
    // console.log({
    //   totalAmount,
    //   elementList: array,
    //   grossSalaryAmount,
    //   overFollowAmount,
    // });
    if (overFollowAmount > 0) {
      // console.log({ isOverFollow: overFollowAmount });
      (array[indexOfLowestAmount] as any).numAmount =
        (array[indexOfLowestAmount] as any)?.numAmount - overFollowAmount;
      (array[indexOfLowestAmount] as any)[payrollElementName] -=
        overFollowAmount;
    } else {
      // console.log({ isNotOverFollow: overFollowAmount });

      (array[indexOfLowestAmount] as any).numAmount =
        (array[indexOfLowestAmount] as any)?.numAmount + overFollowAmount * -1;
      (array[indexOfLowestAmount] as any)[payrollElementName] +=
        overFollowAmount * -1;
    }
    setterFunc(array);
  };
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
              const values = form.getFieldsValue(true);
              if (values?.salaryType?.value !== "Grade") {
                form.setFieldsValue({
                  basicAmount: e,
                });
              }
              if (values?.salaryType?.value == "Grade") {
                form.setFieldsValue({
                  slabCount: 0,
                });
                if (index !== 0) {
                  rowDto[0].numAmount =
                    getById?.data?.payScaleElements[0]?.netAmount;
                  rowDto[0].baseAmount =
                    getById?.data?.payScaleElements[0]?.netAmount;
                }
              }
              updateRowDtoHandler(e, row, index);
            }}
            disabled={row?.strBasedOn !== "Amount"}
          />
        </>
      ),
    },
  ];
  const headerAccount: any = [
    {
      title: "Accounts",
      dataIndex: "accounts",
      width: 625,
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
  const getBranchDDL = () => {
    const { bank } = form.getFieldsValue(true);
    branchDDL?.action({
      urlKey: "BankBranchDDL",
      method: "GET",
      params: {
        BankId: bank?.value,
        AccountID: orgId,
        DistrictId: 0,
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
        payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
          ? undefined
          : (location?.state as any)?.intSalaryBreakdownHeaderId,
        basedOn: 1,
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
          bank: res?.empEmployeeBankDetail?.intBankWalletId
            ? res?.empEmployeeBankDetail?.intBankWalletId
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
          let temp = [];
          for (let i = 0; i <= res?.incrementSlabCount; i++) {
            temp.push({
              value: i,
              label: `Slab ${i}`,
            });
          }
          for (let i = 0; i <= res?.extendedIncrementSlabCount; i++) {
            temp.push({
              value: res?.incrementSlabCount + i + 1,
              label: `Efficiency ${res?.incrementSlabCount + i + 1}`,
            });
          }
          setSlabDDL(temp);

          // calculate_salary_breakdown();
        },
      });
    }
  }, [employeeInfo?.data[0]]);

  // console.log({ rowDto });
  const holdSalaryHandler = (e: any) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure?`,
      yesAlertFunc: () => {
        const callback = () => {
          getEmployeeInfo();
        };
        salaryHoldAction(
          e.target.checked,
          employeeInfo?.data[0]?.EmployeeId,
          setLoading,
          callback
        );
      },
      noAlertFunc: () => {
        // setIsHoldSalary(modifyIsHold);
      },
    };
    IConfirmModal(confirmObject);
  };
  return employeeFeature?.isView ? (
    <PForm
      form={form}
      initialValues={{
        transferType: "Cash",
      }}
      onFinish={submitHandler}
    >
      <PCard>
        <PCardHeader
          title="Salary Assign"
          // buttonList={[
          //   {
          //     type: "primary",
          //     content: "Save",
          //     onClick: () => {
          //       submitHandler();
          //     },
          //     disabled: selectedRow?.length > 0 ? false : true,
          //     //   icon: <AddOutlined />,
          //   },
          //   {
          //     type: "primary-outline",
          //     content: "Cancel",
          //     onClick: () => {
          //       form.resetFields();
          //       setSelectedRow([]);
          //       setRowDto((prev) => {
          //         prev = [];
          //         return prev;
          //       });
          //       // getSalaryLanding();
          //     },
          //     // disabled: true,
          //     //   icon: <AddOutlined />,
          //   },
          // ]}
          submitText="Save"
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3 card-style">
          <Col md={13}>
            <div
              className="d-flex justify-content-between align-items-center mt-2"
              style={{
                paddingBottom: "10px",
                marginBottom: "10px",
                // borderBottom: `1px solid ${gray200}`,
              }}
            >
              <div className="d-flex ">
                <div
                  style={{
                    width:
                      employeeInfo?.data?.length > 0
                        ? employeeInfo?.data && "auto"
                        : "78px",
                    // width: [].length > 0 ? "auto" : "78px",
                  }}
                  className={
                    employeeInfo?.data?.length > 0
                      ? employeeInfo?.data &&
                        "add-image-about-info-card height-auto"
                      : "add-image-about-info-card"
                  }
                >
                  <label
                    htmlFor="contained-button-file"
                    className="label-add-image"
                  >
                    {employeeInfo?.data[0]?.ProfileImageUrl ? ( //singleData[0]?.ProfileImageUrl
                      <img
                        src={`${APIUrl}/Document/DownloadFile?id=${employeeInfo?.data[0]?.ProfileImageUrl}`}
                        alt=""
                        height="78px"
                        width="78px"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    ) : (
                      <img
                        src={profileImg}
                        alt="iBOS"
                        height="78px"
                        width="78px"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    )}
                  </label>
                </div>
                <div className="content-about-info-card ml-3">
                  <div className="d-flex justify-content-between">
                    <h4
                      className="name-about-info"
                      style={{ marginBottom: "5px" }}
                    >
                      {`${employeeInfo?.data[0]?.EmployeeName}  `}
                      <span style={{ fontWeight: "400", color: gray700 }}>
                        [{employeeInfo?.data[0]?.EmployeeCode}]
                      </span>{" "}
                    </h4>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Department -
                      </small>{" "}
                      {`${employeeInfo?.data[0]?.DepartmentName}`}
                    </p>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Designation -
                      </small>{" "}
                      {employeeInfo?.data[0]?.DesignationName}
                    </p>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Employment Type -
                      </small>{" "}
                      {employeeInfo?.data[0]?.strEmploymentType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={8}></Col>
          <div className="">
            <div className="ml-1">
              <PInput
                label="Hold Salary?"
                type="checkbox"
                layout="horizontal"
                name="isHoldSalary"
                onChange={(e) => {
                  if (e.target.checked) {
                    holdSalaryHandler(e);
                  }
                }}
              />
            </div>
            <div>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIncrement(true);
                }}
                style={{ color: gray900 }}
                className="d-inline-block mt-2 pointer uplaod-para"
              >
                <span style={{ fontSize: "12px" }}>
                  <MovingOutlined
                    sx={{
                      marginRight: "5px",
                      fontSize: "18px",
                      color: gray900,
                    }}
                  />{" "}
                  Increment History
                </span>
              </p>
            </div>
          </div>
        </Row>
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
                                  baseAmount: i?.isBasic ? i?.netAmount : 0,
                                  isBasicSalary: i?.isBasic,
                                  numNumberOfPercent: i?.amountOrPercentage,
                                  numAmount: i?.netAmount,
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
                              grossAmount: gross,
                            });
                            accountsDto[2].numAmount = gross;
                            accountsDto[2].accounts = `Cash Pay (${100}%)`;
                            accountsDto[2].percentage = 100;
                            const temp = [];
                            for (let i = 0; i <= res?.incrementSlabCount; i++) {
                              temp.push({
                                value: i,
                                label: `Slab ${i}`,
                              });
                            }
                            for (
                              let i = 0;
                              i <= res?.extendedIncrementSlabCount;
                              i++
                            ) {
                              temp.push({
                                value: res?.incrementSlabCount + i + 1,
                                label: `Efficiency ${
                                  res?.incrementSlabCount + i + 1
                                }`,
                              });
                            }
                            setSlabDDL(temp);
                            setRowDto(modify);
                            // calculate_salary_breakdown();
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
              const { basedOn, salaryType } = form.getFieldsValue(true);
              if (salaryType?.value !== "Grade" && basedOn?.value === 2) {
                return (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="number"
                      name="basicAmount"
                      label="Basic"
                      placeholder="Basic"
                      onChange={() => calculate_salary_breakdown()}
                      rules={[
                        {
                          required: basedOn?.value === 2,
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
                      type="number"
                      name="grossAmount"
                      label="Gross"
                      placeholder="Gross"
                      onChange={(e: any) => {
                        const accounts = `Cash Pay (${100}%)`;
                        const temp = [...accountsDto];
                        temp[2].accounts = accounts;
                        temp[2].numAmount = e;
                        temp[0].numAmount = 0;
                        temp[1].numAmount = 0;
                        salaryBreakDownCalc();
                        // (values?.bankPay * 100) /
                        //               values?.totalGrossSalary
                        //             )?.toFixed(6)

                        setAccountsDto([...temp]);
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 1,
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
                        let temp = [...rowDto];
                        temp[0].numAmount =
                          (temp[0].baseAmount ||
                            getById?.data?.payScaleElements[0]?.netAmount) +
                          value *
                            (temp[0].baseAmount ||
                              getById?.data?.payScaleElements[0]?.netAmount);
                        setRowDto((prev) => {
                          prev = temp;
                          return prev;
                        });
                        calculate_salary_breakdown();
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
              const { grossAmount, basicAmount } = form.getFieldsValue(true);

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
        {rowDto?.length > 0 ? (
          <DataTable header={header} bordered data={rowDto || []} />
        ) : (
          <NoResult title="No Result Found" para="" />
        )}
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        ></Divider>
        <DataTable header={headerAccount} bordered data={accountsDto || []} />
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        ></Divider>
        <Row gutter={[10, 2]}>
          <Col md={3} className="mt-2">
            Bank Name
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PSelect
              options={bankDDL?.data?.length > 0 ? bankDDL?.data : []}
              name="bank"
              placeholder="Bank"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bank: op,
                });
                getBranchDDL();
              }}
              rules={[{ required: true, message: "Bank is required" }]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Branch Name
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PSelect
              options={branchDDL?.data?.length > 0 ? branchDDL?.data : []}
              name="branch"
              placeholder="Branch"
              onChange={(value, op) => {
                form.setFieldsValue({
                  branch: op,
                  routing: (op as any)?.name,
                });
              }}
              rules={[{ required: true, message: "Branch is required" }]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Routing No
          </Col>
          <Col md={12} className="mt-2">
            <PInput
              type="number"
              name="routing"
              placeholder="Routing"
              disabled={true}

              // rules={[
              //   {
              //     // required: basedOn?.value === 2,
              //     message: "Basic is required",
              //   },
              // ]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Swift Code
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PInput
              type="number"
              name="swift"
              disabled={true}
              placeholder="Swift Code"
              // rules={[
              //   {
              //     // required: basedOn?.value === 2,
              //     message: "Basic is required",
              //   },
              // ]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Account Name
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PInput
              type="text"
              name="account"
              placeholder="Account Name"
              rules={[
                {
                  required: true,
                  message: "Account Name is required",
                },
              ]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Account No
          </Col>
          <Col md={12} className="mt-2">
            <PInput
              type="number"
              name="accountNo"
              placeholder="Account No"
              rules={[
                {
                  required: true,
                  message: "Account No is required",
                },
              ]}
            />
          </Col>
          <Col md={7}></Col>
        </Row>
      </PCard>

      <IncrementHistoryComponent
        show={openIncrement}
        title={"Increment History"}
        onHide={handleIncrementClose}
        size="lg"
        fullscreen=""
        backdrop="static"
        classes="default-modal"
        orgId={orgId}
        singleData={employeeInfo?.data?.[0]}
        loading={loading}
        setLoading={setLoading}
      />
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default SalaryV2;
