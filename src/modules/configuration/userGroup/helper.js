import { toast } from "react-toastify";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strUserGroup?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

// export const getRoleGroupLanding = async (
//   accId,
//   setRowDto,
//   setAllData,
//   setIsLoading,
//   pages,
//   setPages,
//   searchTxt
// ) => {
//   setIsLoading && setIsLoading(true);
//   try {
//     let res = await axios.get(
//       `/Auth/GetAllUserGroupByAccountId?PageSize=${1}&PageNo=${1}&searchTxt=${searchTxt}`
//     );
//     setIsLoading && setIsLoading(false);
//     setAllData && setAllData(res?.data);
//     setRowDto(res?.data?.data);
//     setPages({ ...pages, total: res?.data?.totalCount });
//   } catch (err) {
//     setIsLoading && setIsLoading(false);
//   }
// };

export const getRoleGroupById = async (
  groupId,
  setter,
  setTableData,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/Auth/UserGroupById?userGroupHeaderId=${groupId}`
    );
    setIsLoading(false);
    const modifySingleData = {
      ...res?.data,
      userGroupName: res?.data?.userGroupHeader?.strUserGroup,
      userGroupCode: res?.data?.userGroupHeader?.strCode,
      userName: {
        value: res?.data?.userGroupRows[0]?.intEmployeeId,
        label: res?.data?.userGroupRows[0]?.strEmployeeName,
      },
    };
    setTableData && setTableData(res?.data?.userGroupRows);
    setter(modifySingleData);
  } catch (err) {
    setIsLoading(false);
  }
};

export const createRoleGroup = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Auth/UserGroupCreateNUpdate`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something is wrong!");
    setLoading && setLoading(false);
  }
};

export const userGroupCol = (
  pages,
  permission,
  setIsFormModal,
  setId,
  setSingleData,
  setTableData,
  setLoading
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => {
        return (
          <span>
            {pages?.current === 1
              ? index + 1
              : (pages.current - 1) * pages?.pageSize + (index + 1)}
          </span>
        );
      },
      sorter: false,
      filter: false,
      // className: "text-left",
      width: "30px",
    },
    {
      title: "User Group Name",
      dataIndex: "strUserGroup",
      sorter: true,
      filter: true,
      // width: "200px",
    },
    {
      title: "User Group Code",
      dataIndex: "strCode",
      sorter: true,
      filter: true,
    },
    {
      className: "text-center",
      render: (_, record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  e.stopPropagation();
                  setIsFormModal(true);
                  setId(record?.intUserGroupHeaderId);
                  getRoleGroupById(
                    record?.intUserGroupHeaderId,
                    setSingleData,
                    setTableData,
                    setLoading
                  );
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};
