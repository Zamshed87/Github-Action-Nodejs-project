import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import {
  compensationBenefitsLSAction,
  setFirstLevelNameAction,
} from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import {
  getDateOfYear,
  monthLastDate,
} from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";
import {
  bonusGenerateColumn,
  createBonusGenerateRequest,
  getBonusGenerateLanding,
} from "./helper";
import "./salaryGenerate.css";
import useDebounce from "../../../utility/customHooks/useDebounce";
import MasterFilter from "../../../common/MasterFilter";

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
  filterFromDate: getDateOfYear("first"),
  filterToDate: monthLastDate(),
};

const validationSchema = Yup.object().shape({
  bonusName: Yup.object().shape({
    value: Yup.string().required("Bonus Name is required"),
    label: Yup.string().required("Bonus Name is required"),
  }),
  religion: Yup.object()
    .shape({
      value: Yup.string().required("Religion is required"),
      label: Yup.string().required("Religion is required"),
    })
    .typeError("Religion is required"),
  businessUnit: Yup.object().shape({
    value: Yup.string().required("Business Unit is required"),
    label: Yup.string().required("Business Unit is required"),
  }),
  workplaceGroup: Yup.object().shape({
    value: Yup.string().required("Workplace Group is required"),
    label: Yup.string().required("Workplace Group is required"),
  }),
  workplace: Yup.object().shape({
    value: Yup.string().required("Workplace is required"),
    label: Yup.string().required("Workplace is required"),
  }),
  payrollGroup: Yup.object().shape({
    value: Yup.string().required("Payroll Group is required"),
    label: Yup.string().required("Payroll Group is required"),
  }),
});

