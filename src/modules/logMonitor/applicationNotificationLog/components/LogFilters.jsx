import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";
import useNotificationLogFilters from "../hooks/useNotificationLogFilters";
import moment from "moment";

const LogFilters = ({ form }) => {
  const {
    businessUnitDDL,
    workplaceGroupDDL,
    getWorkplaceGroupDDL,
    workplaceDDL,
    getWorkplaceDDL,
  } = useNotificationLogFilters({ form });

  const disabledDate = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  return (
    <Row gutter={[10, 2]}>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={businessUnitDDL || []}
          name="businessUnit"
          label="Business Unit"
          placeholder="Business Unit"
          onChange={(value, op) => {
            form.setFieldsValue({
              businessUnit: op,
              workplaceGroup: undefined,
              workplace: undefined,
            });
            getWorkplaceGroupDDL();
          }}
          rules={[{ required: true, message: "Business Unit is required" }]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={workplaceGroupDDL || []}
          name="workplaceGroup"
          label="Workplace Group"
          placeholder="Workplace Group"
          onChange={(value, op) => {
            form.setFieldsValue({
              workplaceGroup: op,
              workplace: undefined,
            });
            getWorkplaceDDL();
          }}
          rules={[{ required: true, message: "Workplace Group is required" }]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={workplaceDDL || []}
          name="workplaceList"
          label="Workplace List"
          placeholder="Workplace List"
          onChange={(value, op) => {
            form.setFieldsValue({
              workplaceList: op,
            });
          }}
          rules={[{ required: true, message: "Workplace List is required" }]}
        />
      </Col>
      <Col md={3} sm={12} xs={24}>
        <PSelect
          options={[
            { label: "Push", value: 1 },
            { label: "RealTime", value: 2 },
            { label: "Mail", value: 3 },
            { label: "Sms", value: 4 },
          ]}
          name="notificationType"
          label="Notification Type"
          placeholder="Notification Type"
          onChange={(value, op) => {
            form.setFieldsValue({
              notificationType: op,
            });
          }}
          rules={[{ required: true, message: "Notification Type is required" }]}
        />
      </Col>
      <Col md={3} sm={12} xs={24}>
        <PInput
          type="date"
          name="fromDate"
          label="From Date"
          placeholder="From Date"
          onChange={(value) => {
            form.setFieldsValue({
              fromDate: value,
            });
          }}
        />
      </Col>
      <Col md={3} sm={12} xs={24}>
        <PInput
          type="date"
          name="toDate"
          label="To Date"
          placeholder="To Date"
          disabledDate={disabledDate}
          onChange={(value) => {
            form.setFieldsValue({
              toDate: value,
            });
          }}
        />
      </Col>
      <Col md={2} style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default LogFilters;
