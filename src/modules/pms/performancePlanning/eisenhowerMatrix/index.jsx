/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
// import { erpBaseUrl } from "../../../../common/ErpBaseUrl";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { customStyles } from "../../../../utility/selectCustomStyle";
import "../eisenhowerMatrix/style.css";
import EisenHowerPdfFile from "./pdfFile";
import { getFiscalYearForNowOnLoad } from "./helper";
import { quarterDDL } from "../../../../utility/quaterDDL";

const initData = {
  year: "",
  quarter: "",
};
const validationSchema = Yup.object().shape({});
// const quarters = [
//   { value: "1", label: "Q1" },
//   { value: "2", label: "Q2" },
//   { value: "3", label: "Q3" },
//   { value: "4", label: "Q4" },
// ];

const EisenhowerMatrix = () => {
  // 30481
  const {
    profileData: { orgId, buId, employeeId, strDisplayName, strDesignation },
    // eslint-disable-next-line no-unused-vars
    permissionList,
  } = useSelector((state) => state?.auth, shallowEqual);
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const [rowData, getRowDto, loading, setRowDto] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
    });

    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};
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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        setValues,
        errors,
        touched,
        values,
        setFieldValue,
      }) => (
        <>
          {(loading || fiscalYearDDLloader) && <Loading />}
          <Form onSubmit={handleSubmit}>
            {true ? (
              <>
                <div className="table-card">
                  <div className="table-card-heading" ref={scrollRef}>
                    <h2>Eisenhower Matrix Worksheet</h2>
                    <ul className="d-flex flex-wrap">
                      <li>
                        <Button
                          className=""
                          variant="outlined"
                          onClick={(e) => {
                            e?.stopPropagation();
                            pdfExport("Eisenhower Matrix");
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
                                marginBottom: "2px",
                                fontSize: "14px !important",
                                marginRight: "-4px",
                              }}
                              className="emp-print-icon"
                            />
                          }
                        >
                          Download PDF
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div className="card-style" style={{ marginTop: "10px" }}>
                    <div className="row align-items-center">
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
                            <span style={{ fontWeight: "bold" }}>
                              Workplace:{" "}
                            </span>
                            {rowData?.header?.workplaceGroup || ""}
                          </p>
                        </div>
                      </div>

                      <div className="col-12"></div>

                      <div className="col-12">
                        <div className="card-save-border"></div>
                      </div>
                      <div className="col-lg-3">
                        <label>Year</label>
                        <FormikSelect
                          name="year"
                          options={fiscalYearDDL || []}
                          value={values?.year}
                          onChange={(valueOption) => {
                            setFieldValue("year", valueOption);
                            setFieldValue("quarter", "");
                          }}
                          placeholder=" "
                          styles={customStyles}
                          isSearchable={false}
                          isClearable={false}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Quarter</label>
                        <FormikSelect
                          name="quarter"
                          options={quarterDDL || []}
                          value={values?.quarter}
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("quarter", valueOption);
                              getRowDto(
                                `/PMS/GetEisenhowerMatrix?EmployeeId=${employeeId}&YearId=${
                                  values?.year?.value || 0
                                }&QuarterId=${valueOption?.value}`
                              );
                            } else {
                              setRowDto([]);
                              setFieldValue("quater", "");
                            }
                          }}
                          placeholder=" "
                          styles={customStyles}
                          isSearchable={false}
                          isClearable={false}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-12"></div>

                      <div className="col-12">
                        <div className="card-save-border"></div>
                      </div>
                    </div>
                  </div>

                  <div className="eisenhower-matrix-wrapper">
                    <div className="bg-green p-2">
                      <div>
                        <div className="d-flex">
                          <div className="w-100 m-2">
                            {/* <DoFirst doFirst={rowData?.doFirst} /> */}
                            <div className="card card-height">
                              <strong className="p-2">1. Do First</strong>
                              <ol style={{ marginLeft: "40px" }}>
                                {rowData?.doFirst?.map((data) => (
                                  <li>{data?.strActivity}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                          <div className="w-100 m-2">
                            {/* <Schedule schedule={rowData?.schedule} /> */}
                            <div className="card card-height">
                              <div className="p-2">
                                <strong>2. Schedule</strong>
                                <ol
                                  style={{
                                    marginLeft: "40px",
                                  }}
                                >
                                  {rowData?.schedule?.map((item) => (
                                    <li>{item?.strActivity}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="w-100 m-2">
                            {/* <Delegate delegate={rowData?.delegate} /> */}
                            <div className="card card-height">
                              <div className="p-2">
                                <strong>3. Delegate</strong>
                                <ol
                                  style={{
                                    marginLeft: "40px",
                                  }}
                                >
                                  {rowData?.delegate?.map((data) => (
                                    <li>{data?.strActivity}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </div>
                          <div className="w-100 m-2">
                            {/* <DontDo dontDo={rowData?.dontDo} /> */}
                            <div className="card card-height">
                              <div className="p-2">
                                <strong>4. Don't Do</strong>
                                <ol
                                  style={{
                                    marginLeft: "40px",
                                  }}
                                >
                                  {rowData?.dontDo?.map((data) => (
                                    <li>{data?.strActivity}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="pdf-section"
                  className="eisenhower-matrix-wrapper d-none m-5"
                >
                  <EisenHowerPdfFile
                    singleData={{
                      header: rowData?.header,
                      rowDto: {
                        doFirst: rowData?.doFirst,
                        schedule: rowData?.schedule,
                        delegate: rowData?.delegate,
                        dontDo: rowData?.dontDo,
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <NotPermittedPage />
              </>
            )}
          </Form>
        </>
      )}
    </Formik>
  );
};

export default EisenhowerMatrix;
