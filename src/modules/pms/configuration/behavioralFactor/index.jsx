import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
// import CoreCompetencies from "./coreCompetencies";
// import CoreValues from "./coreValues";
import Questionaires from "./questionaires";
import TabPanel, { a11yProps } from "./tabpanel";
import BscBehavioralFactor from "./bscBehavioralFactor";

const BehavioralFactor = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // 30470
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="table-card">
      <div className="tab-panel">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: { background: "#299647", height: 3 },
            }}
          >
            <Tab label="BSC" {...a11yProps(0)} />
            <Tab label="360" {...a11yProps(1)} />
            {/* <Tab label="BSC Core Values" {...a11yProps(0)} />
            <Tab label="BSC Core Competencies" {...a11yProps(1)} />
            <Tab label="360 Questionaire" {...a11yProps(2)} /> */}
          </Tabs>
          <TabPanel value={value} index={0}>
            <BscBehavioralFactor />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Questionaires />
          </TabPanel>
          {/* <TabPanel value={value} index={0}>
            <CoreValues />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CoreCompetencies />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Questionaires />
          </TabPanel> */}
        </Box>
      </div>
    </div>
  );
};

export default BehavioralFactor;
