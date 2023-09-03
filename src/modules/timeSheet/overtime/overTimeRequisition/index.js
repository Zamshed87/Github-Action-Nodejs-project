/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import { useState } from "react";
import Loading from "../../../../common/loading/Loading";
import DashboardHead from "../../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../../layout/menuComponent/SideMenu";
import companyLogo from "./../../../../assets/images/company/logo.png";

const initData = {};

export default function OverTimeRequisition() {
  const [loading, setLoading] = useState(false);

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
              {loading && <Loading />}
              <DashboardHead
                companyLogo={companyLogo}
                moduleTitle={"Employee Self Service"}
              />
              <div className="overtime-report">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    <div className="col-md-10">
                      <div className="table-card">
                        <div className="table-card-heading"></div>
                        <div className="table-card-body">
                          OverTimeRequisition
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
