import axios from "axios";
import { gray600 } from "../../../utility/customColor";
// import { Tooltip } from "@mui/material";
// import { EditOutlined } from "@mui/icons-material";
// import { toast } from "react-toastify";

export const getTerritoryLanding = async (orgId, buId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetAllTerritoryType?accountId=${orgId}&businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const territoryColumn = (permission, setSingleData, setOpenModal) => {
  return [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      render: (_, __, index) => index + 1,
      className: "text-center",
      width: 30,
    },
    {
      title: "Hr Position",
      dataIndex: "hrPosition",
      render: (data) => data || "N/A",
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      render: (data) => data || "N/A",
    },
    {
      title: "Territory Type",
      dataIndex: "strTerritoryType",
      render: (data) => data || "N/A",
    },
    // {
    //   dataIndex: "",
    //   render: (data) => (
    //     <>
    //       {" "}
    //         <div className="d-flex">
    //           <Tooltip title="Edit" arrow>
    //             <button type="button" className="iconButton">
    //               <EditOutlined
    //                 sx={{ fontSize: "20px" }}
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   if (!permission?.isEdit)
    //                     return toast.warn("You don't have permission");
    //                   setSingleData({
    //                     hrPosition: {
    //                       value: data?.intHrPositionId,
    //                       label: data?.hrPosition,
    //                     },
    //                     workplaceGroup: {
    //                       value: data?.intWorkplaceGroupId,
    //                       label: data?.workplaceGroup,
    //                     },
    //                     territoryType: data?.strTerritoryType,
    //                     intTerritoryTypeId: data.intTerritoryTypeId,
    //                   });
    //                   setOpenModal(true);
    //                 }}
    //               />
    //             </button>
    //           </Tooltip>
    //         </div>
    //     </>
    //   ),
    // },
  ];
};
