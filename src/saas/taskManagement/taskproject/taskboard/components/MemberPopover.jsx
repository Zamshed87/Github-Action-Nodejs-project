import GroupsIcon from "@mui/icons-material/Groups";
import { Avatar, Popover } from "@mui/material";
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

const members = [
  { name: "Arif", position: "UX Desiner" },
  { name: "Atik", position: "frontend developer" },
  { name: "Topu", position: "backend developer" },
  { name: "Manna", position: "DevOps" },
  { name: "Manna", position: "DevOps" },
  { name: "Manna", position: "DevOps" },
];

const MemberPopover = ({ propsObj }) => {
  const { id2, open2, anchorEl2, handleClose2 } = propsObj;
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

                  borderRadius: "4px",
                },
              }}
              id={id2}
              open={open2}
              anchorEl={anchorEl2}
              onClose={handleClose2}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div>
                <div
                  className=""
                  style={{ maxHeight: "468px", overflow: "auto" }}
                  styles={{ width: "100%" }}
                >
                  <div>
                    <div
                      className="d-flex align-items-center py-2 px-3 "
                      style={{ marginTop: "15px" }}
                    >
                      <GroupsIcon
                        sx={{ marginRight: "15px", color: "#637381" }}
                      />
                      <p style={{ color: "#414C55", fontSize: "16px" }}>
                        Board member
                      </p>
                    </div>
                    <hr />
                  </div>
                  <div className="input-field-main px-3 pt-2 pb-4">
                    <FormikInput
                      classes="input-sm"
                      name="trainerTypePopup"
                      placeholder="Search member"
                      value={values?.trainerTypePopup}
                      onChange={(e) => {
                        setFieldValue("trainerTypePopup", e.target.value);
                      }}
                      styles={customStyles}
                    />
                  </div>
                  {members &&
                    members.map((member, index) => (
                      <div key={index}>
                        <div className="d-flex align-items-center px-3 py-0 ">
                          <Avatar
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg"
                          />
                          <div className=" ml-3">
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#55616C",
                              }}
                            >
                              {member?.name}
                            </p>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                color: "#97A5B1",
                              }}
                              className="text-secondary"
                            >
                              {member?.position}
                            </span>
                          </div>
                        </div>
                        <hr style={{ margin: "8px 0px" }} />
                      </div>
                    ))}
                </div>
              </div>
            </Popover>
          </>
        )}
      </Formik>
    </>
  );
};
export default MemberPopover;
