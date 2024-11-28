import React, { useEffect } from "react";
import FormikSelect from "../../../../common/FormikSelect";
import { useFormik } from "formik";
import { customStyles } from "../../../../utility/selectCustomStyle";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../common/loading/Loading";
import { quarterDDL } from "../../../../utility/quaterDDL";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";
import DefaultInput from "../../../../common/DefaultInput";
import { toast } from "react-toastify";

const initData = {
  autoId: 0,
  assesmentPeriod: "",
  assesmentEntry: "",
  year: "",
  quater: "",
  assesmentCloseDate: "",
};

const BarAssesmentCongig = () => {
  // 30488
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [, getAssesmentConfig, assesmentConfigLoader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getPreviousData = () => {
    getAssesmentConfig(
      `/PMS/GetBarAssesmentPeriodConfig?accountId=${orgId}`,
      (data) => {
        if (data?.autoId > 0) {
          initData.autoId = data?.autoId;
          initData.assesmentPeriod = {
            value: data?.periodType,
            label: data?.periodType,
          };
          initData.assesmentEntry = {
            value: data?.openForAssesment ? "Enable" : "Disable",
            label: data?.openForAssesment ? "Enable" : "Disable",
          };
          initData.year = {
            value: data?.openYearId,
            label: data?.openYearLabel,
          };
          const quaterData = quarterDDL.find(
            (item) => item?.value === data?.openQuater
          );
          initData.quater = quaterData;
          initData.assesmentCloseDate = data?.assesmentCloseDate;
        }
      }
    );
  };

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initData,
    onSubmit: (formValues) => {
      if (!formValues?.assesmentPeriod) {
        return toast.warn("Please Select Assesment Period");
      }
      if (!formValues?.assesmentEntry) {
        return toast.warn("Please Select Assesment Entry");
      }
      if (!formValues?.year) {
        return toast.warn("Please Select Year");
      }
      if (
        !formValues?.quater &&
        formValues?.assesmentPeriod?.value === "Quaterly"
      ) {
        return toast.warn("Please Select Quater");
      }
      if (!formValues?.assesmentCloseDate) {
        return toast.warn("Please Select Assesment Entry Disable At");
      }
      const payload = {
        autoId: formValues?.autoId,
        accountId: orgId,
        periodType: formValues?.assesmentPeriod?.value,
        openForAssesment:
          formValues?.assesmentEntry?.value === "Enable" ? true : false,
        openYearId: formValues?.year?.value,
        openQuater: formValues?.quater?.value || 0,
        assesmentCloseDate: formValues?.assesmentCloseDate,
        createdBy: employeeId,
      };
      saveData(
        `/PMS/SaveBarAssesmentPeriodConfig`,
        payload,
        () => {
          getPreviousData();
        },
        true
      );
    },
  });

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
    getPreviousData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(fiscalYearDDLloader || saveDataLoader || assesmentConfigLoader) && (
        <Loading />
      )}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <h2>Bar Assesment Config</h2>
          </div>
          <ul className="d-flex flex-wrap">
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
        <div className="card-style pb-0 mb-2">
          <form onSubmit={handleSubmit}></form>
          <div className="row">
            <div className="col-lg-3">
              <label>Assesment Period </label>
              <FormikSelect
                classes="input-sm form-control"
                name="assesmentPeriod"
                options={[
                  {
                    value: "Yearly",
                    label: "Yearly",
                  },
                  {
                    value: "Quaterly",
                    label: "Quaterly",
                  },
                ]}
                value={values?.assesmentPeriod}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("assesmentPeriod", valueOption);
                    setFieldValue("quater", "");
                  } else {
                    setFieldValue("assesmentPeriod", "");
                    setFieldValue("quater", "");
                  }
                }}
                styles={customStyles}
                isDisabled={values?.autoId > 0}
              />
            </div>
          </div>
        </div>
        <div className="card-style pb-0 mb-2">
          <div className="row">
            <div className="col-lg-3">
              <label>Assesment Entry</label>
              <FormikSelect
                classes="input-sm form-control"
                name="assesmentEntry"
                options={[
                  {
                    value: "Enable",
                    label: "Enable",
                  },
                  {
                    value: "Disable",
                    label: "Disable",
                  },
                ]}
                value={values?.assesmentEntry}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("assesmentEntry", valueOption);
                  } else {
                    setFieldValue("assesmentEntry", "");
                  }
                }}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <label>Year</label>
              <FormikSelect
                classes="input-sm form-control"
                name="year"
                options={fiscalYearDDL || []}
                value={values?.year}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("year", valueOption);
                  } else {
                    setFieldValue("year", "");
                  }
                }}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Quarter</label>
                <FormikSelect
                  name="quater"
                  options={quarterDDL}
                  value={values?.quater}
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("quater", valueOption);
                    } else {
                      setFieldValue("quater", "");
                    }
                  }}
                  styles={customStyles}
                  isDisabled={values?.assesmentPeriod?.value === "Yearly"}
                />
              </div>
            </div>
            <div className="col-lg-3">
              {console.log("values", values)}
              <div className="input-field-main">
                <label>Assesment Entry Disable At</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.assesmentCloseDate}
                  name="assesmentCloseDate"
                  type="datetime-local"
                  className="form-control"
                  onChange={(e) => {
                    console.log("clicked", e.target.value);
                    setFieldValue("assesmentCloseDate", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarAssesmentCongig;
