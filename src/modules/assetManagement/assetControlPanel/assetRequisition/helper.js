import { DeleteOutline, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "common/Chips";
import { LightTooltip } from "common/LightTooltip";
import { gray600, gray900 } from "utility/customColor";
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";

export const onGetAssetRequisitionLanding = (
  getAssetRequisitionApplication,
  orgId,
  buId,
  employeeId,
  values,
  setRowDto,
  wgId,
  date
) => {
  const fromDate = date?.fromDate
    ? `&fromDate=${dateFormatterForInput(date?.fromDate)}`
    : "";
  const toDate = date?.toDate
    ? `&toDate=${dateFormatterForInput(date?.toDate)}`
    : "";
  getAssetRequisitionApplication(
    `/AssetManagement/GetAssetRequisitionForSelf?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&employeeId=${0}${fromDate}${toDate}`,
    (data) => {
      setRowDto(data);
    }
  );
};

export const filterAssetRequisitionLanding = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = allData?.filter(
      (item) =>
        regex.test(item?.itemName?.toLowerCase()) ||
        regex.test(item?.reqisitionQuantity)
    );
    setRowDto(newData);
  } catch {
    setRowDto([]);
  }
};

export const assetRequisitionSelfTableColumn = (
  history,
  employeeId,
  deleteAssetRequisition,
  cb,
  orgId,
  buId,
  page,
  paginationSize
) => {
  return [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      render: (value, item, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      width: "30px",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: true,
      filter: true,
    },
    {
      title: "Category Name",
      dataIndex: "itemCategory",
      sorter: true,
      filter: true,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      sorter: true,
      filter: true,
    },
    {
      title: "Quantity",
      dataIndex: "reqisitionQuantity",
      sorter: true,
      filter: true,
    },
    {
      title: "UoM",
      dataIndex: "itemUom",
      sorter: true,
      filter: true,
    },
    {
      title: "Requisition Date",
      dataIndex: "reqisitionDate",
      render: (reqisitionDate) => dateFormatter(reqisitionDate),
      sorter: true,
      filter: true,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      filter: true,
      render: (_, item) => {
        let chipLabel = "";
        let chipClass = "";
        let tooltipContent = null;

        if (item?.status === "Approved") {
          chipLabel = "Approved";
          chipClass = "success p-2";
        } else if (item?.status === "Pending") {
          chipLabel = "Pending";
          chipClass = "warning p-2";
        } else if (item?.status === "Denied") {
          chipLabel = "Denied";
          chipClass = "primary p-2";
        } else if (item?.status === "Acknowledged") {
          chipLabel = "Acknowledged";
          chipClass = "";
        } else if (item?.status === "Rejected") {
          chipLabel = "Rejected";
          chipClass = "danger p-2 mr-2";
          if (item?.RejectedBy) {
            tooltipContent = (
              <LightTooltip
                title={
                  <div className="p-1">
                    <div className="mb-1">
                      <p
                        className="tooltip-title"
                        style={{ fontSize: "12px", fontWeight: "600" }}
                      >
                        Rejected by {item?.RejectedBy}
                      </p>
                    </div>
                  </div>
                }
                arrow
              >
                <InfoOutlined sx={{ color: gray900 }} />
              </LightTooltip>
            );
          }
        } else if (item?.status === "Approved By Line Manager") {
          chipLabel = "Approved By Line Manager";
          chipClass = "info p-2";
        }

        return (
          <>
            <Chips label={chipLabel} classess={chipClass} />
            {tooltipContent && tooltipContent}
          </>
        );
      },
    },

    {
      title: "",
      render: (_, item) => (
        <div className="d-flex">
          {item?.status === "Pending" && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(
                      `/assetManagement/assetControlPanel/assetRequisition/edit/${item?.assetRequisitionId}`
                    );
                  }}
                />
              </button>
            </Tooltip>
          )}
          {item?.status === "Pending" && (
            <Tooltip title="Delete" arrow>
              <button className="iconButton" type="button">
                <DeleteOutline
                  onClick={(e) => {
                    e.stopPropagation();
                    const payload = {
                      assetRequisitionId: item?.assetRequisitionId,
                      reqisitionQuantity: item?.reqisitionQuantity,
                      updatedAt: item?.updatedAt || todayDate(),
                      updatedBy: item?.updatedBy || employeeId,
                      itemId: item?.itemId,
                      isDenied: item?.isDenied,
                      remarks: item?.remarks,
                      employeeId: item?.employeeId,
                      reqisitionDate: item?.reqisitionDate,
                      active: false,
                    };
                    deleteAssetRequisition(
                      `/AssetManagement/SaveAssetRequisition`,
                      payload,
                      cb,
                      true
                    );
                  }}
                />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
};
