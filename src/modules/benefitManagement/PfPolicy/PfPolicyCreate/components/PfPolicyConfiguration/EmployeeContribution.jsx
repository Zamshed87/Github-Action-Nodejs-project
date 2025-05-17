import { DataTable, PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Checkbox, Col, Form, Row } from "antd";
import { toast } from "react-toastify";
import { detailsHeader } from "./helper";

const EmployeeContribution = ({ form, saveData, setSaveData }) => {
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
  const amountDeductionType = Form.useWatch("amountDeductionType", form);
  const onAddDetail = () => {
    form
      .validateFields()
      .then((values) => {
        const dayStart = parseInt(values?.dayRange?.[0].format("DD"));
        const dayEnd = parseInt(values?.dayRange?.[1].format("DD"));

        // Check for duplicate or overlapping ranges
        const isOverlap = (prevDetailList) =>
          prevDetailList.some(
            (item) =>
              !(
                dayEnd < parseInt(item.dayRangeStartDay) ||
                dayStart > parseInt(item.dayRangeEndDay)
              )
          );

        setSaveData((prev) => {
          if (isOverlap(prev)) {
            toast.error("This day range overlaps with an existing one.");
            return prev;
          }

          const detail = {
            eachDayCountBy: parseInt(values.eachDayCountBy?.format("DD")),
            dayRange: `${dayStart} - ${dayEnd}`,
            dayRangeStartDay: dayStart,
            dayRangeEndDay: dayEnd,
            consecutiveDay: values.consecutiveDay,
            amountDeductionType: values.amountDeductionType?.value,
            amountDeductionTypeName: values.amountDeductionType?.label,
            amountDeductionAmountOrPercentage:
              values.amountDeductionAmountOrPercentage,
          };

          // Reset only relevant fields
          form.resetFields([
            "eachDayCountBy",
            "dayRange",
            "consecutiveDay",
            "amountDeductionType",
            "amountDeductionAmountOrPercentage",
          ]);

          return [...prev, detail];
        });
      })
      .catch((err) => {
        toast.error("Please fill all required fields.");
      });
  };
  return (
    <>
     
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
          {absentCalculationType === "1" && (
            <Col md={4} sm={12} xs={24}>
              {/* <DayRangePicker
                type="day"
                name="eachDayCountBy"
                label="Each Day Count by"
                rules={[
                  { required: true, message: "Each Day Count By Is Required" },
                ]}
              /> */}
            </Col>
          )}
          {absentCalculationType === "2" && (
            <Col md={4} sm={12} xs={24}>
              {/* <DayRangePicker
                type="dayRange"
                name="dayRange"
                label="Day Range"
                rules={[{ required: true, message: "Day Range Is Required" }]}
              /> */}
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
              label={`% of Amount ${
                amountDeductionType?.value == 3
                  ? "Fixed Amount"
                  : "(Based on 1 day)"
              }`}
              placeholder={`% of Amount ${
                amountDeductionType?.value == 3
                  ? "Fixed Amount"
                  : "(Based on 1 day)"
              }`}
              min={1}
              rules={[
                {
                  required: true,
                  message: `% of Amount ${
                    amountDeductionType?.value == 3
                      ? "Fixed Amount"
                      : "(Based on 1 day)"
                  } is Required`,
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
                    toast.error("Please fill all required fields.");
                  });
              }}
            />
          </Col>
        </Row>
      </PCardBody>
      {saveData?.employeeContributions?.length > 0 && (
        <PCardBody>
          <DataTable
            bordered
            data={saveData?.employeeContributions || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader(setSaveData, absentCalculationType)}
          />
        </PCardBody>
      )}
    </>
  );
};

export default EmployeeContribution;
