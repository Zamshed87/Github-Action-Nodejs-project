import { DownloadOutlined } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import ImageViewer from "./ImageViewer";
import { WorkPlanTable } from "./WorkPlanTable";
import image from "./assets/workplanImage.jpg";
import {
  addWorkPlan,
  commonYearDDL,
  quaterDDL,
  workPlan_landing_api,
} from "./helper";
import "./style.css";
import "./workPlanTable.css";
import DroppableActivityContainers from "./droppableActivityContainers";
import DroppableActivityListContainer from "./droppableActivityListContainer";

const initData = {
  activity: "",
  frequencyDDL: {
    label: "Daily",
    value: 1,
  },
  priorityDDL: {
    label: "Do First (1)",
    value: 1,
    name: "Do First",
  },
  quarterDDLgroup: {
    label: "Q1",
    value: 1,
  },
  yearDDLgroup: {
    label: "2021-2022",
    value: 12,
  },
  priorityActivityList: [],
};

const validationSchema = Yup.object().shape({
  quarterDDLgroup: Yup.object()
    .shape({
      label: Yup.string().required("Quarter is required"),
      value: Yup.string().required("Quarter is required"),
    })
    .typeError("Quarter is required"),
  yearDDLgroup: Yup.object()
    .shape({
      label: Yup.string().required("Priority is required"),
      value: Yup.string().required("Priority is required"),
    })
    .typeError("Year is required"),
});

