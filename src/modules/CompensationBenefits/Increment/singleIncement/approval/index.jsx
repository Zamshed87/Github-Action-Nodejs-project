/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../../common/BackButton";
import IConfirmModal from "../../../../../common/IConfirmModal";
import Loading from "../../../../../common/loading/Loading";
import MuiIcon from "../../../../../common/MuiIcon";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { failColor, successColor } from "../../../../../utility/customColor";
import useDebounce from "../../../../../utility/customHooks/useDebounce";
import CardTable from "./component/CardTable";
import {
  getAllIncrementAndPromotionListDataForApproval,
  incrementNPromotionApproveReject,
} from "./helper";

const initData = {
  search: "",
};

export default function IncrementNPromotionApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();

  //View Modal
  const [singleData, setSingleData] = useState("");

  const getLandingData = () => {
    getAllIncrementAndPromotionListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceId: wId,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData();
  }, [employeeId]);

  const debounce = useDebounce();

  const handleSearch = (values) => {
    getAllIncrementAndPromotionListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        approverId: employeeId,
        workplaceId: wId,
        workplaceGroupId: 0,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    const array = [];
    applicationListData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intIncrementId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.listData?.filter((item) =>
        regex.test(item?.employeeName?.toLowerCase())
      );
      setRowDto({ listData: newDta });
    } catch {
      setRowDto([]);
    }
  };
  const demoPopup = (action, text, array) => {
    let newArray = [];

    if (array.length > 0) {
      array.forEach((item) => {
        if (text === "isReject") {
          item.isReject = true;
          newArray.push(item);
        } else {
          item.isReject = false;
          newArray.push(item);
        }
      });
    }

    const callback = () => {
      getAllIncrementAndPromotionListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceId: wId,
          workplaceGroupId: 0,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
        },
        setApplicationListData,
        setAllData,
        setLoading
      );
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          incrementNPromotionApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30313) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Increment Approval";
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
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="all-candidate movement-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <BackButton title={"Increment Approval"} />
                          <div>
                            {applicationListData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 && (
                              <div className="d-flex actionIcon mr-3">
                                <Tooltip title="Accept">
                                  <div
                                    className="muiIconHover success mr-2"
                                    onClick={() => {
                                      demoPopup(
                                        "approve",
                                        "isApproved",
                                        applicationData
                                      );
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <CheckCircle
                                          sx={{
                                            color: successColor,
                                            width: "25px !important",
                                            height: "35px !important",
                                            fontSize: "20px !important",
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <div
                                    className="muiIconHover  danger"
                                    onClick={() => {
                                      demoPopup(
                                        "reject",
                                        "isReject",
                                        applicationData
                                      );
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <Cancel
                                          sx={{
                                            color: failColor,
                                            width: "25px !important",
                                            height: "35px !important",
                                            fontSize: "20px !important",
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            )}
                            <ul className="d-flex flex-wrap">
                              {/* {isFilter && (
                                <li>
                                  <ResetButton
                                    title="reset"
                                    icon={
                                      <SettingsBackupRestoreOutlined
                                        sx={{ marginRight: "10px" }}
                                      />
                                    }
                                    onClick={() => {
                                      setIsFilter(false);
                                      setFieldValue("search", "");
                                      setAppliedStatus({
                                        value: 1,
                                        label: "Pending",
                                      });
                                      getLandingData();
                                    }}
                                  />
                                </li>
                              )} */}
                              {/* {permission?.isCreate && (
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
                                        searchData(
                                          value,
                                          allData,
                                          setApplicationListData
                                        );
                                      }, 500);
                                      setFieldValue("search", value);
                                    }}
                                    cancelHandler={() => {
                                      setFieldValue("search", "");
                                      getLandingData();
                                    }}
                                  />
                                </li>
                              )} */}
                            </ul>
                          </div>
                        </div>

                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              <CardTable
                                propsObj={{
                                  setFieldValue,
                                  values,
                                  applicationListData,
                                  setApplicationListData,
                                  appliedStatus,
                                  setAllData,
                                  allData,
                                  setSingleData,
                                  // setViewModal,
                                }}
                              ></CardTable>
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
}
