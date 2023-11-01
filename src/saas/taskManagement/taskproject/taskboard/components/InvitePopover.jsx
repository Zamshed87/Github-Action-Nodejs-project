import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Popover } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import { customStyles } from "../../../../../utility/selectCustomStyle";

const initData = {
  trainerTypePopup: "",
};

const validationSchema = Yup.object().shape({
  trainerTypePopup: Yup.string().required("Please enter trainer type"),
});

const InvitePopover = ({ propsObj }) => {
  const { id1, open1, anchorEl1, handleClose1 } = propsObj;
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
                  width: "300px",
                  // height: "250px",
                  borderRadius: "4px",
                },
              }}
              id={id1}
              open={open1}
              anchorEl={anchorEl1}
              onClose={handleClose1}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <div>
                <div className="" styles={{ width: "100%" }}>
                  <div>
                    <div
                      className="d-flex align-items-center py-2 px-3 "
                      style={{ marginTop: "15px" }}
                    >
                      <PersonAddAltIcon
                        sx={{ marginRight: "10px", color: "#323232" }}
                      />
                      <p style={{ color: "#414C55", fontSize: "16px" }}>
                        Invite to board
                      </p>
                    </div>
                    <hr />
                  </div>
                  <div className="input-field-main px-3">
                    <FormikInput
                      classes="input-sm"
                      name="trainerTypePopup"
                      placeholder="Email Address or Name"
                      value={values?.trainerTypePopup}
                      onChange={(e) => {
                        setFieldValue("trainerTypePopup", e.target.value);
                      }}
                      styles={customStyles}
                      // errors={errors}
                      // touched={touched}
                    />
                  </div>

                  <div className="master-filter-btn-group d-flex w-100  px-3">
                    <button
                      style={{
                        backgroundColor: " #F2F2F7",
                        color: "#C4C4C4",
                        width: "100%",
                        marginBottom: "31px",
                      }}
                      type="button"
                      className="btn mt-3"
                      onClick={() => {}}
                    >
                      Send invitation
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
export default InvitePopover;
