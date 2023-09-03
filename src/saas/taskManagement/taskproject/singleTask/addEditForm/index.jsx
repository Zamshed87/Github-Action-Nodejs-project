import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import BackButton from "../../../../../common/BackButton";
import FileUploadField from "../../../../../common/FileUploadField";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import FormikTextArea from "../../../../../common/FormikTextArea";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import "./indexStyle.css";

const validationSchema = Yup.object().shape({
  taskName: Yup.string().required("Task Name is required"),
  assignee: Yup.object()
    .shape({
      label: Yup.string().required("Assignee is required"),
      value: Yup.string().required("Assignee is required"),
    })
    .typeError("Assignee is required"),
  // startDate: Yup.string().required("Start Date date is required"),
  reporter: Yup.object()
    .shape({
      label: Yup.string().required("Reporter is required"),
      value: Yup.string().required("Reporter is required"),
    })
    .typeError("Reporter is required"),
  priority: Yup.object()
    .shape({
      label: Yup.string().required("Priority is required"),
      value: Yup.string().required("Priority is required"),
    })
    .typeError("Priority is required"),
  addedMember: Yup.object()
    .shape({
      label: Yup.string().required("Member is required"),
      value: Yup.string().required("Member is required"),
    })
    .typeError("Member is required"),
});

const initData = {
  taskName: "",
  description: "",
  assignee: "",
  startDate: "",
  endDate: "",
  reporter: "",
  priority: "",
  addedMember: "",
};

export default function TMProjectSingleTaskForm() {
  const dispatch = useDispatch();

  //Background Colors
  const bgColor = [
    { clr: "#2D9BF0" },
    { clr: "#A2845E" },
    { clr: "#0CA789" },
    { clr: "#808080" },
    { clr: "#AF52D6" },
    { clr: "#8FD14F" },
    { clr: "#FF696C" },
  ];

  // let history = useHistory();

  // States
  const [fileId, setFileId] = useState("");
  const [selectedColor, setSelectedColor] = useState("#2D9BF0");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <div className="table-card">
                <div className="table-card-heading heading pt-0">
                  <BackButton title={"Create Task"} />
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm(initData);
                          setSelectedColor("#2D9BF0");
                          setSelectedIndex(0);
                        }}
                        className="btn btn-default mr-2"
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        onSubmit={handleSubmit}
                        type="submit"
                        className="btn btn-default flex-center"
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled">
                    <div className="form-card col-md-12 pl-0">
                      <div className="card">
                        <div className="progress" style={{ opacity: "0.9" }}>
                          <div
                            className="progress-bar progress-bar-striped w-100"
                            style={{ backgroundColor: selectedColor }}
                            role="progressbar"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>

                        <div
                          className="card-body"
                          style={{ padding: "0.5rem 0 0.75rem 0" }}
                        >
                          <div className="row m-lg-1 m-0">
                            <div className="col-lg-12">
                              <div className="input-field-main">
                                <label>
                                  Task Name
                                  <span className="text-danger">*</span>
                                </label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.taskName}
                                  name="taskName"
                                  type="text"
                                  onChange={(e) => {
                                    setFieldValue("taskName", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder=""
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="input-field-main">
                                <label>Description (Optional)</label>
                                <FormikTextArea
                                  classes="textarea-with-label"
                                  value={values?.description}
                                  name="description"
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  onChange={(e) => {
                                    setFieldValue(
                                      "description",
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  style={{ height: "93px" }}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 pt-3 text-uppercase">
                              <label>Member information</label>
                              <hr />
                            </div>
                            <div className="col-lg-6 pt-3 text-uppercase">
                              <label>Project timeline & system</label>
                              <hr />
                            </div>

                            <div className="col-lg-6 pt-2">
                              <div className="input-field-main">
                                <div className="d-flex justify-content-between align-items-center">
                                  <label>
                                    Assignee
                                    <span className="text-danger">*</span>
                                  </label>
                                  <label className="text-primary font-weight-bold">
                                    Assign to me
                                  </label>
                                </div>
                                <FormikSelect
                                  classes="input-sm"
                                  styles={customStyles}
                                  name="assignee"
                                  options={[
                                    { value: 1, label: "Rahim" },
                                    { value: 2, label: "Karim" },
                                    { value: 3, label: "Jalil" },
                                  ]}
                                  value={values?.assignee}
                                  onChange={(valueOption) => {
                                    setFieldValue("assignee", valueOption);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>Start Date</label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.startDate}
                                  name="startDate"
                                  type="date"
                                  onChange={(e) => {
                                    setFieldValue("startDate", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder=""
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>End Date</label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.endDate}
                                  name="endDate"
                                  type="date"
                                  onChange={(e) => {
                                    setFieldValue("endDate", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder=""
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 pt-3">
                              <div className="input-field-main">
                                <div className="d-flex justify-content-between align-items-center">
                                  <label>
                                    Reporter
                                    <span className="text-danger">*</span>
                                  </label>
                                  <label className="text-primary font-weight-bold">
                                    Assign to me
                                  </label>
                                </div>
                                <FormikSelect
                                  classes="input-sm"
                                  styles={customStyles}
                                  name="reporter"
                                  options={[
                                    { value: 1, label: "Rahim" },
                                    { value: 2, label: "Karim" },
                                    { value: 3, label: "Jalil" },
                                  ]}
                                  value={values?.reporter}
                                  onChange={(valueOption) => {
                                    setFieldValue("reporter", valueOption);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 pt-2">
                              <div className="input-field-main">
                                <label>
                                  Priority
                                  <span className="text-danger">*</span>
                                </label>
                                <FormikSelect
                                  classes="input-sm"
                                  styles={customStyles}
                                  name="priority"
                                  options={[
                                    { value: 1, label: "High" },
                                    { value: 2, label: "Medium" },
                                    { value: 3, label: "Low" },
                                  ]}
                                  value={values?.priority}
                                  onChange={(valueOption) => {
                                    setFieldValue("priority", valueOption);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 pt-2">
                              <div className="input-field-main">
                                <label>
                                  Add Member
                                  <span className="text-danger">*</span>
                                </label>
                                <FormikSelect
                                  classes="input-sm"
                                  styles={customStyles}
                                  name="addedMember"
                                  options={[
                                    { value: 1, label: "Jubayer Alam Khan" },
                                    { value: 2, label: "Bulbul Alam Khan" },
                                    { value: 3, label: "Tahmid Islam" },
                                    { value: 4, label: "Rayhan Alam Khan" },
                                    { value: 5, label: "Mahumd Islam" },
                                  ]}
                                  value={values?.addedMember}
                                  onChange={(valueOption) => {
                                    setFieldValue("addedMember", valueOption);
                                  }}
                                  isMulti
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 pt-2">
                              <div className="input-field-main">
                                <label className="mb-1">Upload Files</label>
                                <FileUploadField
                                  fileId={fileId}
                                  setFileId={setFileId}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <label></label>
                            </div>
                            <div className="col-lg-6 text-uppercase pt-3">
                              <label>Background Color</label>
                              <hr />
                            </div>
                            <div className="col-lg-6">
                              <label></label>
                            </div>

                            <div className="col-lg-6 d-flex">
                              {bgColor?.map((item, i) => (
                                <div
                                  key={i}
                                  className="square square-sm m-1"
                                  style={{
                                    backgroundColor: item?.clr,
                                    border: ` ${
                                      selectedIndex === i
                                        ? "2px solid blue"
                                        : "none"
                                    }`,
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setSelectedColor(item?.clr);
                                    setSelectedIndex(i);
                                  }}
                                ></div>
                              ))}
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
