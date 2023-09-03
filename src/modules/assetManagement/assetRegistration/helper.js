import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { gray600 } from "../../../utility/customColor";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";

export const onGetAssetApplicationLanding = (
  getAssetApplication,
  item,
  orgId,
  buId,
  setRowDto
) => {
  getAssetApplication(
    `/AssetManagement/GetAsset?fromDate=${
      item?.filterFromDate || monthFirstDate()
    }&toDate=${item?.filterToDate || monthLastDate()}`,
    (data) => {
      setRowDto(data);
    }
  );
};

export const filterExpenseApplicationLanding = (
  keywords,
  allData,
  setRowDto
) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = allData?.filter(
      (item) =>
        regex.test(item?.employeeCode?.toLowerCase()) ||
        regex.test(item?.EmployeeName?.toLowerCase()) ||
        regex.test(item?.strExpenseType?.toLowerCase())
    );
    setRowDto(newData);
  } catch {
    setRowDto([]);
  }
};

export const assetLandingTableColumn = (
  history,
  deleteAsset,
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
      title: "Asset Code",
      dataIndex: "assetCode",
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
      title: "UoM",
      dataIndex: "itemUom",
      render: (value) => <>{value ? value : "-"}</>,
      sorter: true,
      filter: true,
    },

    {
      title: "Category",
      dataIndex: "itemCategory",
      sorter: true,
      filter: true,
    },
    {
      title: "Acquisition Date",
      dataIndex: "acquisitionDate",
      render: (acquisitionDate) => dateFormatter(acquisitionDate),
      sorter: true,
      filter: true,
    },
    {
      title: "Acquisition Value",
      dataIndex: "acquisitionValue",
      render: (value) => <>{value ? value : "-"}</>,
      sorter: true,
      filter: true,
    },
    {
      title: "Depreciation Value",
      dataIndex: "depreciationValue",
      render: (value) => <>{value ? value : "-"}</>,
      sorter: true,
      filter: true,
    },
    {
      title: "",
      render: (_, item) => (
        <div className="d-flex">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/assetManagement/registration/assets/edit/${item?.assetId}`
                  );
                }}
              />
            </button>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <button className="iconButton" type="button">
              <DeleteOutline
                onClick={(e) => {
                  e.stopPropagation();
                  const payload = {
                    assetId: item?.assetId || 0,
                    assetCode: "",
                    itemId: item?.itemName?.value,
                    itemName: item?.itemName?.label,
                    supplierName: item?.supplierName || null,
                    supplierMobileNo: item?.supplierMobileNo || null,
                    acquisitionDate: item?.acquisitionDate || null,
                    acquisitionValue: item?.acquisitionValue || null,
                    invoiceValue: item?.invoiceValue || null,
                    depreciationValue: item?.depreciationValue || null,
                    depreciationDate: item?.depreciationDate || null,
                    warrantyDate: item?.warrantyDate || null,
                    description: item?.description || null,
                    active: false,
                    createdAt: todayDate(),
                    createdBy: employeeId,
                    updatedAt: todayDate(),
                    updatedBy: employeeId,
                  };
                  deleteAsset(`/AssetManagement/SaveAsset`, payload, cb, true);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};
