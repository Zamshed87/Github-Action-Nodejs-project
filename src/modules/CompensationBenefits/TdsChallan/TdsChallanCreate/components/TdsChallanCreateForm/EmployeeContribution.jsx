import { DataTable, PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Checkbox, Col, Form, Row } from "antd";
import { detailsHeader } from "./helper";

const EmployeeContribution = ({ form, addData }) => {
  const { contributionOpts, loadingContribution } = useConfigSelectionHook(
    form,
    {
      fetchContributionEnum: true,
    }
  );

  const intPfEligibilityDependOn = Form.useWatch(
    `intPfEligibilityDependOn`,
    form
  );

  return (
    <>
      <h3 className="mb-3">Employee Contribution Collection</h3>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
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
    </>
  );
};

export default EmployeeContribution;
