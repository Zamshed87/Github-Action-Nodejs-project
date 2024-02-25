import { SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../common/FormikInput";
import FormikSelect from "../../common/FormikSelect";
import Loading from "../../common/loading/Loading";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../utility/customColor";
import { monthFirstDate, monthLastDate } from "../../utility/dateFormatter";
import { downloadFile } from "../../utility/downloadFile";
import { customStyles } from "../../utility/selectCustomStyle";
import { todayDate } from "../../utility/todayDate";
import CardTable from "./components/CardTable";
import {
  getDailyCafeteriaReport,
  getMonthlyCafeteriaReport,
  getPlaceDDL,
} from "./helper";

const initData = {
  search: "",
  reportType: { value: 1, label: "Daily" },
  place: "",
  date: todayDate(),
  fromDate: monthFirstDate(),
  toDate: monthLastDate(),
};

export default function FoodDetailsReport() {
  const [viewType, setViewType] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);
  const {
    profileData: { orgId, buId, wgId },
    permissionList,
  } = useSelector((state) => state?.auth, shallowEqual);

  const saveHandler = (values) => {
    if (values?.reportType?.value === 1) {
      getDailyCafeteriaReport(
        orgId,
        values?.place?.value,
        values?.date,
        false,
        setRowDto,
        setLoading
      );
    } else {
      getMonthlyCafeteriaReport(
        orgId,
        values?.fromDate,
        values?.toDate,
        false,
        setRowDto,
        setLoading,
        values?.place?.value
      );
    }
  };

  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [placeDDL, setPlaceDDL] = useState([]);

  const getData = () => {
    getDailyCafeteriaReport(
      orgId,
      0,
      todayDate(),
      false,
      setRowDto,
      setLoading
    );
  };
  const total = useMemo(
    () =>
      rowDto.reduce(
        (acc, item) => acc + +item?.mealCount || acc + +item?.total,
        0
      ),
    [rowDto]
  );
  useEffect(() => {
    getData();
  }, [buId, orgId]);

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 145),
    []
  );
  useEffect(() => {
    getPlaceDDL("mealConsume", orgId, setPlaceDDL, buId, wgId);
  }, [orgId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          place: { value: 0, label: "All" },
        }}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading d-flex flex-wrap">
                    <div className="d-flex">
                      <Tooltip title="Export CSV" arrow>
                        <button
                          className="btn-save"
                          type="button"
                          style={{
                            border: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (values?.reportType?.value === 1) {
                              downloadFile(
                                `/PdfAndExcelReport/GetDailyCafeteriaReport?accountId=${orgId}&mealDate=${
                                  values?.date
                                }&isDownload=true&MealConsumePlaceId=${
                                  values?.place?.value || 0
                                }`,
                                "Daily Cafeteria Details Report",
                                "xlsx",
                                setLoading
                              );
                            } else {
                              downloadFile(
                                `/PdfAndExcelReport/GetCafeteriaReportExcell?PartId=1&FromDate=${
                                  values?.fromDate
                                }&ToDate=${
                                  values?.toDate
                                }&ReportType=0&LoginBy=0&BusinessUnitId=0&MealConsumePlaceId=${
                                  values?.place?.value || 0
                                }`,
                                "Monthly Cafeteria Details Report",
                                "xlsx",
                                setLoading
                              );
                            }
                          }}
                        >
                          <SaveAlt sx={{ color: gray600, fontSize: "16px" }} />
                        </button>
                      </Tooltip>
                      <div className="ml-2 ">
                        {rowDto?.length > 0 ? (
                          <>
                            <h6 className="count">Total {total} Meals</h6>
                          </>
                        ) : (
                          <>
                            <h6 className="count">Total meal 0</h6>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="table-card-head-right">
                      <div className="d-flex align-items-end">
                        {/* {isFilter && (
                          <div>
                            <div style={{ marginTop: "-30px" }}>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{ marginRight: "7px" }}
                                  />
                                }
                                onClick={() => {
                                  setViewType(1);
                                  getDailyCafeteriaReport(
                                    orgId,
                                    0,
                                    todayDate(),
                                    false,
                                    setRowDto,
                                    setLoading
                                  );
                                  setFieldValue("date", todayDate());
                                  setFieldValue("place", {
                                    value: 0,
                                    label: "All",
                                  });
                                  setFieldValue("reportType", {
                                    value: 1,
                                    label: "Daily",
                                  });
                                  setIsFilter(false);
                                }}
                              />
                            </div>
                          </div>
                        )} */}
                        <div className="mr-3 d-flex align-items-center">
                          <label className="mr-2">Report Type</label>
                          <div style={{ width: "100px" }}>
                            <FormikSelect
                              name="reportType"
                              isClearable={false}
                              options={[
                                { value: 1, label: "Daily" },
                                { value: 2, label: "Monthly" },
                              ]}
                              value={values?.reportType}
                              onChange={(valueOption) => {
                                setFieldValue("reportType", valueOption);
                                setRowDto([]);
                                setViewType(valueOption?.value);
                                setIsFilter(!isFilter);
                              }}
                              placeholder=""
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="mr-3 d-flex align-items-center">
                          <label className="mr-2">Place</label>
                          <div style={{ width: "150px" }}>
                            <FormikSelect
                              name="place"
                              isClearable={true}
                              options={
                                [{ value: 0, label: "All" }, ...placeDDL] || []
                              }
                              value={values?.place}
                              onChange={(valueOption) => {
                                if (valueOption) {
                                  setFieldValue("place", valueOption);
                                  setRowDto([]);
                                } else {
                                  setFieldValue("place", "");
                                  setRowDto([]);
                                }
                              }}
                              placeholder=""
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>

                        {values?.reportType?.value === 1 && (
                          <div className="mr-3 d-flex align-items-center">
                            <label className="mr-2">Date</label>
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
                            <div className="mr-3 d-flex align-items-center">
                              <label className="mr-2">From Date</label>
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
                            <div className="mr-3 d-flex align-items-center">
                              <label className="mr-2">To Date</label>
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
                            label={"Show"}
                            onClick={() => {
                              setIsFilter(true);
                            }}
                            disabled={
                              !values?.reportType?.value ||
                              !values?.date ||
                              !values?.fromDate ||
                              !values?.toDate ||
                              !values?.place
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-card-body mt-0">
                    <CardTable propsObj={{ rowDto }} viewType={viewType} />
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
