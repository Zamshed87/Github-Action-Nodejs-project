import { PForm, PInput } from "Components";
import React, { useEffect } from "react";
import { Row, Col, Form } from "antd";
import { ModalFooter } from "Components/Modal";
import { shallowEqual, useSelector } from "react-redux";
import { useApiRequest } from "Hooks";
type CreateEmployeeDivisionType = {
  setOpen: any;
  landingApi: any;
  rowData: any;
};
const CreateEmployeeDivision: React.FC<CreateEmployeeDivisionType> = ({
  setOpen,
  landingApi,
  rowData,
}) => {
  const { intAccountId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const [form] = Form.useForm();

  const SaveEmployeeDivision = useApiRequest({});

  const onSubmit = () => {
    const { division, divisionCode } = form.getFieldsValue(true);

    const payload = {
      strDivisionName: division,
      strDivisionCode: divisionCode,
      intAccountId: intAccountId,
      intWorkplaceId: wId,
      intCreatedBy: employeeId,
      intEmpDivisionId: rowData?.intEmpDivisionId || 0,
      isActive: true,
      intUpdatedBy: employeeId,
    };

    SaveEmployeeDivision?.action({
      urlKey: "SaveEmployeeDivision",
      method: "POST",
      payload,
      onSuccess: () => {
        setOpen(false);
        landingApi();
      },
    });
  };

  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        division: rowData?.strDivisionName,
        divisionCode: rowData?.strDivisionCode,
      });
    }
  }, [rowData]);

  return (
    <PForm onFinish={onSubmit} form={form}>
      <Row gutter={[10, 2]}>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            name="division"
            label="Division"
            placeholder="Write a division name"
            rules={[{ required: true, message: "Division is required" }]}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            name="divisionCode"
            label="Division Code"
            placeholder="Write a division Code"
            rules={[{ required: true, message: "Division Code is required" }]}
          />
        </Col>
      </Row>
      <ModalFooter
        submitAction="submit"
        onCancel={() => {
          setOpen(false);
        }}
      />
    </PForm>
  );
};

export default CreateEmployeeDivision;
