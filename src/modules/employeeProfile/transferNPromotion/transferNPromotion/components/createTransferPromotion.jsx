import {
  AttachmentOutlined,
  DeleteOutlined,
  FileUpload,
  VisibilityOutlined,
} from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  attachment_action,
  getPeopleDeskAllDDL,
  getPeopleDeskWithoutAllDDL,
  getSearchEmployeeList,
  getSearchEmployeeListNew,
  PeopleDeskSaasDDL,
} from "../../../../../common/api";
import BackButton from "../../../../../common/BackButton";
import DefaultInput from "../../../../../common/DefaultInput";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikSelect from "../../../../../common/FormikSelect";
import NoResult from "../../../../../common/NoResult";
import PrimaryButton from "../../../../../common/PrimaryButton";
import ResetButton from "../../../../../common/ResetButton";
import SortingIcon from "../../../../../common/SortingIcon";
// import {
//   PeopleDeskSaasDDL,
//   attachment_action,
//   getPeopleDeskAllDDL,
//   getPeopleDeskWithoutAllDDL,
//   getSearchEmployeeList,
// } from "../../../../../common/api";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import {
  gray600,
  gray700,
  gray900,
  greenColor,
  success500,
} from "../../../../../utility/customColor";
import {
  dateFormatterForInput,
  monthFirstDate,
} from "../../../../../utility/dateFormatter";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import { setOrganizationDDLFunc } from "../../../../roleExtension/ExtensionCreate/helper";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import Accordion from "../accordion";
import {
  addEditTransferAndPromotion,
  getTransferAndPromotionHistoryById,
} from "../helper";
import "../styles.css";
import HistoryTransferTable from "./HistoryTransferTable";
import AsyncFormikSelect from "common/AsyncFormikSelect";

const initialValues = {
  employee: "",
  transferNPromotionType: "",
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
  wing: "",
  soleDepo: "",
  region: "",
  area: "",
  territory: "",
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
  transferNPromotionType: Yup.object()
    .shape({
      label: Yup.string().required("Transfer And Promotion Type is required"),
      value: Yup.string().required("Transfer And Promotion Type is required"),
    })
    .typeError("Transfer And Promotion Type is required"),
  effectiveDate: Yup.string().required("Effective date is required"),
  businessUnit: Yup.object()
    .shape({
      label: Yup.string().required("Business Unit is required"),
      value: Yup.string().required("Business Unit is required"),
    })
    .typeError("Business Unit is required"),
  workplaceGroup: Yup.object()
    .shape({
      label: Yup.string().required("Workplace Group is required"),
      value: Yup.string().required("Workplace Group is required"),
    })
    .typeError("Workplace Group is required"),
  workplace: Yup.object()
    .shape({
      label: Yup.string().required("Workplace is required"),
      value: Yup.string().required("Workplace is required"),
    })
    .typeError("Workplace is required"),
  department: Yup.object()
    .shape({
      label: Yup.string().required("Department is required"),
      value: Yup.string().required("Department is required"),
    })
    .typeError("Department is required"),
  designation: Yup.object()
    .shape({
      label: Yup.string().required("Designation is required"),
      value: Yup.string().required("Designation is required"),
    })
    .typeError("Designation is required"),
  supervisor: Yup.object()
    .shape({
      label: Yup.string().required("Supervisor is required"),
      value: Yup.string().required("Supervisor is required"),
    })
    .typeError("Supervisor is required"),
  lineManager: Yup.object()
    .shape({
      label: Yup.string().required("Line Manager is required"),
      value: Yup.string().required("Line Manager is required"),
    })
    .typeError("Line Manager is required"),
});

