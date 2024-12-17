import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CompetenciesForSelfAssessment from "./competenciesData";
import ValuesForSelfAssessment from "./valuesData";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import BarAssessmentForSelf from "./barAssessmentForSelf";

const SelfAssessmentNew = () => {
  const [value, setValue] = useState("2");
  const {
    permissionList,
    profileData: { evaluationCriteriaOfPms },
  } = useSelector((store) => store?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30493),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!evaluationCriteriaOfPms) {
      toast.warn("Evaluation Criteria of PMS is nullable");
    } else if (evaluationCriteriaOfPms === "360") {
      setValue("4");
    }
  }, [evaluationCriteriaOfPms]);

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
                  {["BSC"].includes(evaluationCriteriaOfPms) && [
                    <Tab label="VALUES [BSC]" value="2" />,
                    <Tab label="COMPETENCIES  [BSC]" value="3" />,
                  ]}
                  {["360"].includes(evaluationCriteriaOfPms) && [
                    <Tab label="BAR ASSESMENT  [360]" value="4" />,
                  ]}
                </Tabs>
              </Box>
            </Box>
          </div>
          {["BSC"].includes(evaluationCriteriaOfPms) && value === "2" ? (
            <ValuesForSelfAssessment tabValue={value} />
          ) : ["BSC"].includes(evaluationCriteriaOfPms) && value === "3" ? (
            <CompetenciesForSelfAssessment tabValue={value} />
          ) : ["360"].includes(evaluationCriteriaOfPms) && value === "4" ? (
            <BarAssessmentForSelf tabValue={value} />
          ) : null}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default SelfAssessmentNew;
