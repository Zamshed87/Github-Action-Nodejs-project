import React from "react";
import { Form, Formik } from "formik";
import Loading from "common/loading/Loading";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import FormikInput from "common/FormikInput";
import * as Yup from "yup";
import { localUrl } from "../../registration/utils";

const initData = {
  newMaintenanceType: "",
};

const validationSchema = Yup.object().shape({
  newMaintenanceType: Yup.string().required(
    "Maintenance type new name is required"
  ),
});

const CreateMaintenanceHead = ({
  orgId,
  buId,
  wId,
  wgId,
  setIsView,
  getMaintenanceHead,
}) => {
  const [, saveMaintenanceHead, loading] = useAxiosPost({});
  const saveHandler = (values, cb) => {
    const payload = {
      maintenanceHeadName: values?.newMaintenanceType,
      accountId: orgId,
      branchId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      typeName: "Maintenance Head",
      typeId: 1,
    };
    saveMaintenanceHead(
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
            setIsView(false);
            resetForm(initData);
            getMaintenanceHead(
              `/AssetManagement/GetMaintenceHeadDDL?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
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
                    <label>Maintenance Type Name</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.newMaintenanceType}
                      placeholder=""
                      name="newMaintenanceType"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("newMaintenanceType", e.target.value);
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

export default CreateMaintenanceHead;
