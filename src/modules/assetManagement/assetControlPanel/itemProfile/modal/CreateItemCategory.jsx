import React from "react";
import { Form, Formik } from "formik";
import FormikInput from "common/FormikInput";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { todayDate } from "utility/todayDate";
import Loading from "common/loading/Loading";
import * as Yup from "yup";

const initData = {
  categoryNewName: "",
};

const validationSchema = Yup.object().shape({
  categoryNewName: Yup.string().required("Item category new name is required"),
});

const CreateItemCategory = ({
  orgId,
  employeeId,
  buId,
  wId,
  wgId,
  setItemCategoryModalShow,
  getData,
}) => {
  const [, saveItemCategory, loading] = useAxiosPost({});
  const saveHandler = (values, cb) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      createdBy: employeeId,
      itemCategoryId: 0,
      itemCategory: values?.categoryNewName,
      active: true,
      createdAt: todayDate(),
    };
    saveItemCategory(`AssetManagement/CreateItemCategory`, payload, cb, true);
  };
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            getData();
            setItemCategoryModalShow(false);
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
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
        )}
      </Formik>
    </>
  );
};

export default CreateItemCategory;
