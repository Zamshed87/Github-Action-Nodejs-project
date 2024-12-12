import { Col, Row } from "antd";
import { DataTable } from "Components";
import React from "react";
import { dateFormatter } from "utility/dateFormatter";
import { getSerial } from "Utils";

const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const PlanningView = ({ data, dataDetails }: any) => {
  const headerCost = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Cost Type",
      dataIndex: "trainingCostTypeName",
    },
    {
      title: "Cost Value",
      dataIndex: "amount",
    },
  ];
  const headerTrainer: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: 1,
          pageSize: 1000,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Inhouse Trainer?",
      dataIndex: "isInHouseTrainer",
      render: (isInHouseTrainer: boolean) => (isInHouseTrainer ? "Yes" : "No"),
    },
    {
      title: "Name of Trainer",
      dataIndex: "name",
      filter: true,
      filterKey: "nameofTrainerList",
      filterSearch: true,
    },
    {
      title: "Name of Organization",
      dataIndex: "organization",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Contact No",
      dataIndex: "contactNo",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Email",
      dataIndex: "email",
    },
  ];
  const headerPer = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Participants List",
      dataIndex: "employeeName",
      width: 120,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "HR Position",
      dataIndex: "hrPositionName",
      width: 50,
    },
    // {
    //   title: "workplaceGroup",
    //   dataIndex: "workplaceGroup",
    //   width: 50,
    // },
    // {
    //   title: "workplace",
    //   dataIndex: "workplace",
    // },
  ];
  return (
    <Row gutter={[10, 2]} style={{ paddingLeft: "15px" }}>
      <Col md={8}>
        <div style={labelStyle}>Business Unit:</div>
        <div style={valueStyle}>{data?.businessUnitName || "N/A"}</div>
      </Col>
      <Col md={8}>
        <div style={labelStyle}>Workplace Group:</div>
        <div style={valueStyle}>{data?.workplaceGroupName || "N/A"}</div>
      </Col>
      <Col md={8}>
        <div style={labelStyle}>Workplace:</div>
        <div style={valueStyle}>{data?.workplaceName || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Type:</div>
        <div style={valueStyle}>{data?.trainingTypeName || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Title:</div>
        <div style={valueStyle}>{data?.trainingTitleName || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Mode:</div>
        <div style={valueStyle}>{data?.trainingModeStatus?.label || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Organizer:</div>
        <div style={valueStyle}>
          {data?.trainingOrganizerType?.label || "N/A"}
        </div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Training Status:</div>
        <div style={valueStyle}>{data?.status?.label || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px" }}>
        <div style={labelStyle}>Objectives/ Key Learnings/ Outcomes:</div>
        <div style={valueStyle}>{data?.objectives || "N/A"}</div>
      </Col>
      <Col md={8} style={{ marginTop: "10px", marginBottom: "20px" }}>
        <div style={labelStyle}>Training Venue:</div>
        <div style={valueStyle}>{data?.venueAddress || "N/A"}</div>
      </Col>

      {dataDetails?.trainingTrainerDto?.length > 0 && (
        <>
          <h1>List of Trainer & Organization</h1>
          <div className="mb-3 mt-2">
            <DataTable
              bordered
              data={dataDetails?.trainingTrainerDto || []}
              loading={false}
              header={headerTrainer}
            />
          </div>
        </>
      )}

      {dataDetails?.trainingCostDto?.length > 0 && (
        <>
          <h1>List of Training Cost</h1>
          <div className="mb-3 mt-2">
            <DataTable
              bordered
              data={dataDetails?.trainingCostDto || []}
              loading={false}
              header={headerCost}
            />
          </div>
        </>
      )}

      {dataDetails?.trainingParticipantDto?.length > 0 && (
        <>
          <h1>List of Participants</h1>
          <div className="mb-3 mt-2">
            <DataTable
              bordered
              data={dataDetails?.trainingParticipantDto || []}
              loading={false}
              header={headerPer}
            />
          </div>
        </>
      )}
    </Row>
  );
};

export default PlanningView;
