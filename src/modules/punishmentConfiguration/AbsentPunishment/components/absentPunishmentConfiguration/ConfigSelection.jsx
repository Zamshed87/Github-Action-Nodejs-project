import { Row, Col, Form } from "antd";
import { PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";
const dayOptions = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return {
    label: day.toString(),
    value: day,
  };
});
const ConfigSelection = ({ form }) => {
  const {
    workplaceDDL,
    employmentTypeDDL,
    empDesignationDDL,
    getEmploymentTypeDDL,
    absentCalculationType,
    absentAmountDeductionType,
    loadingACT,
    loadingADT,
  } = useConfigSelectionHook(form);
  console.log(Form.useWatch("employmentTypeList", form));

  return (
    <>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
          <Col md={5} sm={12} xs={24}>
            <PInput
              type="text"
              name="policyName"
              placeholder="Punishment Policy Name"
              label="Punishment Policy Name"
              rules={[
                {
                  required: true,
                  message: "Punishment Policy Name Is Required",
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
              }}
              loading={workplaceDDL.loading}
              rules={[{ required: true, message: "Workplace Is Required" }]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PSelectWithAll
              form={form}
              name="employmentTypeList"
              label="Employment Type"
              placeholder="Select Employment Type"
              options={employmentTypeDDL.data}
              loading={employmentTypeDDL.loading}
              advanceAllOption={true}
              rules={[
                { required: true, message: "Employment Type is required" },
              ]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PSelectWithAll
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
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PSelect
              options={absentCalculationType}
              name="absentCalculationType"
              label="Absent Calculation Type"
              placeholder="Select Absent Calculation Type"
              onChange={(value) => {
                form.setFieldsValue({ absentCalculationType: value });
              }}
              loading={loadingACT}
              rules={[
                {
                  required: true,
                  message: "Absent Calculation Type Is Required",
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
      <PCardBody>
        <Row gutter={[10, 2]}>
          <Col md={4} sm={12} xs={24}>
            <PSelect
              options={dayOptions}
              name="eachDayCountBy"
              label="Each Day Count by"
              placeholder="Select Each Day Count by"
              onChange={(value) => {
                form.setFieldsValue({ eachDayCountBy: value });
              }}
              rules={[
                { required: true, message: "Each Day Count By Is Required" },
              ]}
            />
          </Col>
          <Col md={3} sm={12} xs={24}>
            <PInput
              style={{ marginTop: "23px" }}
              label="Is Consecutive Day?"
              type="checkbox"
              layout="horizontal"
              name="consecutiveDay"
              onChange={(e) => {
                if (e.target.checked) {
                  form.setFieldsValue({ consecutiveDay: true });
                } else {
                  form.setFieldsValue({ consecutiveDay: false });
                }
              }}
              rules={[
                { required: true, message: "Consecutive Day Is Required" },
              ]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PSelect
              options={absentAmountDeductionType}
              name="amountDeductionType"
              label="Amount Deduct Type"
              placeholder="Select Amount Deduct Type"
              onChange={(value) => {
                form.setFieldsValue({ amountDeductionType: value });
              }}
              loading={loadingADT}
              rules={[
                {
                  required: true,
                  message: "Absent Calculation Type Is Required",
                },
              ]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PInput
              type="number"
              name="amountDeductionAmountOrPercentage"
              label="% of Amount (Based on 1 day)/ Fixed Amount"
              placeholder="% of Amount (Based on 1 day)/ Fixed Amount"
              min={1}
              rules={[
                {
                  required: true,
                  message:
                    "% of Amount (Based on 1 day)/ Fixed Amount Is Required",
                },
              ]}
            />
          </Col>
          <Col style={{ marginTop: "23px" }}>
            <PButton type="primary" action="button" content="Add" />
          </Col>
        </Row>
      </PCardBody>
    </>
  );
};

export default ConfigSelection;
