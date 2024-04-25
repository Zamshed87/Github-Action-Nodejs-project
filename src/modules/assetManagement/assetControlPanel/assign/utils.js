import { DeleteOutlineOutlined, ReplayOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";

const initialValue = {
  startDate: todayDate(),
  assetName: " ",
  employeeName: "",
  assignTo: "employee",
};

const assetAssignColumn = (rowDto, setRowDto) => {
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
      title: "Asset Register Code",
      dataIndex: "assetCode",
      sort: false,
      filter: false,
    },
    {
      title: "Asset Item Name",
      dataIndex: "assetName",
      sort: false,
      filter: false,
    },
    {
      title: "Assign To (Employee/Department)",
      dataIndex: "employeeName",
      sort: false,
      filter: false,
    },
    {
      title: "Assigned Date",
      dataIndex: "label",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.startDate),
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 100,
      className: "text-center",
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
  ];
};

const addAssignHandler = (
  values,
  rowDto,
  setRowDto,
  orgId,
  buId,
  wId,
  wgId,
  employeeId,
  userName,
  cb
) => {
  const isDuplicate = rowDto.some(
    (item) => item?.assetId === values?.assetName?.value
  );
  if (isDuplicate) {
    return toast.warn("The asset is already assigned!", { toastId: "toastId" });
  }
  const obj = {
    accountId: orgId,
    branchId: buId,
    workplaceGroupId: wgId,
    workplaceId: wId,
    employeeId: values?.employeeName?.value,
    employeeName: values?.employeeName?.label,
    assetDescription: values?.assetName?.accDepreciation || "",
    assetCode: values?.assetName?.code,
    assetId: values?.assetName?.value,
    assetName: values?.assetName?.label,
    startDate: values?.startDate,
    actionById: employeeId,
    actionByName: userName,
  };
  setRowDto([...rowDto, obj]);
  cb();
};

const deleteRowData = (index, rowDto, setRowDto) => {
  const rowData = rowDto?.filter((item, i) => i !== index);
  setRowDto(rowData);
};

const saveHandler = (rowDto, saveAssetAssign, cb) => {
  if (rowDto?.length === 0)
    return toast.warn("Please add row", { toastId: "toastId" });
  saveAssetAssign(
    `/AssetManagement/CreateAssetAssign`,
    rowDto,
    cb,
    true
  );
};

const assignLandingColumn = (page, paginationSize, setUnassignLoading, cb) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Asset Register Code",
      dataIndex: "assetCode",
      sort: true,
      filter: false,
    },
    {
      title: "Asset Item",
      dataIndex: "assetName",
      sort: true,
      filter: false,
    },
    {
      title: "Assign To (Employee/Department)",
      dataIndex: "employeeName",
      sort: false,
      filter: false,
    },
    {
      title: "Assigned Date",
      dataIndex: "label",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.startDate),
    },
    {
      title: "UnAssign",
      dataIndex: "UnAssign",
      sort: false,
      filter: false,
      width: 100,
      className: "text-center",
      render: (record) => (
        <div className="d-flex justify-content-center">
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
        </div>
      ),
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
    `/AssetManagement/GetAssetItemAssignLanding?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&viewOrder=desc&SearchItem=${search}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}`,
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

const assetUnassign = async (assetId, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/AssetManagement/AssetUnAssign?assetId=${assetId}`,
      {}
    );
    cb();
    setLoading(false);
    toast.success(res?.data?.message || "Submitted successfully", {
      toastId: "toastId",
    });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "toastId",
    });
  }
};

export {
  addAssignHandler,
  assetAssignColumn,
  assignLandingColumn,
  getData,
  initialValue,
  saveHandler
};

