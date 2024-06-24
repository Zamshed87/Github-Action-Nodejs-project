import type { RangePickerProps } from "antd/es/date-picker";
import { PButton, PCardBody, PForm, PInput, PSelect } from "Components";
import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";

// import "./styles.css";
import moment from "moment";
import { todayDate } from "utility/todayDate";
type MoveApplicationForm = any;

const MovementApplicationForm: React.FC<MoveApplicationForm> = ({
  propsObj,
}) => {
  const {
    saveHandler,
    singleData,
    values,
    isEdit,
    movementTypeDDL = [],
  } = propsObj;
  // Form Instance
  const [form] = Form.useForm();
  // init
  useEffect(() => {
    form.setFieldsValue({
      movementType:
        movementTypeDDL?.length > 0 ? { ...movementTypeDDL[0] } : undefined,
    });
  }, [movementTypeDDL]);
  //   edit
  useEffect(() => {
    if (singleData?.MovementId) {
      form.setFieldsValue({
        search: "",
        movementType: {
          value: singleData?.MovementTypeId,
          label: singleData?.MovementType,
        },
        // MovementId: singleData?.MovementId,
        fromDate: moment(singleData?.FromDate),
        startTime: moment(singleData?.FromTime, "h:mma"),
        toDate: moment(singleData?.ToDate),
        endTime: moment(singleData?.ToTime, "h:mma"),
        location: singleData?.Location,
        reason: singleData?.Reason,
      });
    }
  }, [singleData]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate, movementType } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    if (movementType?.label?.toLowerCase()?.includes("half")) {
      return current && current !== fromDateMoment.startOf("day");
    }
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
      .catch(() => {
        //
      });
  };

  const currentdate = new Date();
  const datetime =
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  const endTime =
    currentdate.getHours() +
    1 +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
          startTime: moment(datetime, "h:mma"),
          endTime: moment(endTime, "h:mma"),
        }}
      >
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={8} sm={12} xs={24}>
              <PSelect
                options={
                  movementTypeDDL?.length > 0 ? [...movementTypeDDL] : []
                }
                name="movementType"
                label="Movement Type"
                placeholder="Movement Type"
                onChange={(value, op: any) => {
                  form.setFieldValue("movementType", op);
                  op?.label?.toLowerCase()?.includes("half") &&
                    form.setFieldValue(
                      "toDate",
                      form.getFieldValue("fromDate")
                    );
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
                    <Col md={8} sm={12} xs={24}>
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
                        onChange={(date) => {
                          form.setFieldsValue({
                            fromDate: date,
                            toDate: date,
                          });
                        }}
                      />
                    </Col>
                    <Col md={8} sm={12} xs={24}>
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
                        onChange={(date) => {
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
            <Col md={4} sm={6} xs={24}>
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
            <Col md={4} sm={6} xs={24}>
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
            <Col md={8} sm={12} xs={24}>
              <PInput
                type="text"
                name="location"
                placeholder="Location"
                label="Location"
                rules={[{ required: true, message: "Location Is Required" }]}
              />
            </Col>
            <Col md={8} sm={12} xs={24}>
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
                const fromValue = form.getFieldsValue(true);
                return (
                  <Col
                    md={8}
                    sm={12}
                    xs={24}
                    style={{
                      marginTop: "23px",
                    }}
                  >
                    <div className="d-flex">
                      <PButton
                        type="primary"
                        content={isEdit ? `Update` : `Apply`}
                        onClick={viewHandler}
                      />
                      {isEdit && fromValue?.movementType ? (
                        <PButton
                          type="primary"
                          content={"Reset"}
                          onClick={() => {
                            form.resetFields();
                          }}
                          parentClassName="ml-2"
                        />
                      ) : undefined}
                    </div>
                  </Col>
                );
              }}
            </Form.Item>
          </Row>
        </PCardBody>{" "}
      </PForm>
    </>
  );
};

export default MovementApplicationForm;
