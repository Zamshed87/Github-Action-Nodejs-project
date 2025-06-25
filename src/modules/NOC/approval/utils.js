import { Cancel, CheckCircle } from "@mui/icons-material";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { Tooltip } from "@mui/material";
import MuiIcon from "../../../../common/MuiIcon";

const isNeedParentCheckBox = (gridData) => {
  let data = gridData?.filter(
    (item) => !item?.application?.isReject && !item?.application?.isApproved
  );
  if (Array.isArray(data) && data?.length < 1) {
    return false;
  } else {
    return true;
  }
};

export const approvedNOCHandler = (
  approvedAPIAction,
  payload,
  callback
) => {
  approvedAPIAction(
    `/ApprovalPipeline/NOCApplicationApproval`,
    payload,
    () => {
      callback?.();
    },
    true
  );
};

const parentCheckHandler = (gridData) => {
  let isCheck = true;
  let filterData = gridData?.filter(
    (item) => !item?.isReject && !item?.isApproved && !item.selectCheckbox
  );

  if (Array.isArray(filterData) && filterData.length > 0) {
    isCheck = false;
  }
  return isCheck;
};

const parentChangeHandler = (
  e,
  gridData,
  updateApplicationData,
  setGridData,
  setUpdateApplicationData
) => {
  let data = [];
  let filterData = [];
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
  updateApplicationData.forEach((item) => {
    let payload = {
      ...item,
      selectCheckbox:
        !item?.application?.isReject && !item?.application?.isApproved
          ? e.target.checked
          : false,
    };
    filterData.push(payload);
  });
  setGridData(data);
  setUpdateApplicationData(filterData);
};

export const filterData = (
  keywords,
  gridData,
  setGridData,
  setUpdateApplicationData
) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = gridData?.filter(
      (item) =>
        regex.test(item?.employeeName?.toLowerCase()) ||
        regex.test(item?.alternateEmployeeName?.toLowerCase()) ||
        regex.test(item?.designationName?.toLowerCase()) ||
        regex.test(item?.alternateEmployeeCode?.toLowerCase()) ||
        regex.test(item?.employeeCode?.toLowerCase())
    );
    setGridData(newData);
    setUpdateApplicationData(newData);
  } catch {
    setGridData([]);
    setUpdateApplicationData([]);
  }
};

export const nocApprovalDtoColumn = (
  updateApplicationData,
  setUpdateApplicationData,
  page,
  paginationSize,
  gridData,
  setGridData,
  setFieldValue,
  isOfficeAdmin,
  singlePopup
) => {
  return [
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
          {isNeedParentCheckBox(gridData) && (
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={parentCheckHandler(gridData)}
              onChange={(e) => {
                parentChangeHandler(
                  e,
                  gridData,
                  updateApplicationData,
                  setGridData,
                  setUpdateApplicationData
                );
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>Emp Id</span>
        </div>
      ),
      dataIndex: "strEmployeeCode",
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
                  if (item.nocApplicationId === record.nocApplicationId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                let filterData = updateApplicationData?.map((item) => {
                  if (item.nocApplicationId === record.nocApplicationId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setGridData([...data]);
                setUpdateApplicationData([...filterData]);
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>{record?.strEmployeeCode}</span>
        </div>
      ),
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={record?.strEmployeeName?.trim()}
          />
          <span className="ml-2">{record?.strEmployeeName}</span>
        </div>
      ),
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
    // {
    //   title: "Workplace Group",
    //   dataIndex: "workplaceGroupName",
    //   sorter: true,
    //   filter: true,
    // },
    {
      title: "Country Name",
      dataIndex: "countryName",
      sorter: true,
    },
    {
      title: "NOC  Type",
      dataIndex: "nocType",
      sorter: true,
    },
    {
      title: "Date Range",
      dataIndex: "dteFromDate",
      sorter: true,
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <span>{dateFormatter(record?.dteFromDate)}</span>
          <span className="mx-2">-</span>
          <span>{dateFormatter(record?.dteToDate)}</span>
        </div>
      ),
    },
    // {
    //   title: "Alternate Designation",
    //   dataIndex: "alternateDesignation",
    //   sorter: true,
    // },
    {
      title: "Application Date",
      dataIndex: "dteApplicationDate",
      render: (_, reocrd) => dateFormatter(reocrd?.application?.dteCreatedAt),
    },
    {
      title: "Waiting Stage",
      dataIndex: "currentStage",
      hidden: isOfficeAdmin,
    },
    {
      title: "Status",
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
};
