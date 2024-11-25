import React from "react";
import { todayDate } from "../../../../utility/todayDate";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import Loading from "../../../../common/loading/Loading";
import styles from "./style.css";
import DefaultInput from "../../../../common/DefaultInput";

const initData = {};
const DepartmentalKpiEntryModal = ({
  currentItem,
  setIsShowModal,
  profileData,
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
        `/PMS/GetTargetVsAchievementById?BusinessUnit=184&YearId=${previousLandingvalues?.year?.value}&KpiForId=2&KpiForReffId=${previousLandingvalues?.department?.value}&objectiveId=${currentItem?.intStrategicParticularsID}&kpiId=${currentItem?.kpiId}&accountId=${intAccountId}`,
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
        intBusinessUnitId: profileData?.buId,
        intKpisId: currentItem?.kpiId,
        intEmployeeId: profileData?.employeeId,
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
        intKpiforId: 2, // 1 for employee
        departmentId: previousLandingvalues?.department?.value, // if employye then department 0
      });
    });
    saveIndividualKpi(`/PMS/SaveTargetVsAchievement`, payload, cb, true);
  };

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
            {(previousEntryDataLoader || saveIndividualKpiLoader) && (
              <Loading />
            )}
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
                      className="mt-3 pb-3 "
                    >
                      <b>KPI Name:</b> {currentItem?.kpi}
                      <b className="ml-2"> Department</b> :{" "}
                      {previousLandingvalues?.department?.label}
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

export default DepartmentalKpiEntryModal;
