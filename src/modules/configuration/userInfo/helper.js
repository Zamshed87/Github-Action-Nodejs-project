import { toast } from "react-toastify";
import axios from "axios";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { Tooltip } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.data?.filter(
      (item) =>
        regex.test(item?.strEmployeeName?.toLowerCase()) ||
        regex.test(item?.strEmployeeCode?.toLowerCase()) ||
        regex.test(item?.strPersonalMobile?.toLowerCase()) ||
        regex.test(item?.strCountry?.toLowerCase()) ||
        regex.test(item?.strLoginId?.toLowerCase())
    );
    setRowDto({ data: newDta });
  } catch {
    setRowDto([]);
  }
};

export const createUser = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    await axios.post(`/Auth/UserCreation`, payload);
    cb && cb();
    toast.success(
      payload?.intUserId ? "Updated Successfully" : "User Created Successfully",
      { toastId: 1 }
    );
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: 1,
    });
    setLoading && setLoading(false);
  }
};

export const userInfoCol = (pages, permission, setOpen, setSingelUser) => {
  return [
    {
      title: "SL",
      render: (_, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
      sort: false,
      className: "text-center",
      width: 30,
    },

    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      sort: true,
      // filter: true,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={record?.strEmployeeName}
          />
          <span className="ml-2">{record?.strEmployeeName}</span>
        </div>
      ),
      sort: true,
      // filter: true,
      fieldType: "string",
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sort: true,
      // filter: true,
      // isNumber: true,
      fieldType: "number",
    },
    {
      title: "User ID (Login)",
      dataIndex: "strLoginId",
      sort: true,
      // filter: true,
      // isNumber: true,
      fieldType: "number",
    },

    {
      title: "Mobile No.",
      dataIndex: "strPersonalMobile",
      sort: true,
      // filter: true,
      // isNumber: true,
      fieldType: "number",
    },
    {
      title: "Status",
      dataIndex: "finalStatus",
      render: (record) => (
        <Chips
          label={record?.userStatus ? "Active" : "Inactive"}
          classess={record?.userStatus ? "success" : "danger"}
        />
      ),
      sort: true,
      // filter: true,
    },
    {
      title: "",
      dataIndex: "",
      className: "text-center",
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  e.stopPropagation();
                  setOpen(true);
                  setSingelUser(record);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};
