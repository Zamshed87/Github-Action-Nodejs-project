import React from "react";
import { Formik, Form } from "formik";
import DashboardHead from "../../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../../layout/menuComponent/SideMenu";
import companyLogo from "../../../../assets/images/company/logo.png";

const initData = {};

const TaxCalc = () => {
  const saveHandler = (values) => {};

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
            <Form onSubmit={handleSubmit}>
              <DashboardHead
                companyLogo={companyLogo}
                moduleTitle={"Compensation & Benefits"}
              />
              <div className="loan-application">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    <div className="col-md-10">
                      <div className="table-card">
                        <div className="table-card-heading mt-3 mb-3"></div>
                        <div className="table-card-body">TaxCalc</div>
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
};

export default TaxCalc;
