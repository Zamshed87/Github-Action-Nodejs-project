import { DataTable, PButton, TableButton } from "Components";
import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row, Switch } from "antd";
import IConfirmModal from "common/IConfirmModal";
import { getWorkplaceDDL } from "common/api/commonApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { orgIdsForBn } from "utility/orgForBanglaField";

export default function PunishmentCreate({
  orgId,
  buId,
  wgId,
  employeeId,
  getData,
  setOpen,
  setSingleData,
  singleData,
}: any) {
  const createApi = useApiRequest({});
  const [selectedRow1, setSelectedRow1] = useState<any[]>([]);
  const [row, setRow] = useState<any[]>([]);
  const leaveTypeApi = useApiRequest({});

  const getLeaveTypes = () => {
    leaveTypeApi?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "LeaveType",
        BusinessUnitId: buId,
        intId: 0,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.LeaveType;
          res[i].value = item?.LeaveTypeId;
        });
      },
    });
  };
  const data: any[] = [
    {
      scenario: "Leave + Offday + Leave",

      id: "isLeaveOffdayLeave",
    },
    {
      scenario: "Leave + Holiday + Leave",
      id: "isLeaveHolidayLeave",
    },
    {
      scenario: "Leave + Offday + Holiday + Leave",
      id: "isLeaveOffdayOrHolidayLeave",
    },
    {
      scenario: "Offday + Leave + Offday",
      id: "isOffdayLeaveOffday",
    },
    {
      scenario: "Holiday + Leave + Holiday",
      id: "isHolidayLeaveHoliday",
    },
    {
      scenario: "Offday/Holiday + Leave + Offday/Holiday",
      id: "isOffdayOrHolidayLeaveOffdayOrHoliday",
    },
  ];
  const header: any = [
    {
      title: "Scenario",
      dataIndex: "scenario",
      width: 100,
    },
  ];
  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },

    {
      title: "Leave Type",
      dataIndex: "label",
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
                setRow((prev: any) => {
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
  // Form Instance
  const [form] = Form.useForm();
  // submit
  const generateApi = useApiRequest({});

  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    const cb = () => {
      form.resetFields();
      getData();
      setOpen(false);
      setSingleData({});
    };

    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      policyName: values?.policyName,
      workplaceId: values?.workplace?.value,
      employmentTypeId: values?.intEmploymentTypeList?.value,
      description: values?.description,
      isLeaveOffdayLeave: selectedRow1.some(
        (item) => item?.id === "isLeaveOffdayLeave"
      ),
      isLeaveHolidayLeave: selectedRow1.some(
        (item) => item?.id === "isLeaveHolidayLeave"
      ),
      isLeaveOffdayOrHolidayLeave: selectedRow1.some(
        (item) => item?.id === "isLeaveOffdayOrHolidayLeave"
      ),
      isOffdayLeaveOffday: selectedRow1.some(
        (item) => item?.id === "isOffdayLeaveOffday"
      ),
      isHolidayLeaveHoliday: selectedRow1.some(
        (item) => item?.id === "isHolidayLeaveHoliday"
      ),
      isOffdayOrHolidayLeaveOffdayOrHoliday: selectedRow1.some(
        (item) => item?.id === "isOffdayOrHolidayLeaveOffdayOrHoliday"
      ),
      deductionSequence: row.map((item: any, index: number) => ({
        sequence: index + 1,
        leaveTypeId: item?.value,
      })),
    };
    createApi.action({
      urlKey: "LeavePunishmentCreate",
      method: "POST",
      payload: payload,
      onSuccess: (res) => {
        toast.success(res?.message[0]);
        cb();
      },
      onError: (res: any) => {
        toast.error(
          res?.response?.data?.message?.[0] ||
            res?.response?.data?.message ||
            res?.response?.data?.errors?.["GeneralPayload.Description"]?.[0] ||
            res?.response?.data?.Message ||
            res?.response?.data?.title ||
            res?.response?.title ||
            res?.response?.message ||
            res?.response?.Message
        );
      },
    });
  };
  const EmploymentTypeDDL = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);

  const getEmploymentType = () => {
    const { workplace } = form.getFieldsValue(true);
    // const strWorkplaceIdList = intWorkplaceList
    //   ?.map((item: any) => item.value)
    //   .join(",");

    EmploymentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentTypeWorkplaceWise",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: workplace?.value,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.EmploymentType;
          data[idx].value = item?.Id;
        });
      },
    });
  };
  useEffect(() => {
    getWorkplaceDDL({ workplaceDDL, orgId, buId, wgId });
    getLeaveTypes();
  }, []);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          submitHandler();
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="policyName"
              label="Punishment Policy Name"
              placeholder="Policy Name"
              rules={[
                {
                  required: true,
                  message: "Punishment Policy Name is required",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              showSearch
              allowClear
              options={workplaceDDL?.data || []}
              name="workplace"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  intEmploymentTypeList: undefined,
                  hrPositionListDTO: undefined,
                  designationListDTO: undefined,
                  workplace: op,
                });
                if (value) {
                  getEmploymentType();
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Workplace is required",
                },
              ]}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              //   mode="multiple"
              options={
                EmploymentTypeDDL?.data?.length > 0
                  ? [{ value: 0, label: "All" }, ...EmploymentTypeDDL?.data]
                  : []
              }
              name="intEmploymentTypeList"
              label=" Employment Type"
              placeholder="  Employment Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  intEmploymentTypeList: op,
                });
                // if (value && value.includes(0)) {
                //   form.setFieldsValue({
                //     intEmploymentTypeList: [
                //       op.find((item: any) => item.value === 0),
                //     ],
                //   });
                // } else {
                //   const filteredOp = op.filter((item: any) => item.value !== 0);
                //   form.setFieldsValue({
                //     intEmploymentTypeList: filteredOp,
                //   });
                // }
              }}
              rules={[
                {
                  required: true,
                  message: "Employment Type is required",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="description"
              label="Policy Description"
              placeholder=""
              rules={[
                {
                  required: false,
                  message: "Policy Description is required",
                },
              ]}
            />
          </Col>
        </Row>
        <div className="mt-2">
          <DataTable
            bordered
            data={data}
            loading={false}
            header={header}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRow1.map((item: any) => item?.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRow1(selectedRows);
              },
            }}
          />
        </div>
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
            <span>Leave Deduction Sequence</span>
          </div>
        </Divider>
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24} style={{ marginTop: "1.2rem" }}>
            <PSelect
              // mode="multiple"
              allowClear
              options={leaveTypeApi?.data?.length > 0 ? leaveTypeApi?.data : []}
              name="leaveType"
              label="Leave Type"
              placeholder=""
              onChange={(value, op) => {
                form.setFieldsValue({
                  leaveType: op,
                });
              }}
              rules={[
                {
                  required: row?.length === 0,
                  message: "Leave Type is required",
                },
              ]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { leaveType } = form.getFieldsValue(true);

              return (
                <Col
                  style={{
                    marginTop: "40px",
                  }}
                >
                  <PButton
                    type="primary"
                    action="button"
                    content="Add"
                    onClick={() => {
                      if (leaveType === undefined) {
                        return toast.warn("Please Select a Leave Type");
                      }

                      const fields = ["policy"];
                      form
                        .validateFields(fields)
                        .then(() => {
                          setRow((prev: any) => [
                            ...prev,
                            {
                              ...leaveType,
                            },
                          ]);
                          form.setFieldsValue({
                            leaveType: undefined,
                          });
                        })
                        .catch((e: any) => {});
                    }}
                  />
                </Col>
              );
            }}
          </Form.Item>
          {row?.length > 0 && (
            <Col>
              <DataTable
                bordered
                data={row}
                loading={false}
                header={encashheader}
              />
            </Col>
          )}
        </Row>
        <ModalFooter
          onCancel={() => {
            setOpen(false);
            setSingleData({});
          }}
          submitAction="submit"
        />
      </PForm>
    </>
  );
}
