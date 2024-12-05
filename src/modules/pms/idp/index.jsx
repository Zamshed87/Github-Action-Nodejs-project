import { useFormik } from "formik";
// import html2pdf from "html2pdf.js";
import React, { useEffect, useMemo, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import DefaultInput from "../../../common/DefaultInput";
// import { erpBaseUrl } from "../../../common/ErpBaseUrl";
import FormikSelect from "../../../common/FormikSelect";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../utility/selectCustomStyle";
import { idpCol, statusData } from "./helper";
import Loading from "../../../common/loading/Loading";
import AntScrollTable from "../../../common/AntScrollTable";

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

const IDP = () => {
  const {
    employeeId,
    strDisplayName,
    orgId,
    buId,
    intDesignationId,
    strDesignation,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);
  const [rowDto, getRowData, lodar, setRowDto] = useAxiosGet();
  // eslint-disable-next-line no-unused-vars
  const [referenceData, getReferenceData] = useAxiosGet();
  const [yearData, getYearData] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
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

  // const pdfExport = (fileName) => {
  //   var element = document.getElementById("pdf-section");
  //   var clonedElement = element.cloneNode(true);
  //   clonedElement.classList.add("d-block");

  //   var opt = {
  //     margin: 20,
  //     filename: `${fileName}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 5,
  //       dpi: 300,
  //       letterRendering: true,
  //       padding: "50px",
  //       scrollX: -window.scrollX,
  //       scrollY: -window.scrollY,
  //       windowWidth: document.documentElement.offsetWidth,
  //       windowHeight: document.documentElement.offsetHeight,
  //     },
  //     jsPDF: {
  //       unit: "px",
  //       hotfixes: ["px_scaling"],
  //       orientation: "portrait",
  //     },
  //   };
  //   html2pdf().set(opt).from(clonedElement).save();
  // };

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
    },
    validationSchema,
    onSubmit: () => {
      // addHandler();
    },
  });

  const addHandler = () => {
    if (!values?.typeRef?.label) {
      return toast.error(`Please Create Action Plan in ${values?.type?.label}`);
    }
    if (rowDto.row) {
      const modifiedData = [...rowDto?.row];
      modifiedData.push({
        intIdpheaderId: rowDto?.header?.intIdpheaderId || 0,
        intIdprowId: 0,
        intCategoryId: values?.category?.value || 0,
        strCategoryName: values?.category?.label || "",
        taskName: values?.taskName || "",
        strComment: values?.comments || "",
        intTypeId: values?.type?.value || 0,
        strType: values?.type?.label || "",
        intTypeReferenceId: values?.typeRef?.value || 0,
        strTypeReferenceName: values?.typeRef?.label || "",
        dteStrat: values?.startDate,
        dteEnd: values?.endDate,
        strTypeGroup: "",
        status: values?.status?.label,
      });
      setRowDto({
        row: modifiedData,
      });
    } else {
      const modifiedData = [];
      modifiedData.push({
        intIdpheaderId: rowDto?.header?.intIdpheaderId || 0,
        intIdprowId: 0,
        intCategoryId: values?.category?.value || 0,
        strCategoryName: values?.category?.label || "",
        taskName: values?.taskName || "",
        strComment: values?.comments || "",
        intTypeId: values?.type?.value || 0,
        strType: values?.type?.label || "",
        intTypeReferenceId: values?.typeRef?.value || 0,
        strTypeReferenceName: values?.typeRef?.label || "",
        dteStrat: values?.startDate,
        dteEnd: values?.endDate,
        strTypeGroup: "",
        status: values?.status?.label,
      });
      setRowDto({
        row: modifiedData,
      });
    }
  };

  const handleSave = () => {
    const rowList = rowDto?.row?.map((data) => {
      return {
        intIdpheaderId: data?.intIdpheaderId || 0,
        intIdprowId: data?.intIdprowId || 0,
        intCategoryId: data?.intCategoryId || 0,
        strCategoryName: data?.strCategoryName || "",
        taskName: data?.taskName || "",
        strComment: data?.strComment || "",
        intTypeId: data?.intTypeId || 0,
        strType: data?.strType || "",
        intTypeReferenceId: data?.intTypeReferenceId || 0,
        strTypeReferenceName: data?.strTypeReferenceName || "",
        dteStrat: data?.dteStrat,
        dteEnd: data?.dteEnd,
        strTypeGroup: "",
        status: data?.status,
      };
    });

    const payload = {
      header: {
        intIdpheaderId: rowDto?.header?.intIdpheaderId || 0,
        intEmployeeId: employeeId,
        strEmployeeName: strDisplayName,
        intDesignationId: intDesignationId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: 0,
        intTypeId: 0,
        strType: "",
        intTypeReferenceId: 0,
        strTypeReference: "",
        intYearId: values?.year?.value || 0,
        strYear: values?.year?.label || "",
        intQuarterId: values?.quater?.value || 0,
        strQuarter: values?.quater?.label || "",
        intActionBy: employeeId,
      },
      row: rowList,
    };
    saveData(`/PMS/CreateIDP`, payload, null, true);
  };

  // const pdfData = {
  //   rowDto,
  //   strDisplayName,
  //   employeeId,
  // };

  return (
    <>
      {permission?.isView ? (
        <form onSubmit={handleSubmit}>
          {(saveDataLoader || lodar) && <Loading />}
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
            <div className="table-card-body">
              <div className="card-style mb-2">
                <div className="row">
                  <div className="col-lg-6 mt-2">
                    <div className=" py-2 d-flex align-item-center">
                      <p>
                        <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                        {strDisplayName}
                      </p>
                    </div>
                    <div className=" py-2 d-flex align-item-center">
                      <p>
                        <span style={{ fontWeight: "bold" }}>Enroll: </span>
                        {employeeId}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-2">
                    <div className="py-2 d-flex align-item-center">
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Designation:{" "}
                        </span>
                        {strDesignation}
                      </p>
                    </div>
                    <div className=" py-2 d-flex align-item-center">
                      <p>
                        <span style={{ fontWeight: "bold" }}>Location: </span>
                        {rowDto?.header?.workplaceGroup || ""}
                      </p>
                    </div>
                  </div>
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
                            setRowDto([]);
                          } else {
                            setFieldValue("year", "");
                            setFieldValue("quater", "");
                            setRowDto([]);
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
                          if (valueOption) {
                            getRowData(
                              `/PMS/GetIDPByEmployeeId?EmployeeId=${employeeId}&YearId=${values?.year?.value}&QuarterId=${valueOption?.value}`,
                              (data) => {}
                            );
                            setFieldValue("quater", valueOption);
                            setFieldValue("typeRef", "");
                          } else {
                            setFieldValue("quater", "");
                            setFieldValue("typeRef", "");
                          }
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values.year}
                      />
                    </div>
                  </div>
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
                        options={[
                          { value: 4, label: "Eisenhower Matrix" },
                          { value: 5, label: "Johari Window" },
                          { value: 6, label: "Grow Model" },
                        ]}
                        value={values?.type}
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          setFieldValue("typeRef", "");
                          getReferenceData(
                            `/pms/PerformanceMgmt/GetActionPlanReferenceDDL?EmployeeId=${employeeId}&YearId=${values?.year?.value}&QuarterId=${values?.quater?.value}&TypeId=${valueOption?.value}`,
                            (data) => {
                              setFieldValue("typeRef", {
                                value: data[0].intTypeReferenceId,
                                label: data[0].strActionPlanReference,
                              });
                            }
                          );
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values.year || !values.quater}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Type Reference</label>
                      <FormikSelect
                        name="typeRef"
                        placeholder=""
                        options={[]}
                        value={values?.typeRef}
                        onChange={(valueOption) => {
                          setFieldValue("typeRef", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Category</label>
                      <FormikSelect
                        name="category"
                        placeholder=""
                        options={[
                          {
                            value: 1,
                            label: "70% - Learn by doing",
                          },
                          {
                            value: 2,
                            label: "20% - Learn from others",
                          },
                          {
                            value: 3,
                            label: "10% - Learning events",
                          },
                        ]}
                        value={values?.category}
                        onChange={(valueOption) => {
                          setFieldValue("category", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.year || !values?.quater}
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
                        min={values?.startDate}
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

                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Status</label>
                      <FormikSelect
                        name="status"
                        placeholder=""
                        options={statusData}
                        value={values?.status}
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Comments</label>
                      <DefaultInput
                        classes="input-sm"
                        name="comments"
                        placeholder=""
                        type="text"
                        value={values?.comments}
                        onChange={(e) => {
                          setFieldValue("comments", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={false}
                      />
                    </div>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "21px" }}>
                    <button
                      type="button"
                      className="btn btn-green"
                      onClick={(e) => {
                        e.stopPropagation();
                        addHandler();
                      }}
                      disabled={
                        !values?.year ||
                        !values?.quater ||
                        !values?.category ||
                        !values?.taskName ||
                        !values?.startDate ||
                        !values?.endDate ||
                        !values?.status
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {rowDto?.row?.length > 0 ? (
                  <div className="table-card-styled employee-table-card tableOne table-responsive">
                    <AntScrollTable
                      data={rowDto?.row?.length > 0 ? rowDto?.row : []}
                      columnsData={idpCol(scrollRef, rowDto, setRowDto)}
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
          ></div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default IDP;
