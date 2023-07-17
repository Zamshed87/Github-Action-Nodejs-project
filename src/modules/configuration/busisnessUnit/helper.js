import { EditOutlined } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../App";
import DemoImg from "../../../assets/images/demo.png";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../employeeProfile/LoanApplication/helper";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strBusinessUnit?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const attachment_action = async (
  accountId,
  tableReferrence,
  documentTypeId,
  buId,
  userId,
  attachment,
  setLoading
) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    let { data } = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
  }
};

export const createBusinessUnit = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/SaveBusinessUnit`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getBusinessUnitById = async ({
  businessUnitId,
  setter,
  setLoading,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessUnitById?Id=${businessUnitId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const deleteBusinessUnit = async (businessUnitId, cb) => {
  try {
    const res = await axios.put(
      `/SaasMasterData/DeleteBusinessUnit?id=${businessUnitId}`
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
export const rawFileUpload = async (attachment) => {
  let formData = new FormData();
  formData.append("file", attachment);
  try {
    let { data } = await axios.post("/emp/MasterData/RawFileUpload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success("successful");
    return data;
  } catch (error) {
    toast.error("Failed, try again later");
  }
};

// testing
export const createTesting = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/TimeSheet/RemoteAttendance`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

// bu dto columns
export const businesUnitDtoCol = (
  permission,
  setOpen,
  setImageFile,
  setBusinessUnitId
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      width: 50,
      className: "text-center",
    },
    {
      title: "Business Unit",
      dataIndex: "strBusinessUnit",
      sorter: true,
      filter: true,
      width: 200,
      render: (_, item) => {
        return (
          <div className="d-flex align-items-center">
            {item?.strLogoUrlId ? (
              <img
                src={`${APIUrl}/Document/DownloadFile?id=${item?.strLogoUrlId}`}
                alt="icon"
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <img
                src={DemoImg}
                alt="icon"
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  objectFit: "contain",
                }}
              />
            )}
            <span className="">{item?.strBusinessUnit}</span>
          </div>
        );
      },
    },
    {
      title: "Address",
      dataIndex: "strAddress",
      sorter: true,
      filter: true,
      width: 200,
      render: (_, item) => {
        return (
          <div>
            <LightTooltip title={item?.strAddress} placement="top" arrow>
              <span>{item?.strAddress}</span>
            </LightTooltip>
          </div>
        );
      },
    },
    {
      title: "Website",
      dataIndex: "strWebsiteUrl",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 100,
      render: (_, item) => {
        return (
          <Chips
            label={item?.isActive ? "Active" : "Inactive"}
            classess={`${item?.isActive ? "success" : "danger"}`}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: 100,
      render: (_, item) => (
        <Tooltip title="Edit" arrow>
          <button
            className="iconButton"
            onClick={(e) => {
              if (!permission?.isEdit)
                return toast.warn("You don't have permission");
              e.stopPropagation();
              setOpen(true);
              setImageFile(item?.strLogoUrlId);
              setBusinessUnitId(item?.intBusinessUnitId);
            }}
          >
            <EditOutlined sx={{ fontSize: "20px" }} />
          </button>
        </Tooltip>
      ),
    },
  ];
};
