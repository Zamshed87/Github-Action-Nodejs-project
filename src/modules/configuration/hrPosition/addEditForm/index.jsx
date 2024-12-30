import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch } from "antd";
import { useEffect } from "react";

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
  const saveHRPostion = useApiRequest({});

  const { orgId, buId, employeeId, wgId, strWorkplace, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // states

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();
  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    const payloadFoEdit = {
      intPositionId: singleData?.intPositionId || 0,
      strPosition: values?.strPosition || "",
      strPositionCode: values?.strPositionCode || "",
      intBusinessUnitId: buId,
      isActive: isEdit ? values?.isActive : true,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: singleData?.intPositionId ? 0 : employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: singleData?.intPositionId ? employeeId : 0,
      intWorkplaceId: wId,
    };
    const payload = {
      position: values?.strPosition || "",
      workplaceIdList: values?.workplace?.map((wp) => {
        return wp.value;
      }),

      businessUnitId: buId,
      accountId: orgId,
      positionCode: values?.strPositionCode || "",
      actionBy: employeeId,
    };
    saveHRPostion.action({
      urlKey: singleData?.intPositionId ? "SavePosition" : "CreateHrPosition",
      method: "POST",
      payload: singleData?.intPositionId ? payloadFoEdit : payload,
      onSuccess: () => {
        cb();
      },

      toast: true,
    });
  };
  const getWDDL = useApiRequest({});
  useEffect(() => {
    getWDDL.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
    if (singleData?.intPositionId) {
      form.setFieldValue("workplace", [{ label: strWorkplace, value: wId }]);
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
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strPosition"
              label="HR Position"
              placeholder="HR Position"
              rules={[{ required: true, message: "HR Position is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strPositionCode"
              label="Code"
              placeholder="Code"
              rules={[{ required: true, message: "Code is required" }]}
            />
          </Col>
          {!singleData?.intPositionId && (
            <Col md={12} sm={24}>
              <PSelect
                options={getWDDL?.data?.length > 0 ? getWDDL?.data : []}
                name="workplace"
                label="Workplace"
                showSearch
                filterOption={true}
                mode={!singleData?.intPositionId && "multiple"}
                maxTagCount={!singleData?.intPositionId && "responsive"}
                placeholder="Workplace"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                }}
                rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
          )}

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
                  <h6 className="title-item-name">HR Position Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular HR Position
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
        />
      </PForm>
    </>
  );
}
