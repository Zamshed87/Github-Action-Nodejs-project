import { Avatar } from "@material-ui/core";
import { ControlPoint, EditOutlined, NotesOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikTextArea from "../../../../../../common/FormikTextArea";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import { updateEmployeeProfile } from "../../helper";

const initData = {
  remarks: "",
  autoId: 0,
};

export default function Remarks({ empId, buId, wgId }) {
  const [isForm, setIsForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState({});

  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getEmployeeProfileViewData(empId, setComment, setLoading, buId, wgId);
  };

  const saveHandler = (values, cb, isDelete = false, autoId) => {
    const payload = {
      partType: "AboutEmployee",
      employeeId: empId,
      autoId: autoId || 0,
      value: isDelete ? "" : values?.remarks,
      insertByEmpId: employeeId,
      isActive: isDelete ? false : true,
    };
    updateEmployeeProfile(payload, setLoading, cb);
  };

  useEffect(() => {
    getEmployeeProfileViewData(empId, setComment, setLoading, buId, wgId);
  }, [empId, buId, wgId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(
            values,
            () => {
              resetForm(initData);
              setIsForm(false);
              getData();
            },
            false,
            values?.autoId
          );
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
            <Form>
              {loading && <Loading />}
              <div className="others">
                {isForm ? (
                  <>
                    <h5>Remarks</h5>
                    <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                      <FormikTextArea
                        classes="textarea-with-label"
                        value={values?.remarks}
                        name="remarks"
                        type="text"
                        placeholder="Remarks"
                        errors={errors}
                        touched={touched}
                      />
                      <div
                        className="d-flex align-items-center justify-content-end"
                        style={{ marginTop: "24px" }}
                      >
                        <button
                          className="btn btn-cancel"
                          style={{ marginRight: "16px" }}
                          type="button"
                          onClick={() => {
                            setIsForm(false);
                            resetForm(initData);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-green btn-green-disable"
                          type="submit"
                          disabled={!values?.remarks}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {comment?.employeeProfileLandingView?.remarks === "" ||
                    comment?.employeeProfileLandingView?.remarks === null ? (
                      <div className={isForm ? "d-none" : "d-block"}>
                        <h5>Remarks</h5>
                        <div
                          className="d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsForm(true)}
                        >
                          <div
                            className="item"
                            style={{ position: "relative" }}
                          >
                            <ControlPoint
                              sx={{ color: success500, fontSize: "16px" }}
                            />
                          </div>
                          <div className="item">
                            <p>Add your remarks</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="item">
                        <div className="d-flex align-items-start">
                          <Avatar className="overviewAvatar">
                            <NotesOutlined
                              sx={{
                                color: gray900,
                                fontSize: "18px",
                              }}
                            />
                          </Avatar>
                          <div className="item-info">
                            <p>
                              {comment?.employeeProfileLandingView?.remarks}
                            </p>
                            {/* <p>Remarks</p> */}
                          </div>
                        </div>
                        <ActionMenu
                          color={gray900}
                          fontSize={"18px"}
                          options={[
                            {
                              value: 1,
                              label: "Edit",
                              icon: (
                                <EditOutlined
                                  sx={{ marginRight: "10px", fontSize: "16px" }}
                                />
                              ),
                              onClick: () => {
                                setIsForm(true);
                                setFieldValue(
                                  "remarks",
                                  comment?.employeeProfileLandingView?.remarks
                                );
                                setFieldValue(
                                  "autoId",
                                  comment?.employeeProfileLandingView
                                    ?.intEmployeeBasicInfoId
                                );
                              },
                            },
                          ]}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
