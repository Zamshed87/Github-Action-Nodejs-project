/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../common/FormikInput";
import FormikSelect from "../../common/FormikSelect";
import Loading from "../../common/loading/Loading";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../common/PrimaryButton";
import ResetButton from "../../common/ResetButton";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { monthFirstDate, monthLastDate } from "../../utility/dateFormatter";
import { downloadFile } from "../../utility/downloadFile";
import { customStyles } from "../../utility/selectCustomStyle";
import { todayDate } from "../../utility/todayDate";
import CardTable from "./components/CardTable";
import { getDailyCafeteriaReport, getMonthlyCafeteriaReport } from "./helper";

const initData = {
  search: "",
  reportType: { value: 1, label: "Daily" },
  date: todayDate(),
  fromDate: monthFirstDate(),
  toDate: monthLastDate(),
};

export default function FoodDetailsReport() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {
    if (values?.reportType?.value === 1) {
      getDailyCafeteriaReport(buId, values?.date, false, setRowDto, setLoading);
    } else {
      getMonthlyCafeteriaReport(
        buId,
        orgId,
        values?.fromDate,
        values?.toDate,
        false,
        setRowDto,
        setLoading
      );
    }
  };

  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const getData = () => {
    getDailyCafeteriaReport(buId, todayDate(), false, setRowDto, setLoading);
  };

  useEffect(() => {
    getData();
  }, [buId, orgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 145) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading d-flex flex-wrap">
                    <div className="d-flex">
                      <Tooltip title="Export CSV" arrow>
                        <button
                          className="btn-save ml-3"
                          type="button"
                          style={{
                            border: "transparent",
                            width: "30px",
                            height: "30px",
                            background: "#f2f2f7",
                            borderRadius: "100px",
                          }}
                          onClick={() => {
                            if (values?.reportType?.value === 1) {
                              downloadFile(
                                `/Cafeteria/GetDailyCafeteriaReport?businessUnitId=${buId}&mealDate=${values?.date}&isDownload=true`,
                                "Daily Cafeteria Details Report",
                                "xlsx",
                                setLoading
                              );
                            } else {
                              downloadFile(
                                `/Cafeteria/MonthlyCafeteriaReport?businessUnitId=${buId}&workPlaceId=${orgId}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&isDownload=true`,
                                "Monthly Cafeteria Details Report",
                                "xlsx",
                                setLoading
                              );
                            }
                          }}
                        >
                          <SaveAlt
                            sx={{ color: "#637381", fontSize: "16px" }}
                          />
                        </button>
                      </Tooltip>
                    </div>
                    <div className="table-card-head-right">
                      <div
                        className="d-flex align-items-end"
                        style={{ paddingBottom: "23px" }}
                      >
                        {isFilter && (
                          <div>
                            <ResetButton
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{ marginRight: "10px" }}
                                />
                              }
                              onClick={() => {
                                getDailyCafeteriaReport(
                                  buId,
                                  todayDate(),
                                  false,
                                  setRowDto,
                                  setLoading
                                );
                                setFieldValue("date", todayDate());
                                setFieldValue("reportType", {
                                  value: 1,
                                  label: "Daily",
                                });
                                setIsFilter(false);
                              }}
                            />
                          </div>
                        )}
                        <div style={{ marginRight: "15px", width: "250px" }}>
                          <FormikSelect
                            name="reportType"
                            isClearable={false}
                            options={[
                              { value: 1, label: "Daily" },
                              { value: 2, label: "Monthly" },
                            ]}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setFieldValue("reportType", valueOption);
                              if (valueOption?.value === 1) {
                                getDailyCafeteriaReport(
                                  buId,
                                  todayDate(),
                                  false,
                                  setRowDto,
                                  setLoading
                                );
                              } else {
                                getMonthlyCafeteriaReport(
                                  buId,
                                  orgId,
                                  values?.fromDate,
                                  values?.toDate,
                                  false,
                                  setRowDto,
                                  setLoading
                                );
                              }
                            }}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            // isDisabled={true}
                          />
                        </div>

                        {values?.reportType?.value === 1 && (
                          <div className="mr-3">
                            <small style={{color: "rgba(0, 0, 0, 0.87)"}}>Date</small>
                            <FormikInput
                              classes="input-sm"
                              type="date"
                              value={values?.date}
                              name="date"
                              onChange={(e) => {
                                setFieldValue("date", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}

                        {values?.reportType?.value === 2 && (
                          <>
                            <div className="mr-3">
                              <small>To Date</small>
                              <FormikInput
                                classes="input-sm"
                                type="date"
                                value={values?.fromDate}
                                name="fromDate"
                                onChange={(e) => {
                                  setFieldValue("fromDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="mr-3">
                              <small>To Date</small>
                              <FormikInput
                                classes="input-sm"
                                type="date"
                                value={values?.toDate}
                                name="toDate"
                                onChange={(e) => {
                                  setFieldValue("toDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <PrimaryButton
                            type="submit"
                            className="btn btn-default flex-center"
                            label={"View"}
                            onClick={() => {
                              setIsFilter(true);
                              // getDailyCafeteriaReport(
                              //   buId,
                              //   values?.date,
                              //   false,
                              //   setRowDto,
                              //   setLoading
                              // );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-card-body mt-0">
                    <CardTable propsObj={{ rowDto }} />
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
