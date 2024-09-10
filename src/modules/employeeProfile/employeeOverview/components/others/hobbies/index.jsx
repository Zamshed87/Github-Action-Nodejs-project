/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikInput from "../../../../../../common/FormikInput";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import { updateEmployeeProfile } from "../../helper";

const initData = {
  hobbies: "",
};

export default function Hobbies({ empId, buId, wgId }) {
  const [rowDto, setRowDto] = useState({});
  const [isForm, setIsForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [empBasic, setEmpBasic] = useState({});

  const { employeeId, intAccountId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getEmployeeProfileViewData(empId, setEmpBasic, setLoading, buId, wgId);
  };

  const saveHandler = (values, cb, isDelete = false) => {
    const payload = {
      partType: "Hobbies",
      employeeId: empId,
      autoId:
        empBasic?.empEmployeePhotoIdentity?.intEmployeePhotoIdentityId || 0,
      value: isDelete ? "" : values?.hobbies,
      insertByEmpId: employeeId,
      isActive: true,
    };
    updateEmployeeProfile(payload, setLoading, cb);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (empBasic?.empEmployeePhotoIdentity) {
      setRowDto({
        hobbies: empBasic?.empEmployeePhotoIdentity?.strHobbies,
        autoId: empBasic?.empEmployeePhotoIdentity?.intEmployeeBasicInfoId,
      });
    } else {
      setRowDto({});
    }
  }, [empBasic]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          hobbies: empBasic?.empEmployeePhotoIdentity?.strHobbies,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setIsForm(false);
            getData();
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
            <Form>
              {loading && <Loading />}
              <div className="others">
                {(empBasic?.empEmployeePhotoIdentity?.strHobbies === "" ||
                  empBasic?.empEmployeePhotoIdentity?.strHobbies === null) && (
                  <div className={isForm ? "d-none" : "d-block"}>
                    <h5>Hobbies</h5>
                    <div
                      className="d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsForm(true)}
                    >
                      <div className="item" style={{ position: "relative" }}>
                        <ControlPoint
                          sx={{ color: success500, fontSize: "16px" }}
                        />
                      </div>
                      <div className="item">
                        <p>Add your hobbies</p>
                      </div>
                    </div>
                  </div>
                )}
                {rowDto?.hobbies && !isForm && (
                  <div className="item">
                    <div className="d-flex">
                      <Avatar className="overviewAvatar">
                        <GroupWorkIcon
                          sx={{
                            color: gray900,
                            fontSize: "18px",
                          }}
                        />
                      </Avatar>
                      <div className="item-info">
                        <h6>{rowDto?.hobbies}</h6>
                        <p>Hobbies</p>
                      </div>
                    </div>
                    <ActionMenu
                      color={gray900}
                      fontSize={"18px"}
                      options={[
                        ...(isOfficeAdmin ||
                        (intAccountId === 5 && !rowDto.isMarkCompleted)
                          ? [
                              {
                                value: 1,
                                label: "Edit",
                                icon: (
                                  <EditOutlined
                                    sx={{
                                      marginRight: "10px",
                                      fontSize: "16px",
                                    }}
                                  />
                                ),
                                onClick: () => {
                                  setIsForm(true);
                                },
                              },
                              {
                                value: 2,
                                label: "Delete",
                                icon: (
                                  <DeleteOutlined
                                    sx={{
                                      marginRight: "10px",
                                      fontSize: "16px",
                                    }}
                                  />
                                ),
                                onClick: () => {
                                  saveHandler(
                                    values,
                                    () => {
                                      resetForm(initData);
                                      setIsForm(false);
                                      getData();
                                    },
                                    true
                                  );
                                },
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                )}
                {isForm && (
                  <>
                    <h5>Hobbies</h5>
                    <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                      <FormikInput
                        value={values?.hobbies}
                        name="hobbies"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        onChange={(e) => {
                          setFieldValue("hobbies", e.target.value);
                        }}
                        placeholder=" "
                        classes="input-sm"
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
                          disabled={!values?.hobbies}
                        >
                          Save
                        </button>
                      </div>
                    </div>
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
