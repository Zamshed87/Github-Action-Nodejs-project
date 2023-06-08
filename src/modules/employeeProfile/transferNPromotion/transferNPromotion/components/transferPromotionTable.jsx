/* eslint-disable no-unused-vars */
import { toast } from "react-toastify";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const TransferPromotionTable = ({
  item,
  index,
  setSingleData,
  permission,
  setAnchorEl,
}) => {
  return (
    <>
      <td className="text-center align-middle">
        <div>{index + 1}</div>
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
          <div>{item?.wingNameFrom}</div>
          <div>{item?.soldDepoNameFrom}</div>
          <div>{item?.regionNameFrom}</div>
          <div>{item?.areaNameFrom}</div>
          <div>{item?.territoryNameFrom}</div>
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
          <div>{item?.wingName}</div>
          <div>{item?.soldDepoName}</div>
          <div>{item?.regionName}</div>
          <div>{item?.areaName}</div>
          <div>{item?.territoryName}</div>
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
        {item?.strStatus === "Pending" && (
          <Chips label="Pending" classess="warning" />
        )}
        {item?.strStatus === "Rejected" && (
          <Chips label="Rejected" classess="danger" />
        )}
        {item?.strStatus === "Released" && <Chips label="Released" />}
        {item?.strStatus === "Joined" && <Chips label="Joined" />}
        {item?.strStatus === "Approved" &&
          (item?.strTransferNpromotionType === "Promotion" ? (
            <Chips label="Approved" classess="success" />
          ) : (
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              className="btn btn-default"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                setAnchorEl(e.currentTarget);
                setSingleData(item);
              }}
            >
              Release
            </button>
          ))}
      </td>
    </>
  );
};

export default TransferPromotionTable;
