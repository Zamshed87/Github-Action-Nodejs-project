import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
export const PaidLeave = ({ form }: any) => {
  return (
    <Row gutter={[10, 2]}>
      <Divider
        style={{
          marginBlock: "4px",
          marginTop: "6px",
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
          <span>Paid Leave Configuration</span>
        </div>
      </Divider>

      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          options={[
            { value: "Paid Leave", label: "Paid Leave" },
            { value: "Unpaid Leave", label: "Unpaid Leave" },
          ]}
          name="paidType"
          label="Paid Type"
          placeholder="Paid Type"
          onChange={(value, op) => {
            form.setFieldsValue({
              paidType: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Paid Type is required",
            },
          ]}
        />
      </Col>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const { paidType } = form.getFieldsValue(true);

          return (
            paidType?.label?.includes("Paid") && (
              <>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    options={[
                      { value: "Gross Salary", label: "Gross Salary" },
                      { value: "Basic Salary", label: "Basic Salary" },
                      { value: "Fixed Amount", label: "Fixed Amount" },
                    ]}
                    name="payDependsOn"
                    label="Pay Depend On"
                    placeholder="Pay Depend On"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        payDependsOn: op,
                      });
                    }}
                    rules={[
                      {
                        required: paidType?.label?.includes("Paid"),
                        message: "Pay Depend On is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="payValue"
                    label="Pay Depend On Value"
                    placeholder="Pay Depend On Value"
                    rules={[
                      {
                        required: paidType?.label?.includes("Paid"),
                        message: "Pay Depend On Value is required",
                      },
                    ]}
                  />
                </Col>
              </>
            )
          );
        }}
      </Form.Item>

      {/* <Col
    style={{
      marginTop: "23px",
    }}
  >
    <PButton type="primary" action="submit" content="View" />
  </Col> */}
    </Row>
  );
};
