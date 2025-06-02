import { Col, Form, Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import { toast } from "react-toastify";

const ProfitShareCalculation = ({ form, data, setData, getPfProfitDetailsData }) => {
  const shareType = Form.useWatch("profitShareTypeId", form);
  const profitShare = Form.useWatch("profitShare", form);

  // shareType:
  // 1 => "Percentage"
  // 2 => "Proportionately"
  // 3 => "Fixed Amount"

  const handleCalculate = () => {
    if (!data?.detailsData || data?.detailsData?.length < 1) {
      toast.error(
        "There are no records to calculate profit share. Please click on the view button to load the records."
      );
      return;
    }
    form
      .validateFields(["profitShareTypeId", "profitShare"])
      .then(() => {
        getPfProfitDetailsData();
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
        } else if (shareType === 4) {
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
  const getProfitShareString = () => {
    let label = "Profit Share";
    switch (shareType) {
      case 1:
          label = `${label} (%)`;
        break;
      case 2:
          label = `${label} (Proportionately)`;
        break;
      case 3:
          label = `${label} (Proportionately)`;
        break;
      case 4:
          label = `${label} (Fixed Amount)`;
        break;
      default:
        label = `${label}`;
        break;
    }
    return label;
  };
  return (
    <Row gutter={[5, 2]}>
      <Col md={9} sm={12} xs={24}>
        <PSelect
          options={[
            { value: 1, label: "Percentage" },
            { value: 2, label: "Proportionately With Fixed Amount" },
            { value: 3, label: "Proportionately With Balance Amount" },
            { value: 4, label: "Fixed Amount" },
          ]}
          name="profitShareTypeId"
          label="Profit Share Type"
          placeholder="Select Profit Share Type"
          onChange={(value) => {
            form.setFieldsValue({ profitShareTypeId: value });
            setData((prev) => ({
              ...prev,
              detailsData: prev?.detailsData?.map((rec) => ({
                ...rec,
                runningProfitShare: null,
                employeeProfitShare: null,
                companyProfitShare: null,
              })),
            }));
          }}
          rules={[
            {
              required: true,
              message: "Profit Share Type is required",
            },
          ]}
        />
      </Col>
      <Col md={6} sm={12} xs={24}>
        <PInput
          type="number"
          name="profitShare"
          placeholder="Enter Profit Share"
          min={0}
          label={getProfitShareString()}
          rules={[
            {
              required: true,
              message: "Profit Share is required",
            },
          ]}
          disabled={shareType === 3}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton
          type="primary"
          action="button"
          content="Calculate"
          onClick={handleCalculate}
          disabled={shareType === 3}
        />
      </Col>
    </Row>
  );
};

export default ProfitShareCalculation;
