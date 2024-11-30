import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const barAssesmentColumn = ({ history, yearId, quarterId, assessmentType }) => {
  return [
    {
      title: () => <span>SL</span>,
      render: (_, __, index) => index + 1,
      sorter: false,
      className: "text-center",
      width: "50px",
      filter: false,
    },
    {
      title: "Name",
      dataIndex: "employeeName",
      sorter: true,
    },
    {
      title: () => <span>Assessment Status</span>,
      dataIndex: "assesmentStatus",
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
