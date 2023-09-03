import { FactCheck } from "@mui/icons-material";
import React from "react";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  gray700,
  gray900,
  greenColor
} from "../../../../../utility/customColor";

const Identification = ({ empInfo, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <FactCheck sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Identification
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowIdentification"
              checked={values?.isShowIdentification}
              onChange={(e) => {
                setFieldValue("isShowIdentification", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>
              NID - <small>{empInfo?.empEmployeePhotoIdentity?.strNid}</small>
            </p>
            <p>
              Nationality -{" "}
              <small>{empInfo?.empEmployeePhotoIdentity?.strNationality}</small>
            </p>
            <p>
              Passport -{" "}
              <small>{empInfo?.empEmployeePhotoIdentity?.strPassport}</small>
            </p>
            <p>
              Card number -{" "}
              <small>
                {empInfo?.employeeProfileLandingView?.strCardNumber}
              </small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Identification;
