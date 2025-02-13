import { Col, Divider, Form, Row } from "antd";
import { DataTable, PButton, PInput, PSelect, TableButton } from "Components";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const Encashment = ({ form }: any) => {
  const [tableData, setTableData] = useState<any>([]);

  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Service Length",
      dataIndex: "serviceLength",
      width: 100,
    },
    {
      title: "Leave Encashment Type",
      dataIndex: "encashmentType",
      width: 100,
    },
    {
      title: "Max Leave Encashment",
      dataIndex: "maxEncashment",
      width: 100,
    },
    {
      title: "Encashment Benefits",
      dataIndex: "encashBenefits",
      width: 100,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
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
                setTableData((prev: any) => {
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
          <span>Leave Encashment</span>
        </div>
      </Divider>
      <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
        <PInput
          label="Is Encashment"
          type="checkbox"
          layout="horizontal"
          name="isEncashment"
        />
      </Col>
      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "After Leave Lapse" },
            { value: 2, label: "Final Settlement" },
            { value: 2, label: "Anytime" },
            // { value: 3, label: "Clock Time" },
          ]}
          name="encashmentTimeline"
          label="Encashment Timeline"
          placeholder="Encashment Timeline"
          onChange={(value, op) => {
            form.setFieldsValue({
              encashmentTimeline: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Encashment Timeline is required",
            },
          ]}
        />
      </Col>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="number"
            name="serviceStartLength"
            label="From Service Length (Month)"
            placeholder=""
            // rules={[
            //   {
            //     required: true,
            //     message: "From Service Length (Month) is required",
            //   },
            // ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="number"
            name="serviceEndLength"
            label="To Service Length (Month)"
            placeholder=""
            // rules={[
            //   {
            //     required: true,
            //     message: "To Service Length (Month) is required",
            //   },
            // ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[
              { value: 1, label: "Percentage of Days" },
              { value: 2, label: "Fixed Days" },
              // { value: 3, label: "Clock Time" },
            ]}
            name="encashType"
            label="Leave Encashment Type *"
            placeholder="Leave Encashment Type *"
            onChange={(value, op) => {
              form.setFieldsValue({
                encashType: op,
              });
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Leave Carry Forward Type is required",
            //   },
            // ]}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { encashType } = form.getFieldsValue(true);

            return (
              <>
                <Col md={5} sm={24}>
                  <PInput
                    type="number"
                    name="maxEncashment"
                    label={`Max Leave Encashment (${
                      encashType?.value === 1 ? "% of Days" : "Fixed Days"
                    })`}
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message:
                    //       "Max Carry Forward After Lapse (%, Days) is required",
                    //   },
                    // ]}
                  />
                </Col>
              </>
            );
          }}
        </Form.Item>
        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={[
              { value: 1, label: "Basic" },
              { value: 2, label: "Gross" },
              { value: 3, label: "Fixed Amount" },
            ]}
            name="encashBenefits"
            label="Encashment Benefits"
            placeholder=""
            onChange={(value, op) => {
              form.setFieldsValue({
                encashBenefits: op,
              });
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Leave Carry Forward Type is required",
            //   },
            // ]}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const {
              paidAmount,
              encashBenefits,
              maxEncashment,
              encashType,
              serviceEndLength,
              serviceStartLength,
            } = form.getFieldsValue(true);

            return (
              <>
                <Col md={5} sm={24}>
                  <PInput
                    type="number"
                    name="paidAmount"
                    label={`Max Leave Encashment (${
                      encashBenefits?.value !== 3 ? "% " : "Amount"
                    })`}
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message:
                    //       "Max Carry Forward After Lapse (%, Days) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Col
                  style={{
                    marginTop: "23px",
                  }}
                >
                  <PButton
                    type="primary"
                    action="button"
                    content="Add"
                    onClick={() => {
                      if (
                        paidAmount === undefined ||
                        encashBenefits === undefined ||
                        encashType === undefined ||
                        serviceEndLength === undefined ||
                        serviceStartLength === undefined ||
                        maxEncashment === undefined
                      ) {
                        return toast.warn("Please fill up the fields");
                      }
                      if (serviceEndLength < serviceStartLength) {
                        return toast.warn(
                          "Service End Length must be greater than Service Start Length"
                        );
                      }

                      setTableData((prev: any) => [
                        ...prev,
                        {
                          serviceLength: `${serviceStartLength} - ${serviceEndLength}`,
                          encashmentType: encashType?.label,
                          maxEncashment,
                          encashBenefits: encashBenefits?.label,
                          paidAmount,
                        },
                      ]);
                      form.setFieldsValue({
                        serviceStartLength: undefined,
                        serviceEndLength: undefined,
                        encashmentType: undefined,
                        maxEncashment: undefined,
                        encashBenefits: undefined,
                        paidAmount: undefined,
                      });
                    }}
                  />
                </Col>
              </>
            );
          }}
        </Form.Item>
        {tableData?.length > 0 && (
          <Col>
            <DataTable
              bordered
              data={tableData}
              loading={false}
              header={encashheader}
            />
          </Col>
        )}
      </Row>
    </Row>
  );
};
