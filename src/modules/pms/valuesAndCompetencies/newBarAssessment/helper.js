import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import PBadge from "Components/Badge";

export const getBarAssessmentColumn = ({
  pages,
  history,
  yearId,
  assessmentPeriod,
  assessmentTime,
}) => {
  return [
    {
      title: () => <span>SL</span>,
      render: (text, record, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      sorter: false,
      width: "30px",
      filter: false,
      align: "center",
    },
    {
      title: "Stakeholder Type",
      dataIndex: "stakeholderType",
      render:(data) => {
        return data ?? "-";
      },
      width: "100px",
      sorter: true,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: "120px",
      sorter: true,
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "department",
      width: "100px",
      sorter: true,
      align: "center",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      width: "120px",
      sorter: true,
      align: "center",
    },
    {
      title: "Level of Leadership",
      dataIndex: "levelOfLeadership",
      width: "120px",
      sorter: true,
      align: "center",
    },
    {
      title: "Assessment Period",
      dataIndex: "assesmentPeriod",
      width: "100px",
      sorter: true,
      align: "center",
    },
    {
      title: "Assessment Time",
      dataIndex: "assesmentTime",
      render:(data) => {
        return data ?? "-";
      },
      width: "100px",
      sorter: true,
      align: "center",
    },
    {
      title: "Assessment Status",
      dataIndex: "assesmentStatus",
      width: "80px",
      sorter: true,
      align: "center",
      render: (data) => {
        switch (data) {
          case "Complete":
            return <PBadge text={data} type="success" />;
          case "Pending":
            return <PBadge text={data} type="secondary" />;
          default:
            return <PBadge text={data} type="info" />;
        }
      },
    },
    {
      title: "Action",
      sorter: false,
      width: "100px",
      align: "center",
      render: (_, data) => {
        if(data?.assesmentStatus == "Complete") {
          return "-";
        }
        return (
          <Tooltip title="Start Evaluation" arrow>
            <button
              className="iconButton mx-2"
              onClick={() => {
                history.push({
                  pathname: `/pms/performanceAssessment/BARAssessment/evaluation/${data?.employeeId}/${yearId}`,
                  state: { data, assessmentPeriod, assessmentTime },
                });
              }}
            >
              <EditOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
        );
      },
    },
  ];
};
