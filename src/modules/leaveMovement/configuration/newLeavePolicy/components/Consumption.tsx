import { InfoOutlined } from "@mui/icons-material";
import { Col, Divider, Form, Row } from "antd";
import { LightTooltip } from "common/LightTooltip";
import { DataTable, PButton, PInput, PSelect, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { failColor } from "utility/customColor";

export const Consumption = ({ form, consumeData, setConsumeData }: any) => {
  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Leave Consume Type",
      dataIndex: "leaveConsumeType",
      width: 100,
    },
    {
      title: "Consume Hour",
      dataIndex: "consumeHr",
      width: 100,
    },
    {
      title: "Standard Working Hour",
      dataIndex: "standardWorkHour",
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
                setConsumeData((prev: any) => {
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
  const enumApi = useApiRequest({});

  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeaveConsumeTypeEnum",
      },
    });
  };
  useEffect(() => {
    getDependTypes();
  }, []);
  return (
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
          <span>Leave Consume Type</span>
        </div>
      </Divider>
      <Col md={5} sm={24}>
        <PSelect
          // mode="multiple"
          allowClear
          options={enumApi?.data?.LeaveConsumeTypeEnum || []}
          name="leaveConsumeType"
          label="Leave Consume Type"
          placeholder="Leave Consume Type"
          onChange={(value, op) => {
            form.setFieldsValue({
              leaveConsumeType: op,
              minConsumeTime: undefined,
              maxConsumeTime: undefined,
              standardWorkHour: undefined,
            });
          }}
          rules={[
            {
              required: consumeData?.length === 0,
              message: "Leave Consume Type is required",
            },
          ]}
        />
      </Col>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const { leaveConsumeType } = form.getFieldsValue(true);

          return (
            <>
              {/* {leaveConsumeType?.filter((i: any) => i?.value !== 1).length > */}
              {leaveConsumeType?.value != 1 && (
                <>
                  <Col md={5} sm={24}>
                    <PInput
                      type="number"
                      name="minConsumeTime"
                      label={
                        <>
                          Minimum Consume Hour
                          <LightTooltip
                            title={`Please input "Minutes" as percentage (%)!`}
                            arrow
                          >
                            {" "}
                            <InfoOutlined
                              sx={{
                                color: failColor,
                                width: 16,
                                cursor: "pointer",
                              }}
                            />
                          </LightTooltip>
                        </>
                      }
                      placeholder=""
                      rules={[
                        {
                          required:
                            leaveConsumeType && leaveConsumeType?.value != 1,
                          message: "Minimum Consume Hour is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={5} sm={24}>
                    <PInput
                      type="number"
                      name="maxConsumeTime"
                      label={
                        <>
                          Maximum Consume Hour
                          <LightTooltip
                            title={`Please input "Minutes" as percentage (%)!`}
                            arrow
                          >
                            {" "}
                            <InfoOutlined
                              sx={{
                                color: failColor,
                                width: 16,
                                cursor: "pointer",
                              }}
                            />
                          </LightTooltip>
                        </>
                      }
                      placeholder=""
                      rules={[
                        {
                          required:
                            leaveConsumeType && leaveConsumeType?.value != 1,
                          message: "Maximum Consume Hour is required",
                        },
                      ]}
                    />
                  </Col>
                </>
              )}
              {leaveConsumeType?.value == 4 && (
                <Col md={5} sm={24}>
                  <PInput
                    type="number"
                    name="standardWorkHour"
                    label={`Standard Working Hour`}
                    placeholder=""
                    rules={[
                      {
                        required:
                          leaveConsumeType && leaveConsumeType?.value == 4,
                        // leaveConsumeType?.filter((i: any) => i?.value === 4)
                        //   .length > 0,
                        message: "Standard Working Hour is required",
                      },
                    ]}
                  />
                </Col>
              )}
            </>
          );
        }}
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const {
            leaveConsumeType,
            maxConsumeTime,
            minConsumeTime,
            standardWorkHour,
          } = form.getFieldsValue(true);

          return (
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
                    if (leaveConsumeType === undefined) {
                      return toast.warn("Please fill up the fields");
                    }

                    if (maxConsumeTime < minConsumeTime) {
                      return toast.warn(
                        "Max Consume Hour must be greater than Min Consume Hour Length"
                      );
                    }
                    const fields = [
                      "leaveConsumeType",
                      "maxConsumeTime",
                      "minConsumeTime",
                      "standardWorkHour",
                    ];
                    form
                      .validateFields(fields)
                      .then(() => {
                        setConsumeData((prev: any) => [
                          ...prev,
                          {
                            consumeHr:
                              leaveConsumeType?.value == 1
                                ? "Not Applicable"
                                : `${minConsumeTime} to ${maxConsumeTime} Hr.`,
                            leaveConsumeType: leaveConsumeType?.label,
                            standardWorkHour,
                          },
                        ]);
                        form.setFieldsValue({
                          leaveConsumeType: undefined,
                          standardWorkHour: undefined,
                          maxConsumeTime: undefined,
                          minConsumeTime: undefined,
                        });
                      })
                      .catch((e: any) => {
                        console.log({ e });
                      });
                  }}
                />
              </Col>
            </>
          );
        }}
      </Form.Item>
      {consumeData?.length > 0 && (
        <Col>
          <DataTable
            bordered
            data={consumeData}
            loading={false}
            header={encashheader}
          />
        </Col>
      )}
    </Row>
  );
};
