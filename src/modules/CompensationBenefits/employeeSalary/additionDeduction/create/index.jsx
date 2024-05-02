/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import companyLogo from "../../../../../assets/images/company/logo.png";
import PrimaryButton from "../../../../../common/PrimaryButton";
import ViewModal from "../../../../../common/ViewModal";
import DashboardHead from "../../../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../../../layout/menuComponent/SideMenu";
import AddEditForm from "./addEditFile";
const initData = {
  search: "",
  employee: "",
  process: "",
};

const validationSchema = Yup.object({});

// this component is not used in the project 
 function AdditonDeductionCreate() {
  const saveHandler = (values) => {};

  // const loadUserList = (v) => {
  //   if (v?.length < 2) return [];
  //   return axios
  //     .get(`/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${1}&BusinessUnitId=${2}&Search=${v}`)
  //     .then((res) => {
  //       return res?.data;
  //     })
  //     .catch((err) => []);
  // };

  const [isAddEditForm, setIsAddEditForm] = useState(false);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              {/* <Dashboard Head
                companyLogo={companyLogo}
                moduleTitle={"Compensation & Benefits"}
              /> */}
              <div className="employee-profile-main">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    <div className="col-md-10 table-card">
                      <div className="table-card-heading">
                        <h2>Salary Addition & Deduction</h2>
                        <div className="table-card-head-right">
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="Create Salary"
                            icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                            onClick={() => setIsAddEditForm(true)}
                          />
                        </div>
                      </div>
                      <div className="table-card-body">
                        <div className="table-card-styled employee-table-card tableOne">
                          <table className="table ">
                            <thead>
                              <tr>
                                <th>
                                  <div className="sortable">
                                    <span>Employee Name</span>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable center">
                                    <span>Addition/Deduction Type</span>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable center">
                                    <span>Month</span>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable center">
                                    <span>Year</span>
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
            </Form>
          </>
        )}
      </Formik>
      <ViewModal
        show={isAddEditForm}
        title="Create New Employee"
        onHide={() => setIsAddEditForm(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <AddEditForm setIsAddEditForm={setIsAddEditForm} />
      </ViewModal>
    </>
  );
}
