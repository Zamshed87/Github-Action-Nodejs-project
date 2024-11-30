import React, { useEffect, useState } from "react";
import { customStyles } from "../../../../utility/selectCustomStyle";
import FormikSelect from "../../../../common/FormikSelect";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { getPerformanceDialogReport, getYearDDL, quaterDDL } from "./helper";
import Loading from "../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import ScrollableTable from "../../../../common/ScrollableTable";
import html2pdf from "html2pdf.js";
import EisenHowerPdfFile from "../../performancePlanning/eisenhowerMatrix/pdfFile";
import { WorkPlanTable } from "../../performancePlanning/workPlan/WorkPlanTable";
import ActionPlanPdfFile from "../../performancePlanning/actionPlan/ActionPlanPdfFile";
import JohariWindowPdfFile from "../../performanceCoaching/actionPlanJohariWindow/JohariWindowPdfFile";
import ViewModal from "../../../../common/ViewModal";
import GrowModelPdf from "../../performanceCoaching/growModel/pdf";
import { Button } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { JohariWindowPDFView } from "../../performanceCoaching/johariWindow/helper";
import ActionPlanGrowModelPdf from "../../performanceCoaching/actionPlanGrowModel/growModelPdf";

const initialValues = {
  reportTypeDDL: "",
  yearDDLgroup: "",
  quarterDDLgroup: "",
};

