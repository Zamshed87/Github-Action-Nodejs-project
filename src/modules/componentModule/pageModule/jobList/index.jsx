import { AddOutlined, SearchOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import FormikInput from "./../../../../common/FormikInput";
import PrimaryButton from "./../../../../common/PrimaryButton";
import ViewModal from "./../../../../common/ViewModal";
import JobLanding from "./jobLanding";
import CreateJobModal from "./modalContent/CreateJobModal";

const initData = {
  search: "",
  jobTitle: "",
  jobLevel: "",
  experience: "",
  employmentType: "",
  salary: "",
  fromRange: "",
  toRange: "",
  location: "",
  vacancy: "",
};

const validationSchema = Yup.object().shape({});

export default function JobListLanding() {
  const [showModal, setShowModal] = useState(false);

  // save handler
  const saveHandler = (values, cb) => {};

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
          handleChange,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="job-posting-list">
              <div className="container-fluid">
                <div className="table-card">
                  <div className="table-card-heading">
                    <h2>Job lists</h2>
                    <div className="table-card-head-right">
                      <FormikInput
                        classes="search-input fixed-width mb-0"
                        inputClasses="search-inner-input"
                        placeholder="Search"
                        value={values?.search}
                        name="search"
                        type="text"
                        trailicon={<SearchOutlined sx={{ color: "#323232" }} />}
                        errors={errors}
                        touched={touched}
                      />
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label="Create job"
                        icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                        onClick={() => {
                          setShowModal(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-card-body">
                    <JobLanding />
                  </div>
                </div>

                {/* Modal */}
                <ViewModal
                  show={showModal}
                  title={"Create Job List"}
                  onHide={() => setShowModal(false)}
                  size="xl"
                  backdrop="static"
                  classes="default-modal creat-job-modal"
                >
                  <CreateJobModal
                    setShowModal={setShowModal}
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                </ViewModal>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
