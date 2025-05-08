/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import BackButton from "../../../common/BackButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import "./index.css";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { VisibilityOutlined } from "@mui/icons-material";
import { Tooltip } from "react-bootstrap";

const initData = {
  search: "",
};

export default function AnnouncementViewPage() {
  const location = useLocation();
  const {
    dteExpiredDate,
    dteCreatedAt,
    strDetails,
    strTitle,
    intAttachmentId,
  } = location.state;

  const saveHandler = (values) => {};

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
              <div className="table-card">
                <div className="table-card-heading">
                  <BackButton />
                  <div className="table-card-head-right"></div>
                </div>
                <div className="table-card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="announcement_header">
                      <h4>{strTitle}</h4>
                      <div className="d-flex add_info ">
                        Published date: {dateFormatterForInput(dteCreatedAt)}
                      </div>
                      <div className="d-flex add_info">
                        Expiry date: {dateFormatterForInput(dteExpiredDate)}
                      </div>
                    </div>
                    {intAttachmentId && (
                      <div style={{ marginLeft: "50px", display: "flex" }}>
                        <p> Attachment</p>

                        <Tooltip title="Attachment View">
                          {/* <button type="button" className="iconButton"> */}
                          <VisibilityOutlined
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                getDownlloadFileView_Action(intAttachmentId)
                              );
                            }}
                          />
                          {/* </button> */}
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  <div
                    className="announcement_body"
                    dangerouslySetInnerHTML={{
                      __html: strDetails,
                    }}
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
