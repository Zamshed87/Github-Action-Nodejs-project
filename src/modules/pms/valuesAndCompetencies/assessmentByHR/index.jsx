// you must have to remove all codes to the required router before merge
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import Loading from "../../../../common/loading/Loading";
import { useFormik } from "formik";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { monthDDL } from "../../../../utility/monthUtility";
import PmsCommonTable from "./PmsCommonTable";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "@mui/material";
// import { erpBaseUrl } from "../../../../common/ErpBaseUrl";
import ViewModal from "../../../../common/ViewModal";
import ViewForm from "./view/mainForm";

const initData = {
  employee: "",
  year: "",
  fromMonth: "",
  toMonth: "",
};

const AssessmentByHR = () => {
  const [data, getData, dataLoader, setData] = useAxiosGet();
  const [userInfo, getUserInfo, userInfoLoader] = useAxiosGet();
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30399),
    [permissionList]
  );
  const { values, setFieldValue, errors, touched } = useFormik({
    initialValues: initData,
  });
  const [empDDL, setEmpDDL] = useState([]);
  const [yearDDL, getYearDDL] = useAxiosGet();
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "EmployeeId",
      "EmployeeNameWithCode",
      setEmpDDL
    );
    getYearDDL(`/PMS/GetFiscalYearDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function findWeight(data) {
    let sum = 0;
    for (let i = 0; i < data?.length; i++) {
      let item = data[i].dynamicList;
      for (let j = 0; j < item?.length; j++) {
        sum = sum + item[j].numWeight;
      }
    }
    return sum;
  }
  const weight = (dataOne, itm, i) => {
    if (i < dataOne?.length - 1) {
      return itm?.numWeight;
    } else {
      return findWeight(dataOne);
    }
  };

  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  return (
    <>
      <>
        {(dataLoader || userInfoLoader) && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "12px" }}
            >
              <div>
                <h2 style={{ color: "#344054" }}>Individual KPI</h2>
              </div>
            </div>
            <div className="card-style pb-0 mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Employee</label>
                    <FormikSelect
                      classes="input-sm"
                      name="employee"
                      options={empDDL}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Year</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="year"
                      placeholder="Select Year"
                      options={yearDDL || []}
                      value={values?.year}
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                      }}
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Select From Month</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="fromMonth"
                      placeholder="Select month"
                      options={monthDDL}
                      value={values?.fromMonth}
                      onChange={(valueOption) => {
                        setFieldValue("fromMonth", valueOption);
                      }}
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Select To Month</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="toMonth"
                      placeholder="Select month"
                      options={monthDDL}
                      value={values?.toMonth}
                      onChange={(valueOption) => {
                        setFieldValue("toMonth", valueOption);
                      }}
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "21px" }}
                    className="btn btn-green btn-green-disable mb-2"
                    type="button"
                    disabled={false}
                    onClick={() => {
                      getUserInfo(
                        `/pms/KPI/GetEmployeeBasicInfoById?EmployeeId=${values?.employee?.value}`,
                        () => {
                          getData(
                            `/pms/Kpi2/GetKpiReportDynamic?intUnitID=4&ReportTypeReffId=1266&intYearId=13&intFromMonthId=13&intToMonthId=14&isDashBoard=false&ReportType=1&SectionId=0`
                          );
                        }
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            {/* user infos */}
            <div className="card-style pb-0 mb-2">
              <p className="mt-3 mb-3 employee_info">
                <b> Enroll</b> : {userInfo?.employeeId}, <b> Designation</b> :{" "}
                {userInfo?.designationName}, <b> Department</b> :{" "}
                {userInfo?.departmentName}, <b> Supervisor</b> :{" "}
                {userInfo?.supervisorName}, <b> Sbu</b> : {userInfo?.sbuName},{" "}
                <b> Business Unit</b> : {userInfo?.businessUnitName}
              </p>
            </div>
            {/* table */}
            <div className="achievement">
              <PmsCommonTable
                ths={[
                  { name: "BSC" },
                  { name: "Objective" },
                  { name: "KPI" },
                  { name: "SRF" },
                  { name: "Weight" },
                  { name: "Benchmark" },
                  { name: "Target" },
                  { name: "Ach." },
                  { name: "Progress" },
                  { name: "Score" },
                ]}
              >
                {data?.infoList?.map((itm, indx) => (
                  <>
                    {itm.dynamicList.map((item, index) => (
                      <tr>
                        {index === 0 && (
                          <td
                            className={`bsc bsc${indx}`}
                            rowspan={itm.dynamicList.length}
                          >
                            <div>{itm?.bsc}</div>
                          </td>
                        )}
                        {item?.isParent && (
                          <td className="obj" rowspan={item?.numberOfChild}>
                            {" "}
                            {item?.parentName}{" "}
                          </td>
                        )}
                        <td> {item?.label} </td>
                        <td> {item?.strFrequency} </td>
                        <td> {weight(data?.infoList, item, indx)} </td>
                        <td> {item?.benchmark} </td>
                        <td> {item?.numTarget} </td>
                        <td>
                          {indx !== data?.infoList.length - 1 && (
                            <OverlayTrigger
                              overlay={
                                <Tooltip
                                  className="mytooltip"
                                  id="info-tooltip"
                                >
                                  <span>Achievement Entry</span>
                                </Tooltip>
                              }
                            >
                              <span
                                style={{
                                  padding: "16px 16px",
                                  cursor: "pointer",
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                                onClick={() => {
                                  setCurrentItem({
                                    kpiId: item.kpiId,
                                    frId: item.intFrequency,
                                    year: item?.intYearId,
                                    enroll: userInfo?.employeeId,
                                    selectedYear: values?.year?.value,
                                    objective: item?.objective,
                                    kpi: item?.kpi,
                                    setData,
                                  });
                                  setIsShowModal(true);
                                }}
                              >
                                {item?.numAchivement}
                              </span>
                            </OverlayTrigger>
                          )}{" "}
                        </td>
                        <td>
                          {indx !== data?.infoList.length - 1 && (
                            <div className="text-right">
                              {item?.progress}%{" "}
                              <i
                                className={`ml-2 fas fa-arrow-alt-${item?.arrowText}`}
                              ></i>
                            </div>
                          )}
                        </td>
                        <td>{item?.score}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </PmsCommonTable>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </>
      {/* add modal here */}
      <ViewModal
        size="xl"
        title="KPI Entry"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <ViewForm currentItem={currentItem} setIsShowModal={setIsShowModal} />
      </ViewModal>
    </>
  );
};

export default AssessmentByHR;
