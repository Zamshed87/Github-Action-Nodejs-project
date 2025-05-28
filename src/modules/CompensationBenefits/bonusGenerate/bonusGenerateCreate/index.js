import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import Required from "common/Required";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "utility/dateFormatter";
import * as Yup from "yup";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import {
  getPeopleDeskAllDDL,
  getPeopleDeskWithoutAllDDL,
} from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500, gray600, success500 } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import {
  columns,
  // createBonusGenerateRequest,
  // getBonusGenerateLanding,
  getBonusNameDDL,
} from "../helper";
import "../salaryGenerate.css";
import {
  getBonusInformationOnRegenerate,
  getEditDDLs,
  getEmployeeListForBonusGenerateOrRegenerate,
  onGenerateOrReGenerateBonus,
} from "./helper";
import MultiCheckedSelect from "common/MultiCheckedSelect";
import { PlusCircleOutlined } from "@ant-design/icons";
import { PModal } from "Components/Modal";
import AsyncFormikSelect from "common/AsyncFormikSelect";
import axios from "axios";
import { PButton } from "Components";

const initialValues = {
  bonusSystemType: { value: 1, label: "Bonus Generator" },
  bonusName: "",
  religion: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  monthYear: moment().format("YYYY-MM"),
  payrollGroup: "",
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
  effectiveDate: todayDate(),
  search: "",
  allSelected: false,
  // marketing
  wing: "",
  soleDepo: "",
  region: "",
  area: "",
  territory: "",
};

const validationSchema = Yup.object().shape({
  bonusName: Yup.object().shape({
    value: Yup.string().required("Bonus Name is required"),
    label: Yup.string().required("Bonus Name is required"),
  }),
  effectiveDate: Yup.date()
    .required("Effective date is required")
    .typeError("Effective date is required"),
});

