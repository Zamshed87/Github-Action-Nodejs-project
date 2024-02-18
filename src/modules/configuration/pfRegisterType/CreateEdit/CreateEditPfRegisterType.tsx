import { PForm, PInput } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

type TCreateEditPfRegisterType = {
  setOpen: any;
  data: any;
  setData: any;
  landingApi: () => void;
};
const CreateEditPfRegisterType: React.FC<TCreateEditPfRegisterType> = ({
  setOpen,
  data,
  setData,
  landingApi,
}) => {
  // Data From Store
  const { wgId, wId, orgId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Api Actions
  const createEditPfRegisterTypeApi = useApiRequest({});

  const [form] = Form.useForm();

  // Life Cycle Hooks
  useEffect(() => {
    if (data?.intPfregisterTypeId) {
      const values = {
        pfRegisterType: data?.strPfregisterType,
        isActive: data?.isActive || false,
      };
      form.setFieldsValue(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <PForm
      form={form}
      onFinish={() => {
        const values = form.getFieldsValue();
        createEditPfRegisterTypeApi.action({
          method: "POST",
          urlKey: "SavePFRegisterType",
          payload: {
            intPfregisterTypeId: data?.intPfregisterTypeId || 0,
            strPfregisterType: values?.pfRegisterType,
            isActive: data?.intPfregisterTypeId ? values?.isActive : true,
            intWorkplaceGroupId: wgId,
            intWorkplaceId: wId,
            intAccountId: orgId,
            intCreatedBy: employeeId,
            dteCreatedAt: moment().format("YYYY-MM-DD"),
          },
          toast: true,
          onSuccess: () => {
            setData("");
            setOpen(false);
            landingApi();
          },
        });
      }}
    >
      <Row gutter={[10, 2]}>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            name="pfRegisterType"
            placeholder="PF Register Type Name"
            label="PF Register Type Name"
            rules={[
              {
                required: true,
                message: "PF Register Type Name Is Required",
              },
            ]}
          />
        </Col>
        {data && (
          <Col md={24} sm={24}>
            <PInput
              name="isActive"
              type="checkbox"
              label="Is Active?"
              layout="horizontal"
            />
          </Col>
        )}
      </Row>
      <ModalFooter
        submitAction="submit"
        onCancel={() => {
          setData("");
          setOpen(false);
        }}
        loading={createEditPfRegisterTypeApi?.loading}
      />
    </PForm>
  );
};

export default CreateEditPfRegisterType;
