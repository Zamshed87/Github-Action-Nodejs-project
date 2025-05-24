import { DataTable, PButton, PCardBody, PInput } from "Components";
import { Col, Row } from "antd";
import { detailsHeader } from "./helper";
import { date } from "yup";

const PFInvestmentTracking = ({ form, data, addData, removeData }) => {
  const handleAmountChange = () => {
    const collectionAmount = form.getFieldValue("collectionAmount") || 0;
    const interestAmount = form.getFieldValue("interestAmount") || 0;
    const principalAmount = collectionAmount - interestAmount;
    form.setFieldsValue({ principalAmount });
  };
  return (
    <>
      <h3 className="mb-3">PF Investment Tracking</h3>
      <PCardBody className="mb-4">
        <Row gutter={[10, 2]}>
        <Col md={3} sm={6} xs={12}>
          <PInput
            type="date"
            name="collectionDateFake"
            placeholder="Date"
            onChange={(value,dateString) => {
              form.setFieldsValue({ collectionDate: dateString });
            }}
            label="Collection Date"
            rules={[{ required: true, message: "Date Is Required" }]}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <PInput
            type="number"
            name="collectionAmount"
            placeholder="Total Amount"
            label="Total Amount"
            onChange={handleAmountChange}
            rules={[{ required: true, message: "Total Amount Is Required" }]}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <PInput
            type="number"
            name="interestAmount"
            placeholder="Amount of Interest"
            label="Amount of Interest"
            onChange={handleAmountChange}
            rules={[{ required: true, message: "Amount of Interest Is Required" }]}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <PInput
            type="number"
            name="principalAmount"
            placeholder="Amount Principal"
            label="Amount Principal"
            disabled
            rules={[{ required: true, message: "Amount Principal Is Required" }]}
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <PInput
            type="text"
            name="remark"
            placeholder="Comment"
            label="Comment"
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
            })}
          />
        </PCardBody>
      )}
    </>
  );
};

export default PFInvestmentTracking;
