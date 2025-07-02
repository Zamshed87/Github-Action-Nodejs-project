import { Col, Row } from "antd";
import { PSelect } from "Components";
import usePfPolicyAssignFilters from "./usePfPolicyAssignFilters";

const PfPolicyAssignFilters = ({ form }) => {
  const { departmentDDL, employeeDDL, getEmployeeDDL } =
    usePfPolicyAssignFilters();
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          maxTagCount={"responsive"}
          options={departmentDDL?.data || []}
          name="ListOfDepartment"
          mode={"multiple"}
          showSearch
          filterOption={true}
          label="Department"
          placeholder="Select Department"
          onChange={(_, op) => {
            form.setFieldsValue({ department: op });
          }}
          // rules={[{ required: true, message: "Department is required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          showSearch
          onSearch={(value) => {
            getEmployeeDDL(value);
          }}
          maxTagCount={"responsive"}
          options={employeeDDL?.data || []}
          mode={"multiple"}
          name="ListOfEmployee"
          label="Employee"
          placeholder="Search Employee"
          loading={employeeDDL.loading}
          // rules={[{ required: true, message: "Employee Is Required" }]}
        />
      </Col>
    </Row>
  );
};

export default PfPolicyAssignFilters;
