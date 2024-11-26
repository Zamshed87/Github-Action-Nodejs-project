import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../common/DefaultInput";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import AntTable from "../../../../common/AntTable";
import { actionPlanGrowModelCol } from "./helper";
import { useRef } from "react";
import NoResult from "../../../../common/NoResult";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import * as Yup from "yup";
import GrowModelPdf from "./growModelPdf";
import "./style.css";
import { dateFormatter } from "../../../../utility/dateFormatter";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { todayDate } from "../../../../utility/todayDate";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";

const initialValues = {
  year: "",
  quater: "",
  type: "",
  typeRef: "",
  taskName: "",
  startDate: "",
  endDate: "",
};

const validationSchema = Yup.object().shape({
  taskName: Yup.string().required("Task Name is required"),
  startDate: Yup.string().required("Start Date is required"),
  endDate: Yup.string().required("End Date is required"),
});

const ActionPlanGrowModelLanding = () => {
  const { employeeId, strDisplayName, orgId, buId, intDesignationId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [rowDto, getRowData, lodar, setRowDto] = useAxiosGet();
  const [referenceData, getReferenceData] = useAxiosGet();
  const [yearData, getYearData] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const scrollRef = useRef();
  const printRef = useRef();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30386),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getYearData(`/PMS/YearDDL?AccountId=${orgId}&BusinessUnitId=${buId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const getApiData = (empId, yearId, quaterId, setFieldValue) => {
    getRowData(
      `/PMS/GetActionPlanRowGrid?EmployeeId=${empId}&YearId=${yearId}&QuarterId=${quaterId}&TypeGroup=GrowModel`,
      (data) => {
        setFieldValue("typeRef", {
          value: data?.typeReference,
          label: data?.typeReference,
        });
      }
    );
  };

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var clonedElement = element.cloneNode(true);
    clonedElement.classList.add("d-block");

    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        padding: "50px",
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "portrait" },
    };
    html2pdf().set(opt).from(clonedElement).save();
  };

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
      type: {
        value: rowDto?.typeId || 6,
        label: "Grow Model",
      },
    },
    validationSchema,
    onSubmit: () => {
      addHandler();
    },
  });

  const addHandler = () => {
    if (values?.taskName && values?.startDate && values?.endDate) {
      const found = rowDto?.row?.some((item) => {
        return item?.activity === values?.taskName;
      });
      if (found) {
        toast.error("Activity already exist");
        return;
      } else {
        if (rowDto.row) {
          const modifiedData = [...rowDto?.row];
          modifiedData.push({
            rowId: 0,
            actionPlanHeaderId: rowDto?.actionPlanHeaderId || 0,
            activity: values?.taskName,
            stardDate: values?.startDate,
            endDate: values?.endDate,
            isActive: true,
            actionDate: dateFormatter(new Date()),
            actionBy: employeeId,
          });
          setRowDto({
            typeReferenceId: rowDto?.typeReferenceId,
            typeReference: rowDto?.typeReference,
            actionPlanHeaderId: rowDto?.actionPlanHeaderId,
            row: modifiedData,
          });
        } else {
          const modifiedData = [];
          modifiedData.push({
            rowId: 0,
            actionPlanHeaderId: rowDto?.actionPlanHeaderId || 0,
            activity: values?.taskName,
            stardDate: values?.startDate,
            endDate: values?.endDate,
            isActive: true,
            actionDate: dateFormatter(new Date()),
            actionBy: employeeId,
          });
          setRowDto({
            typeReferenceId: rowDto?.typeReferenceId,
            typeReference: rowDto?.typeReference,
            actionPlanHeaderId: rowDto?.actionPlanHeaderId,
            row: modifiedData,
          });
        }
      }
    } else {
      toast.error("Please fill all the fields");
      return;
    }
  };

  const handleSave = () => {
    const rowList = rowDto?.row?.map((data) => {
      return {
        rowId: data?.rowId || 0,
        actionPlanHeaderId: data?.actionPlanHeaderId || 0,
        activity: data?.activity,
        stardDate: data?.stardDate,
        endDate: data?.endDate,
        isActive: true,
        actionDate: dateFormatter(new Date()),
        actionBy: employeeId,
      };
    });

    const payload = {
      actionPlanHeaderId: rowDto?.actionPlanHeaderId || 0,
      employeeId: employeeId,
      employeeName: strDisplayName,
      designationId: intDesignationId,
      businessUnitId: buId,
      workplaceGroupId: values?.workplaceGroupId || 0,
      typeId: rowDto?.typeId || 6,
      type: rowDto?.type || "Grow Model",
      typeReferenceId: rowDto?.typeRef || values?.typeRef?.growModelId,
      typeReference: rowDto?.typeRef || values?.typeRef?.label,
      yearId: values?.year?.value,
      year: values?.year?.label,
      quarterId: values?.quater?.value || 1,
      quarter: values?.quater?.label || "",
      currentResult: values?.currentResult,
      desiredResult: values?.desiredResult,
      isActive: true,
      actionDate: todayDate(),
      actionBy: employeeId,
      typeGroup: "GrowModel",
      row: rowList,
    };

    saveData(`/PMS/PMSActionPlanCreateAndEdit`, payload, null, true);
  };

  const pdfData = {
    rowDto,
    strDisplayName,
    employeeId,
  };

  return (
    <>
      {permission?.isView ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card" ref={scrollRef}>
            <div className="table-card-heading">
              <div></div>
              <div className="table-card-head-right">
                <ul>
                  <li>
                    <button
                      type="button"
                      className="btn btn-green"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                      }}
                    >
                      Save
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {lodar && <Loading />}
            <div className="table-card-body">
              <div className="card-style mb-2">
                <div className="row">
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Year</label>
                      <FormikSelect
                        name="year"
                        placeholder=""
                        options={yearData || []}
                        value={values?.year}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("year", valueOption);
                            setFieldValue("quater", "");
                            setFieldValue("typeRef", "");
                            setRowDto({});
                          } else {
                            setFieldValue("year", "");
                            setFieldValue("quater", "");
                            setRowDto({});
                          }
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Quater</label>
                      <FormikSelect
                        name="quater"
                        placeholder=""
                        options={[
                          { value: 1, label: "Q1" },
                          { value: 2, label: "Q2" },
                          { value: 3, label: "Q3" },
                          { value: 4, label: "Q4" },
                        ]}
                        value={values?.quater}
                        onChange={(valueOption) => {
                          if (valueOption?.value) {
                            getApiData(
                              employeeId,
                              values.year.value,
                              valueOption?.value,
                              setFieldValue
                            );
                            setFieldValue("quater", valueOption);
                            getReferenceData(
                              `/PMS/GetJohariWindowActionPlanDDL?EmployeeId=${employeeId}&YearId=${values.year.value}&QuarterId=${valueOption?.value}&DDLTypeId=2`
                            );
                          } else {
                          }
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values.year}
                      />
                    </div>
                  </div>
                  {values.year.value && values?.quater?.value && (
                    <div className="col-lg-3" style={{ marginTop: "22px" }}>
                      <button
                        id="actionplan-pdf"
                        onClick={(e) =>
                          pdfExport("Action plan Grow Model", html2pdf)
                        }
                        className="btn btn-default position-absolute bottom-0"
                        type="button"
                      >
                        <i
                          className="mr-1 fa fa-download pointer"
                          aria-hidden="true"
                        ></i>
                        Export PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-style mb-2">
                <div className="row">
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Type</label>
                      <FormikSelect
                        name="type"
                        placeholder=""
                        options={[]}
                        value={values?.type}
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Type Reference</label>
                      <FormikSelect
                        name="typeRef"
                        placeholder=""
                        options={referenceData}
                        value={values?.typeRef}
                        onChange={(valueOption) => {
                          setFieldValue("typeRef", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          !values?.year || !values?.quater || rowDto.typeRef
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Task name</label>
                      <DefaultInput
                        classes="input-sm"
                        name="taskName"
                        placeholder=""
                        type="text"
                        value={values?.taskName}
                        onChange={(e) => {
                          setFieldValue("taskName", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={!values.year.value && !values.quater.value}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Start Date</label>
                      <DefaultInput
                        classes="input-sm"
                        name="startDate"
                        placeholder=""
                        type="date"
                        value={values?.startDate}
                        onChange={(e) => {
                          setFieldValue("startDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={
                          !values.year.value &&
                          !values.quater.value &&
                          !values.taskName
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>End Date</label>
                      <DefaultInput
                        classes="input-sm"
                        name="endDate"
                        placeholder=""
                        type="date"
                        value={values?.endDate}
                        onChange={(e) => {
                          setFieldValue("endDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={
                          !values.year.value &&
                          !values.quater.value &&
                          !values.taskName &&
                          !values.startDate
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "21px" }}>
                    <button
                      type="submit"
                      className="btn btn-green"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {rowDto?.row?.length > 0 ? (
                  <div className="table-card-styled employee-table-card tableOne table-responsive">
                    <AntTable
                      data={rowDto?.row?.length > 0 ? rowDto?.row : []}
                      columnsData={actionPlanGrowModelCol(
                        scrollRef,
                        rowDto,
                        setRowDto
                      )}
                      removePagination
                    />
                  </div>
                ) : (
                  <NoResult />
                )}
              </div>
            </div>
          </div>
          <div
            id="pdf-section"
            className="actionplan-pdf-section d-none"
            componentRef={printRef}
            ref={printRef}
            style={{
              marginTop: "20px",
            }}
          >
            <GrowModelPdf pdfData={pdfData} />
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default ActionPlanGrowModelLanding;
