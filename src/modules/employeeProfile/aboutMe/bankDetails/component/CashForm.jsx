import { Form, Formik } from "formik";
import React from "react";

const CashForm = ({
  setBankData,
  setConfirmationMOdal,
  rowDto,
  setRowDto,
  empBasic,
  singleData,
}) => {
  const initData = {};

  const saveHandler = (values, cb) => {
    setConfirmationMOdal(true);
    setRowDto([
      {
        id: rowDto.length + 1,
        cash: true,
      },
    ]);
  };

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
            <Form>
              <div className="bank-about-me-form">
                <div className="about-me-bank-details-footer">
                  <button
                    className="btn btn-cancel"
                    type="button"
                    style={{
                      marginRight: "16px",
                    }}
                    onClick={() => {
                      if (empBasic?.intBankOrWalletType === 3) {
                        setBankData("complete");
                      } else {
                        setBankData("empty");
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default CashForm;
