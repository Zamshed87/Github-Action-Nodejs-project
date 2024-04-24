import React from "react";
import { Form, Formik } from "formik";
import FormikInput from "common/FormikInput";
import Loading from "common/loading/Loading";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { todayDate } from "utility/todayDate";
import * as Yup from "yup";

const initData = {
  UoMNewName: "",
};

const validationSchema = Yup.object().shape({
  UoMNewName: Yup.string().required("UoM new name is required"),
});

const CreateUom = ({
  orgId,
  employeeId,
  buId,
  wId,
  wgId,
  setUomModalShow,
  getData,
}) => {
  const [, saveUom, loading] = useAxiosPost({});
  const saveHandler = (values, cb) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      createdBy: employeeId,
      itemUomId: 0,
      itemUom: values?.UoMNewName,
      active: true,
      createdAt: todayDate(),
    };
    saveUom(`AssetManagement/CreateItemUom`, payload, cb, true);
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
            setUomModalShow(false);
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
                    <label>Item UoM Name</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.UoMNewName}
                      placeholder=""
                      name="UoMNewName"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("UoMNewName", e.target.value);
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

export default CreateUom;