const WorkPlan = () => {
  const [planList, setPlanList] = useState();
  const [, setLoading] = useState(false);
  const [, setDisabled] = useState(false);
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [commonDDL, setCommonDDL] = useState([]);
  const priorities = ["Do First", "Schedule", "Delegate", "Don't Do"];
  const formikRef = useRef();
  const {
    buId,
    orgId,
    userName,
    employeeId,
    strDesignation,
    intDesignationId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  useEffect(() => {
    workPlan_landing_api(employeeId, 12, 1, setPlanList, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    commonYearDDL(setLoading, setCommonDDL, buId, orgId);
  }, [buId, orgId]);

  const saveHandler = (values, cb, confirm) => {
    const newRow = values?.priorityActivityList?.filter(
      (activity) => activity.priorityId !== 0
    );
    if (confirm) {
      const rowList = newRow?.map((data) => {
        return {
          rowId: data?.rowId,
          workPlanHeaderId: data?.workPlanHeaderId || 0,
          activity: data?.activity,
          frequencyId: data?.frequencyId || 0,
          frequency: data?.frequency || 0,
          priorityId: data?.priorityId,
          priority: data?.priority,
          comments: data?.comments || "",
          isActive: true,
          actionDate: todayDate(),
          actionBy: employeeId,
        };
      });
      const payload = {
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
        isConfirm: true,
      };
      addWorkPlan(
        payload,
        () => {
          workPlan_landing_api(
            employeeId,
            payload?.yearId,
            payload?.quarterId,
            setPlanList,
            setLoading
          );
        },
        setDisabled
      );
    } else {
      const rowList = newRow?.map((data) => {
        return {
          rowId: data?.rowId,
          workPlanHeaderId: data?.workPlanHeaderId || 0,
          activity: data?.activity,
          frequencyId: data?.frequencyId || 0,
          frequency: data?.frequency || 0,
          priorityId: data?.priorityId,
          priority: data?.priority,
          comments: data?.comments || "",
          isActive: true,
          actionDate: todayDate(),
          actionBy: employeeId,
        };
      });
      const payload = {
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
      };
      addWorkPlan(
        payload,
        () => {
          workPlan_landing_api(
            employeeId,
            payload?.yearId,
            payload?.quarterId,
            setPlanList,
            setLoading
          );
        },
        setDisabled
      );
    }
  };

  // const requestedActivities = (data) => {
  //   const activities = data?.filter((activity) => activity.priorityId === 0);
  //   return activities;
  // };

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

  const onDragEnd = (result, values) => {
    const { source, destination } = result;
    if (!destination) return;
    let temp = values?.priorityActivityList;
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
  };

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const temp = initData.priorityActivityList?.some(
      (item) => item?.priorityId !== 0
    );
    setIsDisabled(!temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData.priorityActivityList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          planList?.row?.length > 0
            ? { ...initData, priorityActivityList: planList?.row }
            : initData
        }
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
        innerRef={formikRef}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {false && <Loading />}
              <FieldArray name="priorityActivityList">
                {({ push, remove, form }) => {
                  return (
                    <>
                      <div className="table-card">
                        <div className="table-card-heading">
                          <div></div>
                          <ul className="d-flex flex-wrap">
                            <li>
                              <Button
                                className="mr-2"
                                variant="outlined"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsShowRowItemModal(true);
                                }}
                                sx={{
                                  borderColor: "rgba(0, 0, 0, 0.6)",
                                  color: "rgba(0, 0, 0, 0.6)",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                  letterSpacing: "1.25px",
                                  "&:hover": {
                                    borderColor: "rgba(0, 0, 0, 0.6)",
                                  },
                                  "&:focus": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                                startIcon={
                                  <VisibilityIcon
                                    sx={{
                                      color: "rgba(0, 0, 0, 0.6)",
                                    }}
                                    className="emp-print-icon"
                                  />
                                }
                              >
                                View Work Plan
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="mr-2"
                                variant="outlined"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  pdfExport("Work plan");
                                }}
                                sx={{
                                  borderColor: "rgba(0, 0, 0, 0.6)",
                                  color: "rgba(0, 0, 0, 0.6)",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                  letterSpacing: "1.25px",
                                  "&:hover": {
                                    borderColor: "rgba(0, 0, 0, 0.6)",
                                  },
                                  "&:focus": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                                startIcon={
                                  <DownloadOutlined
                                    sx={{
                                      color: "rgba(0, 0, 0, 0.6)",
                                    }}
                                    className="emp-print-icon"
                                  />
                                }
                              >
                                DOWNLOAD PDF
                              </Button>
                            </li>
                            <li>
                              <button
                                type="button"
                                onClick={() => {
                                  saveHandler(values, () => {}, false);
                                }}
                                className="btn btn-green w-100"
                                disabled={isDisabled || planList?.isConfirm}
                              >
                                Save
                              </button>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="table-card-body"
                          style={{ marginTop: "8px" }}
                        >
                          <div className="card-style with-form-card pb-0 mb-3 ">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="row">
                                  <div className="col-lg-4 mt-2">
                                    <div>
                                      <p>
                                        <span className="font-weight-bold">
                                          Name :
                                        </span>{" "}
                                        <span>{userName}</span>
                                      </p>
                                    </div>
                                    <div>
                                      <p>
                                        <span className="font-weight-bold">
                                          Enroll :
                                        </span>{" "}
                                        <span>{employeeId}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div>
                                      <p>
                                        <span className="font-weight-bold">
                                          Designation :
                                        </span>{" "}
                                        <span>{strDesignation || ""}</span>
                                      </p>
                                    </div>
                                    <div>
                                      <p>
                                        <span className="font-weight-bold">
                                          Location :
                                        </span>{" "}
                                        <span>{""}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <br />
                              <br />
                              <br />
                              <div className="input-field-main col-lg-2">
                                <FormikSelect
                                  classes="input-sm"
                                  label="Year"
                                  name="yearDDLgroup"
                                  options={commonDDL}
                                  value={values?.yearDDLgroup}
                                  onChange={(valueOption) => {
                                    setFieldValue("yearDDLgroup", valueOption);
                                    setFieldValue("quarterDDLgroup", "");
                                    setPlanList([]);
                                  }}
                                  placeholder=" "
                                  styles={customStyles}
                                  errors={errors}
                                  touched={touched}
                                  menuPosition="fixed"
                                />
                              </div>
                              <div className="input-field-main col-lg-2">
                                <FormikSelect
                                  classes="input-sm"
                                  name="quarterDDLgroup"
                                  options={quaterDDL}
                                  value={values?.quarterDDLgroup}
                                  label="Quarter"
                                  onChange={(valueOption) => {
                                    if (valueOption) {
                                      setFieldValue(
                                        "quarterDDLgroup",
                                        valueOption
                                      );
                                      workPlan_landing_api(
                                        employeeId,
                                        values?.yearDDLgroup?.value,
                                        valueOption?.value,
                                        setPlanList,
                                        setLoading,
                                        (valueOption) => {
                                          setFieldValue(
                                            "quarterDDLgroup",
                                            valueOption
                                          );
                                        }
                                      );
                                    } else {
                                      setPlanList([]);
                                      setFieldValue("quarterDDLgroup", "");
                                    }
                                  }}
                                  placeholder=" "
                                  styles={customStyles}
                                  errors={errors}
                                  touched={touched}
                                  menuPosition="fixed"
                                />
                              </div>
                              <div className="col-lg-4"></div>
                              <div
                                style={{ marginTop: "24px" }}
                                className="col-lg-2"
                              >
                                <PrimaryButton
                                  type="button"
                                  className="btn btn-green flex-center"
                                  label={"Confirm"}
                                  disabled={isDisabled || planList?.isConfirm}
                                  onClick={() => {
                                    saveHandler(
                                      values,
                                      () => {
                                        setPlanList([]);
                                      },
                                      true
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="table-card-body"
                          style={{ marginTop: "40px" }}
                        >
                          <div className="card-style with-form-card pb-0 mb-3 ">
                            <div className="row">
                              <div className="input-field-main col-lg-2">
                                <label>Activity Name</label>
                                <FormikInput
                                  value={values?.activity}
                                  name="activity"
                                  classes="input-sm"
                                  onChange={(e) => {
                                    setFieldValue("activity", e.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  errors={errors}
                                  touched={touched}
                                  disabled={planList?.isConfirm}
                                />
                              </div>
                              <div
                                style={{ marginTop: "24px" }}
                                className="col-lg-2"
                              >
                                <PrimaryButton
                                  type="button"
                                  className="btn btn-green flex-center"
                                  label={"Add"}
                                  disabled={
                                    !values?.activity || planList?.isConfirm
                                  }
                                  onClick={() => {
                                    if (!values?.activity) return; // if input field is empty
                                    // setColumns((prevColumns) => ({
                                    //   ...prevColumns,
                                    //   0: {
                                    //     ...prevColumns[0],
                                    //     items: [
                                    //       {
                                    //         id: String(
                                    //           [
                                    //             ...Object.values(columns).flatMap(
                                    //               (column) => column.items
                                    //             ),
                                    //           ]?.length
                                    //         ),
                                    //         name: values.activity,
                                    //         priority: 1,
                                    //       },
                                    //       ...prevColumns[0].items,
                                    //     ],
                                    //   },
                                    // }));

                                    // setPriorityActivityList((prev) => {
                                    //   return [
                                    //     ...prev,
                                    //     {
                                    //       rowId: Date.now(),
                                    //       activity: values?.activity,
                                    //       priorityId: 0,
                                    //       priority: null,
                                    //     },
                                    //   ];
                                    // });

                                    push({
                                      rowId: Date.now().toString(),
                                      activity: values?.activity,
                                      priorityId: 0,
                                      priority: null,
                                    });
                                    setFieldValue("activity", "");
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="dnd-wrapper">
                        <DragDropContext
                          onDragEnd={(result) => onDragEnd(result, values)}
                        >
                          <div className="row px-3">
                            <DroppableActivityListContainer
                              requestedActivities={
                                form?.values?.priorityActivityList
                              }
                              remove={remove}
                              isDraggable={!planList?.isConfirm}
                            />
                            <DroppableActivityContainers
                              priorities={priorities}
                              activities={form?.values?.priorityActivityList}
                              remove={remove}
                              isDraggable={!planList?.isConfirm}
                            />
                          </div>
                        </DragDropContext>
                      </div>
                    </>
                  );
                }}
              </FieldArray>
            </Form>
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
          </>
        )}
      </Formik>
    </>
  );
};

export default WorkPlan;
