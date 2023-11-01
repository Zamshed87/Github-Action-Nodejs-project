import { toast } from "react-toastify";
import axios from "axios";
import Chips from "../../../common/Chips";
import { Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strDesignation?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const createDesignation = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/SaveDesignation`, payload);
    cb();
    toast.success(res.data?.message || "Successfully", { toastId: 1 });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllDesignation = async (
  orgId,
  buId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetAllDesignation?accountId=${orgId}&businessUnitId=${buId}`
    );
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter(modified);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getDesignationById = async (id, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/SaasMasterData/GetDesignationById?id=${id}`);
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const adminDesignationDtoCol = (
  permission,
  setOpen,
  setSingleData,
  setLoading
) => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      className: "text-center",
      width: 30,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      // filter: true,
      fieldType: "string",
    },
    {
      title: "Status",
      dataIndex: "statusValue",
      // key: "statusValue",
      sort: true,
      // filter: true,
      fieldType: "string",

      // width: 30,
      render: (record) => {
        return (
          <div>
            <Chips
              label={record?.isActive ? "Active" : "Inactive"}
              classess={`${record?.isActive ? "success" : "danger"} p-2`}
            />
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      width: 150,
      // fieldType: "string",
      className: "text-center",
      render: (record) => {
        return (
          <div>
            <Tooltip title="Edit" arrow>
              <button className="iconButton content tableBody-title">
                <EditOutlinedIcon
                  sx={{ color: "#637381" }}
                  onClick={(e) => {
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    e.stopPropagation();
                    setOpen(true);
                    getDesignationById(
                      record?.intDesignationId,
                      setSingleData,
                      setLoading
                    );
                  }}
                />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
