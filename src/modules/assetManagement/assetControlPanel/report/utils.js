import {
  AddOutlined,
  AttachFile,
  Attachment,
  AttachmentOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  InfoOutlined,
  ReplayOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "common/Chips";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";
import { assetUnassign } from "../assign/utils";

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
  setDepreciationModal,
  history,
  setUnassignLoading,
  setIsAttachmentShow,
  setIsAttachmentView,
  cb
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
          {record?.employeeName && (
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
          )}
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
      render: (record) => (
        <span
          style={
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
        </span>
      ),
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
      render: (record) => (
        <span
          style={record?.noOfMaintenance > 0 ? linkAble : { textAlign: "left" }}
          onClick={() => {
            if (record?.noOfMaintenance > 0) {
              setIsModalOpen(true);
              setItemId(record?.assetId);
            }
          }}
        >
          {record?.noOfMaintenance}
        </span>
      ),
    },
    {
      title: "৳ Maint.",
      dataIndex: "totalMaintenance",
      sort: false,
      filter: false,
      render: (record) => (
        <span
          style={
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
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      sort: false,
      filter: false,
      className: "text-center",
      render: (item) => {
        return (
          <div>
            {item?.status === "Available" && (
              <Chips label="Available" classess="success" />
            )}
            {item?.status === "Assigned" && (
              <Chips
                label={"Assign to" + " " + item?.assetAssignPerson}
                classess="warning"
              />
            )}
            {item?.status === "On Maintaince" && (
              <Chips
                label={
                  "On Maintenance to" + " " + item?.assetMaintainceByPerson
                }
                classess="danger"
              />
            )}
            {item?.status === "On Rent" && (
              <Chips
                label={"On Rent" + " " + item?.assetRentPerson}
                classess="hold"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      className: "text-center",
      width: 120,
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Attachment View" arrow>
            <button className="iconButton" type="button">
              <Attachment
                onClick={(e) => {
                  e.stopPropagation();
                  setItemId(record?.assetId);
                  setIsAttachmentView(true);
                }}
              />
            </button>
          </Tooltip>
          <Tooltip title="Attachment Upload" arrow>
            <button className="iconButton" type="button">
              <AttachFile
                onClick={(e) => {
                  e.stopPropagation();
                  setItemId(record?.assetId);
                  setIsAttachmentShow(true);
                }}
              />
            </button>
          </Tooltip>
          <Tooltip title="Edit Registration" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/assetManagement/assetControlPanel/registration/edit/${record?.assetRegId}`
                  );
                }}
              />
            </button>
          </Tooltip>
          {!record?.isAssign && (
            <Tooltip title="Create Assign" arrow>
              <button className="iconButton" type="button">
                <AddOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(
                      `/assetManagement/assetControlPanel/assign/create`
                    );
                  }}
                />
              </button>
            </Tooltip>
          )}
          {record?.isAssign && !record?.isOnMaintaince && (
            <Tooltip title="Unassign" arrow>
              <button type="button" className="iconButton">
                <ReplayOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    assetUnassign(record?.assetId, setUnassignLoading, cb);
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
      title: "Maintenance Type",
      dataIndex: "MaintenanceHead",
      sort: true,
      filter: false,
    },
    {
      title: "From Date",
      dataIndex: "FromDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.FromDate),
    },
    {
      title: "To Date",
      dataIndex: "ToDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.FromDate),
    },
    {
      title: "Amount",
      dataIndex: "Cost",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.Cost),
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
      dataIndex: "AssetName",
      sort: true,
      filter: false,
    },
    {
      title: "Amount",
      dataIndex: "Depreciation",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.Depreciation),
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
  empOrDeptId,
  empOrDeptTypeId,
  statusId,
  pages,
  setPages,
  search
) => {
  getLandingData(
    `/AssetManagement/GetAssetDetailLandingPaginationReport?accountId=${orgId}&branchId=${buId}&intdeptOrEmpID=${empOrDeptId}&intDeporEmpType=${empOrDeptTypeId}&statusType=${statusId}&viewOrder=desc&workplaceId=${wId}&workplaceGroupId=${wgId}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}&SearchItem=${search}`,
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

const addDocumentHandler = (values, documentFile, rowDto, setRowDto, cb) => {
  if (!documentFile)
    return toast.warn("Please attach a file", { toastId: "document" });
  const obj = {
    globalImageUrlID: documentFile?.globalFileUrlId,
    attachmentFileName: documentFile?.fileName,
    documentName: values?.documentName,
  };
  setRowDto([...rowDto, obj]);
  cb();
};

const documentAttachmentColumn = (dispatch, rowDto, setRowDto, type) => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Document Name",
      dataIndex: "documentName",
      sort: false,
      filter: false,
    },
    {
      title: "Attachment",
      dataIndex: "attachmentFileName",
      sort: false,
      filter: false,
      render: (record) => (
        <div
          className="d-inline-block"
          onClick={() => {
            dispatch(getDownlloadFileView_Action(record?.globalImageUrlID));
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#0072E5",
              cursor: "pointer",
            }}
          >
            <AttachmentOutlined sx={{ marginRight: "5px", color: "#0072E5" }} />
            {record?.attachmentFileName || "Attachment"}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 100,
      className: "text-center",
      isHidden: type === "view",
      render: (_, index) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Delete" arrow>
            <button type="button" className="iconButton">
              <DeleteOutlineOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRowData(index, rowDto, setRowDto);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ].filter((item) => !item?.isHidden);
};

const deleteRowData = (index, rowDto, setRowDto) => {
  const rowData = rowDto?.filter((item, i) => i !== index);
  setRowDto(rowData);
};

const saveAttachmentHandler = (
  assetId,
  rowDto,
  assetImageFile,
  saveAttachmentUpload,
  cb
) => {
  if (!rowDto.length)
    return toast.warn("Please add atleast one row", { toastId: "row" });
  const payload = {
    documentTypeId: 36,
    documentTypeName: "Asset Document",
    assetId: assetId,
    globalImageUrlID: assetImageFile?.globalFileUrlId,
    attachmentName: assetImageFile?.fileName,
    multipleDocument: rowDto,
  };
  saveAttachmentUpload(
    `/AssetManagement/CreateAssetDocumentUploadService`,
    payload,
    cb,
    true
  );
};

export {
  addDocumentHandler,
  assetReportColumn,
  documentAttachmentColumn,
  employeeDetailsColumn,
  getById,
  getData,
  maintenanceSummaryColumn,
  saveAttachmentHandler,
  totalDepreciationColumn
};

