import { Popover } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const initData = {
  trainerTypePopup: "",
};
const status = ["Requested", "To do", "In progress", "Completed", "Cancelled"];

const validationSchema = Yup.object().shape({
  trainerTypePopup: Yup.string().required("Please enter trainer type"),
});

const TaskStatusPopover = ({ propsObj }) => {
  const { id, open, anchorEl, handleClose } = propsObj;
  return (
    <>
      <Formik initialValues={initData} validationSchema={validationSchema}>
        {() => (
          <>
            <Popover
              sx={{
                "& .MuiPaper-root": {
                  width: "150px",

                  borderRadius: "4px",
                },
              }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
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
                <div className="" style={{ width: "100%" }}>
                  {status?.map((item, index) => (
                    <p key={index} className="hover py-2 pl-3 ">
                      {item}
                    </p>
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
export default TaskStatusPopover;
