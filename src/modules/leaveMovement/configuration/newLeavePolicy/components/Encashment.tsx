import { Col, Divider, Form, Row } from "antd";
import { DataTable, PButton, PInput, PSelect, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const Encashment = ({
  form,
  tableData,
  setTableData,
  grossBasicEnum,
  JoinOrConfirmEnum,
  PercentOrFixedEnum,
}: any) => {
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
      title: `Paid Amount/%`,
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
  const isMonthExists = (start: number, end: number) => {
    let isExists = false;
    tableData?.forEach((item: any) => {
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
        types: "EncashableTimelineEnum",
      },
    });
  };
  useEffect(() => {
    getDependTypes();
  }, []);

  return (
    <>
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

      <Col md={6} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={[
            { value: 1, label: "Yes" },
            { value: 0, label: "No" },
          ]}
          name="isEncashment"
          label="Leave Encashment "
          placeholder="Leave Encashment "
          onChange={(value, op) => {
            form.setFieldsValue({
              isEncashment: op,
            });
          }}
          rules={[
            {
              required: true,
              message: "Leave Encashment  is required",
            },
          ]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const {
            isEncashment,
            paidAmount,
            encashBenefits,
            maxEncashment,
            encashType,
            serviceEndLength,
            serviceStartLength,
          } = form.getFieldsValue(true);

          return (
            isEncashment?.value === 1 && (
              <>
                <Row gutter={[10, 2]}>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={JoinOrConfirmEnum?.data?.DateDependsOnEnum || []}
                      name="enLengthDependOn"
                      label="Service Length Depend On"
                      placeholder="Service Length Depend On"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          enLengthDependOn: op,
                        });
                      }}
                      rules={[
                        {
                          required: isEncashment?.value === 1,
                          message: "Service Length Depend On is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={enumApi?.data?.EncashableTimelineEnum || []}
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
                          required: isEncashment?.value === 1,
                          message: "Encashment Timeline is required",
                        },
                      ]}
                    />
                  </Col>
                </Row>
                <Row gutter={[10, 2]}>
                  <Col md={6} sm={24}>
                    <PInput
                      type="number"
                      name="serviceStartLength"
                      label="From Service Length (Month)"
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required:
                            isEncashment?.value === 1 &&
                            tableData?.length === 0,
                          message: "From Service Length (Month) is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PInput
                      type="number"
                      name="serviceEndLength"
                      label="To Service Length (Month)"
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required:
                            isEncashment?.value === 1 &&
                            tableData?.length === 0,
                          message: "To Service Length (Month) is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={PercentOrFixedEnum?.data?.DaysTypeEnum || []}
                      name="encashType"
                      label="Leave Encashment Type"
                      placeholder="Leave Encashment Type"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          encashType: op,
                        });
                      }}
                      rules={[
                        {
                          required:
                            isEncashment?.value === 1 &&
                            tableData?.length === 0,
                          message: "Leave Carry Forward Type is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={5} sm={24}>
                    <PInput
                      type="number"
                      name="maxEncashment"
                      label={`Max Leave Encashment (${
                        encashType?.value == 2 ? "% of Days" : "Fixed Days"
                      })`}
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required:
                            isEncashment?.value === 1 &&
                            tableData?.length === 0,
                          message:
                            "Max Carry Forward After Lapse (%, Days) is required",
                        },
                      ]}
                    />
                  </Col>

                  <Col md={6} sm={24}>
                    <PSelect
                      // mode="multiple"
                      allowClear
                      options={
                        grossBasicEnum?.data?.LeavePolicyDependOnEnum || []
                      }
                      name="encashBenefits"
                      label="Encashment Benefits"
                      placeholder=""
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          encashBenefits: op,
                        });
                      }}
                      rules={[
                        {
                          required:
                            isEncashment?.value === 1 &&
                            tableData?.length === 0,
                          message: "Leave Carry Forward Type is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={5} sm={24}>
                    <PInput
                      type="number"
                      name="paidAmount"
                      label={`Paid (${
                        encashBenefits?.value != 3 ? "% " : "Amount"
                      })`}
                      placeholder=""
                      rules={[
                        {
                          message: "Number must be positive",
                          pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                        },
                        {
                          required:
                            isEncashment?.value === 1 &&
                            tableData?.length === 0,
                          message:
                            "Max Carry Forward After Lapse (%, Days) is required",
                        },
                      ]}
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
                        const fields = [
                          "serviceStartLength",
                          "serviceEndLength",
                          "encashmentType",
                          "maxEncashment",
                          "encashBenefits",
                          "paidAmount",
                        ];
                        form
                          .validateFields(fields)
                          .then(() => {
                            if (
                              isMonthExists(
                                serviceStartLength,
                                serviceEndLength
                              )
                            ) {
                              return toast.warn(
                                "Service Length already exists"
                              );
                            } else {
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
                                encashType: undefined,
                                maxEncashment: undefined,
                                encashBenefits: undefined,
                                paidAmount: undefined,
                              });
                            }
                          })
                          .catch((e: any) => {
                            console.log({ e });
                          });
                      }}
                    />
                  </Col>

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
              </>
            )
          );
        }}
      </Form.Item>
    </>
  );
};
