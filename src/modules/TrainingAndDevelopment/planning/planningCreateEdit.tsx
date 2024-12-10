import {
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Col, Form, FormInstance, Row, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  Flex,
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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
// import { requisitionStatus } from "./helper";
import { trainingModeFixDDL, trainingStatusFixDDL } from "./helper";
import { PModal } from "Components/Modal";
import TrainingType from "../masterData/trainingType";
import TrainingTitle from "../masterData/trainingTitle";
import moment from "moment";
import { setTrainingDuration } from "./helper";
import { Delete } from "@mui/icons-material";
import ListOfCost from "./listOfCost";
import ListOfPerticipants from "./listOfPerticipants";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

const TnDPlanningCreateEdit = () => {
  interface LocationState {
    data?: any;
  }

  const location = useLocation<LocationState>();
  const history = useHistory();
  const dispatch = useDispatch();

  const data = location?.state?.data;

  const [loading, setLoading] = useState(false);
  const [openTraingTypeModal, setOpenTraingTypeModal] = useState(false);
  const [openTrainingTitleModal, setOpenTrainingTitleModal] = useState(false);
  const [costField, setCostField] = useState<any>([]);
  const [perticipantField, setperticipantField] = useState<any>([]);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  let permission = null;

  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

  const { buId, wgId, employeeId, orgId } = profileData;

  const getBUnitDDL = useApiRequest({});
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);

  const [nameOfTrainerOrgDDL, getNameOfTrainerOrgDDL] = useAxiosGet();
  const [costTypeDDL, getCostTypeDDL] = useAxiosGet();

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
    trainingTitleDDL,
    getTrainingTitleDDL,
    loadingTrainingTitle,
    setTrainingTitle,
  ] = useAxiosGet();

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

  // workplace wise
  const getEmployeDepartment = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };

  const getEmployeePosition = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
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
    dispatch(setFirstLevelNameAction("Training & Development"));
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
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getTrainingTitleDDL("/TrainingTitle/Training/Title", typeDataSetForTitle);
    getNameOfTrainerOrgDDL("/trainingType");
  }, [profileData?.buId, profileData?.wgId]);

  const typeDataSetForType = (data: any) => {
    let list: any[] = [];
    data?.map((item: any) => {
      list.push({
        label: item?.strName,
        value: item?.intId,
      });
    });
    setTrainingType(list);
  };

  const typeDataSetForTitle = (data: any) => {
    let list: any[] = [];
    data?.map((item: any) => {
      list.push({
        label: item?.strName,
        value: item?.intId,
      });
    });
    setTrainingTitle(list);
  };

  const addHandler = (values: any) => {
    if (!values?.costValue) {
      toast.error("Cost Value is required");
      return;
    }
    const nextId =
      costField.length > 0 ? costField[costField.length - 1].id + 1 : 1;
    setCostField([...costField, { id: nextId, ...values }]);
  };

  const addHanderForPerticipant = (values: any) => {
    if (!values?.employee) {
      toast.error("Employee is required");
      return;
    }
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    console.log(workplaceGroup, workplace);
    const nextId =
      perticipantField.length > 0
        ? perticipantField[perticipantField.length - 1].id + 1
        : 1;
    setperticipantField([
      ...perticipantField,
      {
        id: nextId,
        perticipant: `${values?.employee?.label} - ${values?.employee?.value}`,
        department: values?.department?.label,
        hrPosition: values?.hrPosition?.label,
        workplaceGroup: workplaceGroup?.label,
        workplace: workplace?.label,
      },
    ]);
  };

  const calculatePerPersonCost = () => {
    let totalCost = 0;
    costField.forEach((item: any) => {
      totalCost += +item.costValue;
    });
    const perPersonCost = parseFloat(
      (totalCost / perticipantField.length)?.toFixed(2)
    );
    form.setFieldsValue({
      perPersonCost: perPersonCost,
      totalCost: totalCost,
    });
    return perPersonCost;
  };

  console.log(perticipantField);

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
                            console.log(values);

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
                    getEmployeDepartment();
                    getEmployeePosition();

                    //   getDesignation();
                  }}
                  //   rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>

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
                  options={trainingTitleDDL || []}
                  name="trainingTitle"
                  label={
                    <>
                      Training Title{" "}
                      <PlusCircleOutlined
                        onClick={() => {
                          setOpenTrainingTitleModal(true);
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
                  name="trainingStatus"
                  label="Training Status"
                  placeholder="Training Status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingStatus: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Status is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Objectives/ Key Learnings/ Outcomes"
                  label="Objectives/ Key Learnings/ Outcomes"
                  name="objectives"
                  rules={[
                    {
                      required: true,
                      message:
                        "Objectives/ Key Learnings/ Outcomes is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Vanue"
                  label="Training Vanue"
                  name="trainingVanue"
                  rules={[
                    {
                      required: true,
                      message: "Training Vanue is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="date"
                  name="trainingStartDate"
                  label="Training Start Date"
                  placeholder="Training Start Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      trainingStartDate: value,
                    });
                    setTrainingDuration(form);
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Start Date is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="time"
                  name="trainingStartTime"
                  label="Training Start Time"
                  placeholder="Training Start Time"
                  onChange={(value) => {
                    console.log(value);
                    form.setFieldsValue({
                      trainingStartTime: value,
                    });
                    setTrainingDuration(form);
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Start Time is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="date"
                  name="trainingEndDate"
                  label="Training End Date"
                  placeholder="Training End Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      trainingEndDate: value,
                    });
                    setTrainingDuration(form);
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training End Date is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="time"
                  name="trainingEndTime"
                  label="Training End Time"
                  placeholder="Training End Time"
                  onChange={(value) => {
                    form.setFieldsValue({
                      trainingEndTime: value,
                    });
                    setTrainingDuration(form);
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training End Time is required",
                    },
                  ]}
                />
              </Col>

              <Col md={6} sm={24}>
                <PInput
                  disabled={true}
                  type="text"
                  placeholder="Training Duration"
                  label="Training Duration"
                  name="trainingDuration"
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={nameOfTrainerOrgDDL || []} // need to change
                  name="nameofTrainerOrganization"
                  label="Name of Trainer & Organization"
                  placeholder="Name of Trainer & Organization"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      nameofTrainerOrganization: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Name of Trainer & Organization is required",
                    },
                  ]}
                />
              </Col>
            </Row>

            <ListOfCost
              form={form}
              costField={costField}
              setCostField={setCostField}
              addHandler={addHandler}
            />
            <ListOfPerticipants
              form={form}
              perticipantField={perticipantField}
              setperticipantField={setperticipantField}
              addHandler={addHanderForPerticipant}
              calculatePerPersonCost={calculatePerPersonCost}
              departmentDDL={empDepartmentDDL?.data || []}
              positionDDL={positionDDL?.data || []}
            />
          </PCardBody>
        </PCard>
      </PForm>
      {/* Training Type Modal */}
      <PModal
        open={openTraingTypeModal}
        title={"Training Type"}
        width="350"
        onCancel={() => {
          setOpenTraingTypeModal(false);
          getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
        }}
        maskClosable={false}
        components={
          <>
            <TrainingType
            // setOpenTraingTypeModal={setOpenTraingTypeModal}
            />
          </>
        }
      />

      {/* Training Title Modal */}
      <PModal
        open={openTrainingTitleModal}
        title={"Training Title"}
        width="400"
        onCancel={() => {
          setOpenTrainingTitleModal(false);
          getTrainingTitleDDL(
            "/TrainingTitle/Training/Title",
            typeDataSetForTitle
          );
        }}
        maskClosable={false}
        components={
          <>
            <TrainingTitle
            // setOpenTrainingTitleModal={setOpenTrainingTitleModal}
            />
          </>
        }
      />
    </div>
  );
};

export default TnDPlanningCreateEdit;
