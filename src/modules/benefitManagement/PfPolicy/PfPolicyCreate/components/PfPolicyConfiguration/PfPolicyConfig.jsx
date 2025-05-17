import { Col, Row } from "antd";
import { PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";

const PfPolicyConfig = ({ form }) => {
    const {
        workplaceDDL,
        employmentTypeDDL,
        empDesignationDDL,
        getEmploymentTypeDDL,
        getEmployeeDesignation,
        absentCalculationTypeDDL,
        absentAmountDeductionTypeDDL,
        loadingACT,
        loadingADT,
      } = useConfigSelectionHook(form);
  return (
    <PCardBody className="mb-4">
      <Row gutter={[10, 2]}>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="text"
            name="policyName"
            placeholder="Policy Name"
            label="Policy Name"
            rules={[
              {
                required: true,
                message: "Policy Name Is Required",
              },
            ]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={workplaceDDL.data}
            name="workplaceId"
            label="Workplace"
            placeholder="Select Workplace"
            onChange={(value) => {
              form.setFieldsValue({ workplace: value });
              getEmploymentTypeDDL();
              getEmployeeDesignation();
            }}
            loading={workplaceDDL.loading}
            rules={[{ required: true, message: "Workplace Is Required" }]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          {/* <PSelectWithAll
            form={form}
            name="employmentTypeList"
            label="Employment Type"
            placeholder="Select Employment Type"
            options={employmentTypeDDL.data}
            loading={employmentTypeDDL.loading}
            advanceAllOption={true}
            rules={[{ required: true, message: "Employment Type is required" }]}
          /> */}
        </Col>
        <Col md={5} sm={12} xs={24}>
          {/* <PSelectWithAll
            form={form}
            name="designationList"
            label="Employee Designation"
            placeholder="Select Employee Designation"
            options={empDesignationDDL.data}
            loading={empDesignationDDL.loading}
            advanceAllOption={true}
            rules={[
              { required: true, message: "Employee Designation is required" },
            ]}
          /> */}
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PSelect
            options={absentCalculationTypeDDL}
            name="absentCalculationType"
            label="Calculation Type"
            placeholder="Select Calculation Type"
            onChange={(value) => {
              form.setFieldsValue({ absentCalculationType: value });
            }}
            loading={loadingACT}
            rules={[
              {
                required: true,
                message: "Calculation Type Is Required",
              },
            ]}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="text"
            name="policyDescription"
            placeholder="Policy Description"
            label="Policy Description"
          />
        </Col>
      </Row>
    </PCardBody>
  );
};

export default PfPolicyConfig;
