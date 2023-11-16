import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { todayDate } from "../../../../utility/todayDate";

const initData = {
  expenseType: "",
};

const validationSchema = Yup.object().shape({
  expenseType: Yup.string().required("Expense Type is required"),
});

const AddExpenseType = ({ setShow, getExpenseTypeDDL }) => {
  const { orgId, employeeId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, saveExpenseType, loading] = useAxiosPost({});
  const saveHandler = (values, cb) => {
    const payload = {
      intExpenseTypeId: 0,
      strExpenseType: values?.expenseType,
      isActive: true,
      intAccountId: orgId,
      intCreatedBy: employeeId,
      dteCreatedAt: todayDate(),
      intWorkplaceId: wId,
    };

    saveExpenseType(
      `/SaasMasterData/SaveEmpExpenseType`,
      payload,
      () => {
        getExpenseTypeDDL(orgId);
        setShow(false);
      },
      true
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              <div className="modalBody pt-0 px-0">
                <div className="row mx-0">
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Expense Type</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.expenseType}
                        placeholder=""
                        name="expenseType"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("expenseType", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <button
                      className="btn btn-green btn-green-disable mt-4"
                      type="submit"
                    >
                      Save
                    </button>
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

export default AddExpenseType;
