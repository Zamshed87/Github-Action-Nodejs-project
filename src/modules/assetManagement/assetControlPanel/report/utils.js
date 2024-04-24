import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";

const linkAble = {
  textAlign: "center",
  color: "#1e1efb",
  textDecoration: "underline",
  cursor: "pointer",
};

const assetReportColumn = (
  page,
  paginationSize,
  setHistoryModal,
  setItemId,
  setIsModalOpen,
  setDepreciationModal
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
      render: (record) => {
        <span
          className={
            record?.totalDepreciation > 0 ? linkAble : { textAlign: "left" }
          }
          onClick={() => {
            if (record?.totalDepreciation > 0) {
              setDepreciationModal(true);
              setItemId(record?.assetId);
            }
          }}
        >
          {formatMoney(record?.totalDepreciation)}
        </span>;
      },
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
      render: (record) => {
        <span
          className={
            record?.noOfMaintenance > 0 ? linkAble : { textAlign: "left" }
          }
          onClick={() => {
            if (record?.noOfMaintenance > 0) {
              setIsModalOpen(true);
              setItemId(record?.assetId);
            }
          }}
        >
          {formatMoney(record?.noOfMaintenance)}
        </span>;
      },
    },
    {
      title: "৳ Maint.",
      dataIndex: "totalMaintenance",
      sort: false,
      filter: false,
      render: (record) => {
        <span
          className={
            record?.totalMaintenance > 0 ? linkAble : { textAlign: "left" }
          }
          onClick={() => {
            if (record?.totalMaintenance > 0) {
              setIsModalOpen(true);
              setItemId(record?.assetId);
            }
          }}
        >
          {formatMoney(record?.totalMaintenance)}
        </span>;
      },
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

const maintenanceSummaryColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Head",
      dataIndex: "maintenanceHead",
      sort: true,
      filter: false,
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.fromDate),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.toDate),
    },
    {
      title: "Amount",
      dataIndex: "cost",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.cost),
    },
  ];
};

const totalDepreciationColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Asset description",
      dataIndex: "assetName",
      sort: true,
      filter: false,
    },
    {
      title: "Amount",
      dataIndex: "depreciation",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.depreciation),
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
  getSingleData(`/AssetManagement/GetAssignToDetail?assetId=${id}`);
};

export {
  assetReportColumn,
  employeeDetailsColumn,
  getById,
  getData,
  maintenanceSummaryColumn,
  totalDepreciationColumn
};

