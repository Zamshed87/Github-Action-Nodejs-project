import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const getBarAssessmentColumn = ({ pages,history, yearId, quarterId, assessmentType }) => {
  return [
    {
      title: () => <span>SL</span>,
      render: (text, record, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,      sorter: false,
      className: "text-center",
      width: "10px",
      filter: false,
    },
    {
      title: "Name",
      dataIndex: "employeeName",
      width: "100px",
      sorter: true,
    },
    {
      title: () => <span>Assessment Status</span>,
      dataIndex: "assesmentStatus",
      width: "60px",
      render: (data, record, idx) => (data ? "Given" : "Pending"),
      sorter: true,
    },
    {
      title: "Action",
      sorter: false,
      render: (_, data, index) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <Tooltip title="Start Evaluation" arrow>
              <button
                className="iconButton mx-2"
                onClick={() => {
                  history.push({
                    pathname: `/pms/performanceAssessment/BARAssessment/evaluation/${data?.employeeID}/${yearId}/${quarterId ? quarterId : 0 }`,
                    state: {data, assessmentType},
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
