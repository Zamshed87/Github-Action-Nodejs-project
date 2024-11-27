import React from "react";
import { Form, Formik } from "formik";
import { useState } from "react";
import Loading from "../../../../../common/loading/Loading";
import styles from "./style.css";
import DefaultInput from "../../../../../common/DefaultInput";
import { useEffect } from "react";
// import { attachment_action, getTargetFrequency } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
// import { useRef } from "react";
// import { FileUpload } from "@mui/icons-material";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import { todayDate } from "../../../../../utility/todayDate";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";

const initData = {};

const IndividualKpiModal = ({
  currentItem,
  setIsShowModal,
  empInfo,
  previousLandingvalues,
  getData,
}) => {
  const [targetList, setTargetList] = useState([]);
  const { intAccountId, intEmployeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const [attachmentLoader, setAttachmentLoader] = useState(false);
  const [, getPreviousEntryData, previousEntryDataLoader] = useAxiosGet();
  const [, saveIndividualKpi, saveIndividualKpiLoader] = useAxiosPost();

  useEffect(() => {
    if (currentItem) {
      getPreviousEntryData(
        `/PMS/GetTargetVsAchievementById?BusinessUnit=184&YearId=${previousLandingvalues?.year?.value}&KpiForId=1&KpiForReffId=${empInfo?.value}&objectiveId=${currentItem?.intStrategicParticularsID}&kpiId=${currentItem?.kpiId}&accountId=${intAccountId}`,
        (data) => {
          setTargetList(data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  const saveHandler = (values, cb) => {
    const payload = [];
    targetList?.forEach((item) => {
      payload.push({
        saveTargetOrAchievement: "Achievement",
        intTargetId: item?.intTargetId || 0,
        intAccountId: intAccountId,
        intBusinessUnitId: empInfo?.intBusinessUnitId,
        intKpisId: currentItem?.kpiId,
        intEmployeeId: empInfo?.EmployeeId,
        numTarget: +item?.numTarget,
        numWeightage: 0,
        strTargetFrequency: "",
        intFrequencyValue: 0,
        strFrequencyValue: item?.strFrequencyValue,
        numBenchmark: 0,
        intYearId: 0,
        strUrl: "",
        strDataSource: "",
        isActive: true,
        intChartId: 0,
        isShownDashboard: true,
        intCreatedBy: intEmployeeId,
        dteCreatedAt: todayDate(),
        numAchivement: +item?.numAchivement,
        remarks: item?.remarks,
        intKpiforId: 1, // 1 for employee
        departmentId: 0, // if employye then department 0
      });
    });
    // saveIndividualtarget(`/PMS/SaveTargetVsAchievement`, payload, cb, true);
    saveIndividualKpi(`/PMS/SaveTargetVsAchievement`, payload, cb, true);
  };

  // image
  // const inputFile = useRef(null);
  // const onButtonClick = () => {
  //   inputFile.current.click();
  // };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          setIsShowModal(false);
          getData(previousLandingvalues);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {
              // attachmentLoader ||
              (previousEntryDataLoader || saveIndividualKpiLoader) && (
                <Loading />
              )
            }
            <div>
              <div
                className="modalBody"
                style={{ padding: "0px 16px", height: "500px" }}
              >
                <div className="row">
                  <div className="col-lg-12 pl-5 pr-5">
                    <p
                      style={{
                        fontSize: "16px",
                      }}
                      className="mt-3 pb-3 employee_info"
                    >
                      <b>KPI Name:</b> {currentItem?.kpi}
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                      }}
                      className="mt-3 pb-3 employee_info"
                    >
                      <b> Name</b> : {empInfo?.EmployeeOnlyName}
                      <b> Enroll</b> : {empInfo?.EmployeeId}
                      <b> Designation</b> : {empInfo?.DesignationName}
                    </p>
                  </div>

                  <div className="col-md-12 pl-5 pr-5">
                    {targetList?.length > 0 ? (
                      <div className="table-card-styled employee-table-card tableOne">
                        <table className="table">
                          {" "}
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>Sl</th>
                              <th
                                className="text-center"
                                style={{ width: "200px" }}
                              >
                                {currentItem?.strFrequency === "Monthly"
                                  ? "Months"
                                  : currentItem?.strFrequency === "Quarterly"
                                  ? "Quarters"
                                  : "Year"}
                              </th>
                              <th style={{ width: "200px" }}>Target</th>
                              <th style={{ width: "200px" }}>Actual</th>
                              <th style={{ width: "300px" }}>Remarks</th>
                              {/* <th style={{ width: "200px" }}>Attachment</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {targetList?.map((item, index) => (
                              <tr
                                className={
                                  styles.targetSetupTableRowOnHoverStyle
                                }
                              >
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.strFrequencyValue}
                                </td>
                                <td>
                                  <DefaultInput
                                    classes="input-sm"
                                    value={targetList[index]?.numTarget || ""}
                                    type="number"
                                    className="form-control"
                                    onChange={(e) => {
                                      const modifiedTargetList =
                                        targetList?.map(
                                          (nestedItem, nestedIndex) =>
                                            index === nestedIndex
                                              ? {
                                                  ...nestedItem,
                                                  numTarget: e.target.value,
                                                }
                                              : nestedItem
                                        );
                                      setTargetList(modifiedTargetList);
                                    }}
                                    disabled={true}
                                  />
                                </td>
                                <td>
                                  <DefaultInput
                                    classes="input-sm"
                                    value={targetList[index]?.numAchivement}
                                    type="number"
                                    className="form-control"
                                    onChange={(e) => {
                                      const modifiedTargetList =
                                        targetList?.map(
                                          (nestedItem, nestedIndex) =>
                                            index === nestedIndex
                                              ? {
                                                  ...nestedItem,
                                                  numAchivement: e.target.value,
                                                }
                                              : nestedItem
                                        );
                                      setTargetList(modifiedTargetList);
                                    }}
                                  />
                                </td>
                                <td>
                                  <DefaultInput
                                    classes="input-sm"
                                    value={targetList[index]?.remarks || ""}
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => {
                                      const modifiedTargetList =
                                        targetList?.map(
                                          (nestedItem, nestedIndex) =>
                                            index === nestedIndex
                                              ? {
                                                  ...nestedItem,
                                                  remarks: e.target.value,
                                                }
                                              : nestedItem
                                        );
                                      setTargetList(modifiedTargetList);
                                    }}
                                  />
                                </td>
                                {/* <td>
                                  <div
                                    onClick={onButtonClick}
                                    className="d-inline-block mt-2 pointer uplaod-para"
                                  >
                                    <input
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          attachment_action(
                                            orgId,
                                            "LeaveAndMovement",
                                            15,
                                            buId,
                                            employeeId,
                                            e.target.files,
                                            setAttachmentLoader
                                          )
                                            .then((data) => {
                                            })
                                            .catch((error) => {
                                            });
                                        }
                                      }}
                                      type="file"
                                      id="file"
                                      ref={inputFile}
                                      style={{ display: "none" }}
                                    />
                                    <div style={{ fontSize: "14px" }}>
                                      <FileUpload
                                        sx={{
                                          marginRight: "5px",
                                          fontSize: "18px",
                                        }}
                                      />{" "}
                                      Click to upload
                                    </div>
                                  </div>
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer form-modal-footer">
                <button
                  type="button"
                  className="btn btn-cancel"
                  style={{
                    marginRight: "15px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-green btn-green-disable"
                  style={{ width: "auto" }}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default IndividualKpiModal;
