import React from "react";
import { BusinessCenter } from "@mui/icons-material";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { gray700, gray900, greenColor } from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const Experience = ({ empWork, empTraining, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;

  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <BusinessCenter sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Experience
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowExp"
              checked={values?.isShowExp}
              onChange={(e) => {
                setFieldValue("isShowExp", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            {empWork?.length > 0 && (
              <>
                <h2
                  style={{
                    color: gray900,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  Work Experience
                </h2>

                <ol
                  style={{
                    listStyleType: "disc",
                    marginLeft: "18px",
                    marginBottom: "0",
                  }}
                >
                  {empWork?.map((item, index) => (
                    <li key={index}>
                      <p>
                        Job Title - {" "}
                        <small>{item?.strJobTitle}</small>
                      </p>
                      <p>
                        Start Date - {" "}
                        <small>{dateFormatter(item?.dteFromDate)}</small>
                      </p>
                      <p>
                        End Date - {" "}
                        <small>
                          {dateFormatter(item?.dteToDate)}
                        </small>
                      </p>
                      <p>
                        Duration - {" "}
                        <small>{item?.Duration}</small>
                      </p>
                      <p>
                        Location - {" "}
                        <small>{item?.strLocation}</small>
                      </p>
                      <p>
                        remarks - {" "}
                        <small>{item?.strRemarks}</small>
                      </p>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {empTraining?.length > 0 && (
              <>
                <h2
                  style={{
                    color: gray900,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  Training & Development
                </h2>

                <ol
                  style={{
                    listStyleType: "disc",
                    marginLeft: "18px",
                    marginBottom: "0",
                  }}
                >
                  {empTraining?.map((item, index) => (
                    <li key={index}>
                      <p>
                        Institute Name - {" "}
                        <small>{item?.strInstituteName}</small>
                      </p>
                      <p>
                        Training Name - {" "}
                        <small>{item?.strTrainingTitle}</small>
                      </p>
                      <p>
                        Start Date - {" "}
                        <small>
                          {dateFormatter(item?.dteStartDate)}
                        </small>
                      </p>
                      <p>
                        End Date - {" "}
                        <small>
                          {dateFormatter(item?.dteEndDate)}
                        </small>
                      </p>
                      <p>
                        Duration - {" "}
                        <small>{item?.Duration}</small>
                      </p>
                      <p>
                        Expiration date -{" "}
                        <small>
                          {dateFormatter(item?.dteExpiryDate)}
                        </small>
                      </p>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Experience;
