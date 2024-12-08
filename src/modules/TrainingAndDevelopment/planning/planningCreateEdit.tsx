import {
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
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
// import { requisitionStatus } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PModal } from "Components/Modal";
import { toast } from "react-toastify";
import TrainingTitle from "../masterData/trainingTitle";
import TrainingType from "../masterData/trainingType";
import {
  setTrainingDuration,
  stepOneValidation,
  trainingModeFixDDL,
  trainingStatusFixDDL,
} from "./helper";
import ListOfCost from "./listOfCost";
import ListOfPerticipants from "./listOfPerticipants";
import TrainerAndOrgInfo from "./trainerAndOrgInfo";
import PlanningInfo from "./planningInfo";
import { getEnumData } from "common/api/commonApi";

const cardMargin = { marginBottom: "15px" };

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
  const [trainerOrgField, setTrainerOrgField] = useState<any>([]);
  const [perticipantField, setperticipantField] = useState<any>([]);

  const [planStep, setPlanStep] = useState<string>("");

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

  const [
    nameOfTrainerOrgDDL,
    getNameOfTrainerOrgDDL,
    loadingTrainerOrg,
    setNameOfTrainerOrg,
  ] = useAxiosGet();

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
    setPlanStep("STEP_ONE");
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
    getNameOfTrainerOrgDDL(
      "/TrainerInformation/Training/TrainerInformation",
      typeDataSetForTrainerOrg
    );
  }, [profileData?.buId, profileData?.wgId]);

  const typeDataSetForTrainerOrg = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true)
        list.push({
          label: `${d?.name} - ${d?.organization}`,
          value: d?.id,
          ...d,
        });
    });
    setNameOfTrainerOrg(list);
  };

  const typeDataSetForType = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    setTrainingType(list);
  };

  const typeDataSetForTitle = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
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
    setCostField([
      ...costField,
      {
        id: nextId,
        costTypeId: values?.costType?.value,
        costType: values?.costType?.label,
        costValue: values?.costValue,
      },
    ]);
  };

  const addHandlerTrinerOrg = (values: any) => {
    if (!values?.nameofTrainerOrganization) {
      toast.error("Trainer is required");
      return;
    }
    setTrainerOrgField([
      ...trainerOrgField,
      { ...values?.nameofTrainerOrganization },
    ]);
  };

  const addHanderForPerticipant = (values: any) => {
    if (!values?.employee) {
      toast.error("Employee is required");
      return;
    }
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

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

  const buttonContent = () => {
    if (planStep === "STEP_ONE") return "Next Step";
    if (planStep === "STEP_TWO") return "Save";

    if (type === "create") return "Save";
    if (type === "edit") return "Edit";
    if (type === "view") return "View";
  };

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
                : planStep === "STEP_TWO"
                ? [
                    {
                      type: "primary",
                      content: "Save and Finish",
                      icon:
                        type === "create" ? <SaveOutlined /> : <EditOutlined />,
                      onClick: () => {
                        const values = form.getFieldsValue(true);

                        form
                          .validateFields(stepOneValidation)
                          .then(() => {
                            console.log(costField, "costField");
                            console.log(perticipantField, "perticipantField");
                          })
                          .catch(() => {});
                      },
                    },
                  ]
                : [
                    {
                      type: "primary",
                      content: "Save & Close",
                      icon:
                        type === "create" ? <SaveOutlined /> : <EditOutlined />,
                      onClick: () => {
                        const values = form.getFieldsValue(true);

                        form
                          .validateFields(stepOneValidation)
                          .then(() => {
                            console.log(values, "training plan");

                            console.log(trainerOrgField, "trainerOrgField");
                            console.log(costField, "costField");
                            console.log(perticipantField, "perticipantField");
                            // redirect to planning landing
                          })
                          .catch(() => {});
                      },
                    },
                    {
                      type: "primary",
                      content: buttonContent() || "",
                      icon:
                        type === "create" ? (
                          <StepForwardOutlined />
                        ) : (
                          <EditOutlined />
                        ),
                      onClick: () => {
                        const values = form.getFieldsValue(true);

                        form
                          .validateFields(stepOneValidation)
                          .then(() => {
                            setTimeout(() => {
                              setPlanStep("STEP_TWO");
                            }, 500);
                          })
                          .catch(() => {});
                      },
                    },
                  ]
            }
          />
          {planStep === "STEP_ONE" && (
            <>
              <PCardBody styles={cardMargin}>
                {/* Planning Info */}
                <PlanningInfo
                  form={form}
                  getBUnitDDL={getBUnitDDL}
                  workplaceGroup={workplaceGroup}
                  getWorkplace={getWorkplace}
                  workplace={workplace}
                  getEmployeDepartment={getEmployeDepartment}
                  getEmployeePosition={getEmployeePosition}
                  setTrainingDuration={setTrainingDuration}
                  trainingTypeDDL={trainingTypeDDL}
                  setOpenTraingTypeModal={setOpenTraingTypeModal}
                  trainingTitleDDL={trainingTitleDDL}
                  setOpenTrainingTitleModal={setOpenTrainingTitleModal}
                />
              </PCardBody>
              <PCardBody styles={cardMargin}>
                {/* Trainer and Org */}
                <TrainerAndOrgInfo
                  form={form}
                  trainerOrgField={trainerOrgField}
                  setTrainerOrgField={setTrainerOrgField}
                  nameOfTrainerOrgDDL={nameOfTrainerOrgDDL}
                  addHandler={addHandlerTrinerOrg}
                />
              </PCardBody>
            </>
          )}
          {planStep === "STEP_TWO" && (
            <>
              <PCardBody styles={cardMargin}>
                <ListOfCost
                  form={form}
                  costField={costField}
                  setCostField={setCostField}
                  addHandler={addHandler}
                />
              </PCardBody>
              <PCardBody styles={cardMargin}>
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
            </>
          )}
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
