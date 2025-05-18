import { PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Col, Form, Row } from "antd";

const EmployeeContributionPfPayment = ({ form }) => {
  const { paidAfterOpts, loadingPaidAfter } = useConfigSelectionHook(form, {
    fetchPaidAfterEnum: true,
  });
  const absentCalculationType = Form.useWatch("absentCalculationType", form);

  return (
    <>
      <h3 className="mb-3">Employee Contribution for PF Payment</h3>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
          <Col md={5} sm={12} xs={24}>
            <PSelect
              options={paidAfterOpts}
              name="intEmployeeContributionPaidAfter"
              label="Employee Contribution Paid After"
              placeholder="Select Employee Contribution Paid After"
              onChange={(_, op) => {
                form.setFieldsValue({ intEmployeeContributionPaidAfter: op });
              }}
              loading={loadingPaidAfter}
              rules={[
                {
                  required: true,
                  message: "Employee Contribution Paid After Is Required",
                },
              ]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PInput
              type="number"
              min={1}
              name="intEmployeeContributionInFixedMonth"
              label="Month (From Employee PF Contribution)"
              placeholder="Select Month (From Employee PF Contribution)"
              onChange={(value) => {
                form.setFieldsValue({
                  intEmployeeContributionInFixedMonth: value,
                });
              }}
              rules={[
                {
                  required: true,
                  message: "Month (From Employee PF Contribution) Is Required",
                },
              ]}
            />
          </Col>
        </Row>
      </PCardBody>
    </>
  );
};

export default EmployeeContributionPfPayment;
