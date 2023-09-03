/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import DashboardHead from "./../../../../layout/dashboardHead/DashboardHead";
import companyLogo from "./../../../../assets/images/company/logo.png";
import SideMenu from "./../../../../layout/menuComponent/SideMenu";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import axios from "axios";

const initData = {
  search: "",
  employee: "",
  process: "",
};

export default function AdditionDeduction() {

  const history = useHistory();
  const saveHandler = (values) => { };

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(`/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${1}&BusinessUnitId=${2}&Search=${v}`)
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <DashboardHead companyLogo={companyLogo} moduleTitle={"Compensation & Benefits"} />
              <div className="all-candidate">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    <div className="col-md-10">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <h2>Salary Addition & Deduction</h2>
                          <div className="table-card-head-right">
                            <PrimaryButton
                              type="button"
                              className="btn btn-default flex-center"
                              label={"Create"}
                              icon={<AddOutlined sx={{ marginRight: "0px", fontSize: "15px" }} />}
                              onClick={(e) => {
                                history.push(`/compensationAndBenefits/employeeSalary/additionDeduction/create`);
                              }}
                            />
                          </div>
                        </div>
                        <div className="table-card-body">
                          <div className="card">
                            <div className="card-body">
                              <div className="row m-lg-1 m-0 align-items-center">
                                <div className="col-lg-4">
                                  <label>Employee</label>
                                  <AsyncFormikSelect
                                    selectedValue={values?.employee}
                                    isSearchIcon={true}
                                    handleChange={(valueOption) => {
                                      setFieldValue("employee", valueOption);
                                    }}
                                    loadOptions={loadUserList}
                                  />
                                </div>
                                <div className="col-lg-4">
                                  <div className="input-field-main">
                                    <label htmlFor="">process</label>
                                    <FormikSelect
                                      name="process"
                                      options={[]}
                                      value={values?.process}
                                      //   label="Country"
                                      onChange={(valueOption) => {
                                        setFieldValue("process", valueOption);
                                      }}
                                      placeholder=" "
                                      styles={customStyles}
                                      errors={errors}
                                      touched={touched}
                                      isDisabled={false}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-1 align-content-end">
                                  <div className="d-flex justify-content-between">
                                    <button className="btn button btn-green w-100 mt-3" type="submit">
                                      Show
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="table-card-body">
                            <div className="table-card-styled tableOne pt-4">
                              <table className="table ">
                                <thead>
                                  <tr>
                                    <th>
                                      <div className="sortable">
                                        <span>Employee Name</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable">
                                        <span>HR Position</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable">
                                        <span>Designation</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable justify-content-end">
                                        <span>Department</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable center">
                                        <span>Workplace Group </span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable center">
                                        <span>Employment Type</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable center">
                                        <span>Type</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable center">
                                        <span>Addition/Deduction Type</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable center">
                                        <span>Amount</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable center">
                                        <span>Action</span>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
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
    </>
  );
}
