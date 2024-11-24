import {
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
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
// import { requisitionStatus } from "./helper";
import { trainingModeFixDDL, trainingStatusFixDDL } from "./helper";
import { PModal } from "Components/Modal";
import TrainingType from "../masterData/trainingType";

const TnDPlanningCreateEdit = () => {
  interface LocationState {
    data?: any;
  }

  const location = useLocation<LocationState>();
  const history = useHistory();
  const data = location?.state?.data;

  const [loading, setLoading] = useState(false);
  const [openTraingTypeModal, setOpenTraingTypeModal] = useState(false);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;

  const getBUnitDDL = useApiRequest({});
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

  const [form] = Form.useForm();
  const params = useParams<{ type: string }>();
  const { type } = params;
  //   api calls
  const CommonEmployeeDDL = useApiRequest([]);
  const [trainingTypeDDL, getTrainingTypeDDL, loadingTrainingType] =
    useAxiosGet();

  const [upcommi, setUpcommi] = useState(false);

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

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
    getBUnitDDL.action({
      urlKey: "BusinessUnitWithRoleExtension",
      method: "GET",
      params: {
        workplaceGroupId: wgId,
        businessUnitId: buId,
        empId: employeeId || 0,
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
    getWorkplaceGroup();
    getTrainingTypeDDL("/trainingType");
  }, [profileData?.buId, profileData?.wgId]);

  return (
    <div>
      {loading || (loadingTrainingType && <Loading />)}
      <PForm
        form={form}
        initialValues={{ reasonForRequisition: data?.requestor }}
      >
        <PCard>
          <PCardHeader
            backButton
            title={`Training Plan ${type === "create" ? "Create" : "Edit"}`}
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
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={
                    getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []
                  }
                  name="bUnit"
                  label="Business Unit"
                  showSearch
                  filterOption={true}
                  placeholder="Business Unit"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      bUnit: op,
                    });
                  }}
                  rules={[{ required: true, message: "District is required" }]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={[
                    { required: true, message: "Workplace Group is required" },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  // disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    //   getDesignation();
                  }}
                  rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              {/* <Col md={6} sm={24}>
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
              </Col> */}
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingTypeDDL || []}
                  name="trainingType"
                  label={
                    <>
                      Training Type{" "}
                      <PlusCircleOutlined
                        onClick={() => {
                          setOpenTraingTypeModal(true);
                        }}
                        style={{
                          color: "green",
                          fontSize: "15px",
                          cursor: "pointer",
                          margin: "0 5px",
                        }}
                      />
                    </>
                  }
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
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingTypeDDL || []}
                  name="trainingTitle"
                  label="Training Title"
                  placeholder="Training Title"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingTitle: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Title is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingModeFixDDL || []}
                  name="trainingMode"
                  label="Training Mode"
                  placeholder="Training Mode"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingMode: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Mode is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingModeFixDDL || []} // need to change
                  name="trainingOrganizer"
                  label="Training Organizer"
                  placeholder="Training Organizer"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingOrganizer: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Organizer is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingStatusFixDDL || []}
                  name="requisitionStatus"
                  disabled={type === "view"}
                  label="Requisition Status"
                  placeholder="Requisition Status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      requisitionStatus: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Requisition Status is required",
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
      {/* Training Type Modal */}
      <PModal
        open={openTraingTypeModal}
        title={"Training Type"}
        width="400"
        onCancel={() => {
          setOpenTraingTypeModal(false);
        }}
        maskClosable={false}
        components={
          <>
            <TrainingType setOpenTraingTypeModal={setOpenTraingTypeModal} />
          </>
        }
      />
    </div>
  );
};

export default TnDPlanningCreateEdit;
