import { Avatar } from "@material-ui/core";
import { ControlPoint, ModeEditOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ActionMenu from "../../../../../../common/ActionMenu";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewDataAuth } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import { updateFBProfile } from "../helper";
import FacebookIcon from "@mui/icons-material/Facebook";
import LoginWithFacebook from "../../../../../auth/login/LoginWithFacebook";
import { toast } from "react-toastify";
const initData = {
  profile: "",
};

const validationSchema = Yup.object().shape({
  profile: Yup.string().required("Facebook is required"),
  // .matches(/^(?:\+?88)?01[15-9]\d{8}/, "Phone Number is invalid"),
});

function FaceBook({ empId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [singleData, setSingleData] = useState("");

  const { strLoginId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, response = null) => {
    if (response === null) {
      return toast.error("Please login with facebook");
    }
    if (singleData) {
      const payload = {
        partType: "UpdateOAuthLoginFacbookId",
        employeeId: empId,
        strWebhookUrl: values?.profile || singleData,
      };
      const callback = () => {
        getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateFBProfile(
        payload,
        setLoading,
        callback,
        response,
        empId,
        strLoginId
      );
    } else {
      const payload = {
        partType: "UpdateOAuthLoginFacbookId",
        employeeId: empId,
        strWebhookUrl: values?.profile || singleData,
      };
      const callback = () => {
        getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateFBProfile(payload, setLoading, callback, response, strLoginId);
    }
  };

  // const deleteHandler = (values) => {
  //   const payload = {
  //     partType: "UpdateOAuthLoginFacbookId",
  //     employeeId: empId,
  //     strWebhookUrl: "",
  //   };
  //   const callback = () => {
  //     getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);
  //     setStatus("empty");
  //     setSingleData("");
  //   };
  //   updateEmployeeProfile(payload, setLoading, callback);
  // };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          profile: singleData ? singleData : "",
        }}
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
              {loading && <Loading />}
              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <h5>Facebook Profile 1</h5>
                      <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                        {/* <FormikInput
                          name="profile"
                          value={values?.profile}
                          onChange={(e) => {
                            setFieldValue("profile", e.target.value);
                          }}
                          placeholder=" "
                          errors={errors}
                          touched={touched}
                          classes="input-sm"
                        />
                        <div
                          className="d-flex align-items-center justify-content-end"
                          style={{ marginTop: "24px" }}
                        >
                          <button
                            type="button"
                            variant="text"
                            className="btn btn-cancel"
                            style={{ marginRight: "16px" }}
                            onClick={() => {
                              setStatus("empty");
                              setSingleData("");
                              setIsCreateForm(false);
                              setFieldValue("profile", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            variant="text"
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={!values.profile}
                          >
                            Save
                          </button>
                        </div> */}
                        <LoginWithFacebook
                          // history={history}
                          isSelf={true}
                          saveHandler={saveHandler}
                          setLoading={setLoading}
                          values={values}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* landing */}

                  <>
                    {rowDto?.userVM?.loginFacbookId === "" ||
                    rowDto?.userVM?.loginFacbookId === null ? (
                      <>
                        <h5>Facebook Profile 2</h5>
                        <div
                          className="d-flex align-items-center"
                          style={{ marginBottom: "25px", cursor: "pointer" }}
                          onClick={() => {
                            setStatus("input");
                            setIsCreateForm(true);
                          }}
                        >
                          <div
                            className="item"
                            style={{ position: "relative", top: "-3px" }}
                          >
                            <ControlPoint
                              sx={{ color: success500, fontSize: "16px" }}
                            />
                          </div>
                          <div className="item">
                            <p>Add your Facebook Profile</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="view">
                          <div className="row">
                            <div className="col-lg-1">
                              <Avatar className="overviewAvatar">
                                <FacebookIcon
                                  sx={{
                                    color: gray900,
                                    fontSize: "18px",
                                  }}
                                />
                              </Avatar>
                            </div>
                            <div className="col-lg-10">
                              <h4>{rowDto.userVM?.loginFacbookId}</h4>
                              <small>Facebook Profile</small>
                            </div>
                            <div className="col-lg-1">
                              <ActionMenu
                                color={gray900}
                                fontSize={"18px"}
                                options={[
                                  {
                                    value: 1,
                                    label: "Edit",
                                    icon: (
                                      <ModeEditOutlined
                                        sx={{
                                          marginRight: "10px",
                                          fontSize: "16px",
                                        }}
                                      />
                                    ),
                                    onClick: () => {
                                      setSingleData(
                                        rowDto?.userVM?.loginFacbookId
                                      );
                                      setStatus("input");
                                      setIsCreateForm(true);
                                    },
                                  },
                                  // {
                                  //   value: 2,
                                  //   label: "Delete",
                                  //   icon: (
                                  //     <DeleteOutline
                                  //       sx={{
                                  //         marginRight: "10px",
                                  //         fontSize: "16px",
                                  //       }}
                                  //     />
                                  //   ),
                                  //   onClick: () => {
                                  //     deleteHandler(values);
                                  //   },
                                  // },
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                </>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default FaceBook;
