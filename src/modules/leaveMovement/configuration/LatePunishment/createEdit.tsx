import { Checkbox, Col, DatePicker, Form, Row, Tooltip } from "antd";
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
import {
  useHistory,
  useParams,
  useParams as UseParams,
} from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import CommonForm from "modules/pms/CommonForm/commonForm";
import {
  addHandler,
  addLeaveDeductions,
  createEditLatePunishmentConfig,
} from "./helper";
import { getPeopleDeskAllDDL } from "common/api";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { DataState, LatePunishmentData, LeaveDeductionDataState } from "./type";
import RangeDatePicker from "./RangeDatePicker";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { DeleteOutlined } from "@mui/icons-material";
import View from "./view";
import { toast } from "react-toastify";
import { LatePunishment } from "./form";

const CreateEditLatePunishmentConfig = () => {
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
    singleLatePunPolicy,
    getSingleLatePunPolicy,
    singleLatePunPolicyLoader,
    setSingleLatePunPolicy,
  ] = useAxiosGet();
  const params = useParams<{ type?: string; id?: string }>() as {
    type?: string;
    id?: string;
  };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    document.title = "Late Punishment";
    () => {
      document.title = "PeopleDesk";
    };
    // have a need new useEffect to set the title
    if (params?.type === "extend" || params?.type === "view") {
      getSingleLatePunPolicy(
        `/LatePunishmentpolicy/${params?.id}`,
        (data: any) => {
          // Populate the form with the fetched data
          // form.setFieldsValue({
          //   lateCalculationType: data?.name,
          // });

          setData(data?.elements || []); // need to modify
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
      title: "Late Calculation Type",
      dataIndex: "lateCalculationTypeDescription",
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
    },
    {
      title: "Consecutive Day?",
      dataIndex: "isConsecutiveDay",
      render: (rec: any) => {
        return rec ? "Yes" : "No";
      },
    },
    {
      title: "Late Time (Min)",
      dataIndex: "lateTimeMinutes",
      render: (value: any, rec: any) => {
        return (
          rec?.minimumLateTime + " to " + rec?.maximumLateTime + " Minutes"
        );
      },
    },
    {
      title: "Late Time Calculated by",
      dataIndex: "lateTimeCalculatedBy",
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
  ];

  const CustomCheckbox = () => {
    return (
      // <Col md={6} sm={24} style={{ marginTop: "15px" }}>
      <Form.Item
        name="isConsecutiveDay"
        valuePropName="checked"
        style={{ marginLeft: "15px", marginTop: "15px" }}
      >
        <Checkbox>Is Consecutive Day?</Checkbox>
      </Form.Item>
      // </Col>
    );
  };

  const isDeductionSeqShow = (): boolean => {
    return (
      data?.length > 0 && data.some((item) => Number(item.punishmentType) === 1)
    );
  };

  const lateCalculationType = Form.useWatch("lateCalculationType", form);
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
            title={`Late Punishment Configuration`}
            buttonList={
              params?.type !== "view"
                ? [
                    {
                      type: "primary",
                      content: "Save",
                      // icon:
                      //   type === "create" ? <SaveOutlined /> : <EditOutlined />,
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
                            createEditLatePunishmentConfig(
                              profileData,
                              form,
                              data,
                              leaveDeductionData,
                              setLoading,
                              () => {
                                history.push(
                                  "/administration/latePunishmentPolicy"
                                );
                              }
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
              {" "}
              <CommonForm
                formConfig={LatePunishment(
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
                    lateCalculationType,
                    punishmentType,
                    leaveDeductType,
                    amountDeductFrom,
                  },
                  form
                )}
                form={form}
              >
                {/* Add appropriate children here */}
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
              <View data={singleLatePunPolicy} />
            </PCardBody>
          )}
        </PCard>
        {data?.length > 0 && (
          <DataTable
            bordered
            data={data || []}
            // scroll={{ x: 1500 }}
            loading={false}
            header={header}
          />
        )}

        {isDeductionSeqShow() && (
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

export default CreateEditLatePunishmentConfig;
