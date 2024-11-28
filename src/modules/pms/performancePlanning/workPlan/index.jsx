import { Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { todayDate } from "../../../../utility/todayDate";
import ImageViewer from "./ImageViewer";
import { WorkPlanTable } from "./WorkPlanTable";
import image from "./assets/workplanImage.jpg";
import {
  addWorkPlan,
  getCoreCompetencyDDL,
  getCoreValuesDDL,
  initData,
  validationSchema,
  workPlan_landing_api,
} from "./helper";
import "./style.css";
import "./workPlanTable.css";
import DroppableActivityContainers from "./droppableActivityContainers";
import DroppableActivityListContainer from "./droppableActivityListContainer";
import TopFormSection from "./topFormSection";
import ValuesCompetenciesCard from "./valuesCompetenciesCard";
import { quarterDDL } from "../../../../utility/quaterDDL";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";

const WorkPlan = () => {
  // 30480
  const formikRef = useRef();
  // Local states
  const [planList, setPlanList] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [coreValuesDDL, setCoreValuesDDL] = useState([]);
  const [coreCompetencyDDL, setCoreCompetencyDDL] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [selectedCoreValues, setSelectedCoreValues] = useState([]);
  const [selectedCoreCompetency, setSelectedCoreCompetency] = useState([]);

  const priorities = ["Do First", "Schedule", "Delegate", "Don't Do"];
  const {
    buId,
    orgId,
    userName,
    employeeId,
    strDesignation,
    intDesignationId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const createPayload = (values) => {
    const newRow = activityList?.filter(
      (activity) => activity.priorityId !== 0
    );

    const rowList = newRow?.map((data) => {
      return {
        rowId: typeof data?.rowId !== "number" ? 0 : data.rowId,
        workPlanHeaderId: data?.workPlanHeaderId || 0,
        activity: data?.activity,
        frequencyId: data?.frequencyId || 0,
        frequency: data?.frequency || "",
        priorityId: data?.priorityId,
        priority: data?.priority,
        comments: data?.comments || "",
        isActive: true,
        actionDate: todayDate(),
        actionBy: employeeId,
      };
    });

    const valuesCompetencies = [
      ...selectedCoreValues,
      ...selectedCoreCompetency,
    ].map((data) => {
      return {
        intAutoId: data?.intAutoId || 0,
        intWorkplanHeaderId:
          planList?.workPlanHeaderId > 0 ? planList?.workPlanHeaderId : 0,
        intValueOrCompetencyId:
          data?.intCompetencyId ||
          data?.intCoreValueId ||
          data?.intValueOrCompetencyId,
        strValueOrCompetencyName: data?.label || data?.strValueOrCompetencyName,
        isCompetency:
          data?.intCompetencyId || data?.isCompetency ? true : false,
        isActive: data?.isActive !== undefined ? data?.isActive : true,
        createDate: data?.createDate || todayDate(),
        createBy: data?.createBy || employeeId,
        updateBy: employeeId,
        updateDate: todayDate(),
        comments:
          data?.intCompetencyId || data?.isCompetency
            ? values?.coreCompetencyComment
            : values?.coreValuesComment,
      };
    });

    return {
      sl: 0,
      workPlanHeaderId:
        planList?.workPlanHeaderId > 0 ? planList?.workPlanHeaderId : 0,
      employeeId: Number(employeeId),
      employeeName: userName,
      intDesignationId: Number(intDesignationId),
      businessUnitId: Number(buId),
      workplaceGroupId: 0,
      yearId: Number(values?.yearDDLgroup?.value),
      year: values?.yearDDLgroup?.label,
      quarterId: Number(values?.quarterDDLgroup?.value),
      quarter: values?.quarterDDLgroup?.label,
      isActive: true,
      actionDate: todayDate(),
      actionBy: employeeId,
      row: rowList,
      valuesCompetencies: valuesCompetencies,
    };
  };

  const getData = (payload, setFieldValue) => {
    addWorkPlan(
      payload,
      () => {
        workPlan_landing_api(
          employeeId,
          payload?.yearId,
          payload?.quarterId,
          setPlanList,
          setLoading,
          initData,
          setFieldValue
        );
      },
      setDisabled
    );
  };

  const saveHandler = (values, cb, confirm, setFieldValue) => {
    if (confirm) {
      const payload = {
        ...createPayload(values),
        isConfirm: true,
      };
      getData(payload);
    } else {
      const payload = createPayload(values);
      getData(payload, setFieldValue);
    }
  };

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var clonedElement = element.cloneNode(true);
    clonedElement.classList.add("d-block");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: {
        unit: "px",
        hotfixes: ["px_scaling"],
        orientation: "portrait",
      },
    };
    html2pdf().set(opt).from(clonedElement).save();
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    let temp = [...activityList];
    let dragged = temp.splice(source.index, 1);

    if (destination.droppableId === source.droppableId) {
      temp.splice(destination.index, 0, dragged[0]);
    } else {
      temp.splice(destination.index, 0, {
        ...dragged[0],
        priority: destination.droppableId,
        priorityId: priorities.indexOf(destination.droppableId) + 1,
      });
    }

    setActivityList(temp);
  };

  const handleDisable = () => {
    return !activityList?.some((item) => item?.priorityId !== 0);
  };

  const handleRemove = (index) => {
    let temp = [...activityList];
    temp.splice(index, 1);
    setActivityList(temp);
  };

  // Side Effects
  useEffect(() => {
    workPlan_landing_api(employeeId, 12, 1, setPlanList, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();

  useEffect(() => {
    // commonYearDDL(setLoading, setCommonDDL, buId, orgId);
    getCoreValuesDDL(setLoading, setCoreValuesDDL, buId, orgId);
    getCoreCompetencyDDL(setLoading, setCoreCompetencyDDL, buId, orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, orgId]);

  useEffect(() => {
    setActivityList(planList?.row);
    const values = planList?.valuesCompetencies?.filter(
      (value) => value?.isCompetency !== true
    );
    const competencies = planList?.valuesCompetencies?.filter(
      (value) => value?.isCompetency === true
    );

    setSelectedCoreValues(values);
    setSelectedCoreCompetency(competencies);
  }, [planList]);

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.yearDDLgroup = theYearData;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, setFieldValue, { resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
      innerRef={formikRef}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <div style={{ marginBottom: "50px" }}>
          <Form onSubmit={handleSubmit}>
            {(loading || fiscalYearDDLloader) && <Loading />}
            <TopFormSection
              setIsShowRowItemModal={setIsShowRowItemModal}
              pdfExport={pdfExport}
              saveHandler={saveHandler}
              disabled={disabled}
              handleDisable={handleDisable}
              planList={planList}
              setPlanList={setPlanList}
              userName={userName}
              employeeId={employeeId}
              strDesignation={strDesignation}
              values={values}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              commonDDL={fiscalYearDDL}
              quaterDDL={quarterDDL}
              setLoading={setLoading}
              setActivityList={setActivityList}
              initData={initData}
            />
          </Form>
          <div className="" style={{ marginBottom: "30px" }}>
            <div className="dnd-wrapper">
              <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <div className="row px-3">
                  <DroppableActivityListContainer
                    requestedActivities={activityList}
                    handleRemove={handleRemove}
                    isDraggable={planList?.isConfirm}
                  />
                  <DroppableActivityContainers
                    priorities={priorities}
                    activities={activityList}
                    handleRemove={handleRemove}
                    isDraggable={planList?.isConfirm}
                  />
                </div>
              </DragDropContext>
            </div>
          </div>
          <div className="">
            <div className="row justify-content-between mx-0">
              <ValuesCompetenciesCard
                title="Core Values"
                ddlOptions={coreValuesDDL}
                selectedValuesCompetencies={selectedCoreValues}
                setSelectedValuesCompetencies={setSelectedCoreValues}
                planList={planList}
                values={values}
                setFieldValue={setFieldValue}
              />
              <ValuesCompetenciesCard
                title="Core Competencies"
                ddlOptions={coreCompetencyDDL}
                selectedValuesCompetencies={selectedCoreCompetency}
                setSelectedValuesCompetencies={setSelectedCoreCompetency}
                planList={planList}
                values={values}
                setFieldValue={setFieldValue}
              />
            </div>
          </div>
          <div id="pdf-section" className="workplan-pdf-export d-none">
            <WorkPlanTable
              planList={planList}
              planListRow={planList?.row}
              userName={userName}
              employeeId={employeeId}
            />
          </div>
          <ImageViewer
            show={isShowRowItemModal}
            onHide={() => setIsShowRowItemModal(false)}
            title="Work Plan"
            modelSize="md"
            image={image}
          ></ImageViewer>
        </div>
      )}
    </Formik>
  );
};

export default WorkPlan;
