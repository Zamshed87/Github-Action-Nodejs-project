import { DeleteOutline, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../../common/LightTooltip";
import { gray600, gray900 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";

export const onGetAssetRequisitionLanding = (
  getAssetRequisitionApplication,
  orgId,
  buId,
  employeeId,
  values,
  setRowDto
) => {
  getAssetRequisitionApplication(
    `/AssetManagement/GetAssetRequisitionForSelf?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=0&workPlaceId=0&employeeId=${employeeId}`,
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
      render: (_, item) => (
        <>
          {item?.status === "Approved" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item?.status === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item?.status === "Denied" && (
            <Chips label="Denied" classess="primary p-2" />
          )}
          {item?.status === "Acknowledged" && (
            <Chips label="Acknowledged" classess="" />
          )}
          {item?.status === "Rejected" && (
            <>
              <Chips label="Rejected" classess="danger p-2 mr-2" />
              {item?.RejectedBy && (
                <LightTooltip
                  title={
                    <div className="p-1">
                      <div className="mb-1">
                        <p
                          className="tooltip-title"
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Rejected by {item?.RejectedBy}
                        </p>
                      </div>
                    </div>
                  }
                  arrow
                >
                  <InfoOutlined
                    sx={{
                      color: gray900,
                    }}
                  />
                </LightTooltip>
              )}
            </>
          )}
        </>
      ),
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
                      `/SelfService/asset/assetRequisition/edit/${item?.assetRequisitionId}`
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
