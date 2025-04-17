import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";
import useBankSalaryReportFilters from "./useBankSalaryReportFilters";
import moment from "moment";

const BankSalaryReportFilters = ({ form }) => {
  const { workplaceGroupDDL, reportTypeDDL } = useBankSalaryReportFilters();
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceGroupDDL.data}
          name="WorkplaceGroupId"
          label="Workplace Group"
          placeholder="Select Workplace Group"
          onChange={(value) =>
            form.setFieldsValue({ WorkplaceGroupId: value })
          }
          loading={workplaceGroupDDL.loading}
          // showSearch
          // onSearch={getSuperVisors}
          rules={[{ required: true, message: "Workplace Group Is Required" }]}
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
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={reportTypeDDL?.data}
          name="ReportTypeId"
          label="Report Type"
          placeholder="Select Report Type"
          onChange={(value) => form.setFieldsValue({ ReportTypeId: value })}
          rules={[{ required: true, message: "Report Type Is Required" }]}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default BankSalaryReportFilters;
