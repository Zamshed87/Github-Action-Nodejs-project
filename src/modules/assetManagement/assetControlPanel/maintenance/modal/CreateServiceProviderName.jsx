import React from "react";
import { Form, Formik } from "formik";
import FormikInput from "common/FormikInput";
import Loading from "common/loading/Loading";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import * as Yup from "yup";
import { localUrl } from "../../registration/utils";

const initData = {
  serviceProviderNewName: "",
};

const validationSchema = Yup.object().shape({
  serviceProviderNewName: Yup.string().required(
    "Service provider new name is required"
  ),
});

const CreateServiceProviderName = ({
  orgId,
  buId,
  wId,
  wgId,
  setIsProviderNameView,
  getServiceProviderName,
}) => {
  const [, saveServiceProviderName, loading] = useAxiosPost({});
  const saveHandler = (values, cb) => {
    const payload = {
      maintenanceHeadName: values?.serviceProviderNewName,
      accountId: orgId,
      branchId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      typeName: "Service Provider Name",
      typeId: 2,
    };
    saveServiceProviderName(
      `/AssetManagement/CreateMaintenanceHead`,
      payload,
      cb,
      true
    );
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
            setIsProviderNameView(false);
            resetForm(initData);
            getServiceProviderName(
              `/AssetManagement/GetServiceProviderNameDDL?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
            );
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="modalBody pt-0 px-0">
              <div className="row mx-0">
                <div className="col-lg-4">
                  <div className="input-field-main">
                    <label>Service Provider New Name</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.serviceProviderNewName}
                      placeholder=""
                      name="serviceProviderNewName"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("serviceProviderNewName", e.target.value);
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

export default CreateServiceProviderName;
