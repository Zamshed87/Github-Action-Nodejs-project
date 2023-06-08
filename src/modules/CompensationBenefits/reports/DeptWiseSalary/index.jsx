/* eslint-disable react-hooks/exhaustive-deps */
import { Print } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikDatePicker from "../../../../common/DatePicker";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getPDFAction } from "../../../../utility/downloadFile";
import Loading from "./../../../../common/loading/Loading";
import CardTable from "./components/CardTable";
import "./deptWiseSalary.css";
import { getDepartmentWiseSalary } from "./help";

let date = new Date();
let initYear = date.getFullYear();
let initMonth = date.getMonth() + 1;

const initData = {
  search: "",
  month: `${initYear}-${initMonth}`,
};

export default function DeptWiseSalary() {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([null]);

  useEffect(() => {
    getDepartmentWiseSalary(buId, initYear, initMonth, setRowDto, setLoading);
  }, [orgId, buId]);

  const getYearMonth = (value) => {
    let splitMonth = value?.split("-");
    let year = splitMonth?.[0];
    let month = splitMonth?.[1];
    return { year, month };
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 82) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, []);

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
                <div className="col-md-12">
                  <div className="table-card">
                    <div className="table-card-heading mt-1 mb-3">
                      <div>
                        <>
                          <Tooltip title="Print" arrow>
                            <button
                              className="btn-save "
                              style={{
                                border: "transparent",
                                width: "30px",
                                height: "30px",
                                background: "#f2f2f7",
                                borderRadius: "100px",
                              }}
                              onClick={() => {
                                let { year, month } = getYearMonth(
                                  values?.month
                                );
                                getPDFAction(
                                  `/emp/PdfAndExcelReport/MonthlySalaryDepartmentWiseReport?BusinessUnitId=${buId}&Year=${
                                    year || initYear
                                  }&Month=${month || initMonth}`,
                                  setLoading
                                );
                              }}
                            >
                              <Print
                                sx={{ color: "#637381", fontSize: "16px" }}
                              />
                            </button>
                          </Tooltip>
                        </>
                      </div>
                      <div className="table-card-head-right">
                        <div style={{ marginRight: "20px" }}>
                          <FormikDatePicker
                            isSmall
                            label=""
                            value={values?.month}
                            type="month"
                            onChange={(e) => {
                              setFieldValue("month", e.target.value);
                              let { year, month } = getYearMonth(
                                e.target.value
                              );
                              getDepartmentWiseSalary(
                                buId,
                                year,
                                month,
                                setRowDto,
                                setLoading
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <CardTable rowDto={rowDto} />
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
