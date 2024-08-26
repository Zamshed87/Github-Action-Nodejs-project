import {
  AttachmentOutlined,
  DeleteOutlined,
  FileUpload,
  VisibilityOutlined,
} from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  attachment_action,
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
  PeopleDeskSaasDDL,
} from "../../../../../common/api";
import BackButton from "../../../../../common/BackButton";
import DefaultInput from "../../../../../common/DefaultInput";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikSelect from "../../../../../common/FormikSelect";
import IConfirmModal from "../../../../../common/IConfirmModal";
import NoResult from "../../../../../common/NoResult";
import PrimaryButton from "../../../../../common/PrimaryButton";
import ResetButton from "../../../../../common/ResetButton";
import SortingIcon from "../../../../../common/SortingIcon";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import {
  gray600,
  gray700,
  gray900,
  greenColor,
  success500,
} from "../../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import { getEmployeeProfileViewData } from "../../../../employeeProfile/employeeFeature/helper";
import HistoryTransferTable from "../../../../employeeProfile/transferNPromotion/transferNPromotion/components/HistoryTransferTable";
import { getTransferAndPromotionHistoryById } from "../../../../employeeProfile/transferNPromotion/transferNPromotion/helper";
import { setOrganizationDDLFunc } from "../../../../roleExtension/ExtensionCreate/helper";
import Accordion from "../accordion";
import { addEditIncrementAndPromotion } from "../helper";
import AsyncFormikSelect from "../../../../../common/AsyncFormikSelect";

const initialValues = {
  employee: "",
  transferNPromotionType: { value: "Promotion", label: "Promotion" },
  effectiveDate: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  department: "",
  designation: "",
  supervisor: "",
  lineManager: "",
  role: "",
  isRoleExtension: false,
  orgType: "",
  orgName: "",
  remarks: "",
  dependOn: "",
  incrementPercentage: "",
  incrementEffectiveDate: "",
  promote: false,
};

export const organizationTypeList = [
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

const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  dependOn: Yup.object()
    .shape({
      label: Yup.string().required("Increment Type is required"),
      value: Yup.string().required("Increment Type is required"),
    })
    .typeError("Transfer And Promotion Type is required"),
  incrementEffectiveDate: Yup.string().required("Effective date is required"),
  incrementPercentage: Yup.string().required(
    "Increment Percentage/Amount is required"
  ),
});

