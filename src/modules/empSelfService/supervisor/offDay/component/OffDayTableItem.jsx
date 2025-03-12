import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../../utility/customColor";

const OffDayTableItem = ({
  item,
  rowDto,
  setRowDto,
  index,
  setCreateModal,
  updateSingleData,
  setEmpId,
  setSingleData,
  setIsMulti,
  permission,
}) => {
  // eslint-disable-next-line no-unused-vars
  const { userId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const printDays = (item) => {
    let data = [];
    item?.isFriday && data.push("Friday");
    item?.isSaturday && data.push("Saturday");
    item?.isSunday && data.push("Sunday");
    item?.isMonday && data.push("Monday");
    item?.isTuesday && data.push("Tuesday");
    item?.isWednesday && data.push("Wednesday");
    item?.isThursday && data.push("Thursday");

    let str = "";
    data.forEach((item, index) => {
      str = str + `${index > 0 ? ", " : ""}` + item;
    });
    // console.log("str", str)
    return str;
  };

  return (
    <>
      <td style={{ width: "30px" }}>
        <div className="content tableBody-title">{index + 1}</div>
      </td>
      <td>
        <div className="content tableBody-title" style={{ marginLeft: "-2px" }}>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              color: gray900,
              checkedColor: greenColor,
              padding: "0 0 0 3px !important",
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
      <td style={{ width: "30px" }}>
        <div className="tableBody-title">{item?.EmployeeCode}</div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="employeeInfo d-flex align-items-left">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.EmployeeName}
            />
            <div className="employeeTitle ml-2">
              <p className="content tableBody-title">{item?.EmployeeName}</p>
            </div>
          </div>
        </div>
      </td>

      <td className="text-left ml-2">
        <span className="content tableBody-title">{item?.DesignationName}</span>
      </td>
      <td className="text-left ml-2">
        {" "}
        <span className="content tableBody-title">{item?.WorkplaceName}</span>
      </td>
      <td className="text-left">
        <span className="content tableBody-title">{item?.SupervisorName}</span>
      </td>

      <td>
        <p className="tableBody-title text-left">
          {!item?.isFriday &&
          !item?.isSaturday &&
          !item?.isSunday &&
          !item?.isMonday &&
          !item?.isThursday &&
          !item?.isTuesday &&
          !item?.isWednesday
            ? "N/A"
            : printDays(item)}
        </p>
      </td>
      <td>
        {item?.isFriday ||
        item?.isSaturday ||
        item?.isSunday ||
        item?.isMonday ||
        item?.isThursday ||
        item?.isTuesday ||
        item?.isWednesday ? (
          <Tooltip title="Edit" arrow>
            <button type="button" className="iconButton">
              <EditOutlinedIcon
                sx={{ fontSize: "20px" }}
                onClick={(e) => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  updateSingleData(item);
                  setEmpId(item?.EmployeeId);
                  setCreateModal(true);
                }}
              />
            </button>
          </Tooltip>
        ) : (
          <button
            className="btn btn-default"
            style={{
              height: "24px",
              fontSize: "12px",
              padding: "0px 12px",
            }}
            onClick={(e) => {
              if (!permission?.isCreate)
                return toast.warn("You don't have permission");
              setIsMulti(false);
              setSingleData({
                ...item,
                isEdit: false,
              });
              setCreateModal(true);
            }}
          >
            Assign
          </button>
        )}
      </td>
    </>
  );
};

export default OffDayTableItem;
