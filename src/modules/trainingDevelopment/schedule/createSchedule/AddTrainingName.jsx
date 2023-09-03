import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import { createTrainingNameDDL, getTrainingNameAllDDL } from "./helper";

const initData = {
  newTrainingName: "",
};

const validationSchema = Yup.object().shape({
  newTrainingName: Yup.string().required("Training name is required"),
});

const AddTrainingName = ({
  orgId,
  wgId,
  employeeId,
  accountId,
  buId,
  setTrainingNameDDL,
  setShow,
  setLoading,
}) => {
  const saveHandler = (values, cb) => {
    const payload = [
      {
        intTrainingId: 0,
        strTrainingName: values?.newTrainingName,
        strTrainingCode: "DEMO",
        intAccountId: accountId,
        intBusinessUnitId: buId,
        isActive: true,
        intActionBy: employeeId,
        dteActionDate: new Date(),
      },
    ];

    const callBack = () => {
      cb();
      getTrainingNameAllDDL(buId, wgId, setTrainingNameDDL);
      setShow(false);
    };

    createTrainingNameDDL(payload, callBack);
  };

  return (
    <>
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
            <Form onSubmit={handleSubmit}>
              <div className="modalBody pt-0 px-0">
                <div className="row mx-0">
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Training Name</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.newTrainingName}
                        placeholder=""
                        name="newTrainingName"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("newTrainingName", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <button
                      className="btn btn-green btn-green-disable mt-4"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddTrainingName;
