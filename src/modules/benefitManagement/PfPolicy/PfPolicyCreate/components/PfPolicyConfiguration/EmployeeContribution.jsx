import { DataTable, PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Col, Form, Row } from "antd";
import { detailsHeader } from "./helper";

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
  const prefix = company ? "C" : "";

  const intPfEligibilityDependOn = Form.useWatch(
    `intPfEligibilityDependOn`,
    form
  );
  const intContributionDependOn = Form.useWatch(
    `${prefix}intContributionDependOn`,
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
        return "";
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
        return "";
    }
  };
  const getEmployeeContributionLabel = (value) => {
    let label = "";
    switch (value?.value) {
      case "1":
        label = "% of Gross Salary";
        break;
      case "2":
        label = "% of Basic Salary";
        break;
      case "3":
        label = "Fixed Amount";
        break;
      default:
        label = " ";
    }
    return `${company ? 'Company':'Employee'} Contribution (${label})`;
  };
  const setPrefixedFieldValue = (name, value) => {
    form.setFieldsValue({ [`${prefix}${name}`]: value });
  };

  return (
    <>
      <h3 className="mb-3">
        {company
          ? "Company Contribution Disbursement"
          : "Employee Contribution Collection"}
      </h3>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
          {/* <Col md={4} sm={12} xs={24}>
            <Form.Item
              name={`${prefix}contribution`}
              defaultValue={true}
              valuePropName="checked"
              style={{ marginTop: "16px", marginBottom: 0 }}
            >
              <Checkbox
                onChange={(e) => {
                  setPrefixedFieldValue("contribution", e.target.checked);
                }}
              >
                {company ? "Company Contribution" : "Is Employee Contribution?"}
              </Checkbox>
            </Form.Item>
          </Col> */}
          {intPfEligibilityDependOn?.value &&
            intPfEligibilityDependOn?.value != "0" && (
              <>
                <Col md={5} sm={12} xs={24}>
                  <PInput
                    type="number"
                    min={1}
                    name={`${prefix}intRangeFrom`}
                    label={getRangeFromLabel(intPfEligibilityDependOn)}
                    placeholder={getRangeFromLabel(intPfEligibilityDependOn)}
                    onChange={(value) => {
                      setPrefixedFieldValue("intRangeFrom", value);
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
                    min={1}
                    name={`${prefix}intRangeTo`}
                    label={getRangeToLabel(intPfEligibilityDependOn)}
                    placeholder={getRangeToLabel(intPfEligibilityDependOn)}
                    onChange={(value) => {
                      setPrefixedFieldValue("intRangeTo", value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: `${getRangeToLabel(
                          intPfEligibilityDependOn
                        )} Is Required`,
                      },
                      {
                        validator: (_, value) => {
                          const rangeFrom = form.getFieldValue(`${prefix}intRangeFrom`);
                          if (value && rangeFrom && Number(value) < Number(rangeFrom)) {
                            return Promise.reject(
                              new Error(`${getRangeToLabel(intPfEligibilityDependOn)} cannot be less than ${getRangeFromLabel(intPfEligibilityDependOn)}`)
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  />
                </Col>
              </>
            )}
          <Col md={5} sm={12} xs={24}>
            <PSelect
              options={contributionOpts}
              name={`${prefix}intContributionDependOn`}
              label={`${company ? 'Company':'Employee'} Contribution Depend On`}
              placeholder={`Select ${company ? 'Company':'Employee'} Contribution Depend On`}
              onChange={(_, op) => {
                setPrefixedFieldValue("intContributionDependOn", op);
              }}
              loading={loadingContribution}
              rules={[
                {
                  required: true,
                  message: `${company ? 'Company':'Employee'} Contribution Depend On Is Required`,
                },
              ]}
            />
          </Col>
          <Col md={5} sm={12} xs={24}>
            <PInput
              type="number"
              min={1}
              name={`${prefix}numAppraisalValue`}
              label={getEmployeeContributionLabel(intContributionDependOn)}
              placeholder={getEmployeeContributionLabel(
                intContributionDependOn
              )}
              onChange={(_, op) => {
                setPrefixedFieldValue("amountDeductionType", op);
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
        <PCardBody className="mb-4">
          <DataTable
            bordered
            data={data || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader({
              removeData,
              intPfEligibilityDependOn,
              company
            })}
          />
        </PCardBody>
      )}
    </>
  );
};

export default EmployeeContribution;
