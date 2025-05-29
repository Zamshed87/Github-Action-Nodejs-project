import { Col, Row } from "antd";
import { PButton, PInput, PSelect } from "Components";
import moment from "moment";
import { toast } from "react-toastify";

const PfProfitShareFilter = ({ form, fetchPfShare }) => {
  const handleViewClick = () => {
    const commonFields = ["fromDateF", "toDateF", "fromDate", "toDate"];
    form
      .validateFields(commonFields)
      .then((values) => {
        fetchPfShare();
      })
      .catch(() => {
        toast.error("Please fill all required fields.");
      });
  };
  return (
    <Row gutter={[10, 2]}>
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={[
            { value: 1, label: "Date Wise" },
            { value: 2, label: "Investment Wise" },
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
      <Col md={6} sm={12} xs={24}>
        <PInput
          type="month"
          name="fromDateF"
          label="From Date"
          format={"YYYY-MM"}
          placeholder="Select From Date"
          rules={[
            {
              required: true,
              message: "From Date is required",
            },
          ]}
          onChange={(value) => {
            const startOfMonth = moment(value, "YYYY-MM")
              .startOf("month")
              .format("YYYY-MM-DD");
            form.setFieldsValue({ fromDate: startOfMonth });
          }}
        />
      </Col>
      <Col md={6} sm={12} xs={24}>
        <PInput
          type="month"
          name="toDateF"
          label="To Date"
          format={"YYYY-MM"}
          placeholder="Select To Date"
          rules={[
            {
              required: true,
              message: "To Date is required",
            },
          ]}
          onChange={(value) => {
            const endOfMonth = moment(value, "YYYY-MM")
              .endOf("month")
              .format("YYYY-MM-DD");
            form.setFieldsValue({ toDate: endOfMonth });
          }}
        />
      </Col>
      <Col style={{ marginTop: "23px" }}>
        <PButton
          type="primary"
          action="button"
          onClick={handleViewClick}
          content="View"
        />
      </Col>
    </Row>
  );
};

export default PfProfitShareFilter;
