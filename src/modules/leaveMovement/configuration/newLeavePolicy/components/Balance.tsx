import { Col, Divider, Form, Row } from "antd";
import { DataTable, PButton, PInput, PSelect, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const Balance = ({
  form,
  balanceTable,
  setBalanceTable,
  JoinOrConfirmEnum,
  detailsApi,
}: any) => {
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
      title: "Leave Balance Depend On",
      dataIndex: "leaveDependsOn",
      width: 100,
    },
    {
      title: "Calculative Days",
      dataIndex: "calculativeDays",
      width: 100,
    },
    {
      title: "Bridge Leave For",
      dataIndex: "bridgeLeaveFor",
      width: 100,
    },
    {
      title: "Minumum Working Hour",
      dataIndex: "minWorkHr",
      width: 100,
    },
    {
      title: "Leave Days",
      dataIndex: "leaveDaysFor",
      width: 100,
    },
    {
      title: "Expire After Available (Days)",
      dataIndex: "expireAfterAvailable",
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
  const isMonthExists = (start: number, end: number) => {
    let isExists = false;
    balanceTable?.forEach((item: any) => {
      const [startLength, endLength] = item.serviceLength.split(" - ");
      if (
        (start >= parseInt(startLength) && start <= parseInt(endLength) - 1) ||
        (end >= parseInt(startLength) && end <= parseInt(endLength) - 1)
      ) {
        isExists = true;
      }
    });
    return isExists;
  };
  const enumApi = useApiRequest({});

  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeaveBalanceEnum",
      },
    });
  };

  const enumApi3 = useApiRequest({});

  const getDependTypes3 = () => {
    enumApi3?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "BridgeLeaveForEnum",
      },
    });
  };
  useEffect(() => {
    getDependTypes();
    getDependTypes3();
  }, []);
  useEffect(() => {
    if (detailsApi?.data?.data?.balanceData[0]?.serviceLengthDependOnId) {
      const findData = JoinOrConfirmEnum?.data?.DateDependsOnEnum?.find(
        (i: any) =>
          i?.value ==
          detailsApi?.data?.data?.balanceData[0]?.serviceLengthDependOnId
      );
      form.setFieldsValue({
        dependsOn: findData,
      });
    }
  }, [detailsApi]);
  return (
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
            options={JoinOrConfirmEnum?.data?.DateDependsOnEnum || []}
            name="dependsOn"
            label="Service Length Depend On"
            placeholder=""
            onChange={(value, op) => {
              form.setFieldsValue({
                dependsOn: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Service Length Depend On is required",
              },
            ]}
          />
        </Col>
        {/* <Col md={6} sm={24}>
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
        </Col> */}
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={5} sm={24}>
          <PInput
            type="number"
            name="serviceStartLengthBalance"
            label="From Service Length (Month)"
            placeholder=""
            min={0}
            max={99999}
            rules={[
              {
                message: "Number must be positive",
                pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
              },
              {
                required: balanceTable?.length === 0,
                message: "From Service Length (Month) is required",
              },
            ]}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { serviceStartLengthBalance } = form.getFieldsValue(true);

            return (
              <Col md={5} sm={24}>
                <PInput
                  type="number"
                  name="serviceEndLengthBalance"
                  label="To Service Length (Month)"
                  placeholder=""
                  min={0}
                  max={99999}
                  rules={[
                    {
                      message: "Number must be positive",
                      pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                    },
                    {
                      required: balanceTable?.length === 0,
                      message: "To Service Length (Month) is required",
                    },
                    {
                      validator: (_, value) => {
                        if (
                          serviceStartLengthBalance &&
                          value <= serviceStartLengthBalance
                        ) {
                          return Promise.reject(
                            "must be greater than From Service Length (Month)"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                />
              </Col>
            );
          }}
        </Form.Item>

        <Col md={5} sm={24}>
          <PSelect
            // mode="multiple"
            allowClear
            options={enumApi?.data?.LeaveBalanceEnum || []}
            name="leaveDependsOn"
            label="Leave Balance Depend On"
            placeholder=""
            onChange={(value, op) => {
              form.setFieldsValue({
                leaveDependsOn: op,
                calculativeDays: undefined,
                bridgeLeaveFor: undefined,
                minWorkHr: undefined,
                expireAfterAvailable: undefined,
              });
            }}
            rules={[
              {
                required: balanceTable?.length === 0,
                message: "Leave Balance Depend On is required",
              },
            ]}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { leaveDependsOn } = form.getFieldsValue(true);

            return leaveDependsOn?.value == 2 ? (
              <>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="calculativeDays"
                    label="Calculative Days"
                    placeholder=""
                    rules={[
                      {
                        message: "Number must be positive",
                        pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                      },
                      {
                        required: leaveDependsOn?.value == 2,
                        message: "Calculative Days is required",
                      },
                    ]}
                  />
                </Col>
              </>
            ) : (
              leaveDependsOn?.value == 3 && (
                <>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={enumApi3?.data?.BridgeLeaveForEnum || []}
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
                          required: leaveDependsOn?.value == 3,
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
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required: leaveDependsOn?.value == 3,
                          message: "Expire After Available (Days) is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PInput
                      type="number"
                      name="minWorkHr"
                      label="Minumum Working Hour"
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required: leaveDependsOn?.value == 3,
                          message: "Minumum Working Hour is required",
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
            name="leaveDaysFor"
            label="Leave Days"
            placeholder=""
            rules={[
              {
                message: "Number must be positive",
                pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
              },
              {
                required: balanceTable?.length === 0,
                message: "Leave Days is required",
              },
            ]}
          />
        </Col>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const {
              leaveDaysFor,
              leaveDependsOn,
              serviceEndLengthBalance,
              serviceStartLengthBalance,
              calculativeDays,
              bridgeLeaveFor,
              minWorkHr,
              expireAfterAvailable,
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
                          leaveDaysFor === undefined ||
                          serviceEndLengthBalance === undefined ||
                          serviceStartLengthBalance === undefined ||
                          leaveDependsOn === undefined
                        ) {
                          return toast.warn("Please fill up the fields");
                        }
                        if (
                          serviceEndLengthBalance < serviceStartLengthBalance
                        ) {
                          return toast.warn(
                            "Service End Length must be greater than Service Start Length"
                          );
                        }
                        const fields = [
                          "serviceStartLengthBalance",
                          "serviceEndLengthBalance",
                          "leaveDependsOn",
                          "leaveDaysFor",
                          "calculativeDays",
                          "bridgeLeaveFor",
                          "minWorkHr",
                          "expireAfterAvailable",
                        ];
                        form
                          .validateFields(fields)
                          .then(() => {
                            if (
                              isMonthExists(
                                serviceStartLengthBalance,
                                serviceEndLengthBalance
                              )
                            ) {
                              return toast.warn(
                                "Service Length already exists"
                              );
                            } else {
                              setBalanceTable((prev: any) => [
                                ...prev,
                                {
                                  serviceLength: `${serviceStartLengthBalance} - ${serviceEndLengthBalance}`,
                                  leaveDaysFor,
                                  leaveDependsOn: leaveDependsOn?.label,
                                  calculativeDays: calculativeDays || "-",
                                  minWorkHr: minWorkHr || "-",
                                  expireAfterAvailable:
                                    expireAfterAvailable || "-",

                                  bridgeLeaveFor: bridgeLeaveFor?.label || "-",
                                },
                              ]);
                              form.setFieldsValue({
                                serviceStartLengthBalance: undefined,
                                serviceEndLengthBalance: undefined,
                                leaveDaysFor: undefined,
                                expireAfterAvailable: undefined,
                                minWorkHr: undefined,
                                bridgeLeaveFor: undefined,
                                leaveDependsOn: undefined,
                                calculativeDays: undefined,
                              });
                            }
                          })
                          .catch((e: any) => {
                            console.log({ e });
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
  );
};
