import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";
import { shallowEqual, useSelector } from "react-redux";
import useNotificationLogFilters from "../hooks/useNotificationLogFilters";
import moment from "moment";

const LogFilters = ({ form }) => {
  const {
    profileData: { employeeId, userName },
  } = useSelector((store) => store?.auth, shallowEqual);
  const { 
    workplaceGroup,
    workplace,
    getWorkplace,
    levelOfLeadershipDDL
   } = useNotificationLogFilters({ form });
  const disabledDate = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplaceGroup?.data || []}
          name="workplaceGroup"
          label="Workplace Group"
          placeholder="Workplace Group"
          onChange={(value, op) => {
            form.setFieldsValue({
              workplaceGroup: op,
              workplace: undefined,
            });
            getWorkplace();
          }}
          rules={[{ required: true, message: "Workplace Group is required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={workplace?.data || []}
          name="workplace"
          label="Workplace"
          placeholder="Workplace"
          onChange={(value, op) => {
            form.setFieldsValue({
              workplace: op,
            });
          }}
          rules={[{ required: true, message: "Workplace is required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            { label: "Per Meal", value: 1 },
            { label: "Per Month", value: 2 },
          ]}
          name="mealType"
          label="Meal Type"
          placeholder="Meal Type"
          onChange={(value, op) => {
            form.setFieldsValue({
              mealType: op,
            });
          }}
          rules={[{ required: true, message: "Notification Type is required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
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
      <Col md={5} sm={12} xs={24}>
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
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default LogFilters;
