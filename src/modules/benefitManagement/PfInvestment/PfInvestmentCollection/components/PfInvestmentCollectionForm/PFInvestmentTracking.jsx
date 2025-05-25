import { PButton, PCardBody, PInput } from "Components";
import { Col, Row } from "antd";

const PFInvestmentTracking = ({ form, addData }) => {
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
            type="Collection Date"
            name="collectionDateFake"
            format={"YYYY-MM-DD"}
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
            rules={[{ required: true, message: "Amount of Interest Is Required" },
              {
                validator: (_, value) => {
                  const collectionAmount = form.getFieldValue(`collectionAmount`);
                  if (value && collectionAmount && Number(value) > Number(collectionAmount)) {
                    return Promise.reject(
                      new Error(`Amount of Interest can't be greater than Total Amount`)
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
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
     
    </>
  );
};

export default PFInvestmentTracking;
