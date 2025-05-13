import { Row, Col } from "antd";
import { PButton, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";

const ConfigSelection = ({ form }) => {
  const {
    workplaceDDL,
    employmentTypeDDL,
    empDesignationDDL,
    getWorkplaceDDL,
    getEmploymentTypeDDL,
    getEmployeeDesignation,
  } = useConfigSelectionHook(form);
  return (
    <>
      <Row gutter={[10, 2]}>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="text"
            name="punishmentPolicyName"
            placeholder="Punishment Policy Name"
            label="Punishment Policy Name"
            rules={[{ required: true, message: "Punishment Policy Name Is Required" }]}
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
              getEmploymentTypeDDL();
            }}
            loading={workplaceDDL.loading}
            rules={[{ required: true, message: "Workplace Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={employmentTypeDDL.data}
            name="employmentType"
            label="Employment Type"
            placeholder="Select Employment Type"
            onChange={(_, op) => {
              form.setFieldsValue({ employmentType: op });
            }}
            loading={employmentTypeDDL.loading}
            rules={[{ required: true, message: "Employment Type Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={empDesignationDDL.data}
            name="employeeDesignation"
            label="Employee Designation"
            placeholder="Select Employee Designation"
            onChange={(_, op) => {
              form.setFieldsValue({ employeeDesignation: op });
            }}
            loading={empDesignationDDL.loading}
            rules={[{ required: true, message: "Employee Designation Is Required" }]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="text"
            name="location"
            placeholder="Location"
            label="Location"
            rules={[{ required: true, message: "Location Is Required" }]}
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
              getEmploymentTypeDDL();
            }}
            loading={workplaceDDL.loading}
            rules={[{ required: true, message: "Workplace Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={employmentTypeDDL.data}
            name="employmentType"
            label="Employment Type"
            placeholder="Select Employment Type"
            onChange={(_, op) => {
              form.setFieldsValue({ employmentType: op });
            }}
            loading={employmentTypeDDL.loading}
            rules={[{ required: true, message: "Employment Type Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={empDesignationDDL.data}
            name="employmentType"
            label="Employment Type"
            placeholder="Select Employment Type"
            onChange={(_, op) => {
              form.setFieldsValue({ employmentType: op });
            }}
            loading={employmentTypeDDL.loading}
            rules={[{ required: true, message: "Employment Type Is Required" }]}
          />
        </Col>

        <Col style={{ marginTop: "23px" }}>
          <PButton type="primary" action="submit" content="View" />
        </Col>
      </Row>
    </>
  );
};

export default ConfigSelection;
