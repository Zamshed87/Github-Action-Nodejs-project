import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// import { holidayAndExceptionOffdayAssign, holidayMakePayload } from "../helper";
import { todayDate } from "utility/todayDate";
import { PForm, PInput, PSelect } from "Components";
import { crudOffDayAssign } from "../helper";

export const AssignOffDay = ({
  setIsAddEditForm,
  getData,
  empIDString,
  setCheckedList,
  checked,
  singleData,
  setSingleData,
  isAssignAll,
  setisAssignAll,
  setErrorData,
  setErroModalOpen,
  setErrorPayload,
}) => {
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (singleData?.length > 0) {
      form.setFieldsValue({
        effectiveDate: singleData[0]?.effectiveDate
          ? moment(singleData[0]?.effectiveDate)
          : moment(todayDate()),
        isFriday: singleData[0]?.isFriday || false,
        isThursday: singleData[0]?.isThursday || false,
        isWednesday: singleData[0]?.isWednesday || false,
        isTuesday: singleData[0]?.isTuesday || false,
        isMonday: singleData[0]?.isMonday || false,
        isSunday: singleData[0]?.isSunday || false,
        isSaturday: singleData[0]?.isSaturday || false,
      });
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          effectiveDate: moment(todayDate()),
          isFriday: false,
          isThursday: false,
          isWednesday: false,
          isTuesday: false,
          isMonday: false,
          isSunday: false,
          isSaturday: false,
        }}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          let obj = {
            wId,
            values,
            orgId,
            buId,
            wgId,
            employeeId,
            offDayLanding: checked,
            isMulti: checked?.length > 1,
            singleData: singleData[0],
            setLoading,
            isAssignAll,
            empIDString,
            cb: () => {
              form.resetFields();
              setisAssignAll(false);
              setCheckedList([]);
              setSingleData([]);
              getData();
              setIsAddEditForm(false);
            },
          };
          crudOffDayAssign(
            obj,
            setErrorData,
            setErroModalOpen,
            setErrorPayload
          );
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={24} sm={24}>
            <PInput
              type="date"
              name="effectiveDate"
              label="Effective Date"
              placeholder="Effective Date"
              rules={[
                {
                  required: true,
                  message: "Effective Date is required",
                },
              ]}
              onChange={(value) => {
                form.setFieldsValue({
                  effectiveDate: value,
                });
              }}
            />
          </Col>
          <Col md={3} sm={24}>
            <PInput
              label="Saturday"
              type="checkbox"
              layout="horizontal"
              name="isSaturday"
            />
          </Col>
          <Col md={3} sm={24}>
            <PInput
              label="Sunday"
              type="checkbox"
              layout="horizontal"
              name="isSunday"
            />
          </Col>
          <Col md={3} sm={24}>
            <PInput
              label="Monday"
              type="checkbox"
              layout="horizontal"
              name="isMonday"
            />
          </Col>
          <Col md={3} sm={24}>
            <PInput
              label="Tuesday"
              type="checkbox"
              layout="horizontal"
              name="isTuesday"
            />
          </Col>
          <Col md={4} sm={24}>
            <PInput
              label="Wednesday"
              type="checkbox"
              layout="horizontal"
              name="isWednesday"
            />
          </Col>
          <Col md={3} sm={24}>
            <PInput
              label="Thursday"
              type="checkbox"
              layout="horizontal"
              name="isThursday"
            />
          </Col>
          <Col md={3} sm={24}>
            <PInput
              label="Friday"
              type="checkbox"
              layout="horizontal"
              name="isFriday"
            />
          </Col>
        </Row>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const {
              holidayEffectiveDate,
              isFriday,
              isThursday,
              isWednesday,
              isTuesday,
              isMonday,
              isSunday,
              isSaturday,
            } = form.getFieldsValue(true);

            return (
              <ModalFooter
                onCancel={() => {
                  setIsAddEditForm(false);
                  getData();
                  setCheckedList([]);
                  form.resetFields();
                  setSingleData([]);
                }}
                submitAction="submit"
                submitText={"Save"}
                //loading={loading}
              />
            );
          }}
        </Form.Item>
      </PForm>
    </>
  );
};
