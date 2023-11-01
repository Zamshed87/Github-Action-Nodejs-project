import { toast } from "react-toastify";
import axios from "axios";
import Chips from "../../../common/Chips";
import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { gray600 } from "../../../utility/customColor";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strWorkplace?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const createWorkplaceGroup = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/SaveWorkplaceGroup`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const createWorkplace = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/SaveWorkplace`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getWorkplaceLanding = async (
  accId,
  busId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetAllWorkplace?accountId=${accId}&businessUnitId=${busId}`
    );
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter && setter(modified);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getWorkplaceById = async (id, setter, setAllData, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/SaasMasterData/GetWorkplaceById?Id=${id}`);
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const adminWorkplaceDtoCol = (permission, setId, setIsFormModal) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 50,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
    },
    {
      title: "Code",
      dataIndex: "strWorkplaceCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
    },
    {
      title: "Business Unit",
      dataIndex: "strBusinessUnit",
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "statusValue",
      key: "statusValue",
      sorter: true,
      filter: true,
      width: "150px",
      render: (_, record) => {
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
      dataIndex: "action",
      width: "150px",
      className: "text-center",
      render: (_, item) => {
        return (
          <div>
            <Tooltip title="Edit" arrow>
              <button
                className="iconButton content tableBody-title"
                onClick={(e) => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  e.stopPropagation();
                  setId(item?.intWorkplaceId);
                  setIsFormModal(true);
                }}
              >
                <EditOutlined sx={{ color: gray600 }} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
