import { Row, Col } from "antd";
import { PButton, PSelect } from "Components";

const ReportFilters = ({
  form,
  supervisorDDL,
  getSuperVisors,
  departmentDDL,
  designationDDL,
  yearDDL,
  levelOfLeadershipDDL,
  showLevelOfLeadership = true,
}) => {
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[{ value: 0, label: "All" }, ...supervisorDDL.data] || []}
          name="supervisor"
          label="Supervisor"
          placeholder="Search minimum 2 characters"
          showSearch
          onChange={(value, op) => form.setFieldsValue({ supervisor: op })}
          loading={supervisorDDL.loading}
          onSearch={getSuperVisors}
        />
      </Col>

      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[{ value: 0, label: "All" }, ...departmentDDL.data] || []}
          name="department"
          label="Department"
          placeholder="Department"
          showSearch
          onChange={(value, op) => form.setFieldsValue({ department: op })}
        />
      </Col>

      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[{ value: 0, label: "All" }, ...designationDDL.data] || []}
          name="designation"
          label="Designation"
          placeholder="Designation"
          showSearch
          onChange={(value, op) => form.setFieldsValue({ designation: op })}
        />
      </Col>

      <Col md={3} sm={12} xs={24}>
        <PSelect
          options={yearDDL || []}
          name="year"
          label="Year"
          showSearch
          placeholder="Year"
          onChange={(value, op) => form.setFieldsValue({ year: op })}
          rules={[{ required: true, message: "Year is required" }]}
        />
      </Col>

      {showLevelOfLeadership && (
        <Col md={3} sm={12} xs={24}>
          <PSelect
            options={[{ value: 0, label: "All" }, ...levelOfLeadershipDDL] || []}
            name="levelOfLeadershipId"
            label="Level Of Leadership"
            showSearch
            placeholder="Level Of Leadership"
            onChange={(value, op) =>
              form.setFieldsValue({ levelOfLeadershipId: op })
            }
          />
        </Col>
      )}

      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View"/>
      </Col>
    </Row>
  );
};

export default ReportFilters;
