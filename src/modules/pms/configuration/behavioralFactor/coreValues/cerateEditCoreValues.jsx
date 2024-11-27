/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { memo, useEffect, useState } from "react";
import AntTable from "../../../../../common/AntTable";
import DefaultInput from "../../../../../common/DefaultInput";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import Loading from "../../../../../common/loading/Loading";
import { gray900, greenColor } from "../../../../../utility/customColor";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import { isUniq } from "../../../../../utility/uniqChecker";
import {
  coreValuesValidationSchema,
  demonstrateBehaviourTableColumn,
  onCreateEditCoreValues,
  onGetCoreValuesyById,
} from "./helper";
const initialValues = {
  coreValueName: "",
  coreValueDefinition: "",
  numDesiredValue: "",
  demonstratedBehaviour: "",
  isPositive: true,
};

const CreateEditCoreValues = ({
  orgId,
  buId,
  employeeId,
  onHide,
  permission,
  coreValueId,
}) => {
  const [demonstratedBehaviourList, setDemonstratedBehaviourList] = useState(
    []
  );
  const [, createCoreValues, loadingOnCreateValues] = useAxiosPost();
  const [, getCoreValuesById, loadingOnGetValues] = useAxiosGet();

  useEffect(() => {
    if (coreValueId) {
      onGetCoreValuesyById({
        buId,
        coreValueId,
        getCoreValuesById,
        setValues,
        setDemonstratedBehaviourList,
      });
    }
  }, [coreValueId, buId]);

  const {
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    resetForm,
    values,
  } = useFormik({
    initialValues,
    validationSchema: coreValuesValidationSchema,
    onSubmit: (formValues) => {
      onCreateEditCoreValues({
        coreValueId,
        orgId,
        buId,
        employeeId,
        formValues,
        createCoreValues,
        resetForm,
        demonstratedBehaviourList,
        setDemonstratedBehaviourList,
        onHide,
      });
    },
  });
  return (
    <>
      {(loadingOnCreateValues || loadingOnGetValues) && <Loading />}
      <div className="add-new-employee-form">
        <div className="row m-0">
          <div className="col-md-4">
            <label>Core value name</label>
            <DefaultInput
              classes="input-sm"
              value={values?.coreValueName}
              name="coreValueName"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("coreValueName", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-4">
            <label>Core value definition</label>
            <DefaultInput
              classes="input-sm"
              value={values?.coreValueDefinition}
              name="coreValueDefinition"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("coreValueDefinition", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-4">
            <label>Desired value</label>
            <DefaultInput
              classes="input-sm"
              value={values?.numDesiredValue}
              name="numDesiredValue"
              type="number"
              min={0}
              className="form-control"
              onChange={(e) => {
                setFieldValue("numDesiredValue", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <hr />
        <div className="row m-0 px-3">
          <div className="col-md-4 pl-0">
            <label>Demonstrated behaviour</label>
            <DefaultInput
              classes="input-sm"
              value={values?.demonstratedBehaviour}
              name="demonstratedBehaviour"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("demonstratedBehaviour", e.target.value);
              }}
            />
          </div>
          <div className="col-md-2">
            <div className="d-flex align-items-center small-checkbox mt-4">
              <FormikCheckBox
                styleObj={{
                  color: gray900,
                  checkedColor: greenColor,
                }}
                label="Is Positive"
                checked={values?.isPositive}
                onChange={(e) => {
                  setFieldValue("isPositive", e.target.checked);
                }}
                labelFontSize="12px"
              />
            </div>
          </div>
          <div className="col-md-3">
            <button
              type="button"
              disabled={!values?.demonstratedBehaviour}
              onClick={() => {
                if (
                  isUniq(
                    "demonstratedBehaviour",
                    values?.demonstratedBehaviour,
                    demonstratedBehaviourList
                  )
                ) {
                  setDemonstratedBehaviourList((prev) => [
                    ...prev,
                    {
                      demonstratedBehaviour: values?.demonstratedBehaviour,
                      isPositive: values?.isPositive,
                    },
                  ]);
                  setValues((prev) => ({
                    ...prev,
                    demonstratedBehaviour: "",
                    isPositive: true,
                  }));
                }
              }}
              className="btn btn-green mt-4"
            >
              Add
            </button>
          </div>
        </div>
        {demonstratedBehaviourList?.length > 0 ? (
          <div className="table-card-styled table-responsive tableOne mb-2">
            <AntTable
              tableContainerClass="mx-3"
              data={demonstratedBehaviourList || []}
              removePagination={true}
              columnsData={demonstrateBehaviourTableColumn({
                demonstratedBehaviourList,
                setDemonstratedBehaviourList,
                permission,
                fromView: false,
              })}
            />
          </div>
        ) : (
          <></>
        )}

        <div className="emp-create buttons-form-main row">
          <button
            type="button"
            className="btn btn-cancel mr-3"
            onClick={() => {
              onHide();
              setDemonstratedBehaviourList([]);
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-green"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(CreateEditCoreValues);
