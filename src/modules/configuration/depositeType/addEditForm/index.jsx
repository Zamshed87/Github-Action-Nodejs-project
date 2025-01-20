import { ModalFooter } from "Components/Modal";
import { PForm, PInput } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { Switch } from "antd";

import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const saveDepositeType = useApiRequest({});
  // const workplaceGroup = useApiRequest([]);
  // const workplaceDDL = useApiRequest([]);

  const { orgId, buId, employeeId, wgId, wId, strBusinessUnit } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    // const payloadFoEdit = {
    //   actionTypeId: singleData?.intDepositeTypeId ? 2 : 1,
    //   intDepositeTypeId: singleData?.intDepositeTypeId
    //     ? singleData?.intDepositeTypeId
    //     : 0,
    //   depositTypeName: values?.strDepositeType || "",

    //   isActive: values?.isActive,
    //   intBusinessUnitId: buId,
    //   intAccountId: orgId,
    //   dteCreatedAt: todayDate(),
    //   intCreatedBy: employeeId,
    //   dteUpdatedAt: todayDate(),
    //   intUpdatedBy: employeeId,
    // };
    const payload = {
      depositeTypeId: singleData?.id ? singleData?.id : 0,
      depositTypeName: values?.depositTypeName || "",
      comment: values?.comments,
      accountId: orgId,
      isActive: singleData?.id ? values?.isActive : true,
      actionBy: employeeId,
    };

    saveDepositeType.action({
      urlKey: "DepositType",
      method: singleData?.id ? "put" : "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
      toast: true,
    });
  };
  // Form Instance
  const [form] = Form.useForm();
  useEffect(() => {
    if (singleData?.id) {
      form.setFieldsValue({
        ...singleData,
      });
    }
  }, [singleData]);

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
        initialValues={{ bUnit: { value: buId, label: strBusinessUnit } }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="depositTypeName"
              label="Deposite Type"
              placeholder="Deposite Type"
              rules={[{ required: true, message: "Deposite Type is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="comments"
              label="Comments"
              placeholder="Comments"
              // rules={[{ required: true, message: "Deposite Type is required" }]}
            />
          </Col>

          {/* <Col md={12} sm={24}>
            <PSelect
              options={[
                {
                  label: "Sales",
                  value: "Sales",
                },
                {
                  label: "Admin",
                  value: "Admin",
                },
              ]}
              name="strCostCenterDivision"
              label="Cost Center Division"
              showSearch
              filterOption={true}
              placeholder="Cost Center Division"
              onChange={(value, op) => {
                form.setFieldsValue({
                  strCostCenterDivision: op,
                });
              }}
            />
          </Col> */}

          {isEdit && (
            <Col
              md={24}
              style={{
                marginLeft: "-0.5rem",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  className="input-main position-group-select "
                  style={{ margin: "3rem 0 0 0.7rem" }}
                >
                  <h6 className="title-item-name">Deposite Type Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular deposite type
                    status (Active/Inactive)
                  </p>
                </div>
                <div
                  style={{
                    margin: "4rem 0 -1.5rem -2rem",
                    // padding: "5rem -2rem 0 -15rem",
                  }}
                >
                  <Form.Item name="isActive" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={saveDepositeType.loading}
        />
      </PForm>
    </>
  );
}
