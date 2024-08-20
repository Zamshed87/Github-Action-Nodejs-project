import { Cancel, CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AntTable from "../../../../../common/AntTable";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import { LightTooltip } from "../../../../../common/LightTooltip";
import MuiIcon from "../../../../../common/MuiIcon";
import NoResult from "../../../../../common/NoResult";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { approveAttendance } from "../helper";
import PBadge from "Components/Badge";

const StyledTable = ({
  setFieldValue,
  gridData,
  setGridData,
  setLoading,
  getLandingData,
  allData,
  filterLanding,
  setFilterLanding,
}) => {
  const { employeeId, orgId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const singlePopup = (action, text, item) => {
    let payload = [
      {
        applicationId: item?.application?.intId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getLandingData();
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        approveAttendance(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const parentCheckHandler = () => {
    let isCheck = true;
    let filterData = gridData?.filter(
      (item) => !item?.isReject && !item?.isApproved && !item.selectCheckbox
    );
    if (Array.isArray(filterData) && filterData.length > 0) {
      isCheck = false;
    }
    return isCheck;
  };

  const parentChangeHandler = (e) => {
    let data = [];
    gridData.forEach((item) => {
      let payload = {
        ...item,
        selectCheckbox:
          !item?.application?.isReject && !item?.application?.isApproved
            ? e.target.checked
            : false,
      };
      data.push(payload);
    });
    setGridData(data);
  };

  const isNeedParentCheckBox = () => {
    let data = gridData?.filter(
      (item) => !item?.application?.isReject && !item?.application?.isApproved
    );
    if (Array.isArray(data) && data?.length < 1) {
      return false;
    } else {
      return true;
    }
  };

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const columns = (page, paginationSize) => [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: () => (
        <div>
          {isNeedParentCheckBox() && (
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={parentCheckHandler()}
              onChange={(e) => {
                parentChangeHandler(e);
                let data = filterLanding.map((item) => ({
                  ...item,
                  selectCheckbox:
                    !item?.application?.isReject &&
                    !item?.application?.isApproved
                      ? e.target.checked
                      : false,
                }));
                setFilterLanding(data);
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>Employee Id</span>
        </div>
      ),
      dataIndex: "employeeCode",
      render: (_, record, index) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {!(
            record?.application?.isApproved || record?.application?.isReject
          ) && (
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
                let data = gridData?.map((item) => {
                  if (item.intId === record.intId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                let data2 = filterLanding.map((item) => {
                  if (item.intId === record.intId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setFilterLanding(data2);
                setGridData([...data]);
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>{record?.employeeCode}</span>
        </div>
      ),
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (EmployeeName) => (
        <div className="d-flex align-items-center">
          <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
          <span className="ml-2">{EmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: "Date",
      dataIndex: "dteAttendanceDate",
      render: (date) => dateFormatter(date),
      sorter: true,
      filter: true,
      isDate: true,
    },
    {
      title: "Actual In-Time",
      dataIndex: "dteStartTime",
    },
    {
      title: "Actual Out-Time",
      dataIndex: "dteEndTime",
    },
    {
      title: "Request In-Time",
      dataIndex: "timeInTime",
    },
    {
      title: "Request Out-Time",
      dataIndex: "timeOutTime",
    },
    {
      title: "Actual Attendance",
      dataIndex: "actualAttendanceStatus",
      render: (_, record) => (
        <>
          {record?.strCurrentStatus === "Present" && (
            <Chips label="Present" classess="success" />
          )}
          {record?.strCurrentStatus === "Late" && (
            <Chips label="Late" classess="warning" />
          )}
          {record?.strCurrentStatus === "Holiday" && (
            <Chips label="Holiday" classess="secondary" />
          )}
          {record?.strCurrentStatus === "Offday" && (
            <Chips label="Offday" classess="primary" />
          )}
          {record?.strCurrentStatus === "Leave" && (
            <Chips label="Leave" classess="indigo" />
          )}
          {record?.strCurrentStatus === "Movement" && (
            <Chips label="Movement" classess="movement" />
          )}
          {record?.strCurrentStatus === "Absent" && (
            <Chips label="Absent" classess="danger" />
          )}
        </>
      ),
      filter: true,
      sorter: false,
    },
    {
      title: "Request Attendance",
      dataIndex: "strRequestStatus",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <LightTooltip
            title={
              <div className="movement-tooltip p-1">
                <div className="">
                  <p className="tooltip-title">Reason</p>
                  <p className="tooltip-subTitle mb-0">{record?.strRemarks}</p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlined sx={{ marginRight: "12px" }} />
          </LightTooltip>
          {record?.strRequestStatus === "Present" ? (
            <PBadge text="Present" type="success" />
          ) : record?.strRequestStatus === "Absent" ? (
            <PBadge text="Absent" type="warning" />
          ) : record?.strRequestStatus === "Holiday" ? (
            <PBadge text="Holiday" type="light" />
          ) : record?.strRequestStatus === "Late" ? (
            <PBadge text="Late" type="danger" />
          ) : record?.strRequestStatus === "Offday" ? (
            <PBadge text="Offday" type="light" />
          ) : record?.strRequestStatus === "Leave" ? (
            <PBadge text="Leave" type="light" />
          ) : record?.strRequestStatus === "Movement" ? (
            <PBadge text="Movement" type="light" />
          ) : (
            <PBadge text={record?.strRequestStatus} type="light" />
          )}
        </div>
      ),
    },
    {
      title: "Waiting Stage",
      dataIndex: "waitingStage",
      hidden: isOfficeAdmin,
    },
    {
      title: "Approval Status",
      dataIndex: "ApplicationStatus",
      render: (_, record) => (
        <div className="d-flex align-items-center tableBody-title">
          {record?.application?.strStatus === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.application?.strStatus === "Pending" && (
            <>
              <div className="actionChip tableBody-title">
                <Chips label="Pending" classess="warning" />
              </div>
              <div className="d-flex actionIcon align-items-center justify-content-start">
                <Tooltip title="Accept">
                  <div
                    className="p-2 mr-0 muiIconHover success mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      singlePopup("approve", "Approve", record);
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
                    className="p-2 muiIconHover  danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      singlePopup("reject", "Reject", record);
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
            </>
          )}
          {record?.application?.strStatus === "Rejected" && (
            <Chips label="Reject" classess="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="table-card-styled tableOne" style={{ overflowX: "hidden" }}>
      {gridData?.length > 0 ? (
        <AntTable
          data={gridData}
          columnsData={columns(page, paginationSize)}
          setPage={setPage}
          setPaginationSize={setPaginationSize}
          rowKey={(item) => item?.application?.intId}
          setColumnsData={(allData) => {
            if (allData?.length === gridData.length) {
              let temp = allData?.map((item) => {
                return {
                  ...item,
                  selectCheckbox: false,
                };
              });
              setFilterLanding(temp);
              setGridData(temp);
              return;
            }
            setFilterLanding(allData);
          }}
        />
      ) : (
        <NoResult title="" para="" />
      )}
    </div>
  );
};

export default StyledTable;
