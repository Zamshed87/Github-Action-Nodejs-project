import { useFormik } from "formik";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import { customStyles } from "../../../../utility/selectCustomStyle";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../common/loading/Loading";
import { useEffect } from "react";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import { gray500 } from "../../../../utility/customColor";
import {
  onAddObjective,
  onCreateOrEditObjective,
  pmsObjectiveTableColumn,
  setObjectiveToInitDataOnEditFromLanding,
  validationSchemaOfObjectiveCreate,
} from "./helper";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { useMemo } from "react";
import AntScrollTable from "../../../../common/AntScrollTable";
const initialValues = {
  objectiveIndex: null,
  pmType: null,
  objectiveType: null,
  objective: "",
  description: "",
};
const ObjectiveCreateAndEdit = () => {
  const {
    permissionList,
    profileData: { buId, orgId, employeeId },
  } = useSelector((store) => store?.auth);
  const [objectiveList, setObjectiveList] = useState([]);
  const [pmTypeDDL, getPMTypeDDL, loadingOnGetPMTypeDDL] = useAxiosGet();
  const [, createOrEditObjective, loadingOnCreateOrEditObjective] =
    useAxiosPost();
  const [
    objectiveTypeDDL,
    getObjectiveTypeDDL,
    loadingOnGetObjectiveTypeDDL,
    setObjectiveTypeDDL,
  ] = useAxiosGet();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    getPMTypeDDL("/PMS/PMTypeDDL");
    // eslint-disable-next-line
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30355),
    // eslint-disable-next-line
    []
  );
  useEffect(() => {
    getObjectiveTypeDDL(`/PMS/ObjectiveTypeDDL?PMTypeId=1`);
    if (location?.state?.objectiveId) {
      setObjectiveToInitDataOnEditFromLanding({
        location,
        setValues,
      });
    }
    // eslint-disable-next-line
  }, [location?.state?.objectiveId]);
  const {
    errors,
    touched,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    values,
  } = useFormik({
    validationSchema: validationSchemaOfObjectiveCreate(),
    initialValues,
    onSubmit: (formValues) => {
      onAddObjective({
        formValues,
        objectiveList,
        buId,
        orgId,
        employeeId,
        setObjectiveList,
        location,
        createOrEditObjective,
        resetForm,
        initialValues,
        history,
      });
    },
  });
  return (
    <>
      {(loadingOnGetPMTypeDDL ||
        loadingOnGetObjectiveTypeDDL ||
        loadingOnCreateOrEditObjective) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>
              {location?.state?.objectiveId ? "Edit" : "Create"} Objective
            </h2>
          </div>
          <ul className="d-flex flex-wrap">
            <li>
              <button
                type="button"
                onClick={() => {
                  if (location?.state?.objectiveId) {
                    handleSubmit();
                  } else {
                    onCreateOrEditObjective({
                      createOrEditObjective,
                      objectiveList,
                      setObjectiveList,
                      history,
                      location,
                    });
                  }
                }}
                className="btn btn-green w-100"
                disabled={
                  location?.state?.objectiveId
                    ? false
                    : objectiveList?.length <= 0
                }
              >
                Save {location?.state?.objectiveId ? "Changes" : ""}
              </button>
            </li>
          </ul>
        </div>

        <div className="card-style pb-0 mb-2">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="input-field-main  col-md-3">
                <label>Objective</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.objective}
                  name="objective"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("objective", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="input-field-main  col-md-3">
                <label>Description</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.description}
                  name="description"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("description", e.target.value);
                  }}
                />
              </div>
              {/* <div className="input-field-main col-md-3">
                <label>PM Type</label>
                <FormikSelect
                  isDisabled={location?.state?.objectiveId}
                  classes="input-sm form-control"
                  name="pmType"
                  options={pmTypeDDL || []}
                  value={values?.pmType}
                  onChange={(valueOption) => {
                    setValues((prev) => ({
                      ...prev,
                      pmType: valueOption,
                      objectiveType: null,
                    }));
                    if (valueOption)
                      getObjectiveTypeDDL(
                        `/PMS/ObjectiveTypeDDL?PMTypeId=${
                          valueOption?.value || 0
                        }`
                      );
                    if (!valueOption) setObjectiveTypeDDL([]);
                  }}
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                />
              </div> */}
              <div className="input-field-main col-md-3">
                <label>Objective Type</label>
                <FormikSelect
                  isDisabled={
                    location?.state?.objectiveId ||
                    (values?.pmType?.value === 2 ? true : false)
                  }
                  classes="input-sm  form-control"
                  name="objectiveType"
                  options={objectiveTypeDDL || []}
                  value={values?.objectiveType}
                  onChange={(valueOption) => {
                    setFieldValue("objectiveType", valueOption);
                  }}
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                />
              </div>
              {location?.state?.objectiveId ? (
                <></>
              ) : (
                <div className="col-md-3 mt-4">
                  <PrimaryButton
                    onClick={() => handleSubmit()}
                    type="button"
                    className="btn btn-green flex-center"
                    label="Add"
                  />
                </div>
              )}
            </div>
          </form>
          <>
            {location?.state?.objectiveId ||
            !objectiveList ||
            objectiveList?.length < 1 ? (
              <></>
            ) : (
              <div className="row">
                <div className="col-md-12 my-3">
                  <div className="table-card-body pl-lg-1 pl-md-3">
                    <div>
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 style={{ color: gray500, fontSize: "14px" }}>
                          Objective List
                        </h2>
                      </div>
                    </div>
                    <div
                      className="table-card-styled table-responsive tableOne mt-2"
                      // style={{ height: "190px" }}
                    >
                      {objectiveList?.length > 0 ? (
                        <AntScrollTable
                          data={objectiveList}
                          columnsData={pmsObjectiveTableColumn({
                            fromLanding: false,
                            history,
                            permission,
                            setValues,
                            objectiveList,
                            setObjectiveList,
                          })}
                          removePagination
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default ObjectiveCreateAndEdit;
