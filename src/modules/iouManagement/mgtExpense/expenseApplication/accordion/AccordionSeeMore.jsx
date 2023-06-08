import { Formik } from "formik";
import * as Yup from "yup";
import { gray700 } from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const initData = {
  email: "",
  searchString: "",
};

const AccordionCom = ({ isAccordion, empBasic }) => {
  const validationSchema = Yup.object({});
  const saveHandler = (values) => {
    console.log(values);
  };

  return (
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
          <div
            className={` ${
              isAccordion
                ? "accordion-main active-accordion-main"
                : "accordion-main"
            }`}
          >
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Date Of Joining -
                </small>{" "}
                {dateFormatter(
                  empBasic?.employeeProfileLandingView?.dteJoiningDate
                )}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Work Length -
                </small>{" "}
                {empBasic?.employeeProfileLandingView?.strServiceLength}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Shift -
                </small>{" "}
                {empBasic?.employeeProfileLandingView?.strCalenderName}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Supervisor -
                </small>{" "}
                {empBasic?.employeeProfileLandingView?.strSupervisorName}
              </p>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AccordionCom;
