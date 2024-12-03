import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Row } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { requisitionStatus } from "./helper";

const TnDRequisitionCreateEdit = () => {
  interface LocationState {
    data?: any;
  }

  const location = useLocation<LocationState>();
  const history = useHistory();
  const data = location?.state?.data;

  const [loading, setLoading] = useState(false);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

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
    getTrainingTypeDDL("/TrainingType/Training/Type", (data: any) => {
      const list: any = [];
      data?.map((d: any) => {
        if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
      });
      setTrainingType(list);
    });
  }, [profileData?.buId, profileData?.wgId]);

  return (
    <div>
      {(loading || loadingTrainingType) && <Loading />}
      <PForm
        form={form}
        initialValues={{ reasonForRequisition: data?.requestor }}
      >
        <PCard>
          <PCardHeader
            backButton
            title={`Requisition ${type === "create" ? "Create" : "Edit"}`}
            buttonList={
              type === "view"
                ? [] // No buttons for "status" type
                : [
                    {
                      type: "primary",
                      content: `${type === "create" ? "Save" : "Edit"}`,
                      icon:
                        type === "create" ? <SaveOutlined /> : <EditOutlined />,
                      onClick: () => {
                        const values = form.getFieldsValue(true);

                        form
                          .validateFields()
                          .then(() => {
                            console.log(values);
                          })
                          .catch(() => {
                            console.log("error");
                          });
                      },
                    },
                  ]
            }
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  disabled={type === "view" || type === "status"}
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
              <Col md={6} sm={24}>
                <PSelect
                  disabled={type === "view" || type === "status"}
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
                  disabled={type === "view" || type === "status"}
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
                  disabled={type === "view" || type === "status"}
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
                  disabled={type === "view" || type === "status"}
                  type="text"
                  placeholder="Remarks"
                  label="Remarks"
                  name="remarks"
                />
              </Col>
              {(type === "view" || type === "status") && (
                <Col md={6} sm={24}>
                  <PSelect
                    options={requisitionStatus}
                    name="requisitionStatus"
                    disabled={type === "view"}
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
              {(type === "view" || type === "status") && upcommi && (
                <Col md={6} sm={24}>
                  <PSelect
                    options={[]}
                    name="upcommingTraining"
                    disabled={type === "view"}
                    label="upcomming Training"
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
              {(type === "view" || type === "status") && (
                <Col md={6} sm={24}>
                  <PInput
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
  );
};

export default TnDRequisitionCreateEdit;
