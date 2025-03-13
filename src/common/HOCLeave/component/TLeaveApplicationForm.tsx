import type { RangePickerProps } from "antd/es/date-picker";
import { ImAttachment } from "react-icons/im";

import { PButton, PCardBody, PForm, PInput, PRadio, PSelect } from "Components";
import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

// import "./styles.css";
import moment from "moment";
import { calculateNextDateAntd, getDateOfYear } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { fromDateToDateDiff } from "utility/fromDateToDateDiff";
import Loading from "common/loading/Loading";
import { useApiRequest } from "Hooks";
type LeaveApplicationForm = any;

const TLeaveApplicationForm: React.FC<LeaveApplicationForm> = ({
  propsObj,
}) => {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const {
    saveHandler,
    singleData,
    values,
    imageFile,
    setImageFile,
    isEdit,
    leaveTypeDDL = [],
  } = propsObj;
  // hook
  console.log({ leaveTypeDDL });

  const dispatch = useDispatch();
  const [next3daysForEmp, setNext3daysForEmp] = useState<any>(undefined);
  const [, setStartYear] = useState<any>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  const [isload, setLoad] = useState(false);
  const CommonEmployeeDDL = useApiRequest([]);
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  // Form Instance
  const [form] = Form.useForm();
  // init
  useEffect(() => {
    form.setFieldsValue({
      leaveType: leaveTypeDDL?.length > 0 ? { ...leaveTypeDDL[0] } : undefined,
      leaveConsumeType:
        leaveTypeDDL?.length > 0
          ? { ...leaveTypeDDL[0]?.assingendConsumeTypeList[0] }
          : undefined,
      fromDate: values?.isSelfService ? undefined : moment(todayDate()),
      toDate: values?.isSelfService ? undefined : moment(todayDate()),
      leaveDays: values?.isSelfService ? 0 : 1,
    });
  }, [leaveTypeDDL]);
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
          : `${singleData?.TotalDays} ` || "",
      });
    }
  }, [singleData]);
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    const next3daysForEmpMoment = moment(next3daysForEmp, "DD/MM/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    if (values?.isSelfService) {
      return (
        current &&
        (current < fromDateMoment.startOf("day") ||
          current > next3daysForEmpMoment.endOf("day"))
      );
    } else {
      return current && current < fromDateMoment.startOf("day");
    }
  };
  const viewHandler = async () => {
    await form
      .validateFields()
      .then(() => {
        const data = form.getFieldsValue(true);
        const imageFile =
          (attachmentList[0] as any)?.response.length > 0
            ? (attachmentList[0] as any)?.response[0]
            : { globalFileUrlId: singleData?.DocumentFileUrl };
        setLoad(true);
        saveHandler(
          { ...values, ...data, imageFile },
          () => {
            setLoad(false);
            form.resetFields();
            setAttachmentList([]);
          },
          setLoad
        );
      })
      .catch(() => {
        console.log();
      });
  };
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          isHalfDay: 0,
          // fromDate: values?.isSelfService ? "" : moment(todayDate()),
          // toDate: moment(todayDate()),
          halfTime: "8:30 AM – 12:30 PM",
          // leaveDays: 1,
        }}
      >
        {isload && <Loading />}
        <PCardBody styles={{ marginTop: "51.5px" }}>
          <Row gutter={[10, 2]}>
            <Col md={8} sm={12} xs={24}>
              <PSelect
                options={leaveTypeDDL?.length > 0 ? [...leaveTypeDDL] : []}
                name="leaveType"
                label="Leave Type"
                placeholder="Leave Type"
                onChange={(value, op) => {
                  form.setFieldValue("leaveType", op);
                  if (values?.isSelfService) {
                    form.setFieldValue("fromDate", undefined);
                  }
                }}
                rules={[
                  {
                    required: true,
                    message: "Please Select Leave Type",
                  },
                ]}
              />
            </Col>

            <Form.Item shouldUpdate noStyle>
              {() => {
                const { leaveType, fromDate, toDate, leaveConsumeType } =
                  form.getFieldsValue(true);
                return (
                  <>
                    <Col md={8} sm={12} xs={24}>
                      <PSelect
                        options={
                          leaveType?.assingendConsumeTypeList?.length > 0
                            ? leaveType?.assingendConsumeTypeList
                            : []
                        }
                        name="leaveConsumeType"
                        label="Leave Consume Type"
                        placeholder="Leave Consume Type"
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            leaveConsumeType: op,
                            endTime: undefined,
                            startTime: undefined,
                          });
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please Select Leave Consume Type",
                          },
                        ]}
                      />
                    </Col>
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
                        onChange={(date, dateString) => {
                          setNext3daysForEmp(
                            calculateNextDateAntd(
                              dateString,
                              leaveType?.intMaxLveDaySelf
                                ? leaveType?.intMaxLveDaySelf - 1
                                : 2
                            )
                          );
                          const x = dateString.split("/")[2];
                          setStartYear(getDateOfYear("last", x));

                          form.setFieldsValue({
                            fromDate: date,
                            toDate: date,
                            leaveDays: 1,
                          });
                          if (
                            moment(date).format() === moment(toDate).format() &&
                            leaveType?.isHalfDayLeave
                          ) {
                            form.setFieldsValue({
                              isHalfDay: 0,
                              halfTime: "8:30 AM – 12:30 PM",
                            });
                          } else {
                            form.setFieldsValue({
                              isHalfDay: undefined,
                              halfTime: undefined,
                            });
                          }

                          if (date && toDate) {
                            const totalLeaves = `${
                              +fromDateToDateDiff(
                                moment(date).format("YYYY-MM-DD"),
                                moment(date).format("YYYY-MM-DD")
                              )?.split(" ")[0] + 1
                            } `;
                            form.setFieldsValue({
                              leaveDays: totalLeaves,
                            });
                          } else {
                            form.setFieldsValue({
                              leaveDays: 1,
                            });
                          }
                        }}
                      />
                    </Col>
                    {leaveConsumeType?.label === "Full Day" && (
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
                            if (date && fromDate) {
                              const fDate = moment(fromDate, "YYYY-MM-DD");
                              const toDate = moment(date, "YYYY-MM-DD");
                              // const totalLeaves = `${
                              //   +fromDateToDateDiff(
                              //     moment(fromDate).format("YYYY-MM-DD"),
                              //     moment(date).format("YYYY-MM-DD")
                              //   )?.split(" ")[0] + 1
                              // } `;
                              form.setFieldsValue({
                                leaveDays: toDate.diff(fDate, "days") + 1,
                              });
                            } else {
                              form.setFieldsValue({
                                leaveDays: 0,
                              });
                            }

                            form.setFieldsValue({
                              toDate: date,
                            });
                            if (
                              moment(date).format() ===
                                moment(fromDate).format() &&
                              leaveType?.isHalfDayLeave
                            ) {
                              form.setFieldsValue({
                                isHalfDay: 0,
                                halfTime: "8:30 AM – 12:30 PM",
                              });
                            } else {
                              form.setFieldsValue({
                                isHalfDay: undefined,
                                halfTime: undefined,
                              });
                            }
                          }}
                          disabledDate={disabledDate}
                        />
                      </Col>
                    )}
                    {leaveConsumeType?.label !== "Full Day" && (
                      <>
                        <Col md={8} sm={6} xs={24}>
                          <PInput
                            type="time"
                            name="startTime"
                            label="Start Time"
                            placeholder=""
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

                        <Col md={8} sm={6} xs={24}>
                          <PInput
                            type="time"
                            name="endTime"
                            label="End Time"
                            placeholder=""
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
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {() => {
                const { fromDate, toDate, leaveType, isHalfDay } =
                  form.getFieldsValue();

                return (
                  <>
                    {moment(fromDate).format() === moment(toDate).format() &&
                    leaveType?.isHalfDayLeave ? (
                      <Col md={isHalfDay ? 8 : 24} sm={12} xs={24}>
                        <PRadio
                          name="isHalfDay"
                          type="group"
                          options={[
                            {
                              value: 0,
                              label: "Full Day",
                            },
                            {
                              value: 1,
                              label: "Half Day",
                            },
                          ]}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            if (value === 0) {
                              form.setFieldsValue({
                                isHalfDay: value,
                                halfTime: undefined,
                                leaveDays: 1,
                              });
                            } else {
                              form.setFieldsValue({
                                leaveDays: 0.5,
                              });
                            }
                          }}
                        />
                      </Col>
                    ) : undefined}
                    {isHalfDay === 1 ? (
                      <Col md={16} sm={12} xs={24}>
                        <PRadio
                          name="halfTime"
                          type="group"
                          options={[
                            {
                              value: "8:30 AM – 12:30 PM",
                              label: "8:30 AM – 12:30 PM",
                            },
                            {
                              value: "1:30 PM- 5:30 PM",
                              label: "1:30 PM- 5:30 PM",
                            },
                          ]}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            form.setFieldsValue({
                              halfTime: value,
                            });
                          }}
                        />
                      </Col>
                    ) : undefined}
                  </>
                );
              }}
            </Form.Item>
            <Col md={8} sm={12} xs={24}>
              <PSelect
                name="leaveReliever"
                label="Leave Reliever"
                placeholder="Search Min 2 char"
                options={CommonEmployeeDDL?.data || []}
                loading={CommonEmployeeDDL?.loading}
                onChange={(value, op) => {
                  form.setFieldsValue({
                    leaveReliever: op,
                  });
                }}
                onSearch={(value) => {
                  getEmployee(value);
                }}
                showSearch
                filterOption={false}
                // rules={[{ required: true, message: "Leave Reliever Is Required" }]}
              />
            </Col>
            <Col md={8} sm={24}>
              <PInput
                type="text"
                name="location"
                placeholder="Location"
                label="Location"
                rules={[{ required: true, message: "Location Is Required" }]}
              />
            </Col>
            <Col md={16} sm={24}>
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
            <Col md={24} style={{ marginTop: "1.4rem" }}>
              <div className="input-main position-group-select">
                {imageFile?.globalFileUrlId ? (
                  <>
                    <FileUploadComponents
                      propsObj={{
                        isOpen,
                        setIsOpen,
                        destroyOnClose: false,
                        attachmentList,
                        setAttachmentList,
                        accountId: orgId,
                        tableReferrence: "LeaveAndMovement",
                        documentTypeId: 15,
                        userId: employeeId,
                        buId,
                        maxCount: 1,
                        isIcon: true,
                        isErrorInfo: true,
                        subText:
                          "File formats : PDF, JPG and PNG. Max. Limit : 2MB",
                      }}
                    />
                    {attachmentList?.length === 0 &&
                    imageFile?.globalFileUrlId ? (
                      <div
                        style={{
                          color: "rgb(0, 114, 229)",
                          cursor: "pointer",
                          marginTop: "0.5rem",
                        }}
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(
                              imageFile?.globalFileUrlId
                            )
                          );
                        }}
                      >
                        <ImAttachment /> Attachment
                      </div>
                    ) : null}
                  </>
                ) : (
                  ""
                )}
              </div>
              <div>
                {!imageFile?.globalFileUrlId ? (
                  <>
                    <FileUploadComponents
                      propsObj={{
                        isOpen,
                        setIsOpen,
                        destroyOnClose: false,
                        attachmentList,
                        setAttachmentList,
                        accountId: orgId,
                        tableReferrence: "LeaveAndMovement",
                        documentTypeId: 15,
                        userId: employeeId,
                        buId,
                        maxCount: 1,
                        isIcon: true,
                        isErrorInfo: true,
                        subText:
                          "Recommended file formats are: PDF, JPG and PNG. Maximum file size is 2 MB",
                      }}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
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
                      content={
                        isEdit
                          ? `Update  to ${
                              leaveDays == 0.5 ? "Half" : leaveDays
                            } ${leaveDays < 2 ? "Day" : "Days"} Leave`
                          : `Apply ${leaveDays == 0.5 ? "Half" : leaveDays} ${
                              leaveDays < 2 ? "Day" : "Days"
                            } Leave`
                      }
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
                    setAttachmentList([]);
                    setImageFile({});
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

export default TLeaveApplicationForm;
