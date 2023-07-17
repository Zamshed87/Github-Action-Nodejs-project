import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../../common/AvatarComponent";
import { gray600 } from "../../../../../utility/customColor";

export const getSubmissionLanding = async (
  scheduleId,
  orgId,
  buId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingSubmissionLanding?scheduleId=${scheduleId}&IntAccountId=${orgId}&intBusinessUnitId=${buId}`
    );

    setter?.(res?.data?.data);
    setAllData?.(res?.data?.data);
    setLoading?.(false);
  } catch (err) {
    setLoading?.(false);
    toast.error(`Something went wrong!`);
  }
};

export const employeeListColumn = (
  history,
  rowDto,
  setRowDto,
  setIsShowAssessmentDetails,
  setApiParams,
  setAssessmentTitle,
  page,
  paginationSize
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      className: "text-left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Designation</span>,
      dataIndex: "strDesignationName",
      sorter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Department</span>,
      dataIndex: "strDepartmentName",
    },
    {
      title: () => <span style={{ color: gray600 }}>Email</span>,
      dataIndex: "strEmail",
    },
    {
      title: () => <span style={{ color: gray600 }}>Phone</span>,
      dataIndex: "strPhoneNo",
      className: "text-left",
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      className: "text-left",
    },
    {
      title: "Pre-Assess",
      dataIndex: "preAssessmentMarks",
      className: "text-center",
      render: (_, record) => (
        <>
          {record?.preAssessmentMarks === "Not Submitted" ? (
            <div>{record?.preAssessmentMarks}</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>{record?.preAssessmentMarks}</p>
              <p
                style={{ color: "#0BA5EC" }}
                onClick={() => {
                  setAssessmentTitle("Pre Assessment Details");
                  setApiParams({
                    scheduleId: record?.intScheduleId,
                    requisitionId: record?.intScheduleId,
                    employeeId: record?.intEmployeeId,
                    status: true,
                  });
                  setIsShowAssessmentDetails(true);
                }}
              >
                View Details
              </p>
            </div>
          )}
        </>
      ),
    },
    {
      title: "Post-Assess",
      dataIndex: "postAssessmentMarks",
      className: "text-center",
      render: (_, record) => (
        <>
          {record?.postAssessmentMarks === "Not Submitted" ? (
            <div>{record?.postAssessmentMarks}</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>{record?.postAssessmentMarks}</p>
              <p
                style={{ color: "#0BA5EC" }}
                onClick={() => {
                  setAssessmentTitle("Post Assessment Details");
                  setApiParams({
                    scheduleId: record?.intScheduleId,
                    requisitionId: record?.intScheduleId,
                    employeeId: record?.intEmployeeId,
                    status: false,
                  });
                  setIsShowAssessmentDetails(true);
                }}
              >
                View Details
              </p>
            </div>
          )}
        </>
      ),
    },
  ];
};
