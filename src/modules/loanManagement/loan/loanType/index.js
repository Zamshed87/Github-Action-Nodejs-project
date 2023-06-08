/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import companyLogo from "../../../../assets/images/company/logo.png";
import Loading from "../../../../common/loading/Loading";
import DashboardHead from "../../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../../layout/menuComponent/SideMenu";

const initData = {};

const LoanType = () => {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

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
              {loading && <Loading />}
              <DashboardHead
                companyLogo={companyLogo}
                moduleTitle={"Administration"}
              />
              <div className="holiday-exception">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    <div className="col-md-10">
                      <div className="table-card">
                        <div className="table-card-heading mt-3">
                          <p></p>
                          <div className="table-card-head-right"></div>
                        </div>
                        <div className="table-card-body">LoanType</div>
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

export default LoanType;
