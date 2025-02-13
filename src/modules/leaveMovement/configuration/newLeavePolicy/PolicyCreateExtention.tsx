import { Col, Divider, Form, Row, Tag } from "antd";
import { getWorkplaceDDL } from "common/api/commonApi";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import { General } from "./components/General";
import { Consumption } from "./components/Consumption";
import { Sandwitch } from "./components/Sandwitch";
import { Lapse } from "./components/Lapse";
import { CarryForward } from "./components/CarryForward";

export const PolicyCreateExtention = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();

  const {
    permissionList,
    profileData: { buId, employeeId, orgId, wgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  // states
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState<any>([]);
  const [balanceTable, setBalanceTable] = useState<any>([]);

  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Policy";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // ddls

  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Service Length",
      dataIndex: "serviceLength",
      width: 100,
    },
    {
      title: "Leave Encashment Type",
      dataIndex: "encashmentType",
      width: 100,
    },
    {
      title: "Max Leave Encashment",
      dataIndex: "maxEncashment",
      width: 100,
    },
    {
      title: "Encashment Benefits",
      dataIndex: "encashBenefits",
      width: 100,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      width: 100,
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                setTableData((prev: any) => {
                  const filterArr = prev.filter(
                    (itm: any, idx: number) => idx !== index
                  );
                  return filterArr;
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  const balanceHeader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Service Length",
      dataIndex: "serviceLength",
      width: 100,
    },
    {
      title: "Leave Days",
      dataIndex: "leaveDaysForCalculativeDays",
      width: 100,
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                setBalanceTable((prev: any) => {
                  const filterArr = prev.filter(
                    (itm: any, idx: number) => idx !== index
                  );
                  return filterArr;
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  const onFinish = () => {};
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            buttonList={[
              {
                type: "primary",
                content: "Save",
                // icon: "plus",
                onClick: () => {
                  if (true) {
                    // history.push(
                    //   "/compensationAndBenefits/securityDeposit/create"
                    // );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
            title={`Leave Policy`}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            {/* ----------general info----------- */}
            <General
              form={form}
              params={params}
              buId={buId}
              orgId={orgId}
              employeeId={employeeId}
              wgId={wgId}
            />
            {/*consume  */}
            <Consumption form={form} />
            {/* sandwitch */}
            <Sandwitch form={form} />
            {/* lapse */}
            <Lapse form={form} />

            {/* carry */}
            <CarryForward form={form} />

            {/* encash */}
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Leave Encashment</span>
                </div>
              </Divider>
              <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Is Encashment"
                  type="checkbox"
                  layout="horizontal"
                  name="isEncashment"
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  // mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "After Leave Lapse" },
                    { value: 2, label: "Final Settlement" },
                    { value: 2, label: "Anytime" },
                    // { value: 3, label: "Clock Time" },
                  ]}
                  name="encashmentTimeline"
                  label="Encashment Timeline"
                  placeholder="Encashment Timeline"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      encashmentTimeline: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Encashment Timeline is required",
                    },
                  ]}
                />
              </Col>
              <Row gutter={[10, 2]}>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="serviceStartLength"
                    label="From Service Length (Month)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "From Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="serviceEndLength"
                    label="To Service Length (Month)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "To Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Percentage of Days" },
                      { value: 2, label: "Fixed Days" },
                      // { value: 3, label: "Clock Time" },
                    ]}
                    name="encashType"
                    label="Leave Encashment Type *"
                    placeholder="Leave Encashment Type *"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        encashType: op,
                      });
                    }}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Leave Carry Forward Type is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { encashType } = form.getFieldsValue(true);

                    return (
                      <>
                        <Col md={5} sm={24}>
                          <PInput
                            type="number"
                            name="maxEncashment"
                            label={`Max Leave Encashment (${
                              encashType?.value === 1
                                ? "% of Days"
                                : "Fixed Days"
                            })`}
                            placeholder=""
                            // rules={[
                            //   {
                            //     required: true,
                            //     message:
                            //       "Max Carry Forward After Lapse (%, Days) is required",
                            //   },
                            // ]}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Basic" },
                      { value: 2, label: "Gross" },
                      { value: 3, label: "Fixed Amount" },
                    ]}
                    name="encashBenefits"
                    label="Encashment Benefits"
                    placeholder=""
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        encashBenefits: op,
                      });
                    }}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Leave Carry Forward Type is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const {
                      paidAmount,
                      encashBenefits,
                      maxEncashment,
                      encashType,
                      serviceEndLength,
                      serviceStartLength,
                    } = form.getFieldsValue(true);

                    return (
                      <>
                        <Col md={5} sm={24}>
                          <PInput
                            type="number"
                            name="paidAmount"
                            label={`Max Leave Encashment (${
                              encashBenefits?.value !== 3 ? "% " : "Amount"
                            })`}
                            placeholder=""
                            // rules={[
                            //   {
                            //     required: true,
                            //     message:
                            //       "Max Carry Forward After Lapse (%, Days) is required",
                            //   },
                            // ]}
                          />
                        </Col>
                        <Col
                          style={{
                            marginTop: "23px",
                          }}
                        >
                          <PButton
                            type="primary"
                            action="button"
                            content="Add"
                            onClick={() => {
                              if (
                                paidAmount === undefined ||
                                encashBenefits === undefined ||
                                encashType === undefined ||
                                serviceEndLength === undefined ||
                                serviceStartLength === undefined ||
                                maxEncashment === undefined
                              ) {
                                return toast.warn("Please fill up the fields");
                              }
                              if (serviceEndLength < serviceStartLength) {
                                return toast.warn(
                                  "Service End Length must be greater than Service Start Length"
                                );
                              }

                              setTableData((prev: any) => [
                                ...prev,
                                {
                                  serviceLength: `${serviceStartLength} - ${serviceEndLength}`,
                                  encashmentType: encashType?.label,
                                  maxEncashment,
                                  encashBenefits: encashBenefits?.label,
                                  paidAmount,
                                },
                              ]);
                              form.setFieldsValue({
                                serviceStartLength: undefined,
                                serviceEndLength: undefined,
                                encashmentType: undefined,
                                maxEncashment: undefined,
                                encashBenefits: undefined,
                                paidAmount: undefined,
                              });
                            }}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
                {tableData?.length > 0 && (
                  <Col>
                    <DataTable
                      bordered
                      data={tableData}
                      loading={false}
                      header={encashheader}
                    />
                  </Col>
                )}
              </Row>
            </Row>
            {/* rata */}
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Pro Rata</span>
                </div>
              </Divider>
              <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Is Pro Rata Basis"
                  type="checkbox"
                  layout="horizontal"
                  name="isProRata"
                />
              </Col>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { isProRata } = form.getFieldsValue(true);

                  return (
                    isProRata && (
                      <>
                        <Col md={6} sm={24}>
                          <PSelect
                            // mode="multiple"
                            allowClear
                            options={[
                              { value: 1, label: "Monthly Increment" },
                              { value: 2, label: "Update From Start" },
                              { value: 3, label: "Update After End" },
                              // { value: 3, label: "Clock Time" },
                            ]}
                            name="proRataBasis"
                            label="Pro Rata Basis"
                            placeholder=""
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                proRataBasis: op,
                              });
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Pro Rata Basis is required",
                              },
                            ]}
                          />
                        </Col>
                        <Col md={8} sm={24}>
                          <PInput
                            type="number"
                            name="proRataCount"
                            label="Pro Rata Count Last Start Days (As Calander Date)"
                            placeholder=""
                            rules={[
                              {
                                required: true,
                                message: "proRataCount is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    )
                  );
                }}
              </Form.Item>
            </Row>
            {/* additional */}
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Additional Configuration</span>
                </div>
              </Divider>
              <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Show Balance From Self Service"
                  type="checkbox"
                  layout="horizontal"
                  name="isEssShowBalance"
                />
              </Col>
              <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Apply From Self Service"
                  type="checkbox"
                  layout="horizontal"
                  name="isEssApply"
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  // mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "No Round" },
                    { value: 2, label: "Round Up" },
                    { value: 3, label: "Round Down" },
                    // { value: 3, label: "Clock Time" },
                  ]}
                  name="leaveRoundingType"
                  label="Leave Rounding Type"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      leaveRoundingType: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Leave Rounding Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  // mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "Before Leave" },
                    { value: 2, label: "After Leave" },
                    { value: 3, label: "Anytime" },
                    // { value: 3, label: "Clock Time" },
                  ]}
                  name="leaveApplicationTime"
                  label="Leave Application Time"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      leaveApplicationTime: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Leave Rounding Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Attachment Mandatory"
                  type="checkbox"
                  layout="horizontal"
                  name="isAttachmentMandatory"
                  rules={[
                    {
                      required: true,
                      message: "Attachment Mandatory is required",
                    },
                  ]}
                />
              </Col>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { isAttachmentMandatory } = form.getFieldsValue(true);

                  return (
                    isAttachmentMandatory && (
                      <>
                        <Col md={7} sm={24}>
                          <PInput
                            type="number"
                            name="attachmentMandatoryAfter"
                            label="Attachment Mandatory After consuming (Days)"
                            placeholder=""
                            rules={[
                              {
                                required: isAttachmentMandatory,
                                message: "attachmentMandatoryAfter is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    )
                  );
                }}
              </Form.Item>
            </Row>
            {/* balance */}
            <>
              <Row gutter={[10, 2]}>
                <Divider
                  style={{
                    marginBlock: "4px",
                    marginTop: "20px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  orientation="left"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>Leave Balance</span>
                  </div>
                </Divider>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Fixed Days" },
                      { value: 2, label: "Date of Joining" },
                      { value: 3, label: "Date of Confirmation" },
                      { value: 4, label: "Calculative" },
                      { value: 5, label: "Bridge Leave" },
                      // { value: 3, label: "Clock Time" },
                    ]}
                    name="dependsOn"
                    label="Depends On"
                    placeholder=""
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        dependsOn: op,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Depends On is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="balanceServiceLengthStart"
                    label="Service Length Start"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "From Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
              </Row>
              <Row gutter={[10, 2]}>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="serviceStartLengthBalance"
                    label="From Service Length (Month)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "From Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="serviceEndLengthBalance"
                    label="To Service Length (Month)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "To Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { dependsOn } = form.getFieldsValue(true);

                    return dependsOn?.value === 4 ? (
                      <>
                        <Col md={6} sm={24}>
                          <PInput
                            type="number"
                            name="calculativeDays"
                            label="Calculative Days"
                            placeholder=""
                            rules={[
                              {
                                required: dependsOn?.value === 4,
                                message: "Calculative Days is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    ) : (
                      dependsOn?.value === 5 && (
                        <>
                          <Col md={6} sm={24}>
                            <PSelect
                              // mode="multiple"
                              allowClear
                              options={[
                                { value: 1, label: "Off Days" },
                                { value: 2, label: "HoliDays" },
                                { value: 3, label: "Both" },
                              ]}
                              name="bridgeLeaveFor"
                              label="Bridge Leave For"
                              placeholder=""
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  bridgeLeaveFor: op,
                                });
                              }}
                              rules={[
                                {
                                  required: dependsOn?.value === 5,
                                  message: "Bridge Leave For is required",
                                },
                              ]}
                            />
                          </Col>
                          <Col md={6} sm={24}>
                            <PInput
                              type="number"
                              name="expireAfterAvailable"
                              label="Expire After Available (Days)"
                              placeholder=""
                              rules={[
                                {
                                  required: dependsOn?.value === 5,
                                  message:
                                    "Expire After Available (Days) is required",
                                },
                              ]}
                            />
                          </Col>
                        </>
                      )
                    );
                  }}
                </Form.Item>

                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="leaveDaysForCalculativeDays"
                    label="Leave Days (For Calculative Days)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "To Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>

                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const {
                      leaveDaysForCalculativeDays,
                      dependsOn,
                      serviceEndLengthBalance,
                      serviceStartLengthBalance,
                    } = form.getFieldsValue(true);

                    return (
                      true && (
                        <>
                          <Col
                            style={{
                              marginTop: "23px",
                            }}
                          >
                            <PButton
                              type="primary"
                              action="button"
                              content="Add"
                              onClick={() => {
                                if (
                                  leaveDaysForCalculativeDays === undefined ||
                                  serviceEndLengthBalance === undefined ||
                                  serviceStartLengthBalance === undefined
                                ) {
                                  return toast.warn(
                                    "Please fill up the fields"
                                  );
                                }
                                if (
                                  serviceEndLengthBalance <
                                  serviceStartLengthBalance
                                ) {
                                  return toast.warn(
                                    "Service End Length must be greater than Service Start Length"
                                  );
                                }

                                setBalanceTable((prev: any) => [
                                  ...prev,
                                  {
                                    serviceLength: `${serviceStartLengthBalance} - ${serviceEndLengthBalance}`,
                                    leaveDaysForCalculativeDays,
                                  },
                                ]);
                                form.setFieldsValue({
                                  serviceStartLengthBalance: undefined,
                                  serviceEndLengthBalance: undefined,
                                  leaveDaysForCalculativeDays: undefined,
                                });
                              }}
                            />
                          </Col>
                        </>
                      )
                    );
                  }}
                </Form.Item>
                {balanceTable?.length > 0 && (
                  <Col>
                    <DataTable
                      bordered
                      data={balanceTable}
                      loading={false}
                      header={balanceHeader}
                    />
                  </Col>
                )}
              </Row>
            </>
            {/* Calculative Days */}
            <>
              <Row gutter={[10, 2]}>
                <Divider
                  style={{
                    marginBlock: "4px",
                    marginTop: "20px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  orientation="left"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>Calculative Days</span>
                  </div>
                </Divider>
                <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                  <PInput
                    label="Include Offday"
                    type="checkbox"
                    layout="horizontal"
                    name="isOffday"
                  />
                </Col>
                <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                  <PInput
                    label="Include Holiday"
                    type="checkbox"
                    layout="horizontal"
                    name="isHoliday"
                  />
                </Col>
              </Row>
              <Row gutter={[10, 2]}>
                <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                  <PInput
                    label="Include Absent"
                    type="checkbox"
                    layout="horizontal"
                    name="isAbsent"
                  />
                </Col>
                <Col md={5} sm={24} style={{ marginTop: "1.2rem" }}>
                  <PInput
                    label="Include Present & Movement"
                    type="checkbox"
                    layout="horizontal"
                    name="isPresentMovement"
                  />
                </Col>
              </Row>
            </>
            {/*Leave  Calculation  */}
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Leave Calculation</span>
                </div>
              </Divider>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="maxLeaveApplyMonthly"
                  label="Max. Leave Apply Days (Monthly)"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Max. Leave Apply Days (Monthly) is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="maxLeaveApplyYearly"
                  label="Max. Leave Apply Days (Yearly)"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Max. Leave Apply Days (Yearly) is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="minLeaveApplyDays"
                  label="Min. Leave Apply Days (At a Time)"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Min. Leave Apply Days (At a Time) is required",
                    },
                  ]}
                />
              </Col>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};
