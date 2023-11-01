import axios from "axios";
import { toast } from "react-toastify";
import ActionMenu from "../../common/ActionMenu";
import AvatarComponent from "../../common/AvatarComponent";
import { gray900 } from "../../utility/customColor";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { BlockOutlined, NoAccountsOutlined } from "@mui/icons-material";

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

export const getAccountById = async (id, setter) => {
  try {
    const res = await axios.get(`/MasterData/GetAccountById?id=${id}`);
    if (res?.data) {
      setter && setter(res?.data);
    }
  } catch (error) {}
};

export const adminAccountDtoCol = (popupHandler, history) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 20,
    },
    {
      title: "Account Name",
      dataIndex: "strAccountName",
      sorter: true,
      filter: true,
      width: 100,
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strAccountName}
            />
            <span className="ml-2">{record?.strAccountName}</span>
          </div>
        );
      },
    },
    {
      title: "Owner Name",
      dataIndex: "strOwnerName",
      sorter: true,
      filter: true,
      width: 100,
    },
    {
      title: "Package Name",
      dataIndex: "strAccountPackageName",
      sorter: true,
      filter: true,
      width: 100,
    },
    {
      title: "Address",
      dataIndex: "strAddress",
      sorter: true,
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "strEmail",
      sorter: true,
      width: 100,
    },
    {
      title: "Mobile",
      dataIndex: "strMobileNumber",
      width: 100,
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center justify-content-between">
            <div>{record?.strMobileNumber}</div>
            <div className="ml-2">
              <ActionMenu
                // anchorEl={anchorElAction}
                // setAnchorEl={setAnchorElAction}
                sx={{
                  marginRight: "10px",
                  fontSize: "12px",
                }}
                color={gray900}
                fontSize={"14px"}
                options={[
                  {
                    value: 1,
                    label: "Block",
                    icon: (
                      <BlockOutlined
                        sx={{
                          marginRight: "10px",
                          fontSize: "16px",
                        }}
                      />
                    ),
                    onClick: () => {
                      popupHandler();
                    },
                  },
                  {
                    value: 2,
                    label: "Inactive",
                    icon: (
                      <NoAccountsOutlined
                        sx={{
                          marginRight: "10px",
                          fontSize: "16px",
                        }}
                      />
                    ),
                    onClick: () => {
                      popupHandler();
                    },
                  },
                  {
                    value: 3,
                    label: "Edit",
                    icon: (
                      <EditOutlinedIcon
                        sx={{
                          marginRight: "10px",
                          fontSize: "16px",
                        }}
                      />
                    ),
                    onClick: () => {
                      history.push(
                        `/administration/configuration/account/edit/${record?.intAccountId}`
                      );
                    },
                  },
                ]}
              />
            </div>
          </div>
        );
      },
    },
    // {
    //   title: "",
    //   dataIndex: "action",
    //   sorter: true,
    //   filter: true,
    //   width: 100,
    //   render: (_, record) => {
    //     return (
    //       <div>
    //         <div>{record?.strMobileNumber}</div>
    //         <div className="ml-2">
    //           <ActionMenu
    //             // anchorEl={anchorElAction}
    //             // setAnchorEl={setAnchorElAction}
    //             sx={{
    //               marginRight: "10px",
    //               fontSize: "12px",
    //             }}
    //             color={gray900}
    //             fontSize={"14px"}
    //             options={[
    //               {
    //                 value: 1,
    //                 label: "Block",
    //                 icon: (
    //                   <BlockOutlined
    //                     sx={{
    //                       marginRight: "10px",
    //                       fontSize: "16px",
    //                     }}
    //                   />
    //                 ),
    //                 onClick: () => {
    //                   popupHandler();
    //                 },
    //               },
    //               {
    //                 value: 2,
    //                 label: "Inactive",
    //                 icon: (
    //                   <NoAccountsOutlined
    //                     sx={{
    //                       marginRight: "10px",
    //                       fontSize: "16px",
    //                     }}
    //                   />
    //                 ),
    //                 onClick: () => {
    //                   popupHandler();
    //                 },
    //               },
    //               {
    //                 value: 3,
    //                 label: "Edit",
    //                 icon: (
    //                   <EditOutlinedIcon
    //                     sx={{
    //                       marginRight: "10px",
    //                       fontSize: "16px",
    //                     }}
    //                   />
    //                 ),
    //                 onClick: () => {
    //                   history.push(
    //                     `/administration/configuration/account/edit/${record?.intAccountId}`
    //                   );
    //                 },
    //               },
    //             ]}
    //           />
    //         </div>
    //       </div>
    //     );
    //   },
    // },
  ];
};
