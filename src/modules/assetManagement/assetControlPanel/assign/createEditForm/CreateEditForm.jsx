import React, { useEffect, useState } from "react";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  addAssignHandler,
  assetAssignColumn,
  initialValue,
  saveHandler,
} from "../utils";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import Loading from "common/loading/Loading";
import PrimaryButton from "common/PrimaryButton";
import BackButton from "common/BackButton";
import FormikRadio from "common/FormikRadio";
import { blueColor, greenColor } from "utility/customColor";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import Required from "common/Required";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import FormikInput from "common/FormikInput";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";

const AssetAssignForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { orgId, buId, wgId, wId, employeeId, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, saveAssetAssign, loading] = useAxiosPost({});
  const [empDDL, getEmp, , setEmpDDL] = useAxiosGet([]);
  const [deptDDL, getDept, , setDeptDDL] = useAxiosGet([]);
  const [assetItemDDL, getAssetItem] = useAxiosGet([]);
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getEmp(`/Employee/AllEmployeeDDL?intAccountId=${orgId}`, (res) => {
      setEmpDDL(res);
    });
    getDept(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      (res) => {
        const modifyData = res?.map((item) => ({
          ...item,
          value: item?.DepartmentId,
          label: item?.DepartmentName,
        }));
        setDeptDDL(modifyData);
      }
    );
    getAssetItem(
      `/AssetManagement/GetAvailableAssetDDL?AccountId=${orgId}&BranchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
    );
  }, [orgId, buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Assign";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initialValue,
        assetName: location?.state?.data?.assetId && {
          code: location?.state?.data?.assetCode,
          value: location?.state?.data?.assetId,
          label:
            location?.state?.data?.assetName +
            "(" +
            location?.state?.data?.value +
            ")",
        },
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(rowDto, saveAssetAssign, () => {
          resetForm(initialValue);
          history.goBack();
        });
      }}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <>
          {loading && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="table-card pb-2">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <BackButton title={"Create Asset Assign"} />
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <PrimaryButton
                          className="btn btn-green btn-green-disable"
                          type="submit"
                          label="Save"
                          disabled={loading}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-card-body">
                <div className="card-style">
                  <div className="row py-2 px-1">
                    <div className="col-lg-12">
                      <FormikRadio
                        name="assignTo"
                        label="Employee"
                        value={"employee"}
                        color={blueColor}
                        onChange={(e) => {
                          setFieldValue("assignTo", e.target.value);
                        }}
                        checked={values?.assignTo === "employee"}
                      />
                      <FormikRadio
                        name="assignTo"
                        label="Department"
                        value={"department"}
                        color={greenColor}
                        onChange={(e) => {
                          setFieldValue("assignTo", e.target.value);
                        }}
                        checked={values?.assignTo === "department"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        {values?.assignTo === "employee"
                          ? "Employee Name"
                          : "Department"}{" "}
                        <Required />
                      </label>
                      <FormikSelect
                        placeholder={
                          values?.assignTo === "employee"
                            ? "Employee Name"
                            : "Department"
                        }
                        classes="input-sm"
                        styles={customStyles}
                        name="employeeName"
                        options={
                          values?.assignTo === "employee"
                            ? empDDL
                            : deptDDL || []
                        }
                        value={values?.employeeName}
                        onChange={(valueOption) => {
                          setFieldValue("employeeName", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        Asset Item Name
                        <Required />
                      </label>
                      <FormikSelect
                        placeholder="Asset Item Name"
                        classes="input-sm"
                        styles={customStyles}
                        name="assetName"
                        options={assetItemDDL || []}
                        value={values?.assetName}
                        onChange={(valueOption) => {
                          setFieldValue("assetName", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        Assigned Date <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.startDate}
                        name="startDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("startDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-4">
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Add"}
                        disabled={!values?.assetName || !values?.employeeName}
                        onClick={(e) => {
                          e.stopPropagation();
                          addAssignHandler(
                            values,
                            rowDto,
                            setRowDto,
                            orgId,
                            buId,
                            wId,
                            wgId,
                            employeeId,
                            userName,
                            () => {
                              setFieldValue("employeeName", "");
                              setFieldValue("assetName", "");
                            }
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-card-body">
                        {rowDto?.length > 0 ? (
                          <PeopleDeskTable
                            columnData={assetAssignColumn(rowDto, setRowDto)}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            uniqueKey="itemId"
                            isPagination={false}
                          />
                        ) : (
                          <>
                            {!loading && (
                              <div className="col-12">
                                <NoResult title={"No Data Found"} para={""} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default AssetAssignForm;
