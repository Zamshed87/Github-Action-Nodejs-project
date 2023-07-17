import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import { todayDate } from "../../../../utility/todayDate";
import { createSetup, getDDL } from "../helper";

const initData = {
  categoryNewName: "",
};

const validationSchema = Yup.object().shape({
  categoryNewName: Yup.string().required("Category new name is required"),
});

export default function AddCategoryName({
  orgId,
  employeeId,
  buId,
  setItemCategoryDDL,
  setShow,
  setLoading,
}) {
  const saveHandler = (values, cb) => {
    const payload = {
      itemCategoryId: 0,
      accountId: orgId,
      businessUnitId: buId,
      itemCategory: values?.categoryNewName,
      active: true,
      createdAt: todayDate(),
      createdBy: employeeId,
    };
    const callBack = () => {
      cb();
      getDDL("/AssetManagement/ItemCategoryDDL", orgId, buId, setItemCategoryDDL);
      setShow(false);
    };
    createSetup(
      "/AssetManagement/CreateItemCategory",
      payload,
      setLoading,
      callBack
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
            <Form onSubmit={handleSubmit}>
              <div className="modalBody pt-0 px-0">
                <div className="row mx-0">
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Item Category Name</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.categoryNewName}
                        placeholder=""
                        name="categoryNewName"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("categoryNewName", e.target.value);
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
}
