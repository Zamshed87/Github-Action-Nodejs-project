import { Form } from "antd";
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

const AddEditForm = ({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) => {
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [rowDto, setRowDto] = useState([]);
  //   {
  //     "latePunishmentPolicyId": 0,
  //     "latePunishmentPolicyName": "string",
  //     "howMuchLateDaysForPenalty": 0,
  //     "equalAbsent": 0,
  //     "firstPriority": "string",
  //     "secondPriority": "string",
  //     "thirdPriority": "string",
  //     "amountDeductionDependsOn": "string",
  //     "amountForFixedAmount": 0,
  //     "workplaceIdList": [
  //       0
  //     ],
  //     "actionBy": 0
  //   }

  //   {
  //     "strLatePunishment": "new Amount",
  //     "intHowMuchLateDays": 10,
  //     "intEqualToAbsent": 2,
  //     "punishmentType": {
  //         "value": 1,
  //         "label": "Leave"
  //     },
  //     "workplaceDDL": [
  //         {
  //             "intWorkplaceId": 3,
  //             "strWorkplace": "Matador Writing Instruments Ltd.(MWIL)",
  //             "strWorkplaceCode": "MWIL",
  //             "label": "Matador Writing Instruments Ltd.(MWIL)",
  //             "value": 3
  //         },
  //         {
  //             "intWorkplaceId": 4,
  //             "strWorkplace": "Matador Plastic & Rubber Industries Ltd.(MPRIL)",
  //             "strWorkplaceCode": "MPRIL",
  //             "label": "Matador Plastic & Rubber Industries Ltd.(MPRIL)",
  //             "value": 4
  //         }
  //     ],
  //     "leavetypeddl": 1,
  //     "leavetype": {
  //         "LeaveTypeId": 1,
  //         "LeaveType": "Casual Leave",
  //         "label": "Casual Leave",
  //         "value": 1
  //     }
  // }

  // {
  //   "strLatePunishment": "new Punishment",
  //   "intHowMuchLateDays": 5,
  //   "intEqualToAbsent": 5,
  //   "punishmentType": {
  //       "value": 2,
  //       "label": "Amount"
  //   },
  //   "leavetypeddl": 1,
  //   "leavetype": {
  //       "LeaveTypeId": 1,
  //       "LeaveType": "Casual Leave",
  //       "label": "Casual Leave",
  //       "value": 1
  //   },
  //   "dependsOnDDL": {
  //       "value": 3,
  //       "label": "Fixed Amount"
  //   },
  //   "intFixedAmount": 5,
  //   "workplaceDDL": [
  //       {
  //           "intWorkplaceId": 3,
  //           "strWorkplace": "Matador Writing Instruments Ltd.(MWIL)",
  //           "strWorkplaceCode": "MWIL",
  //           "label": "Matador Writing Instruments Ltd.(MWIL)",
  //           "value": 3
  //       },
  //       {
  //           "intWorkplaceId": 4,
  //           "strWorkplace": "Matador Plastic & Rubber Industries Ltd.(MPRIL)",
  //           "strWorkplaceCode": "MPRIL",
  //           "label": "Matador Plastic & Rubber Industries Ltd.(MPRIL)",
  //           "value": 4
  //       }
  //   ]
  // }

  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    const payload = {
      latePunishmentPolicyId: 0,
      latePunishmentPolicyName: values?.strLatePunishment || "",
      howMuchLateDaysForPenalty: values?.intHowMuchLateDays || 0,
      equalAbsent: values?.intEqualToAbsent || 0,
      firstPriority:
        values?.punishmentType.value === 1
          ? values?.leavetype?.label || ""
          : "Amount",
      secondPriority: "",
      thirdPriority: "",
      amountDeductionDependsOn: values?.dependsOnDDL?.label || "",
      amountForFixedAmount: values?.intFixedAmount || 0,
      workplaceIdList:
        values?.workplaceDDL?.length > 0
          ? values.workplaceDDL.map((item) => item.value)
          : [],
      actionBy: employeeId,
    };
    PolicySaveApi.action({
      urlKey: "LatePunishmentPolicyCreate",
      method: "POST",
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

  const workplaceDDLApi = useApiRequest({});
  const workplaceDDLApiCall = () => {
    workplaceDDLApi.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        intId: 1,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  useEffect(() => {
    LeaveTypeDDlApiCall();
    workplaceDDLApiCall();
  }, [buId, wgId]);

  useEffect(() => {
    if (singleData?.latePunishmentPolicyId) {
      PolicyGetBy.action({
        urlKey: "LatePunishmentPolicyGetBy",
        method: "GET",
        params: {
          PunishmentPolicyId: singleData.latePunishmentPolicyId,
        },

        //   {
        //     "res": {
        //         "latePunishmentPolicyId": 1,
        //         "latePunishmentPolicyName": "New Punishment Policy",
        //         "latePunishmentPolicyCode": "",
        //         "howMuchLateDaysForPenalty": 3,
        //         "equalAbsent": 1,
        //         "firstPriority": "SL",
        //         "secondPriority": "",
        //         "thirdPriority": "",
        //         "amountDeductionDependsOn": "",
        //         "amountForFixedAmount": 0,
        //         "latePunishmentPolicyRow": [
        //             {
        //                 "workPlaceId": 5,
        //                 "workplaceName": "Matador Pearl Harbour(MPH)"
        //             },
        //             {
        //                 "workPlaceId": 6,
        //                 "workplaceName": "Matador Food & Allied Industries Ltd.(MFAIL)"
        //             },
        //             {
        //                 "workPlaceId": 7,
        //                 "workplaceName": "Matador Electrical & Electronics Ltd.(MEEL)"
        //             },
        //             {
        //                 "workPlaceId": 8,
        //                 "workplaceName": "Uniplas Limited(UPL)"
        //             }
        //         ]
        //     }
        // }
        onSuccess: (res) => {
          console.log({ res });
          form.setFieldsValue({
            strLatePunishment: res?.latePunishmentPolicyName,
            intHowMuchLateDays: res?.howMuchLateDaysForPenalty,
            intEqualToAbsent: res?.equalAbsent,
            punishmentType:
              res?.firstPriority === "Amount"
                ? {
                    value: 2,
                    label: "Amount",
                  }
                : {
                    value: 1,
                    label: "Leave",
                  },
            workplaceDDL:
              res?.latePunishmentPolicyRow?.length > 0
                ? res?.latePunishmentPolicyRow?.map((item) => {
                    return {
                      value: item?.workPlaceId,
                      label: item?.workplaceName,
                    };
                  })
                : [],
          });
        },
      });
    }
  }, [singleData]);
  const header = [
    {
      title: "SL",
      render: (_, rec, index) => index + 1,
    },
    {
      title: "Leave Type",
      dataIndex: "LeaveType",
      sorter: true,
    },

    {
      width: 20,
      align: "center",
      render: (_, rec) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "delete",
                onClick: (e) => {
                  setRowDto((prev) => {
                    return prev?.filter(
                      (item) => item?.LeaveType !== rec?.LeaveType
                    );
                  });
                },
              },
            ]}
          />
        </>
      ),
    },
  ];
  console.log({ rowDto });
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          console.log({ values });
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
        <Row>
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
        </Row>
        <hr />
        <Row className="mb-3">
          <Col md={6} sm={24}>
            <PSelect
              options={[
                {
                  value: 1,
                  label: "Leave",
                },
                {
                  value: 2,
                  label: "Gross",
                },
                {
                  value: 3,
                  label: "Basic",
                },
                {
                  value: 4,
                  label: "Fixed Amount",
                },
              ]}
              name="punishmentType"
              label="Punishment Type"
              placeholder="Punishment Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  punishmentType: op,
                  intFixedAmount: undefined,
                  leavetype: undefined,
                  leavetypeddl: undefined,
                });
                setRowDto([]);
              }}
              rules={[
                {
                  required: true,
                  message: "Punishment Type is required",
                },
              ]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { punishmentType } = form.getFieldsValue();

              return (
                <>
                  {punishmentType?.label === "Leave" ? (
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
                          rules={[
                            {
                              required: punishmentType?.label === "Leave",
                              message: "Punishment Type is required",
                            },
                          ]}
                        />
                      </Col>
                      <Col span={2} className="mt-1">
                        <PButton
                          className="mt-3"
                          content={"Add"}
                          type={"primary"}
                          action="button"
                          onClick={() => {
                            const { leavetype } = form.getFieldsValue(true);
                            const isExists = rowDto?.find(
                              (item) => item?.LeaveType === leavetype?.LeaveType
                            );
                            console.log({ isExists });
                            if (isExists?.LeaveTypeId) {
                              return toast.warn("Leave Type Already Exists");
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
                  ) : punishmentType?.value === 4 ? (
                    <>
                      <Col md={6} sm={24}>
                        <PInput
                          type="number"
                          name="intFixedAmount"
                          label="Amount"
                          placeholder="Amount"
                          min={0}
                          rules={[
                            {
                              required: punishmentType?.value === 4,
                              message: "Amount is required",
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
          <DataTable bordered data={rowDto} header={header} />
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
