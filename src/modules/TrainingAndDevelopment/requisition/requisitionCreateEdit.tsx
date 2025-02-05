import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import {
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  createTrainingRequisition,
  getAdjustedDates,
  onUpdateTrainingRequisition,
} from "./helper";
import { getEnumData } from "common/api/commonApi";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const TnDRequisitionCreateEdit = () => {
  interface LocationState {
    data?: any;
  }
  const dispatch = useDispatch();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const data = location?.state?.data;
  const firstSegment = location.pathname.split("/")[1];
  const [loading, setLoading] = useState(false);
  const [reqStatusDDL, setReqStatus] = useState([]);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (firstSegment !== "SelfService" && item?.menuReferenceId === 30512) {
      permission = item;
    }
    if (firstSegment === "SelfService" && item?.menuReferenceId === 30522) {
      permission = item;
    }
  });

  const [form] = Form.useForm();
  const params = useParams<{ type: string }>();
  const { type } = params;
  //   api calls
  const CommonEmployeeDDL = useApiRequest([]);
  const [
    trainingTypeDDL,
    getTrainingTypeDDL,
    loadingTrainingType,
    setTrainingType,
  ] = useAxiosGet();

  const [
    upcommingTrainingDDL,
    getUpcommingTrainingDDL,
    loadingUpcommingTraining,
    setUpcommingTraining,
  ] = useAxiosGet();

  const [upcommi, setUpcommi] = useState(false);

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
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

  useEffect(() => {
    dispatch(
      setFirstLevelNameAction(
        firstSegment === "SelfService"
          ? "Employee Self Service"
          : "Training & Development"
      )
    );
    getTrainingTypeDDL("/TrainingType/Training/Type", (data: any) => {
      const list: any = [];
      data?.map((d: any) => {
        if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
      });
      setTrainingType(list);
    });
    const { fromDate, toDate } = getAdjustedDates();
    getUpcommingTrainingDDL(
      `/TrainingRequisition/Training/TrainingRequisition/UpComming?status=0,1&fromDate=${fromDate}&toDate=${toDate}`
    );
    getEnumData("RequisitionStatus", setReqStatus);
    if (type === "edit" && data?.status?.value == 1) {
      setUpcommi(true);
    }
  }, [profileData?.buId, profileData?.wgId]);

  return permission?.isCreate ? (
    <div>
      {(loading || loadingTrainingType) && <Loading />}
      <PForm
        form={form}
        initialValues={
          type === "create"
            ? {
                employee: {
                  label: null,
                  value:
                    firstSegment === "SelfService"
                      ? profileData?.intEmployeeId
                      : null,
                },
              }
            : {
                reqId: data?.id,
                reasonForRequisition: data?.reasonForRequisition,
                employee: {
                  label: data?.employmentName,
                  value: data?.employmentTypeId,
                },
                trainingType: {
                  label: data?.trainingTypeName,
                  value: data?.trainingTypeId,
                },
                objectivesToAchieve: data?.objectivesToAchieve,
                remarks: data?.remarks,
                requisitionStatus: {
                  label: data?.status?.label,
                  value: data?.status?.value,
                },
                upcommingTraining: {
                  label: data?.upcommingTraining?.label,
                  value: data?.upcommingTraining?.value,
                },
                comments: data?.comments,
              }
        }
      >
        <PCard>
          <PCardHeader
            backButton
            title={`Requisition ${type}`}
            buttonList={
              type === "view"
                ? [] // No buttons for "status" type
                : [
                    {
                      type: "primary",
                      content: type,
                      icon:
                        type === "create" ? <SaveOutlined /> : <EditOutlined />,
                      onClick: () => {
                        // const values = form.getFieldsValue(true);

                        form
                          .validateFields()
                          .then(() => {
                            type === "create"
                              ? createTrainingRequisition(
                                  form,
                                  profileData,
                                  setLoading,
                                  () => {
                                    form.resetFields();
                                  }
                                  // setOpenTraingTypeModal
                                )
                              : onUpdateTrainingRequisition(
                                  form,
                                  profileData,
                                  setLoading,
                                  () => {
                                    form.resetFields();
                                    history.goBack();
                                  }
                                  // setOpenTraingTypeModal
                                );
                          })
                          .catch(() => {});
                      },
                    },
                  ]
            }
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              {firstSegment !== "SelfService" && (
                <Col md={6} sm={24}>
                  <PSelect
                    name="employee"
                    label="Employee"
                    placeholder="Search Min 2 char"
                    options={CommonEmployeeDDL?.data || []}
                    loading={CommonEmployeeDDL?.loading}
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        employee: op,
                      });
                    }}
                    onSearch={(value) => {
                      getEmployee(value);
                    }}
                    showSearch
                    filterOption={false}
                    allowClear={true}
                    rules={[
                      {
                        required: true,
                        message: "Employee is required",
                      },
                    ]}
                  />
                </Col>
              )}

              <Col md={6} sm={24}>
                <PSelect
                  options={trainingTypeDDL || []}
                  name="trainingType"
                  label="Training Type"
                  placeholder="Training Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingType: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Reason For Requisition"
                  label="Reason For Requisition"
                  name="reasonForRequisition"
                  rules={[
                    {
                      required: true,
                      message: "Reason For Requisition is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Objectives to Achieve"
                  label="Objectives to Achieve"
                  name="objectivesToAchieve"
                  rules={[
                    {
                      required: true,
                      message: "Objectives to Achieve is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Remarks"
                  label="Remarks"
                  name="remarks"
                />
              </Col>
              {type === "edit" && (
                <Col md={6} sm={24}>
                  <PSelect
                    options={reqStatusDDL || []}
                    name="requisitionStatus"
                    disabled={
                      firstSegment === "SelfService" && data?.status?.value == 1
                    }
                    label="Requisition Status"
                    placeholder="Requisition Status"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        requisitionStatus: op,
                      });
                      if (!Array.isArray(op) && op?.label === "Assigned") {
                        setUpcommi(true);
                      } else {
                        setUpcommi(false);
                      }
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Requisition Status is required",
                      },
                    ]}
                  />
                </Col>
              )}
              {type === "edit" && upcommi && (
                <Col md={6} sm={24}>
                  <PSelect
                    disabled={
                      firstSegment === "SelfService" && data?.status?.value == 1
                    }
                    options={upcommingTrainingDDL || []}
                    name="upcommingTraining"
                    label="Upcomming Training"
                    placeholder="upcomming Training"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        upcommingTraining: op,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Upcomming Training is required",
                      },
                    ]}
                  />
                </Col>
              )}
              {type === "edit" && (
                <Col md={6} sm={24}>
                  <PInput
                    disabled={
                      firstSegment === "SelfService" && data?.status?.value == 1
                    }
                    type="text"
                    placeholder="Comments"
                    label="Comments"
                    name="comments"
                  />
                </Col>
              )}
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TnDRequisitionCreateEdit;