function CreateSingleIncrement() {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const modifiedData = {
    employee: {
      value: state?.singleData?.incrementList?.[0]?.intEmployeeId,
      label: state?.singleData?.incrementList?.[0]?.strEmployeeName,
    },
    transferNPromotionType: {
      value: state?.singleData?.transferPromotionObj?.strTransferNpromotionType,
      label: state?.singleData?.transferPromotionObj?.strTransferNpromotionType,
    },
    effectiveDate: dateFormatterForInput(
      state?.singleData?.transferPromotionObj?.dteEffectiveDate
    ),
    businessUnit: {
      value: state?.singleData?.transferPromotionObj?.intBusinessUnitId,
      label: state?.singleData?.transferPromotionObj?.businessUnitName,
    },
    workplaceGroup: {
      value: state?.singleData?.transferPromotionObj?.intWorkplaceGroupId,
      label: state?.singleData?.transferPromotionObj?.workplaceGroupName,
    },
    workplace: {
      value: state?.singleData?.transferPromotionObj?.intWorkplaceId,
      label: state?.singleData?.transferPromotionObj?.workplaceName,
    },
    department: {
      value: state?.singleData?.transferPromotionObj?.intDepartmentId,
      label: state?.singleData?.transferPromotionObj?.departmentName,
    },
    designation: {
      value: state?.singleData?.transferPromotionObj?.intDepartmentId,
      label: state?.singleData?.transferPromotionObj?.departmentName,
    },
    supervisor: {
      value: state?.singleData?.transferPromotionObj?.intSupervisorId,
      label: state?.singleData?.transferPromotionObj?.supervisorName,
    },
    lineManager: {
      value: state?.singleData?.transferPromotionObj?.intLineManagerId,
      label: state?.singleData?.transferPromotionObj?.lineManagerName,
    },
    role: state?.singleData?.transferPromotionObj
      ?.empTransferNpromotionUserRoleVMList
      ? state?.singleData?.transferPromotionObj?.empTransferNpromotionUserRoleVMList.map(
          (item) => {
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
    remarks: state?.singleData?.transferPromotionObj?.strRemarks,
    isRoleExtension: state?.singleData?.transferPromotionObj
      ?.empTransferNpromotionRoleExtensionVMList?.length
      ? true
      : false,
    dependOn: {
      value: state?.singleData?.incrementList?.[0]?.strIncrementDependOn,
      label: state?.singleData?.incrementList?.[0]?.strIncrementDependOn,
    },
    incrementPercentage:
      state?.singleData?.incrementList?.[0]?.numIncrementPercentageOrAmount,
    incrementEffectiveDate: dateFormatterForInput(
      state?.singleData?.incrementList?.[0]?.dteEffectiveDate
    ),
    promote:
      state?.singleData?.incrementList?.[0]
        ?.intTransferNpromotionReferenceId === 0
        ? false
        : true,
  };

  const {
    setFieldValue,
    setValues,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: !id ? initialValues : modifiedData,
    onSubmit: (values) => saveHandler(values),
  });

  //states
  const [fileId, setFileId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  // DDL states
  const [empBasic, setEmpBasic] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [supNLineManagerDDL, setSupNLineManagerDDL] = useState([]);
  const [userRoleDDL, setUserRoleDDL] = useState([]);
  const [organizationDDL, setOrganizationDDL] = useState([]);

  //  states
  const [orgTypeOrder, setOrgTypeOrder] = useState("desc");
  const [orgOrder, setOrgOrder] = useState("desc");

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
  }, [employeeId, orgId, buId, wgId]);

  useEffect(() => {
    if (id) {
      getEmployeeProfileViewData(
        state?.singleData?.incrementList?.[0]?.intEmployeeId,
        setEmpBasic,
        setLoading,
        state?.singleData?.incrementList?.[0]?.intBusinessUnitId,
        state?.singleData?.incrementList?.[0]?.intWorkplaceGroupId
      );
    }
  }, [id, state]);

  useEffect(() => {
    if (id && state?.singleData?.transferPromotionObj?.intEmployeeId) {
      getTransferAndPromotionHistoryById(
        orgId,
        state?.singleData?.transferPromotionObj?.intEmployeeId,
        setHistoryData,
        setLoading,
        buId,
        wgId
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${state?.singleData?.incrementList?.[0]?.intWorkplaceGroupId}&BusinessUnitId=${state?.singleData?.transferPromotionObj?.intBusinessUnitId}&intId=${employeeId}`,
        "intWorkplaceGroupId",
        "strWorkplaceGroup",
        setWorkplaceGroupDDL
      );
      PeopleDeskSaasDDL(
        "UserRoleDDLWithoutDefault",
        wgId,
        state?.singleData?.transferPromotionObj?.intBusinessUnitId,
        setUserRoleDDL,
        "value",
        "label",
        0
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&WorkplaceGroupId=${state?.singleData?.incrementList?.[0]?.intWorkplaceGroupId}&BusinessUnitId=${state?.singleData?.transferPromotionObj?.intBusinessUnitId}`,
        "DepartmentId",
        "DepartmentName",
        setDepartmentDDL
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&WorkplaceGroupId=${state?.singleData?.incrementList?.[0]?.intWorkplaceGroupId}&BusinessUnitId=${state?.singleData?.transferPromotionObj?.intBusinessUnitId}`,
        "DesignationId",
        "DesignationName",
        setDesignationDDL
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&WorkplaceGroupId=${state?.singleData?.incrementList?.[0]?.intWorkplaceGroupId}&BusinessUnitId=${state?.singleData?.transferPromotionObj?.intBusinessUnitId}`,
        "EmployeeId",
        "EmployeeName",
        setSupNLineManagerDDL
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${state?.singleData?.transferPromotionObj?.intBusinessUnitId}&WorkplaceGroupId=${state?.singleData?.transferPromotionObj?.intWorkplaceGroupId}&intId=${employeeId}`,
        "intWorkplaceId",
        "strWorkplace",
        setWorkplaceDDL
      );

      state?.singleData?.transferPromotionObj &&
        setRowDto(
          state?.singleData?.transferPromotionObj
            ?.empTransferNpromotionRoleExtensionVMList
        );
      setFileId(state?.singleData?.transferPromotionObj?.intAttachementId);
    }
  }, [id, state, employeeId, orgId, wgId, buId]);

  // image
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      // eslint-disable-next-line no-unused-vars
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };

  const onRoleAdd = (values) => {
    setRowDto([
      ...rowDto,
      {
        intOrganizationTypeId: +values?.orgType?.value,
        strOrganizationTypeName: values?.orgType?.label,
        intOrganizationReffId: values?.orgName?.value,
        strOrganizationReffName: values?.orgName?.label,
      },
    ]);
  };

  const saveHandler = async (values) => {
    const getRoleNameList =
      values?.role &&
      values?.role.map((item) => {
        return {
          intRoleExtensionRowId: 0,
          intTransferNpromotionId: !id
            ? 0
            : state?.singleData?.transferPromotionObj
                ?.intTransferNpromotionId || 0,
          intUserRoleId: item?.value,
          strUserRoleName: item?.label,
        };
      });

    const roleExtensionList =
      !!rowDto?.length &&
      rowDto.map((item) => {
        return {
          intRoleExtensionRowId: 0,
          intTransferNpromotionId: !id
            ? 0
            : state?.singleData?.transferPromotionObj
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
        : state?.singleData?.transferPromotionObj?.intTransferNpromotionId,
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
        id && !fileId?.globalFileUrlId ? fileId : fileId?.globalFileUrlId || 0,
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
            : state?.singleData?.incrementList?.[0]?.intIncrementId || 0,
          intEmployeeId: values?.employee?.value,
          strEmployeeName: values?.employee?.label,
          intAccountId: orgId,
          intBusinessUnitId: buId,
          strIncrementDependOn: values?.dependOn?.label,
          numIncrementPercentageOrAmount: +values?.incrementPercentage,
          dteEffectiveDate: values?.incrementEffectiveDate,
          isActive: true,
          intCreatedBy: employeeId,
          intWorkplaceGroupId: wgId,
        },
      ],
      transferPromotionObj: values?.promote ? transferPromotionObj : null,
    };
    const callBack = () => {
      history.push("/compensationAndBenefits/increment");
    };

    const confirmObject = {
      closeOnClickOutside: false,
      message: `${values?.employee?.label} is eligable for promote, Do you want to promote?`,
      yesAlertFunc: () => {},
      noAlertFunc: () => {
        addEditIncrementAndPromotion(payload, callBack, setLoading);
      },
    };

    try {
      const res = await axios.post(
        `/Employee/IsPromotionEligibleThroughIncrement`,
        payload
      );
      if (res?.data && orgId === 10022) {
        IConfirmModal(confirmObject);
      } else {
        addEditIncrementAndPromotion(payload, callBack, setLoading);
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <div className="table-card pb-2">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton
                title={`${!id ? "Create Increment" : "Edit Increment"}`}
              />
            </div>
            <div className="table-card-head-right">
              <ul>
                <li>
                  <PrimaryButton
                    className="btn btn-green btn-green-disable"
                    type="submit"
                    label="Save"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="table-card-body">
          <div className="card-style" style={{ minHeight: "70vh" }}>
            <div className="row">
              {/* first row */}
              <div className="col-lg-3 pt-3">
                <div className="d-flex align-items-center justify-content-between input-field-main">
                  <label>Select Employee</label>
                  {values?.employee && !id && (
                    <ResetButton
                      classes="btn-filter-reset w-50 mt-0 pt-0"
                      title="Reset Employee"
                      icon={
                        <RefreshIcon
                          sx={{
                            marginRight: "4px",
                            fontSize: "12px",
                          }}
                        />
                      }
                      onClick={() => {
                        resetForm(initialValues);
                        setRowDto([]);
                        setHistoryData([]);
                        setEmpBasic([]);
                      }}
                      styles={{ height: "auto", fontSize: "12px" }}
                    />
                  )}
                </div>
                {/* <FormikSelect
                  menuPosition="fixed"
                  name="employee"
                  options={employeeDDL || []}
                  value={values?.employee}
                  onChange={(valueOption) => {
                    setValues((prev) => ({
                      ...prev,
                      employee: valueOption,
                    }));
                    setRowDto([]);
                    setHistoryData([]);
                    getEmployeeProfileViewData(
                      valueOption?.value,
                      setEmpBasic,
                      setLoading,
                      buId,
                      wgId
                    );
                    getTransferAndPromotionHistoryById(
                      orgId,
                      valueOption?.value,
                      setHistoryData,
                      setLoading,
                      buId,
                      wgId
                    );
                  }}
                  styles={customStyles}
                  errors={errors}
                  placeholder=""
                  touched={touched}
                  isDisabled={values?.employee}
                /> */}
                <AsyncFormikSelect
                  selectedValue={values?.employee}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setValues((prev) => ({
                      ...prev,
                      employee: valueOption,
                    }));
                    setRowDto([]);
                    setHistoryData([]);
                    getEmployeeProfileViewData(
                      valueOption?.value,
                      setEmpBasic,
                      setLoading,
                      buId,
                      wgId
                    );
                    getTransferAndPromotionHistoryById(
                      orgId,
                      valueOption?.value,
                      setHistoryData,
                      setLoading,
                      buId,
                      wgId
                    );
                  }}
                  placeholder="Search (min 3 letter)"
                  loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                  isDisabled={values?.employee}
                />
              </div>

              <div className="col-lg-3 pt-2">
                <>
                  {values?.employee && (
                    <div className="d-flex flex-column mt-3 pt-1">
                      <p
                        style={{
                          color: gray700,
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {empBasic?.employeeProfileLandingView?.strDesignation}
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
                  )}
                </>
              </div>

              <div className="col-lg-6"></div>
              {/* first row end */}

              <div className="col-lg-12 my-2">
                <h3
                  style={{
                    color: " gray700 !important",
                    fontSize: "16px",
                    lineHeight: "20px",
                    fontWeight: "500",
                  }}
                >
                  Employee increment log
                </h3>
              </div>

              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Depend On</label>
                  <FormikSelect
                    name="dependOn"
                    options={[
                      { value: "Basic", label: "Basic" },
                      { value: "Gross", label: "Gross" },
                      { value: "Amount", label: "Amount" },
                    ]}
                    value={values?.dependOn}
                    onChange={(valueOption) => {
                      setValues((prev) => ({
                        ...prev,
                        dependOn: valueOption,
                      }));
                    }}
                    placeholder=""
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="input-field-main">
                  <label>
                    {values?.dependOn?.value === "Amount"
                      ? "Increment Amount"
                      : "Increment percentage (%)"}
                  </label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.incrementPercentage}
                    placeholder=""
                    name="incrementPercentage"
                    type="number"
                    className="form-control"
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        incrementPercentage: e.target.value,
                      }));
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Effective Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.incrementEffectiveDate}
                    placeholder=""
                    name="incrementEffectiveDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        incrementEffectiveDate: e.target.value,
                      }));
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              {/* 🔥🔥 Hidded the checkbox only If the check box is enabled the complete functionality of promote will work. this part is been hidden according to the instruction from avishek voumik vai. 🔥🔥 */}

              {/* <div className="col-lg-12 my-2">
                <h3
                  style={{
                    color: " gray700 !important",
                    fontSize: "16px",
                    lineHeight: "20px",
                    fontWeight: "500",
                  }}
                >
                  Do you want to promote this employee?
                </h3>
              </div>

              <div className="col-lg-3">
                <FormikCheckBox
                  height="15px"
                  styleobj={{
                    color: gray900,
                    checkedColor: greenColor,
                    padding: "0px 0px 0px 5px",
                  }}
                  label="Promote"
                  name="promote"
                  checked={values?.promote}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      promote: e.target.checked,
                    }));
                  }}
                />
              </div> */}
              {/* promotion part start */}
              {values?.promote && (
                <>
                  {values?.employee && (
                    <>
                      <div className="col-lg-12 my-2">
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
                      </div>
                      <div className="col-lg-12">
                        <Accordion empBasic={empBasic} />
                      </div>
                    </>
                  )}
                  {/* second row start */}
                  <div className="col-lg-12 my-2">
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
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Type</label>
                      <FormikSelect
                        name="transferNPromotionType"
                        options={[
                          // { value: "Transfer", label: "Transfer" },
                          { value: "Promotion", label: "Promotion" },
                          // {
                          //   value: "Transfer & Promotion",
                          //   label: "Transfer & Promotion",
                          // },
                        ]}
                        value={values?.transferNPromotionType}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            transferNPromotionType: valueOption,
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Effective Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.effectiveDate}
                        placeholder=""
                        name="effectiveDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            effectiveDate: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6"></div>
                  {/* second row end */}
                  <div className="col-lg-12 my-2">
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
                  </div>
                  {/* third row start */}
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Business Unit</label>
                      <FormikSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${valueOption?.value}&intId=${employeeId}`,
                            "intWorkplaceGroupId",
                            "strWorkplaceGroup",
                            setWorkplaceGroupDDL
                          );
                          PeopleDeskSaasDDL(
                            "UserRoleDDLWithoutDefault",
                            wgId,
                            valueOption?.value,
                            setUserRoleDDL,
                            "value",
                            "label",
                            0
                          );
                          // getPeopleDeskAllDDL(
                          //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${valueOption?.value}`,
                          //   "DepartmentId",
                          //   "DepartmentName",
                          //   setDepartmentDDL
                          // );
                          // getPeopleDeskAllDDL(
                          //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${valueOption?.value}`,
                          //   "DesignationId",
                          //   "DesignationName",
                          //   setDesignationDDL
                          // );
                          // getPeopleDeskAllDDL(
                          //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation_All&BusinessUnitId=${
                          //     valueOption?.value
                          //   }&WorkplaceGroupId=${
                          //     wgId || values?.workplaceGroup?.value
                          //   }&intWorkplaceId=${wId || 0}`,
                          //   "DesignationId",
                          //   "DesignationName",
                          //   setDesignationDDL
                          // );
                          // getPeopleDeskAllDDL(
                          //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${valueOption?.value}`,
                          //   "EmployeeId",
                          //   "EmployeeName",
                          //   setSupNLineManagerDDL
                          // );
                          setValues((prev) => ({
                            ...prev,
                            businessUnit: valueOption,
                            workplaceGroup: "",
                            workplace: "",
                            department: "",
                            designation: "",
                            supervisor: "",
                            lineManager: "",
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Workplace Group</label>
                      <FormikSelect
                        name="workplaceGroup"
                        options={workplaceGroupDDL || []}
                        value={values?.workplaceGroup}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            workplaceGroup: valueOption,
                            workplace: "",
                            department: "",
                            designation: "",
                            supervisor: "",
                            lineManager: "",
                          }));
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&WorkplaceGroupId=${valueOption?.value}&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                            "intWorkplaceId",
                            "strWorkplace",
                            setWorkplaceDDL
                          );
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.businessUnit}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Workplace</label>
                      <FormikSelect
                        name="workplace"
                        options={workplaceDDL || []}
                        value={values?.workplace}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            workplace: valueOption,
                            department: "",
                            designation: "",
                            supervisor: "",
                            lineManager: "",
                          }));
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment_All&BusinessUnitId=${
                              values?.businessUnit?.value
                            }&WorkplaceGroupId=${
                              values?.workplaceGroup?.value || wgId
                            }&intWorkplaceId=${valueOption?.value || 0}`,
                            "DepartmentId",
                            "DepartmentName",
                            setDepartmentDDL
                          );
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation_All&BusinessUnitId=${
                              values?.businessUnit?.value
                            }&WorkplaceGroupId=${
                              values?.workplaceGroup?.value
                            }&intWorkplaceId=${valueOption?.value || 0}`,
                            "DesignationId",
                            "DesignationName",
                            setDesignationDDL
                          );
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.workplaceGroup}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Department</label>
                      <FormikSelect
                        name="department"
                        options={departmentDDL || []}
                        value={values?.department}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            department: valueOption,
                            designation: "",
                            supervisor: "",
                            lineManager: "",
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.businessUnit}
                      />
                    </div>
                  </div>
                  {/* third row end  */}
                  {/* fourth row start  */}
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Designation</label>
                      <FormikSelect
                        name="designation"
                        placeholder=""
                        value={values?.designation}
                        options={designationDDL || []}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            designation: valueOption,
                            supervisor: "",
                            lineManager: "",
                          }));
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.businessUnit}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Supervisor</label>
                      <AsyncFormikSelect
                        selectedValue={values?.supervisor}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            supervisor: valueOption,
                          }));
                        }}
                        placeholder="Search (min 3 letter)"
                        loadOptions={(v) =>
                          getSearchEmployeeList(
                            buId,
                            values?.workplaceGroup?.value || 0,
                            v
                          )
                        }
                        isDisabled={!values?.workplaceGroup}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Line Manager</label>
                      <AsyncFormikSelect
                        selectedValue={values?.lineManager}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            lineManager: valueOption,
                          }));
                        }}
                        placeholder="Search (min 3 letter)"
                        loadOptions={(v) =>
                          getSearchEmployeeList(
                            buId,
                            values?.workplaceGroup?.value || 0,
                            v
                          )
                        }
                        isDisabled={!values?.workplaceGroup}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Role</label>
                      <FormikSelect
                        name="role"
                        placeholder=""
                        styles={{
                          ...customStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "auto",
                            height:
                              values?.businessUnit?.length > 2
                                ? "auto"
                                : "30px",
                            borderRadius: "4px",
                            boxShadow: `${success500}!important`,
                            ":hover": {
                              borderColor: `${gray600}!important`,
                            },
                            ":focus": {
                              borderColor: `${gray600}!important`,
                            },
                          }),
                          valueContainer: (provided, state) => ({
                            ...provided,
                            height:
                              values?.businessUnit?.length > 2
                                ? "auto"
                                : "30px",
                            padding: "0 6px",
                          }),
                          multiValue: (styles) => {
                            return {
                              ...styles,
                              position: "relative",
                              top: "-1px",
                            };
                          },
                          multiValueLabel: (styles) => ({
                            ...styles,
                            padding: "0",
                            position: "relative",
                            top: "-1px",
                          }),
                        }}
                        value={values?.role}
                        options={userRoleDDL || []}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            role: valueOption,
                          }));
                        }}
                        isMulti
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.businessUnit}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Remarks</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.remarks}
                        placeholder=""
                        name="remarks"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            remarks: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  {/* fourth row end  */}
                  {/* fifth row start  */}
                  <div className="col-2 mt-3">
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
                                    ? state?.singleData?.transferPromotionObj
                                        ?.intAttachementId
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
                          if (e.target.files?.[0] && values?.employee?.value) {
                            attachment_action(
                              orgId,
                              "TransferNPromotion",
                              31,
                              buId,
                              values?.employee?.value,
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
                  </div>
                  <div className="col-4"></div>
                  {/* fifth row end  */}
                  <div className="col-lg-12 mb-2 mt-3">
                    <h3
                      style={{
                        color: " gray700 !important",
                        fontSize: "16px",
                        lineHeight: "20px",
                        fontWeight: "500",
                      }}
                    >
                      Is this employee applicable for role extension
                    </h3>
                  </div>
                  {/* sixth row start */}
                  <div className="col-lg-3">
                    <FormikCheckBox
                      height="15px"
                      styleobj={{
                        color: gray900,
                        checkedColor: greenColor,
                        padding: "0px 0px 0px 5px",
                      }}
                      label="Role Extension"
                      name="isRoleExtension"
                      checked={values?.isRoleExtension}
                      onChange={(e) => {
                        setValues((prev) => ({
                          ...prev,
                          isRoleExtension: e.target.checked,
                        }));
                      }}
                    />
                  </div>
                  <div className="col-lg-9"></div>
                  {/* sixth row end */}
                  {/* User  role extension start */}
                  {values?.isRoleExtension && (
                    <>
                      <div className="col-md-3">
                        <div className="input-field-main">
                          <label>Organization Type</label>
                          <FormikSelect
                            name="orgType"
                            placeholder=""
                            options={organizationTypeList || []}
                            value={values?.orgType}
                            onChange={(valueOption) => {
                              setValues((prev) => ({
                                ...prev,
                                orgType: valueOption,
                                orgName: "",
                              }));
                              setOrganizationDDLFunc(
                                orgId,
                                buId,
                                employeeId,
                                valueOption,
                                setOrganizationDDL
                              );
                            }}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="input-field-main">
                          <label>Organization Name</label>
                          <FormikSelect
                            name="orgName"
                            placeholder=""
                            options={organizationDDL || []}
                            value={values?.orgName}
                            onChange={(valueOption) => {
                              setValues((prev) => ({
                                ...prev,
                                orgName: valueOption,
                              }));
                            }}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-md-1">
                        <button
                          disabled={
                            !values?.employee ||
                            !values?.orgName ||
                            !values?.orgType
                          }
                          className="btn btn-green"
                          style={{ marginTop: "23px" }}
                          type="button"
                          onClick={() => {
                            const roleExist = rowDto?.some(
                              (item) =>
                                item?.intOrganizationTypeId ===
                                  values?.orgType?.value &&
                                item?.intOrganizationReffId ===
                                  values?.orgName?.value
                            );

                            if (roleExist)
                              return toast.warn("Already extis this role");
                            onRoleAdd(values);
                            setFieldValue("orgType", "");
                            setFieldValue("orgName", "");
                          }}
                        >
                          Add
                        </button>
                      </div>
                      {!!rowDto?.length > 0 && (
                        <>
                          <div className="col-lg-12 mb-2 mt-3">
                            <h3
                              style={{
                                color: " gray700 !important",
                                fontSize: "16px",
                                lineHeight: "20px",
                                fontWeight: "500",
                              }}
                            >
                              Role Extension List
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <div className="table-card-body">
                              <div className="table-card-styled tableOne">
                                <table className="table">
                                  <thead>
                                    <tr className="py-1">
                                      <th>SL</th>
                                      <th>
                                        <div
                                          onClick={(e) => {
                                            setOrgTypeOrder(
                                              orgTypeOrder === "desc"
                                                ? "asc"
                                                : "desc"
                                            );
                                            commonSortByFilter(
                                              orgTypeOrder,
                                              "strOrganizationTypeName"
                                            );
                                          }}
                                          className="sortable"
                                        >
                                          <span className="mr-1">
                                            {" "}
                                            Org Type
                                          </span>
                                          <SortingIcon
                                            viewOrder={orgTypeOrder}
                                          />
                                        </div>
                                      </th>
                                      <th>
                                        <div
                                          onClick={(e) => {
                                            setOrgOrder(
                                              orgOrder === "desc"
                                                ? "asc"
                                                : "desc"
                                            );
                                            commonSortByFilter(
                                              orgOrder,
                                              "strOrganizationReffName"
                                            );
                                          }}
                                          className="sortable"
                                        >
                                          <span className="mr-1">
                                            {" "}
                                            Org Name
                                          </span>
                                          <SortingIcon viewOrder={orgOrder} />
                                        </div>
                                      </th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rowDto?.map((item, index) => (
                                      <tr className="hasEvent" key={index + 1}>
                                        <td>
                                          <p className="tableBody-title pl-1">
                                            {index + 1}
                                          </p>
                                        </td>
                                        <td>
                                          <p className="tableBody-title">
                                            {item?.strOrganizationTypeName}
                                          </p>
                                        </td>
                                        <td>
                                          <p className="tableBody-title">
                                            {item?.strOrganizationReffName}
                                          </p>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-end">
                                            <button
                                              type="button"
                                              className="iconButton mt-0 mt-md-2 mt-lg-0"
                                              onClick={() =>
                                                setRowDto((prev) => [
                                                  ...prev.filter(
                                                    (prev_item, item_index) =>
                                                      item_index !== index
                                                  ),
                                                ])
                                              }
                                            >
                                              <DeleteOutlined />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {/* user role extension end */}
                </>
              )}

              {/* promotion part end */}
            </div>

            {/* History of Transfers and Promotions */}
            {values?.promote && (
              <div className="pt-3">
                <div className="col-lg-12 mb-2 pl-0">
                  <h3
                    style={{
                      color: " gray700 !important",
                      fontSize: "16px",
                      lineHeight: "20px",
                      fontWeight: "500",
                    }}
                  >
                    History of transfers and promotions
                  </h3>
                </div>
                <div className="table-colored">
                  {historyData?.length ? (
                    <HistoryTransferTable historyData={historyData} />
                  ) : (
                    <div className="pb-4">
                      <NoResult
                        title={"No Transfer And Promotion History Found"}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateSingleIncrement;
