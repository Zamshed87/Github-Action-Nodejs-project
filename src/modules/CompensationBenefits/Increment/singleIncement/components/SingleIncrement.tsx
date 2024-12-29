import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { todayDate } from "utility/todayDate";
import { gray700, gray900 } from "utility/customColor";
import { getEmployeeProfileViewData } from "modules/employeeProfile/employeeFeature/helper";
import { getTransferAndPromotionHistoryById } from "../helper";
import moment from "moment";
import IConfirmModal from "common/IConfirmModal";
import Accordion from "../accordion";
import { attachment_action } from "common/api";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton } from "@mui/material";
import pdfIcon from "assets/images/pdfIcon.svg";

import {
  AttachmentOutlined,
  FileUpload,
  SaveAlt,
  VisibilityOutlined,
} from "@mui/icons-material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { setOrganizationDDLFunc } from "modules/roleExtension/ExtensionCreate/helper";
import HistoryTransferTable from "modules/employeeProfile/transferNPromotion/transferNPromotion/components/HistoryTransferTable";
import Loading from "common/loading/Loading";
import { Alert } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import IncrementLetter from "./IncrementLetter";

type TIncrement = unknown;
const SingleIncrement: React.FC<TIncrement> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId, buName, userName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  function roundToDecimals(number = 0, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(number * multiplier) / multiplier;
  }
  // const regex = /^[0-9]*\.?[0-9]*$/;
  const contentRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { id }: any = useParams();
  const history = useHistory();
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // States
  const [, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState<any[]>([]);
  const [transferRowDto, setTransferRowDtoRowDto] = useState<any[]>([]);
  const [slabDDL, setSlabDDL] = useState<any[]>([]);
  const [empBasic, setEmpBasic] = useState([]);
  const [fileId, setFileId] = useState<any>(0);
  const [organizationDDL, setOrganizationDDL] = useState([]);
  const organizationTypeList = [
    {
      label: "Business Unit",
      value: 1,
    },
    {
      label: "Workplace Group",
      value: 2,
    },
    {
      label: "Workplace",
      value: 3,
    },
  ];
  const [historyData, setHistoryData] = useState([]);
  const onRoleAdd = (values: any) => {
    setTransferRowDtoRowDto([
      ...transferRowDto,
      {
        intOrganizationTypeId: +values?.orgType?.value,
        strOrganizationTypeName: values?.orgType?.label,
        intOrganizationReffId: values?.orgName?.value,
        strOrganizationReffName: values?.orgName?.label,
      },
    ]);
  };
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
  const buApi = useApiRequest([]);
  const userRoleApi = useApiRequest([]);
  const workplaceGroupApi = useApiRequest([]);
  const workplaceApi = useApiRequest([]);
  const departmentApi = useApiRequest([]);
  const designationApi = useApiRequest([]);
  const supervisorDDL = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Single Increment";
  }, []);

  const getBU = () => {
    // const { employee } = form.getFieldsValue(true);
    buApi?.action({
      urlKey: "BusinessUnitIdAll",
      method: "GET",
      params: {
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
  };
  const getworkplaceGroup = () => {
    const { businessUnit } = form.getFieldsValue(true);
    workplaceGroupApi?.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: businessUnit?.value || buId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getworkplace = () => {
    const { businessUnit, workplaceGroup } = form.getFieldsValue(true);
    workplaceApi?.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: businessUnit?.value || buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  const getDepartment = () => {
    const { businessUnit, workplaceGroup, workplace } =
      form.getFieldsValue(true);
    departmentApi?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: businessUnit?.value || buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  const getDesignation = () => {
    const { businessUnit, workplaceGroup, workplace } =
      form.getFieldsValue(true);
    designationApi?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: businessUnit?.value || buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getUserRole = () => {
    const { businessUnit } = form.getFieldsValue(true);
    userRoleApi?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        accountId: orgId,
        BusinessUnitId: businessUnit?.value || buId,
        DDLType: "UserRoleDDLWithoutDefault",
        WorkplaceGroupId: wgId,
        intId: 0,
        intWorkplaceId: wId,
        intYear: "",
      },
      // onSuccess: (res) => {
      //   res.forEach((item: any, i: any) => {
      //     res[i].label = item?.strWorkplaceGroup;
      //     res[i].value = item?.intWorkplaceGroupId;
      //   });
      // },
    });
  };
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
    const { salaryType } = form.getFieldsValue(true);

    employeeDDLApi?.action({
      urlKey: "CommonEmployeeforSalaryDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
        isGradeBased: salaryType?.value === "Grade" ? true : false,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const getSupervisor = (value: any) => {
    if (value?.length < 2) return supervisorDDL?.reset();

    supervisorDDL?.action({
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
            basedOn: i?.strBasedOn,
          };
        });
        // form.setFieldsValue({
        //   grossAmount: res[0]?.numNetGrossSalary,
        // });
        if (employeeInfo?.data[0]?.isGradeBasedSalary) {
          const modifyforGrade = [...modify];
          // modifyforGrade[0].strBasedOn = "Amount";
          setRowDto(modifyforGrade);
        } else {
          setRowDto(modify);
          // default_gross_calculation();
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
        res.forEach((item: any, i: any) => {
          res[i].numAmount = roundToDecimals(item?.numAmount || 0);
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
  // image
  const inputFile = useRef<any>(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };
  const submitHandler = async () => {
    const values = form.getFieldsValue(true);
    if (!values?.grossAmount) {
      return toast.warn("Gross Amount is required ");
    }
    if (values?.salaryType?.value !== "Grade" && !values?.basicAmount) {
      return toast.warn("Basic Amount is required ");
    }
    if (
      employeeIncrementByIdApi?.data?.oldGrossAmount > +values?.grossAmount ||
      employeeInfo?.data[0]?.numNetGrossSalary > +values?.grossAmount
    ) {
      return toast.warn("Amount should be greater than previous amount");
    }

    const elementSum = rowDto?.reduce((acc, i) => acc + i?.numAmount, 0);

    if (Math.round(elementSum) !== values?.grossAmount) {
      return toast.warn(
        "Breakdonwn Elements Net Amount Must Be Equal To Gross Amount!!!"
      );
    }
    if (
      values?.basedOn?.value === 2 &&
      (employeeIncrementByIdApi?.data?.oldGrossAmount >
        Math.round(values?.grossAmount) ||
        employeeInfo?.data[0]?.numNetGrossSalary >
          Math.round(values?.grossAmount))
    ) {
      return toast.warn(
        "Net Amount Must Be Greater than Previous Gross Amount!!!"
      );
    }

    const modifiedBreakDown = rowDto?.map((i) => {
      return {
        dependsOn: i?.strBasedOn,
        payrollElementId: i?.intPayrollElementTypeId,
        amount: roundToDecimals(i?.numAmount || 0),
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
      slabCount:
        values?.slabCount?.value === 0
          ? 0
          : values?.slabCount?.value || values?.slabCount || 0,
      oldGrossAmount:
        Math.round(employeeIncrementByIdApi?.data?.oldGrossAmount) ||
        employeeInfo?.data[0]?.numNetGrossSalary ||
        0,
      incrementDependOn:
        values?.salaryType?.value !== "Grade" ? values?.basedOn?.label : "",
      incrementDependOnValue:
        values?.salaryType?.value !== "Grade"
          ? values?.basedOn?.value === 2
            ? values?.basicAmount
            : values?.grossAmount
          : 0,
      incrementPercentage: 0,
      incrementAmount:
        Math.round(values?.grossAmount) -
        (Math.round(employeeIncrementByIdApi?.data?.oldGrossAmount) ||
          Math.round(employeeInfo?.data[0]?.numNetGrossSalary)),
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
    if (orgId === 10022) {
      IConfirmModal(confirmObject);
    } else {
      createIncrement.action({
        urlKey: id ? "UpdateEmployeeIncrement" : "CreateEmployeeIncrementNew",
        method: id ? "put" : "post",
        payload: gradeBasedPayload,
        toast: true,
        onSuccess: () => {
          history.push(`/compensationAndBenefits/increment`);
        },
      });
    }
    // try {
    //   isPromotionEligibleCheckApi.action({
    //     urlKey: "IsPromotionEligibleThroughIncrement",
    //     method: "post",
    //     payload: payload,
    //     toast: values?.salaryType?.value === "Grade" ? false : true,
    //     onSuccess: (res) => {
    //       if (res && orgId === 10022) {
    //         IConfirmModal(confirmObject);
    //       } else {
    //         createIncrement.action({
    //           urlKey:
    //             // values?.salaryType?.value === "Grade" &&
    //             id
    //               ? "UpdateEmployeeIncrement"
    //               : // values?.salaryType?.value === "Grade"
    //                 // ?
    //                 "CreateEmployeeIncrementNew",
    //           // : "CreateEmployeeIncrement",
    //           method:
    //             // values?.salaryType?.value === "Grade" &&
    //             id ? "put" : "post",
    //           payload:
    //             // values?.salaryType?.value === "Grade"
    //             //   ?
    //             gradeBasedPayload,
    //           // : payload,
    //           toast: true,
    //           onSuccess: () => {
    //             history.push(`/compensationAndBenefits/increment`);
    //           },
    //         });
    //       }
    //     },
    //     onError: (res) => {
    //       // if (values?.salaryType?.value === "Grade") {
    //       createIncrement.action({
    //         urlKey:
    //           // values?.salaryType?.value === "Grade" &&
    //           id ? "UpdateEmployeeIncrement" : "CreateEmployeeIncrementNew",
    //         method:
    //           // values?.salaryType?.value === "Grade" &&
    //           id ? "put" : "post",
    //         payload: gradeBasedPayload,
    //         toast: true,
    //         onSuccess: () => {
    //           history.push(`/compensationAndBenefits/increment`);
    //         },
    //       });
    //     },
    //     // },
    //   });
    // } catch (error) {}
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
    if (
      temp[index]?.basedOn === "Amount" ||
      temp[index]?.strBasedOn === "Amount"
    ) {
      temp[index].numAmount = roundToDecimals(e || 0);
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

  const basic_or_grade_calculation = () => {
    let basicAmount = 0;
    const modified_data = [];
    const values = form.getFieldsValue(true);
    // const { basicAmount } = form.getFieldsValue(true);
    if (values?.salaryType?.value === "Grade") {
      basicAmount = rowDto[0]?.numAmount;
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
        amount = roundToDecimals(item.numAmount) || 0; // Use the fixed amount if based on fixed amount
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
      grossAmount: Math.round(total_gross_amount),
    });
    setRowDto(modified_data);
  };
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
  const transferheader: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      // fixed: "left",
    },

    {
      title: "Org Type",
      dataIndex: "strOrganizationTypeName",
    },
    {
      title: "Org Name",
      dataIndex: "strOrganizationReffName",
    },
    {
      width: 20,
      align: "center",
      render: (_: any, rec: any, index: any) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                setTransferRowDtoRowDto((prev) => [
                  ...prev.filter(
                    (prev_item, item_index) => item_index !== index
                  ),
                ]);
              },
            },
          ]}
        />
      ),
    },
  ];
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
            type="text"
            // name={`numAmount_${index}`}
            value={row?.numAmount}
            placeholder="Amount"
            onChange={(e: any) => {
              if (isNaN(e?.target?.value)) {
                return toast.warn("Only numeric value allowed");
              }
              const values = form.getFieldsValue(true);
              if (
                values?.salaryType?.value !== "Grade" &&
                row?.strDependOn !== "Gross" &&
                index === 0
              ) {
                form.setFieldsValue({
                  basicAmount: +e?.target?.value,
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
              updateRowDtoHandler(+e?.target?.value, row, index);
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
  useEffect(() => {
    getPayscale();
    getPayrollGroupDDL();
    getEmployeeInfo();
    getBU();
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
        basedOn:
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.strIncrementDependOn === "Basic"
            ? { value: 2, label: "Basic" }
            : { value: 1, label: "Gross" },

        // basedOn: {
        //   value:
        //     (location?.state as any)?.singleData?.incrementList?.[0]
        //       ?.strIncrementDependOn === "Basic"
        //       ? 2
        //       :
        //       (location?.state as any)?.singleData?.incrementList?.[0]
        //           ?.strIncrementDependOn === "Gross"
        //       ? 1
        //       : 3,
        //   label: (location?.state as any)?.singleData?.incrementList?.[0]
        //     ?.strIncrementDependOn,
        // },
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
              numAmount: roundToDecimals(i?.amount || 0),
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
          // console.log(employeeInfo?.data[0], "here");
          form.setFieldsValue({
            grossAmount: newGross,
            basicAmount:
              (location?.state as any)?.singleData?.incrementList?.[0]
                ?.strIncrementDependOn === "Basic" &&
              res?.incrementDependOnValue,
            payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
              ? undefined
              : res?.salaryBreakDownHeaderId,
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
              for (let i = res?.slabCount; i <= data?.incrementSlabCount; i++) {
                temp.push({
                  value: i,
                  label: `Slab ${i}`,
                });
              }
              for (
                let i = res?.slabCount;
                i <=
                  data?.extendedIncrementSlabCount + data?.incrementSlabCount &&
                data?.extendedIncrementSlabCount !== 0 &&
                res?.slabCount !==
                  data?.extendedIncrementSlabCount + data?.incrementSlabCount;
                i++
              ) {
                if (
                  data?.incrementSlabCount + (i - res?.slabCount + 1) >
                  data?.extendedIncrementSlabCount + data?.incrementSlabCount
                ) {
                  break;
                }

                temp.push({
                  value: data?.incrementSlabCount + (i - res?.slabCount + 1),
                  label: `Efficiency ${
                    data?.incrementSlabCount + (i - res?.slabCount + 1)
                  }`,
                });
              }
              setSlabDDL(temp);

              // basic_or_grade_calculation();
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
    if (!id) {
      employeeInfo?.data[0]?.isGradeBasedSalary &&
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
            for (
              let i = employeeInfo?.data[0]?.intSlabCount;
              i <= res?.incrementSlabCount;
              i++
            ) {
              temp.push({
                value: i,
                label: `Slab ${i}`,
              });
            }
            for (
              let i = employeeInfo?.data[0]?.intSlabCount;
              i <= res?.extendedIncrementSlabCount + res?.incrementSlabCount &&
              res?.extendedIncrementSlabCount !== 0 &&
              employeeInfo?.data[0]?.intSlabCount !==
                res?.extendedIncrementSlabCount + res?.incrementSlabCount;
              i++
            ) {
              if (
                res?.incrementSlabCount +
                  (i - employeeInfo?.data[0]?.intSlabCount + 1) >
                res?.extendedIncrementSlabCount + res?.incrementSlabCount
              ) {
                break;
              }

              temp.push({
                value:
                  res?.incrementSlabCount +
                  (i - employeeInfo?.data[0]?.intSlabCount + 1),
                label: `Efficiency ${
                  res?.incrementSlabCount +
                  (i - employeeInfo?.data[0]?.intSlabCount + 1)
                }`,
              });
            }
            setSlabDDL(temp);

            // basic_or_grade_calculation();
          },
        });
      form.setFieldsValue({
        grossAmount: employeeInfo?.data[0]?.numNetGrossSalary,
      });
      !employeeInfo?.data[0]?.isGradeBasedSalary &&
        form.setFieldsValue({
          grossAmount: employeeInfo?.data[0]?.numNetGrossSalary,
          basicAmount: employeeInfo?.data[0]?.numBasicORGross,
          payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
            ? undefined
            : employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
          basedOn:
            employeeInfo?.data[0]?.strDependOn.toLowerCase() === "basic"
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
      getAssignedBreakdown();
    }
  }, [employeeInfo?.data[0]]);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; }@page {size: portrait ! important}}",
    documentTitle: `Increment Letter- ${
      (empBasic as any)?.employeeProfileLandingView?.strEmployeeName
    } ${todayDate()}`,
  });
  return employeeFeature?.isView ? (
    <PForm
      form={form}
      initialValues={{
        transferType: "Cash",
      }}
      onFinish={submitHandler}
    >
      {(employeeIncrementByIdApi?.loading ||
        isPromotionEligibleCheckApi?.loading ||
        employeeDDLApi?.loading ||
        payrollGroupDDL?.loading ||
        assignBreakdownApi?.loading ||
        getById?.loading ||
        employeeInfo?.loading ||
        payscaleApi?.loading ||
        createIncrement?.loading) && <Loading />}
      <PCard>
        <PCardHeader
          backButton
          title={`${
            (location?.state as any)?.viewOnly ? "View" : id ? "Edit" : "Create"
          } Increment`}
          submitText={
            (location?.state as any)?.viewOnly
              ? undefined
              : `${id ? "Update" : "Save"}`
          }
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3 card-style">
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={
                orgId === 3 || orgId === 12
                  ? [
                      { value: "Grade", label: "Grade" },
                      { value: "Non-Grade", label: "Non-Grade" },
                    ]
                  : [
                      { value: "Non-Grade", label: "Non-Grade" },
                      // { value: "Grade", label: "Grade" },
                    ]
              }
              name="salaryType"
              disabled={(location?.state as any)?.viewOnly}
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
                  employee: undefined,
                });
                setRowDto([]);
              }}
              rules={[{ required: true, message: "Salary Type is required" }]}
            />
          </Col>
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
                // getAssignedBreakdown();
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
                <Col md={12}>
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
                        fontSize: "15px",
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
                      disabled={(location?.state as any)?.viewOnly}
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
                      disabled={true}
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
                      }}
                      rules={[
                        { required: true, message: "Based On is required" },
                      ]}
                    />
                  </Col>
                  {/* <Col md={6} sm={12} xs={24}>
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
                  </Col> */}
                  {/* <Col md={6} sm={12} xs={24}>
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
                  </Col> */}
                </>
              );
            }}
          </Form.Item>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="dteEffectiveDate"
              label="Effective Date"
              disabled={(location?.state as any)?.viewOnly}
              placeholder="Effective Date"
              rules={[
                {
                  required: true,
                  message: "Effective Date is required",
                },
              ]}
            />
          </Col>
          {/* 🔥🔥 Hidded the checkbox only If the check box is enabled the complete functionality of promote will work. this part is been hidden according to the instruction from avishek voumik vai. 🔥🔥 */}

          {/* promotion part */}
          {/* <Divider
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
              <PInput
                type="checkbox"
                layout="horizontal"
                name="isPromote"
                onChange={() => {}}
              />
              <span>Promote?</span>
            </div>
          </Divider> */}
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { isPromote, employee, isRoleExtension, orgName, orgType } =
                form.getFieldsValue(true);

              return isPromote ? (
                <>
                  {employee?.value && (
                    <Col md={24}>
                      <h3
                        style={{
                          color: " gray700 !important",
                          fontSize: "16px",
                          lineHeight: "20px",
                          fontWeight: "500",
                        }}
                      >
                        Employee current information
                      </h3>
                    </Col>
                  )}
                  {employee?.value && (
                    <Col md={24}>
                      <Accordion empBasic={empBasic} />
                    </Col>
                  )}
                  <Col md={24} className="my-3">
                    <h3
                      style={{
                        color: " gray700 !important",
                        fontSize: "16px",
                        lineHeight: "20px",
                        fontWeight: "500",
                      }}
                    >
                      Select the employee encouraging type and effective date
                    </h3>
                  </Col>
                  <Col md={6}>
                    <PSelect
                      options={[
                        // { value: "Transfer", label: "Transfer" },
                        { value: "Promotion", label: "Promotion" },
                        // {
                        //   value: "Transfer & Promotion",
                        //   label: "Transfer & Promotion",
                        // },
                      ]}
                      name="transferNPromotionType"
                      label="Select Type"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          transferNPromotionType: op,
                        });
                      }}
                      rules={[
                        { required: isPromote, message: "Type is required" },
                      ]}
                    />
                  </Col>
                  <Col md={6}>
                    <PInput
                      type="date"
                      name="effectiveDate"
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
                  <Col md={24} className="my-3">
                    <h3
                      style={{
                        color: " gray700 !important",
                        fontSize: "16px",
                        lineHeight: "20px",
                        fontWeight: "500",
                      }}
                    >
                      Employee administrative information
                    </h3>
                  </Col>
                  <Col md={6}>
                    <PSelect
                      options={buApi?.data || []}
                      name="businessUnit"
                      label="Business Unit"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          businessUnit: op,
                        });
                        getworkplaceGroup();
                        getUserRole();
                      }}
                      rules={[
                        {
                          required: isPromote,
                          message: "Business Unit is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6}>
                    <PSelect
                      options={workplaceGroupApi?.data || []}
                      name="workplaceGroup"
                      label="Workplace Group"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          workplaceGroup: op,
                        });
                        getworkplace();
                      }}
                      rules={[
                        {
                          required: isPromote,
                          message: "Workplace Group is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6}>
                    <PSelect
                      options={workplaceApi?.data || []}
                      name="workplace"
                      label="Workplace"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          workplace: op,
                        });
                        getDepartment();
                        getDesignation();
                      }}
                      rules={[
                        {
                          required: isPromote,
                          message: "Workplace is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6}>
                    <PSelect
                      options={departmentApi?.data || []}
                      name="department"
                      label="Department"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          department: op,
                        });
                      }}
                      rules={[
                        {
                          required: isPromote,
                          message: "Department is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6}>
                    <PSelect
                      options={designationApi?.data || []}
                      name="designation"
                      label="Designation"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          designation: op,
                        });
                      }}
                      rules={[
                        {
                          required: isPromote,
                          message: "Designation is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      options={supervisorDDL?.data || []}
                      name="supervisor"
                      label="Supervisor"
                      placeholder="Search (min 3 letter)"
                      // disabled={!workplaceGroup?.value}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          supervisor: op,
                        });
                      }}
                      showSearch
                      filterOption={false}
                      // notFoundContent={null}
                      loading={supervisorDDL?.loading}
                      onSearch={(value) => {
                        getSupervisor(value);
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Supervisor is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      options={supervisorDDL?.data || []}
                      name="lineManager"
                      label="Line Manager"
                      placeholder="Search (min 3 letter)"
                      // disabled={!workplaceGroup?.value}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          lineManager: op,
                        });
                      }}
                      showSearch
                      filterOption={false}
                      // notFoundContent={null}
                      loading={supervisorDDL?.loading}
                      onSearch={(value) => {
                        getSupervisor(value);
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Line Manager is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      allowClear
                      mode="multiple"
                      options={userRoleApi?.data || []}
                      name="role"
                      label="Role"
                      placeholder="Search (min 3 letter)"
                      // disabled={!workplaceGroup?.value}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          role: op,
                        });
                      }}
                      loading={userRoleApi?.loading}
                      rules={[
                        {
                          required: true,
                          message: "Role is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PInput
                      type="text"
                      placeholder="Remarks"
                      label="Remarks"
                      name="remarks"
                    />
                  </Col>
                  <Col md={6} sm={24} className="mt-2">
                    <div className="input-main position-group-select">
                      {fileId ? (
                        <>
                          <label className="lebel-bold mr-2">Attachment</label>
                          <VisibilityOutlined
                            sx={{
                              color: "rgba(0, 0, 0, 0.6)",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              dispatch(
                                getDownlloadFileView_Action(
                                  id && !fileId?.globalFileUrlId
                                    ? (location.state as any)?.singleData
                                        ?.transferPromotionObj?.intAttachementId
                                    : fileId?.globalFileUrlId
                                )
                              );
                            }}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      className={fileId ? " mt-0 " : "mt-3"}
                      onClick={onButtonClick}
                      style={{ cursor: "pointer" }}
                      // style={{ cursor: "pointer", position: "relative" }}
                    >
                      <input
                        onChange={(e) => {
                          if (e.target.files?.[0] && employee?.value) {
                            attachment_action(
                              orgId,
                              "TransferNPromotion",
                              31,
                              buId,
                              employee?.value,
                              e.target.files,
                              setLoading
                            )
                              .then((data) => {
                                setFileId(data?.[0]);
                              })
                              .catch((error) => {
                                setFileId("");
                              });
                          }
                        }}
                        type="file"
                        id="file"
                        ref={inputFile}
                        style={{ display: "none" }}
                      />
                      <div style={{ fontSize: "14px" }}>
                        {!fileId ? (
                          <>
                            <FileUpload
                              sx={{
                                marginRight: "5px",
                                fontSize: "18px",
                              }}
                            />{" "}
                            Click to upload
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      {fileId ? (
                        <div className="d-flex align-items-center">
                          <AttachmentOutlined
                            sx={{
                              marginRight: "5px",
                              color: "#0072E5",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#0072E5",
                              cursor: "pointer",
                            }}
                          >
                            {fileId?.fileName || "Attachment"}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Col>
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
                      <PInput
                        type="checkbox"
                        layout="horizontal"
                        name="isRoleExtension"
                        onChange={() => {}}
                      />
                      <span>
                        {" "}
                        Is this employee applicable for role extension?
                      </span>
                    </div>
                  </Divider>
                  {isRoleExtension && (
                    <Col md={6} sm={24} className="mt-2">
                      <PSelect
                        options={organizationTypeList}
                        name="orgType"
                        label="Organization Type"
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            orgType: op,
                          });
                          // console.log({ op });
                          setOrganizationDDLFunc(
                            orgId,
                            wgId,
                            buId,
                            employeeId,
                            op,
                            setOrganizationDDL
                          );
                        }}
                        // rules={[
                        //   {
                        //     required: isPromote,
                        //     message: "Organization Type is required",
                        //   },
                        // ]}
                      />
                    </Col>
                  )}
                  {isRoleExtension && (
                    <Col md={6} sm={24} className="mt-2">
                      <PSelect
                        options={organizationDDL || []}
                        name="orgName"
                        label="Organization Name"
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            orgName: op,
                          });
                        }}
                        // rules={[
                        //   {
                        //     required: isPromote,
                        //     message: "Organization Type is required",
                        //   },
                        // ]}
                      />
                    </Col>
                  )}
                  {isRoleExtension && (
                    <Col md={6} sm={24} className="mt-4 pt-1">
                      <PButton
                        type="primary"
                        action="button"
                        content="View"
                        onClick={() => {
                          const roleExist = transferRowDto?.some(
                            (item) =>
                              item?.intOrganizationTypeId === orgType?.value &&
                              item?.intOrganizationReffId === orgName?.value
                          );

                          if (roleExist)
                            return toast.warn("Already extis this role");
                          onRoleAdd(form.getFieldsValue(true));

                          form.setFieldsValue({
                            orgType: undefined,
                            orgName: undefined,
                          });
                        }}
                      />
                    </Col>
                  )}
                  {isRoleExtension && (
                    <Divider
                      style={{
                        marginBlock: "4px",
                        marginTop: "6px",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                      orientation="left"
                    >
                      Role Extension List
                    </Divider>
                  )}
                  {isRoleExtension && transferRowDto?.length > 0 ? (
                    <Col md={12} sm={24} className="mt-2">
                      <DataTable
                        header={transferheader}
                        bordered
                        data={transferRowDto || []}
                      />
                    </Col>
                  ) : null}

                  <Divider
                    style={{
                      marginBlock: "4px",
                      marginTop: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    orientation="left"
                  >
                    History of transfers and promotions
                  </Divider>
                  {historyData.length > 0 ? (
                    <Col md={24} sm={24} className="mt-2">
                      <HistoryTransferTable historyData={historyData} />
                    </Col>
                  ) : (
                    <NoResult
                      title={"No Transfer And Promotion History Found"}
                    />
                  )}
                </>
              ) : undefined;
            }}
          </Form.Item>
        </Row>
        <Row gutter={[10, 2]} className="mb-3">
          {(location?.state as any)?.singleData?.incrementList[0]?.strStatus ===
            "Approved By Admin" &&
            orgId === 5 && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  reactToPrintFn();
                }}
                style={{
                  height: "32px",
                  width: "199px",
                  boxSizing: "border-box",
                  border: " 1px solid #EAECF0",
                  borderRadius: "4px",
                }}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <img
                      className="pb-1"
                      style={{ width: "23px", height: "23px" }}
                      src={pdfIcon}
                      alt=""
                    />
                  </div>
                  <p
                    style={{
                      color: "#344054",
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                    className="pl-2"
                  >
                    Increment Letter
                  </p>
                </div>
                <div>
                  <SaveAlt
                    sx={{
                      color: gray900,
                      fontSize: "16px",
                    }}
                  />
                </div>
              </IconButton>
            )}
        </Row>

        {/* calculation rows */}
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
                      // name="basicAmount"
                      value={basicAmount}
                      disabled={(location?.state as any)?.viewOnly}
                      label={
                        <span>
                          <span className="text-danger ">* </span> Basic{" "}
                        </span>
                      }
                      placeholder="Basic"
                      onChange={(e: any) => {
                        if (isNaN(e?.target?.value)) {
                          return toast.warn("Only numeric value allowed");
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
                      disabled={(location?.state as any)?.viewOnly}
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
                          // if (
                          //   employeeIncrementByIdApi?.data?.oldGrossAmount >
                          //     +e?.target?.value ||
                          //   employeeInfo?.data[0]?.numNetGrossSalary >
                          //     +e?.target?.value
                          // ) {
                          //   return toast.warn(
                          //     "Amount should be greater than previous amount"
                          //   );
                          // }
                          form.setFieldsValue({
                            grossAmount: +e?.target?.value,
                          });
                          new_gross_calculation();
                        }

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
                    />
                  </Col>
                ) : salaryType?.value == "Grade" ? (
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={slabDDL}
                      name="slabCount"
                      disabled={(location?.state as any)?.viewOnly}
                      label="Slab Count"
                      placeholder="Slab Count"
                      onChange={(value, op) => {
                        let temp = [...rowDto];
                        const efficiency =
                          value > getById?.data?.incrementSlabCount
                            ? value % getById?.data?.incrementSlabCount
                            : 0;
                        const actualSlab = value - efficiency;
                        // console.log({ actualSlab, efficiency });
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
            console.log({ elementSum }, { grossAmount });
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
                        Amount{" "}
                        {roundToDecimals(Math.abs(elementSum - grossAmount))}
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
        ) : (
          <NoResult title="No Result Found" para="" />
        )}
      </PCard>
      <div className="d-none">
        {/* {console.log(empBasic) as any} */}
        {/* {
          console.log(
            (location?.state as any)?.singleData?.incrementList[0]
          ) as any
        } */}
        <div
          ref={contentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            margin: "80px 0",
          }}
        >
          <IncrementLetter
            orgId={orgId}
            empBasic={empBasic}
            buName={buName}
            employeeIncrementByIdApi={employeeIncrementByIdApi}
            form={form}
            rowDto={rowDto}
          />
        </div>
      </div>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default SingleIncrement;
