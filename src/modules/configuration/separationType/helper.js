import { ModeEditOutlineOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strSeparationType?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const saveSeparationType = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/SaveSeparationType`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getSeparationType = async (
  accId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetAllSeparationType?accountId=${accId}`
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

export const getSeparationTypeById = async (setter, id, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetSeparationTypeById?id=${id}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const separationDtoCol = (permission, setOpen, setId) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 50,
    },
    {
      title: "Separation Type Name",
      dataIndex: "strSeparationType",
      sorter: true,
      filter: true,
    },
    {
      title: "Employee View",
      dataIndex: "isEmployeeView",
      render: (_, item) => <span>{item?.isEmployeeView ? "Yes" : "No"}</span>,
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
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission", {
                      toastId: 1,
                    });
                  setOpen(true);
                  setId(item?.intSeparationTypeId);
                }}
              >
                <ModeEditOutlineOutlined sx={{ fontSize: "20px" }} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
