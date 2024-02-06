/* eslint-disable no-unused-vars */
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import IConfirmModal from "../../../../../common/IConfirmModal";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { todayDate } from "../../../../../utility/todayDate";
import { joinTransfer } from "../helper";

const JoiningTable = ({
  item,
  index,
  setSingleData,
  singleData,
  permission,
  getData,
  setLoading,
  page,
  paginationSize,
  values,
}) => {
  const { orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

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
        <div>{dateFormatter(item?.dteReleaseDate)}</div>
      </td>
      <td>
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
              let confirmObject = {
                closeOnClickOutside: false,
                message: ` Do you want to join? `,
                yesAlertFunc: () => {
                  joinTransfer(item, orgId, employeeId, setLoading, () => {
                    setSingleData({});
                    getData(
                      {
                        current: page,
                        pageSize: paginationSize,
                      },
                      values?.filterFromDate,
                      values?.filterToDate,
                      values?.search
                    );
                  });
                },
                noAlertFunc: () => {},
              };
              IConfirmModal(confirmObject);
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
