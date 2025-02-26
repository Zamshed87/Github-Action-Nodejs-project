import { Col, Divider, Form, Row } from "antd";
import { DataTable, PInput, PSelect } from "Components";
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
export const Sandwitch = ({
  form,
  selectedRow1,
  setSelectedRow1,
  selectedRow2,
  setSelectedRow2,
}: any) => {
  const [sandWitchLanding, setSandWitchLanding] =
    useState<any[]>(SandwitchData);

  const sandWitchHeader: any = [
    {
      title: "Scenario",
      dataIndex: "scenario",
      width: 100,
    },
    // {
    //   title: "Leave Count",
    //   width: 150,

    //   render: (_value: any, row: any, index: number) => (
    //     <PInput
    //       type="number"
    //       value={+row?.count || 0}
    //       placeholder=""
    //       onChange={(e) => {
    //         // if ((e as number) < 0) {
    //         //   return toast.warn("number must be positive");
    //         // }
    //         // if ((e as number) > 100) {
    //         //   return toast.warn("Percentage cant be greater than 100");
    //         // }

    //         const temp = [...sandWitchLanding];
    //         temp[row.index].count = e;
    //         setSandWitchLanding(temp);
    //       }}
    //     />
    //   ),
    // },
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
          <span>
            Sandwitch Leave [The leave will be generated only after the salary
            has been processed.]
          </span>
        </div>
      </Divider>
      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "Yes" },
            { value: 0, label: "No" },
          ]}
          name="isSandwitch"
          label="Sandwitch Leave"
          placeholder=" "
          onChange={(value, op) => {
            form.setFieldsValue({
              isSandwitch: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Sandwitch Leave  is required",
            },
          ]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { isSandwitch } = form.getFieldsValue(true);

          return (
            isSandwitch?.value === 1 && (
              <>
                <Col md={24}>
                  <DataTable
                    bordered
                    data={sandWitchLanding}
                    loading={false}
                    header={sandWitchHeader}
                    rowSelection={{
                      type: "checkbox",
                      selectedRowKeys: selectedRow1.map(
                        (item: any) => item?.key
                      ),
                      onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRow1(selectedRows);
                      },
                    }}
                  />
                </Col>
              </>
            )
          );
        }}
      </Form.Item>

      {/* <Col md={12}>
        <DataTable
          bordered
          data={sandWitchLanding.slice(4)}
          loading={false}
          header={sandWitchHeader}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow2.map((item: any) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow2(selectedRows);
            },
          }}
        />
      </Col> */}
    </Row>
  );
};
