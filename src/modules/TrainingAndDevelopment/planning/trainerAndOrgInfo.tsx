import { Col, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
const TrainerAndOrgInfo = ({ nameOfTrainerOrgDDL, form }: any) => {
  const nameofTrainerOrganization = Form.useWatch(
    "nameofTrainerOrganization",
    form
  );
  return (
    <Row gutter={[10, 2]} style={{ marginTop: "20px" }}>
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={nameOfTrainerOrgDDL || []}
          name="nameofTrainerOrganization"
          label="Name of Trainer & Organization"
          placeholder="Name of Trainer & Organization"
          onChange={(value, op) => {
            console.log(op);
            form.setFieldsValue({
              nameofTrainerOrganization: op,
              trinerContactNo: (op as any)?.contactNo || "",
              trinerEmail: (op as any)?.email || "",
              inHouseTrainer: (op as any)?.isInHouseTrainer ? "Yes" : "No",
            });
          }}
          rules={[
            {
              required: true,
              message: "Name of Trainer & Organization is required",
            },
          ]}
        />
      </Col>
      {nameofTrainerOrganization && (
        <>
          <Col md={6} sm={24}>
            <PInput
              disabled={true}
              type="text"
              placeholder="Trainer Contact No."
              label="Trainer Contact No."
              name="trinerContactNo"
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              disabled={true}
              type="text"
              placeholder="Trainer Email"
              label="Trainer Email"
              name="trinerEmail"
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              disabled={true}
              type="text"
              placeholder="Inhouse Trainer?"
              label="Inhouse Trainer?"
              name="inHouseTrainer"
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default TrainerAndOrgInfo;
