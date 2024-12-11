import {
  EditOutlined,
  SaveOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PCard, PCardBody, PCardHeader, PForm } from "Components";
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
  addHandlerTriningTimes,
  changeTrainingStatus,
  costMap,
  createTrainingPlan,
  createTrainingPlanDetails,
  editTrainingPlan,
  editTrainingPlanDetails,
  perticipantMap,
  setTrainingDuration,
  stepOneValidation,
  trainerMap,
  ViewTrainingPlan,
} from "./helper";
import ListOfCost from "./listOfCost";
import ListOfPerticipants from "./listOfPerticipants";
import PlanningInfo from "./planningInfo";
import TrainerAndOrgInfo from "./trainerAndOrgInfo";
import moment from "moment";
import { id } from "date-fns/locale";

const cardMargin = { marginBottom: "15px" };

const TnDPlanningCreateEdit = () => {
  interface LocationState {
    data?: any;
    dataDetails?: any;
    onlyPerticipant?: boolean;
  }
  const [form] = Form.useForm();
  const params = useParams<{ type: string }>();
  const { type } = params;

  const location = useLocation<LocationState>();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    data = {},
    dataDetails = {},
    onlyPerticipant,
  } = location?.state || {};

  const [loading, setLoading] = useState(false);
  const [openTraingTypeModal, setOpenTraingTypeModal] = useState(false);
  const [openTrainingTitleModal, setOpenTrainingTitleModal] = useState(false);
  const [costField, setCostField] = useState<any>(
    type === "edit" ? costMap(dataDetails?.trainingCostDto) : []
  );
  const [trainerOrgField, setTrainerOrgField] = useState<any>(
    type === "edit" ? trainerMap(dataDetails?.trainingTrainerDto) : []
  );
  const [perticipantField, setperticipantField] = useState<any>(
    type === "edit"
      ? perticipantMap(dataDetails?.trainingParticipantDto, data)
      : []
  );
  const [trainingTime, setTrainingTime] = useState<any>(
    type === "edit" ? dataDetails?.trainingTimeDto : []
  );
  const [planId, setPlanId] = useState<number>();

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
    if (type === "edit") {
      setTrainingDuration(form);
      getWorkplace();
      getEmployeDepartment();
      getEmployeePosition();
    }
    if (onlyPerticipant) {
      setPlanStep("STEP_TWO");
    }
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

  const addHandlerTriningTime = (values: any) => {
    if (
      !values?.trainingStartTime ||
      !values?.trainingEndTime ||
      !values?.trainingStartDate
    ) {
      toast.error("Training date and Time is required");
      return;
    }
    console.log(values, "values");
    console.log(trainingTime, "trainingTime");
    const nextId =
      trainingTime.length > 0
        ? trainingTime[trainingTime.length - 1].id + 1
        : 1;
    const newTrainingTime = [
      ...trainingTime,
      {
        id: nextId,
        trainingStartTime: moment(values?.trainingStartTime).format(
          "hh:mm:ss A"
        ),
        trainingEndTime: moment(values?.trainingEndTime).format("hh:mm:ss A"),
        trainingStartDate: moment(values?.trainingStartDate).format(
          "YYYY-MM-DD"
        ),
        trainingDuration: values?.trainingDuration,
      },
    ];

    newTrainingTime.sort((a, b) => {
      const dateA = moment(a.trainingStartDate).format("YYYY-MM-DD");
      const dateB = moment(b.trainingStartDate).format("YYYY-MM-DD");
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      const startTimeA = moment(a.trainingStartTime, "hh:mm:ss A").format(
        "HH:mm:ss"
      );
      const startTimeB = moment(b.trainingStartTime, "hh:mm:ss A").format(
        "HH:mm:ss"
      );
      if (startTimeA < startTimeB) return -1;
      if (startTimeA > startTimeB) return 1;

      const endTimeA = moment(a.trainingEndTime, "hh:mm:ss A").format(
        "HH:mm:ss"
      );
      const endTimeB = moment(b.trainingEndTime, "hh:mm:ss A").format(
        "HH:mm:ss"
      );
      if (endTimeA < endTimeB) return -1;
      if (endTimeA > endTimeB) return 1;

      return 0;
    });
    changeTrainingStatus(form, newTrainingTime);
    setTrainingTime(newTrainingTime);
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
        perticipantId: values?.employee?.value,
        department: values?.department?.label,
        departmentId: values?.department?.value,
        hrPosition: values?.hrPosition?.label,
        hrPositionId: values?.hrPosition?.value,
        workplaceGroup: workplaceGroup?.label,
        workplaceGroupId: workplaceGroup?.value,
        workplace: workplace?.label,
        workplaceId: workplace?.value,
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
    return perPersonCost ? perPersonCost : 0;
  };

  const buttonContent = () => {
    if (planStep === "STEP_ONE") return "Next Step";
    if (planStep === "STEP_TWO") return "Save";

    if (type === "create") return "Save";
    if (type === "edit") return "Edit";
    if (type === "view") return "View";
  };
  console.log(data, "data");
  console.log(dataDetails, "dataDetails");
  return (
    <div>
      {(loading || loadingTrainingType) && <Loading />}
      <PForm
        form={form}
        initialValues={
          type === "edit"
            ? {
                idx: data?.id,
                bUnit: {
                  value: data?.businessUnitId,
                  label: data?.businessUnitName,
                },
                workplaceGroup: {
                  value: data?.workplaceGroupId,
                  label: data?.workplaceGroupName,
                },
                workplace: {
                  value: data?.workplaceId,
                  label: data?.workplaceName,
                },
                trainingType: {
                  value: data?.trainingTypeId,
                  label: data?.trainingTypeName,
                },
                trainingTitle: {
                  value: data?.trainingTitleId,
                  label: data?.trainingTitleName,
                },
                trainingMode: {
                  value: data?.trainingModeStatus?.value,
                  label: data?.trainingModeStatus?.label,
                },
                trainingOrganizer: {
                  value: data?.trainingOrganizerType?.value,
                  label: data?.trainingOrganizerType?.label,
                },
                trainingStatus: {
                  value: data?.status?.value,
                  label: data?.status?.label,
                },
                objectives: data?.objectives,
                trainingVanue: data?.venueAddress,
                trainingStartDate: data?.startDate
                  ? moment(data?.startDate)
                  : "",
                trainingStartTime: data?.startTime
                  ? moment(data?.startTime, "HH:mm:ss A")
                  : "",
                trainingEndDate: data?.endDate ? moment(data?.endDate) : "",
                trainingEndTime: data?.endTime
                  ? moment(data?.endTime, "HH:mm:ss A")
                  : "",
              }
            : {}
        }
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
                            if (!planId) {
                              toast.error("Plan Creation is required");
                              return;
                            }
                            type === "edit"
                              ? editTrainingPlanDetails(
                                  planId,
                                  trainerOrgField,
                                  costField,
                                  perticipantField,
                                  setLoading,
                                  () => {
                                    history.goBack();
                                  }
                                )
                              : createTrainingPlanDetails(
                                  planId,
                                  trainerOrgField,
                                  costField,
                                  perticipantField,
                                  setLoading,
                                  () => {
                                    history.goBack();
                                  }
                                );
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
                      content:
                        type === "edit" ? "Edit & Close" : "Save & Close",
                      icon:
                        type === "create" ? <SaveOutlined /> : <EditOutlined />,
                      onClick: () => {
                        const values = form.getFieldsValue(true);

                        form
                          .validateFields(stepOneValidation)
                          .then(() => {
                            type === "edit"
                              ? editTrainingPlan(
                                  form,
                                  profileData,
                                  setLoading,
                                  () => {
                                    if (onlyPerticipant) {
                                      ViewTrainingPlan(
                                        data?.id,
                                        setLoading,
                                        (d: any) => {
                                          history.push(
                                            "/trainingAndDevelopment/training/attendance",
                                            {
                                              data: d,
                                            }
                                          );
                                        }
                                      );
                                    } else {
                                      history.goBack();
                                    }

                                    // HISTORY BACK
                                  }
                                )
                              : createTrainingPlan(
                                  form,
                                  profileData,
                                  setLoading,
                                  () => {
                                    history.goBack();
                                    // HISTORY BACK
                                  }
                                );
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
                            type === "edit"
                              ? editTrainingPlan(
                                  form,
                                  profileData,
                                  setLoading,
                                  (data: {
                                    message: string;
                                    statusCode: number;
                                    autoId: number;
                                    user: any;
                                  }) => {
                                    setPlanId(data?.autoId);
                                    setPlanStep("STEP_TWO");
                                  }
                                )
                              : createTrainingPlan(
                                  form,
                                  profileData,
                                  setLoading,
                                  (data: {
                                    message: string;
                                    statusCode: number;
                                    autoId: number;
                                    user: any;
                                  }) => {
                                    setPlanId(data?.autoId);
                                    setPlanStep("STEP_TWO");
                                  }
                                );
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
                  // Multiple Training Time
                  trainingTime={trainingTime}
                  setTrainingTime={setTrainingTime}
                  addHandler={addHandlerTriningTime}
                />
              </PCardBody>
            </>
          )}
          {planStep === "STEP_TWO" && !onlyPerticipant && (
            <>
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
          {onlyPerticipant && (
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
