import { Col, Row } from "antd";
import { PButton, PInput, PSelect } from "Components";

const PfProfitShareFilter = ({ form }) => {
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
        />
      </Col>
        <Col md={6} sm={12} xs={24}>
          <PInput
            type="month"
            name="fromDate"
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
              form.setFieldsValue({ fromDate: value });
            }}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PInput
            type="month"
            name="toDate"
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
              form.setFieldsValue({ toDate: value });
            }}
          />
        </Col>
        <Col style={{ marginTop: "23px" }}>
          <PButton type="primary" action="submit" content="View" />
        </Col>
      </Row>
  );
};

export default PfProfitShareFilter;