const BonusGenerateCreate = () => {
  // hook
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);

  const { orgId, buId, employeeId, wgId, wgName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 78) {
      permission = item;
    }
  });

  // DDL
  const [bonusNameDDL, setBonusNameDDL] = useState([]);
  const [open, setOpen] = useState(false);

  const [, setWingDDL] = useState([]);
  const [, setSoleDepoDDL] = useState([]);
  const [, setRegionDDL] = useState([]);
  const [, setAreaDDL] = useState([]);
  const [, setTerritoryDDL] = useState([]);

  const [, getBonusInformation, loadingOnGetBonusInformation] = useAxiosPost();
  const [, employeeSalaryInfo, loadingOnGetSalaryInfo] = useAxiosPost();
  const [, getHrPositionAuto] = useAxiosGet([]);
  const [, getWorkplaceAuto] = useAxiosGet([]);
  const [oldWplace, setoldWplace] = useState([]);

  const [
    employeeList,
    getEmployeeList,
    loadingOnGetEmployeeList,
    setEmployeeList,
  ] = useAxiosGet();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getBonusNameDDL(
      {
        strPartName: "BonusNameForGenerate",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: 0,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
      },
      setBonusNameDDL
    );
    // eslint-disable-next-line
  }, [orgId, buId, employeeId]);

  // useEffect(() => {
  //   getPeopleDeskAllDDL(
  //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
  //     "intBusinessUnitId",
  //     "strBusinessUnit",
  //     setBusinessUnitDDL
  //   );

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [orgId, buId, employeeId]);

  // useEffect(() => {
  //   getPeopleDeskWithoutAllDDL(
  //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=0`,
  //     "WingId",
  //     "WingName",
  //     setWingDDL
  //   );
  // }, [orgId, buId, wgId]);
  // for initial
  useEffect(() => {
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      `/PeopleDeskDdl/WorkplaceIdAll?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
    setFieldValue("workplace", []);
  }, [orgId, buId, employeeId, wgId]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = employeeList?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strEmployeeCode?.toLowerCase()) ||
          regex.test(item?.strEmploymentType?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase()) ||
          regex.test(item?.strPayrollGroup?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  useEffect(() => {
    if (location?.state?.bonusObj) {
      getBonusInformationOnRegenerate(
        setIsEdit,
        location,
        getBonusInformation,
        values,
        setValues,
        setEmployeeList,
        setRowDto,
        setSingleData
      );
    }
    // eslint-disable-next-line
  }, [location?.state]);

  useEffect(() => {
    if (+params?.id) {
      getEditDDLs({
        singleData,
        getPeopleDeskWithoutAllDDL,
        orgId,
        buId,
        wgId,
        setWingDDL,
        setSoleDepoDDL,
        setRegionDDL,
        setAreaDDL,
        setTerritoryDDL,
      });
      getWorkplaceAuto(
        `/Employee/BonusGenerateQueryAll?strPartName=WorkplaceListByBonusHeaderId&intBonusHeaderId=${location?.state?.bonusObj?.intBonusHeaderId}`,
        (data) => {
          const wPlace =
            data?.map((item) => ({
              value: item.intWorkPlaceId,
              label: item.strWorkPlaceName,
            })) || [];
          setFieldValue("workplace", wPlace);
          setoldWplace(wPlace);
          // setWorkplaceDDL(wPlace);
        }
      );
      getHrPositionAuto(
        `/Employee/BonusGenerateQueryAll?strPartName=HrPositionListByBonusHeaderId&intBonusHeaderId=${location?.state?.bonusObj?.intBonusHeaderId}`,
        (data) => {
          const hrPositions =
            data?.map((item) => ({
              value: item.intHRPositionId,
              label: item.strHRPostionName,
            })) || [];
          setFieldValue("hrPosition", hrPositions);
          setHrPositionDDL(hrPositions);
        }
      );
    }
  }, [orgId, buId, wgId, singleData, params]);

  // marketingEmployee
  const isSameWgEmployee = rowDto.every(
    (itm) => wgName === itm?.strWorkplaceGroup
  );

  const getSearchEmployeeListActiveInactive = (v, values) => {
    if (v?.length < 2) return [];

    return axios
      .get(
        `/Employee/CommonEmployeeDDL?workplaceGroupId=${wgId}&searchText=${v}&businessUnitId=${buId}`
      )
      .then((res) => {
        const modifiedData = res?.data?.map((item) => {
          return {
            ...item,
            value: item?.employeeId,
            label: item?.employeeName,
          };
        });
        return modifiedData;
      })
      .catch((err) => []);
  };

  // marketingArea Check
  const isSameMaketingAreaHandler = (rowDto, value, property) => {
    let isCheck = false;

    if (
      rowDto?.length > 0 &&
      rowDto.every((itm) => value === itm[`${property}`])
    ) {
      isCheck = true;
    }

    return isCheck;
  };
  // useFormik hooks
  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      bonusName: {
        value: singleData?.intBonusId,
        label: singleData?.strBonusName,
      },
      effectiveDate: singleData
        ? dateFormatterForInput(singleData?.dteEffectedDateTime)
        : todayDate(),
    },
    onSubmit: (values) => {
      if (+params?.id) {
        if (!isSameWgEmployee) {
          return toast.warning("Bonus generate must be same workplace group!");
        }
      }
      onGenerateOrReGenerateBonus(
        rowDto,
        location,
        values,
        isEdit,
        orgId,
        buId,
        employeeId,
        resetForm,
        setIsEdit,
        setEmployeeList,
        setRowDto,
        setLoading,
        initialValues,
        history,
        wgId
      );
    },
  });
  const rowDtoHandler = (name, index, value) => {
    // name = "numMinutes"
    const data = [...rowDto];
    data[index][name] = value;

    setRowDto(data);
  };
  return (
    <>
      {(loadingOnGetEmployeeList ||
        loadingOnGetBonusInformation ||
        loadingOnGetSalaryInfo) && <Loading />}
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>Bonus Generate Request</h2>
              </div>
              <div>
                <ul className="d-flex flex-wrap">
                  <li>
                    <button
                      type="button"
                      className="btn btn-cancel mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isEdit) {
                          resetForm(initialValues);
                          setIsEdit(false);
                          setEmployeeList([]);
                          setRowDto([]);
                          return;
                        }
                        history.goBack();
                      }}
                    >
                      Cancel
                    </button>
                  </li>
                  <li>
                    <button
                      style={{
                        padding: "0px 10px",
                      }}
                      className="btn btn-default"
                      type="button"
                      onClick={handleSubmit}
                      disabled={rowDto?.length <= 0}
                    >
                      {!isEdit ? "Generate" : "Re-Generate"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="table-card-body">
              <div
                className="card-style"
                style={{ margin: "14px 0px 12px 0px" }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <label>Bonus System</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={customStyles}
                      name="bonusSystemType"
                      options={
                        [
                          { value: 1, label: "Bonus Generator" },
                          { value: 2, label: "Arrear Bonus Generator" },
                        ] || []
                      }
                      value={values?.bonusSystemType}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          bonusName: "",
                          religion: "",
                          businessUnit: "",
                          workplaceGroup: "",
                          workplace: "",
                          payrollGroup: "",
                          effectiveDate: todayDate(),
                          bonusSystemType: valueOption,
                        }));
                        // setFieldValue("bonusSystemType", valueOption);
                      }}
                      isDisabled={isEdit}
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Bonus Name</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={customStyles}
                      name="bonusName"
                      options={bonusNameDDL || []}
                      value={values?.bonusName}
                      onChange={(valueOption) => {
                        setFieldValue("religion", {
                          value: valueOption?.intReligion,
                          label: valueOption?.strReligionName,
                        });
                        setFieldValue("bonusName", valueOption);
                      }}
                      isDisabled={isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-3">
                    <label>
                      Workplace <Required />
                    </label>

                    <FormikSelect
                      name="workplace"
                      isClearable={false}
                      options={workplaceDDL || []}
                      value={values?.workplace}
                      // isDisabled={isEdit}
                      onChange={(valueOption) => {
                        setFieldValue("workplace", valueOption);
                        const ids = valueOption
                          ?.map((item) => item?.intWorkplaceId)
                          .join(",");
                        let oldid = "";
                        if (+params?.id) {
                          oldid = oldWplace
                            ?.map((item) => item?.value)
                            .join(",");
                        }
                        const resultWplace = [ids, oldid]
                          .filter(Boolean)
                          .join(",");
                        console.log(valueOption, "valueOption");
                        console.log(oldWplace, "oldWplace");
                        console.log(resultWplace, "resultWplace");
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AllPosition&WorkplaceGroupId=${wgId}&strWorkplaceIdList=${resultWplace}&BusinessUnitId=${buId}&intId=0`,
                          "PositionId",
                          "PositionName",
                          setHrPositionDDL
                        );
                      }}
                      styles={{
                        ...customStyles,
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.workplace?.length > 1 ? "auto" : "auto",
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
                            values?.workplace?.length > 1 ? "auto" : "auto",
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
                        }),
                      }}
                      isMulti
                      errors={errors}
                      placeholder=""
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>HR Position</label>
                      <MultiCheckedSelect
                        name="hrPosition"
                        options={hrPositionDDL || []}
                        value={values?.hrPosition}
                        onChange={(valueOption) => {
                          setFieldValue("hrPosition", valueOption);
                        }}
                        isShowAllSelectedItem={false}
                        errors={errors}
                        placeholder="HR Position"
                        touched={touched}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label htmlFor="">Effective Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.effectiveDate || todayDate()}
                        name="effectiveDate"
                        type="date"
                        // disabled={isEdit}
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
                  {/* <div className="col-lg-12"></div> */}
                  {isEdit ? (
                    <div className="col-lg-3 mt-4">
                      <div className="d-flex align-items-center">
                        <button
                          style={{
                            padding: "0px 10px",
                          }}
                          className="btn btn-default mr-2"
                          type="button"
                          disabled={
                            !values?.bonusSystemType ||
                            !values?.bonusName ||
                            !values?.effectiveDate ||
                            !values?.workplace ||
                            singleData?.intWorkplaceGroupId !== wgId
                          }
                          onClick={() => {
                            if (+params?.id) {
                              if (!isSameWgEmployee) {
                                return toast.warning(
                                  "Bonus generate must be same workplace group!"
                                );
                              }

                              getEmployeeListForBonusGenerateOrRegenerate(
                                orgId,
                                employeeList,
                                getEmployeeList,
                                setEmployeeList,
                                setRowDto,
                                values,
                                isEdit,
                                location,
                                buId,
                                wgId,
                                values?.wing?.value,
                                values?.soleDepo?.value,
                                values?.region?.value,
                                values?.area?.value,
                                values?.territory?.value
                              );
                            } else {
                              getEmployeeListForBonusGenerateOrRegenerate(
                                orgId,
                                employeeList,
                                getEmployeeList,
                                setEmployeeList,
                                setRowDto,
                                values,
                                isEdit,
                                location,
                                buId,
                                wgId,
                                values?.wing?.value,
                                values?.soleDepo?.value,
                                values?.region?.value,
                                values?.area?.value,
                                values?.territory?.value
                              );
                            }
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="col-lg-3 mt-4">
                      <div className="d-flex align-items-center">
                        <button
                          style={{
                            padding: "0px 10px",
                          }}
                          className="btn btn-default mr-2"
                          type="button"
                          disabled={
                            !values?.bonusSystemType ||
                            !values?.bonusName?.value ||
                            !values?.effectiveDate ||
                            !values?.workplace
                          }
                          onClick={() => {
                            console.log(values?.bonusName);
                            if (+params?.id) {
                              if (!isSameWgEmployee) {
                                return toast.warning(
                                  "Bonus generate must be same workplace group!"
                                );
                              }

                              getEmployeeListForBonusGenerateOrRegenerate(
                                orgId,
                                employeeList,
                                getEmployeeList,
                                setEmployeeList,
                                setRowDto,
                                values,
                                isEdit,
                                location,
                                buId,
                                wgId,
                                values?.wing?.value,
                                values?.soleDepo?.value,
                                values?.region?.value,
                                values?.area?.value,
                                values?.territory?.value
                              );
                            } else {
                              getEmployeeListForBonusGenerateOrRegenerate(
                                orgId,
                                employeeList,
                                getEmployeeList,
                                setEmployeeList,
                                setRowDto,
                                values,
                                isEdit,
                                location,
                                buId,
                                wgId,
                                values?.wing?.value,
                                values?.soleDepo?.value,
                                values?.region?.value,
                                values?.area?.value,
                                values?.territory?.value
                              );
                            }
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {employeeList?.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <h2
                    style={{
                      color: gray500,
                      fontSize: "14px",
                      margin: "0px 0px 10px 0px",
                    }}
                  >
                    Employee Generate List{" "}
                    {rowDto?.length > 0 && (
                      <PlusCircleOutlined
                        onClick={() => {
                          setOpen(true);
                        }}
                        style={{
                          color: "green",
                          fontSize: "15px",
                          cursor: "pointer",
                          margin: "0 5px",
                        }}
                      />
                    )}
                  </h2>

                  <ul className="d-flex flex-wrap">
                    {values?.search && (
                      <li>
                        <ResetButton
                          classes="btn-filter-reset"
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{
                                marginRight: "10px",
                                fontSize: "16px",
                              }}
                            />
                          }
                          styles={{
                            marginRight: "16px",
                          }}
                          onClick={() => {
                            setRowDto(employeeList);
                            setFieldValue("search", "");
                          }}
                        />
                      </li>
                    )}
                    <li>
                      <DefaultInput
                        classes="search-input"
                        inputClasses="search-inner-input"
                        placeholder="Search"
                        value={values?.search}
                        name="search"
                        type="text"
                        trailicon={
                          <SearchOutlined
                            sx={{
                              color: "#323232",
                              fontSize: "18px",
                            }}
                          />
                        }
                        onChange={(e) => {
                          filterData(e.target.value);
                          setFieldValue("search", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </li>
                  </ul>
                </div>

                <div className="table-card-styled employee-table-card tableOne">
                  <AntTable
                    data={rowDto}
                    columnsData={columns(
                      rowDto,
                      setRowDto,
                      setFieldValue,
                      rowDtoHandler
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <NotPermittedPage />
        )}

        <PModal
          open={open}
          title={"Add Employee"}
          // width="400"
          onCancel={() => {
            setOpen(false);
          }}
          maskClosable={false}
          components={
            <>
              <div className="row">
                <div
                  className="input-field-main col-5"
                  style={{ overflow: "hidden", width: "100%", zIndex: 10000 }}
                >
                  <label>Employee</label>
                  <AsyncFormikSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    placeholder="Search (min 3 letter)"
                    loadOptions={(v) =>
                      getSearchEmployeeListActiveInactive(v, values)
                    }
                    // isDisabled={!values?.workplaceGroup}
                  />
                </div>
                <div className="col-3">
                  <PButton
                    style={{
                      marginTop: "22px",
                      marginLeft: "10px",
                    }}
                    type="primary"
                    content={"Add"}
                    onClick={() => {
                      if (values?.employee?.value) {
                        const isExist = rowDto?.find(
                          (item) =>
                            item?.intEmployeeId === values?.employee?.value
                        );
                        if (isExist) {
                          return toast.warning("Employee already added!");
                        }
                        employeeSalaryInfo(
                          `/Payroll/EmployeeSalaryManagement`,
                          {
                            partType: "EmployeeSalaryInfoByEmployeeId",
                            businessUnitId: buId,
                            workplaceGroupId: wgId,
                            workplaceId: 0,
                            departmentId: 0,
                            designationId: 0,
                            supervisorId: 0,
                            strStatus: "Assigned",
                            employeeId: values?.employee?.value,
                          },
                          (res) => {
                            if (res?.length <= 0) {
                              return toast.warning(
                                "Employee salary information not found!"
                              );
                            } else {
                              const newRow = {
                                intEmployeeId: values?.employee?.value,
                                strEmployeeName:
                                  values?.employee?.employeeNameWithCode,
                                strEmployeeCode: values?.employee?.employeeCode,
                                strEmploymentType:
                                  values?.employee?.employmentType,
                                strDesignation: res[0]?.DesignationName,
                                strDepartment: res[0]?.DepartmentName,
                                strDepartmentSection: "",
                                strWorkplaceGroup: wgName,
                                strWorkplace: res[0]?.WorkplaceName,
                                numSalary: res[0]?.numGrossSalary || 0,
                                numBonusAmount: 0,
                                numActualBonusAmount: 0,
                                numBasic: res[0]?.numBasicSalary || 0,
                                strPayrollGroup: res[0]?.PayrollGroupName,
                                intWorkplaceGroupId: wgId,
                                isManualBounsEdit: false,
                              };
                              setRowDto((prev) => [newRow, ...prev]);
                              setFieldValue("employee", "");
                              setOpen(false);
                            }
                          },
                          true
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </>
          }
        />
      </form>
    </>
  );
};

export default BonusGenerateCreate;
