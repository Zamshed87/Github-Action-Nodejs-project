import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../../../common/loading/Loading";
import EmployeeDetailsCard from "./employeeDetailsCard";
import { getSubmissionDetails } from "./helper";
import Question from "./question";

const ViewSubmissionForm = ({ obj, setIsShowAssessmentDetails }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { scheduleId, requisitionId, employeeId, status } = obj;

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSubmissionDetails(
      scheduleId,
      orgId,
      requisitionId,
      employeeId,
      status,
      buId,
      setRowDto,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  return (
    <>
      {loading && <Loading />}
      <div className="add-new-employee-form">
        <div className="content-input-field">
          <EmployeeDetailsCard
            employee={{
              employeeName: rowDto?.strEmployeeName,
              designation: rowDto?.strDesignationName,
              department: rowDto?.strDepartmentName,
              email: rowDto?.strEmail,
              phone: rowDto?.strPhoneNo,
              attendance: rowDto?.attendance,
              totalMark: rowDto?.totalMark,
              answered: rowDto?.totalQuestionAnswered,
              questions: rowDto?.totalQuestion,
            }}
          />
          <Question questions={rowDto?.question} />
        </div>
        <div className="emp-create buttons-form-main row">
          <button
            type="button"
            className="btn btn-cancel mr-3"
            onClick={() => setIsShowAssessmentDetails(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewSubmissionForm;
