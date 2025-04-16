import { Row, Col, Form } from "antd";
import { PButton, PSelect } from "Components";
import useYearlySalaryReportFilters from "./useYearlySalaryReportFilters";

const YearlySalaryReportFilters = ({ form }) => {
  const {
    yearTypeDDL,
    loadingYearType,
    fiscalYearDDL,
    loadingFiscalYear,
    yearDDL,
    reportTypeDDL,
    workplaceGroupDDL,
    workplaceDDL,
    getWorkplaceDDL,
    departmentDDL,
    getDepartmentDDL,
    sectionDDL,
    getSectionDDL,
    hrPositionDDL,
    getHrPositionDDL,
    designationDDL,
    getDesignationDDL,
  } = useYearlySalaryReportFilters(form);
  const yearType = Form.useWatch("yearType", form);
  const reportType = Form.useWatch("reportType", form);

  console.log(yearType);
  return (
    <Row gutter={[10, 2]}>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={yearTypeDDL}
          name="yearType"
          label="Year Type"
          placeholder="Select Year Type"
          onChange={(_, op) => form.setFieldsValue({ yearType: op })}
          loading={loadingYearType}
          rules={[{ required: true, message: "Year Type Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={yearType?.value == 0 ? yearDDL.data : fiscalYearDDL}
          name="year"
          label="Year"
          placeholder="Select Year"
          loading={yearType?.value == 0 ? false : loadingFiscalYear}
          onChange={(_, op) => form.setFieldsValue({ year: op })}
          rules={[{ required: true, message: "Year Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={reportTypeDDL?.data}
          name="reportType"
          label="Report Type"
          placeholder="Select Report Type"
          onChange={(_, op) => form.setFieldsValue({ reportType: op })}
          rules={[{ required: true, message: "Report Type Is Required" }]}
        />
      </Col>
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
          options={[
            {
              label: "All",
              value: 0,
            },
            ...workplaceDDL.data,
          ]}
          name="workplace"
          label="Workplace"
          placeholder="Select Workplace"
          onChange={(_, op) => {
            form.setFieldsValue({ workplace: op });
            getDepartmentDDL();
          }}
          loading={workplaceDDL.loading}
          // rules={[{ required: true, message: "Workplace Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            {
              label: "All",
              value: 0,
            },
            ...departmentDDL.data,
          ]}
          name="department"
          label="Department"
          placeholder="Select Department"
          onChange={(_, op) => {
            form.setFieldsValue({ department: op });
            getSectionDDL();
          }}
          loading={departmentDDL.loading}
          // rules={[{ required: true, message: "Department Is Required" }]}
        />
      </Col>
      <Col md={5} sm={12} xs={24}>
        <PSelect
          options={[
            {
              label: "All",
              value: 0,
            },
            ...sectionDDL.data,
          ]}
          name="section"
          label="Section"
          placeholder="Select Section"
          onChange={(_, op) => {
            form.setFieldsValue({ section: op });
            reportType?.value == 0 ? getHrPositionDDL() : getDesignationDDL();
          }}
          loading={sectionDDL.loading}
          // rules={[{ required: true, message: "Section Is Required" }]}
        />
      </Col>
      {reportType?.value == 1 ? (
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={[
              {
                label: "All",
                value: 0,
              },
              ...designationDDL.data,
            ]}
            name="designation"
            label="Designation"
            placeholder="Select Designation"
            onChange={(_, op) => form.setFieldsValue({ designation: op })}
            loading={designationDDL.loading}
            // rules={[{ required: true, message: "HR Position Is Required" }]}
          />
        </Col>
      ) : (
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={[
              {
                label: "All",
                value: 0,
              },
              ...hrPositionDDL.data,
            ]}
            name="hrPosition"
            label="HR Position"
            placeholder="Select HR Position"
            onChange={(_, op) => form.setFieldsValue({ hrPosition: op })}
            loading={hrPositionDDL.loading}
            // rules={[{ required: true, message: "HR Position Is Required" }]}
          />
        </Col>
      )}
      <Col style={{ marginTop: "23px" }}>
        <PButton type="primary" action="submit" content="View" />
      </Col>
    </Row>
  );
};

export default YearlySalaryReportFilters;
