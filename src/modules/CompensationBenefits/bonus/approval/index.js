/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowBack,
  Cancel,
  CheckCircle,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Chips from "../../../../common/Chips";
import FormikInput from "../../../../common/FormikInput";
import IConfirmModal from "../../../../common/IConfirmModal";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { failColor, successColor } from "../../../../utility/customColor";
import ResetButton from "./../../../../common/ResetButton";
import {
  bonusApproveRejectRequest,
  filterData,
  getBonusGenerateRequestReport,
} from "./helper";

const initData = {
  search: "",
};

const BonusApproval = () => {
  const [loading, setLoading] = useState(false);

  // rowDto
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [status, setStatus] = useState("");

  const { userId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    const payload = {
      strPartName: "BonusApprovalStatus",
      intBusinessUnitId: buId,
    };
    getBonusGenerateRequestReport(payload, setRowDto, setAllData, setLoading);
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  // Approve Handler
  const approveHandler = (message, item) => {
    const payload = {
      strPartName: "BonusApproval",
      jsonObj: {
        autoId: item?.intBonusHeaderId,
        approveStatusId: 1,
        approveBy: userId,
      },
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure for ${message}?`,
      yesAlertFunc: () => {
        bonusApproveRejectRequest(payload, getData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  // Reject Handler
  const rejectHandler = (message, item) => {
    const payload = {
      strPartName: "BonusApproval",
      jsonObj: {
        autoId: item?.intBonusHeaderId,
        approveStatusId: 2,
        approveBy: userId,
      },
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure for ${message}`,
      yesAlertFunc: () => {
        bonusApproveRejectRequest(payload, getData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const saveHandler = (values) => {};

  const history = useHistory();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 110) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Bonus Approval";
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
                              Bonus Approval
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
                                      setRowDto(allData);
                                      setFieldValue("search", "");
                                      setStatus("");
                                    }}
                                  />
                                </li>
                              )}
                              {permission?.isCreate && (
                                <li style={{ marginRight: "24px" }}>
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
                            <div className="table-card-styled tableOne">
                              {rowDto?.length > 0 ? (
                                <>
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th>
                                          <div>Bonus Name</div>
                                        </th>
                                        <th>
                                          <div>Religion</div>
                                        </th>
                                        <th>
                                          <div>Employment Type</div>
                                        </th>
                                        <th>
                                          <div className="text-center">
                                            Service Length
                                          </div>
                                        </th>
                                        <th>
                                          <div>Bonus Percentage On</div>
                                        </th>
                                        <th>
                                          <div className="text-center">
                                            Bonus Percentage
                                          </div>
                                        </th>
                                        <th width="20%">
                                          <div className="text-center">
                                            Status
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rowDto?.map((data, index) => (
                                        <>
                                          <tr key={index}>
                                            <td>{data?.strBonusName}</td>
                                            <td>{data?.strReligionName}</td>
                                            <td>{data?.strEmploymentType}</td>
                                            <td className="text-center">
                                              {
                                                data?.intMinimumServiceLengthMonth
                                              }
                                            </td>
                                            <td>
                                              {data?.strBonusPercentageOn}
                                            </td>
                                            <td className="text-center">
                                              {data?.numBonusPercentage}
                                            </td>
                                            <td className="action-col text-center">
                                              {data?.strApproveStatus ===
                                                "Approved" && (
                                                <Chips
                                                  label="Approved"
                                                  classess="success"
                                                />
                                              )}
                                              {data?.strApproveStatus ===
                                                "Pending" && (
                                                <div className="d-flex align-items-center justify-content-center">
                                                  <div className="d-flex actionIcon">
                                                    <Tooltip title="Approve">
                                                      <div
                                                        className="mr-2 muiIconHover success "
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          approveHandler(
                                                            "Approve",
                                                            data
                                                          );
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
                                                          rejectHandler(
                                                            "Reject",
                                                            data
                                                          );
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
                                              {data?.strApproveStatus ===
                                                "Rejected" && (
                                                <>
                                                  <Chips
                                                    label="Rejected"
                                                    classess="p-2"
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

export default BonusApproval;
