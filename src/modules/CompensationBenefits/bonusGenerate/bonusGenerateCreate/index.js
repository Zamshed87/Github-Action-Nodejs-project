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
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);

  const [wingDDL, setWingDDL] = useState([]);
  const [soleDepoDDL, setSoleDepoDDL] = useState([]);
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);

  const [, getBonusInformation, loadingOnGetBonusInformation] = useAxiosPost();
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

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    getPeopleDeskWithoutAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=0`,
      "WingId",
      "WingName",
      setWingDDL
    );
  }, [orgId, buId, wgId]);
  // for initial
  useEffect(() => {
    setWorkplaceDDL([]);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
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

  // on form submit

  // send for approval

  // const sendForApprovalHandler = (data, values) => {
  //   const payload = {
  //     strPartName: data?.isArrearBonus
  //       ? "ArrearBonusGenerateSendToApproval"
  //       : "BonusGenerateSendToApproval",
  //     intBonusHeaderId: data?.intBonusHeaderId || 0,
  //     intAccountId: data?.intAccountId || orgId,
  //     intBusinessUnitId: data?.intBusinessUnitId || values?.businessUnit?.value,
  //     intBonusId: data?.intBonusId || values?.bonusName?.value,
  //     intPayrollGroupId: data?.intPayrollGroupId || values?.payrollGroup?.value,
  //     intWorkplaceId: data?.intWorkplaceId || values?.workplace?.value,
  //     intWorkplaceGroupId:
  //       values?.intWorkplaceGroupId || values?.workplaceGroup?.value,
  //     intReligionId: data?.intReligionId || values?.religion?.value,
  //     dteEffectedDate: data?.dteEffectedDateTime || values?.effectiveDate,
  //     intCreatedBy: employeeId,
  //   };
  //   const callback = () => {
  //     getBonusGenerateLanding(
  //       {
  //         strPartName:
  //           values?.bonusSystemType?.value === 1
  //             ? "BonusGenerateLanding"
  //             : "ArrearBonusGenerateLanding",
  //         intBonusHeaderId: 0,
  //         intAccountId: orgId,
  //         intBusinessUnitId: buId,
  //         intBonusId: 0,
  //         intPayrollGroupId: 0,
  //         intWorkplaceGroupId: 0,
  //         intReligionId: 0,
  //         dteEffectedDate: todayDate(),
  //         intCreatedBy: employeeId,
  //       },
  //       setRowDto,
  //       null,
  //       setLoading
  //     );
  //   };
  //   createBonusGenerateRequest(payload, setLoading, callback);
  // };

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
    }
  }, [orgId, buId, wgId, singleData, params]);

  // marketingEmployee
  const isSameWgEmployee = rowDto.every(
    (itm) => wgName === itm?.strWorkplaceGroup
  );

  const mergedData = rowDto.reduce((acc, cur) => {
    if (!acc[cur.intEmployeeId]) {
      // If the id doesn't exist in the accumulator, add it with all properties
      acc[cur.intEmployeeId] = { ...cur };
    } else {
      // If the id exists, merge properties while keeping all previous properties
      acc[cur.intEmployeeId] = { ...acc[cur.intEmployeeId], ...cur };
    }
    return acc;
  }, {});

  const updatedRowDto = Object.values(mergedData);

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
      effectiveDate: dateFormatterForInput(singleData?.dteEffectedDateTime),
      wing:
        +params?.id &&
        isSameMaketingAreaHandler(rowDto, singleData?.intWingId, "intWingId")
          ? {
              value: singleData?.intWingId,
              label: singleData?.WingName,
            }
          : "",
      soleDepo:
        +params?.id &&
        isSameMaketingAreaHandler(
          rowDto,
          singleData?.intSoleDepoId,
          "intSoleDepo"
        )
          ? {
              value: singleData?.intSoleDepoId,
              label: singleData?.SoleDepoName,
            }
          : "",
      region:
        +params?.id &&
        isSameMaketingAreaHandler(
          rowDto,
          singleData?.intRegionId,
          "intRegionId"
        )
          ? {
              value: singleData?.intRegionId,
              label: singleData?.RegionName,
            }
          : "",
      area:
        +params?.id &&
        isSameMaketingAreaHandler(rowDto, singleData?.intAreaId, "intAreaId")
          ? {
              value: singleData?.intAreaId,
              label: singleData?.AreaName,
            }
          : "",
      territory:
        +params?.id &&
        isSameMaketingAreaHandler(
          rowDto,
          singleData?.intTerritoryId,
          "intTerritoryId"
        )
          ? {
              value: singleData?.intTerritoryId,
              label: singleData?.TerritoryName,
            }
          : "",
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

  return (
    <>
      {(loadingOnGetEmployeeList || loadingOnGetBonusInformation) && (
        <Loading />
      )}
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

                  {/* marketing setup */}
                  {"Marketing" === wgName && (
                    <>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Wing</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="wing"
                            options={wingDDL || []}
                            value={values?.wing}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${valueOption?.value}`,
                                "SoleDepoId",
                                "SoleDepoName",
                                setSoleDepoDDL
                              );

                              setRegionDDL([]);
                              setAreaDDL([]);
                              setTerritoryDDL([]);

                              setFieldValue("soleDepo", "");
                              setFieldValue("region", "");
                              setFieldValue("area", "");
                              setFieldValue("territory", "");
                              setFieldValue("wing", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                            isDisabled={
                              +params?.id &&
                              isSameMaketingAreaHandler(
                                rowDto,
                                singleData?.intWingId,
                                "intWingId"
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Sole Depo</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="soleDepo"
                            options={soleDepoDDL || []}
                            value={values?.soleDepo}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${valueOption?.value}`,
                                "RegionId",
                                "RegionName",
                                setRegionDDL
                              );

                              setAreaDDL([]);
                              setTerritoryDDL([]);

                              setFieldValue("region", "");
                              setFieldValue("area", "");
                              setFieldValue("territory", "");
                              setFieldValue("soleDepo", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                            isDisabled={
                              (+params?.id &&
                                isSameMaketingAreaHandler(
                                  rowDto,
                                  singleData?.intSoleDepoId,
                                  "intSoleDepo"
                                )) ||
                              !values?.wing
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Region</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="region"
                            options={regionDDL || []}
                            value={values?.region}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${valueOption?.value}`,
                                "AreaId",
                                "AreaName",
                                setAreaDDL
                              );

                              setAreaDDL([]);

                              setFieldValue("area", "");
                              setFieldValue("territory", "");
                              setFieldValue("region", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                            isDisabled={
                              (+params?.id &&
                                isSameMaketingAreaHandler(
                                  rowDto,
                                  singleData?.intRegionId,
                                  "intRegionId"
                                )) ||
                              !values?.soleDepo
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Area</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="area"
                            options={areaDDL || []}
                            value={values?.area}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${valueOption?.value}`,
                                "TerritoryId",
                                "TerritoryName",
                                setTerritoryDDL
                              );
                              setFieldValue("territory", "");
                              setFieldValue("area", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                            isDisabled={
                              (+params?.id &&
                                isSameMaketingAreaHandler(
                                  rowDto,
                                  singleData?.intAreaId,
                                  "intAreaId"
                                )) ||
                              !values?.region
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Territory</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="territory"
                            options={territoryDDL || []}
                            value={values?.territory}
                            onChange={(valueOption) => {
                              setFieldValue("territory", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                            isDisabled={
                              (+params?.id &&
                                isSameMaketingAreaHandler(
                                  rowDto,
                                  singleData?.intTerritoryId,
                                  "intTerritoryId"
                                )) ||
                              !values?.area
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-lg-3 d-none">
                    <div className="input-field-main">
                      <label htmlFor="">Business Unit</label>
                      <FormikSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            businessUnit: valueOption,
                            workplaceGroup: "",
                            workplace: "",
                            payrollGroup: "",
                          }));
                        }}
                        placeholder=""
                        isDisabled={isEdit}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label htmlFor="">Effective Date</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.effectiveDate}
                        name="effectiveDate"
                        type="date"
                        // disabled={isEdit}
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            // yearId: +e.target.value
                            //   .split("")
                            //   .slice(0, 4)
                            //   .join(""),
                            // monthId: +e.target.value
                            //   .split("")
                            //   .slice(-2)
                            //   .join(""),
                            // monthYear: e.target.value,
                            effectiveDate: e.target.value,
                          }));
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12"></div>
                  {
                    <div className="col-lg-3">
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
                  }
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
                    Employee Generate List
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
                    data={updatedRowDto}
                    columnsData={columns(
                      updatedRowDto,
                      setRowDto,
                      setFieldValue
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
      </form>
    </>
  );
};

export default BonusGenerateCreate;
