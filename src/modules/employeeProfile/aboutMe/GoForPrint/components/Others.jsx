import { Dns } from "@mui/icons-material";
import React from "react";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  gray700,
  gray900,
  greenColor
} from "../../../../../utility/customColor";

const Others = ({ empBiograpgyAndHobbies, empSocial, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <Dns sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Others
            </h3>
          </div>
          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowOthers"
              checked={values?.isShowOthers}
              onChange={(e) => {
                setFieldValue("isShowOthers", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>
              Biography - <small>{empBiograpgyAndHobbies?.strBiography}</small>
            </p>
            <p>
              Hobbies - <small>{empBiograpgyAndHobbies?.strHobbies}</small>
            </p>
            {empSocial?.length > 0 && (
              <>
                <h2
                  style={{
                    color: gray900,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  Social Media
                </h2>
                <ol
                  style={{
                    listStyleType: "disc",
                    marginLeft: "18px",
                    marginBottom: "0",
                  }}
                >
                  {empSocial?.map((item, index) => (
                    <li key={index}>
                      <p>
                        <small
                          className="pointer"
                          onClick={(e) => {
                            window.open(item?.strSocialMedialLink, "_blank");
                          }}
                        >
                          {item?.strSocialMedialLink}
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

export default Others;
