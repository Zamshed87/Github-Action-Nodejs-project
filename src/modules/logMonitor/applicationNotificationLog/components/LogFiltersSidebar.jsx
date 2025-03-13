import { Row, Col, Drawer } from "antd";
import { PButton, PSelect } from "Components";
import useNotificationLogFilters from "../hooks/useNotificationLogFilters";

const LogFiltersSidebar = ({ form, openFilter, setOpenFilter }) => {
  const {
    businessUnitDDL,
    workplaceGroupDDL,
    getWorkplaceGroupDDL,
    workplaceDDL,
    getWorkplaceDDL,
    notificationType,
    employeeDDL,
    getEmployeeDDL,
  } = useNotificationLogFilters({ form });

  return (
    <Drawer
      width={480}
      title="Filter"
      onClose={() => setOpenFilter(false)}
      open={openFilter}
    >
      <Row gutter={[10, 2]}>
        <Col md={12} sm={12} xs={24}>
          <PSelect
            options={businessUnitDDL || []}
            name="businessUnit"
            label="Business Unit"
            placeholder="Business Unit"
            onChange={(value, op) => {
              form.setFieldsValue({
                businessUnit: op,
                workplaceGroup: undefined,
                workplaceList: undefined,
              });
              getWorkplaceGroupDDL();
            }}
            rules={[{ required: true, message: "Business Unit is required" }]}
          />
        </Col>
        <Col md={11} sm={12} xs={24}>
          <PSelect
            options={workplaceGroupDDL || []}
            name="workplaceGroup"
            label="Workplace Group"
            placeholder="Workplace Group"
            onChange={(value, op) => {
              form.setFieldsValue({
                workplaceGroup: op,
                workplaceList: undefined,
              });
              getWorkplaceDDL();
            }}
            rules={[{ required: true, message: "Workplace Group is required" }]}
          />
        </Col>
        <Col  md={12} sm={12} xs={24}>
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
        <Col  md={11} sm={12} xs={24}>
          <PSelect
            options={notificationType}
            name="applicationCategory"
            label="Application Category"
            placeholder="Application Category"
            onChange={(value, op) => {
              form.setFieldsValue({
                applicationCategory: op,
              });
            }}
            // rules={[
            //   { required: true, message: "Application Category is required" },
            // ]}
          />
        </Col>
        <Col md={12} sm={12} xs={24}>
          <PSelect
            options={employeeDDL}
            name="employee"
            label="Select Employee"
            placeholder="Search Employee"
            showSearch
            onSearch={(value)=>{
              getEmployeeDDL(value);
            }}
            onChange={(value, op) => {
              form.setFieldsValue({
                employee: op,
              });
            }}
            // rules={[
            //   { required: true, message: "Employee is required" },
            // ]}
          />
        </Col>
        <Col  md={12} sm={12} xs={24}></Col>
        <Col md={4} sm={24}>
          <PButton
            style={{ marginTop: "20px" }}
            type="primary"
            content={"View"}
            action="submit"
            onClick={()=>{
              form.submit();
            }}
          />
        </Col>
        <Col md={4} sm={24}>
          <PButton
            style={{ marginTop: "20px" }}
            type="secondary"
            content="Reset"
            onClick={() => {
              const values = form.getFieldsValue(true);
              form.resetFields();
              form.setFieldsValue({
                ...values,
              });
            }}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default LogFiltersSidebar;
