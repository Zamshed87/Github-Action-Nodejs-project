import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import Chips from "../../../common/Chips";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import {
  compensationBenefitsLSAction,
  setFirstLevelNameAction,
} from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import {
  dateFormatter,
  getDateOfYear,
  monthFirstDate,
  monthLastDate,
} from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import {
  createArearSalaryGenerateApproveRequest,
  getArearSalaryGenerateRequestLanding,
} from "./helper";
import "./salaryGenerate.css";

const initialValues = {
  search: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: monthLastDate(),
};

const validationSchema = Yup.object().shape({});

const ArearSalaryGenerateIndex = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // LS data compensationBenefits
  const { compensationBenefits } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  // useFormik hooks
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      filterFromDate:
        compensationBenefits?.arrearSalaryGenerate?.fromDate ||
        getDateOfYear("first"),
      filterToDate:
        compensationBenefits?.arrearSalaryGenerate?.toDate || monthLastDate(),
    },
    onSubmit: (values) => saveHandler(values),
  });

  // on form submit
  const saveHandler = (values) => {};

  //get landing data
  const getLandingData = () => {
    getArearSalaryGenerateRequestLanding(
      orgId,
      buId,
      setRowDto,
      setAllData,
      setLoading,
      values
    );
  };

  useEffect(() => {
    getArearSalaryGenerateRequestLanding(
      orgId,
      buId,
      setRowDto,
      setAllData,
      setLoading,
      values
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
          regex.test(item?.strArearSalaryCode?.toLowerCase()) ||
          regex.test(item?.ProcessionStatus?.toLowerCase()) ||
          regex.test(item?.ApprovalStatus?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // send for approval
  const sendForApprovalHandler = (values) => {
    const payload = {
      strPartName: "GeneratedArearSalarySendForApproval",
      intArearSalaryGenerateRequestId: values?.intSalaryGenerateRequestId,
      intAccountId: values?.intAccountId,
      intBusinessUnitId: values?.intBusinessUnitId,
      strBusinessUnit: values?.strBusinessUnit,
      dteEffectiveFrom: values?.dteSalaryGenerateFrom,
      dteEffectiveTo: values?.dteSalaryGenerateTo,
      strDescription: values?.strDescription,
      intCreatedBy: employeeId,
      intSalaryPolicyId: values?.intSalaryPolicyId,
      numPercentOfGross: values?.numPercentOfGross,
    };
    const callback = () => {
      getLandingData();
    };
    createArearSalaryGenerateApproveRequest(payload, setLoading, callback);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30306) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Arear Salary Generate";
  }, [dispatch]);

  const arrearGenerateColumn = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
      },
      {
        title: "Arrear Salary Code",
        dataIndex: "strArearSalaryCode",
        sorter: true,
        filter: true,
      },
      {
        title: "Business Unit",
        dataIndex: "strBusinessUnit",
        sorter: true,
        filter: true,
      },
      {
        title: "Payroll Policy",
        dataIndex: "strSalaryPolicyName",
        sorter: true,
        filter: true,
      },
      {
        title: "Payroll Period",
        dataIndex: "dteSalaryGenerateTo",
        sorter: true,
        filter: true,
        render: (_, item) => (
          <>
            {item?.dteSalaryGenerateFrom
              ? dateFormatter(item?.dteSalaryGenerateFrom)
              : "-"}{" "}
            -{" "}
            {item?.dteSalaryGenerateTo
              ? dateFormatter(item?.dteSalaryGenerateTo)
              : "-"}
          </>
        ),
      },
      {
        title: "Net Amount",
        dataIndex: "numNetPayableSalary",
        sorter: false,
        filter: false,
        className: "text-right",
        render: (_, item) => (
          <>
            {item?.numNetPayableSalary
              ? numberWithCommas(item?.numNetPayableSalary)
              : "0"}
          </>
        ),
      },
      {
        title: "Processing Status",
        dataIndex: "numNetPayableSalary",
        sorter: true,
        filter: true,
        className: "text-right",
        render: (_, record) => (
          <>
            {record?.ProcessionStatus === "Success" && (
              <Chips label={record?.ProcessionStatus} classess="success" />
            )}
            {record?.ProcessionStatus === "Processing" && (
              <Chips label={record?.ProcessionStatus} classess="warning" />
            )}
          </>
        ),
      },
      {
        title: "Approval Status",
        dataIndex: "ApprovalStatus",
        sorter: false,
        filter: false,
        className: "text-right",
        render: (_, data) => {
          return (
            <>
              {data?.ApprovalStatus === "Approved" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: gray500,
                    fontWeight: "400",
                  }}
                >
                  {data?.ApprovalStatus}
                </p>
              )}
              {data?.ApprovalStatus === "Send for Approval" && (
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    style={{
                      height: "24px",
                      fontSize: "12px",
                      padding: "0px 12px 0px 12px",
                      backgroundColor: "#0BA5EC",
                    }}
                    className="btn btn-default"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sendForApprovalHandler(data);
                    }}
                  >
                    Send for Approval
                  </button>
                </div>
              )}
              {data?.ApprovalStatus === "Waiting for Approval" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: gray500,
                    fontWeight: "400",
                  }}
                >
                  {data?.ApprovalStatus}
                </p>
              )}
              {data?.ApprovalStatus === "Rejected" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: gray500,
                    fontWeight: "400",
                  }}
                >
                  {data?.ApprovalStatus}
                </p>
              )}
            </>
          );
        },
      },
      {
        title: "",
        dataIndex: "",
        sorter: false,
        filter: false,
        render: (data, item) => (
          <>
            {!!data?.isReGenerate && (
              <div>
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push({
                      pathname: `/compensationAndBenefits/payrollProcess/arearSalaryGenerate/regenerate/${data?.intSalaryGenerateRequestId}`,
                      state: data,
                    });
                  }}
                >
                  Re-Generate
                </button>
              </div>
            )}
          </>
        ),
      },
    ];
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div>{/* <h2>Arrear Salary Generate List</h2> */}</div>
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
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center ml-2"
                    label="Request Generate"
                    onClick={() => {
                      if (!permission?.isCreate) {
                        return toast.warning("Your are not allowed to access");
                      }
                      history.push(
                        `/compensationAndBenefits/payrollProcess/arearSalaryGenerate/create`
                      );
                    }}
                  />
                </li>
              </ul>
            </div>
            <div className="card-style pb-0 mt-3 mb-2">
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
                            arrearSalaryGenerate: {
                              ...compensationBenefits?.arrearSalaryGenerate,
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
                            arrearSalaryGenerate: {
                              ...compensationBenefits?.arrearSalaryGenerate,
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
                      getArearSalaryGenerateRequestLanding(
                        orgId,
                        buId,
                        setRowDto,
                        setAllData,
                        setLoading,
                        values
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
                  columnsData={arrearGenerateColumn(page, paginationSize)}
                  rowClassName="pointer"
                  onRowClick={(data) => {
                    if (data?.isGenerated === true) {
                      history.push({
                        pathname: `/compensationAndBenefits/payrollProcess/arearSalaryGenerate/view/${data?.intSalaryGenerateRequestId}`,
                        state: data,
                      });
                    } else {
                      return toast.warning(
                        "Salary Generate on processing. Please wait...",
                        {
                          toastId: 1,
                        }
                      );
                    }
                  }}
                  setPage={setPage}
                  setPaginationSize={setPaginationSize}
                  rowKey={(record) => record?.intSalaryGenerateRequestId}
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

export default ArearSalaryGenerateIndex;

// <table className="table">
//   <thead>
//     <tr>
//       <th style={{ width: "30px" }}>
//         <div>SL</div>
//       </th>
//       <th>
//         <div>Arrear Salary Code</div>
//       </th>
//       <th>
//         <div>Business Unit</div>
//       </th>
//       <th></th>
//       <th>
//         <div>Payroll Policy</div>
//       </th>
//       <th>
//         <div>Payroll Period</div>
//       </th>
//       <th style={{ textAlign: "right" }}>
//         <div>Net Amount</div>
//       </th>
//       <th></th>
//       <th>
//         <div>Processing Status</div>
//       </th>
//       <th style={{ width: "145px" }}>
//         <div>Approval Status</div>
//       </th>
//       <th style={{ width: "115px" }}></th>
//     </tr>
//   </thead>
//   <tbody>
//     <CardTable
//       rowDto={rowDto}
//       sendForApprovalHandler={sendForApprovalHandler}
//     />
//   </tbody>
// </table>
