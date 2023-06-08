/* eslint-disable no-unused-vars */
import {
  EventAvailable,
  EventNote,
  Gradient,
  Grain,
  Stars,
  Texture
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as yup from "yup";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import BackButton from "../../../../common/BackButton";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import FormikError from "../../../../common/login/FormikError";
import PrimaryButton from "../../../../common/PrimaryButton";
import { gray900 } from "../../../../utility/customColor";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getSalaryPolicyList } from "../PolicyApplyBulk/helper";
import { getUnAppliedPolicyEmployee, loadUserList } from "./helper";
import "./styles.css";

const initData = {
  employee: "",
  salaryPolicy: "",
};
const validationSchema = yup.object().shape({
  employee: yup
    .object({
      label: yup.string().required("Employee is required!"),
      value: yup.string().required("Employee is required!"),
    })
    .typeError("Employee is required!")
    .required("Employee is required!"),
  salaryPolicy: yup
    .object()
    .shape({
      label: yup.string().required("Salary policy is required!"),
      value: yup.string().required("Salary policy is required!"),
    })
    .typeError("Salary policy is required!")
    .required("Salary policy is required!"),
});

const PolicyApplySingle = () => {
  const [loading, setLoading] = useState(false);
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const history = useHistory();
  const [policy, setPolicy] = useState(null);
  const [policyList, setPolicyList] = useState([]);
  const [unAppliedPolicyEmployee, setUnAppliedPolicyEmployee] = useState([]);
  const [res, postPolicyAssign, loadingOnAssign] = useAxiosPost();

  // get all policy
  useEffect(() => {
    getSalaryPolicyList(orgId, buId, setPolicyList);
  }, [orgId, buId]);

  //
  // get all unapplied policy employee
  useEffect(() => {
    getUnAppliedPolicyEmployee(
      orgId,
      buId,
      setLoading,
      setUnAppliedPolicyEmployee
    );
  }, [orgId, buId]);
  //

  //
  // on form submit
  const saveHandler = (values, cb) => {
    const payload = {
      strEntryType: "SalaryPolicyAssign",
      intPolicyAssignId: 0,
      intAccountId: +orgId,
      intBusinessUnitId: +buId,
      intActionBy: +employeeId,
      empPolicyIdViewModelList: [
        {
          intEmployeeId: +values?.employee?.value,
          intPolicyId: +values?.salaryPolicy?.value,
          strPolicyName: values?.salaryPolicy?.label,
        },
      ],
    };
    cb && cb();
    postPolicyAssign(
      "/Payroll/PolicyAssign",
      payload,
      "",
      true,
      "Policy Assigned Successfully"
    );
  };

  return (
    <>
      {(loading || loadingOnAssign) && <Loading />}
      <Formik
        initialValues={initData}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setPolicy({});
          });
        }}
      >
        {({
          setFieldValue,
          values,
          errors,
          touched,
          setValues,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="table-card">
              <div className="table-card-heading">
                <div className="d-flex align-items-center">
                  <BackButton title="Create Policy Assign" />
                </div>
                <div style={{ width: "140px" }}>
                  <PrimaryButton
                    type="submit"
                    className={`float-right btn btn-green btn-green-disabled`}
                    label="save"
                  />
                </div>
              </div>
              <div className="card-style mt-2">
                <div className="row">
                  <div className="col-md-3">
                    <label className="mb-2">Select Employee</label>
                    <AsyncFormikSelect
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      loadOptions={(v) =>
                        loadUserList(v, unAppliedPolicyEmployee)
                      }
                      placeholder=""
                    />
                    <FormikError
                      errors={errors}
                      touched={touched}
                      name="employee"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <label>Salary Policy</label>
                    <FormikSelect
                      classes="input-sm"
                      styles={customStyles}
                      name="salaryPolicy"
                      options={policyList || []}
                      value={values?.salaryPolicy}
                      onChange={(valueOption) => {
                        setFieldValue("salaryPolicy", valueOption);
                        setPolicy(
                          policyList.filter(
                            (item) => item?.intPolicyId === valueOption?.value
                          )[0]
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder=" "
                    />
                  </div>
                </div>
                {policy && (
                  <div className="single-policy-assign-policy-details-container">
                    <h2 style={{ fontSize: "16px" }}>Policy Details</h2>
                    <div className="row" style={{ marginTop: "12px" }}>
                      <div className="col-md-3 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: gray900,
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Stars style={{ fontSize: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>{policy?.strPolicyName}</h2>
                          <p>Policy Name</p>
                        </div>
                      </div>

                      <div className="col-md-3 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: gray900,
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <EventNote style={{ fontSize: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {policy?.isMonthly
                              ? "Monthly"
                              : policy?.isOnlyPresentDays
                              ? "Only Present Day"
                              : "-"}
                          </h2>
                          <p>Salary Format</p>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: gray900,
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <EventAvailable style={{ fontSize: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {policy?.isSalaryCalculationShouldBeActual
                              ? "Gross Salary/Actual Month Days"
                              : policy?.intGrossSalaryDevidedByDays
                              ? policy?.intGrossSalaryDevidedByDays
                              : "-"}
                          </h2>
                          <p>Per day salary calculation</p>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "12px" }}>
                      <div className="col-md-3 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: gray900,
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Gradient style={{ fontSize: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {policy?.intGrossSalaryRoundDigits
                              ? policy?.intGrossSalaryRoundDigits
                              : policy?.isGrossSalaryRoundUp
                              ? "Round Up"
                              : policy?.isGrossSalaryRoundDown
                              ? "Round Down"
                              : "-"}
                          </h2>
                          <p>Gross salary </p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: gray900,
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ fontSize: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {policy?.intNetPayableSalaryRoundDigits
                              ? policy?.intNetPayableSalaryRoundDigits
                              : policy?.isNetPayableSalaryRoundUp
                              ? "Round Up"
                              : policy?.isNetPayableSalaryRoundDown
                              ? "Round Down"
                              : "-"}
                          </h2>
                          <p>Net payable</p>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: gray900,
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Texture style={{ fontSize: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {policy?.isSalaryShouldBeFullMonth
                              ? "1 to end of the month"
                              : policy?.intPreviousMonthStartDay &&
                                policy?.intNextMonthEndDay
                              ? `Previous month ${policy?.intPreviousMonthStartDay} to salary month ${policy?.intNextMonthEndDay}`
                              : "-"}
                          </h2>
                          <p>Salary Period</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PolicyApplySingle;