const reportType = [
  {
    value: 1,
    label: "Work Plan",
  },
  {
    value: 2,
    label: "Action Plan",
  },
  {
    value: 3,
    label: "Eisenhower Matrix",
  },
  {
    value: 4,
    label: "Johari Window",
  },
  {
    value: 5,
    label: "Action Plan Johari Window",
  },
  {
    value: 6,
    label: "Grow Model",
  },
  {
    value: 7,
    label: "Action Plan Grow Model",
  },
];
const PerformaceDialogReport = () => {
  // 30475
  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [yearDDL, setYearDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(null);

  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    getYearDDL(orgId, setYearDDL, buId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const saveHandler = (values, cb, confirm) => {};
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialValues);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-body" style={{ marginTop: "40px" }}>
                  <div className="card-style with-form-card pb-0 mb-3 ">
                    <div className="row">
                      <div className="input-field-main col-lg-3">
                        <label>Report Type</label>
                        <FormikSelect
                          name="reportTypeDDL"
                          options={reportType || []}
                          value={values?.reportTypeDDL}
                          onChange={(valueOption) => {
                            setFieldValue("reportTypeDDL", valueOption);
                            setRowDto([]);
                          }}
                          placeholder=""
                          errors={errors}
                          classes="input-sm"
                          styles={customStyles}
                          touched={touched}
                          menuPosition="fixed"
                        />
                      </div>
                      <div className="input-field-main col-lg-3">
                        <label>Select Year</label>
                        <FormikSelect
                          name="yearDDLgroup"
                          options={yearDDL || []}
                          value={values?.yearDDLgroup}
                          onChange={(valueOption) => {
                            setFieldValue("yearDDLgroup", valueOption);
                            setRowDto([]);
                          }}
                          placeholder=""
                          errors={errors}
                          classes="input-sm"
                          styles={customStyles}
                          touched={touched}
                          menuPosition="fixed"
                        />
                      </div>
                      {values?.reportTypeDDL?.value !== 4 && (
                        <div className="input-field-main col-lg-3">
                          <FormikSelect
                            classes="input-sm"
                            name="quarterDDLgroup"
                            options={quaterDDL || []}
                            value={values?.quarterDDLgroup}
                            label="Quarter"
                            onChange={(valueOption) => {
                              setFieldValue("quarterDDLgroup", valueOption);
                              setRowDto([]);
                            }}
                            placeholder=""
                            errors={errors}
                            styles={customStyles}
                            touched={touched}
                            menuPosition="fixed"
                          />
                        </div>
                      )}
                      <div style={{ marginTop: "24px" }} className="col-lg-3">
                        <PrimaryButton
                          type="button"
                          className="btn btn-green flex-center"
                          label={"Show"}
                          onClick={() => {
                            getPerformanceDialogReport(
                              values?.reportTypeDDL?.value || 0,
                              values?.reportTypeDDL?.label || 0,
                              values?.yearDDLgroup?.value || 0,
                              values?.quarterDDLgroup?.value || 0,
                              0,
                              0,
                              setLoading,
                              setRowDto
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ScrollableTable
                  classes=""
                  secondClasses="table-card-styled tableOne scroll-table-height"
                >
                  <thead>
                    <tr>
                      <th className="text-center">Sl</th>
                      <th className="text-center">Enroll</th>
                      <th className="text-center">Name</th>
                      <th className="text-center">Department</th>
                      <th className="text-center">Section</th>
                      <th className="text-center">Business Unit</th>
                      <th className="text-center">Report Type</th>
                      <th className="text-center">Year</th>
                      <th className="text-center">Quarter</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="px-1 text-center">{index + 1}</div>
                        </td>
                        <td className="text-center">
                          {item?.employeeId || "-"}
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.employeeName || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.departmentName || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.sectionName || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.businessUnitName || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.reportTypename || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.year || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            {item?.quarter || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="px-1 text-center">
                            <VisibilityIcon
                              sx={{
                                color: "rgba(0, 0, 0, 0.6)",
                              }}
                              onClick={() => {
                                setShow(true);
                                setSingleData(item);
                              }}
                              className="emp-print-icon cursor-pointer"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollableTable>
              </div>
            </Form>
            <ViewModal show={show} onHide={() => setShow(false)} size={"lg"}>
              <div>
                <div className="mt-3 d-flex justify-content-end">
                  <Button
                    className="mr-2"
                    variant="outlined"
                    onClick={(e) => {
                      e?.stopPropagation();
                      pdfExport(
                        singleData?.employeeName +
                          "-" +
                          singleData?.reportTypename
                      );
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
                </div>
                {/* pdf section */}
                <div id="pdf-section" className="px-5">
                  {singleData?.reportTypename === "Work Plan" && (
                    <div id="pdf-section" className="workplan-pdf-export">
                      <WorkPlanTable
                        planList={singleData}
                        planListRow={singleData?.workPlan}
                        userName={singleData?.employeeName}
                        employeeId={singleData?.employeeId}
                      />
                    </div>
                  )}

                  {singleData?.reportTypename === "Action Plan" && (
                    <ActionPlanPdfFile
                      rowData={{ ...singleData, row: singleData?.actionPlan }}
                    />
                  )}

                  {singleData?.reportTypename === "Grow Model" && (
                    <GrowModelPdf
                      singleData={singleData?.growModel}
                      growRowData={singleData}
                    />
                  )}
                  {singleData?.reportTypename === "Eisenhower Matrix" && (
                    <EisenHowerPdfFile
                      singleData={{
                        header: singleData,
                        rowDto: singleData?.eisenHower,
                      }}
                    />
                  )}

                  {singleData?.reportTypename === "Johari Window" && (
                    <JohariWindowPDFView
                      employeeFullName={singleData?.johariWindow?.employeeName}
                      employeeId={singleData?.johariWindow?.employeeId}
                      designation={singleData?.johariWindow?.designation}
                      workplace={singleData?.johariWindow?.workplaceGroup}
                      year={singleData?.johariWindow?.year}
                      chipList={{
                        blind: singleData?.johariWindow?.blind,
                        hidden: singleData?.johariWindow?.hidden,
                        open: singleData?.johariWindow?.open,
                        unknown: singleData?.johariWindow?.unknown,
                      }}
                      rowData={singleData?.johariWindow}
                    />
                  )}
                  {singleData?.reportTypename ===
                    "Action Plan Johari Window" && (
                    <JohariWindowPdfFile
                      pdfData={{
                        rowData: {
                          ...singleData,
                          row: singleData?.actionPlan,
                        },
                      }}
                    />
                  )}
                  {singleData?.reportTypename === "Action Plan Grow Model" && (
                    <ActionPlanGrowModelPdf
                      pdfData={{
                        rowDto: {
                          ...singleData,
                          row: singleData?.actionPlan,
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </ViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default PerformaceDialogReport;
