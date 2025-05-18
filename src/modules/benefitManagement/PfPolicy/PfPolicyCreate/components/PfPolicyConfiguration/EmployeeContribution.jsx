import { DataTable, PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Checkbox, Col, Form, Row } from "antd";
import { toast } from "react-toastify";
import { detailsHeader } from "./helper";

const EmployeeContribution = ({ form, saveData, setSaveData }) => {
  const { contributionOpts, loadingContribution } = useConfigSelectionHook(
    form,
    {
      fetchContributionEnum: true,
    }
  );
  const intPfEligibilityDependOn = Form.useWatch(
    "intPfEligibilityDependOn",
    form
  );
  const intContributionDependOn = Form.useWatch(
    "intContributionDependOn",
    form
  );
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
  const getRangeFromLabel = (value) => {
    switch (value?.value) {
      case "1":
        return "Service Length Start (Month)";
      case "2":
        return "Employment Type Length Start (Month)";
      case "3":
        return "Salary Range Start  (Amount)";
      default:
        return "N/A";
    }
  };
  const getRangeToLabel = (value) => {
    switch (value?.value) {
      case "1":
        return "Service Length End (Month)";
      case "2":
        return "Employment Type Length End (Month)";
      case "3":
        return "Salary Range End (Amount)";
      default:
        return "N/A";
    }
  };
  const getEmployeeContributionLabel = (value) => {
    let label = "";
    switch (value?.value) {
      case "1":
        label = "% of Gross Salary";
        break;
      case "2":
        label = "Basic Salary";
        break;
      case "3":
        label = "Fixed Amount";
        break;
      default:
        label = "N/A";
    }
    return `Employee Contribution (${label})`;
  };
  return (
    <>
      <h3 className="mb-3">Employee Contribution Collection</h3>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
          <Col md={4} sm={12} xs={24}>
            <Form.Item
              name="consecutiveDay"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Employee Contribution is required",
                },
              ]}
              style={{ marginTop: "16px", marginBottom: 0 }}
            >
              <Checkbox
                onChange={(e) =>
                  form.setFieldsValue({ consecutiveDay: e.target.checked })
                }
              >
                Is Employee Contribution?
              </Checkbox>
            </Form.Item>
          </Col>
          {intPfEligibilityDependOn?.value != "0" && (
            <>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="number"
                  name="intRangeFrom"
                  label={getRangeFromLabel(intPfEligibilityDependOn)}
                  placeholder={getRangeFromLabel(intPfEligibilityDependOn)}
                  onChange={(value) => {
                    form.setFieldsValue({ intRangeFrom: value });
                  }}
                  rules={[
                    {
                      required: true,
                      message: `${getRangeFromLabel(
                        intPfEligibilityDependOn
                      )} Is Require`,
                    },
                  ]}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="number"
                  name="intRangeTo"
                  label={getRangeToLabel(intPfEligibilityDependOn)}
                  placeholder={getRangeToLabel(intPfEligibilityDependOn)}
                  onChange={(value) => {
                    form.setFieldsValue({ intRangeTo: value });
                  }}
                  rules={[
                    {
                      required: true,
                      message: `${getRangeToLabel(
                        intPfEligibilityDependOn
                      )} Is Required`,
                    },
                  ]}
                />
              </Col>
            </>
          )}
          <Col md={5} sm={12} xs={24}>
            <PSelect
              options={contributionOpts}
              name="intContributionDependOn"
              label="Employee Contribution Depend On"
              placeholder="Select Employee Contribution Depend On"
              onChange={(_, op) => {
                form.setFieldsValue({ intContributionDependOn: op });
              }}
              loading={loadingContribution}
              rules={[
                {
                  required: true,
                  message: "Employee Contribution Depend On Is Required",
                },
              ]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
                <PInput
                  type="number"
                  name="intRangeFrom"
                  label={getEmployeeContributionLabel(intContributionDependOn)}
                  placeholder={getEmployeeContributionLabel(intContributionDependOn)}
                  onChange={(_, op) => {
                    form.setFieldsValue({ amountDeductionType: op });
                  }}
                  rules={[
                    {
                      required: true,
                      message: `${getEmployeeContributionLabel(
                        intContributionDependOn
                      )} Is Require`,
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
            header={detailsHeader(setSaveData, loadingContribution)}
          />
        </PCardBody>
      )}
    </>
  );
};

export default EmployeeContribution;
