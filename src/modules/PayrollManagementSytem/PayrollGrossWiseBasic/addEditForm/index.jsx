import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
// import FormikCheckBox from '../../../../common/FormikCheckbox';
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
// import { gray900, greenColor } from '../../../../utility/customColor';
import { todayDate } from "../../../../utility/todayDate";
import { createGrossWiseBasic, getAllGrossWiseBasicById } from "../helper";

const initData = {
  minSalary: "",
  maxSalary: "",
  numPercentageOfBasic: "",
  isMaxSalary: false,
};

const validationSchema = Yup.object().shape({
  minSalary: Yup.number()
    .min(1, "Must be positive number!!!")
    .required("Min. Salary is required"),
  maxSalary: Yup.number()
    .min(1, "Must be positive number!!!")
    .required("Max. Salary is required"),
  numPercentageOfBasic: Yup.number()
    .min(1, "Must be greater than zero!!!")
    .required("Basic Percentage is required"),
});

export default function PayrollGrossWiseBasicForm() {
  const params = useParams();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30371) {
      permission = item;
    }
  });

  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  useEffect(() => {
    if (+params?.id) {
      getAllGrossWiseBasicById(
        orgId,
        buId,
        +params?.id,
        setSingleData,
        setLoading
      );
    }
  }, [orgId, buId, params?.id]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
    };

    let payload = {
      intAccountId: orgId,
      intBusinessUnitId: buId,
      numMinGross: +values?.minSalary,
      numMaxGross: +values?.maxSalary,
      numPercentageOfBasic: +values?.numPercentageOfBasic,
      isActive: true,
      intCreateBy: employeeId,
      dteCreateDate: todayDate(),
    };

    if (+params?.id) {
      payload = {
        ...payload,
        intGrossWiseBasicId: state?.intGrossWiseBasicId,
      };
    } else {
      payload = {
        ...payload,
        intGrossWiseBasicId: 0,
      };
    }

    createGrossWiseBasic(payload, setLoading, callback);
  };

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: +params?.id
        ? {
            ...singleData,
          }
        : {
            ...initData,
          },
      onSubmit: (values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (params?.id) {
          } else {
            resetForm(initData);
          }
        });
      },
    });

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            <div className="table-card-heading mb12">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>
                  {params?.id
                    ? "Edit Payroll Gross Wise Basic"
                    : "Create Payroll Gross Wise Basic"}
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
                  <button type="submit" className="btn btn-default flex-center">
                    Save
                  </button>
                </li>
              </ul>
            </div>
            <div className="table-card-body">
              <div className="col-md-12 px-0 mt-3">
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Min. Gross Salary</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.minSalary}
                          name="minSalary"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("minSalary", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                        >
                          <label>Max. Salary</label>
                          <FormikCheckBox
                            height="15px"
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                              padding: "0px 0px 0px 5px",
                            }}
                            label="Is Max Salary?"
                            name="isMaxSalary"
                            checked={values?.isMaxSalary}
                            onChange={(e) => {
                              setFieldValue(
                                "isMaxSalary",
                                e.target.checked
                              );
                            }}
                          />
                        </div> */}
                        <label>Max. Gross Salary</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.maxSalary}
                          name="maxSalary"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("maxSalary", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Basic Percentage (%)</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.numPercentageOfBasic}
                          name="numPercentageOfBasic"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "numPercentageOfBasic",
                              e.target.value
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
