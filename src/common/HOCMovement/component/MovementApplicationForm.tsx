import { AddOutlined } from "@mui/icons-material";
import type { RangePickerProps } from "antd/es/date-picker";
import { ImAttachment } from "react-icons/im";

import {
  PButton,
  PCard,
  PCardBody,
  PForm,
  PInput,
  PRadio,
  PSelect,
} from "Components";
import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

// import "./styles.css";
import moment from "moment";
import {
  calculateNextDateAntd,
  dateFormatterForInput,
  getDateOfYear,
} from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { fromDateToDateDiff } from "utility/fromDateToDateDiff";
type MoveApplicationForm = any;

const MovementApplicationForm: React.FC<MoveApplicationForm> = ({
  propsObj,
}) => {
  const { orgId, buId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const {
    saveHandler,
    singleData,
    values,
    isEdit,
    movementTypeDDL = [],
    homeReset,
  } = propsObj;
  // hook
  const dispatch = useDispatch();

  // Form Instance
  const [form] = Form.useForm();
  // init
  useEffect(() => {
    form.setFieldsValue({
      leaveType:
        movementTypeDDL?.length > 0 ? { ...movementTypeDDL[0] } : undefined,
    });
  }, [movementTypeDDL]);
  //   edit
  useEffect(() => {
    if (singleData?.intApplicationId) {
      form.setFieldsValue({
        leaveType: {
          value: singleData?.LeaveTypeId,
          label: singleData?.LeaveType,
          isHalfDayLeave: singleData?.HalfDay,
        },
        isHalfDay: singleData?.HalfDay ? 1 : 0,
        halfTime: singleData?.HalfDayRange,
        fromDate: moment(singleData?.AppliedFromDate),
        toDate: moment(singleData?.AppliedToDate),
        location: singleData?.AddressDuetoLeave,
        reason: singleData?.Reason,
        leaveDays: singleData?.HalfDay
          ? "0.5 "
          : `${
              +fromDateToDateDiff(
                dateFormatterForInput(singleData?.AppliedFromDate),
                dateFormatterForInput(singleData?.AppliedToDate)
              )?.split(" ")[0] + 1
            } ` || "",
      });
    }
  }, [singleData]);
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");

    return current && current < fromDateMoment.startOf("day");
  };

  const viewHandler = async () => {
    await form
      .validateFields()
      .then(() => {
        const data = form.getFieldsValue(true);

        saveHandler({ ...values, ...data }, () => {
          form.resetFields();
        });
      })
      .catch(() => {});
  };
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
        }}
      >
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={4} sm={12} xs={24}>
              <PSelect
                options={
                  movementTypeDDL?.length > 0 ? [...movementTypeDDL] : []
                }
                name="movementType"
                label="Movement Type"
                placeholder="Movement Type"
                onChange={(value, op) => {
                  form.setFieldValue("movementType", op);
                }}
                rules={[
                  {
                    required: true,
                    message: "Please Select Movement Type",
                  },
                ]}
              />
            </Col>
            <Form.Item shouldUpdate noStyle>
              {() => {
                return (
                  <>
                    <Col md={5} sm={12} xs={24}>
                      <PInput
                        type="date"
                        name="fromDate"
                        label="From Date"
                        placeholder="From Date"
                        rules={[
                          {
                            required: true,
                            message: "From Date is required",
                          },
                        ]}
                        onChange={(date, dateString) => {
                          form.setFieldsValue({
                            fromDate: date,
                            toDate: date,
                          });
                        }}
                      />
                    </Col>
                    <Col md={5} sm={12} xs={24}>
                      <PInput
                        type="date"
                        name="toDate"
                        label="To Date"
                        placeholder="To Date"
                        rules={[
                          {
                            required: true,
                            message: "To Date is required",
                          },
                        ]}
                        onChange={(date, dateString) => {
                          form.setFieldsValue({
                            toDate: date,
                          });
                        }}
                        disabledDate={disabledDate}
                      />
                    </Col>
                  </>
                );
              }}
            </Form.Item>
            <Col md={5} sm={12} xs={24}>
              <PInput
                type="time"
                name="startTime"
                label="Start Time"
                placeholder="Start Time"
                format={"h:mm a"}
                rules={[
                  {
                    required: true,
                    message: "Start Time is required",
                  },
                ]}
                onChange={(time) => {
                  form.setFieldsValue({
                    startTime: time,
                  });
                }}
              />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PInput
                type="time"
                name="endTime"
                label="End Time"
                placeholder="End Time"
                format={"h:mm a"}
                rules={[
                  {
                    required: true,
                    message: "End Time is required",
                  },
                ]}
                onChange={(time) => {
                  form.setFieldsValue({
                    endTime: time,
                  });
                }}
              />
            </Col>
            <Col md={12} sm={24}>
              <PInput
                type="text"
                name="location"
                placeholder="Location"
                label="Location"
                rules={[{ required: true, message: "Location Is Required" }]}
              />
            </Col>
            <Col md={12} sm={24}>
              <PInput
                type="textarea"
                name="reason"
                placeholder="Reason"
                label="Reason"
                bordered={true}
                maxLength={200}
                autoSize={{ minRows: 1, maxRows: 3 }}
                rules={[{ required: true, message: "Reason Is Required" }]}
              />
            </Col>

            <Form.Item shouldUpdate noStyle>
              {() => {
                const { leaveDays } = form.getFieldsValue(true);

                return (
                  <Col
                    style={{
                      marginTop: "23px",
                    }}
                  >
                    <PButton
                      type="primary"
                      content={isEdit ? `Update` : `Apply`}
                      onClick={viewHandler}
                    />
                  </Col>
                );
              }}
            </Form.Item>

            {isEdit ? (
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton
                  type="primary"
                  content={"Reset"}
                  onClick={() => {
                    form.resetFields();
                  }}
                />
              </Col>
            ) : undefined}
          </Row>
        </PCardBody>{" "}
      </PForm>
    </>
  );
};

export default MovementApplicationForm;
