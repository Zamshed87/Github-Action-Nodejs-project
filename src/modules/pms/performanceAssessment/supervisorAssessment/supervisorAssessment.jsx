import { Box, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import CompetenciesForSupervisorAssessment from "./competenciesData";
import ValuesForSupervisorAssessment from "./valuesData";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import BackButton from "../../../../common/BackButton";

const SupervisorAssessmentNew = () => {
  const { id, yearId, quarterId } = useParams();
  const location = useLocation();
  const EmployeeInfo = location?.state?.data;
  const [value, setValue] = useState("2");
  const {
    permissionList,
    // profileData: { buId, orgId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30494),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {permission?.isEdit ? (
        <div className="table-card userGroup-wrapper">
          <div className="d-flex align-items-center">
            <BackButton />
            <h2 style={{ color: "#344054" }}>Supervisor Assessment</h2>
          </div>
          <div className="tab-panel">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={(_, newValue) => {
                    setValue(newValue);
                  }}
                  aria-label="basic tabs example"
                  TabIndicatorProps={{
                    style: { background: "var(--primary-color)", height: 3 },
                  }}
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "var(--primary-color)",
                    },
                    "& .MuiTab-root": { color: "#667085" },
                    "& .Mui-selected": { color: "var(--primary-color)" },
                  }}
                >
                  <Tab label="VALUES" value="2" />
                  <Tab label="COMPETENCIES" value="3" />
                </Tabs>
              </Box>
            </Box>
          </div>
          {value === "2" ? (
            <ValuesForSupervisorAssessment
              tabValue={value}
              EmployeeInfo={EmployeeInfo}
            />
          ) : value === "3" ? (
            <CompetenciesForSupervisorAssessment
              tabValue={value}
              EmployeeInfo={EmployeeInfo}
            />
          ) : null}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default SupervisorAssessmentNew;
