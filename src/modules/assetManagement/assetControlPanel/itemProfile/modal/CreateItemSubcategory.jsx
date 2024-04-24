import React, { useState } from "react";
import { Form, Formik } from "formik";
import FormikInput from "common/FormikInput";
import Loading from "common/loading/Loading";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { customStyles } from "utility/selectCustomStyle";
import FormikSelect from "common/FormikSelect";
import * as Yup from "yup";

const initData = {
  itemCategory: "",
  itemSubcategory: "",
};

const validationSchema = Yup.object().shape({
  itemCategory: Yup.object().shape({
    label: Yup.string().required("Item category is required"),
    value: Yup.string().required("Item category is required"),
  }),
  itemSubcategory: Yup.string().required("Item Sub-Category name is required"),
});

const CreateItemSubcategory = ({
  orgId,
  employeeId,
  buId,
  wId,
  wgId,
  setItemSubCategoryModalShow,
  itemCategoryDDL,
  getItemSubcategory,
}) => {
  const [, saveItemSubcategory, loading] = useAxiosPost({});
  const [itemCategoryValue, setItemCategoryValue] = useState(null);
  const saveHandler = (values, cb) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      createdBy: employeeId,
      itemCategoryId: values?.itemCategory?.value,
      itemSubCategoryId: 0,
      strItemSubCategory: values?.itemSubcategory,
    };
    saveItemSubcategory(
      "/AssetManagement/CreateItemSubCategory",
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
            getItemSubcategory(
              `/AssetManagement/ItemSubCategoryDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&itemCategoryId=${itemCategoryValue}`
            );
            setItemSubCategoryModalShow(false);
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="modalBody pt-0 px-0">
              <div className="row mx-0">
                <div className="col-lg-4">
                  <label>Item Category</label>
                  <FormikSelect
                    placeholder=" "
                    classes="input-sm"
                    styles={customStyles}
                    name="itemCategory"
                    options={itemCategoryDDL || []}
                    value={values?.itemCategory}
                    onChange={(valueOption) => {
                      setFieldValue("itemCategory", valueOption);
                      setItemCategoryValue(valueOption?.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <div className="input-field-main">
                    <label>Item Sub-Category Name</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.itemSubcategory}
                      placeholder=""
                      name="itemSubcategory"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("itemSubcategory", e.target.value);
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

export default CreateItemSubcategory;
