import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const barAssesmentColumn = ({
  history,
  yearId,
  quarterId,
  assessmentType,
}) => {
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
      title: "Evaluation Criteria",
      dataIndex: "evaluationCriteria",
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
                  const { evaluationCriteria, employeeID } = data;
                  const url =
                    evaluationCriteria === "360"
                      ? "evaluationForSupervisor"
                      : "evaluationBSCForSupervisor";
                  const assessmentPath = `/pms/performanceAssessment/BARAssessment/${url}/${employeeID}/${yearId}/${
                    quarterId || 0
                  }`;

                  const assessmentState = { data, assessmentType };

                  history.push({
                    pathname: assessmentPath,
                    state: assessmentState,
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

/**
 * Description: This function will modify the data receiving from api.
 * Parameters:
 *   - : Data object received from api
 * Returns: Modified data array of question
 */

export const getModifiedData = (data) => {
  let hashedData = {};
  let modifiedDataArr = [];
  data.questionList.forEach((q) => {
    /**additional update for fixing a backend issue for now [BackEend's request]. but in future this might not need*/
    q.questionHeaderId = q.intQuestionreHeaderId;
    /** additional change ends */

    if (!hashedData[q.groupName]) {
      hashedData[q.groupName] = [];
    }
    hashedData[q.groupName] = [
      ...hashedData[q.groupName],
      {
        ...q,
      },
    ];
  });

  //key in object
  for (let group in hashedData) {
    modifiedDataArr.push({
      groupName: group,
      questions: hashedData[group],
    });
  }

  // console.log(hashedData)
  // console.log(modifiedDataArr)
  return modifiedDataArr;
};
