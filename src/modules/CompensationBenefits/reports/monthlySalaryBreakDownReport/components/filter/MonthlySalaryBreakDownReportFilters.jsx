import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";
import useYearlySalaryReportFilters from "./useMonthlySalaryBreakDownReportFilters";
import moment from "moment";

const YearlySalaryReportFilters = ({ form }) => {
  const { workplaceGroupDDL, workplaceDDL, getWorkplaceDDL } =
    useYearlySalaryReportFilters(form);

  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceGroupDDL.data}
          name="workplaceGroup"
          label="Workplace Group"
          placeholder="Select Workplace Group"
          onChange={(_, op) => {
            form.setFieldsValue({ workplaceGroup: op });
            getWorkplaceDDL();
          }}
          loading={workplaceGroupDDL.loading}
          rules={[{ required: true, message: "Workplace Group Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceDDL.data}
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
      <Col md={6} sm={24}>
        <PInput
          type="date"
          picker="month"
          format="MMM, YYYY"
          name="month"
          placeholder="Select Month Year"
          label="Month-Year"
          onChange={(value) => {
            // Month moment(value).format("MM")
            // Year moment(value).format("YYYY")
            form.setFieldsValue({ Month: moment(value).format("MM") });
            form.setFieldsValue({ Year: moment(value).format("YYYY") });
          }}
          rules={[{ required: true, message: "Year Month Is Required" }]}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default YearlySalaryReportFilters;
