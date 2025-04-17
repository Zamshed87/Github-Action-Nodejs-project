import React from "react";
import { Collapse, Tooltip } from "antd";
import { EditOutlined } from "@mui/icons-material";
import NoResult from "common/NoResult";

const { Panel } = Collapse;

const QuestionnairesList = ({
  questionnariesList,
  setQuestionGroupId,
  setQuestionnairesEditModal,
}) => {
  return (
    <div className="table-card-body">
      {questionnariesList?.length > 0 ? (
        <Collapse accordion>
          {questionnariesList?.map((questionGroupList, index) => (
            <Panel
              header={
                <div className="d-flex align-items-center">
                  <h2>
                    <span>{index + 1}.</span>
                    {" " + questionGroupList?.strGroupName}
                  </h2>
                  <div className="d-flex align-items-center justify-content-center">
                    <Tooltip title="Edit" arrow>
                      <button
                        style={{ border: "none" }}
                        className="iconButton mx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuestionGroupId(questionGroupList?.intHeaderId);
                          setQuestionnairesEditModal?.(true);
                        }}
                      >
                        <EditOutlined style={{ fontSize: "20px" }} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              }
              key={index}
            >
              <ul className="ml-4 mt-2">
                {questionGroupList?.questionRows?.map((questionItem, index) => (
                  <li key={index}>
                    <span>{index + 1}. </span> {questionItem?.strQuestion}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <NoResult />
      )}
    </div>
  );
};

export default QuestionnairesList;
