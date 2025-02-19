import { Col, Divider, Form, Row } from "antd";
import { DataTable, PButton, PInput, PSelect, TableButton } from "Components";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const CalculativeDays = ({ form }: any) => {
  const [policy, setPolicy] = useState<any>([]);
  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Policy Name",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Leave Display Name",
      dataIndex: "codeName",
      width: 100,
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      width: 100,
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                setPolicy((prev: any) => {
                  const filterArr = prev.filter(
                    (itm: any, idx: number) => idx !== index
                  );
                  return filterArr;
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  return (
    <>
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
            <span>Calculative Days</span>
          </div>
        </Divider>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Present"
            type="checkbox"
            layout="horizontal"
            name="isPresent"
          />
        </Col>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Offday"
            type="checkbox"
            layout="horizontal"
            name="isOffday"
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Movement"
            type="checkbox"
            layout="horizontal"
            name="isMovement"
          />
        </Col>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Holiday"
            type="checkbox"
            layout="horizontal"
            name="isHoliday"
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Late"
            type="checkbox"
            layout="horizontal"
            name="isLate"
          />
        </Col>
        <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Absent"
            type="checkbox"
            layout="horizontal"
            name="isAbsent"
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
          <PInput
            label="Include Leave"
            type="checkbox"
            layout="horizontal"
            name="isLeave"
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[]}
            name="policy"
            label="Leave Policy"
            placeholder=""
            onChange={(value, op) => {
              form.setFieldsValue({
                policy: op,
              });
            }}
            rules={[
              {
                required: policy?.length === 0,
                message: "Leave Policy is required",
              },
            ]}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { policy } = form.getFieldsValue(true);

            return (
              <Col
                style={{
                  marginTop: "40px",
                }}
              >
                <PButton
                  type="primary"
                  action="button"
                  content="Add"
                  onClick={() => {
                    if (policy === undefined) {
                      return toast.warn("Please Select a Policy");
                    }

                    const fields = ["policy"];
                    form
                      .validateFields(fields)
                      .then(() => {
                        setPolicy((prev: any) => [
                          ...prev,
                          {
                            name: policy?.label,
                            type: policy?.type,
                            codeName: policy?.code,
                          },
                        ]);
                        form.setFieldsValue({
                          policy: undefined,
                        });
                      })
                      .catch((e: any) => {
                        console.log({ e });
                      });
                  }}
                />
              </Col>
            );
          }}
        </Form.Item>
        {policy?.length > 0 && (
          <Col>
            <DataTable
              bordered
              data={policy}
              loading={false}
              header={encashheader}
            />
          </Col>
        )}
      </Row>
    </>
  );
};
