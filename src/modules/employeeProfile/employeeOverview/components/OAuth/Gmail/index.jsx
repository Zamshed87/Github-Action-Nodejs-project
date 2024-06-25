import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutline,
  ModeEditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import GoogleIcon from "@mui/icons-material/Google";
import { getEmployeeProfileViewDataAuth } from "../../../../../../modules/employeeProfile/employeeFeature/helper";
import { updateEmployeeProfile } from "../helper";
import Loading from "../../../../../../common/loading/Loading";
import FormikInput from "../../../../../../common/FormikInput";
import { gray900, success500 } from "../../../../../../utility/customColor";
import ActionMenu from "../../../../../../common/ActionMenu";
const initData = {
  gemail: "",
};

const validationSchema = Yup.object().shape({
  gemail: Yup.string().email("Gmail is invalid").required("Gmail is required"),
});

function Gmails({ empId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [singleData, setSingleData] = useState("");

  const { employeeId, strLoginId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "UpdateOAuthLoginGmailId",
        employeeId: employeeId,
        strWebhookUrl: values?.gemail || singleData,
        strLoginId: strLoginId || 0,
        accountId: intAccountId || 0,
      };
      const callback = () => {
        getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    } else {
      const payload = {
        partType: "UpdateOAuthLoginGmailId",
        employeeId: empId,
        strWebhookUrl: values?.gemail,
        strLoginId: strLoginId || 0,
        accountId: intAccountId || 0,
      };
      const callback = () => {
        getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    }
  };

  const deleteHandler = (values) => {
    const payload = {
      partType: "UpdateOAuthLoginGmailId",
      employeeId: empId,
      strWebhookUrl: "",
      strLoginId: strLoginId || 0,
      accountId: intAccountId || 0,
    };

    const callback = () => {
      getEmployeeProfileViewDataAuth(empId, setRowDto, setLoading);
      setStatus("empty");
      setSingleData("");
    };
    updateEmployeeProfile(payload, setLoading, callback);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          gemail: singleData ? singleData : "",
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
                      <h5>Gmail</h5>
                      <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                        <FormikInput
                          name="gemail"
                          value={values?.gemail}
                          onChange={(e) => {
                            setFieldValue("gemail", e.target.value);
                          }}
                          placeholder=" "
                          errors={errors}
                          touched={touched}
                          classes="input-sm"
                        />
                        <div
                          className="d-flex flex-column flex-md-row  align-items-end  justify-content-end mt-md-3 mt-sm-0"
                          style={{ gap: "5px" }}
                        >
                          <button
                            type="button"
                            variant="text"
                            className="btn btn-cancel"
                            onClick={() => {
                              setStatus("empty");
                              setSingleData("");
                              setIsCreateForm(false);
                              setFieldValue("gemail", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            variant="text"
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={!values.gemail}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* landing */}
                  {!singleData && (
                    <>
                      {rowDto?.userVM?.loginGmailId === "" ||
                      rowDto?.userVM?.loginGmailId === null ? (
                        <>
                          <h5>Gmail</h5>
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
                              <p>Add your Gmail</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="view">
                            <div className="row aboutmeRes">
                              <div className="col-1 col-lg-1 mr-1 mr-md-0">
                                <Avatar className="overviewAvatar">
                                  <GoogleIcon
                                    sx={{
                                      color: gray900,
                                      fontSize: "18px",
                                    }}
                                  />
                                </Avatar>
                              </div>
                              <div className="col-7 col-lg-10">
                                <h4>{rowDto?.userVM?.loginGmailId}</h4>
                                <small>Gmail</small>
                              </div>
                              <div className="col-2 col-lg-1">
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
                                          rowDto?.userVM?.loginGmailId
                                        );
                                        setStatus("input");
                                        setIsCreateForm(true);
                                      },
                                    },
                                    {
                                      value: 2,
                                      label: "Delete",
                                      icon: (
                                        <DeleteOutline
                                          sx={{
                                            marginRight: "10px",
                                            fontSize: "16px",
                                          }}
                                        />
                                      ),
                                      onClick: () => {
                                        deleteHandler(values);
                                      },
                                    },
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default Gmails;
