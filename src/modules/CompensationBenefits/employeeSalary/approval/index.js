/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowBack,
  Cancel,
  CheckCircle,
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Chips from "../../../../common/Chips";
import FormikInput from "../../../../common/FormikInput";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { failColor, successColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import ResetButton from "./../../../../common/ResetButton";
import {
  createSalaryGenerateRequest,
  filterData,
  getSalaryGenerateRequestReport
} from "./helper";

const initData = {
  search: "",
};

const SalaryApproval = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // rowDto
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [status, setStatus] = useState("");

  const { userId, orgId, buId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getSalaryGenerateRequestReport(buId, setRowDto, setAllData, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  // Approve Handler
  const approveHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure?`,
      yesAlertFunc: () => {
        const payload = {
          reportType: "Request For Approve",
          businessUnitId: buId,
          businessUnit: buName,
          workplaceGroupId: item?.intWorkplaceGroupId,
          workplaceGroup: item?.strWorkplaceGroup,
          payrollGroupId: item?.intPayrollGroupId,
          payrollGroup: item?.strPayrollGroup,
          monthId: item?.intMonthId,
          yearId: item?.intYearId,
          generateByUserId: userId,
        };
        const callback = () => {
          getSalaryGenerateRequestReport(
            buId,
            setRowDto,
            setAllData,
            setLoading
          );
        };
        createSalaryGenerateRequest(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  // Reject Handler
  const rejectHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure?`,
      yesAlertFunc: () => {
        const payload = {
          reportType: "Request For Reject",
          businessUnitId: buId,
          businessUnit: buName,
          workplaceGroupId: item?.intWorkplaceGroupId,
          workplaceGroup: item?.strWorkplaceGroup,
          payrollGroupId: item?.intPayrollGroupId,
          payrollGroup: item?.strPayrollGroup,
          monthId: item?.intMonthId,
          yearId: item?.intYearId,
          generateByUserId: userId,
        };
        const callback = () => {
          getSalaryGenerateRequestReport(
            buId,
            setRowDto,
            setAllData,
            setLoading
          );
        };
        createSalaryGenerateRequest(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 107) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}

              <div className="loan-application">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <div style={{ color: "rgba(0, 0, 0, 0.7)" }}>
                            <Tooltip title="Back">
                              <ArrowBack
                                onClick={() => history.goBack()}
                                sx={{
                                  fontSize: "16px",
                                  marginRight: "10px",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                            <h3
                              style={{
                                display: "inline-block",
                                fontSize: "13px",
                              }}
                            >
                              Salary Approval
                            </h3>
                          </div>
                          <div className="table-card-head-right">
                            <ul>
                              {(values?.search || status) && (
                                <li>
                                  <ResetButton
                                    title="reset"
                                    icon={
                                      <SettingsBackupRestoreOutlined
                                        sx={{ marginRight: "10px" }}
                                      />
                                    }
                                    onClick={() => {
                                      getSalaryGenerateRequestReport(
                                        buId,
                                        setRowDto,
                                        setAllData,
                                        setLoading
                                      );
                                      setRowDto(allData);
                                      setFieldValue("search", "");
                                      setStatus("");
                                    }}
                                  />
                                </li>
                              )}
                              {permission?.isCreate && (
                                <li>
                                  <FormikInput
                                    classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
                                    inputClasses="search-inner-input"
                                    placeholder="Search"
                                    value={values?.search}
                                    name="search"
                                    type="text"
                                    trailicon={
                                      <SearchOutlined
                                        sx={{ color: "#323232" }}
                                      />
                                    }
                                    onChange={(e) => {
                                      filterData(
                                        e.target.value,
                                        allData,
                                        setRowDto
                                      );
                                      setFieldValue("search", e.target.value);
                                    }}
                                    errors={errors}
                                    touched={touched}
                                  />
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled">
                              {rowDto?.length > 0 ? (
                                <>
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th>
                                          <div>Payroll Group</div>
                                        </th>
                                        <th>
                                          <div>Workplace Group</div>
                                        </th>
                                        <th>
                                          <div className="text-right">
                                            Generated Month/Year
                                          </div>
                                        </th>
                                        <th>
                                          <div>Generated By</div>
                                        </th>
                                        <th>
                                          <div className="text-right">
                                            Applied Date
                                          </div>
                                        </th>
                                        <th>
                                          <div className="text-center">
                                            Processing Status
                                          </div>
                                        </th>
                                        <th style={{ width: "300px" }}>
                                          <div className="text-center">
                                            Application Status
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rowDto?.map((data, index) => (
                                        <>
                                          <tr
                                            key={index}
                                            // onClick={() => {
                                            //   history.push(`/compensationAndBenefits/employeeSalary/commonSalaryTable/${data?.intPayrollGenerateId}`);
                                            // }}
                                          >
                                            <td>{data?.strPayrollGroup}</td>
                                            <td>{data?.strWorkplaceGroup}</td>
                                            <td className="text-right">
                                              {dateFormatter(
                                                data?.GenerateDateTime
                                              )}
                                            </td>
                                            <td>{data?.GenerateByUser}</td>
                                            <td className="text-right">
                                              {data?.SalaryGenerateFor}
                                            </td>
                                            <td className="text-center">
                                              {data?.ProcessingStatus}
                                            </td>
                                            <td className="action-col text-center">
                                              {data?.ApplicationStatus ===
                                                "Approved" && (
                                                <Chips
                                                  label="Approved"
                                                  classess="success"
                                                />
                                              )}
                                              {data?.ApplicationStatus ===
                                                "Pending" && (
                                                <div className="d-flex align-items-center justify-content-center">
                                                  <div className="d-flex actionIcon">
                                                    <Tooltip title="Approve">
                                                      <div
                                                        className="mr-2 muiIconHover success "
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          approveHandler(data);
                                                        }}
                                                      >
                                                        <MuiIcon
                                                          icon={
                                                            <CheckCircle
                                                              sx={{
                                                                color:
                                                                  successColor,
                                                              }}
                                                            />
                                                          }
                                                        />
                                                      </div>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                      <div
                                                        className="muiIconHover  danger"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          rejectHandler(data);
                                                        }}
                                                      >
                                                        <MuiIcon
                                                          icon={
                                                            <Cancel
                                                              sx={{
                                                                color:
                                                                  failColor,
                                                              }}
                                                            />
                                                          }
                                                        />
                                                      </div>
                                                    </Tooltip>
                                                  </div>
                                                </div>
                                              )}
                                              {data?.ApplicationStatus ===
                                                "Rejected" && (
                                                <>
                                                  <Chips
                                                    label="Rejected"
                                                    classess=""
                                                    style={{
                                                      background: "#FFE2E1",
                                                      color: "#BD3044",
                                                    }}
                                                  />
                                                </>
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                    </tbody>
                                  </table>
                                </>
                              ) : (
                                <>
                                  {!loading && (
                                    <NoResult title="No Result Found" para="" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <NotPermittedPage />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SalaryApproval;
