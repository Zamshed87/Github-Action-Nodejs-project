/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import BackButton from "../../../../common/BackButton";
import FileUploadField from "../../../../common/FileUploadField";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../../utility/newSelectCustomStyle";

const initData = {
  employee: { value: 1, label: "Sara Rahman" },
  keepAnonymous: "",
  subject: "",
  description: "",
  details: "",
};

const validationSchema = Yup.object().shape({
  details: Yup.string().required("Please enter description"),
  subject: Yup.string().required("Please enter subject"),
});

function GrievanceManagementCreate() {
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  const [fileId, setFileId] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  return (
    <>
      <Formik initialValues={initData} validationSchema={validationSchema}>
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
              {/* {loading && <Loading />} */}
              <div className="table-card grievanceDetails">
                <div className="table-card-heading">
                  <BackButton title={"Add Grievance"} />
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center px-3"
                          label={"Save"}
                          // onClick={() =>}
                        />
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="row justify-content-center">
                  <div
                    className="col-lg-12 mt-3 shadow leave-form card"
                    style={{ height: "95vh" }}
                  >
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          htmlFor=""
                          style={{ color: "rgba(0, 0, 0, 0.87)" }}
                        >
                          Employee
                        </label>
                        <FormikSelect
                          name="type"
                          options={[
                            { value: 1, label: "Sara Rahman" },
                            { value: 2, label: "Jubayer Alam" },
                          ]}
                          value={values?.type}
                          //   label="Country"
                          onChange={(valueOption) => {
                            setFieldValue("employee", valueOption);
                          }}
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                        <div className="w-50 d-flex justify-content-between align-items-center">
                          <div>
                            <input
                              style={{ cursor: "pointer" }}
                              type="checkbox"
                              aria-label="Checkbox"
                            />
                            <label
                              className="m-0 ml-2"
                              htmlFor=""
                              style={{ color: "rgba(0, 0, 0, 0.87)" }}
                            >
                              Self
                            </label>
                          </div>
                          <div>
                            <input
                              style={{ cursor: "pointer" }}
                              type="checkbox"
                              aria-label="Checkbox"
                              placeholder="Self"
                            />
                            <label
                              className="m-0 ml-2"
                              htmlFor=""
                              style={{ color: "rgba(0, 0, 0, 0.87)" }}
                            >
                              Keep anonymous
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12 mt-3">
                        <label
                          htmlFor=""
                          style={{ color: "rgba(0, 0, 0, 0.87)" }}
                        >
                          Subject
                        </label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.subject}
                          placeholder=""
                          name="subject"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("subject", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-12">
                        <div className="input-filed-main">
                          <label
                            htmlFor=""
                            style={{ color: "rgba(0, 0, 0, 0.87)" }}
                          >
                            Description
                          </label>
                          <ReactQuill
                            value={values?.details}
                            onChange={(e) => {
                              setFieldValue("details", e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 input-field-main">
                        <label
                          className="mb-1"
                          style={{ color: "rgba(0, 0, 0, 0.87)" }}
                        >
                          Upload Files
                        </label>
                        <FileUploadField
                          fileId={fileId}
                          setFileId={setFileId}
                        />
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

export default GrievanceManagementCreate;
