import { AccountBox } from "@mui/icons-material";
import React from "react";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  gray700,
  gray900,
  greenColor
} from "../../../../../utility/customColor";

const Personal = ({ empInfo, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <AccountBox sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Personal
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowPersonal"
              checked={values?.isShowPersonal}
              onChange={(e) => {
                setFieldValue("isShowPersonal", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>
              Marital Status -{" "}
              <small>
                {empInfo?.strMaritalStatus ? empInfo?.strMaritalStatus : " "}
              </small>
            </p>
            <p>
              Blood group -{" "}
              <small>
                {empInfo?.strBloodGroup ? empInfo?.strBloodGroup : " "}
              </small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;
