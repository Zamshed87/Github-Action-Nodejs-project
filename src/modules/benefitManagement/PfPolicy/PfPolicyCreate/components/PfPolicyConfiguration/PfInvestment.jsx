import { PCardBody, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Checkbox, Col, Form, Row } from "antd";

const PfInvestment = ({ form }) => {
  const { investmentOpts, loadingInvestment } = useConfigSelectionHook(form, {
    fetchInvestmentEnum: true,
  });

  return (
    <>
      <h3 className="mb-3">PF Investment</h3>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
        <Col md={3} sm={12} xs={24}>
            <Form.Item
              name="isPFInvestment"
              valuePropName="checked"
              style={{ marginTop: 23, marginBottom: 0 }}
            >
              <Checkbox
                onChange={(e) =>
                  form.setFieldsValue({ isPFInvestment: e.target.checked })
                }
              >
                Is PF Investment?
              </Checkbox>
            </Form.Item>
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PSelect
            options={investmentOpts}
              name="intMonthlyInvestmentWith"
              label="Monthly Investment With"
              placeholder="Select Monthly Investment With"
              onChange={(value) => {
                form.setFieldsValue({
                  intMonthlyInvestmentWith: value,
                });
              }}
              loading={loadingInvestment}
              rules={[
                {
                  required: true,
                  message: "Monthly Investment With Is Required",
                },
              ]}
            />
          </Col>
        </Row>
      </PCardBody>
    </>
  );
};

export default PfInvestment;
