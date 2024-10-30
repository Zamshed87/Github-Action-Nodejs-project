import React from "react";
import { Explore } from "@mui/icons-material";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  gray700,
  gray900,
  greenColor,
} from "../../../../../utility/customColor";
import { shallowEqual, useSelector } from "react-redux";

const Contact = ({ empContact, empAddress, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <Explore sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Contact & Places
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowContact"
              checked={values?.isShowContact}
              onChange={(e) => {
                setFieldValue("isShowContact", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>
              Email - <small>{empContact?.strPersonalMail}</small>
            </p>
            <p>
              Work Email - <small>{empContact?.strOfficeMail}</small>
            </p>
            <p>
              Phone - <small>{empContact?.strPersonalMobile}</small>
            </p>
            <p>
              Work phone - <small>{empContact?.strOfficeMobile}</small>
            </p>
            <p>
              Permanent Address -{" "}
              <small>
                {empAddress?.[0]?.strAddressDetails
                  ? `${empAddress?.[0]?.strAddressDetails}, `
                  : ""}
                {empAddress?.[0]?.strDistrictOrState
                  ? `${empAddress?.[0]?.strDistrictOrState}, `
                  : ""}
                {empAddress?.[0]?.strDivision
                  ? `${empAddress?.[0]?.strDivision}, `
                  : ""}
                {empAddress?.[0]?.strCountry
                  ? `${empAddress?.[0]?.strCountry}, `
                  : ""}
              </small>
            </p>
            {orgId === 7 && (
              <p>
                Permanent Address (In Bangla) -{" "}
                <small>{empAddress?.[0]?.strAddressDetailsBn}</small>
              </p>
            )}
            <p>
              Present Address -{" "}
              <small>
                {empAddress?.[1]?.strAddressDetails
                  ? `${empAddress?.[1]?.strAddressDetails}, `
                  : ""}
                {empAddress?.[1]?.strDistrictOrState
                  ? `${empAddress?.[1]?.strDistrictOrState}, `
                  : ""}
                {empAddress?.[1]?.strDivision
                  ? `${empAddress?.[1]?.strDivision}, `
                  : ""}
                {empAddress?.[1]?.strCountry
                  ? `${empAddress?.[1]?.strCountry}, `
                  : ""}
              </small>
            </p>
            {orgId === 7 && (
              <p>
                Present Address (In Bangla) -{" "}
                <small>{empAddress?.[1]?.strAddressDetailsBn}</small>
              </p>
            )}
            <p>
              Other Address -{" "}
              <small>
                {empAddress?.[2]?.strAddressDetails
                  ? `${empAddress?.[2]?.strAddressDetails}, `
                  : ""}
                {empAddress?.[2]?.strDistrictOrState
                  ? `${empAddress?.[2]?.strDistrictOrState}, `
                  : ""}
                {empAddress?.[2]?.strDivision
                  ? `${empAddress?.[2]?.strDivision}, `
                  : ""}
                {empAddress?.[2]?.strCountry
                  ? `${empAddress?.[2]?.strCountry}, `
                  : ""}
              </small>
            </p>
            {orgId === 7 && (
              <p>
                Other Address (In Bangla) -{" "}
                <small>{empAddress?.[2]?.strAddressDetailsBn}</small>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
