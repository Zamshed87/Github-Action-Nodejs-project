import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
  const getBUnitDDL = useApiRequest({});
  const saveDepartment = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  // ddls
  useEffect(() => {
    getBUnitDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        id: singleData?.intBusinessUnitId,
        DDLType: "BusinessUnit",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
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
    let payload = {
      actionTypeId: singleData?.intDepartmentId ? 2 : 1,
      intDepartmentId: singleData?.intDepartmentId
        ? singleData?.intDepartmentId
        : 0,
      strDepartment: values?.strDepartment || "",
      strDepartmentCode: values?.strDepartmentCode,
      isActive: values?.isActive,
      isDeleted: true,
      // intParentDepId: values?.sectionDepartment?.value,
      // strParentDepName: values?.sectionDepartment?.label,
      intBusinessUnitId: values?.bUnit?.value || 0,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intWorkplaceId: wId,
    };

    saveDepartment.action({
      urlKey: "SaveEmpDepartment",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intDepartmentId) {
      form.setFieldsValue({
        ...singleData,
        bUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnit,
        },
      });
    }
  }, [singleData, getBUnitDDL?.data]);
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
              name="strDepartment"
              label="Department Name"
              placeholder="Department Name"
              rules={[
                { required: true, message: "Department Name is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strDepartmentCode"
              label="Code"
              placeholder="Code"
              rules={[{ required: true, message: "Code is required" }]}
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
              // rules={[{ required: true, message: "District is required" }]}
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
                  <h6 className="title-item-name">Department Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular department
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
          loading={loading}
        />
      </PForm>
    </>
  );
}
