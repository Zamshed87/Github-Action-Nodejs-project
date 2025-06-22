import { Row, Col, Form } from "antd";
import { PButton, PInput, PSelect } from "Components";
import usePfPolicyFilters from "./usePfInvestmentFilters";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";

const PfInvestmentFilters = ({ form }) => {
  const { investmentType, loadingInvestmentType } = usePfPolicyFilters(form);
  const tut = Form.useWatch("InvestmentTypeId", form);
  console.log(tut)
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="date"
          name="FromDateF"
          format={"YYYY-MM-DD"}
          onChange={(_, date) => {
            form.setFieldsValue({ FromDate: date });
          }}
          placeholder="From Date"
          label="From Date"
          rules={[
            {
              required: true,
              message: "From Date Is Required",
            },
          ]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PInput
          type="date"
          name="ToDateF"
          format={"YYYY-MM-DD"}
          onChange={(_, date) => {
            form.setFieldsValue({ ToDate: date });
          }}
          placeholder="To Date"
          label="To Date"
          rules={[
            {
              required: true,
              message: "To Date Is Required",
            },
          ]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelectWithAll
          form={form}
          name="InvestmentTypeId"
          label="Investment Type"
          placeholder="Select Investment Type"
          onChange={(value) => {
            form.setFieldsValue({ InvestmentTypeId: value });
          }}
          options={investmentType}
          loading={loadingInvestmentType}
          AllValueZero
          rules={[{ required: true, message: "Investment Type Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            {
              value: "InActive",
              label: "InActive",
            },
            {
              value: "Not Started",
              label: "Not Started",
            },
            {
              value: "Running",
              label: "Running",
            },
            {
              value: "Matured",
              label: "Matured",
            },
            {
              value: "Profit Shared",
              label: "Profit Shared",
            },
            {
              value: "Collection Completed",
              label: "Collection Completed",
            },
          ]}
          name="status"
          label="Status"
          placeholder="Select Status"
          onChange={(value) => {
            form.setFieldsValue({ status: value });
          }}
          rules={[{ required: true, message: "Status Is Required" }]}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default PfInvestmentFilters;
