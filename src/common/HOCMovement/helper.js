import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TableButton } from "Components";
import PBadge from "Components/Badge";
import axios from "axios";
import { LightTooltip } from "common/LightTooltip";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { timeFormatter } from "utility/timeFormatter";

export const getMovementApplicationLanding = async (
  tableName,
  accId,
  buId,
  data,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/MasterData/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${buId}&intId=${data?.empId}&FromDate=${data?.fromDate}&ToDate=${data?.toDate}&EmpId=${data?.empId}&MovementTypeId=${data?.movementTypeId}&ApplicationDate=${data?.applicationDate}&StatusId=${data?.statusId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getApprovalLogHistoriesById = async (
  data,
  buId,
  employeeId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/ApprovalHistoryLog/GetApprovalLogHistoriesById?BusinessUnitId=${buId}&applicationId=${data?.MovementId}&employeeId=${employeeId}&applicationType=Movement`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const createMovementApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/CRUDMovementApplication`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    console.log({ error });
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const empMgmtMoveApplicationDto = (
  handleIconHover,
  setIsEdit,
  setSingleData,
  setLoading,
  demoPopupForDelete,
  values,
  setShowTooltip,
  showTooltip
) => {
  return [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
      width: 30,
      fixed: "left",
    },
    {
      title: "Movement Type",
      dataIndex: "MovementType",
    },

    {
      title: "From Date",
      dataIndex: "FromDate",
      render: (date) => dateFormatter(date),
    },
    {
      title: "Start Time",
      dataIndex: "FromTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
    },
    {
      title: "To Date",
      dataIndex: "ToDate",
      render: (date) => dateFormatter(date),
    },
    {
      title: "End Time",
      dataIndex: "ToTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
    },
    {
      title: "Application Date",
      dataIndex: "ApplicationDate",
      render: (data) => <div>{data && dateFormatter(data)}</div>,
    },
    {
      title: "Location",
      dataIndex: "Location",
    },
    {
      title: "Reason",
      dataIndex: "Reason",
    },

    {
      title: "Status",
      dataIndex: "Status",
      render: (data, rec) => (
        <div className="d-flex">
          <div className="d-flex align-items-center">
            <LightTooltip
              onMouseEnter={() =>
                handleIconHover(rec, setShowTooltip, setLoading)
              }
              title={
                <div>
                  {showTooltip?.data?.length ? (
                    showTooltip.data.map((tooltipItem, index) => (
                      <div key={index} className="movement-tooltip p-1">
                        <div className="border-bottom">
                          <p className="tooltip-title">
                            {tooltipItem?.strApproverName}
                          </p>
                          <p className="tooltip-subTitle">
                            {tooltipItem?.strComments}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="movement-tooltip p-1">
                      <p className="tooltip-title">No Remarks</p>
                    </div>
                  )}
                </div>
              }
            >
              <InfoOutlinedIcon
                sx={{ marginRight: "12px", color: "rgba(0, 0, 0, 0.6)" }}
              />
            </LightTooltip>
          </div>
          <div>
            {data === "Approved" && <PBadge text={data} type="success" />}
            {data === "Pending" && <PBadge text={data} type="warning" />}
            {data === "Rejected" && <PBadge text={data} type="danger" />}
            {data === "Process" && <PBadge text={data} type="warning" />}
          </div>
        </div>
        // ------------------
      ),
    },

    {
      width: 50,
      align: "center",
      render: (data, rec) => (
        <>
          <TableButton
            buttonsList={[
              data === "Pending" && {
                type: "edit",
                onClick: (e) => {
                  e.stopPropagation();
                  setIsEdit(true);
                  e.stopPropagation();
                  // scrollRef.current.scrollIntoView({
                  //   behavior: "smooth",
                  // });
                  setSingleData(rec);
                },
              },

              data === "Pending" && {
                type: "delete",
                onClick: (e) => {
                  e.stopPropagation();
                  setSingleData("");
                  demoPopupForDelete(data, values);
                },
              },
            ]}
          />
        </>
      ),
    },
  ];
};