const BonusGenerateLanding = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [singleData] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const debounce = useDebounce();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // LS data compensationBenefits
  const { compensationBenefits } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  useEffect(() => {
    getBonusGenerateLanding(
      {
        strPartName:
          values?.bonusSystemType?.value === 1
            ? "BonusGenerateLanding"
            : "ArrearBonusGenerateLanding",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: wgId,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
        dteFromDate: values?.filterFromDate,
        dteToDate: values?.filterToDate,
      },
      setRowDto,
      setAllData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strBonusName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // useFormik hooks
  const { setFieldValue, values, handleSubmit, resetForm } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      filterFromDate:
        compensationBenefits?.bonusGenerate?.fromDate || getDateOfYear("first"),
      filterToDate:
        compensationBenefits?.bonusGenerate?.toDate || monthLastDate(),
    },
    onSubmit: (values) => saveHandler(values),
  });

  // on form submit
  const saveHandler = (values) => {
    const payload = {
      strPartName:
        values?.bonusSystemType?.value === 1
          ? "BonusGenerateProcess"
          : "ArrearBonusGenerateProcess",
      intBonusHeaderId: isEdit ? singleData?.intBonusHeaderId : 0,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intBonusId: values?.bonusName?.value,
      intPayrollGroupId: values?.payrollGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intReligionId: values?.religion?.value,
      dteEffectedDate: values?.effectiveDate,
      intCreatedBy: employeeId,
    };
    const callback = () => {
      resetForm(initialValues);
      setIsEdit(false);
      getBonusGenerateLanding(
        {
          strPartName:
            values?.bonusSystemType?.value === 1
              ? "BonusGenerateLanding"
              : "ArrearBonusGenerateLanding",
          intBonusHeaderId: 0,
          intAccountId: orgId,
          intBusinessUnitId: buId,
          intBonusId: 0,
          intPayrollGroupId: 0,
          intWorkplaceGroupId: wgId,
          intReligionId: 0,
          dteEffectedDate: values?.effectiveDate,
          intCreatedBy: employeeId,
          dteFromDate: values?.filterFromDate,
          dteToDate: values?.filterToDate,
        },
        setRowDto,
        setAllData,
        setLoading
      );
    };
    createBonusGenerateRequest(payload, setLoading, callback);
  };

  // send for approval
  const sendForApprovalHandler = (data, values) => {
    const payload = {
      strPartName: data?.isArrearBonus
        ? "ArrearBonusGenerateSendToApproval"
        : "BonusGenerateSendToApproval",
      intBonusHeaderId: data?.intBonusHeaderId || 0,
      intAccountId: data?.intAccountId || orgId,
      intBusinessUnitId: data?.intBusinessUnitId || values?.businessUnit?.value,
      intBonusId: data?.intBonusId || values?.bonusName?.value,
      intPayrollGroupId: data?.intPayrollGroupId || values?.payrollGroup?.value,
      intWorkplaceId: data?.intWorkplaceId || values?.workplace?.value || 0,
      workplaceGroupId:
        data?.intWorkplaceGroupId || values?.workplaceGroup?.value, // name change from himadri bhai
      intReligionId: data?.intReligionId || values?.religion?.value,
      dteEffectedDate: data?.dteEffectedDateTime || values?.effectiveDate,
      intCreatedBy: employeeId,
    };
    const callback = () => {
      getBonusGenerateLanding(
        {
          strPartName:
            values?.bonusSystemType?.value === 1
              ? "BonusGenerateLanding"
              : "ArrearBonusGenerateLanding",
          intBonusHeaderId: 0,
          intAccountId: orgId,
          intBusinessUnitId: buId,
          intBonusId: 0,
          intPayrollGroupId: 0,
          intWorkplaceGroupId: wgId,
          intReligionId: 0,
          dteEffectedDate: todayDate(),
          intCreatedBy: employeeId,
          dteFromDate: values?.filterFromDate,
          dteToDate: values?.filterToDate,
        },
        setRowDto,
        setAllData,
        setLoading
      );
    };
    createBonusGenerateRequest(payload, setLoading, callback);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 78) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Bonus Generate";
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading justify-content-end">
              <div></div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h2
                style={{
                  color: gray500,
                  fontSize: "14px",
                  margin: "0px 0px 10px 0px",
                }}
              >
                {values?.bonusSystemType?.value === 1
                  ? "Bonus"
                  : "Arrear Bonus"}{" "}
                Generate List
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
                        setRowDto(allData);
                        setFieldValue("search", "");
                      }}
                    />
                  </li>
                )}
                <li>
                  <MasterFilter
                    styles={{
                      marginRight: "0px",
                    }}
                    isHiddenFilter
                    width="200px"
                    inputWidth="200px"
                    value={values?.search}
                    setValue={(value) => {
                      debounce(() => {
                        filterData(value);
                        setFieldValue("search", value);
                      }, 500);
                      setFieldValue("search", value);
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                    }}
                  />
                </li>
                <li>
                  <button
                    style={{
                      padding: "0px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      history.push(
                        "/compensationAndBenefits/payrollProcess/bonusGenerate/create"
                      );
                    }}
                    className="btn btn-default ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-style pb-0 my-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="toDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            bonusGenerate: {
                              ...compensationBenefits?.bonusGenerate,
                              fromDate: e.target.value,
                            },
                          })
                        );
                        setFieldValue("filterFromDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterToDate}
                      placeholder="Month"
                      name="toDate"
                      min={values?.filterFromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            bonusGenerate: {
                              ...compensationBenefits?.bonusGenerate,
                              toDate: e.target.value,
                            },
                          })
                        );
                        setFieldValue("filterToDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-green btn-green-disable mt-4"
                    type="button"
                    disabled={!values?.filterFromDate || !values?.filterToDate}
                    onClick={(e) => {
                      e.stopPropagation();
                      getBonusGenerateLanding(
                        {
                          strPartName:
                            values?.bonusSystemType?.value === 1
                              ? "BonusGenerateLanding"
                              : "ArrearBonusGenerateLanding",
                          intBonusHeaderId: 0,
                          intAccountId: orgId,
                          intBusinessUnitId: buId,
                          intBonusId: 0,
                          intPayrollGroupId: 0,
                          intWorkplaceGroupId: 0,
                          intReligionId: 0,
                          dteEffectedDate: todayDate(),
                          intCreatedBy: employeeId,
                          dteFromDate: values?.filterFromDate,
                          dteToDate: values?.filterToDate,
                        },
                        setRowDto,
                        setAllData,
                        setLoading
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="table-card-styled tableOne">
              {rowDto?.length > 0 ? (
                <AntTable
                  data={rowDto?.length > 0 ? rowDto : []}
                  columnsData={bonusGenerateColumn(
                    page,
                    paginationSize,
                    sendForApprovalHandler,
                    values,
                    history
                  )}
                  rowClassName="pointer"
                  onRowClick={(data) => {
                    if (data?.intBonusHeaderId) {
                      history.push({
                        pathname: `/compensationAndBenefits/payrollProcess/bonusGenerate/view/${data?.intBonusHeaderId}`,
                        state: data,
                      });
                    } else {
                      return toast.warning(
                        "Bonus Generate on processing. Please wait...",
                        {
                          toastId: 1,
                        }
                      );
                    }
                  }}
                  setPage={setPage}
                  setPaginationSize={setPaginationSize}
                />
              ) : (
                <NoResult title="No result found" />
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default BonusGenerateLanding;
