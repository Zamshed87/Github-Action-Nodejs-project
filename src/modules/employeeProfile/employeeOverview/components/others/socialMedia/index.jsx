/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikInput from "../../../../../../common/FormikInput";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import { updateEmployeeProfile } from "../../contact/helper";

const initData = {
  socialMedia: "",
  autoId: 0,
};

export default function SocialMedia({ empId, buId, wgId }) {
  const [rowDto, setRowDto] = useState([]);
  const [isForm, setIsForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empSocial, setEmpSocial] = useState({});

  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getEmployeeProfileViewData(empId, setEmpSocial, setLoading, buId, wgId);
  };

  const saveHandler = (values, cb, isDelete = false, autoId) => {
    const payload = {
      partType: "SocialMedia",
      employeeId: empId,
      autoId: autoId || 0,
      value: isDelete ? "" : values?.socialMedia,
      insertByEmpId: employeeId,
      isActive: isDelete ? false : true,
    };
    updateEmployeeProfile(payload, setLoading, cb);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (empSocial?.empSocialMedia?.length > 0) {
      setRowDto(empSocial?.empSocialMedia);
    } else {
      setRowDto([]);
    }
  }, [empSocial]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
                {(empSocial?.empSocialMedia?.strSocialMedialLink !== "" ||
                  empSocial?.empSocialMedia?.strSocialMedialLink !== null) && (
                  <div className={isForm ? "d-none" : "d-block"}>
                    <h5>Social Media</h5>
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
                        <p>Add your social media</p>
                      </div>
                    </div>
                  </div>
                )}
                {rowDto?.map((item, index) => (
                  <div className="item" key={index}>
                    <div className="d-flex align-items-center">
                      <Avatar className="overviewAvatar">
                        <LanguageIcon
                          sx={{
                            color: gray900,
                            fontSize: "18px",
                          }}
                        />
                      </Avatar>
                      <div className="item-info">
                        <h6>{item?.strSocialMedialLink}</h6>
                        <p>Social Media</p>
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
                              "socialMedia",
                              item?.strSocialMedialLink
                            );
                            setFieldValue("autoId", item?.intSocialMediaId);
                          },
                        },
                        {
                          value: 2,
                          label: "Delete",
                          icon: (
                            <DeleteOutlined
                              sx={{ marginRight: "10px", fontSize: "16px" }}
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
                              true,
                              item?.intSocialMediaId
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                ))}
                {isForm && (
                  <>
                    <h5>Social Media</h5>
                    <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                      <FormikInput
                        value={values?.socialMedia}
                        name="socialMedia"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        onChange={(e) => {
                          setFieldValue("socialMedia", e.target.value);
                        }}
                        placeholder="Enter URL"
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
                          disabled={!values?.socialMedia}
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
