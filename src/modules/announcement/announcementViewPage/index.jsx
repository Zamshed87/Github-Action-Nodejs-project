/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import BackButton from "../../../common/BackButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import "./index.css";

const initData = {
  search: "",
};

export default function AnnouncementViewPage() {
  const location = useLocation();
  const { dteExpiredDate, dteCreatedAt, strDetails, strTitle } = location.state;

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
                  <div className="announcement_header">
                    <h4>{strTitle}</h4>
                    <div className="d-flex add_info ">
                      Published date: {dateFormatterForInput(dteCreatedAt)}
                    </div>
                    <div className="d-flex add_info">
                      Expiry date: {dateFormatterForInput(dteExpiredDate)}
                    </div>
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
