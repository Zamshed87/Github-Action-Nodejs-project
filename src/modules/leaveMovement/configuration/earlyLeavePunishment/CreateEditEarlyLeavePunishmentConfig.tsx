import { Checkbox, Col, Form, Row, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { DeleteOutlined } from "@mui/icons-material";
import { getPeopleDeskAllDDL } from "common/api";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import { DataState, LeaveDeductionDataState } from "./earlyLeaveType";
import { addHandler, addLeaveDeductions } from "./earlyLeaveHelper";
import RangeDatePicker from "../LatePunishment/RangeDatePicker";
import View from "../LatePunishment/view";
import { EarlyLeavePunishment } from "./earlyLeaveForm";
import { createEditPunishmentConfig } from "../LatePunishment/helper";

const CreateEditEarlyLeavePunishmentConfig = () => {
  const [form] = Form.useForm();
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [data, setData] = useState<DataState>([]);
  const [leaveDeductionData, setLeaveDeductionData] =
    useState<LeaveDeductionDataState>([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const [leaveTypeDDL, getleaveTypeDDL, leaveTypeDDLLoader, setleaveTypeDDL] =
    useAxiosGet();
  const [
    singleEarlyLeavePunPolicy,
    getSingleEarlyLeavePunPolicy,
    singleEarlyLeavePunPolicyLoader,
    setSingleEarlyLeavePunPolicy,
  ] = useAxiosGet();
  const params = useParams<{ type?: string; id?: string }>();
  const history = useHistory();

  // redux
  const { profileData } = useSelector(
    (state: { auth: { profileData: any } }) => state?.auth,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (store: { auth: { permissionList: any[] } }) => store?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId, employeeId } = profileData;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  type Permission = {
    isCreate?: boolean;
    [key: string]: any;
  };

  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30590),
    []
  );

  const getEmployeDepartment = () => {
    form.setFieldsValue({
      department: undefined,
    });
    const { workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
  };
  const getEmployeDesignation = () => {
    form.setFieldsValue({
      designation: undefined,
    });
    const { workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });
  };

  const getEmploymentType = () => {
    form.setFieldsValue({
      employmentType: undefined,
    });
    const { workplace } = form.getFieldsValue(true);

    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Early Leave Punishment";
    () => {
      document.title = "PeopleDesk";
    };
    if (params?.type === "extend" || params?.type === "view") {
      getSingleEarlyLeavePunPolicy(
        `/EarlyLeavePunishmentpolicy/${params?.id}`,
        (data: any) => {
          setData(data?.elements || []);
          setLeaveDeductionData(data?.leaveDeductions || []);
        }
      );
    }

    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
    getleaveTypeDDL(
      `/SaasMasterData/GetAllLveLeaveType?BusinessUnitId=${buId}&WorkGroupId=${wgId}&SearchText=`,
      (data: any) => {
        const list: { label: string; value: number }[] = [];
        data.forEach((item: any, i: any) => {
          if (item?.isActive === true)
            list.push({
              label: item?.strLeaveType + " (" + item?.strLeaveTypeCode + ")",
              value: item?.intLeaveTypeId,
            });
        });
        setleaveTypeDDL(list);
      }
    );
  }, [wgId]);

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: 1,
          pageSize: 100,
          index,
        }),
      fixed: "left",
      align: "center",
      width: 30,
    },
    {
      title: "Early Leave Calculation Type",
      dataIndex: "earlyLeaveCalculationTypeDescription",
      fixed: "left",
    },
    {
      title: "Each Day Count by",
      dataIndex: "eachDayCountBy",
      fixed: "left",
    },
    {
      title: "Day Range",
      dataIndex: "dayRange",
      fixed: "left",
      render: (value: any, rec: any) => {
        return rec?.startDay + " - " + rec?.endDay + " days";
      },
    },
    {
      title: "Consecutive Day?",
      dataIndex: "isConsecutiveDay",
      render: (rec: any) => {
        return rec ? "Yes" : "No";
      },
    },
    {
      title: "Early Leave Time (Min)",
      dataIndex: "earlyLeaveTimeMinutes",
      render: (value: any, rec: any) => {
        return (
          rec?.minimumEarlyLeaveTime +
          " to " +
          rec?.maximumEarlyLeaveTime +
          " Minutes"
        );
      },
    },
    {
      title: "Early Leave Time Calculated by",
      dataIndex: "earlyLeaveTimeCalculatedByDescription",
    },
    {
      title: "Punishment Type",
      dataIndex: "punishmentTypeDescription",
    },
    {
      title: "Leave Deduct",
      dataIndex: "leaveDeductTypeDescription",
    },
    {
      title: "Leave Deduct Qty",
      dataIndex: "leaveDeductQty",
    },
    {
      title: "Amount Deduct from",
      dataIndex: "amountDeductFromDescription",
    },
    {
      title: "Amount Deduct type time",
      dataIndex: "amountDeductTypeDescription",
    },
    {
      title: "% of Amount (Based on 1 day)",
      dataIndex: "amountOrPercentage",
    },
    ...(params?.type !== "view"
      ? [
          {
            title: "Action",
            dataIndex: "status",
            render: (_: any, rec: any) => (
              <Flex justify="center">
                <Tooltip placement="bottom" title="Delete">
                  <DeleteOutlined
                    style={{
                      color: "red",
                      fontSize: "14px",
                      cursor: "pointer",
                      margin: "0 5px",
                    }}
                    onClick={() => {
                      const filterData = data.filter(
                        (item: any) => item.idx !== rec.idx
                      );
                      setData(filterData);
                    }}
                  />
                </Tooltip>
              </Flex>
            ),
            align: "center",
            width: 40,
          },
        ]
      : []),
  ];

  const headerLeaveDeduction = [
    {
      title: "SL",
      dataIndex: "serialNo",
    },
    {
      title: "Leave Type",
      dataIndex: "leaveTypeName",
      key: "leaveTypeName",
    },
    ...(params?.type !== "view"
      ? [
          {
            title: "Action",
            dataIndex: "status",
            render: (_: any, rec: any) => (
              <Flex justify="center">
                <Tooltip placement="bottom" title="Delete">
                  <DeleteOutlined
                    style={{
                      color: "red",
                      fontSize: "14px",
                      cursor: "pointer",
                      margin: "0 5px",
                    }}
                    onClick={() => {
                      const filterData = leaveDeductionData.filter(
                        (item: any) => item.leaveTypeId !== rec.leaveTypeId
                      );
                      setLeaveDeductionData(filterData);
                    }}
                  />
                </Tooltip>
              </Flex>
            ),
            align: "center",
          },
        ]
      : []),
  ];

  const CustomCheckbox = () => {
    return (
      <Form.Item
        name="isConsecutiveDay"
        valuePropName="checked"
        style={{ marginLeft: "15px", marginTop: "15px" }}
      >
        <Checkbox>Is Consecutive Day?</Checkbox>
      </Form.Item>
    );
  };

  const isDeductionSeqShow = (): boolean => {
    return (
      data?.length > 0 && data.some((item) => Number(item.punishmentType) === 1)
    );
  };

  const earlyLeaveCalculationType = Form.useWatch(
    "earlyLeaveCalculationType",
    form
  );
  const punishmentType = Form.useWatch("punishmentType", form);
  const leaveDeductType = Form.useWatch("leaveDeductType", form);
  const amountDeductFrom = Form.useWatch("amountDeductFrom", form);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title="Early Leave Punishment Configuration"
            buttonList={
              params?.type !== "view"
                ? [
                    {
                      type: "primary",
                      content: "Save",
                      onClick: () => {
                        if (
                          isDeductionSeqShow() &&
                          leaveDeductionData?.length === 0
                        ) {
                          toast.error("Please set-up leave deduction sequence");
                          return;
                        }
                        form
                          .validateFields([])
                          .then(() => {
                            createEditPunishmentConfig(
                              "/EarlyLeavePunishmentpolicy",
                              profileData,
                              form,
                              data,
                              leaveDeductionData,
                              setLoading,
                              () => {
                                history.push(
                                  "/administration/earlyLeavePunishmentPolicy"
                                );
                              },
                              "early"
                            );
                          })
                          .catch(() => {});
                      },
                    },
                  ]
                : []
            }
          />
          {params?.type !== "view" ? (
            <PCardBody>
              <CommonForm
                formConfig={EarlyLeavePunishment(
                  workplaceDDL,
                  getEmploymentType,
                  getEmployeDepartment,
                  getEmployeDesignation,
                  employmentTypeDDL?.data,
                  empDepartmentDDL?.data,
                  empDesignationDDL?.data,
                  <RangeDatePicker name={"dayRange"} />,
                  <CustomCheckbox />,
                  {
                    earlyLeaveCalculationType,
                    punishmentType,
                    leaveDeductType,
                    amountDeductFrom,
                  },
                  form
                )}
                form={form}
              >
                <Col md={6} sm={24}>
                  <PButton
                    style={{ marginTop: "22px" }}
                    type="primary"
                    content={"Add"}
                    onClick={() => {
                      const allFields = form.getFieldsValue();
                      const fieldsToValidate = Object.keys(allFields).filter(
                        (field) => field !== "leaveType"
                      );
                      form
                        .validateFields(fieldsToValidate)
                        .then(() => {
                          const values = form.getFieldsValue(true);
                          addHandler(setData, data, form);
                        })
                        .catch(() => {});
                    }}
                  />
                </Col>
              </CommonForm>
            </PCardBody>
          ) : (
            <PCardBody>
              <View data={singleEarlyLeavePunPolicy} />
            </PCardBody>
          )}
        </PCard>
        {data?.length > 0 && (
          <DataTable
            bordered
            data={data || []}
            loading={false}
            header={header}
          />
        )}

        {params?.type !== "view" && isDeductionSeqShow() && (
          <div className="mt-3 mb-5">
            <PCard>
              <PCardBody>
                <center>
                  <h1>Leave Deduction Sequence</h1>
                </center>

                <Row gutter={[10, 2]}>
                  <Col md={6} sm={24}>
                    <PSelect
                      options={leaveTypeDDL || []}
                      name="leaveType"
                      label="Leave Type"
                      placeholder="Leave Type"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          leaveType: op,
                        });
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Leave Type is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={4} sm={24}>
                    <PButton
                      style={{ marginTop: "22px" }}
                      type="primary"
                      content={"Add"}
                      onClick={() => {
                        form
                          .validateFields(["leaveType"])
                          .then(() => {
                            const values = form.getFieldsValue(true);
                            addLeaveDeductions(
                              setLeaveDeductionData,
                              leaveDeductionData,
                              values
                            );
                          })
                          .catch(() => {});
                      }}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <DataTable
                      bordered
                      data={leaveDeductionData || []}
                      loading={false}
                      header={headerLeaveDeduction}
                    />
                  </Col>
                </Row>
              </PCardBody>
            </PCard>
          </div>
        )}
        {params?.type === "view" && leaveDeductionData?.length > 0 && (
          <>
            <center>
              <h1>Leave Deduction Sequence</h1>
            </center>
            <DataTable
              bordered
              data={leaveDeductionData || []}
              loading={false}
              header={headerLeaveDeduction}
            />
          </>
        )}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default CreateEditEarlyLeavePunishmentConfig;
