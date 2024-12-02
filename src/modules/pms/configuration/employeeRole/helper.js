import { gray600 } from "../../../../utility/customColor";

export const employeeRoleLandingTableColumn = ({
  setShowCreateModal,
  permission,
  setCompetencyId,
  pagination,
}) => {
  return [
    {
      title: () => <div style={{ color: gray600 }}> SL</div>,
      render: (_, __, index) =>
        (pagination?.current - 1) * pagination?.pageSize + (index + 1),
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      sorter: true,
      filter: true,
      width: "30%",
    },
    {
      title: "Role Code",
      dataIndex: "roleCode",
      sorter: true,
      filter: true,
      width: "30%",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: true,
      width: "30%",
    },
    //   {
    //     title: "",
    //     width: "10%",
    //     render: (_, record) => (
    //       <div className="d-flex align-items-center justify-content-center">
    //         <Tooltip title="Edit" arrow>
    //           <button
    //             className="iconButton mx-2"
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               if (!permission?.isEdit)
    //                 return toast.warn("You don't have permission");
    //               setShowCreateModal?.(true);
    //               setCompetencyId(record?.competencyId);
    //             }}
    //           >
    //             <EditOutlined sx={{ fontSize: "20px" }} />
    //           </button>
    //         </Tooltip>
    //       </div>
    //     ),
    //   },
  ];
};
