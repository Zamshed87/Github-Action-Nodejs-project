import {
  Cancel,
  CheckCircle,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../common/AntTable";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import Chips from "../../../common/Chips";
import FormikCheckBox from "../../../common/FormikCheckbox";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import MuiIcon from "../../../common/MuiIcon";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor
} from "../../../utility/customColor";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { dateFormatter } from "../../../utility/dateFormatter";
import { AssetTransferApproveReject, getAssetTransferListDataForApproval } from "./helper";
import "./index.css";

const initData = {
  search: "",
  movementType: "",
  department: "",
  employee: "",
  movementFromDate: "",
  movementToDate: "",
  workplace: "",
  designation: "",
  appStatus: "",
  type: { value: 1, label: "Supervisor" },
};

export default function AssetTransferApproval() {
  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [allData, setAllData] = useState();
  const [isFilter, setIsFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const getLandingData = () => {
    getAssetTransferListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
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
    getAssetTransferListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
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
  }, [employeeId, orgId, isOfficeAdmin]);

  const debounce = useDebounce();

  useEffect(() => {
    const array = [];
    applicationListData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.application?.intAssetTransferId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [applicationListData, orgId, isOfficeAdmin, employeeId]);

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
      getAssetTransferListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
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
          AssetTransferApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const singlePopup = (action, text, item) => {
    let payload = [
      {
        applicationId: item?.application?.intAssetTransferId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAssetTransferListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
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
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        AssetTransferApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30357) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
  }, [dispatch]);

  const getLandingTable = (setFieldValue, page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: () => (
          <div className="d-flex align-items-center">
            <div className="mr-2">
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  padding: "0 !important",
                  color: gray900,
                  checkedColor: greenColor,
                }}
                name="allSelected"
                checked={
                  applicationListData?.listData?.length > 0 &&
                  applicationListData?.listData?.every(
                    (item) => item?.selectCheckbox
                  )
                }
                onChange={(e) => {
                  setApplicationListData({
                    listData: applicationListData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setAllData({
                    listData: allData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFieldValue("allSelected", e.target.checked);
                }}
              />
            </div>
            <div>Code</div>
          </div>
        ),
        dataIndex: "employeeCode",
        render: (employeeCode, record, index) => (
          <div className="d-flex align-items-center">
            <div className="mr-2" onClick={(e) => e.stopPropagation()}>
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  color: gray900,
                  checkedColor: greenColor,
                  padding: "0px",
                }}
                name="selectCheckbox"
                color={greenColor}
                checked={record?.selectCheckbox}
                onChange={(e) => {
                  let data = applicationListData?.listData?.map((item) => {
                    if (
                      item?.application?.intAssetTransferId ===
                      record?.application?.intAssetTransferId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setApplicationListData({ listData: [...data] });
                  let data2 = allData?.listData?.map((item) => {
                    if (
                      item?.application?.intAssetTransferId ===
                      record?.application?.intAssetTransferId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setAllData({ listData: [...data2] });
                  // let data = [...leaveApplicationData?.listData];
                  // data[index].selectCheckbox = e.target.checked;
                  // setAllLeaveApplicatonData({ listData: [...data] });
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <span className="ml-2">{employeeCode}</span>
            </div>
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        title: "From Employee",
        dataIndex: "fromEmployeeName",
        render: (_, record) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={record?.fromEmployeeName}
              />
              <span className="ml-2">{record?.fromEmployeeName}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
      },
      {
        title: "Designation",
        dataIndex: "designation",
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "department",
        sorter: true,
        filter: true,
      },
      {
        title: "Type",
        dataIndex: "employmentType",
        sorter: true,
        filter: true,
      },
      {
        title: "To Employee",
        dataIndex: "toEmployeeName",
        render: (_, record) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={record?.toEmployeeName}
              />
              <span className="ml-2">{record?.toEmployeeName}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
      },
      {
        title: "Application Date",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{dateFormatter(record?.application?.dteCreatedAt)}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Item Category",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{record?.itemCategory}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Item Name",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{record?.itemName}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Transfer Quantity",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{record?.transferQuantity}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Transfer Date",
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <div>{dateFormatter(record?.transferDate)}</div>
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "currentStage",
        render: (currentStage, record) => (
          <div className="d-flex align-items-center">
            <div>{currentStage}</div>
          </div>
        ),
        filter: true,
        sorter: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status, record) => (
          <div className="text-center action-chip">
            {status === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {status === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-center">
                  <Tooltip title="Approve">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={(e) => {
                        e.stopPropagation();
                        singlePopup("approve", "Approve", record);
                      }}
                    >
                      <MuiIcon
                        icon={<CheckCircle sx={{ color: successColor }} />}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="muiIconHover  danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        singlePopup("reject", "Reject", record);
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: failColor }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {status === "Rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
        filter: true,
        sorter: true,
      },
    ];
  };

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
                          <BackButton title={"Asset Transfer Approval"} />
                          <div className="table-card-head-right">
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
                                            width: "16px",
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
                                            width: "16px",
                                          }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            )}
                            <ul className="d-flex flex-wrap">
                              {isFilter && (
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
                                      getLandingData();
                                    }}
                                  />
                                </li>
                              )}
                              {permission?.isCreate && (
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
                              )}
                            </ul>
                          </div>
                        </div>
                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              {allData?.listData?.length > 0 ? (
                                <AntTable
                                  data={
                                    allData?.listData?.length > 0
                                      ? allData?.listData
                                      : []
                                  }
                                  columnsData={getLandingTable(
                                    setFieldValue,
                                    page,
                                    paginationSize
                                  )}
                                  setColumnsData={(dataRow) => {
                                    if (
                                      dataRow?.length ===
                                      allData?.listData?.length
                                    ) {
                                      let temp = dataRow?.map((item) => {
                                        return {
                                          ...item,
                                          selectCheckbox: false,
                                        };
                                      });
                                      setApplicationListData({
                                        listData: [...temp],
                                      });
                                      setAllData({ listData: [...temp] });
                                    } else {
                                      setApplicationListData({
                                        listData: [...dataRow],
                                      });
                                    }
                                  }}
                                  setPage={setPage}
                                  setPaginationSize={setPaginationSize}
                                />
                              ) : (
                                <>{!loading && <NoResult />}</>
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
}
