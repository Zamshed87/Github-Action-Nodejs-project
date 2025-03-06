import { Col, Divider, Form, Row } from "antd";
import { DataTable, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";

export const Sandwitch = ({ form, selectedRow1, setSelectedRow1 }: any) => {
  const [sandWitchLanding, setSandWitchLanding] = useState<any[]>([]);

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
  const enumApi = useApiRequest({});

  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "SandwichLeaveEnum",
      },
      onSuccess: (data: any) => {
        data?.SandwichLeaveEnum?.forEach((item: any, id: any) => {
          data.SandwichLeaveEnum[id].index = item.value;
          data.SandwichLeaveEnum[id].scenario = item.label;
        });
        setSandWitchLanding(data?.SandwichLeaveEnum);
      },
    });
  };
  useEffect(() => {
    getDependTypes();
  }, []);

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
