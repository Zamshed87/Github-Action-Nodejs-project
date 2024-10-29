import React from "react";
import { Wc } from "@mui/icons-material";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  gray700,
  gray900,
  greenColor,
} from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const Family = ({ empFamily, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <Wc sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Family & Relationship
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowFamily"
              checked={values?.isShowFamily}
              onChange={(e) => {
                setFieldValue("isShowFamily", e.target.checked);
              }}
            />
          )}
        </div>
        {empFamily?.map((item, index) => (
          <div className="accordion-body" key={index}>
            <div className="left">
              <h2
                style={{
                  color: gray900,
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {item?.strGrantorNomineeType} Contact
              </h2>
              <p>
                Name - <small>{item?.strRelativesName}</small>
              </p>
              <p>
                Name (In Bangla) - <small>{item?.strRelativesNameBn}</small>
              </p>
              <p>
                Relationship - <small>{item?.strRelationship}</small>
              </p>
              <p>
                Mobile number - <small>{item?.strPhone}</small>
              </p>
              <p>
                Email - <small>{item?.strEmail}</small>
              </p>
              <p>
                NID - <small>{item?.strNid}</small>
              </p>
              <p>
                Date of Birth -{" "}
                <small>{dateFormatter(item?.dteDateOfBirth)}</small>
              </p>
              <p>
                Remarks - <small>{item?.strRemarks}</small>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Family;
