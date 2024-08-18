import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import { todayDate } from "../../../../utility/todayDate";
import { createSetup, getDDL } from "../helper";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  UoMNewName: "",
};

const validationSchema = Yup.object().shape({
  UoMNewName: Yup.string().required("UoM new name is required"),
});

export default function AddItemUoM({
  orgId,
  employeeId,
  buId,
  setItemUoMDDL,
  setShow,
  setLoading,
}) {
  const { wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values, cb) => {
    const payload = {
      itemUomId: 0,
      accountId: orgId,
      businessUnitId: buId,
      itemUom: values?.UoMNewName,
      workplaceId: wId,
      workplaceGroupId: wgId,
      active: true,
      createdAt: todayDate(),
      createdBy: employeeId,
    };
    const callBack = () => {
      cb();
      getDDL("/AssetManagement/ItemUomDDL", orgId, buId, setItemUoMDDL);
      setShow(false);
    };
    createSetup(
      "/AssetManagement/CreateItemUom",
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
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
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
          </>
        )}
      </Formik>
    </>
  );
}
