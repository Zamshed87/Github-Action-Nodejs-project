/* eslint-disable no-unused-vars */
import { DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
// import { erpBaseUrl } from "../../../../common/ErpBaseUrl";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import NoResult from "../../../../common/NoResult";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import JohariWindowPdfFile from "./JohariWindowPdfFile";
import "./style.css";

const initData = {
  year: "",
  quater: "",
  type: "",
  typeReference: "",
  activity: "",
  stardDate: "",
  endDate: "",
};

const validationSchema = Yup.object({});

function ActionPlanJohariWindow() {
  const { orgId, buId, employeeId, strDisplayName, intDesignationId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [yearData, getYearData] = useAxiosGet();
  const [referenceData, getReferenceData] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const closeHandler = (index) => {
    let updatedData = rowData?.row?.filter((item, i) => index !== i);
    setRowData({
      ...rowData,
      row: updatedData,
    });
  };

  const saveHandler = (values) => {
    if (
      values?.year?.value &&
      values?.quater?.value &&
      rowData.row.length > 0
    ) {
      const rowList = rowData?.row?.map((data) => {
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
        actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
        employeeId: employeeId,
        employeeName: strDisplayName,
        designationId: intDesignationId,
        businessUnitId: buId,
        workplaceGroupId: values?.workplaceGroupId || 0,
        typeId: rowData?.typeId || 5,
        type: rowData?.type || "Johari Window",
        typeReferenceId:
          rowData?.typeReferenceId || values?.typeReference?.value,
        typeReference:
          rowData?.typeReference || values?.typeReference?.chipsLabel,
        yearId: values?.year?.value,
        year: values?.year?.label,
        quarterId: values?.quater?.value || 1,
        quarter: values?.quater?.label || "",
        currentResult: values?.currentResult,
        desiredResult: values?.desiredResult,
        isActive: true,
        actionDate: todayDate(),
        actionBy: employeeId,
        typeGroup: "JohariWindow",
        row: rowList,
      };
      saveData(
        // `${erpBaseUrl}/pms/PerformanceMgmt/PMSActionPlanCreateAndEdit`,
        `/PMS/PMSActionPlanCreateAndEdit`,
        payload,
        null,
        true
      );
    } else {
      toast.error("Please Select Year and Quater");
    }
  };

  const addHandler = (values) => {
    if (values?.activity && values?.stardDate && values?.endDate) {
      if (rowData?.row?.find((item) => item?.activity === values?.activity)) {
        toast.error("Activity already exist");
        return;
      } else {
        if (rowData.row) {
          const modifiedData = [...rowData?.row];
          modifiedData.push({
            rowId: 0,
            actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
            activity: values?.activity,
            stardDate: values?.stardDate,
            endDate: values?.endDate,
            isActive: true,
            actionDate: dateFormatter(new Date()),
            actionBy: employeeId,
          });
          setRowData({
            actionPlanHeaderId: rowData?.actionPlanHeaderId,
            row: modifiedData,
          });
        } else {
          const modifiedData = [];
          modifiedData.push({
            rowId: 0,
            actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
            activity: values?.activity,
            stardDate: values?.stardDate,
            endDate: values?.endDate,
            isActive: true,
            actionDate: dateFormatter(new Date()),
            actionBy: employeeId,
          });
          setRowData({
            actionPlanHeaderId: rowData?.actionPlanHeaderId,
            row: modifiedData,
          });
        }
      }
    } else {
      toast.error("Please fill all the fields");
      return;
    }
  };

  const getApiData = (empId, yearId, quaterId, setFieldValue) => {
    getRowData(
      // `${erpBaseUrl}/pms/PerformanceMgmt/GetActionPlanRowGrid?EmployeeId=${empId}&YearId=${yearId}&QuarterId=${quaterId}&TypeGroup=JohariWindow`,
      `/PMS/GetActionPlanRowGrid?EmployeeId=${empId}&YearId=${yearId}&QuarterId=${quaterId}&TypeGroup=JohariWindow`,
      (data) => {
        setFieldValue("typeReference", {
          value: data?.typeReferenceId,
          label: data?.typeReference,
        });
      }
    );
  };

  useEffect(() => {
    getYearData(
      // `${erpBaseUrl}/pms/CommonDDL/YearDDL?AccountId=${orgId}&BusinessUnitId=${buId}`
      `/PMS/YearDDL?AccountId=${orgId}&BusinessUnitId=${buId}`
    );
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
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "portrait" },
    };
    html2pdf().set(opt).from(clonedElement).save();
  };

  const pdfData = {
    rowData,
    employeeId,
    strDisplayName,
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30384) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          type: {
            value: 5,
            label: "Johari Window",
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, () => {});
        }}
      >
        {({
          handleSubmit,
          resetForm,
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          dirty,
        }) => (
          <>
            <Form
              onSubmit={handleSubmit}
              className="employeeProfile-form-main w-100"
            >
              {permission?.isView ? (
                <div className="employee-profile-main">
                  <div className="table-card w-100">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "12px" }}
                    >
                      <div></div>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <button
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            style={{ width: "auto" }}
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="card-style mb-2">
                      <div className="px-1 mt-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <label>Year</label>
                            <FormikSelect
                              menuPosition="fixed"
                              name="year"
                              options={yearData}
                              value={values?.year}
                              onChange={(valueOption) => {
                                if (valueOption) {
                                  setFieldValue("year", valueOption);
                                  setFieldValue("quater", "");
                                  setRowData({});
                                } else {
                                  setFieldValue("year", "");
                                  setFieldValue("quater", "");
                                  setRowData({});
                                }
                              }}
                              styles={customStyles}
                              errors={errors}
                              placeholder=""
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Quater</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              placeholder={" "}
                              name="quater"
                              options={[
                                { value: 1, label: "Q1" },
                                { value: 2, label: "Q2" },
                                { value: 3, label: "Q3" },
                                { value: 4, label: "Q4" },
                              ]}
                              value={values?.quater}
                              onChange={(valueOption) => {
                                if (valueOption) {
                                  getApiData(
                                    employeeId,
                                    values.year.value,
                                    valueOption?.value,
                                    setFieldValue
                                  );
                                  getReferenceData(
                                    // `${erpBaseUrl}/pms/PerformanceMgmt/GetJohariWindowActionPlanDDL?EmployeeId=${employeeId}&YearId=${values.year.value}&QuarterId=${valueOption?.value}&DDLTypeId=1`
                                    `/PMS/GetJohariWindowActionPlanDDL?EmployeeId=${employeeId}&YearId=${values.year.value}&QuarterId=${valueOption?.value}&DDLTypeId=1`
                                  );
                                  setFieldValue("quater", valueOption);
                                } else {
                                  setFieldValue("quater", "");
                                  setRowData({});
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div
                            style={{
                              marginTop: "22px",
                            }}
                            className="col-lg-3 d-flex align-items-center-justify-content-center"
                          >
                            {values.year.value && values?.quater ? (
                              <>
                                <button
                                  id="actionplan-pdf"
                                  onClick={(e) =>
                                    pdfExport("Action plan Johari Window")
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
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-style pb-0">
                      <div className="px-1 mt-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <label>Type</label>
                            <FormikSelect
                              menuPosition="fixed"
                              name="type"
                              options={[]}
                              value={values?.type}
                              onChange={(valueOption) => {
                                setFieldValue("type", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              placeholder=""
                              touched={touched}
                              isDisabled={true}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Type Reference</label>
                            <FormikSelect
                              menuPosition="fixed"
                              name="typeReference"
                              options={referenceData || []}
                              value={values?.typeReference}
                              onChange={(valueOption) => {
                                setFieldValue("typeReference", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              placeholder=""
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-6"></div>
                          <div className="col-lg-3">
                            <label>Task name</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.activity}
                              name="activity"
                              type="text"
                              min={values?.activity}
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("activity", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Start Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.stardDate}
                                name="stardDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("stardDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>End Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.endDate}
                                name="endDate"
                                type="date"
                                min={values?.endDate}
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("endDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              marginTop: "22px",
                            }}
                            className="col-lg-3 d-flex align-items-center-justify-content-center"
                          >
                            <button
                              type="button"
                              className="btn btn-green btn-green-disable"
                              style={{ width: "auto" }}
                              label="Add"
                              onClick={() => {
                                addHandler(values);
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {lodar && <Loading />}
                    <div className="table-card-styled pt-3 pb-3">
                      {rowData?.row?.length > 0 ? (
                        <>
                          <p
                            style={{
                              color: gray500,
                              fontSize: "14px",
                              fontWeight: "600",
                              marginBottom: "10px",
                            }}
                          >
                            Action Plan Johari Window
                          </p>
                          <div className="table-card-body tableOne">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th style={{ width: "30px" }}>SL</th>
                                  <th>
                                    LIST OF TASKS/ACTIVITIES/BEHAVIOR TO ACHIEVE
                                    RESULT
                                  </th>
                                  <th> START DATE</th>
                                  <th>END DATE</th>
                                  <th>ACTION</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowData?.row?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.activity}</td>
                                    <td>{dateFormatter(item?.stardDate)}</td>
                                    <td>{dateFormatter(item?.endDate)}</td>
                                    <td className="text-center">
                                      <Tooltip title="Delete" arrow>
                                        <button
                                          type="button"
                                          className="iconButton"
                                          onClick={() => {
                                            closeHandler(index);
                                          }}
                                        >
                                          <DeleteOutlined />
                                        </button>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div
                              id="pdf-section"
                              className="actionplan-pdf-section d-none"
                            >
                              <JohariWindowPdfFile pdfData={pdfData} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <NoResult />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default ActionPlanJohariWindow;
