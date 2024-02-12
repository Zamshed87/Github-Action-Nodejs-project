import { PForm, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { Col, Form, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const AddEditForm = ({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}: any) => {
  const [form] = Form.useForm();

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              name="employee"
              label="Select a Employee"
              placeholder="Search Min 2 char"
              options={CommonEmployeeDDL?.data || []}
              loading={CommonEmployeeDDL?.loading}
              onChange={(value, op) => {
                setSelectedRow([]);
                form.setFieldsValue({
                  employee: op,
                });
                getEmployeeLandingForBulkReporter();
              }}
              onSearch={(value) => {
                getEmployee(value);
              }}
              showSearch
              filterOption={false}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              name="employee"
              label="Select a Employee"
              placeholder="Search Min 2 char"
              options={CommonEmployeeDDL?.data || []}
              loading={CommonEmployeeDDL?.loading}
              onChange={(value, op) => {
                setSelectedRow([]);
                form.setFieldsValue({
                  employee: op,
                });
                getEmployeeLandingForBulkReporter();
              }}
              onSearch={(value) => {
                getEmployee(value);
              }}
              showSearch
              filterOption={false}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");

            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={false}
        />
      </PForm>
    </>
  );
};

export default AddEditForm;
