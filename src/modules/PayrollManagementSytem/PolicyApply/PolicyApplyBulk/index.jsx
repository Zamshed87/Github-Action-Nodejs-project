/* eslint-disable no-unused-vars */
import { SearchOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getCombineAllDDL, getPeopleDeskAllDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import {
  gray200,
  gray400,
  gray900,
  greenColor
} from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { allEmployeeList, getSalaryPolicyList } from "./helper";
import "./styles.css";
const initData = {
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  department: "",
  designation: "",
  employementType: "",
  salaryPolicy: "",
  allSelected: false,
  searchStr: "",
};

const validationSchema = Yup.object().shape({
  businessUnit: Yup.object({
    label: Yup.string().required("Business unit is required!"),
    value: Yup.string().required("Business unit is required!"),
  })
    .typeError("Business unit is required!")
    .required("Business unit is required!"),
  workplaceGroup: Yup.object({
    label: Yup.string().required("Workplace group is required!"),
    value: Yup.string().required("Workplace group is required!"),
  })
    .typeError("Workplace group is required!")
    .required("Workplace group is required!"),
  workplace: Yup.object({
    label: Yup.string().required("Workplace is required!"),
    value: Yup.string().required("Workplace is required!"),
  })
    .typeError("Workplace is required!")
    .required("Workplace is required!"),
  department: Yup.object({
    label: Yup.string().required("Department is required!"),
    value: Yup.string().required("Department is required!"),
  })
    .typeError("Department is required!")
    .required("Department is required!"),
  designation: Yup.object({
    label: Yup.string().required("Designation is required!"),
    value: Yup.string().required("Designation is required!"),
  })
    .typeError("Designation is required!")
    .required("Designation is required!"),
  employementType: Yup.object({
    label: Yup.string().required("Employement type is required"),
    value: Yup.string().required("Employement type is required"),
  })
    .typeError("Employement type is required")
    .required("Employement type is required"),
  salaryPolicy: Yup.object({
    label: Yup.string().required("Salary policy is required!"),
    value: Yup.number().required("Salary policy is required!"),
  })
    .typeError("Salary policy is required!")
    .required("Salary policy is required!"),
});

const PolicyApplyBulk = () => {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData
  );
  const [loading, setLoading] = useState(false);
  const debounce = useDebounce();
  //
  // using custom hook to post and get data
  const [createdPolicyApply, postPolicyApply, postLoading] = useAxiosPost();
  // using custom hook to get policy apply landing
  const [policyApplyList, getAllPolicyApply, getLoading] = useAxiosGet();
  //
  // policy apply list
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(null);
  //

  // dropdown list
  const [allDDL, setAllDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [policyList, setPolicyList] = useState([]);
  //
  // get all ddl

  // get business unit ddl
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}&WorkplaceGroupId=0`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
  }, [orgId, buId, employeeId]);
  useEffect(() => {
    getCombineAllDDL(orgId, buId, 0, 0, 0, 0, 0, setAllDDL);
  }, [orgId, buId]);
  useEffect(() => {
    // business unit ddl
    if (allDDL) {
      // department
      if (allDDL?.departmentList?.length > 0) {
        const modifyDepartmentDDL = allDDL?.departmentList?.map((item) => {
          return {
            ...item,
            value: item?.id,
            label: item?.name,
          };
        });
        setDepartmentDDL(modifyDepartmentDDL);
      }

      // Designation DDL
      if (allDDL?.designationList?.length > 0) {
        const modifyDesignationDDL = allDDL?.designationList?.map((item) => {
          return {
            ...item,
            value: item?.id,
            label: item?.name,
          };
        });
        setDesignationDDL(modifyDesignationDDL);
      }

      // EmploymentType DDL
      if (allDDL?.employmentTypeList?.length > 0) {
        const modifyEpmployeeTypeDDL = allDDL?.employmentTypeList?.map(
          (item) => {
            return {
              ...item,
              value: item?.id,
              label: item?.name,
            };
          }
        );
        setEmployeeTypeDDL(modifyEpmployeeTypeDDL);
      }
    }
  }, [allDDL]);

  //
  // on form submit this function will be called to create payload and sending data to server
  const saveHandler = (values, cb) => {
    let empPolicyIdViewModelList = [];
    rowDto?.map(
      (item) =>
        item?.isAssigned &&
        empPolicyIdViewModelList?.push({
          intEmployeeId: +item?.intEmployeeBasicInfoId,
          intPolicyId: +values?.salaryPolicy?.value,
          strPolicyName: values?.salaryPolicy?.label,
        })
    );
    const payload = {
      strEntryType: "SalaryPolicyAssign",
      intPolicyAssignId: +values?.salaryPolicy?.value,
      intAccountId: +orgId,
      intBusinessUnitId: +buId,
      intActionBy: +employeeId,
      empPolicyIdViewModelList,
    };
    if (empPolicyIdViewModelList.length < 1)
      return toast.warn("Please select at least one employee!");
    cb && cb();
    setRowDto([]);
    postPolicyApply(
      `/Payroll/PolicyAssign`,
      payload,
      "",
      true,
      "Policy Applied Successfully!"
    );
  };
  //

  // filter landing
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.EmployeeName?.toLowerCase()) ||
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strWorkplaceGroup?.toLowerCase()) ||
          regex.test(item?.strWorkplace?.toLowerCase()) ||
          regex.test(item?.Department?.toLowerCase()) ||
          regex.test(item?.Designation?.toLowerCase()) ||
          regex.test(item?.EmploymentType?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  //
  //

  //
  const addHandler = (values) => {
    allEmployeeList({ orgId, buId }, values, setLoading, setRowDto, setAllData);
    // get salary policy list
    getSalaryPolicyList(orgId, buId, setPolicyList);
  };
  useEffect(() => {
    let total = 0;
    rowDto?.map((item) => total++);
    setTotalEmployee(total);
  }, [rowDto]);

  return (
    <>
      {(loading || postLoading || getLoading) && <Loading />}
      <Formik
        initialValues={{
          ...initData,
          businessUnit: { value: 0, label: "All" },
          workplaceGroup: { value: 0, label: "All" },
          workplace: { value: 0, label: "All" },
          department: { value: 0, label: "All" },
          designation: { value: 0, label: "All" },
          employementType: { value: 0, label: "All" },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => resetForm(initData));
        }}
      >
        {({ values, setFieldValue, errors, touched, handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="table-card policy-bulk-assign-wrapper">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <BackButton title="Create Bulk Policy Assign" />
                  </div>
                  <div>
                    <button
                      className="btn btn-green btn-green-disabled"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-md-3">
                      <div>
                        <label>Business Unit</label>
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="businessUnit"
                          options={businessUnitDDL || []}
                          value={values?.businessUnit}
                          onChange={(valueOption) => {
                            setFieldValue("businessUnit", valueOption);
                            getCombineAllDDL(
                              orgId,
                              valueOption?.value || 0,
                              values?.workplaceGroup?.value || 0,
                              values?.workplace?.value || 0,
                              values?.department?.value || 0,
                              values?.designation?.value || 0,
                              values?.employementType?.value || 0,
                              setAllDDL
                            );
                            setFieldValue("workplaceGroup", "");
                            setFieldValue("workplace", "");
                            setFieldValue("department", "");
                            setFieldValue("designation", "");
                            setFieldValue("employementType", "");
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=" "
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div>
                        <label className="mb-2">Workplace Group</label>
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="workplaceGroup"
                          options={
                            [
                              { label: "All", value: 0 },
                              ...workplaceGroupDDL,
                            ] || []
                          }
                          value={values?.workplaceGroup}
                          onChange={(valueOption) => {
                            setFieldValue("workplaceGroup", valueOption);
                            getCombineAllDDL(
                              orgId,
                              values?.businessUnit?.value || 0,
                              valueOption?.value || 0,
                              values?.workplace?.value || 0,
                              values?.department?.value || 0,
                              values?.designation?.value || 0,
                              values?.employementType?.value || 0,
                              setAllDDL
                            );
                            setFieldValue("workplace", "");
                            setFieldValue("department", "");
                            setFieldValue("designation", "");
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=" "
                          isDisabled={!values?.businessUnit}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div>
                        <label className="mb-2">Workplace</label>
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="workplace"
                          options={
                            [{ label: "All", value: 0 }, ...workplaceDDL] || []
                          }
                          value={values?.workplace}
                          onChange={(valueOption) => {
                            setFieldValue("workplace", valueOption);
                            getCombineAllDDL(
                              orgId,
                              values?.businessUnit?.value || 0,
                              values?.workplaceGroup?.value || 0,
                              valueOption?.value || 0,
                              values?.department?.value || 0,
                              values?.designation?.value || 0,
                              values?.employementType?.value || 0,
                              setAllDDL
                            );
                            setFieldValue("department", "");
                            setFieldValue("designation", "");
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=" "
                          isDisabled={!values?.workplaceGroup}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div>
                        <label className="mb-2">Department</label>
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="department"
                          options={
                            [{ label: "All", value: 0 }, ...departmentDDL] || []
                          }
                          value={values?.department}
                          onChange={(valueOption) => {
                            setFieldValue("department", valueOption);
                            getCombineAllDDL(
                              orgId,
                              values?.businessUnit?.value || 0,
                              values?.workplaceGroup?.value || 0,
                              values?.workplace?.value || 0,
                              valueOption?.value || 0,
                              values?.designation?.value || 0,
                              values?.employementType?.value || 0,
                              setAllDDL
                            );
                            setFieldValue("designation", "");
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=" "
                          isDisabled={!values?.workplace}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div>
                        <label className="mb-2">Designation</label>
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="designation"
                          options={
                            [{ label: "All", value: 0 }, ...designationDDL] ||
                            []
                          }
                          value={values?.designation}
                          onChange={(valueOption) => {
                            setFieldValue("designation", valueOption);
                            getCombineAllDDL(
                              orgId,
                              values?.businessUnit?.value || 0,
                              values?.workplaceGroup?.value || 0,
                              values?.workplace?.value || 0,
                              values?.department?.value || 0,
                              valueOption?.value || 0,
                              values?.employementType?.value || 0,
                              setAllDDL
                            );
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=" "
                          isDisabled={!values?.department}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div>
                        <label className="mb-2">Employement Type</label>
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="employementType"
                          options={
                            [{ label: "All", value: 0 }, ...employeeTypeDDL] ||
                            []
                          }
                          value={values?.employementType}
                          onChange={(valueOption) => {
                            setFieldValue("employementType", valueOption);
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=" "
                          isDisabled={!values?.designation}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "26px",
                      }}
                      className="col-md-3"
                    >
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        label="Show"
                        disabled={
                          !values?.businessUnit ||
                          !values?.workplaceGroup ||
                          !values?.workplace ||
                          !values?.department ||
                          !values?.designation ||
                          !values?.employementType
                        }
                        onClick={(e) => {
                          addHandler(values);
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>

                <div className="table-card-body">
                  {allData?.length > 1 && (
                    <div
                      className="row"
                      style={{
                        marginTop: "12px",
                      }}
                    >
                      <div className="col-md-3 d-flex align-items-center justify-content-between">
                        <h2>Employement list</h2>
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "12px",
                            color: gray400,
                          }}
                        >
                          Total Employee {totalEmployee ? totalEmployee : ""}
                        </span>
                      </div>

                      <div className="offset-md-3 col-md-3">
                        <FormikSelect
                          classes="input-sm"
                          styles={customStyles}
                          name="salaryPolicy"
                          options={policyList || []}
                          value={values?.salaryPolicy}
                          onChange={(valueOption) =>
                            setFieldValue("salaryPolicy", valueOption)
                          }
                          errors={errors}
                          touched={touched}
                          placeholder="Select Salary Policy"
                        />
                      </div>
                      <div className="col-md-3">
                        <FormikInput
                          classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach px-2"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.searchStr}
                          name="searchStr"
                          type="text"
                          trailicon={
                            <SearchOutlined
                              sx={{
                                color: "#323232",
                                fontSize: "18px",
                              }}
                            />
                          }
                          onChange={(e) => {
                            filterData(e.target.value, rowDto, setRowDto);
                            setFieldValue("searchStr", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  )}

                  {rowDto?.length < 1 ? (
                    <NoResult />
                  ) : (
                    <div className="table-card-styled tableOne">
                      <table
                        className="table"
                        style={{ borderTop: `1px solid ${gray200}` }}
                      >
                        <thead>
                          <tr className="py-1">
                            <th
                              scope="col"
                              className="checkBoxCol p-0 m-0"
                              style={{ width: "20px" }}
                            >
                              <div>
                                <FormikCheckBox
                                  styleObj={{
                                    margin: "0 auto!important",
                                    color: gray900,
                                    checkedColor: greenColor,
                                    padding: "0px",
                                  }}
                                  name="allSelected"
                                  checked={
                                    rowDto?.length > 0 &&
                                    rowDto?.every((item) => item?.isAssigned)
                                  }
                                  onChange={(e) => {
                                    setRowDto((prev) =>
                                      prev?.map((item) => ({
                                        ...item,
                                        isAssigned: e.target.checked,
                                      }))
                                    );
                                    setFieldValue(
                                      "allSelected",
                                      e.target.checked
                                    );
                                  }}
                                />
                              </div>
                            </th>
                            <th>SL</th>

                            <th style={{ margin: "10px" }}>Employee</th>

                            <th>Business Unit</th>

                            <th>Workplace Group</th>

                            <th>Workplace</th>

                            <th>Department</th>

                            <th>Designation</th>

                            <th>Employement Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index + 1}>
                              <td>
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="checkBoxCol p-0 m-0"
                                >
                                  <FormikCheckBox
                                    styleObj={{
                                      margin: "0 auto!important",
                                      color: gray900,
                                      checkedColor: greenColor,
                                      padding: "0px",
                                    }}
                                    name="selectCheckbox"
                                    color={greenColor}
                                    checked={item?.isAssigned}
                                    onChange={(e) => {
                                      setRowDto((prev) => [
                                        ...prev.slice(0, index),
                                        {
                                          ...prev[index],
                                          isAssigned: !prev[index].isAssigned,
                                        },
                                        ...prev.slice(index + 1),
                                      ]);
                                    }}
                                  />
                                </div>
                              </td>

                              <td>
                                <p className="tableBody-title pl-1">
                                  {index + 1}
                                </p>
                              </td>

                              <td>
                                <p className="tableBody-title">
                                  {item?.EmployeeName}
                                </p>
                              </td>

                              <td>
                                <p className="tableBody-title">
                                  {item?.strBusinessUnit}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.strWorkplaceGroup}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.strWorkplace}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.Department}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.Designation}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.EmploymentType || "-"}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default PolicyApplyBulk;
