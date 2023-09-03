/* eslint-disable no-unused-vars */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../common/MuiIcon";
import SortingIcon from "../../../../../common/SortingIcon";
import { greenColor } from "../../../../../utility/customColor";
import { commonSortByFilter, leaveEncashmenApproveReject } from "../helper";

const CardTable = ({ propsObj }) => {
  const { rowDto, setRowDto, getLandingData, allData } = propsObj;

  const { employeeId, userId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [departmentOrder, setDepartmentOrder] = useState("desc");

  const demoPopup = (action, isAction, data) => {
    const payload = [
      {
        leaveNencashmentApplicationId: data?.intLeaveNEncashmentApplicationId,
        employeeId: data?.employeeId,
        requestDays: data?.intRequestDays,
        isEncash: data?.isEncash,
        insertUserId: userId,
        updateUserId: "",
        approverEmployeeId: employeeId,
        isReject: isAction,
      },
    ];
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Are you sure you want to ${action} this application? `,
      yesAlertFunc: () => {
        leaveEncashmenApproveReject(payload, getLandingData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <div className="table-card-styled pt-3">
      <table className="table movement-table">
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>SL</th>
            <th scope="col" className="m-0 p-0">
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  color: greenColor,
                }}
                name="allSelected"
                checked={
                  rowDto.length && rowDto?.every((item) => item?.selectCheckbox)
                }
                onChange={(e) => {
                  setRowDto(
                    rowDto?.map((item) => ({
                      ...item,
                      selectCheckbox: e.target.checked,
                    }))
                  );
                }}
              />
            </th>
            <th>
              <div
                className="sortable"
                onClick={() => {
                  setEmployeeOrder(employeeOrder === "desc" ? "asc" : "desc");
                  commonSortByFilter(
                    employeeOrder,
                    "strEmployeeName",
                    allData,
                    setRowDto
                  );
                }}
              >
                <span>Employee</span>
                <div>
                  <SortingIcon viewOrder={employeeOrder}></SortingIcon>
                </div>
              </div>
            </th>
            <th>
              <div
                className="sortable"
                onClick={() => {
                  setDesignationOrder(
                    designationOrder === "desc" ? "asc" : "desc"
                  );
                  commonSortByFilter(
                    designationOrder,
                    "strDesignationName",
                    allData,
                    setRowDto
                  );
                }}
              >
                <span>Designation</span>
                <div>
                  <SortingIcon viewOrder={designationOrder}></SortingIcon>
                </div>
              </div>
            </th>
            <th>
              <div
                className="sortable"
                onClick={() => {
                  setDepartmentOrder(
                    departmentOrder === "desc" ? "asc" : "desc"
                  );
                  commonSortByFilter(
                    departmentOrder,
                    "strDepartmentName",
                    allData,
                    setRowDto
                  );
                }}
              >
                <span>Department</span>
                <div>
                  <SortingIcon viewOrder={departmentOrder}></SortingIcon>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center">
                Year<SortingIcon></SortingIcon>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-end">
                Total Balance<SortingIcon></SortingIcon>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-end">
                Balance to Encash<SortingIcon></SortingIcon>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-end">
                Amount<SortingIcon></SortingIcon>
              </div>
            </th>
            <th width="10%">
              <div className="d-flex align-items-center justify-content-center">
                Status<SortingIcon></SortingIcon>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rowDto.map((data, index) => (
            <tr key={index}>
              <td
                className="text-center"
                style={{ color: "rgba(0, 0, 0, 0.6)" }}
              >
                {index + 1}
              </td>
              <td className="m-0 p-0">
                <div onClick={(e) => e.stopPropagation()}>
                  <FormikCheckBox
                    styleObj={{
                      margin: "0 auto!important",
                      color: greenColor,
                    }}
                    name="selectCheckbox"
                    color={greenColor}
                    checked={rowDto[index]?.selectCheckbox}
                    onChange={(e) => {
                      let data = [...rowDto];
                      data[index].selectCheckbox = e.target.checked;
                      setRowDto([...data]);
                    }}
                  />
                </div>
              </td>
              <td>
                <div className="employeeInfo d-flex align-items-center">
                  <AvatarComponent
                    letterCount={1}
                    label={data?.strEmployeeName}
                  />
                  <div className="employeeTitle ml-2">
                    <p className="employeeName">
                      {data?.strEmployeeName} [{data?.strEmployeeCode}]
                    </p>
                  </div>
                </div>
              </td>
              <td>
                {data?.strDesignationName}, {data?.empType}
              </td>
              <td>{data?.strDepartmentName}</td>
              <td className="text-center">{data?.year}</td>
              <td className="text-right">{data?.totalBalance}</td>
              <td className="text-right">{data?.encashBalance}</td>
              <td className="text-right">{data?.amount}</td>

              <td className="action-col text-center">
                {data?.strStatus && data?.strStatus === "Approved" && (
                  <Chips label="Approved" classess="success" />
                )}
                {data?.strStatus && data?.strStatus === "Rejected" && (
                  <Chips label="Rejected" classess="danger" />
                )}
                {data?.strStatus && data?.strStatus === "Pending" && (
                  <>
                    <div className="actionChip">
                      <Chips label="Pending" classess=" warning" />
                    </div>
                    <div className="d-flex actionIcon justify-content-center">
                      <Tooltip title="Accept">
                        <div
                          className="p-2 mr-0 muiIconHover success "
                          onClick={() => {
                            demoPopup("Approve", false, data);
                          }}
                        >
                          <MuiIcon
                            icon={<CheckCircle sx={{ color: "#34A853" }} />}
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <div
                          className="p-2 muiIconHover  danger"
                          onClick={() => {
                            demoPopup("Reject", true, data);
                          }}
                        >
                          <MuiIcon
                            icon={<Cancel sx={{ color: "#FF4842" }} />}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
