import { VisibilityOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";

const initialValues = {};

const depreciationSummaryColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Narration",
      dataIndex: "strNarration",
      sort: false,
      filter: false,
    },
    {
      title: "Total Amount",
      dataIndex: "numAmount",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.numAmount),
    },
  ];
};

const depreciationDetailsColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Asset Code",
      dataIndex: "strAssetCode",
      sort: false,
      filter: false,
    },
    {
      title: "Asset Description",
      dataIndex: "strAssetDescription",
      sort: false,
      filter: false,
    },
    {
      title: "Asset Value",
      dataIndex: "numAcquisitionValue",
      sort: false,
      filter: false,
    },
    {
      title: "Net Value",
      dataIndex: "numTotalDepValue",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.numTotalDepValue),
    },
    {
      title: "Last DPR. Run Date",
      dataIndex: "dteDepRunDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.dteDepRunDate),
    },
    {
      title: "Depreciation Amount",
      dataIndex: "numDepAmount",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.numDepAmount),
    },
  ];
};

const assetDepreciationColumn = (page, paginationSize, setIsView, setId) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Depreciation Run Date",
      dataIndex: "depreciationRunDate",
      sort: true,
      filter: false,
      render: (record) => dateFormatter(record?.depreciationRunDate),
    },
    {
      title: "Depreciation Run By",
      dataIndex: "depreciationRunByName",
      sort: true,
      filter: false,
    },
    {
      title: "Total Depreciation",
      dataIndex: "totalDepreciation",
      sort: true,
      filter: false,
      render: (record) => formatMoney(record?.totalDepreciation),
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 100,
      className: "text-center",
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="View" arrow>
            <button className="iconButton" type="button">
              <VisibilityOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setId(record?.assetDepreciationHeaderId);
                  setIsView(true);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};

const assetDepreciationDetailsColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sort: true,
      filter: false,
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sort: true,
      filter: false,
    },
    {
      title: "Depreciation",
      dataIndex: "depreciation",
      sort: true,
      filter: false,
      render: (record) => formatMoney(record.depreciation),
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
    `/AssetManagement/GetAssetDepriciationReport?accountId=${orgId}&branchId=${buId}&viewOrder=desc&workplaceId=${wId}&workplaceGroupId=${wgId}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}&SearchItem=${search}`,
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

const getById = (getSingleData, id, wId, wgId) => {
  getSingleData(
    `/AssetManagement/GetAssetDepreciationDetailsReport?assetDepreciationId=${id}&workplaceId=${wId}&workplaceGroupId=${wgId}`
  );
};

const saveHandler = (
  saveAssetDepreciation,
  orgId,
  buId,
  wId,
  wgId,
  date,
  employeeId,
  cb
) => {
  saveAssetDepreciation(
    `/AssetManagement/AssetDepreciationInsert?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&officeId=${0}&transactionDate=${date}&actionById=${employeeId}`,
    {},
    cb,
    true
  );
};

export {
  assetDepreciationColumn,
  assetDepreciationDetailsColumn,
  depreciationDetailsColumn,
  depreciationSummaryColumn,
  getById,
  getData,
  initialValues,
  saveHandler
};

