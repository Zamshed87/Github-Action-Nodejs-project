import { CheckOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "../../../common/Chips";
import { gray600 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";

export const onGetAssetListLanding = (
  getAssetRequisitionApplication,
  orgId,
  buId,
  employeeId,
  setRowDto
) => {
  getAssetRequisitionApplication(
    `/AssetManagement/GetAssetList?accountId=${orgId}&businessUnitId=${buId}&employeeId=${employeeId}`,
    (data) => {
      setRowDto(data);
    }
  );
};

export const filterAssetListLanding = (keywords, allData, setRowDto) => {
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

export const assetListSelfTableColumn = (
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
      title: "From Employee",
      dataIndex: "employeeName",
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
      dataIndex: "quantity",
      sorter: true,
      filter: true,
    },
    {
      title: "UoM",
      dataIndex: "uom",
      sorter: true,
      filter: true,
    },
    {
      title: "Source Type",
      dataIndex: "sourceType",
      sorter: true,
      filter: true,
    },
    {
      title: "Requisition/Transfer Date",
      dataIndex: "date",
      render: (date) => dateFormatter(date),
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
          {item?.status === "Acknowledged" && (
            <Chips label="Acknowledged" classess="" />
          )}
        </>
      ),
    },
    {
      title: "",
      render: (_, item) => (
        <div className="d-flex">
          {item?.status === "Approved" && (
            <Tooltip title="Acknowledged" arrow>
              <button className="iconButton" type="button">
                <CheckOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    const payload = {
                      id: item?.id,
                      sourceType: item?.sourceType,
                    };
                    deleteAssetRequisition(
                      `/AssetManagement/AssetAcknowledged`,
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
