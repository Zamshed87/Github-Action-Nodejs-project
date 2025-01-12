/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { memo, useEffect, useState } from "react";
import AntTable from "../../../../../common/AntTable";
import DefaultInput from "../../../../../common/DefaultInput";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";
import { gray900, greenColor } from "../../../../../utility/customColor";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { isUniq } from "../../../../../utility/uniqChecker";
import {
  competencyTypeDDL,
  coreCompetencyCreateValidationSchema,
  demonstrateBehaviourTableColumn,
  employeeClusterTableColumn,
  onCreateCoreCompetency,
  onGetCompetencyById,
} from "./helper";
const initialValues = {
  competencyType: null,
  competencyName: "",
  competencyDefinition: "",
  employeeLabel: "",
  desiredValue: "",
  demonstratedBehaviour: "",
  isPositive: true,
};

const CreateCompetency = ({
  orgId,
  buId,
  intAccountId,
  employeeId,
  onHide,
  clusterList,
  setClusterList,
  permission,
  competencyId,
  allMasterPositionDDL,
}) => {
  const [demonstratedBehaviourList, setDemonstratedBehaviourList] = useState(
    []
  );
  const [, createCompetency, loadingOnCreateCompetency] = useAxiosPost();
  const [, getCompetencyById, loadingOnGetCompetency] = useAxiosGet();

  useEffect(() => {
    if (competencyId) {
      onGetCompetencyById({
        buId,
        competencyId,
        getCompetencyById,
        setValues,
        clusterList,
        setClusterList,
        setDemonstratedBehaviourList,
      });
    }
  }, [competencyId, buId]);

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
    validationSchema: coreCompetencyCreateValidationSchema,
    onSubmit: (formValues) => {
      onCreateCoreCompetency({
        competencyId,
        orgId,
        buId,
        employeeId,
        formValues,
        createCompetency,
        resetForm,
        clusterList,
        demonstratedBehaviourList,
        setClusterList,
        setDemonstratedBehaviourList,
        onHide,
      });
    },
  });

  return (
    <>
      {(loadingOnCreateCompetency || loadingOnGetCompetency) && <Loading />}
      <div className="add-new-employee-form">
        <div className="row m-0">
          <div className="col-md-4">
            <FormikSelect
              isDisabled={competencyId ? true : false}
              label="Competency Type"
              classes="input-sm form-control"
              name="competencyType"
              options={competencyTypeDDL || []}
              value={values?.competencyType}
              onChange={(valueOption) => {
                setFieldValue("competencyType", valueOption);
              }}
              styles={customStyles}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-4">
            <label>Competency Name</label>
            <DefaultInput
              classes="input-sm"
              value={values?.competencyName}
              name="competencyName"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("competencyName", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-4">
            <label>Competency Definition</label>
            <DefaultInput
              classes="input-sm"
              value={values?.competencyDefinition}
              name="competencyDefinition"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("competencyDefinition", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          {/* <div className="col-md-4">
            <FormikSelect
              isDisabled={competencyId ? true : false}
              label="Employee Label"
              classes="input-sm form-control"
              name="employeeLabel"
              options={clusterList || []}
              value={values?.employeeLabel}
              onChange={(valueOption) => {
                setFieldValue("employeeLabel", valueOption);
              }}
              styles={customStyles}
              errors={errors}
              touched={touched}
            />
          </div> */}

          <div className="col-md-4">
            <FormikSelect
              // isDisabled={competencyId ? true : false}
              label="Level of Leadership"
              classes="input-sm form-control"
              name="employeeLabel"
              options={
                allMasterPositionDDL?.length > 0 ? allMasterPositionDDL : []
              }
              value={values?.employeeLabel}
              onChange={(valueOption) => {
                setFieldValue("employeeLabel", valueOption);
              }}
              styles={customStyles}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-4">
            <label>Desired Value</label>
            <DefaultInput
              classes="input-sm"
              value={values?.desiredValue}
              name="desiredValue"
              type="number"
              className="form-control"
              onChange={(e) => {
                setFieldValue("desiredValue", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <hr />
        {/* <div className="row mt-2">
          <div className="col-md-8">
            {clusterList?.length > 0 ? (
              <div className="table-card-styled table-responsive tableOne mb-2">
                <AntTable
                  tableContainerClass="ml-3"
                  removePagination={true}
                  data={clusterList || []}
                  columnsData={employeeClusterTableColumn({
                    clusterList,
                    setClusterList,
                    fromView: false,
                  })}
                />
              </div>
            ) : (
              <p className="text-center">
                Warning : There is no cluster list for employee
              </p>
            )}
          </div>
        </div> */}
        <hr />
        <div className="row m-0 px-3">
          <div className="col-md-4 pl-0">
            <label>Demonstrated Behaviour</label>
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
                      employeeLabel: values?.employeeLabel?.label,
                      demonstratedBehaviour: values?.demonstratedBehaviour,
                      competencyId: competencyId || 0,
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
              onHide?.();
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

export default memo(CreateCompetency);
