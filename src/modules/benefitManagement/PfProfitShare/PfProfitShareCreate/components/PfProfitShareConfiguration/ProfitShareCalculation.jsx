import { Col, Form, Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import { toast } from "react-toastify";

const ProfitShareCalculation = ({
  form,
  data,
  setData,
  getPfProfitDetailsData,
}) => {
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
      .validateFields(["profitShareTypeId", "profitShare", "toDateF"])
      .then(() => {
        getPfProfitDetailsData();
        if (shareType === 1) {
          const percentage = Number(profitShare) / 100;
          setData((prev) => {
            return {
              ...prev,
              detailsData: prev?.detailsData?.map((rec) => {
                const totalPFAmount = Number(rec?.totalPFAmount) || 0;
                const employeeContribution =
                  Number(rec?.employeeContribution) || 0;
                const employeeProfit = Number(rec?.employeeProfit) || 0;
                const companyContribution =
                  Number(rec?.companyContribution) || 0;
                const companyProfit = Number(rec?.companyProfit) || 0;

                const runningProfitShare = totalPFAmount * percentage;
                const employeeProfitShare =
                  (employeeContribution + employeeProfit) * percentage;
                const companyProfitShare =
                  (companyContribution + companyProfit) * percentage;

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
            const totalEmp = Number(prev?.totalCount) || 1; // Avoid division by 0
            const distributedAmount = Number(profitShare) / totalEmp;
            return {
              ...prev,
              detailsData: prev?.detailsData?.map((rec) => {
                const totalPFAmount = Number(rec?.totalPFAmount) || 1; // Avoid division by 0
                const employeeContribution =
                  Number(rec?.employeeContribution) || 0;
                const employeeProfit = Number(rec?.employeeProfit) || 0;
                const companyContribution =
                  Number(rec?.companyContribution) || 0;
                const companyProfit = Number(rec?.companyProfit) || 0;
                const employeeProfitShare =
                  ((employeeContribution + employeeProfit) / totalPFAmount) *
                  distributedAmount;
                const companyProfitShare =
                  ((companyContribution + companyProfit) / totalPFAmount) *
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
                const totalPFAmount = Number(rec?.totalPFAmount) || 1; // Avoid division by 0
                const employeeContribution =
                  Number(rec?.employeeContribution) || 0;
                const employeeProfit = Number(rec?.employeeProfit) || 0;
                const companyContribution =
                  Number(rec?.companyContribution) || 0;
                const companyProfit = Number(rec?.companyProfit) || 0;

                const employeeProfitShare =
                  ((employeeContribution + employeeProfit) / totalPFAmount) *
                  fixedAmount;
                const companyProfitShare =
                  ((companyContribution + companyProfit) / totalPFAmount) *
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
