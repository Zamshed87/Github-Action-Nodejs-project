import Chips from "common/Chips";
import Loading from "common/loading/Loading";
import { DataTable } from "Components";
import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dateFormatter } from "utility/dateFormatter";

export default function ExitInterviewDataView({ id, empId }) {
  const [exitInterviewData, getExitInterviewData, exitInterviewDataloading] =
    useAxiosGet();

  useEffect(() => {
    getExitInterviewData(
      `ExitInterview/GetExitInterviewBySeparationId?separationId=${id}&employeeId=${empId}`
    );
  }, [id, empId]);

  const header = [
    {
      title: "Assigned To",
      dataIndex: "strEmployeeName",
    },
    {
      title: "Length of Service",
      dataIndex: "serviceLength",
    },
    {
      title: "Date of Resign",
      dataIndex: "dteLastWorkingDate",
      render: (data) => <>{data ? dateFormatter(data) : "N/A"}</>,
    },
    {
      title: "Resign Status",
      dataIndex: "approvalStatus",
      sort: true,
      filter: false,
      render: (item) => (
        <div className="d-flex justify-content-center">
          {item === "Approve" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item === "Process" && (
            <Chips label="Process" classess="primary p-2" />
          )}
          {item === "Reject" && (
            <Chips label="Rejected" classess="danger p-2 mr-2" />
          )}
          {item === "Released" && (
            <Chips label="Released" classess="indigo p-2 mr-2" />
          )}
          {item === "Cancelled" && (
            <Chips label="Released" classess="danger p-2 mr-2" />
          )}
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Interview Completed By ",
      dataIndex: "strInterviewCompletedBy",
      width: 80,
    },
    {
      title: "Completed Date",
      dataIndex: "dteInterviewCompletedDate",
      render: (data) => <>{data ? dateFormatter(data) : "N/A"}</>,
    },
    {
      title: "Status",
      dataIndex: "strInterviewStatus",
      width: 60,
    },
  ];
  return (
    <div>
      {exitInterviewDataloading && <Loading />}
      <DataTable
        bordered
        scroll={{ x: false }}
        data={[exitInterviewData?.data] || []}
        loading={exitInterviewDataloading}
        header={header}
      />
    </div>
  );
}
