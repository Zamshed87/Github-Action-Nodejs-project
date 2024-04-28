/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Cancel,
  CheckCircle,
  Clear,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../../common/AvatarComponent";
import BackButton from "../../../../../common/BackButton";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import Loading from "../../../../../common/loading/Loading";
import MuiIcon from "../../../../../common/MuiIcon";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successBg,
  successColor,
  warningBg,
} from "../../../../../utility/customColor";
import useDebounce from "../../../../../utility/customHooks/useDebounce";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import {
  getAllTransferAndPromotionListDataForApproval,
  transferNPromotionApproveReject,
} from "./helper";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Chips from "../../../../../common/Chips";
import NoResult from "../../../../../common/NoResult";
import AntTable from "../../../../../common/AntTable";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../styles.css";
import ApproveRejectComp from "common/ApproveRejectComp";

const initData = {
  search: "",
};

export default function TransferNPromotionApproval() {
  const { employeeId, isOfficeAdmin, orgId, wId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [applicationListData, setApplicationListData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  //View Modal
  const [viewModal, setViewModal] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [filterData, setFilterData] = useState([]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const history = useHistory();

  const handleOpen = () => {
    setViewModal(false);
  };

  // for view Modal
  const handleViewClose = () => setViewModal(false);

  const getLandingData = () => {
    getAllTransferAndPromotionListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: 0,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        workplaceId: wId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData();
  }, [employeeId]);

  const debounce = useDebounce();

  const handleSearch = (values) => {
    getAllTransferAndPromotionListDataForApproval(
      {
        applicationStatus: "Pending",
        isAdmin: isOfficeAdmin,
        approverId: employeeId,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        workplaceId: wId,
        departmentId: 0,
        designationId: 0,
        applicantId: 0,
        accountId: orgId,
        intId: 0,
      },

      setApplicationListData,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    const array = [];
    filterData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          applicationId: data?.intTransferNpromotionId,
          approverEmployeeId: employeeId,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
  }, [filterData]);

  const [appliedStatus, setAppliedStatus] = useState({
    value: 1,
    label: "Pending",
  });

  const saveHandler = (values) => {};
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.listData?.filter((item) =>
        regex.test(item?.strEmployeeName?.toLowerCase())
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
      getAllTransferAndPromotionListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceGroupId: wgId,
          businessUnitId: buId,
          workplaceId: wId,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
        },
        setApplicationListData,
        setFilterData,
        setLoading
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          transferNPromotionApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const demoPopupForTable = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.intTransferNpromotionId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllTransferAndPromotionListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceGroupId: wgId,
          businessUnitId: buId,
          workplaceId: wId,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
        },
        setApplicationListData,
        setFilterData,
        setLoading
      );
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        transferNPromotionApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30309) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Transfer & Promotion Approval";
  }, []);

  const columns = (setFieldValue, page, paginationSize) => {
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
                  filterData?.listData?.length > 0 &&
                  filterData?.listData?.every((item) => item?.selectCheckbox)
                }
                onChange={(e) => {
                  e.stopPropagation();
                  setApplicationListData({
                    listData: applicationListData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFilterData({
                    listData: filterData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFieldValue("allSelected", e.target.checked);
                }}
              />
            </div>
            <div>Employee Id</div>
          </div>
        ),
        dataIndex: "employeeCode",
        render: (employeeCode, record, index) => (
          <div className="d-flex align-items-center">
            <div className="mr-2">
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
                  e.stopPropagation();
                  let data = applicationListData?.listData?.map((item) => {
                    if (
                      item?.intTransferNpromotionId ===
                      record?.intTransferNpromotionId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  let transferNPromotionData =
                    applicationListData?.listData?.map((item) => {
                      if (
                        item?.intTransferNpromotionId ===
                        record?.intTransferNpromotionId
                      ) {
                        return {
                          ...item,
                          selectCheckbox: e.target.checked,
                        };
                      } else return item;
                    });
                  setApplicationListData({
                    listData: [...transferNPromotionData],
                  });
                  setFilterData({ listData: [...data] });
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
        title: "Employee",
        dataIndex: "strEmployeeName",
        render: (data) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent classess="" letterCount={1} label={data} />
              <span className="ml-2">{data}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
      },
      {
        title: "Designation",
        dataIndex: "designationNameFrom",
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "departmentNameFrom",
        sorter: true,
        filter: true,
      },
      {
        title: "Application Date",
        dataIndex: "dteCreatedAt",
        render: (data) => <div>{dateFormatter(data)}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "Effective Date",
        dataIndex: "dteEffectiveDate",
        render: (data) => <div>{dateFormatter(data)}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "Type",
        dataIndex: "strTransferNpromotionType",
        render: (data) => (
          <>
            <div className="d-flex align-items-center justify-content-start">
              <InfoOutlinedIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchorEl(e.currentTarget);
                }}
                sx={{
                  color: gray900,
                }}
              />
              <div className="ml-2">{data}</div>
            </div>
            <Popover
              sx={{
                "& .MuiPaper-root": {
                  width: "675px",
                  minHeight: "200px",
                  borderRadius: "4px",
                },
              }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={(e) => {
                e.stopPropagation();
                setAnchorEl(null);
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "middle",
              }}
            >
              <div
                className="master-filter-modal-container employeeProfile-src-filter-main"
                style={{ height: "auto" }}
              >
                <div className="master-filter-header employeeProfile-src-filter-header">
                  <div></div>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEl(null);
                    }}
                  >
                    <Clear sx={{ fontSize: "18px", color: gray900 }} />
                  </IconButton>
                </div>
                <hr />
                <div
                  className="body-employeeProfile-master-filter"
                  style={{ height: "300px", overflow: "scroll" }}
                >
                  <table className="table table-bordered mt-3">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "rgba(247, 247, 247, 1)",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "rgba(95, 99, 104, 1)!important",
                        }}
                      >
                        <th
                          className="text-center"
                          rowSpan="2"
                          style={{
                            verticalAlign: "top",
                          }}
                        >
                          SL
                        </th>
                        <th
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                          }}
                          colSpan="2"
                        >
                          <div className="text-center">From</div>
                        </th>
                        <th
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                          }}
                          colSpan="2"
                        >
                          <div className="text-center">To</div>
                        </th>
                        <th
                          rowSpan="2"
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            verticalAlign: "top",
                          }}
                        >
                          <div className="sortable justify-content-center">
                            Type
                          </div>
                        </th>
                        <th
                          rowSpan="2"
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            verticalAlign: "top",
                          }}
                        >
                          <div className="sortable justify-content-center">
                            Effective Date
                          </div>
                        </th>
                      </tr>
                      <tr
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "rgba(82, 82, 82, 1)",
                        }}
                      >
                        <td
                          style={{
                            backgroundColor: "rgba(247, 220, 92, 1)",
                          }}
                        >
                          <div>B.Unit & Workplace</div>
                        </td>
                        <td
                          style={{
                            backgroundColor: "rgba(247, 220, 92, 1)",
                          }}
                        >
                          Dept & Designation
                        </td>
                        <td
                          style={{
                            backgroundColor: "rgba(129, 225, 255, 1)",
                          }}
                        >
                          B.Unit & Workplace
                        </td>
                        <td
                          style={{
                            backgroundColor: "rgba(129, 225, 255, 1)",
                          }}
                        >
                          Dept & Designation
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {applicationListData?.listData?.length > 0 &&
                        applicationListData?.listData?.map((data, i) => (
                          <tr
                            style={{
                              color: "rgba(95, 99, 104, 1)",
                              fontSize: "14px",
                            }}
                            key={i}
                          >
                            <td className="text-center">
                              <div>{i + 1}</div>
                            </td>
                            <td
                              style={{
                                backgroundColor: "rgba(254, 249, 223, 1)",
                              }}
                            >
                              <div
                                style={{
                                  color: "rgba(95, 99, 104, 1)",
                                }}
                                className=" "
                              >
                                <div>{data?.businessUnitNameFrom}</div>
                                <div>{data?.workplaceNameFrom}</div>
                              </div>
                            </td>
                            <td
                              style={{
                                backgroundColor: "rgba(254, 249, 223, 1)",
                              }}
                            >
                              <div
                                style={{
                                  color: "rgba(95, 99, 104, 1)",
                                }}
                              >
                                <div>{data?.departmentNameFrom}</div>
                                <div>{data?.designationNameFrom}</div>
                              </div>
                            </td>
                            <td
                              style={{
                                backgroundColor: "rgba(230, 246, 253, 1)",
                              }}
                            >
                              <div
                                style={{
                                  color: "rgba(95, 99, 104, 1)",
                                }}
                                className=""
                              >
                                <div>{data?.businessUnitName}</div>
                                <div>{data?.workplaceName}</div>
                              </div>
                            </td>
                            <td
                              style={{
                                backgroundColor: "rgba(230, 246, 253, 1)",
                              }}
                            >
                              <div
                                style={{
                                  color: "rgba(95, 99, 104, 1)",
                                }}
                                className=""
                              >
                                <div>{data?.departmentName}</div>
                                <div>{data?.designationName}</div>
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  color: "rgba(95, 99, 104, 1)",
                                }}
                              >
                                <div>{data?.strTransferNpromotionType}</div>
                              </div>
                            </td>
                            <td>
                              <div>{dateFormatter(data?.dteEffectiveDate)}</div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="master-filter-bottom footer-employeeProfile-src-filter">
                  <div className="master-filter-btn-group">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        setSingleData({});

                        setFieldValue("releaseDate", "");
                      }}
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              </div>
            </Popover>
          </>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "currentStage",
        render: (data) => (
          <div className="d-flex align-items-center">
            <div>{data}</div>
          </div>
        ),
        filter: false,
        sorter: false,
        hidden: isOfficeAdmin ? false : true,
      },
      {
        title: "Status",
        dataIndex: "strStatus",
        render: (status, record) => (
          <div className="text-center action-chip">
            {record?.strStatus === "Pending" && (
              <>
                <div className="actionChip">
                  <Chips label="Pending" classess=" warning" />
                </div>
                <div className="d-flex actionIcon justify-content-center">
                  <Tooltip title="Accept">
                    <div
                      className="mx-2 muiIconHover success "
                      onClick={(e) => {
                        demoPopupForTable("approve", "Approve", record);
                        e.stopPropagation();
                      }}
                    >
                      <MuiIcon
                        icon={<CheckCircle sx={{ color: "#34A853" }} />}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="muiIconHover danger"
                      onClick={(e) => {
                        demoPopupForTable("reject", "Reject", record);
                        e.stopPropagation();
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {record?.strStatus === "Rejected" && (
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
                          
                          <div className="d-flex align-items-center">
                            <BackButton
                              title={"Transfer And Promotion Approval"}
                            />
                            {filterData?.listData?.filter(
                              (item) => item?.selectCheckbox
                            ).length > 0 ? (
                              <ApproveRejectComp
                                props={{
                                  className: "ml-3",
                                  onApprove: () => {
                                    demoPopup(
                                      "approve",
                                      "isApproved",
                                      applicationData
                                    );
                                  },
                                  onReject: () => {
                                    demoPopup(
                                      "reject",
                                      "isReject",
                                      applicationData
                                    );
                                  },
                                }}
                              />
                            ) : null}
                          </div>
                        
                        </div>

                        {permission?.isCreate ? (
                          <div className="table-card-body">
                            <div className="table-card-styled table-responsive tableOne">
                              {applicationListData?.listData?.length > 0 ? (
                                <div className="table-card-styled tableOne table-responsive">
                                  <AntTable
                                    data={applicationListData?.listData}
                                    columnsData={columns(
                                      setFieldValue,
                                      page,
                                      paginationSize
                                    )}
                                    // setColumnsData={(dataRow) => {
                                    //   setFilterData({ listData: dataRow });
                                    // }}
                                    setColumnsData={(dataRow) => {
                                      if (
                                        dataRow?.length ===
                                        applicationListData?.listData?.length
                                      ) {
                                        let temp = dataRow?.map((item) => {
                                          return {
                                            ...item,
                                            selectCheckbox: false,
                                          };
                                        });
                                        setFilterData({ listData: [...temp] });
                                        setApplicationListData({
                                          listData: [...temp],
                                        });
                                      } else {
                                        setFilterData({
                                          listData: [...dataRow],
                                        });
                                      }
                                    }}
                                    onRowClick={(item) => {
                                      history.push(
                                        `/profile/transferandpromotion/transferandpromotion/view/${item?.intTransferNpromotionId}`,
                                        {
                                          employeeId: item?.intEmployeeId,
                                          approval: true,
                                          businessUnitId:
                                            item?.intBusinessUnitId,
                                          workplaceGroupId:
                                            item?.intWorkplaceGroupId,
                                        }
                                      );
                                      setSingleData(item);
                                      setViewModal(true);
                                    }}
                                    setPage={setPage}
                                    setPaginationSize={setPaginationSize}
                                    rowKey={(record) =>
                                      record?.intTransferNpromotionId
                                    }
                                  />
                                </div>
                              ) : (
                                <NoResult />
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
