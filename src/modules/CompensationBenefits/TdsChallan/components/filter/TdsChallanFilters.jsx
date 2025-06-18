import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";
import useTdsChallanFilters from "./useTdsChallanFilters";

const TdsChallanFilters = ({ form }) => {
  const { fiscalYearDDL, workplaceDDL } = useTdsChallanFilters();
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={fiscalYearDDL?.data?.length > 0 ? fiscalYearDDL?.data : []}
          name="fiscalYear"
          mode="multiple"
          showSearch
          filterOption={true}
          label="Financial Year"
          placeholder="Financial Year"
          onChange={(value, op) => {
            form.setFieldsValue({ fiscalYear: op });
          }}
          rules={[{ required: true, message: "Fiscal Year is required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceDDL.data}
          mode="multiple"
          name="workplace"
          label="Workplace"
          placeholder="Select Workplace"
          onChange={(_, op) => {
            form.setFieldsValue({ workplace: op });
          }}
          loading={workplaceDDL.loading}
          // rules={[{ required: true, message: "Workplace Is Required" }]}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default TdsChallanFilters;
