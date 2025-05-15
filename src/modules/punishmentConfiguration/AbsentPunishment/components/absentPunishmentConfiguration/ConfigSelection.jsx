import { Row, Col, Form, Checkbox } from "antd";
import { PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";
import DayRangePicker from "Components/PForm/Day/DayRangePicker";
import { toast } from "react-toastify";

const ConfigSelection = ({ form, setDetailList }) => {
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
  const absentCalculationType = Form.useWatch("absentCalculationType", form);
  console.log(absentCalculationType);
  const onAddDetail = () => {
    form
      .validateFields()
      .then((values) => {
        const day = values?.eachDayCountBy?.format("DD");
        const dayRange = `${values?.dayRange?.[0].format(
          "DD"
        )} - ${values?.dayRange?.[1].format("DD")}`;
        const detail = {
          eachDayCountBy: parseInt(day),
          dayRange: dayRange,
          dayRangeStartDay: values?.dayRange?.[0].format("DD"),
          dayRangeEndDay: values?.dayRange?.[1].format("DD"),
          consecutiveDay: values.consecutiveDay,
          amountDeductionType: values.amountDeductionType?.value,
          amountDeductionTypeName: values.amountDeductionType?.label,
          amountDeductionAmountOrPercentage:
          values.amountDeductionAmountOrPercentage,
        };
        setDetailList((prev) => [...prev, detail]);
        form.resetFields([
          "eachDayCountBy",
          "dayRange",
          "consecutiveDay",
          "amountDeductionType",
          "amountDeductionAmountOrPercentage",
        ]);
      })
      .catch((err) => {
        console.warn("Validation failed:", err);
        toast.error("Please fill all required fields.");
      });
  };

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
                getEmployeeDesignation();
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
              options={absentCalculationTypeDDL}
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
          {absentCalculationType === "1" && (
            <Col md={4} sm={12} xs={24}>
              <DayRangePicker
                type="day"
                name="eachDayCountBy"
                label="Each Day Count by"
                rules={[
                  { required: true, message: "Each Day Count By Is Required" },
                ]}
              />
            </Col>
          )}
          {absentCalculationType === "2" && (
            <Col md={4} sm={12} xs={24}>
              <DayRangePicker
                type="dayRange"
                name="dayRange"
                label="Day Range"
                rules={[{ required: true, message: "Day Range Is Required" }]}
              />
            </Col>
          )}
          {absentCalculationType === "1" && (
            <Col md={3} sm={12} xs={24}>
              <Form.Item
                name="consecutiveDay"
                valuePropName="checked"
                rules={[
                  { required: true, message: "Consecutive Day is required" },
                ]}
                style={{ marginTop: 23, marginBottom: 0 }}
              >
                <Checkbox
                  onChange={(e) =>
                    form.setFieldsValue({ consecutiveDay: e.target.checked })
                  }
                >
                  Is Consecutive Day?
                </Checkbox>
              </Form.Item>
            </Col>
          )}

          <Col md={5} sm={12} xs={24}>
            <PSelect
              options={absentAmountDeductionTypeDDL}
              name="amountDeductionType"
              label="Amount Deduct Type"
              placeholder="Select Amount Deduct Type"
              onChange={(_, op) => {
                form.setFieldsValue({ amountDeductionType: op });
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
            <PButton
              type="primary"
              action="button"
              content="Add"
              onClick={() => {
                form
                  .validateFields()
                  .then(() => {
                    const values = form.getFieldsValue();
                    const detail = {
                      eachDayCountBy: parseInt(values.eachDayCountBy),
                      dayRange: values.dayRange,
                      consecutiveDay: values.consecutiveDay,
                      amountDeductionType: values.amountDeductionType,
                      amountDeductionAmountOrPercentage:
                        values.amountDeductionAmountOrPercentage,
                    };
                    onAddDetail(detail);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            />
          </Col>
        </Row>
      </PCardBody>
    </>
  );
};

export default ConfigSelection;
