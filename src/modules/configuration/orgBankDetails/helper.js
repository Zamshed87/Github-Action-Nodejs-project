import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter(
      (item) =>
        regex.test(item?.strAccountName?.toLowerCase()) ||
        regex.test(item?.strBankWalletName?.toLowerCase()) ||
        regex.test(item?.strBranchName?.toLowerCase()) ||
        regex.test(item?.strAccountNo?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const createEditBankOrgDetails = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/SaasMasterData/AccountBankDetailsCRUD`,
      payload
    );
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllOrgBankDetailsLanding = async (
  orgId,
  buId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/AccountBankDetailsLanding?IntAccountId=${orgId}&IntBusinessUnitId=${buId}`
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
export const orgBankDetailsDtoCol = (permission, setOpen, setSingleData) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 50,
    },
    {
      title: "Account Name",
      dataIndex: "strAccountName",
      sorter: true,
      filter: true,
    },
    {
      title: "Bank Name",
      dataIndex: "strBankWalletName",
      sorter: true,
      filter: true,
    },
    {
      title: "Branch Name",
      dataIndex: "strBranchName",
      sorter: true,
      filter: true,
    },
    {
      title: "Account No",
      dataIndex: "strAccountNo",
      sorter: true,
      filter: true,
    },
    {
      title: "Routing No",
      dataIndex: "strRoutingNo",
      sorter: true,
      filter: true,
    },
    {
      title: "District",
      dataIndex: "strDistrict",
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
              <button className="iconButton content tableBody-title">
                <EditOutlinedIcon
                  sx={{ color: "#637381" }}
                  onClick={(e) => {
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    e.stopPropagation();
                    setOpen(true);
                    setSingleData(item);
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
