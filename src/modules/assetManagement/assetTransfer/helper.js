import { DeleteOutline, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../../common/LightTooltip";
import { gray600, gray900 } from "../../../utility/customColor";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate
} from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";

export const onGetAssetTransferLanding = (
  getAssetTransfer,
  orgId,
  buId,
  values,
  setRowDto
) => {
  getAssetTransfer(
    `/AssetManagement/GetAssetTransfer?accountId=${orgId}&businessUnitId=${buId}&fromDate=${
      values?.filterFromDate || monthFirstDate()
    }&toDate=${values?.filterToDate || monthLastDate()}`,
    (data) => {
      setRowDto(data);
    }
  );
};

export const filterAssetTransferLanding = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = allData?.filter(
      (item) =>
        regex.test(item?.itemName?.toLowerCase()) ||
        regex.test(item?.employeeName?.toLowerCase()) ||
        regex.test(item?.itemQuantity)
    );
    setRowDto(newData);
  } catch {
    setRowDto([]);
  }
};

export const assetTransferTableColumn = (
  history,
  deleteDirectAsset,
  cb,
  employeeId,
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
      title: "From Employee",
      dataIndex: "fromEmployeeName",
      sorter: true,
      filter: true,
    },
    {
      title: "To Employee",
      dataIndex: "toEmployeeName",
      sorter: true,
      filter: true,
    },
    {
      title: "Item Category",
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
      dataIndex: "transferQuantity",
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
      title: "Transfer Date",
      dataIndex: "transferDate",
      render: (transferDate) => dateFormatter(transferDate),
      isDate: true,
      sorter: false,
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
                      `/assetManagement/assetAssign/assetTransfer/edit/${item?.assetTransferId}`
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
                      assetTransferId: item?.assetTransferId,
                      accountId: orgId,
                      businessUnitId: buId,
                      fromEmployeeId: item?.fromEmployeeId,
                      itemId: item?.itemId,
                      transferQuantity: item?.transferQuantity,
                      toEmployeeId: item?.toEmployeeId,
                      transferDate: item?.transferDate,
                      remarks: item?.remarks,
                      isActive: false,
                      updatedAt: todayDate(),
                      updatedBy: employeeId,
                    };
                    deleteDirectAsset(
                      `/AssetManagement/SaveAssetTransfer`,
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
