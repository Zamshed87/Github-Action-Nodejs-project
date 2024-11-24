import { Box, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import CompetenciesForSelfAssessment from "./competenciesData";
import ValuesForSelfAssessment from "./valuesData";

const SelfAssessment = () => {
  const [value, setValue] = useState("2");
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30442),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {permission?.isView ? (
        <div className="table-card userGroup-wrapper">
          <div className="justify-content-between">
            <h2 style={{ color: "#344054" }}>Self Assessment</h2>
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
                    style: { background: "#299647", height: 3 },
                  }}
                  sx={{
                    "& .MuiTabs-indicator": { backgroundColor: "#299647" },
                    "& .MuiTab-root": { color: "#667085" },
                    "& .Mui-selected": { color: "#299647" },
                  }}
                >
                  <Tab label="VALUES" value="2" />
                  <Tab label="COMPETENCIES" value="3" />
                </Tabs>
              </Box>
            </Box>
          </div>
          {value === "2" ? (
            <ValuesForSelfAssessment tabValue={value} />
          ) : value === "3" ? (
            <CompetenciesForSelfAssessment tabValue={value} />
          ) : null}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default SelfAssessment;
