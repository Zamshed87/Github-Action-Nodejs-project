import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ClearIcon from "@mui/icons-material/Clear";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FileUploadField from "../../../../common/FileUploadField";
import FormikInput from "../../../../common/FormikInput";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";

const initData = {
  employee: "",
  self: "",
  keepAnonymous: "",
  subject: "",
  description: "",
  details: "",
};

const validationSchema = Yup.object().shape({
  details: Yup.string().required("Please enter description"),
  subject: Yup.string().required("Please enter subject"),
});

function GrievanceSelfCreate() {
  //const [loading, setLoading] = useState(false);
  let history = useHistory();
  const [fileId, setFileId] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const documents = [
    { document: "letter.doc" },
    { document: "screenshot.jpg" },
  ];

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
              <div className="all-candidate">
                <div className="table-card">
                  <div className="table-card-heading">
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="text-center"
                        style={{
                          borderRadius: "50%",
                          backgroundColor: "#F2F2F7",
                          height: "30px",
                          width: "30px",
                        }}
                        onClick={() => history.goBack()}
                      >
                        <ArrowBackIcon
                          style={{ cursor: "pointer", marginTop: "5px" }}
                          sx={{
                            fontSize: "18px",
                          }}
                        />
                      </div>
                      <p className="ml-3 font-weight-bold">Add Grievance</p>
                    </div>
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
                          {/* <label
                                  htmlFor=""
                                  style={{ color: "rgba(0, 0, 0, 0.6)" }}
                                >
                                  Employee
                                </label> */}
                          {/* <FormikSelect
                                  name="emplloyee"
                                  options={[
                                    { value: 1, label: "Employee" },
                                    { value: 2, label: "Intern" },
                                  ]}
                                  // value={values?.leaveType}
                                  // onChange={(valueOption) => {
                                  //   setFieldValue("", valueOption);
                                  // }}
                                  styles={customStyles}
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={false}
                                /> */}
                          <div className="w-50 d-flex justify-content-between align-items-center">
                            <div>
                              <input
                                style={{ cursor: "pointer" }}
                                type="checkbox"
                                aria-label="Checkbox"
                              />
                              <label className="m-0 ml-2" htmlFor="">
                                Self
                              </label>
                            </div>

                            {/* <div>
                                    <input
                                      style={{ cursor: "pointer" }}
                                      type="checkbox"
                                      aria-label="Checkbox"
                                      placeholder="Self"
                                    />
                                    <label className="m-0 ml-2" htmlFor="">
                                      Keep anonymous
                                    </label>
                                  </div> */}
                          </div>
                        </div>

                        <div className="col-lg-12 mt-3">
                          <label
                            htmlFor=""
                            style={{ color: "rgba(0, 0, 0, 0.6)" }}
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
                            <label htmlFor="">Description</label>
                            <ReactQuill
                              value={values?.details}
                              onChange={(e) => {
                                setFieldValue("details", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 input-field-main">
                          <div className=" mb-3">
                            <label className="mb-1">Upload Files</label>
                            <FileUploadField
                              fileId={fileId}
                              setFileId={setFileId}
                            />
                          </div>
                          {documents?.map((item, index) => (
                            <li key={index} className="d-flex align-items-center justify-content-start">
                              <div
                                style={{ color: "#009cde", cursor: "pointer" }}
                              >
                                <AttachmentIcon sx={{ fontSize: "20px" }} />
                                <span> </span>
                                {item.document}
                              </div>
                              <ClearIcon
                                sx={{
                                  fontSize: "15px",
                                  color: "#6B778C",
                                  marginLeft: "20px",
                                }}
                              />
                            </li>
                          ))}
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

export default GrievanceSelfCreate;
