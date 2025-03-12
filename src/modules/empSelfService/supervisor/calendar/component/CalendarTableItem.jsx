/* eslint-disable no-unused-vars */
import { toast } from "react-toastify";
import AvatarComponent from "../../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import RoasterInfo from "./RosterInfo";

const CalendarTableItem = ({
  item,
  index,
  setSingleData,
  setCreateModal,
  rowDtoHandler,
  permission,
}) => {
  return (
    <>
      <td style={{ width: "30px" }}>
        <div className="content tableBody-title pl-1">{index + 1}</div>
      </td>
      <td>
        <div
          className="d-flex align-items-center"
          style={{ marginLeft: "1px" }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0 0 0 2px !important",
              }}
              name="selectCheckbox"
              color={greenColor}
              checked={item?.isAssigned}
              onChange={(e) => {
                rowDtoHandler(index);
              }}
            />
          </div>
        </div>
      </td>
      <td style={{ width: "30px" }}>
        <div className="tableBody-title pl-1">{item?.EmployeeCode}</div>
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.EmployeeName}
            />
          </div>
          <div className="ml-2">
            <span className="content tableBody-title">
              {item?.EmployeeName}{" "}
            </span>
          </div>
        </div>
      </td>
      <td width="15%">
        <p className="tableBody-title text-left ml-2">
          {item?.DesignationName}
        </p>
      </td>
      <td width="10%">
        <p className="tableBody-title text-left">{item?.DepartmentName}</p>
      </td>
      <td>
        <span className="tableBody-title text-left">
          {item?.SupervisorName}
        </span>
      </td>
      <td width="10%">
        <span className="text-center content tableBody-title">
          {dateFormatter(item?.GenerateDate)}
        </span>
      </td>
      <td width="10%">
        <span className="text-center content tableBody-title">
          {dateFormatter(item?.JoiningDate)}
        </span>
      </td>
      <td width="10%">
        <span className="content tableBody-title">
          {item?.RosterGroupName}{" "}
        </span>
      </td>
      <td>
        {item?.CalendarName ? (
          <div className="d-flex align-items-center content tableBody-title">
            <RoasterInfo item={item} />
            <div className="content tableBody-title pl-2">
              {item.CalendarName}{" "}
            </div>
          </div>
        ) : (
          ""
        )}
      </td>
      <td>
        <button
          className="btn btn-default"
          style={{
            height: "24px",
            fontSize: "12px",
            padding: "0px 12px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!permission?.isCreate)
              return toast.warn("You don't have permission");
            setSingleData(item);
            setCreateModal(true);
            rowDtoHandler(index);
          }}
        >
          Assign
        </button>
      </td>
    </>
  );
};

export default CalendarTableItem;
