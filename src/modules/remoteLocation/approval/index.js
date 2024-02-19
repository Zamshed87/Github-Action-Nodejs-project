import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../common/AntTable";
import BackButton from "../../../common/BackButton";
import Chips from "../../../common/Chips";
import FormikCheckBox from "../../../common/FormikCheckbox";
import IConfirmModal from "../../../common/IConfirmModal";
import MuiIcon from "../../../common/MuiIcon";
import NoResult from "../../../common/NoResult";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../utility/customColor";
import {
  allLocationAssignApproveReject,
  getAllLocationAssignLanding,
} from "./helper";

const MasterLocationRegistration = () => {
  const { employeeId, isOfficeAdmin, orgId, buId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const dispatch = useDispatch();

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30363) {
      permission = item;
    }
  });
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Master Location Approval";
  }, []);

  const [rowDto, setRowDto] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [applicationData, setApplicationData] = useState([]);

  useEffect(() => {
    const array = [];
    filteredData?.listData?.forEach((data) => {
      if (data?.selectCheckbox) {
        array.push({
          locationId: data?.intMasterLocationId,
          approverEmployeeId: employeeId,
          isReject: false,
          accountId: orgId,
          isAdmin: isOfficeAdmin,
        });
      }
      setApplicationData(array);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData]);

  const getData = () => {
    getAllLocationAssignLanding(
      {
        applicationStatus: "pending",
        isAdmin: isOfficeAdmin,
        approverId: employeeId,
        workplaceId: wId,
        busineessUnit: buId,
        accountId: orgId,
        applicantId: 0,
        intId: 0,
      },
      setRowDto,
      setFilteredData,
      setLoading
    );
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
      getData();
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to  ${action} ? `,
      yesAlertFunc: () => {
        if (array.length) {
          allLocationAssignApproveReject(newArray, callback);
        }
        newArray = [];
      },
      noAlertFunc: () => {
        newArray = [];
      },
    };
    IConfirmModal(confirmObject);
  };

  const singlePopUp = (action, text, item) => {
    let payload = [
      {
        applicationId: item?.intLoanApplicationId,
        fromDate: item?.application?.dteEffectiveDate || null,
        toDate: item?.application?.dteToDate || null,
        approverEmployeeId: employeeId,
        isReject: text === "approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllLocationAssignLanding(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          busineessUnit: 0,
          workplaceId: wId,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
        },
        setRowDto,
        setFilteredData,
        setLoading
      );
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        allLocationAssignApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { resetForm, handleSubmit, setFieldValue } = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      saveHandler(values, () => {
        resetForm();
      });
    },
  });

  const saveHandler = (values) => {};

  useEffect(() => {
    getData();
  }, [wId]);

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
                  rowDto?.listData?.length > 0 &&
                  rowDto?.listData?.every((item) => item?.selectCheckbox)
                }
                onChange={(e) => {
                  setRowDto({
                    listData: rowDto?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFilteredData({
                    listData: filteredData?.listData?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    })),
                  });
                  setFieldValue("allSelected", e.target.checked);
                }}
              />
            </div>
          </div>
        ),
        dataIndex: "",
        render: (_, record) => (
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
                  let locationAppData = rowDto?.listData?.map((item) => {
                    if (
                      item?.application?.intMasterLocationId ===
                      record?.application?.intMasterLocationId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  let data = filteredData?.listData?.map((item) => {
                    if (
                      item?.application?.intMasterLocationId ===
                      record?.application?.intMasterLocationId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setRowDto({ listData: [...locationAppData] });
                  setFilteredData({ listData: [...data] });
                }}
              />
            </div>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "Location Name",
        dataIndex: "strAddress",
        sorter: true,
        filter: true,
      },
      {
        title: "Longitude",
        dataIndex: "strLongitude",
        render: (data) => <div>{data ? data : "-"}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "Latitude",
        dataIndex: "strLatitude",
        sorter: false,
        filter: false,
      },
      {
        title: "Address",
        dataIndex: "strAddress",
        filter: false,
        sorter: false,
      },
      {
        title: "Waiting Stage",
        dataIndex: "strStatus",
        filter: false,
        sorter: false,
        hidden: isOfficeAdmin ? false : true,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (_, record) => (
          <div className="text-center action-chip" style={{ width: "70px" }}>
            {record?.application?.status === "approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {record?.application?.status === "pending" && (
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
                        singlePopUp("approve", "approve", record);
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
                        singlePopUp("reject", "reject", record);
                      }}
                    >
                      <MuiIcon icon={<Cancel sx={{ color: failColor }} />} />
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
            {record?.status === "rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
        filter: false,
        sorter: false,
      },
    ];
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div>
            <div className="all-candidate movement-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="table-card">
                      <div className="table-card-heading">
                        <BackButton title={"Location Approval"} />
                        <div>
                          {filteredData &&
                            filteredData?.listData?.filter(
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
                                    className="muiIconHover danger"
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
                        </div>
                      </div>
                      <div className="table-card-body">
                        <div className="table-card-styled table-responsive tableOne">
                          {rowDto && rowDto?.listData?.length > 0 ? (
                            <AntTable
                              data={rowDto?.listData}
                              columnsData={columns(
                                setFieldValue,
                                page,
                                paginationSize
                              )}
                              setColumnsData={(dataRow) => {
                                setFilteredData({ listData: dataRow });
                              }}
                              setPage={setPage}
                              setPaginationSize={setPaginationSize}
                              rowKey={(record) =>
                                record?.application?.intMasterLocationId
                              }
                            />
                          ) : (
                            <NoResult />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default MasterLocationRegistration;
