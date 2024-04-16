import { PForm, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getEmployee } from "./utils";
import { toast } from "react-toastify";

const AddEditForm = ({
  setIsAddEditForm,
  getData,
  CommonEmployeeDDL,
  selectedRow,
  setSelectedRow,
  id,
  setId,
  BulkReporterLandinApi,
}: any) => {
  const { buId, wgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  //   api states
  const changeReporter = useApiRequest({});

  // form state
  const [form] = Form.useForm();

  const submitHandler = ({ values, getData, resetForm }: any) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData({
        currentPage: BulkReporterLandinApi?.data?.currentPage,
        pageSize: BulkReporterLandinApi?.data?.pageSize,
      });
      setSelectedRow([]);
      setId("");
    };
    const payload = {
      strEmpIDs:
        (id && `${id?.IntEmployeeId}`) ||
        selectedRow
          ?.map((item: any) => {
            return item?.IntEmployeeId;
          })
          ?.join(","),
      intSuperVisorId: values?.supervisor?.value,
      intLineManagetId: values?.lineManager?.value,
    };

    values?.supervisor?.value && values?.lineManager?.value
      ? changeReporter.action({
          urlKey: "ChangeReporter",
          method: "POST",
          payload: payload,
          onSuccess: () => {
            cb();
          },
        })
      : toast.warning("Please complete all fields");
  };

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
          });
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              name="supervisor"
              label="Select Supervisor"
              placeholder="Search Min 2 char"
              options={CommonEmployeeDDL?.data || []}
              loading={CommonEmployeeDDL?.loading}
              onChange={(value, op) => {
                form.setFieldsValue({
                  supervisor: op,
                });
              }}
              onSearch={(value) => {
                getEmployee(value, CommonEmployeeDDL, buId, wgId);
              }}
              showSearch
              filterOption={false}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              name="lineManager"
              label="Select Line Manager"
              placeholder="Search Min 2 char"
              options={CommonEmployeeDDL?.data || []}
              loading={CommonEmployeeDDL?.loading}
              onChange={(value, op) => {
                form.setFieldsValue({
                  lineManager: op,
                });
              }}
              onSearch={(value) => {
                getEmployee(value, CommonEmployeeDDL, buId, wgId);
              }}
              showSearch
              filterOption={false}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
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
