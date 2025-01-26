import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import {
  getAsyncEmployeeApi,
  getAsyncEmployeeCommonApi,
} from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import PmsCentralTable from "../../../../common/pmsTable";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getFiscalYearForNowOnLoad } from "./helper";
import FormikCheckBox from "common/FormikCheckbox";
import { gray900, greenColor } from "utility/customColor";
import IConfirmModal from "common/IConfirmModal";

const initData = {
  fromEmployee: "",
  fromYear: "",
  toEmployee: "",
  toYear: "",
};

const CopyKpi = () => {
  // 30474
  const [
    fromEmployeeKpi,
    getFromEmployeeKpi,
    fromEmployeeKpiLoader,
    setFromEmployeeKpi,
  ] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [, saveCopyKpi, saveCopyKpiLoader] = useAxiosPost();
  const {
    profileData: { orgId, buId, profileData },
  } = useSelector((store) => store?.auth, shallowEqual);

  const saveHandeler = (values, cb) => {
    if (!values?.fromEmployee) {
      return toast.warn("Please select from employee");
    }
    if (!values?.fromYear) {
      return toast.warn("Please select from year");
    }
    if (!values?.toEmployee) {
      return toast.warn("Please select to employee");
    }
    if (!values?.toYear) {
      return toast.warn("Please select to year");
    }
    if (values?.fromEmployee?.value === values?.toEmployee?.value) {
      return toast.warn("From and to employee can not be same");
    }

    if (
      (values?.cloneType?.value === 1 && !fromEmployeeKpi?.infoList?.length) ||
      (values?.cloneType?.value === 2 && !fromEmployeeKpi?.length)
    ) {
      return toast.warn("No data found");
    }

    const payload = {
      fromEmployeeID: values?.fromEmployee?.value,
      fromYear: values?.fromYear?.value,
      toEmployeeId: values?.toEmployee?.value,
      toYear: values?.toYear?.value,
      accountId: orgId,
      businessUnit: buId,
      departmentId: 0,
      designationId: 0,
      createdBy: profileData?.employeeId,
      kpiForId: 1,
      objectiveId: 0,
      kpiId: 0,
      isTarget: values?.cloneType?.value === 2 ? undefined : values?.isTarget,
    };
    saveCopyKpi(
      values?.cloneType?.value === 2
        ? `/PMS/CopyKPIWithoutTarget`
        : `/PMS/CopyKPI`,
      payload,
      null,
      true
    );
    cb && cb();
  };

  const doConfirmation = (setFieldValue) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to clone target?`,
      yesAlertFunc: () => {
        setFieldValue("isTarget", true);
      },
      noAlertFunc: () => setFieldValue("isTarget", false),
    };
    IConfirmModal(confirmObject);
  };

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("fromYear", theYearData);
      setFieldValue("toYear", theYearData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const getFromEmployeeKpiList = () => {
    let url;
    if (values?.cloneType?.value === 2) {
      url = `/PMS/GetKpiByEmployeeId?kpiForReffId=${values?.fromEmployee?.value}&businessUnitId=${buId}`;
    } else {
      url = `/PMS/GetKpiChartReport?PartName=TargetedKPI&BusinessUnit=${buId}&YearId=${values?.year?.value}&KpiForId=1&KpiForReffId=${values?.fromEmployee?.value}&accountId=${orgId}&from=1&to=12`;
    }

    getFromEmployeeKpi(url);

    // hard coded from and to instructed by Sazzad
  };

  return (
    <>
      {(fiscalYearDDLloader || fromEmployeeKpiLoader || saveCopyKpiLoader) && (
        <Loading />
      )}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h2 style={{ color: "#344054" }}>Clone KPI</h2>
          </div>
          <ul className="d-flex flex-wrap">
            {values?.cloneType?.value === 1 && (
              <FormikCheckBox
                label="With Target"
                styleObj={{
                  margin: "0 auto!important",
                  color: gray900,
                  checkedColor: greenColor,
                  padding: "1px",
                }}
                name="isTarget"
                color={greenColor}
                checked={values?.isTarget}
                onChange={(e) => {
                  if (e.target.checked) {
                    doConfirmation(setFieldValue);
                  } else {
                    setFieldValue("isTarget", false);
                  }
                }}
                // disabled={item?.ApplicationStatus === "Approved"}
              />
            )}

            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label={"Save"}
                icon={
                  <SaveAltIcon sx={{ marginRight: "11px", fontSize: "16px" }} />
                }
                onClick={(e) => {
                  saveHandeler(values, () => {});
                }}
              />
            </li>
          </ul>
        </div>
        <div className="card-style pb-0 mb-2">
          <div className="row">
            <div className="col-lg-3">
              <label>Clone Type</label>
              <FormikSelect
                classes="input-sm form-control"
                name="cloneType"
                placeholder="Select Clone Type"
                options={[
                  { label: "Map With Target", value: 1 },
                  { label: "Map Without Target", value: 2 },
                ]}
                value={values?.cloneType}
                onChange={(valueOption) => {
                  setFieldValue("cloneType", valueOption);
                }}
                styles={customStyles}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>From Employee</label>
                <AsyncFormikSelect
                  isClear={true}
                  selectedValue={values?.fromEmployee}
                  styles={{
                    control: (provided) => ({
                      ...customStyles?.control(provided),
                      width: "100%",
                    }),
                  }}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("fromEmployee", valueOption);
                    } else {
                      setFieldValue("fromEmployee", "");
                      setFromEmployeeKpi([]);
                    }
                  }}
                  loadOptions={async (value) => {
                    return getAsyncEmployeeApi({
                      orgId,
                      buId: buId,
                      intId: 0,
                      value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <label>From Year</label>
              <FormikSelect
                classes="input-sm form-control"
                name="fromYear"
                placeholder="Select Year"
                options={fiscalYearDDL || []}
                value={values?.fromYear}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("fromYear", valueOption);
                  } else {
                    setFieldValue("fromYear", "");
                    setFromEmployeeKpi([]);
                  }
                }}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-2">
              <button
                type="button"
                className="btn btn-green mr-2"
                style={{ marginTop: "22px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  getFromEmployeeKpiList();
                }}
                disabled={
                  !values?.fromEmployee || !values?.year || !values?.cloneType
                }
              >
                View
              </button>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>To Employee</label>
                <AsyncFormikSelect
                  isClear={true}
                  selectedValue={values?.toEmployee}
                  styles={{
                    control: (provided) => ({
                      ...customStyles?.control(provided),
                      width: "100%",
                    }),
                  }}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("toEmployee", valueOption);
                    } else {
                      setFieldValue("toEmployee", "");
                    }
                  }}
                  loadOptions={async (value) => {
                    return getAsyncEmployeeApi({
                      orgId,
                      buId: buId,
                      intId: 0,
                      value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <label>To Year</label>
              <FormikSelect
                classes="input-sm form-control"
                name="toYear"
                placeholder="Select Year"
                options={fiscalYearDDL || []}
                value={values?.toYear}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("toYear", valueOption);
                  } else {
                    setFieldValue("toYear", "");
                  }
                }}
                styles={customStyles}
              />
            </div>
          </div>
        </div>
        {/* table */}
        {values?.cloneType?.value === 1 ? (
          <div className="achievement resKpi">
            <PmsCentralTable
              header={[
                { name: "BSC" },
                { name: "Objective" },
                { name: "KPI" },
                { name: "SRF" },
                { name: "Weight" },
                { name: "Benchmark" },
                { name: "Target" },
                //   { name: "Ach." },
                //   { name: "Progress" },
                //   { name: "Score" },
              ]}
            >
              {fromEmployeeKpi?.infoList?.map((itm, indx) => (
                <>
                  {itm.dynamicList.map((item, index) => (
                    <tr
                      key={item?.kpiId}
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {index === 0 && (
                        <td
                          className={`bsc bsc${indx}`}
                          rowSpan={itm.dynamicList.length}
                        >
                          <div>{itm?.bsc}</div>
                        </td>
                      )}
                      {item?.isParent && (
                        <td className="obj" rowSpan={item?.numberOfChild}>
                          {" "}
                          {item?.parentName}{" "}
                        </td>
                      )}
                      <td
                        style={{
                          width: "250px",
                        }}
                      >
                        {" "}
                        {item?.label}{" "}
                      </td>
                      <td> {item?.strFrequency} </td>
                      <td className="text-center">
                        {" "}
                        {item?.numWeight === 0 ? "" : item?.numWeight}{" "}
                      </td>
                      <td className="text-center">
                        {" "}
                        {item?.benchmark === 0 ? "" : item?.benchmark}{" "}
                      </td>
                      <td className="text-center">
                        {" "}
                        {item?.numTarget === 0 ? "" : item?.numTarget}{" "}
                      </td>
                      {/* {item?.parentName !== "Total" ? (
                      <td className="text-center">
                        <span>{item?.numAchivement}</span>
                      </td>
                    ) : (
                      <td></td>
                    )}
                    {item?.parentName !== "Total" ? (
                      <td
                        style={{
                          minWidth: "90px",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        <span>{item?.progress} % </span>
                        <i
                          className={`fas fa-arrow-alt-${item?.arrowText}`}
                        ></i>
                      </td>
                    ) : (
                      <td></td>
                    )}
                    <td className="text-center"> {item?.score}</td> */}
                    </tr>
                  ))}
                </>
              ))}
            </PmsCentralTable>
          </div>
        ) : (
          <div className="achievement resKpi">
            <PmsCentralTable
              header={[
                { name: "Objective Type" },
                { name: "Objective Name" },
                { name: "KPI" },
                // { name: "Weight" },
                // { name: "Benchmark" },
                // { name: "Target" },
                //   { name: "Ach." },
                //   { name: "Progress" },
                //   { name: "Score" },
              ]}
            >
              {fromEmployeeKpi?.map((item, index) => (
                <>
                  <tr key={item?.kpiId}>
                    <td
                      style={{
                        width: "250px",
                      }}
                    >
                      {" "}
                      {item?.objectiveType}{" "}
                    </td>
                    <td
                      style={{
                        width: "250px",
                      }}
                    >
                      {" "}
                      {item?.objective}{" "}
                    </td>
                    <td
                      style={{
                        width: "250px",
                      }}
                    >
                      {" "}
                      {item?.kpiName}{" "}
                    </td>
                  </tr>
                </>
              ))}
            </PmsCentralTable>
          </div>
        )}
      </div>
    </>
  );
};

export default CopyKpi;
