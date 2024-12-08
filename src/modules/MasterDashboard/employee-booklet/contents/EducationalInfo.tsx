import NoResult from "common/NoResult";
import { DataTable } from "Components";
import moment from "moment";
import React, { forwardRef } from "react";
import { dateDuration } from "utility/durationDifference";

const EducationalInfo = forwardRef((props: any, ref: any) => {
  const eduHistory = props?.eduHistory;
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      align: "center",
    },
    {
      title: "Name of Institute",
      dataIndex: "strInstituteName",
    },
    {
      title: "Is Foreign Institute?",
      dataIndex: "isForeign",
      render: (data: any) => (data ? "Foreign" : "Not Foreign"),
    },
    {
      title: "Name of Degree",
      dataIndex: "strEducationDegree",
      render: (data: any) => data || "-",
    },
    {
      title: "Field of Study",
      dataIndex: "strEducationFieldOfStudy",
      render: (data: any) => data || "-",
    },
    {
      title: "Result",
      dataIndex: "strCgpa",
      render: (data: any, rec: any) => `${data}/ ${rec?.strOutOf}`,
    },
    {
      title: "Scale",
      dataIndex: "dteStartDate",
      render: (data: any, rec: any) =>
        `${moment(data).format("DD MMM, YYYY")} - ${moment(
          rec?.dteEndDate
        ).format("DD MMM, YYYY")}`,
      width: 50,
    },
    {
      title: "Duration",
      dataIndex: "dteStartDate",
      render: (_: any, rec: any) =>
        dateDuration(rec?.dteStartDate, rec?.dteEndDate),
    },
    {
      title: "Length",
      dataIndex: "dteFromDate",
    },
  ];

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          Educational Information
        </h1>
      </center>
      {eduHistory?.length > 0 ? (
        <DataTable bordered data={eduHistory || []} header={header} />
      ) : (
        <NoResult />
      )}
    </div>
  );
});

export default EducationalInfo;
