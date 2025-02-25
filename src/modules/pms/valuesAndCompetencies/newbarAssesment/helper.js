import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const getBarAssessmentColumn = ({ pages, history, yearId, quarterId, assessmentType }) => {
  return [
    {
      title: () => <span>SL</span>,
      render: (text, record, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      sorter: false,
      className: "text-center",
      width: "30px",
      filter: false,
    },
    {
      title: "Stakeholder Type",
      dataIndex: "stakeholderType",
      width: "100px",
      sorter: true,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: "120px",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: "100px",
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      width: "120px",
      sorter: true,
    },
    {
      title: "Level of Leadership",
      dataIndex: "levelOfLeadership",
      width: "120px",
      sorter: true,
    },
    {
      title: "Assessment Period",
      dataIndex: "assesmentPeriod",
      width: "100px",
      sorter: true,
    },
    {
      title: "Assessment Time",
      dataIndex: "assesmentTime",
      width: "100px",
      sorter: true,
    },
    {
      title: "Assessment Status",
      dataIndex: "assesmentStatus",
      width: "80px",
      sorter: true,
    },
    {
      title: "Action",
      sorter: false,
      width:"50px",
      render: (_, data) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <Tooltip title="Start Evaluation" arrow>
              <button
                className="iconButton mx-2"
                onClick={() => {
                  history.push({
                    pathname: `/pms/performanceAssessment/BARAssessment/evaluation/${data?.employeeId}/${yearId}/${quarterId || 0}`,
                    state: { data, assessmentType },
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
