import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { gray600 } from "../../../utility/customColor";

export const requisitionApprovalColumn = (history, page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "strTrainingCode",
    },
    {
      title: "Name",
      dataIndex: "strScheduleName",
      sorter: true,
      filter: true,
    },
    {
      title: "Resource Person",
      dataIndex: "strResourcePerson",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strResourcePerson}
            />
            <span className="ml-2">{record?.strResourcePerson}</span>
          </div>
        );
      },
      className: "text-left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Training Date</span>,
      dataIndex: "dteTrainingDate",
      sorter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Duration</span>,
      dataIndex: "dteDuration",
    },
    {
      title: () => <span style={{ color: gray600 }}>Venue</span>,
      dataIndex: "strVenue",
    },
    {
      title: () => <span style={{ color: gray600 }}>Batch No (Size)</span>,
      dataIndex: "strBatchNo",
      className: "text-left",
    },
    {
      title: "Assign Size",
      dataIndex: "intAssignSize",
      className: "text-left",
    },
    {
      title: "Pending",
      dataIndex: "intPending",
      className: "text-left",
      render: (_, item) => (
        <Chips label={item.intPending} classess="warning p-2" />
      ),
    },
  ];
};
