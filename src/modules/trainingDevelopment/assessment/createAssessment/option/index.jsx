import { ErrorMessage } from "formik";
import FormikInput from "../../../../../common/FormikInput";
import CloseIcon from "@mui/icons-material/Close";
import TextError from "../error";

const CreateOptions = ({
  answer,
  newOption,
  setFieldValue,
  handleBlur,
  errors,
  touched,
  newMark,
  remove,
  index,
}) => {
  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ gap: "10px" }}
    >
      <div
        className="d-flex align-items-center"
        style={{
          flexGrow: "1",
          width: "100%",
          gap: "5px",
        }}
      >
        <div
          className=""
          style={{
            width: "15px",
            height: "15px",
            border: "2px solid #323232",
            borderRadius: "50%",
          }}
        ></div>
        <div className="mt-2" style={{ width: "100%" }}>
          <FormikInput
            classes="input-sm"
            placeholder="Enter option..."
            value={answer?.ansTitle}
            name={newOption}
            type="text"
            onChange={(e) => {
              setFieldValue(newOption, e.target.value);
              //   setValues((prev) => ({
              //     ...prev,
              //     description: e.target.value,
              //   }));
            }}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <ErrorMessage name={newOption} component={TextError} />
          {/* <DefaultInput
                classes="input-sm"
                placeholder="Enter option..."
                value={values?.description}
                name="description"
                type="text"
                onChange={(e) => {
                  //   setValues((prev) => ({
                  //     ...prev,
                  //     description: e.target.value,
                  //   }));
                }}
                errors={errors}
                touched={touched}
              /> */}
        </div>
      </div>
      <div
        className=""
        style={{
          gap: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "180px",
          flexShrink: "0",
        }}
      >
        <p className="">Mark</p>
        <div className="mt-2">
          <FormikInput
            classes="input-sm"
            placeholder=""
            value={answer?.mark}
            name={newMark}
            onChange={(e) => {
              setFieldValue(newMark, e.target.value);
            }}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <ErrorMessage name={newMark} component={TextError} />
        </div>
        <CloseIcon
          sx={{
            width: "22px",
            height: "22px",
            cursor: "pointer",
          }}
          onClick={() => remove(index)}
        />
      </div>
    </div>
  );
};

export default CreateOptions;
