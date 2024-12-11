import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { Switch } from "antd";

import { shallowEqual, useSelector } from "react-redux";
import { checkBng } from "utility/regxExp";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const getBUnitDDL = useApiRequest({});
  const getDepartment = useApiRequest({});
  const saveDepartment = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // ddls
  useEffect(() => {
    getBUnitDDL.action({
      urlKey: "BusinessUnitWithRoleExtension",
      method: "GET",
      params: {
        workplaceGroupId: wgId,
        businessUnitId: buId,
        empId: employeeId || 0,
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
    getDepartment.action({
      urlKey: "GetAllEmpDepartment",
      method: "GET",
      params: {
        accountId: orgId,
        workplaceId: wId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
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
    const payload = {
      // actionTypeId: singleData?.intDepartmentId ? 2 : 1,
      sectionId: singleData?.sectionId || 0,
      sectionName: values?.sectionName || "",
      sectionNameBn: values?.sectionNameBn || null,
      accountId: orgId,
      businessUnitId: buId,
      actionBy: employeeId,
      workplaceId: wId,
      departmentId: values?.department?.value || 0,
      departmentName: values?.department?.label || "",
      isActive: values?.isActive,
    };

    saveDepartment.action({
      urlKey: "CreateSection",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
      toast: true,
    });
  };
  useEffect(() => {
    if (singleData?.sectionId) {
      form.setFieldsValue({
        ...singleData,
        bUnit: {
          value: singleData?.businessUnitId,
          label: singleData?.businessUnitName || "",
        },
        department: {
          value: singleData?.departmentId,
          label: singleData?.departmentName,
        },
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
              name="sectionName"
              label="Section Name"
              placeholder="Section Name"
              rules={[{ required: true, message: "Section Name is required" }]}
            />
          </Col>
          {orgId === 7 && (
            <Col md={12} sm={24}>
              <PInput
                type="text"
                name="sectionNameBn"
                label="Section Name (In Bangla)"
                placeholder="Section Name (In Bangla)"
                rules={[
                  {
                    message: "This Field Must be in Bangla",
                    pattern: new RegExp(checkBng()),
                  },
                ]}
              />
            </Col>
          )}

          <Col md={12} sm={24}>
            <PSelect
              options={
                getDepartment?.data?.length > 0 ? getDepartment?.data : []
              }
              name="department"
              label="Department"
              showSearch
              filterOption={true}
              placeholder="Department"
              onChange={(value, op) => {
                form.setFieldsValue({
                  department: op,
                });
              }}
              rules={[{ required: true, message: "Department is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
              name="bUnit"
              label="Business Unit"
              showSearch
              filterOption={true}
              placeholder="Business Unit"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bUnit: op,
                });
              }}
              rules={[{ required: true, message: "Business Unit is required" }]}
            />
          </Col>

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
                  <h6 className="title-item-name">Section Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular section status
                    (Active/Inactive)
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
          loading={saveDepartment.loading}
        />
      </PForm>
    </>
  );
}
