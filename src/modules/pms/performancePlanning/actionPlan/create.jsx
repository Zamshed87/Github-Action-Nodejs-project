import { DownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import ActionPlanPdfFile from "./ActionPlanPdfFile";
import { actionPlanColumnData, pdfExport } from "./helper";
import "./styles.css";
import AntScrollTable from "../../../../common/AntScrollTable";

const initialValues = {
  activity: "",
  startDate: todayDate(),
  endDate: todayDate(),
  year: "",
  actionPlanType: {
    label: "KPI",
    value: 2,
  },
  individualKpi: "",
  achievementResult: "",
  targetedResult: "",
  kpiFrequency: "",
};

export default function ActionPlanCreate() {
  // 30411
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [individualKpiDDL, getIndividualKpiDDL, individualKpiDDLloader] =
    useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();

  const [activities, getActivities, activitiesLoader, setActivities] =
    useAxiosGet();

  const { employeeId, buId, orgId, strDesignation, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { errors, touched, handleSubmit, setFieldValue, values } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      if (activities.length === 0) {
        return toast.warn("Please add at least one activity");
      } else {
        const updatedActivities = activities.map((item) => {
          return {
            ...item,
            actualStardDate:
              item?.actualStardDate === "" ? null : item?.actualStardDate,
            actualEndDate:
              item?.actualEndDate === "" ? null : item?.actualEndDate,
          };
        });
        const payload = {
          typeReferenceId: values?.individualKpi?.value,
          typeReference: values?.individualKpi?.label,
          employeeId: employeeId,
          employeeName: userName,
          businessUnitId: buId,
          typeId: values?.actionPlanType?.value,
          type: values?.actionPlanType?.label,
          yearId: values?.year?.value,
          year: values?.year?.label,
          currentResult: values?.achievementResult,
          desiredResult: values?.targetedResult,
          actionDate: todayDate(),
          actionBy: employeeId,
          typeGroup: "WorkPlan",
          designation: strDesignation,
          row: updatedActivities,
        };
        saveData(`/PMS/PMSActionPlanCreateAndEdit`, payload, null, true);
      }
    },
  });

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initialValues.year = theYearData;
      setFieldValue("year", theYearData);
      getIndividualKpiDDL(
        `/PMS/ActionPlanKpiDDl?PartName=TargetedKPI&accountId=${orgId}&BusinessUnit=${buId}&YearId=${theYearData?.value}&KpiForId=1&KpiForReffId=${employeeId}`
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(saveDataLoader ||
        fiscalYearDDLloader ||
        individualKpiDDLloader ||
        activitiesLoader) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div></div>
          <ul className="d-flex flex-wrap">
            <li>
              <Button
                disabled={!activities?.length}
                className="mr-2"
                variant="outlined"
                onClick={(e) => {
                  e?.stopPropagation();
                  pdfExport("Action plan");
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
                  handleSubmit();
                }}
                className="btn btn-green w-100"
              >
                Save
              </button>
            </li>
          </ul>
        </div>

        <div className="table-card-body">
          <div className="card-style with-form-card pb-2 my-2 ">
            <div className="row">
              <div className="col-lg-4 mt-2">
                <div>
                  <p>
                    <span className="font-weight-bold">Name :</span>{" "}
                    <span>{userName}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-weight-bold">Enroll :</span>{" "}
                    <span>{employeeId}</span>
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div>
                  <p>
                    <span className="font-weight-bold">Designation :</span>{" "}
                    <span>{strDesignation}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-weight-bold">Workplace :</span>{" "}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="input-field-main col-md-3">
                  <label>Year</label>
                  <FormikSelect
                    classes="input-sm  form-control"
                    name="year"
                    options={fiscalYearDDL || []}
                    value={values?.year}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("year", valueOption);
                        getIndividualKpiDDL(
                          `/PMS/ActionPlanKpiDDl?PartName=TargetedKPI&accountId=${orgId}&BusinessUnit=${buId}&YearId=${valueOption?.value}&KpiForId=1&KpiForReffId=${employeeId}`
                        );
                      } else {
                        setFieldValue("year", "");
                        setFieldValue("individualKpi", "");
                        setFieldValue("actionPlanType", "");
                        setFieldValue("achievementResult", "");
                        setFieldValue("targetedResult", "");
                      }
                    }}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="input-field-main col-md-3">
                  <label>Action Plan Type</label>
                  <FormikSelect
                    classes="input-sm  form-control"
                    name="actionPlanType"
                    options={[
                      {
                        label: "KPI",
                        value: 2,
                      },
                    ]}
                    value={values?.actionPlanType}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("actionPlanType", valueOption);
                        setFieldValue("individualKpi", "");
                      } else {
                        setFieldValue("actionPlanType", "");
                        setFieldValue("individualKpi", "");
                      }
                    }}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="input-field-main col-md-3">
                  <label>Individual Kpi</label>
                  <FormikSelect
                    classes="input-sm  form-control"
                    name="individualKpi"
                    options={individualKpiDDL || []}
                    value={values?.individualKpi}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        getActivities(
                          `/PMS/PMSActionPlanView?EmployeeID=${employeeId}&kpiId=${valueOption?.value}`
                        );
                        setFieldValue("individualKpi", valueOption);
                        setFieldValue("kpiFrequency", {
                          label: valueOption?.targetFrequency,
                          value: valueOption?.targetFrequency,
                        });
                        setFieldValue("targetedResult", valueOption?.target);
                        setFieldValue(
                          "achievementResult",
                          valueOption?.achivement
                        );
                      } else {
                        setActivities([]);
                        setFieldValue("individualKpi", "");
                        setFieldValue("kpiFrequency", "");
                        setFieldValue("targetedResult", "");
                        setFieldValue("achievementResult", "");
                      }
                    }}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.year || !values?.actionPlanType}
                  />
                </div>
                <div className="input-field-main col-md-3">
                  <label>Kpi Frequency</label>
                  <FormikSelect
                    classes="input-sm  form-control"
                    name="kpiFrequency"
                    options={[]}
                    value={values?.kpiFrequency}
                    onChange={(valueOption) => {}}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="input-field-main  col-md-3">
                  <label>Targeted Result</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.targetedResult}
                    name="targetedResult"
                    type="number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("targetedResult", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="input-field-main  col-md-3">
                  <label>Achievement Result</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.achievementResult}
                    name="achievementResult"
                    type="number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("achievementResult", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="table-card-body mt-3">
          <div className="card-style with-form-card pb-2 my-2 ">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="input-field-main  col-md-3">
                  <label>Activity Name</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.activity}
                    name="activity"
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("activity", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    disabled={!values?.year || !values?.individualKpi}
                  />
                </div>
                <div className="input-field-main  col-md-3">
                  <label>Start Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.startDate}
                    name="startDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("startDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    disabled={!values?.year}
                  />
                </div>
                <div className="input-field-main  col-md-3">
                  <label>End Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.endDate}
                    name="endDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("endDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    disabled={!values?.year}
                  />
                </div>
                <div className="col-md-3 mt-4">
                  <PrimaryButton
                    onClick={() => {
                      const isExist = activities.find(
                        (item) => item?.activity === values?.activity
                      );
                      if (isExist) {
                        return toast.warn("Activity already added");
                      }
                      if (values?.startDate > values?.endDate) {
                        return toast.warn(
                          "Start date must be less than end date"
                        );
                      }
                      const data = {
                        rowId: 0,
                        actionPlanHeaderId: 0,
                        activity: values?.activity,
                        stardDate: values?.startDate,
                        endDate: values?.endDate,
                        actualStardDate: "",
                        actualEndDate: "",
                        actionDate: todayDate(),
                        actionBy: employeeId,
                        kpiId: values?.individualKpi?.value,
                      };
                      setActivities((prev) => [...prev, data]);
                      setFieldValue("activity", "");
                    }}
                    type="button"
                    className="btn btn-green flex-center"
                    label="Add"
                    disabled={
                      !values?.activity ||
                      !values?.startDate ||
                      !values?.endDate
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="table-card-body">
          <div className="table-card-styled table-responsive tableOne mt-2">
            <AntScrollTable
              data={activities}
              columnsData={actionPlanColumnData(activities, setActivities)}
              rowKey={(item) => item?.index}
              removePagination={true}
            />
          </div>
        </div>

        <div id="pdf-section" className="actionplan-pdf-section d-none">
          {activities?.length && (
            <ActionPlanPdfFile
              year={values?.year}
              targetedResult={values?.targetedResult}
              achievementResult={values?.achievementResult}
              rowData={activities}
            />
          )}
        </div>
      </div>
    </>
  );
}
