/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
// import placeholderImg from "../../../../assets/images/placeholderImg.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton, InputBase } from "@mui/material";
import BackButton from "../../../../common/BackButton";
import FileUploadField from "../../../../common/FileUploadField";
import FormikTextArea from "../../../../common/FormikTextArea";
import PrimaryButton from "../../../../common/PrimaryButton";

const initData = {
  taskName: "",
  startTime: "",
  endTime: "",
};

export default function TMProjectForm() {
  const [fileId, setFileId] = useState("");
  // let history = useHistory();
  const dispatch = useDispatch();
  const inputFile = useRef(null);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // disable past date
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <Form>
            <div className="table-card">
              <div className="table-card-heading heading pt-0">
                <BackButton title={"Create Project"} />
                <div className="table-card-heading ">
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <div>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Save"}
                            // onClick={() =>
                            //   history.push(
                            //     "/tm/task-project/"
                            //   )
                            // }
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-card-body">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label htmlFor="" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                        Project Name <span className="text-danger">*</span>
                      </label>
                      <FormikInput
                        classes="input-sm"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        onChange={(e) => {}}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input-field-main">
                      <label htmlFor="" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                        Start Time <span className="text-danger">*</span>
                      </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.fromDate}
                        placeholder=""
                        min={disablePastDate()}
                        name="fromDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input-field-main">
                      <label htmlFor="" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                        End Time <span className="text-danger">*</span>
                      </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.toDate}
                        name="toDate"
                        min={values?.fromDate}
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  {/* description  */}
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
                          setFieldValue("description", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        style={{ height: "93px" }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label htmlFor="" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                        Add Member <span className="text-danger">*</span>
                      </label>
                      {/* <FormikInput
                        classes="input-sm"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        onChange={(e) => {}}
                      /> */}
                      <div
                        style={{
                          border: "1px solid #c4c4c4",
                          width: "full",
                          borderRadius: "4px",
                          display: "flex",
                          height: "30px",
                        }}
                        component="form"
                      >
                        <IconButton
                          type="submit"
                          sx={{
                            "&.MuiButtonBase-root": {
                              padding: "8px !important",
                              "&:hover": {
                                "background-color": "transparent",
                              },
                              "&:focus": {
                                "background-color": "transparent",
                              },
                            },
                          }}
                        >
                          <AccountCircleIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                        <InputBase
                          sx={{
                            ml: 1,
                            flex: 1,
                            width: 300,
                            "&.MuiInputBase-root": {
                              fontSize: "12px",
                            },
                          }}
                          // onChange={(e) => {
                          //   setValue(e.target.value);
                          // }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* upload image  */}
                  <div className="col-lg-12 pt-2">
                    <div className="input-field-main">
                      <label className="mb-1">Upload Files</label>
                      <FileUploadField fileId={fileId} setFileId={setFileId} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
