import { Box, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import CompetenciesForSupervisorAssessment from "./competenciesData";
import ValuesForSupervisorAssessment from "./valuesData";

const SupervisorAssessment = () => {
  const [value, setValue] = useState("2");
  const {
    permissionList,
    // profileData: { buId, orgId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30443),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {permission?.isView ? (
        <div className="table-card userGroup-wrapper">
          <div className="justify-content-between">
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
            <ValuesForSupervisorAssessment tabValue={value} />
          ) : value === "3" ? (
            <CompetenciesForSupervisorAssessment tabValue={value} />
          ) : null}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default SupervisorAssessment;
