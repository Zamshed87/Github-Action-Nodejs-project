import NoResult from "common/NoResult";
import { DataTable } from "Components";
import moment from "moment";
import React, { forwardRef } from "react";
import { dateDuration } from "utility/durationDifference";

const WorkExperienceHistory = forwardRef((props: any, ref: any) => {
  const workHistory = props?.workHistory;

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      align: "center",
    },
    {
      title: "Company Name",
      dataIndex: "strCompanyName",
      render: (data: any) => data || "-",
    },
    {
      title: "Job Title",
      dataIndex: "strJobTitle",
      render: (data: any) => data || "-",
    },
    {
      title: "Location",
      dataIndex: "strLocation",
      render: (data: any) => data || "-",
    },
    {
      title: "Job Description",
      dataIndex: "strDescription",
      render: (data: any) => data || "-",
    },
    {
      title: "Duration",
      dataIndex: "dteFromDate",
      render: (data: any, rec: any) =>
        `${moment(data).format("DD MMM, YYYY")} - ${moment(
          rec?.dteToDate
        ).format("DD MMM, YYYY")}`,
    },
    {
      title: "Length of Job",
      dataIndex: "dteFromDate",
      render: (_: any, rec: any) =>
        dateDuration(rec?.dteFromDate, rec?.dteToDate),
    },
  ];

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          Work Experience
        </h1>
      </center>
      {workHistory?.length > 0 ? (
        <DataTable bordered data={workHistory || []} header={header} />
      ) : (
        <NoResult />
      )}
    </div>
  );
});

export default WorkExperienceHistory;
