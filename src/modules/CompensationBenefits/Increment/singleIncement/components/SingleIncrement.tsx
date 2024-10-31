import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { todayDate } from "utility/todayDate";
import { bankDetailsAction } from "modules/employeeProfile/aboutMe/helper";
import { gray700 } from "utility/customColor";
import { getEmployeeProfileViewData } from "modules/employeeProfile/employeeFeature/helper";
import { getTransferAndPromotionHistoryById } from "../helper";
import moment from "moment";
import IConfirmModal from "common/IConfirmModal";

type TIncrement = unknown;
const SingleIncrement: React.FC<TIncrement> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const location = useLocation();
  const { id }: any = useParams();
  const history = useHistory();
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  console.log({ location });
  // States
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState<any[]>([]);
  const [transferRowDto, setTransferRowDtoRowDto] = useState<any[]>([]);
  const [slabDDL, setSlabDDL] = useState<any[]>([]);
  const [empBasic, setEmpBasic] = useState([]);
  const [fileId, setFileId] = useState(0);

  const [historyData, setHistoryData] = useState([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const createIncrement = useApiRequest([]);
  const payscaleApi = useApiRequest([]);
  const breakDownPolicyApi = useApiRequest([]);
  const employeeInfo = useApiRequest([]);
  const getById = useApiRequest({});
  const assignBreakdownApi = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);
  const employeeDDLApi = useApiRequest([]);
  const isPromotionEligibleCheckApi = useApiRequest([]);
  const employeeIncrementByIdApi = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Single Increment";
  }, []);

  const getPayscale = () => {
    const { employee } = form.getFieldsValue(true);
    payscaleApi?.action({
      urlKey: "GetPayScaleSetupDDLbyEmployee",
      method: "GET",
      params: {
        employeeId:
          employee?.value ||
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,
      },
    });
  };

  const getEmployee = (value: any) => {
    if (value?.length < 2) return employeeDDLApi?.reset();

    employeeDDLApi?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const getAssignedBreakdown = () => {
    const { employee } = form?.getFieldsValue(true);
    assignBreakdownApi?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId:
          employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
        IntEmployeeId:
          employee?.value ||
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,
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
        form.setFieldsValue({
          grossAmount: res[0]?.numGrossSalary,
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
    const { employee } = form?.getFieldsValue(true);

    employeeInfo?.action({
      urlKey: "EmployeeSalaryManagement",
      method: "post",
      payload: {
        partType: "EmployeeSalaryInfoByEmployeeId",
        departmentId: 0,
        designationId: 0,
        supervisorId: 0,
        strStatus: "Assigned",
        employeeId:
          employee?.value ||
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,

        accountId: orgId,
        businessUnitId: buId,
        WorkplaceGroupId: wgId,
        workplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        form.setFieldsValue({
          salaryType: {
            label: res[0]?.isGradeBasedSalary ? "Grade" : "Non-Grade",
            value: res[0]?.isGradeBasedSalary ? "Grade" : "Non-Grade",
          },
        });
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
  //   const getBreakDownPolicyElements = () => {
  //     const { payrollGroup } = form.getFieldsValue(true);
  //     breakDownPolicyApi?.action({
  //       urlKey: "BreakdownNPolicyForSalaryAssign",
  //       method: "GET",
  //       params: {
  //         StrReportType: "BREAKDOWN ELEMENT BY ID",

  //         IntAccountId: orgId,
  //         IntSalaryBreakdownHeaderId: payrollGroup?.value,
  //         IntWorkplaceId: 0,
  //         intId: 0,
  //       },
  //       onSuccess: (res) => {
  //         setRowDto(res);
  //       },
  //     });
  //   };

  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  const submitHandler = async () => {
    const values = form.getFieldsValue(true);

    const elementSum = rowDto?.reduce((acc, i) => acc + i?.numAmount, 0);

    if (
      elementSum !== values?.grossAmount &&
      values?.salaryType?.value === "Grade"
    ) {
      return toast.warn(
        "Breakdonwn Elements Net Amount Must Be Equal To Gross Amount!!!"
      );
    }

    const modifiedBreakDown = rowDto?.map((i) => {
      return {
        dependsOn: i?.strBasedOn,
        payrollElementId: i?.intPayrollElementTypeId,
        amount: i?.numAmount,
        numberOfPercent: i?.strBasedOn === "Amount" ? 0 : i?.numNumberOfPercent,
      };
    });

    const getRoleNameList =
      values?.role &&
      values?.role.map((item: any) => {
        return {
          intRoleExtensionRowId: 0,
          intTransferNpromotionId: !id
            ? 0
            : (location?.state as any)?.singleData?.transferPromotionObj
                ?.intTransferNpromotionId || 0,
          intUserRoleId: item?.value,
          strUserRoleName: item?.label,
        };
      });

    const roleExtensionList =
      !!transferRowDto?.length &&
      transferRowDto.map((item) => {
        return {
          intRoleExtensionRowId: 0,
          intTransferNpromotionId: !id
            ? 0
            : (location?.state as any)?.singleData?.transferPromotionObj
                ?.intTransferNpromotionId || 0,
          intEmployeeId: values?.employee?.value,
          intOrganizationTypeId: item?.intOrganizationTypeId,
          strOrganizationTypeName: item?.strOrganizationTypeName,
          intOrganizationReffId: item?.intOrganizationReffId,
          strOrganizationReffName: item?.strOrganizationReffName,
        };
      });

    const transferPromotionObj = {
      intTransferNpromotionId: !id
        ? 0
        : (location?.state as any)?.singleData?.transferPromotionObj
            ?.intTransferNpromotionId,
      intEmployeeId: values?.employee?.value,
      strEmployeeName: values?.employee?.label,
      employmentTypeId: values?.employee?.employmentTypeId,
      hrPositionId: values?.employee?.hrPositionId,
      StrTransferNpromotionType: values?.transferNPromotionType?.label,
      intAccountId: orgId,
      intBusinessUnitId: values?.businessUnit?.value,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      intDepartmentId: values?.department?.value,
      intDesignationId: values?.designation?.value,
      intSupervisorId: values?.supervisor?.value,
      intLineManagerId: values?.lineManager?.value,
      intDottedSupervisorId: 0,
      dteEffectiveDate: values?.effectiveDate,
      dteReleaseDate: null,
      intAttachementId:
        id && (!fileId as any)?.globalFileUrlId
          ? fileId
          : (!fileId as any)?.globalFileUrlId || 0,
      strRemarks: values?.remarks,
      strStatus: "",
      isReject: false,
      dteRejectDateTime: null,
      intRejectedBy: null,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      isActive: true,
      empTransferNpromotionUserRoleVMList: getRoleNameList || [],
      empTransferNpromotionRoleExtensionVMList: roleExtensionList || [],
    };

    const payload = {
      isPromotion: values?.promote,
      incrementList: [
        {
          intIncrementId: !id
            ? 0
            : (location?.state as any)?.singleData?.incrementList?.[0]
                ?.intIncrementId || 0,
          intEmployeeId: values?.employee?.value,
          strEmployeeName: values?.employee?.label,
          intAccountId: orgId,
          intBusinessUnitId: buId,
          strIncrementDependOn: values?.basedOn?.label,
          numIncrementPercentageOrAmount:
            +values?.numIncrementPercentageOrAmount,
          dteEffectiveDate: moment(values?.dteEffectiveDate).format(
            "YYYY-MM-DD"
          ),
          isActive: true,
          intCreatedBy: employeeId,
          intWorkplaceGroupId: wgId,
        },
      ],
      transferPromotionObj: values?.promote ? transferPromotionObj : null,
    };
    const gradeBasedPayload = {
      id: id || 0,
      employeeId: values?.employee?.value,
      accountId: orgId,
      businessUnitId: buId,
      isGradeBasedSalary: values?.salaryType?.value === "Grade" ? true : false,
      payScaleId: values?.payscale?.value || values?.payscale,
      slabCount: values?.slabCount?.value || values?.slabCount || 0,
      oldGrossAmount:
        employeeIncrementByIdApi?.data?.oldGrossAmount ||
        employeeInfo?.data[0]?.numNetGrossSalary ||
        0,
      incrementDependOn: "",
      incrementDependOnValue: 0,
      incrementPercentage: 0,
      incrementAmount: 0,
      workPlaceId: wId,
      workPlaceGroupId: wgId,
      effectiveDate: moment(values?.dteEffectiveDate).format("YYYY-MM-DD"),
      rows: modifiedBreakDown,
      actionBy: employeeId,
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `${values?.employee?.label} is eligable for promote, Do you want to promote?`,
      yesAlertFunc: () => {},
      noAlertFunc: () => {
        createIncrement.action({
          urlKey: "CreateEmployeeIncrement",
          method: "post",
          payload: payload,
          toast: true,
          onSuccess: () => {
            history.push(`/compensationAndBenefits/increment`);
          },
        });
      },
    };

    try {
      isPromotionEligibleCheckApi.action({
        urlKey: "IsPromotionEligibleThroughIncrement",
        method: "post",
        payload: payload,
        toast: true,
        onSuccess: (res) => {
          if (res && orgId === 10022) {
            IConfirmModal(confirmObject);
          } else {
            createIncrement.action({
              urlKey:
                values?.salaryType?.value === "Grade" && id
                  ? "UpdateEmployeeIncrement"
                  : values?.salaryType?.value === "Grade"
                  ? "CreateEmployeeIncrementNew"
                  : "CreateEmployeeIncrement",
              method:
                values?.salaryType?.value === "Grade" && id ? "put" : "post",
              payload:
                values?.salaryType?.value === "Grade"
                  ? gradeBasedPayload
                  : payload,
              toast: true,
              onSuccess: () => {
                history.push(`/compensationAndBenefits/increment`);
              },
            });
          }
        },
      });
    } catch (error) {}
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
            disabled={row?.strBasedOn !== "Amount" || row?.isBasicSalary}
          />
        </>
      ),
    },
  ];
  useEffect(() => {
    getPayscale();
    getPayrollGroupDDL();
    getEmployeeInfo();
  }, [wgId, buId, wId, location.state]);
  // for assigned
  useEffect(() => {
    if (id) {
      getEmployeeProfileViewData(
        (location?.state as any)?.singleData?.incrementList?.[0]?.intEmployeeId,

        setEmpBasic,
        setLoading,
        (location?.state as any)?.singleData?.incrementList?.[0]
          ?.intBusinessUnitId,
        (location?.state as any)?.singleData?.incrementList?.[0]
          ?.intWorkplaceGroupId
      );
      //   getAssignedBreakdown();
      form.setFieldsValue({
        // grossAmount: employeeInfo?.data[0]?.numNetGrossSalary,
        // payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
        //   ? undefined
        //   : employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
        // // basedOn: 1,
        // salaryType: employeeInfo?.data[0]?.isGradeBasedSalary
        //   ? "Grade"
        //   : "Non-Grade",

        employee: {
          value: (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,
          label: (location?.state as any)?.singleData?.incrementList?.[0]
            ?.strEmployeeName,
        },
        transferNPromotionType: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.strTransferNpromotionType,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.strTransferNpromotionType,
        },
        effectiveDate: moment(
          (location?.state as any)?.singleData?.transferPromotionObj
            ?.dteEffectiveDate
        ),
        businessUnit: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intBusinessUnitId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.businessUnitName,
        },
        workplaceGroup: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intWorkplaceGroupId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.workplaceGroupName,
        },
        workplace: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intWorkplaceId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.workplaceName,
        },
        department: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intDepartmentId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.departmentName,
        },
        designation: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intDepartmentId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.departmentName,
        },
        supervisor: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intSupervisorId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.supervisorName,
        },
        lineManager: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intLineManagerId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.lineManagerName,
        },
        role: (location?.state as any)?.singleData?.transferPromotionObj
          ?.empTransferNpromotionUserRoleVMList
          ? (
              location?.state as any
            )?.singleData?.transferPromotionObj?.empTransferNpromotionUserRoleVMList.map(
              (item: any) => {
                return {
                  intTransferNpromotionUserRoleId:
                    item?.intTransferNpromotionUserRoleId,
                  intTransferNpromotionId: item?.intTransferNpromotionId,
                  value: item?.intUserRoleId,
                  label: item?.strUserRoleName,
                };
              }
            )
          : [],
        remarks: (location?.state as any)?.singleData?.transferPromotionObj
          ?.strRemarks,
        isRoleExtension: (location?.state as any)?.singleData
          ?.transferPromotionObj?.empTransferNpromotionRoleExtensionVMList
          ?.length
          ? true
          : false,
        basedOn: {
          value:
            (location?.state as any)?.singleData?.incrementList?.[0]
              ?.strIncrementDependOn === "Basic"
              ? 2
              : (location?.state as any)?.singleData?.incrementList?.[0]
                  ?.strIncrementDependOn === "Gross"
              ? 1
              : 3,
          label: (location?.state as any)?.singleData?.incrementList?.[0]
            ?.strIncrementDependOn,
        },
        numIncrementPercentageOrAmount: (location?.state as any)?.singleData
          ?.incrementList?.[0]?.numIncrementPercentageOrAmount,
        dteEffectiveDate: moment(
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.dteEffectiveDate
        ),
        promote:
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intTransferNpromotionReferenceId === 0
            ? false
            : true,
      });

      employeeIncrementByIdApi?.action({
        urlKey: "GetEmployeeIncrementById",
        method: "get",
        params: {
          id: id,
        },
        onSuccess: (res) => {
          const modify = res?.rows?.map((i: any) => {
            return {
              ...i,
              // strBasedOn: i?.isBasicSalary ? "Amount" : "Percentage",
              numAmount: i?.amount,
              numNumberOfPercent: i?.numberOfPercent,
              strBasedOn: i?.dependsOn,
              strDependOn: i?.dependsOn,
              strPayrollElementName: i?.payrollElement,
              //   strSalaryBreakdownTitle: i?.strSalaryBreakdownHeaderTitle,
              //   intSalaryBreakdownHeaderId: i?.intSalaryBreakdownHeaderId,
              //   intSalaryBreakdownRowId: i?.intSalaryBreakdownRowId,
              intPayrollElementTypeId: i?.payrollElementId,
              isBasicSalary: i?.isBasic,
            };
          });
          const newGross = res?.rows?.reduce(
            (acc: any, i: any) => acc + i?.amount,
            0
          );
          form.setFieldsValue({
            grossAmount: newGross,
            payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
              ? undefined
              : employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
            // basedOn: 1,

            dteEffectiveDate: moment(res?.effectiveDate),
            employee: {
              value: (location?.state as any)?.singleData?.incrementList?.[0]
                ?.intEmployeeId,
              label: (location?.state as any)?.singleData?.incrementList?.[0]
                ?.strEmployeeName,
            },
          });

          setRowDto(modify);

          getById?.action({
            urlKey: "GetPayScaleSetupById",
            method: "get",
            params: {
              id: res?.payScaleId,
            },

            onSuccess: (data: any) => {
              form.setFieldsValue({
                salaryType: { value: "Grade", label: "Grade" },
                payscale: res?.payScaleId,
                payscaleJobLevel: {
                  value: data?.jobLevelId,
                  label: data?.jobLevelName,
                },
                payscaleGrade: {
                  value: data?.jobGradeId,
                  label: data?.jobGradeName,
                },
                payscaleClass: {
                  value: data?.jobClassId,
                  label: data?.jobClassName,
                },
                slabCount: {
                  value: res?.slabCount,
                  label: `${
                    res?.slabCount > data?.incrementSlabCount
                      ? "Efficiency"
                      : "Slab"
                  } ${res?.slabCount}`,
                },
              });
              let temp = [];
              for (let i = 0; i <= data?.incrementSlabCount; i++) {
                temp.push({
                  value: i,
                  label: `Slab ${i}`,
                });
              }
              for (
                let i = 1;
                i <= data?.extendedIncrementSlabCount &&
                data?.extendedIncrementSlabCount !== 0;
                i++
              ) {
                temp.push({
                  value: data?.incrementSlabCount + i,
                  label: `Efficiency ${data?.incrementSlabCount + i}`,
                });
              }
              setSlabDDL(temp);

              // calculate_salary_breakdown();
            },
          });
        },
      });
    }
    if (
      (location?.state as any)?.singleData?.transferPromotionObj?.intEmployeeId
    ) {
      getTransferAndPromotionHistoryById(
        orgId,
        (location?.state as any)?.singleData?.transferPromotionObj
          ?.intEmployeeId,
        setHistoryData,
        setLoading,
        buId,
        wgId
      );
      (location?.state as any)?.singleData?.transferPromotionObj &&
        setTransferRowDtoRowDto(
          (location?.state as any)?.singleData?.transferPromotionObj
            ?.empTransferNpromotionRoleExtensionVMList
        );
      setFileId(
        (location?.state as any)?.singleData?.transferPromotionObj
          ?.intAttachementId
      );
    }
  }, [location?.state]);

  useEffect(() => {
    if (employeeInfo?.data[0]?.isGradeBasedSalary && !id) {
      getById?.action({
        urlKey: "GetPayScaleSetupById",
        method: "get",
        params: {
          id: employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
        },

        onSuccess: (res: any) => {
          form.setFieldsValue({
            salaryType: { value: "Grade", label: "Grade" },
            payscale: employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
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

          // calculate_salary_breakdown();
        },
      });
    }
  }, [employeeInfo?.data[0]]);

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
          backButton
          title={`${id ? "Edit" : "Create"} Increment`}
          submitText={`${id ? "Update" : "Save"}`}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3 card-style">
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={employeeDDLApi?.data || []}
              name="employee"
              label="Select Employee"
              disabled={id ? true : false}
              placeholder="Search minimum 2 character"
              onChange={(value, op) => {
                form.setFieldsValue({
                  employee: op,
                });
                getPayscale();
                getEmployeeInfo();

                getEmployeeProfileViewData(
                  value,
                  setEmpBasic,
                  setLoading,
                  buId,
                  wgId
                );
                getTransferAndPromotionHistoryById(
                  orgId,
                  value,
                  setHistoryData,
                  setLoading,
                  buId,
                  wgId
                );
                setRowDto([]);
                getAssignedBreakdown();
              }}
              showSearch
              filterOption={false}
              // notFoundContent={null}
              loading={employeeDDLApi?.loading}
              onSearch={(value) => {
                getEmployee(value);
              }}
              rules={[{ required: true, message: "Employee is required" }]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { employee } = form.getFieldsValue(true);
              return employee?.value ? (
                <Col md={16}>
                  <div className="d-flex flex-column mt-3 pt-1">
                    <p
                      style={{
                        color: gray700,
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {
                        (empBasic as any)?.employeeProfileLandingView
                          ?.strDesignation
                      }
                    </p>
                    <p
                      style={{
                        color: gray700,
                        fontSize: "12px",
                        fontWeight: "400",
                      }}
                    >
                      Designation
                    </p>
                  </div>
                </Col>
              ) : undefined;
            }}
          </Form.Item>

          <Divider
            style={{
              marginBlock: "4px",
              marginTop: "16px",
              fontSize: "14px",
              fontWeight: 600,
            }}
            orientation="left"
          >
            {" "}
            Employee increment log
          </Divider>
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
              const { salaryType, basedOn } = form.getFieldsValue(true);
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
                  {/* <Col md={6} sm={12} xs={24}>
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
                  </Col> */}
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={[
                        { value: 1, label: "Gross" },
                        { value: 2, label: "Basic" },
                        { value: 3, label: "Amount" },
                      ]}
                      name="basedOn"
                      label="Depend On"
                      placeholder="Depend On"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          basedOn: op,
                          basicAmount: undefined,
                          grossAmount: undefined,
                          numIncrementPercentageOrAmount: undefined,
                        });
                        // getBreakDownPolicyElements();
                      }}
                      rules={[
                        { required: true, message: "Depend is required" },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="number"
                      name="numIncrementPercentageOrAmount"
                      label={
                        basedOn?.label === "Amount"
                          ? "Increment Amount"
                          : "Increment percentage (%)"
                      }
                      placeholder=""
                      min={0}
                      rules={[
                        {
                          required:
                            salaryType?.value !== "Grade" ? true : false,
                          message: "required",
                        },
                      ]}
                    />
                  </Col>
                </>
              );
            }}
          </Form.Item>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="dteEffectiveDate"
              label="Effective Date"
              placeholder="Effective Date"
              rules={[
                {
                  required: true,
                  message: "Effective Date is required",
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[10, 2]} className="mb-3"></Row>
        <Row className="mb-2">
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { basedOn, salaryType } = form.getFieldsValue(true);
              if (salaryType?.value !== "Grade" && basedOn?.value === 2) {
                return (
                  <Col md={6} sm={12} xs={24}>
                    {/* <PInput
                      type="number"
                      name="basicAmount"
                      label="Basic"
                      placeholder="Basic"
                      onChange={() => calculate_salary_breakdown()}
                      rules={[
                        {
                          required: basedOn?.value === 2 || basedOn === 2,
                          message: "Basic is required",
                        },
                      ]}
                    /> */}
                  </Col>
                );
              } else
                return salaryType?.value !== "Grade" ? (
                  <Col md={6} sm={12} xs={24}>
                    {/* <PInput
                      type="number"
                      name="grossAmount"
                      label="Gross"
                      placeholder="Gross"
                      onChange={(e: any) => {
                        const accounts = `Cash Pay (${100}%)`;
                        salaryBreakDownCalc();
                        // (values?.bankPay * 100) /
                        //               values?.totalGrossSalary
                        //             )?.toFixed(6)
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 1 || basedOn === 1,
                          message: "Gross is required",
                        },
                      ]}
                    /> */}
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
                        const efficiency =
                          value > getById?.data?.incrementSlabCount
                            ? value % getById?.data?.incrementSlabCount
                            : 0;
                        const actualSlab = value - efficiency;
                        console.log({ actualSlab, efficiency });
                        temp[0].numAmount =
                          (temp[0].baseAmount ||
                            getById?.data?.payScaleElements[0]?.netAmount) +
                          actualSlab * getById?.data?.incrementAmount +
                          efficiency * getById?.data?.extendedIncrementAmount;

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
              const { grossAmount, basicAmount, salaryType } =
                form.getFieldsValue(true);

              return (
                salaryType?.value === "Grade" && (
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
                )
              );
            }}
          </Form.Item>
        </Row>
        {console.log(employeeInfo?.data[0]?.isGradeBasedSalary) as any}
        {rowDto?.length > 0 && employeeInfo?.data[0]?.isGradeBasedSalary ? (
          <DataTable header={header} bordered data={rowDto || []} />
        ) : (
          <NoResult title="No Result Found" para="" />
        )}
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default SingleIncrement;
