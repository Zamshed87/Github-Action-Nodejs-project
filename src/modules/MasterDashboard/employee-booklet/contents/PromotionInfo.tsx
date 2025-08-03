import { DataTable } from "Components";
import React, { forwardRef } from "react";
import { dateFormatter } from "utility/dateFormatter";

const PromotionInfo = forwardRef((props: any, ref: any) => {
  console.log("PromotionInfo props", props);
  const { data } = props;
  const header = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Promotion Type",
      dataIndex: "PromotionType",
      width: 40,
      //   render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Promoted From",
      dataIndex: "",
      width: 80,
      render: (_: any, record: any) =>
        record?.PromotionType !== "Grade" ? (
          <>
            <p>
              <b>Designation:</b> {record?.FromDesignationName}
            </p>
            <p>
              <b>Grade:</b> {record?.OldPayscaleName}
              {record?.OldSlabCount ? `( ${record?.OldSlabCount})` : ""}
            </p>
            <p>
              <b>Department:</b> {record?.FromDepartmentName}
            </p>
          </>
        ) : (
          <p>
            <b>Grade:</b> {record?.OldPayscaleName}
            {record?.OldSlabCount ? `( ${record?.OldSlabCount})` : ""}
          </p>
        ),
    },
    {
      title: "Promoted To",
      dataIndex: "",
      width: 80,
      render: (_: any, record: any) =>
        record?.PromotionType !== "Grade" ? (
          <>
            <p>
              <b>Designation:</b> {record?.ToDesignationName}
            </p>
            <p>
              <b>Grade:</b> {record?.NewPayscaleName}
              {record?.NewPayscaleName ? `( ${record?.NewPayscaleName})` : ""}
            </p>
            <p>
              <b>Department:</b> {record?.ToDepartmentName}
            </p>
          </>
        ) : (
          <p>
            <b>Grade:</b> {record?.NewPayscaleName}
            {record?.NewSlabCount ? `( ${record?.NewSlabCount})` : ""}
          </p>
        ),
    },
    {
      title: "Effective Date",
      dataIndex: "EffectiveDate",
      width: 40,
      render: (_: any, record: any) => (
        <p>{record?.EffectiveDate && dateFormatter(record?.EffectiveDate)}</p>
      ),
    },
    {
      title: "Salary Type",
      dataIndex: "SalaryType",
      width: 40,
    },
    {
      title: "Gross Salary",
      dataIndex: "GrossSalary",
      key: "grossSalary",
      width: 30,
    },
    {
      title: "Raised",
      dataIndex: "Raised",
      key: "Raised",
      width: 30,
    },
  ];

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          Promotion Information
        </h1>
      </center>
      <div>
        <DataTable
          header={header}
          nodataStyle={{ marginTop: "-35px", height: "175px" }}
          bordered
          //   scroll={{ x: 2000 }}
          data={data?.length > 0 ? data : []}
        />
      </div>
    </div>
  );
});

export default PromotionInfo;
