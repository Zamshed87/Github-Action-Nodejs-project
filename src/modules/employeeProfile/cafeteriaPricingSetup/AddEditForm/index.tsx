import { PButton, PCard, PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

const PricingSetupForm = () => {
  const {
    permissionList,
    profileData: { buId, wgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30417),
    []
  );

  // Form Instance
  const [form] = Form.useForm();

  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  return (
    <PForm form={form} initialValues={{}}>
      <PCard>
        <PCardHeader
          title="Bulk Salary Assign"
          buttonList={[
            {
              type: "primary",
              content: "Save",
              onClick: () => {
                // submitHandler();
              },
              //   disabled: selectedRow?.length > 0 ? false : true,
            },
            {
              type: "primary-outline",
              content: "Reset",
              onClick: () => {
                form.resetFields();
                // setSelectedRow([]);
              },
              // disabled: true,
              //   icon: <AddOutlined />,
            },
          ]}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3">
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={[
                { label: "Per Meal", value: 1 },
                { label: "Per Month", value: 2 },
              ]}
              name="mealType"
              label="Meal Type"
              placeholder="Meal Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  mealType: op,
                });
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workplaceGroup?.data || []}
              name="workplaceGroup"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                  workplace: undefined,
                });
                getWorkplace();
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workplace?.data || []}
              name="workplace"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplace: op,
                });
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>

          <Col
            style={{
              marginTop: "23px",
            }}
          >
            <PButton type="primary" content="View" onClick={() => {}} />
          </Col>
        </Row>
      </PCard>
    </PForm>
  );
};

export default PricingSetupForm;
