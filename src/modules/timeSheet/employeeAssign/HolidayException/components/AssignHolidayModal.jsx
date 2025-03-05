import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { holidayAndExceptionOffdayAssign, holidayMakePayload } from "../helper";
import { todayDate } from "utility/todayDate";
import { PForm, PInput, PSelect } from "Components";

export const AssignModal = ({
  setIsAddEditForm,
  getData,
  empIDString,
  setCheckedList,
  checked,
  singleData,
  setSingleData,
  isAssignAll,
}) => {
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, setLoading] = useState(false);

  const [form] = Form.useForm();

  const ddlApi = useApiRequest({});

  const getDDL = () => {
    ddlApi.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "HolidayGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intWorkplaceId: wId,
      },
      onSuccess: (res) => {
        res?.forEach((item, i) => {
          res[i].value = item.HolidayGroupId;
          res[i].label = item.HolidayGroupName;
        });
      },
    });
  };

  useEffect(() => {
    getDDL();
  }, [buId, wgId, wId]);

  const saveHandler = (values, cb) => {
    const payload = holidayMakePayload(
      checked?.length > 1 ? checked : singleData,
      {
        orgId,
        buId,
        wgId,
        employeeId,
        isAssignAll,
        empIDString,
      },
      values
    );
    holidayAndExceptionOffdayAssign(payload, setLoading, cb);
  };
  useEffect(() => {
    if (singleData?.length > 0) {
      form.setFieldsValue({
        holidayEffectiveDate: singleData[0]?.employeeHolidayAssignId
          ? moment(singleData[0]?.holidayEffectiveDate)
          : moment(todayDate()),
        holidayGroup: singleData[0]?.employeeHolidayAssignId
          ? {
              value: singleData[0]?.holidayGroupId,
              label: singleData[0]?.holidayGroupName,
            }
          : undefined,
      });
      //   const newRowData = {
      //     holidayEffectiveDate:
      //       singleData[0]?.holidayEffectiveDate &&
      //       dateFormatterForInput(singleData[0]?.holidayEffectiveDate),
      //     holidayGroup: {
      //       value: singleData[0]?.holidayGroupId,
      //       label: singleData[0]?.holidayGroupName,
      //     },
      //     exceptionEffectiveDate: todayDate(),
      //     exceptionOffDayGroup: {
      //       value: singleData[0]?.exceptionOffdayGroupId,
      //       label: singleData[0]?.exceptionOffdayGroupName,
      //     },
      //   };
      //   setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          saveHandler(values, () => {
            setCheckedList([]);
            setSingleData([]);
            getData();
            form.resetFields();
            setIsAddEditForm(false);
          });
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="holidayEffectiveDate"
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
                  holidayEffectiveDate: value,
                });
              }}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={ddlApi?.data?.length > 0 ? ddlApi?.data : []}
              name="holidayGroup"
              label="Holiday Group"
              placeholder="Holiday Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  holidayGroup: op,
                });
              }}
              rules={[
                {
                  required: true,
                  message: "Holiday Group is required",
                },
              ]}
            />
          </Col>
        </Row>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const { holidayEffectiveDate } = form.getFieldsValue(true);

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
                submitText={
                  holidayEffectiveDate <= todayDate()
                    ? "Save And Process"
                    : "Save"
                }
                //loading={loading}
              />
            );
          }}
        </Form.Item>
      </PForm>
    </>
  );
};
