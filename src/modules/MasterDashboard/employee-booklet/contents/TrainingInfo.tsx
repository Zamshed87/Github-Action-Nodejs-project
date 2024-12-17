import NoResult from "common/NoResult";
import { DataTable } from "Components";
import React, { forwardRef } from "react";
import { dateDuration } from "utility/durationDifference";

const TrainingInfo = forwardRef((props: any, ref: any) => {
  const trainingHistory = props?.trainingHistory;

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Training Type",
      dataIndex: "strInstituteName",
    },
    {
      title: "Training Title",
      dataIndex: "strTrainingTitle",
    },
    {
      title: "Training Mode",
      dataIndex: "strEducationDegree",
      render: (data: any) => data || "-",
    },
    {
      title: "Outcome",
      dataIndex: "strEducationFieldOfStudy",
      render: (data: any) => data || "-",
    },
    {
      title: "Training Time",
      dataIndex: "strCgpa",
    },
    {
      title: "Training Organization & Trainer",
      dataIndex: "strInstituteName",
      width: 60,
    },
    {
      title: "Training Duration",
      dataIndex: "dteStartDate",
      render: (_: any, rec: any) =>
        dateDuration(rec?.dteStartDate, rec?.dteEndDate),
    },
    {
      title: "Cost per Person",
      dataIndex: "dteFromDate",
    },
  ];

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          Training Information
        </h1>
      </center>
      {trainingHistory?.length > 0 ? (
        <DataTable bordered data={trainingHistory || []} header={header} />
      ) : (
        <NoResult />
      )}
    </div>
  );
});

export default TrainingInfo;
