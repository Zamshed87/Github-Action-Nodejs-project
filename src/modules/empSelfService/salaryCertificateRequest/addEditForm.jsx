/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import * as Yup from "yup";
import Loading from "../../../common/loading/Loading";
import BackButton from "../../../common/BackButton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import FormikInput from "../../../common/FormikInput";
import { useState } from "react";
import { todayDate } from "../../../utility/todayDate";
import moment from "moment";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";

const initData = {
  monthYear: moment().format("YYYY-MM"),
  maxMonthYear: moment().format("YYYY-MM"),
  monthId: new Date().getMonth(),
  yearId: new Date().getFullYear(),
};

const validationSchema = Yup.object().shape({
  monthYear: Yup.date().required("Month is required"),
});

const SelfSalaryCertificateRequestCreate = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { orgId, employeeId, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [singleData, setSingleData] = useState([]);

  const [, saveSalaryCetificate, certificateLoading] = useAxiosPost({});
  const [, getCertificateDetail, certificatDetailsLoading] = useAxiosGet([]);
  const [initMonth, getInitMonth, initMonthLoading] = useAxiosGet({});

  const saveHandler = (values, cb) => {
    const payload = {
      intSalaryCertificateRequestId: params?.id || 0,
      strEntryType: params?.id ? "Update" : "Create",
      intEmployeeId: employeeId,
      strEmployeName: userName,
      intPayRollMonth: values?.monthId,
      intPayRollYear: values?.yearId,
      intAccountId: orgId,
      isActive: true,
      intCreatedBy: employeeId,
      dteCreatedAt: todayDate(),
    };

    saveSalaryCetificate(
      `/Employee/SalaryCertificateRequestCreateEdit`,
      payload,
      cb,
      true
    );
  };

  const getData = () => {
    params?.id &&
      getCertificateDetail(
        `/Employee/SalaryCertificateApplication?strPartName=SalaryCertificateById&intAccountId=${orgId}&intEmployeeId=${employeeId}&intSalaryCertificateRequestId=${params?.id}`,
        (data) => {
          setSingleData([...data]);
        }
      );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getInitMonth(
      `/Employee/LastMonthOfSalaryGenerate?IntAccountId=${orgId}&IntEmployeeId=${employeeId}`
    );
    params?.id && getData();
  }, [orgId, params?.id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={
          params?.id
            ? {
                ...initData,
                monthYear: moment({
                  year: singleData[0]?.intPayRollYear,
                  month: singleData[0]?.intPayRollMonth - 1,
                }).format("YYYY-MM"),
                maxMonthYear: moment({
                  year: initMonth?.year,
                  month: initMonth?.month - 1,
                }).format("YYYY-MM"),
                monthId: singleData[0]?.intPayRollMonth,
                yearId: singleData[0]?.intPayRollYear,
              }
            : {
                ...initData,
                monthYear: moment({
                  year: initMonth?.year,
                  month: initMonth?.month - 1,
                }).format("YYYY-MM"),
                maxMonthYear: moment({
                  year: initMonth?.year,
                  month: initMonth?.month - 1,
                }).format("YYYY-MM"),
              }
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
              getData();
              resetForm({
                monthYear: moment({
                  year: singleData[0]?.intPayRollYear,
                  month: singleData[0]?.intPayRollMonth - 1,
                }).format("YYYY-MM"),
                monthId: singleData[0]?.intPayRollMonth,
                yearId: singleData[0]?.intPayRollYear,
              });
            } else {
              setSubmitting(false);
              resetForm();
            }
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setValues }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(certificateLoading ||
                certificatDetailsLoading ||
                initMonthLoading) && <Loading />}
              <div className="table-card">
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      {params?.id
                        ? `Edit Salary Certificate Request`
                        : `Salary Certificate Request`}
                    </h2>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        className="btn btn-cancel mr-2"
                        onClick={() => {
                          resetForm(initData);
                        }}
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        type="submit"
                        className="btn btn-default flex-center"
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Month</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          value={values?.monthYear}
                          max={values?.maxMonthYear}
                          name="monthYear"
                          type="month"
                          onChange={(e) => {
                            setValues((prev) => ({
                              ...prev,
                              yearId: +e.target.value
                                .split("")
                                .slice(0, 4)
                                .join(""),
                              monthId: +e.target.value
                                .split("")
                                .slice(-2)
                                .join(""),
                              monthYear: e.target.value,
                            }));
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SelfSalaryCertificateRequestCreate;
