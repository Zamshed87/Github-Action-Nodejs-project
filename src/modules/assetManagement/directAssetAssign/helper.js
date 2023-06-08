import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "../../../common/Chips";
import { gray600 } from "../../../utility/customColor";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate
} from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";

export const onGetAssetDirectAssignLanding = (
  getAssetDirectAssign,
  orgId,
  buId,
  values,
  setRowDto
) => {
  getAssetDirectAssign(
    `/AssetManagement/GetDirectAssetAssign?accountId=${orgId}&businessUnitId=${buId}&fromDate=${
      values?.filterFromDate || monthFirstDate()
    }&toDate=${values?.filterToDate || monthLastDate()}`,
    (data) => {
      setRowDto(data);
    }
  );
};

export const filterDirectAssetAssignLanding = (
  keywords,
  allData,
  setRowDto
) => {
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

export const directAssetAssignTableColumn = (
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
      title: "Employee Name",
      dataIndex: "employeeName",
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
      dataIndex: "itemQuantity",
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
      title: "Assign Date",
      dataIndex: "assignDate",
      render: (assignDate) => dateFormatter(assignDate),
      isDate: true,
      sorter: false,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, item) => (
        <>
          {item?.status === "Acknowledged" ? (
            <Chips label="Acknowledged" classess="" />
          ) : (
            "-"
          )}
        </>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "",
      render: (_, item) => (
        <div className="d-flex">
          {item?.status !== "Acknowledged" ? (
            <>
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        `/assetManagement/assetAssign/directAssign/edit/${item?.assetDirectAssignId}`
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
                        assetDirectAssignId: item?.id,
                        accountId: orgId,
                        businessUnitId: buId,
                        employeeId: item?.employeeName?.value,
                        employeeName: item?.employeeName?.label,
                        itemId: item?.itemName?.value,
                        itemName: item?.itemName?.label,
                        itemQuantity: item?.quantity,
                        assignDate: item?.assignDate,
                        active: false,
                        createAt: todayDate(),
                        createdBy: employeeId,
                        updatedAt: todayDate(),
                        updatedBy: employeeId,
                      };
                      deleteDirectAsset(
                        `/AssetManagement/SaveDirectAssetAssign`,
                        payload,
                        cb,
                        true
                      );
                    }}
                  />
                </button>
              </Tooltip>
            </>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];
};
