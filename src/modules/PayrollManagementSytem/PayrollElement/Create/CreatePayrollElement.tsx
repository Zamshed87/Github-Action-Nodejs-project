import { PForm, PInput, PRadio } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

type CreatePayrollElementType = {
  rowData: any;
  landingApi: () => void;
  setOpen: any;
};
const CreatePayrollElement: React.FC<CreatePayrollElementType> = ({
  rowData,
  landingApi,
  setOpen,
}) => {
  // Data From Store
  const { orgId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Api Actions
  const SavePayrollElementType = useApiRequest({});

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        elementName: rowData?.strPayrollElementName,
        isBasic: rowData?.isBasicSalary,
        isPrimarySalaryElement: rowData?.isPrimarySalary,
        elementType: rowData?.isAddition ? "addition" : "deduction",
        isTaxable: rowData?.isTaxable,
      });
    }
  }, [rowData]);

  //   Functions
  const onFinish = () => {
    const values = form.getFieldsValue(true);
    const payload = {
      intPayrollElementTypeId: rowData?.intPayrollElementTypeId || 0,
      intAccountId: orgId,
      intWorkplaceGroupId: wgId,
      intWorkplaceId: wId,
      strPayrollElementName: values?.elementName,
      strCode: " ",
      isBasicSalary: values?.isBasic || false,
      isPrimarySalary: values?.isPrimarySalaryElement || false,
      isAddition: values?.additionDeduction === "addition" ? true : false,
      isDeduction: values?.additionDeduction === "deduction" ? true : false,
      isTaxable: values?.isTaxable || false,
      isActive: true,
      dteCreatedAt: moment().format("YYYY-MM-DD"),
      dteUpdatedAt: moment().format("YYYY-MM-DD"),
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId,
    };
    SavePayrollElementType?.action({
      urlKey: "SavePayrollElementType",
      method: "post",
      payload,
      toast: true,
      onSuccess: () => {
        landingApi();
        setOpen(false);
      },
    });
  };

  return (
    <PForm form={form} onFinish={onFinish}>
      <Row gutter={[10, 2]}>
        <Col md={24} sm={24}>
          <PInput
            name="elementName"
            type="text"
            label="Element Name"
            placeholder="Element Name"
            rules={[
              { required: true, message: "Please Enter Element Name" },
              { min: 3, message: "Element Name must be at least 3 characters" },
            ]}
            disabled={rowData}
          />
        </Col>
        <Form.Item noStyle shouldUpdate>
          {() => {
            const { isBasic, elementType } = form.getFieldsValue();
            return (
              <>
                <Col>
                  <PInput
                    name="isBasic"
                    type="checkbox"
                    label="Is Basic"
                    layout="horizontal"
                    onChange={(e: any) => {
                      const checked = e.target.checked;

                      if (checked) {
                        form.setFieldsValue({
                          isSalaryElement: true,
                          elementType: "addition",
                          isTaxable: true,
                        });
                      } else {
                        form.setFieldsValue({
                          isSalaryElement: false,
                          elementType: "",
                          isTaxable: false,
                        });
                      }
                    }}
                  />
                </Col>
                <Col>
                  <PInput
                    name="isSalaryElement"
                    type="checkbox"
                    label="Is Salary Element"
                    layout="horizontal"
                    disabled={isBasic || elementType === "deduction"}
                    onChange={(e: any) => {
                      const checked = e.target.checked;

                      if (checked) {
                        form.setFieldsValue({
                          elementType: "addition",
                          isTaxable: true,
                        });
                      } else {
                        form.setFieldsValue({
                          elementType: "",
                          isTaxable: false,
                        });
                      }
                    }}
                  />
                </Col>
                <Col span={24}>
                  <PRadio
                    name="elementType"
                    type="group"
                    rules={[
                      { required: true, message: "Please Select Element Type" },
                    ]}
                    options={[
                      {
                        label: "Addition",
                        value: "addition",
                      },
                      {
                        label: "Deduction",
                        value: "deduction",
                      },
                    ]}
                    onChange={(e: any) => {
                      const value = e.target.value;
                      if (value === "deduction") {
                        form.setFieldsValue({
                          isTaxable: false,
                          isSalaryElement: false,
                          isBasic: false,
                        });
                      }
                    }}
                  />
                </Col>
                <Col>
                  <PInput
                    name="isTaxable"
                    type="checkbox"
                    label="Is Taxable"
                    layout="horizontal"
                    disabled={elementType === "deduction"}
                    onChange={(e: any) => {
                      const checked = e.target.checked;

                      if (checked) {
                        form.setFieldsValue({
                          elementType: "addition",
                        });
                      }
                    }}
                  />
                </Col>
              </>
            );
          }}
        </Form.Item>
      </Row>
      <ModalFooter
        submitAction="submit"
        loading={SavePayrollElementType?.loading}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </PForm>
  );
};

export default CreatePayrollElement;
