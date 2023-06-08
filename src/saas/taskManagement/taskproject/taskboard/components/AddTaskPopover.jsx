import { Popover } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import PrimaryButton from "../../../../../common/PrimaryButton";
import { customStyles } from "../../../../../utility/selectCustomStyle";

const initData = {
  trainerTypePopup: "",
};

const validationSchema = Yup.object().shape({
  trainerTypePopup: Yup.string().required("Please enter trainer type"),
});

const AddTaskPopover = ({ propsObj }) => {
  const { id, open, anchorEl, handleClose } = propsObj;
  return (
    <>
      <Formik initialValues={initData} validationSchema={validationSchema}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Popover
              sx={{
                "& .MuiPaper-root": {
                  width: "314px",
                  height: "121px",
                  borderRadius: "4px",
                },
              }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div>
                <div className="container my-2 " styles={{ width: "100%" }}>
                  <div className="input-field-main pt-3">
                    <FormikInput
                      classes="input-sm"
                      name="trainerTypePopup"
                      placeholder="Enter list name"
                      value={values?.trainerTypePopup}
                      onChange={(e) => {
                        setFieldValue("trainerTypePopup", e.target.value);
                      }}
                      styles={customStyles}
                      // errors={errors}
                      // touched={touched}
                    />
                  </div>

                  <div
                    style={{ marginTop: "15px" }}
                    className="master-filter-btn-group d-flex "
                  >
                    {/* <button
                      style={{ backgroundColor: "#34A853", color: "white", padding: '6px 6px 6px 8px', height: '32px' }}
                      type="button"
                      className="btn mt-3"
                      onClick={() => {}}
                    >
                      Add List
                    </button> */}
                    <PrimaryButton
                      type="button"
                      style={{
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor: "#34A853",
                        color: "#FFFFFF",
                      }}
                      className="btn  flex-center"
                      label={"Add List"}
                    ></PrimaryButton>
                    {/* <button
                      style={{ backgroundColor: "#BDBDBD", color: "white" }}
                      type="button"
                      className="btn  mt-3 ml-3 "
                      onClick={() => {}}
                    >
                      cancel
                    </button> */}
                    <button
                      type="button"
                      className="btn"
                      style={{
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginLeft: "8px",
                        color: "#FFFFFF",
                        backgroundColor: "#BDBDBD",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Popover>
          </>
        )}
      </Formik>
    </>
  );
};
export default AddTaskPopover;
