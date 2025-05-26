import { Form, Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import { Col } from "react-bootstrap";

const ProfitShareCalculation = ({ form, setData }) => {
  const shareType = Form.useWatch("profitShareType", form);
  const profitShare = Form.useWatch("profitShare", form);

  // shareType:
  // 1 => "Percentage"
  // 2 => "Proportionately"
  // 3 => "Fixed Amount"

  const handleCalculate = () => {
    form
      .validateFields(["profitShareType", "profitShare"])
      .then(() => {
        if (shareType === 1) {
          const percentage = Number(profitShare) / 100;
          setData((prev) => {
            return {
              ...prev,
              detailsData: prev?.detailsData?.map((rec) => {
                const runningProfitShare = rec?.totalPFAmount * percentage;
                const employeeProfitShare =
                  (rec?.employeeContribution + rec?.employeeProfit) *
                  percentage;
                const companyProfitShare =
                  (rec?.companyContribution + rec?.companyProfit) * percentage;
                return {
                  ...rec,
                  runningProfitShare: runningProfitShare?.toFixed(6),
                  employeeProfitShare: employeeProfitShare?.toFixed(6),
                  companyProfitShare: companyProfitShare?.toFixed(6),
                };
              }),
            };
          });
        } else if (shareType === 2) {
          setData((prev) => {
            const totalEmp = prev?.totalCount;
            const distributedAmount = Number(profitShare) / totalEmp;
            return {
              ...prev,
              detailsData: prev?.detailsData?.map((rec) => {
                const employeeProfitShare =
                  ((rec?.employeeContribution + rec?.employeeProfit) /
                    rec?.totalPFAmount) *
                  distributedAmount;
                const companyProfitShare =
                  ((rec?.companyContribution + rec?.companyProfit) /
                    rec?.totalPFAmount) *
                  distributedAmount;
                return {
                  ...rec,
                  runningProfitShare: distributedAmount?.toFixed(6),
                  employeeProfitShare: employeeProfitShare?.toFixed(6),
                  companyProfitShare: companyProfitShare?.toFixed(6),
                };
              }),
            };
          });
        }else if (shareType === 3) {
          setData((prev) => {
            const fixedAmount = Number(profitShare);
            return {
              ...prev,
              detailsData: prev?.detailsData?.map((rec) => {
                const employeeProfitShare =
                  ((rec?.employeeContribution + rec?.employeeProfit) /
                    rec?.totalPFAmount) *
                  fixedAmount;
                const companyProfitShare =
                  ((rec?.companyContribution + rec?.companyProfit) /
                    rec?.totalPFAmount) *
                    fixedAmount;
                return {
                  ...rec,
                  runningProfitShare: fixedAmount?.toFixed(6),
                  employeeProfitShare: employeeProfitShare?.toFixed(6),
                  companyProfitShare: companyProfitShare?.toFixed(6),
                };
              }),
            };
          });
        }

      })
      .catch((error) => {});
  };
  return (
    <Row gutter={[5, 2]}>
      <Col md={4} sm={12} xs={24}>
        <PSelect
          options={[
            { value: 1, label: "Percentage" },
            { value: 2, label: "Proportionately" },
            { value: 3, label: "Fixed Amount" },
          ]}
          name="profitShareType"
          label="Profit Share Type"
          placeholder="Select Profit Share Type"
          onChange={(value) => {
            form.setFieldsValue({ profitShareType: value });
          }}
          rules={[
            {
              required: true,
              message: "Profit Share Type is required",
            },
          ]}
        />
      </Col>
      <Col md={4} sm={12} xs={24}>
        <PInput
          type="text"
          name="profitShare"
          placeholder="Profit Share"
          label="Profit Share"
          rules={[
            {
              required: true,
              message: "Profit Share is required",
            },
          ]}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton
          type="primary"
          action="button"
          content="Calculate"
          onClick={handleCalculate}
        />
      </Col>
    </Row>
  );
};

export default ProfitShareCalculation;
