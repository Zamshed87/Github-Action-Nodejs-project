import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";

const assetReportColumn = (
  page,
  paginationSize,
  setHistoryModal,
  setItemId
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "assetCode",
      sort: true,
      filter: false,
      render: (record) =>
        record?.assetCode ? record?.assetCode : record?.assetId,
    },
    {
      title: "Asset",
      dataIndex: "assetName",
      sort: true,
      filter: false,
    },
    {
      title: "Identification",
      dataIndex: "identification",
      sort: false,
      filter: false,
      render: (record) => `${record?.identification}:${record?.value}`,
    },
    {
      title: "Assign To",
      dataIndex: "employeeName",
      sort: true,
      filter: false,
      render: (record) => (
        <div className="d-flex justify-content-center align-items-center">
          <Tooltip title="Details" arrow>
            <button style={{ border: 0, background: "none" }} type="button">
              <InfoOutlined
                sx={{ color: "#299647 !important" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setHistoryModal(true);
                  setItemId(record?.assetId);
                }}
              />
            </button>
          </Tooltip>
          <div className="ml-2">{record?.employeeName}</div>
        </div>
      ),
    },
    {
      title: "Book Value",
      dataIndex: "bookValue",
      sort: true,
      filter: false,
      className: "text-right",
      render: (record) => formatMoney(record?.bookValue),
    },
    {
      title: "Total Depr.Amount",
      dataIndex: "totalDepreciation",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.totalDepreciation),
    },
    {
      title: "Rece.Value",
      dataIndex: "bookValue",
      sort: false,
      filter: false,
      render: (record) =>
        formatMoney(record?.bookValue - record?.totalDepreciation),
    },
    {
      title: "#Maint.",
      dataIndex: "noOfMaintenance",
      sort: false,
      filter: false,
    },
    {
      title: "৳ Maint.",
      dataIndex: "totalMaintenance",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.totalMaintenance),
    },
  ];
};

const employeeDetailsColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Assign To",
      dataIndex: "employeeName",
      sort: true,
      filter: false,
    },
    {
      title: "Assign Date",
      dataIndex: "identification",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.fromDate),
    },
  ];
};

const getData = (
  getLandingData,
  setRowDto,
  orgId,
  buId,
  wId,
  wgId,
  pages,
  setPages,
  search
) => {
  getLandingData(
    `/AssetManagement/GetAssetDetailLandingPaginationReport?accountId=${orgId}&branchId=${buId}&viewOrder=desc&workplaceId=${wId}&workplaceGroupId=${wgId}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}&SearchItem=${search}`,
    (res) => {
      setRowDto(res?.data);
      setPages?.({
        current: res?.currentPage,
        pageSize: res?.pageSize,
        total: res?.totalCount,
      });
    }
  );
};

const getById = (getSingleData, id) => {
  getSingleData(
    `/AssetManagement/GetAssignToDetail?assetId=${id}`
  );
};

export { assetReportColumn, employeeDetailsColumn, getById, getData };

