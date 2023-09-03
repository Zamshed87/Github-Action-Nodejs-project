import { Avatar } from "@material-ui/core";
import { ArrowBack, PrintOutlined } from "@mui/icons-material";
import React from "react";
import { useHistory } from "react-router";
import Button from "@mui/material/Button";

const PrintView = ({ children, isSignature, theading,singleData }) => {
  const history = useHistory();
  return (
    <div className="print-preview-page">
      <div className="print-header w-100">
        <div className="card-about-info-main col-md-12">
          <div className="d-flex align-items-center">
            <div style={{ width: "33.33%" }}>
              <ArrowBack
                sx={{
                  color: "rgba(0, 0, 0, 0.7)",
                  cursor: "pointer",
                }}
                onClick={() => history.goBack()}
              />
            </div>
            <div style={{ width: "33.33%", textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  lineHeight: "21px",
                  color: "rgba(0, 0, 0, 0.7)",
                }}
              >
                {theading}
              </h3>
            </div>
            <div style={{ width: "33.33%", textAlign: "right" }}>
              <Button
                onClick={(e) =>
                  history.push({
                    // pathname:
                    //   "/employee-profile/employee/about-me-details/go-for-print",
                    // state: {
                    //   empBasic: empBasic?.Result?.[0],
                    //   empWork: empWork?.Result,
                    //   empTraining: empTraining?.Result,
                    //   empEducation: empEducation?.Result,
                    //   empFamily: empFamily?.Result,
                    //   empSocial: empSocial?.Result,
                    // },
                  })
                }
                variant="outlined"
                sx={{
                  borderColor: "rgba(0, 0, 0, 0.6)",
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  letterSpacing: "1.25px",
                  "&:hover": {
                    borderColor: "rgba(0, 0, 0, 0.6)",
                  },
                }}
                startIcon={<PrintOutlined sx={{ color: "rgba(0, 0, 0, 0.6)" }} />}
              >
                Go for print
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="print-page-main-body mt-3 p-3">
        <div className="print-page-body mt-3 ">
          <div className="border-bottom">
            <div className="header d-flex justify-content-between  ">
              <div>
                <div className="d-flex align-items-center">
                  <Avatar className="companyLogo" alt="Remy Sharp" src="" />
                  <p className="companyName">{singleData?.BusinessUnitName}</p>
                </div>
                <div className="company-address">
                  <p>
                   {singleData?.BusinessUnitAddress}
                  </p>
                </div>
              </div>
              <div className="company-info">
                <p>{singleData?.WebsiteURL}</p>
                <p>{singleData?.BusinessUnitCode}</p>
              </div>
            </div>
          </div>

          <div className="main-table-body">{children}</div>
          <div className="footer pr-3 pl-3">
            {isSignature && (
              <div className="row m-0">
                <div className="col-md-4 p-2">
                  <div className="border-bottom addSign"></div>
                  <div className="signer">Department Head</div>
                </div>
                <div className="col-md-4 p-2">
                  <div className="border-bottom addSign"></div>
                  <div className="signer">Admin</div>
                </div>
                <div className="col-md-4 p-2">
                  <div className="border-bottom addSign"></div>
                  <div className="signer">Accounts</div>
                </div>
              </div>
            )}
            <div className="footer-text d-flex justify-content-between">
              <p>System Generated Report. Printed On 28 Nov, 2021, 05:30 PM</p>
              <p>Page 1 of 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
