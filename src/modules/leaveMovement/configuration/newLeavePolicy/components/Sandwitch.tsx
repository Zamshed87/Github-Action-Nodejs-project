import { Col, Divider, Row } from "antd";
import { DataTable, PInput } from "Components";
import React, { useState } from "react";

const SandwitchData = [
  {
    index: 0,
    scenario: "Leave + Offday + Leave",
    count: 0,
  },
  {
    index: 1,

    scenario: "Leave + Holiday + Leave",
    count: 0,
  },
  {
    index: 2,

    scenario: "Leave + Offday + Holiday + Leave",
    count: 0,
  },
  {
    index: 3,

    scenario: "Offday + Leave + Offday",
    count: 0,
  },
  {
    index: 4,

    scenario: "Holiday + Leave + Holiday",
    count: 0,
  },
  {
    index: 5,

    scenario: "Offday + Leave + Holiday",
    count: 0,
  },

  {
    index: 6,

    scenario: "Holiday + Leave + Offday",
    count: 0,
  },
];
export const Sandwitch = ({ form }: any) => {
  const [sandWitchLanding, setSandWitchLanding] =
    useState<any[]>(SandwitchData);
  const [selectedRow1, setSelectedRow1] = useState<any[]>([]);
  const [selectedRow2, setSelectedRow2] = useState<any[]>([]);

  const sandWitchHeader: any = [
    {
      title: "Scenario",
      dataIndex: "scenario",
      width: 100,
    },
    {
      title: "Leave Count",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={+row?.count || 0}
          placeholder=""
          onChange={(e) => {
            // if ((e as number) < 0) {
            //   return toast.warn("number must be positive");
            // }
            // if ((e as number) > 100) {
            //   return toast.warn("Percentage cant be greater than 100");
            // }

            const temp = [...sandWitchLanding];
            temp[row.index].count = e;
            setSandWitchLanding(temp);
          }}
        />
      ),
    },
  ];
  return (
    <Row gutter={[10, 2]}>
      <Divider
        style={{
          marginBlock: "4px",
          marginTop: "20px",
          fontSize: "14px",
          fontWeight: 600,
        }}
        orientation="left"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>Sandwitch Leave</span>
        </div>
      </Divider>
      <Col md={12}>
        <DataTable
          bordered
          data={sandWitchLanding.slice(0, 4)}
          loading={false}
          header={sandWitchHeader}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow1.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow1(selectedRows);
            },
          }}
        />
      </Col>
      <Col md={12}>
        <DataTable
          bordered
          data={sandWitchLanding.slice(4)}
          loading={false}
          header={sandWitchHeader}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow2.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow2(selectedRows);
            },
          }}
        />
      </Col>
    </Row>
  );
};
