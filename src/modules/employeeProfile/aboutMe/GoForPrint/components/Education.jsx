import React from "react";
import { School } from "@mui/icons-material";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { gray700, gray900, greenColor } from "../../../../../utility/customColor";

const Education = ({ empEducation, objProps }) => {
  const {
    values,
    setFieldValue,
    isShowCheckBox,
  } = objProps;
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <School sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Education
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowEducation"
              checked={values?.isShowEducation}
              onChange={(e) => {
                setFieldValue("isShowEducation", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            <ol
              style={{
                listStyleType: "disc",
                marginLeft: "18px",
                marginBottom: "0",
              }}
            >
              {empEducation?.map((item, index) => (
                <li key={index}>
                  <p>
                    Institute Name - {" "}
                    <small>{item?.strInstituteName}</small>
                  </p>
                  <p>
                    Field Of Study - {" "}
                    <small>{item?.strEducationFieldOfStudy}</small>
                  </p>
                  <p>
                    Result - {" "}
                    <small>{item?.strCgpa}</small>
                  </p>
                  <p>
                    Start Date - {" "}
                    <small>{dateFormatter(item?.dteStartDate)}</small>
                  </p>
                  <p>
                    End Date - {" "}
                    <small>{dateFormatter(item?.dteEndDate)}</small>
                  </p>
                  {item?.isForeign && (
                    <>
                      <p>
                        Is Foreign - {" "}
                        <small>Foreign</small>
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Education;
