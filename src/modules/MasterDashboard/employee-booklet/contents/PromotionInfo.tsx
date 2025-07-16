import { DataTable } from "Components";
import React, { forwardRef } from "react";

const PromotionInfo = forwardRef((props: any, ref: any) => {
  const { data } = props;

  const header = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Promotion Type",
      dataIndex: "promotionType",
      key: "promotionType",
      width: 180,
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Promoted From",
      dataIndex: "promotedFrom",
      key: "promotedFrom",
      width: 260,
      render: (_: any, record: any) => (
        <>
          <p>
            <b>HR Position:</b> {record?.promotedFrom?.hrPosition}
          </p>
          <p>
            <b>Designation:</b> {record?.promotedFrom?.designation}
          </p>
          <p>
            <b>Grade:</b> {record?.promotedFrom?.grade}
          </p>
          <p>
            <b>Department:</b> {record?.promotedFrom?.department}
          </p>
        </>
      ),
    },
    {
      title: "Promoted To",
      dataIndex: "promotedTo",
      key: "promotedTo",
      width: 260,
      render: (_: any, record: any) => (
        <>
          <p>
            <b>HR Position:</b> {record?.promotedTo?.hrPosition}
          </p>
          <p>
            <b>Designation:</b> {record?.promotedTo?.designation}
          </p>
          <p>
            <b>Grade:</b> {record?.promotedTo?.grade}
          </p>
          <p>
            <b>Department:</b> {record?.promotedTo?.department}
          </p>
        </>
      ),
    },
    {
      title: "Effective Date",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      width: 110,
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Salary Type",
      dataIndex: "salaryType",
      key: "salaryType",
      width: 100,
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: 100,
      render: (text: any) => <p>{text}</p>,
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
          scroll={{ x: 2000 }}
          data={data?.length > 0 ? data : []}
        />
      </div>
    </div>
  );
});

export default PromotionInfo;