function CreateTransferPromotion() {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orgId, buId, employeeId, wgId, wId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const modifiedData = {
    employee: {
      value: state?.singleData?.intEmployeeId,
      label: state?.singleData?.strEmployeeName,
    },
    transferNPromotionType: {
      value: state?.singleData?.strTransferNpromotionType,
      label: state?.singleData?.strTransferNpromotionType,
    },
    effectiveDate: dateFormatterForInput(state?.singleData?.dteEffectiveDate),
    businessUnit: {
      value: state?.singleData?.intBusinessUnitId,
      label: state?.singleData?.businessUnitName,
    },
    workplaceGroup: {
      value: state?.singleData?.intWorkplaceGroupId,
      label: state?.singleData?.workplaceGroupName,
    },
    workplace: {
      value: state?.singleData?.intWorkplaceId,
      label: state?.singleData?.workplaceName,
    },
    department: {
      value: state?.singleData?.intDepartmentId,
      label: state?.singleData?.departmentName,
    },
    section: {
      value: state?.singleData?.intSectionId,
      label: state?.singleData?.strSectionName,
    },
    designation: {
      value: state?.singleData?.intDesignationId,
      label: state?.singleData?.designationName,
    },
    wing: {
      value: state?.singleData?.intWingId,
      label: state?.singleData?.wingName,
    },
    soleDepo: {
      value: state?.singleData?.intSoldDepoId,
      label: state?.singleData?.soldDepoName,
    },
    region: {
      value: state?.singleData?.intRegionId,
      label: state?.singleData?.regionName,
    },
    area: {
      value: state?.singleData?.intAreaId,
      label: state?.singleData?.areaName,
    },
    territory: {
      value: state?.singleData?.intTerritoryId,
      label: state?.singleData?.territoryName,
    },
    supervisor: {
      value: state?.singleData?.intSupervisorId,
      label: state?.singleData?.supervisorName,
    },
    lineManager: {
      value: state?.singleData?.intLineManagerId,
      label: state?.singleData?.lineManagerName,
    },
    role: state?.singleData?.empTransferNpromotionUserRoleVMList
      ? state?.singleData?.empTransferNpromotionUserRoleVMList.map((item) => {
          return {
            intTransferNpromotionUserRoleId:
              item?.intTransferNpromotionUserRoleId,
            intTransferNpromotionId: item?.intTransferNpromotionId,
            value: item?.intUserRoleId,
            label: item?.strUserRoleName,
          };
        })
      : [],
    remarks: state?.singleData?.strRemarks,
    isRoleExtension: state?.singleData?.empTransferNpromotionRoleExtensionVMList
      ?.length
      ? true
      : false,
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
  const [sectionDDL, setSectionDDL] = useState([]);
  // const [supNLineManagerDDL, setSupNLineManagerDDL] = useState([]);
  const [userRoleDDL, setUserRoleDDL] = useState([]);
  const [organizationDDL, setOrganizationDDL] = useState([]);

  const [wingDDL, setWingDDL] = useState([]);
  const [soleDepoDDL, setSoleDepoDDL] = useState([]);
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);

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
        state?.singleData?.intEmployeeId,
        setEmpBasic,
        setLoading,
        state?.singleData?.intBusinessUnitId,
        state?.singleData?.intWorkplaceGroupId
      );
      getTransferAndPromotionHistoryById(
        orgId,
        state?.singleData?.intEmployeeId,
        setHistoryData,
        setLoading < buId,
        wgId
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup_All&BusinessUnitId=${state?.singleData?.intBusinessUnitId}&intId=${employeeId}&WorkplaceGroupId=0`,
        "intWorkplaceGroupId",
        "strWorkplaceGroup",
        setWorkplaceGroupDDL
      );
      PeopleDeskSaasDDL(
        "UserRoleDDLWithoutDefault",
        wgId,
        state?.singleData?.intBusinessUnitId,
        setUserRoleDDL,
        "value",
        "label",
        0
      );
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment_All&BusinessUnitId=${
          state?.singleData?.intBusinessUnitId
        }&WorkplaceGroupId=${state?.singleData?.intWorkplaceGroupId || wgId}`,
        "DepartmentId",
        "DepartmentName",
        setDepartmentDDL
      );
      getPeopleDeskWithoutAllDDL(
        `/SaasMasterData/SectionDDL?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceId=${
          values?.workplace?.value || 0
        }&DepartmentId=${state?.singleData?.intDepartmentId}`,
        "value",
        "label",
        setSectionDDL
      );

      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation_All&BusinessUnitId=${
          state?.singleData?.intBusinessUnitId
        }&WorkplaceGroupId=${
          state?.singleData?.intWorkplaceGroupId || wgId
        }&intWorkplaceId=${wId || 0}`,
        "DesignationId",
        "DesignationName",
        setDesignationDDL
      );

      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace_All&BusinessUnitId=${
          state?.singleData?.intBusinessUnitId
        }&WorkplaceGroupId=${
          state?.singleData?.intWorkplaceGroupId || wgId
        }&intId=${employeeId}`,
        "intWorkplaceId",
        "strWorkplace",
        setWorkplaceDDL
      );

      // ddl for marketing section
      getPeopleDeskWithoutAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${state?.singleData?.intWorkplaceGroupId}&ParentTerritoryId=0`,
        "WingId",
        "WingName",
        setWingDDL
      );
      getPeopleDeskWithoutAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${state?.singleData?.intWorkplaceGroupId}&ParentTerritoryId=${state?.singleData?.intWingId}`,
        "SoleDepoId",
        "SoleDepoName",
        setSoleDepoDDL
      );
      getPeopleDeskWithoutAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${state?.singleData?.intWorkplaceGroupId}&ParentTerritoryId=${state?.singleData?.intSoldDepoId}`,
        "RegionId",
        "RegionName",
        setRegionDDL
      );
      getPeopleDeskWithoutAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${state?.singleData?.intWorkplaceGroupId}&ParentTerritoryId=${state?.singleData?.intRegionId}`,
        "AreaId",
        "AreaName",
        setAreaDDL
      );
      getPeopleDeskWithoutAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${state?.singleData?.intWorkplaceGroupId}&ParentTerritoryId=${state?.singleData?.intAreaId}`,
        "TerritoryId",
        "TerritoryName",
        setTerritoryDDL
      );

      state?.singleData &&
        setRowDto(state?.singleData?.empTransferNpromotionRoleExtensionVMList);
      setFileId(state?.singleData?.intAttachementId);
    }
  }, [id, state, employeeId, orgId, buId, wgId]);
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

  const saveHandler = (values) => {
    const getRoleNameList =
      values?.role &&
      values?.role.map((item) => {
        return {
          intRoleExtensionRowId: 0,
          intTransferNpromotionId: !id
            ? 0
            : state?.singleData?.intTransferNpromotionId || 0,
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
            : state?.singleData?.intTransferNpromotionId || 0,
          intEmployeeId: values?.employee?.value,
          intOrganizationTypeId: item?.intOrganizationTypeId,
          strOrganizationTypeName: item?.strOrganizationTypeName,
          intOrganizationReffId: item?.intOrganizationReffId,
          strOrganizationReffName: item?.strOrganizationReffName,
        };
      });

    if (values?.workplaceGroup?.label === "Marketing") {
      if (!values?.wing) {
        return toast.warning("Wing is required field!");
      }
    }

    const payload = {
      intTransferNpromotionId: !id
        ? 0
        : state?.singleData?.intTransferNpromotionId,
      intEmployeeId: values?.employee?.value,
      strEmployeeName: values?.employee?.label,
      StrTransferNpromotionType: values?.transferNPromotionType?.label,
      intAccountId: orgId,
      intBusinessUnitId: values?.businessUnit?.value,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      intDepartmentId: values?.department?.value,
      intDesignationId: values?.designation?.value,
      intSupervisorId: values?.supervisor?.value,
      intLineManagerId: values?.lineManager?.value,
      intSectionId: values?.section?.value,
      strSectionName: values?.section?.label,
      intDottedSupervisorId: 0,
      intWingId: values?.wing?.value || 0,
      intSoldDepoId: values?.soleDepo?.value || 0,
      intRegionId: values?.region?.value || 0,
      intAreaId: values?.area?.value || 0,
      intTerritoryId: values?.territory?.value || 0,
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
    const callBack = () => {
      history.push("/profile/transferandpromotion/transferandpromotion");
    };
    addEditTransferAndPromotion(payload, callBack, setLoading);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <div className="table-card pb-2">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton
                title={`${
                  !id
                    ? "Create Transfer And Promotion"
                    : "Edit Transfer And Promotion"
                }`}
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
          <div className="card-style">
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
                      }}
                      styles={{ height: "auto", fontSize: "12px" }}
                    />
                  )}
                </div>

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
                      { value: "Transfer", label: "Transfer" },
                      { value: "Promotion", label: "Promotion" },
                      {
                        value: "Transfer & Promotion",
                        label: "Transfer & Promotion",
                      },
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
                    min={monthFirstDate(new Date())}
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
                        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup_All&BusinessUnitId=${valueOption?.value}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
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

                      getPeopleDeskAllDDL(
                        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation_All&BusinessUnitId=${
                          valueOption?.value
                        }&WorkplaceGroupId=${
                          values?.workplaceGroup?.value || wgId
                        }&intWorkplaceId=${wId || 0}`,
                        "DesignationId",
                        "DesignationName",
                        setDesignationDDL
                      );
                      // wing DDL
                      if (
                        valueOption?.value &&
                        values?.workplaceGroup?.label === "Marketing"
                      ) {
                        getPeopleDeskWithoutAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${
                            valueOption?.value
                          }&WorkplaceGroupId=${
                            values?.workplaceGroup?.value || wgId
                          }&ParentTerritoryId=0`,
                          "WingId",
                          "WingName",
                          setWingDDL
                        );
                      }
                      setValues((prev) => ({
                        ...prev,
                        businessUnit: valueOption,
                        workplaceGroup: "",
                        workplace: "",
                        department: "",
                        designation: "",
                        supervisor: "",
                        lineManager: "",
                        section: "",
                        wing: "",
                        soleDepo: "",
                        region: "",
                        area: "",
                        territory: "",
                      }));
                    }}
                    placeholder=""
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isClearable={false}
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
                        section: "",

                        wing: "",
                        soleDepo: "",
                        region: "",
                        area: "",
                        territory: "",
                      }));
                      getPeopleDeskAllDDL(
                        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace_All&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                        "intWorkplaceId",
                        "strWorkplace",
                        setWorkplaceDDL
                      );

                      // wing DDL
                      if (
                        values?.businessUnit?.value &&
                        valueOption?.label === "Marketing"
                      ) {
                        getPeopleDeskWithoutAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&ParentTerritoryId=0`,
                          "WingId",
                          "WingName",
                          setWingDDL
                        );
                      }
                    }}
                    placeholder=""
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.businessUnit}
                    isClearable={false}
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
                        section: "",
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
                    }}
                    placeholder=""
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.workplaceGroup}
                    isClearable={false}
                  />
                </div>
              </div>

              {/* marketing setup */}
              {values?.workplaceGroup?.label === "Marketing" && (
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Wing</label>
                    <FormikSelect
                      menuPosition="fixed"
                      name="wing"
                      options={wingDDL || []}
                      value={values?.wing}
                      onChange={(valueOption) => {
                        getPeopleDeskWithoutAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                          "SoleDepoId",
                          "SoleDepoName",
                          setSoleDepoDDL
                        );
                        setValues((prev) => ({
                          ...prev,

                          soleDepo: "",
                          region: "",
                          area: "",
                          territory: "",
                          wing: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
              )}
              {values?.workplaceGroup?.label === "Marketing" && (
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Sole Depo</label>
                    <FormikSelect
                      menuPosition="fixed"
                      name="soleDepo"
                      options={soleDepoDDL || []}
                      value={values?.soleDepo}
                      onChange={(valueOption) => {
                        getPeopleDeskWithoutAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                          "RegionId",
                          "RegionName",
                          setRegionDDL
                        );

                        setValues((prev) => ({
                          ...prev,

                          region: "",
                          area: "",
                          territory: "",
                          soleDepo: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
              )}
              {values?.workplaceGroup?.label === "Marketing" && (
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Region</label>
                    <FormikSelect
                      menuPosition="fixed"
                      name="region"
                      options={regionDDL || []}
                      value={values?.region}
                      onChange={(valueOption) => {
                        getPeopleDeskWithoutAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                          "AreaId",
                          "AreaName",
                          setAreaDDL
                        );

                        setValues((prev) => ({
                          ...prev,

                          area: "",
                          territory: "",
                          region: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
              )}
              {values?.workplaceGroup?.label === "Marketing" && (
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Area</label>
                    <FormikSelect
                      menuPosition="fixed"
                      name="area"
                      options={areaDDL || []}
                      value={values?.area}
                      onChange={(valueOption) => {
                        getPeopleDeskWithoutAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                          "TerritoryId",
                          "TerritoryName",
                          setTerritoryDDL
                        );
                        setValues((prev) => ({
                          ...prev,

                          territory: "",
                          area: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
              )}
              {values?.workplaceGroup?.label === "Marketing" && (
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Territory</label>
                    <FormikSelect
                      menuPosition="fixed"
                      name="territory"
                      options={territoryDDL || []}
                      value={values?.territory}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,

                          territory: valueOption,
                        }));
                      }}
                      styles={customStyles}
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
              )}

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
                        section: "",
                      }));
                      getPeopleDeskWithoutAllDDL(
                        `/SaasMasterData/SectionDDL?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceId=${
                          values?.workplace?.value || 0
                        }&DepartmentId=${valueOption?.value}`,
                        "value",
                        "label",
                        setSectionDDL
                      );
                    }}
                    placeholder=""
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.workplace}
                    isClearable={false}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="input-field-main">
                  <label>Section</label>
                  <FormikSelect
                    name="section"
                    placeholder=""
                    value={values?.section}
                    options={sectionDDL || []}
                    onChange={(valueOption) => {
                      setValues((prev) => ({
                        ...prev,
                        section: valueOption,
                      }));
                    }}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.department}
                    isClearable={false}
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
                    isClearable={false}
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
                      getSearchEmployeeListNew(
                        buId,
                        intAccountId,
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
                      getSearchEmployeeListNew(
                        buId,
                        intAccountId,
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
                          values?.businessUnit?.length > 2 ? "auto" : "30px",
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
                          values?.businessUnit?.length > 2 ? "auto" : "30px",
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
              <div className="col-6 mt-3">
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
                                ? state?.singleData?.intAttachementId
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
                        let roleExist = rowDto?.some(
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
                  {!!rowDto.length > 0 && (
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
                                      <span className="mr-1"> Org Type</span>
                                      <SortingIcon viewOrder={orgTypeOrder} />
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      onClick={(e) => {
                                        setOrgOrder(
                                          orgOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          orgOrder,
                                          "strOrganizationReffName"
                                        );
                                      }}
                                      className="sortable"
                                    >
                                      <span className="mr-1"> Org Name</span>
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
            </div>
            {/* user role extension end */}

            {/* History of Transfers and Promotions */}
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
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateTransferPromotion;
