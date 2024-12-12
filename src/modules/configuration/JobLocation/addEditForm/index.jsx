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
  const dispatch = useDispatch();
  // const debounce = useDebounce();
  //   const getBUnitDDL = useApiRequest({});
  //   const getDepartment = useApiRequest({});
  const saveJobLocation = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  // ddls
  //   useEffect(() => {
  //     getBUnitDDL.action({
  //       urlKey: "JobLocation",
  //       method: "GET",
  //       params: {
  //         workplaceGroupId: wgId,
  //         businessUnitId: buId,
  //         empId: employeeId || 0,
  //         accountId: orgId,
  //       },
  //       onSuccess: (res) => {
  //         res.forEach((item, i) => {
  //           res[i].label = item?.strBusinessUnit;
  //           res[i].value = item?.intBusinessUnitId;
  //         });
  //       },
  //     });
  //     getDepartment.action({
  //       urlKey: "GetAllEmpDepartment",
  //       method: "GET",
  //       params: {
  //         accountId: orgId,
  //         workplaceId: wId,
  //         businessUnitId: buId,
  //       },
  //       onSuccess: (res) => {
  //         res.forEach((item, i) => {
  //           res[i].label = item?.strDepartment;
  //           res[i].value = item?.intDepartmentId;
  //         });
  //       },
  //     });

  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [orgId, buId, wgId]);
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
      id: singleData?.id || 0,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      name: values?.jobLocation,
    };

    saveJobLocation.action({
      urlKey: "JobLocation",
      method: singleData?.id ? "PUT" : "POST",
      payload: payload,
      toast: true,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.id) {
      form.setFieldsValue({
        ...singleData,
        jobLocation: singleData?.name,
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
              name="jobLocation"
              label="Job Location Name"
              placeholder=""
              rules={[
                { required: true, message: "Job Location Name is required" },
              ]}
            />
          </Col>

          {/* <Col md={12} sm={24}>
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
          </Col> */}

          {/* {isEdit && (
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
          )} */}
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
