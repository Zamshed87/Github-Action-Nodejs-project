import { EditOutlined } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    const newDta = allData?.filter((item) =>
      regex.test(
        item?.strPayscaleGradeName?.toLowerCase() ||
          item?.strPayscaleGradeCode?.toLowerCase() ||
          item?.numMaxSalary?.toLowerCase() ||
          item?.numMinSalary?.toLowerCase() ||
          item?.strDepentOn?.toLowerCase()
      )
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const getBusinessUnitById = async ({
  orgId,
  id,
  setter,
  setLoading,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetAllScaleGrade?IntAccountId=${orgId}&IntPayscaleGradeId=${id}`
    );
    if (res?.data) {
      setter(res?.data[0]);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createBusinessUnit = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/CRUDPayScaleGrade`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const adminPayScaleCol = (
  permission,
  setOpen,
  setPayscaleGradeId,
  orgId,
  setSingleData,
  setLoading
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 50,
    },
    {
      title: "PayScale Grade Name",
      dataIndex: "strPayscaleGradeName",
      sorter: true,
      filter: true,
    },
    {
      title: "PayScale Grade Code",
      dataIndex: "strPayscaleGradeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Max Salary",
      dataIndex: "numMaxSalary",
      sorter: true,
      filter: true,
    },
    {
      title: "Min Salary",
      dataIndex: "numMinSalary",
      sorter: true,
      filter: true,
    },
    {
      title: "Depend On",
      dataIndex: "strDepentOn",
      sorter: true,
      filter: true,
    },
    {
      title: "",
      dataIndex: "status",
      key: "status",
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
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  e.stopPropagation();
                  setOpen(true);
                  setPayscaleGradeId(item?.intPayscaleGradeId);
                  getBusinessUnitById({
                    orgId,
                    id: item?.intPayscaleGradeId,
                    setter: setSingleData,
                    setLoading,
                  });
                }}
              >
                <EditOutlined sx={{ fontSize: "20px" }} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
