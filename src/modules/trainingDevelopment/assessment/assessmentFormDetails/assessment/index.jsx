import Question from "./question";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { greenColor } from "../../../../../utility/customColor";
import { useEffect, useState } from "react";
import { deleteAssessment, getAssessmentQuestions } from "./helper";
import Loading from "../../../../../common/loading/Loading";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../../../common/IConfirmModal";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";

const AssessmentPreview = ({ scheduleId }) => {
  const history = useHistory();

  const [preAssessment, setPreAssessment] = useState([]);
  const [postAssessment, setPostAssessment] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLanding = () => {
    getAssessmentQuestions(setLoading, setPreAssessment, scheduleId, true);
    getAssessmentQuestions(setLoading, setPostAssessment, scheduleId);
  };

  useEffect(() => {
    if (scheduleId !== undefined) {
      getLanding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  const demoPopup = (status) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to Delete ? `,
      yesAlertFunc: () => {
        const cb = () => {
          getLanding();
        };
        deleteAssessment(scheduleId, status, setLoading, cb);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission;

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <>
          {/* Pre-assessment */}
          {loading && <Loading />}
          {preAssessment?.length > 0 && (
            <div className="mt-2">
              <div
                className="d-flex justify-content-between align-items-center p-2 pl-4 pr-4 mb-3"
                style={{ backgroundColor: "#EAECF0" }}
              >
                <div className="" style={{ fontSize: "14px", fontWeight: 600 }}>
                  PRE-ASSESSMENT
                </div>
                <div className="d-flex">
                  <div className="d-flex" style={{}}>
                    <CreateOutlinedIcon
                      sx={{
                        fontSize: "18px",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                    />
                    <p
                      className="ml-1"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                      onClick={() => {
                        history.push(
                          `/trainingAndDevelopment/assessment/assessmentForm/edit/pre/${scheduleId}`
                        );
                      }}
                    >
                      Edit
                    </p>
                  </div>
                  <div className="d-flex ml-4">
                    <DeleteOutlineOutlinedIcon
                      sx={{
                        fontSize: "18px",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                    />
                    <p
                      className="ml-1"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                      onClick={() => {
                        demoPopup(true);
                      }}
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </div>
              <Question questions={preAssessment} />
            </div>
          )}

          {/* Post-assessment */}
          {postAssessment?.length > 0 && (
            <div className="mt-3">
              <div
                className="d-flex justify-content-between align-items-center p-2 pl-4 pr-4 mb-3"
                style={{ backgroundColor: "#EAECF0" }}
              >
                <div className="" style={{ fontSize: "14px", fontWeight: 600 }}>
                  POST-ASSESSMENT
                </div>
                <div className="d-flex">
                  <div className="d-flex" style={{}}>
                    <CreateOutlinedIcon
                      sx={{
                        fontSize: "18px",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                    />
                    <p
                      className="ml-1"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                      onClick={() => {
                        history.push(
                          `/trainingAndDevelopment/assessment/assessmentForm/edit/post/${scheduleId}`
                        );
                      }}
                    >
                      Edit
                    </p>
                  </div>
                  <div className="d-flex ml-4">
                    <DeleteOutlineOutlinedIcon
                      sx={{
                        fontSize: "18px",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                    />
                    <p
                      className="ml-1"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: greenColor,
                      }}
                      onClick={() => {
                        demoPopup(false);
                      }}
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </div>
              <Question questions={postAssessment} />
            </div>
          )}
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default AssessmentPreview;
