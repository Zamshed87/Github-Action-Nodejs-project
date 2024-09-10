/* eslint-disable no-unused-vars */
import { toast } from "react-toastify";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { todayDate } from "../../../../../utility/todayDate";
import { useHistory } from "react-router-dom";

const JoiningTable = ({ item, index, permission, page, paginationSize }) => {
  const history = useHistory();

  return (
    <>
      <td className="text-center align-middle">
        <div>{(page - 1) * paginationSize + index + 1}</div>
      </td>
      <td className="align-middle">
        <div className="employeeInfo d-flex ">
          <AvatarComponent letterCount={1} label={item?.strEmployeeName} />
          <div className="employeeTitle pl-2">
            <div className="tableBody-title employeeName text-nowrap">
              {item?.strEmployeeName}
            </div>
          </div>
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
          className=" "
        >
          <div>{item?.businessUnitNameFrom}</div>
          <div>{item?.workplaceGroupNameFrom}</div>
          <div>{item?.workplaceNameFrom}</div>
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
          <div>{item?.departmentNameFrom}</div>
          <div>{item?.sectionNameFrom || "N/A"}</div>
          <div>{item?.designationNameFrom}</div>
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
        >
          <div>{item?.businessUnitName}</div>
          <div>{item?.workplaceGroupName}</div>
          <div>{item?.workplaceName}</div>
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
          <div>{item?.departmentName}</div>
          <div>{item?.strSectionName || "N/A"}</div>
          <div>{item?.designationName}</div>
        </div>
      </td>
      <td>
        <div
          style={{
            color: "rgba(95, 99, 104, 1)",
          }}
          className=" "
        >
          <div>{item?.strTransferNpromotionType}</div>
        </div>
      </td>
      <td>
        <div>{dateFormatter(item?.dteEffectiveDate)}</div>
      </td>
      <td>
        <div>{dateFormatter(item?.dteReleaseDate)}</div>
      </td>
      <td>
        {!item?.dteReleaseDate &&
          (item?.strTransferNpromotionType === "Promotion"
            ? "promoted"
            : "Yet to release")}
        {item?.strStatus === "Joined" && (
          <Chips label="Joined" classess="success" />
        )}
        {item?.strStatus === "Released" && (
          <button
            style={{
              height: "24px",
              fontSize: "12px",
              padding: "0px 12px 0px 12px",
            }}
            className="btn btn-default"
            type="button"
            disabled={item?.dteReleaseDate > todayDate() + "T00:00:00"}
            onClick={(e) => {
              e.stopPropagation();
              if (!permission?.isCreate)
                return toast.warn("You don't have permission");
              history.push(
                `/profile/transferandpromotion/joining/view/${item?.intTransferNpromotionId}`,
                {
                  employeeId: item?.intEmployeeId,
                  businessUnitId: item?.intBusinessUnitId,
                  workplaceGroupId: item?.intWorkplaceGroupId,
                  workplaceId: item?.intWorkplaceId,
                }
              );
            }}
          >
            Join
          </button>
        )}
      </td>
    </>
  );
};

export default JoiningTable;
