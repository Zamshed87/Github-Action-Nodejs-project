import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  DataTable,
  PButton,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { ModalFooter } from "Components/Modal";
import { isExists } from "date-fns";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Alert } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AddEditForm = ({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) => {
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      // backgroundColor: "#f0f0f0", // Light background for better visibility
      // padding: "5px 6px",
      borderRadius: "10px",
      marginBottom: "5px",
      justifyContent: "space-between",
    },
    text: {
      margin: 0,
      fontSize: "12px",
      color: "black", // Darker text color for contrast
    },
    clearButton: {
      fontSize: "14px",
      color: "#ff4d4f", // Red color for the delete icon
      cursor: "pointer",
    },
  };

  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [rowDto, setRowDto] = useState([]);

  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    if (
      (values?.punishmentType?.label === "Leave" ||
        values?.thenEffectOn?.label === "Leave") &&
      rowDto?.length === 0
    ) {
      return toast.warn("Select Atleast 1 Leave Type");
    }
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
      setId("");
    };
    const payload = {
      id: singleData?.id || 0,

      accountId: orgId,
      businessUnitId: buId,
      policyName: values?.strLatePunishment,
      howMuchLateDays: values?.intHowMuchLateDays,
      equalAbsentDays: values?.intEqualToAbsent,
      punishmentEffectOn: values?.punishmentType?.label,
      thenEffectOn: values?.thenEffectOn?.label,
      leaveTypeId1: rowDto[0]?.value ? rowDto[0]?.value : 0,
      leaveTypeId2: rowDto[1]?.value ? rowDto[1]?.value : 0,
      leaveTypeId3: rowDto[2]?.value ? rowDto[2]?.value : 0,
      amountDependOn: values?.dependsOn?.label,
      percentOfBasicOrGross:
        values?.dependsOn?.label === "Fixed Amount"
          ? 0
          : values?.intFixedAmount,
      fixAmount:
        values?.dependsOn?.label === "Fixed Amount"
          ? values?.intFixedAmount
          : 0,
      actionBy: employeeId,
    };
    PolicySaveApi.action({
      urlKey: singleData?.id
        ? "UpdateLatePunishmentPolicy"
        : "CreateLatePunishmentPolicy",
      method: singleData?.id ? "PUT" : "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const leaveTypeApi = useApiRequest({});

  const PolicySaveApi = useApiRequest({});

  const PolicyGetBy = useApiRequest({});

  const LeaveTypeDDlApiCall = () => {
    leaveTypeApi.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "LeaveType",
        BusinessUnitId: buId,
        intId: 0,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.LeaveType;
          res[i].value = item?.LeaveTypeId;
        });
      },
    });
  };

  const clearRowDto = () => {
    setRowDto([]);
  };
  useEffect(() => {
    LeaveTypeDDlApiCall();
  }, [buId, wgId]);

  useEffect(() => {
    if (singleData?.id) {
      PolicyGetBy.action({
        urlKey: "LatePunishmentPolicyGetById",
        method: "GET",
        params: {
          PunishmentPolicyId: singleData?.id,
        },

        onSuccess: (res) => {
          form.setFieldsValue({
            strLatePunishment: res?.policyName,
            intHowMuchLateDays: res?.howMuchLateDays,
            intEqualToAbsent: res?.equalAbsentDays,
            punishmentType: {
              value: res?.punishmentEffectOn,
              label: res?.punishmentEffectOn,
            },

            thenEffectOn: {
              value: res?.thenEffectOn,
              label: res?.thenEffectOn,
            },
            dependsOn: {
              value: res?.amountDependOn,
              label: res?.amountDependOn,
            },
            intFixedAmount:
              res?.amountDependOn === "Fixed Amount"
                ? res?.fixAmount
                : res?.percentOfBasicOrGross,
          });
          setRowDto(
            [res?.leaveTypeId1, res?.leaveTypeId2, res?.leaveTypeId3].filter(
              (i) => i?.value
            )
          );
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
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strLatePunishment"
              label="Late Punishment Policy Name"
              placeholder="Late Punishment Policy Name"
              rules={[
                {
                  required: true,
                  message: "Late Punishment Policy is required",
                },
              ]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              type="number"
              name="intHowMuchLateDays"
              label="How Much Late Days"
              placeholder="How Much Late Days"
              min={0}
              rules={[
                {
                  required: true,
                  message: "How Much Late Days is required",
                },
              ]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              type="number"
              name="intEqualToAbsent"
              label="Equal to Absent"
              placeholder="Equal to Absent"
              min={0}
              rules={[
                {
                  required: true,
                  message: "Equal to Absent is required",
                },
              ]}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col md={12} sm={24}>
            <PSelect
              mode="multiple"
              options={
                workplaceDDLApi?.data?.length > 0 ? workplaceDDLApi.data : []
              }
              name="workplaceDDL"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceDDL: op,
                });
              }}
              rules={[
                {
                  required: true,
                  message: "Punishment Type is required",
                },
              ]}
            />
          </Col>
        </Row> */}
        <hr />
        <Row className="mb-3">
          <Col md={6} sm={24}>
            <PSelect
              options={[
                {
                  value: 1,
                  label: "Leave",
                },
                // {
                //   value: 2,
                //   label: "Gross",
                // },
                // {
                //   value: 3,
                //   label: "Basic",
                // },
                {
                  value: 2,
                  label: "Salary",
                },
              ]}
              name="punishmentType"
              label="Punishment Effect On"
              placeholder="Punishment Effect On"
              onChange={(value, op) => {
                form.setFieldsValue({
                  punishmentType: op,
                  intFixedAmount: undefined,
                  leavetype: undefined,
                  leavetypeddl: undefined,
                  thenEffectOn: undefined,
                });
                setRowDto([]);
              }}
              rules={[
                {
                  required: true,
                  message: "Punishment Effect is required",
                },
              ]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { punishmentType, thenEffectOn, dependsOn } =
                form.getFieldsValue();

              return (
                <>
                  <Col md={6} sm={24}>
                    <PSelect
                      options={
                        punishmentType?.label === "Leave"
                          ? [
                              {
                                value: 2,
                                label: "Salary",
                              },

                              {
                                value: 3,
                                label: "None",
                              },
                            ]
                          : [
                              {
                                value: 1,
                                label: "Leave",
                              },

                              {
                                value: 3,
                                label: "None",
                              },
                            ]
                      }
                      name="thenEffectOn"
                      label="Secondary Effect On"
                      placeholder="Secondary Effect On"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          thenEffectOn: op,
                          intFixedAmount: undefined,
                          leavetype: undefined,
                          leavetypeddl: undefined,
                        });
                        setRowDto([]);
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Punishment Effect is required",
                        },
                      ]}
                    />
                  </Col>
                  {punishmentType?.label === "Leave" ||
                  thenEffectOn?.label === "Leave" ? (
                    <>
                      <Col md={4} sm={24}>
                        <PSelect
                          options={
                            leaveTypeApi?.data?.length > 0
                              ? leaveTypeApi.data
                              : []
                          }
                          name="leavetypeddl"
                          label="Leave Type"
                          placeholder="Leave Type"
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              leavetype: op,
                            });
                          }}
                          // rules={[
                          //   {
                          //     required: punishmentType?.label === "Leave",
                          //     message: "Punishment Type is required",
                          //   },
                          // ]}
                        />
                      </Col>
                      <Col span={2} className="mt-1">
                        <PButton
                          className="mt-3"
                          content={"Add"}
                          type={"primary"}
                          disabled={rowDto?.length === 3}
                          action="button"
                          onClick={() => {
                            const { leavetype } = form.getFieldsValue(true);

                            const isExists = rowDto?.find(
                              (item) => item?.LeaveType === leavetype?.LeaveType
                            );
                            if (isExists?.LeaveTypeId) {
                              return toast.warn("Leave Type Already Exists");
                            }
                            if (!leavetype?.value) {
                              return toast.warn("Add a Leave Type");
                            }

                            setRowDto((prev) => [...prev, { ...leavetype }]);
                            form.setFieldsValue({
                              leavetypeddl: undefined,
                              leavetype: undefined,
                            });
                          }}
                        />
                      </Col>
                    </>
                  ) : undefined}

                  {punishmentType?.label === "Salary" ||
                  thenEffectOn?.label === "Salary" ? (
                    <>
                      <Col md={6} sm={24}>
                        <PSelect
                          options={[
                            {
                              value: 1,
                              label: "Gross",
                            },
                            {
                              value: 2,
                              label: "Basic",
                            },
                            {
                              value: 3,
                              label: "Fixed Amount",
                            },
                          ]}
                          name="dependsOn"
                          label="Salary Depends On"
                          placeholder="Salary Depends On"
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              dependsOn: op,
                              intFixedAmount: undefined,
                              percentage: undefined,
                            });
                          }}
                          rules={[
                            {
                              required:
                                punishmentType?.value === 2 ||
                                thenEffectOn?.value === 2,
                              message: "Punishment Effect is required",
                            },
                          ]}
                        />
                      </Col>
                      <Col md={6} sm={24}>
                        <PInput
                          type="number"
                          name="intFixedAmount"
                          label={
                            dependsOn?.label === "Fixed Amount"
                              ? "Amount"
                              : "Percentage"
                          }
                          placeholder={
                            dependsOn?.label === "Fixed Amount"
                              ? "Amount"
                              : "Percentage"
                          }
                          min={0}
                          rules={[
                            {
                              required: dependsOn?.label,
                              message:
                                dependsOn?.value === "Fixed Amount"
                                  ? "Amount is required"
                                  : "Percentage is required",
                            },
                          ]}
                        />
                      </Col>
                    </>
                  ) : undefined}
                </>
              );
            }}
          </Form.Item>
        </Row>
        {rowDto?.length > 0 && (
          <Alert
            icon={<InfoOutlinedIcon fontSize="inherit" />}
            severity="warning"
            style={{
              width: "40rem",
              // position: "sticky",
              top: "1px",
            }}
          >
            <div>
              <div className="mb-3">
                <h2>Priority Sequence</h2>
              </div>
              {/* <Divider orientation="left">Small Size</Divider> */}
              <div className="" style={styles.container}>
                <p style={styles.text}>
                  {rowDto?.map((i) => i?.label).join(" => ")}
                </p>
                <Button
                  icon={<CloseOutlined />}
                  type="text"
                  onClick={clearRowDto}
                  style={styles.clearButton}
                />
              </div>
            </div>
          </Alert>
        )}
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          //loading={loading}
        />
      </PForm>
    </>
  );
};

export default AddEditForm;
