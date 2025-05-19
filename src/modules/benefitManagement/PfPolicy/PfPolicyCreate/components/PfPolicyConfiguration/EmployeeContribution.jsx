import { DataTable, PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Checkbox, Col, Form, Row } from "antd";
import { toast } from "react-toastify";
import { detailsHeader } from "./helper";
import { add } from "lodash";

const EmployeeContribution = ({
  form,
  data,
  addData,
  removeData,
  company = false,
}) => {
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
      <h3 className="mb-3">
        {company
          ? "Company/ Employer Contribution Disbursement"
          : "Employee Contribution Collection"}
      </h3>
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
                {company
                  ? "Company/ Employer Contribution"
                  : "Is Employee Contribution?"}
              </Checkbox>
            </Form.Item>
          </Col>
          {intPfEligibilityDependOn?.value && intPfEligibilityDependOn?.value != "0" &&  (
            <>
              <Col md={4} sm={12} xs={24}>
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
              <Col md={4} sm={12} xs={24}>
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
          <Col md={4} sm={12} xs={24}>
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
              name="numAppraisalValue"
              label={getEmployeeContributionLabel(intContributionDependOn)}
              placeholder={getEmployeeContributionLabel(
                intContributionDependOn
              )}
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
              onClick={addData}
            />
          </Col>
        </Row>
      </PCardBody>
      {data?.length > 0 && (
        <PCardBody>
          <DataTable
            bordered
            data={data || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader({removeData, intContributionDependOn, intPfEligibilityDependOn})}
          />
        </PCardBody>
      )}
    </>
  );
};

export default EmployeeContribution;
