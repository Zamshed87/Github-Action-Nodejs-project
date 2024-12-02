import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Box, Tab, Tabs } from "@mui/material";
import { a11yProps } from "../kpimapping/tabpanel";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import TabPanel from "../kpimapping/tabpanel";
import RoleWiseJDLanding from "./components/roleWiseJDLanding";
import RoleWiseSpecification from "./components/roleWiseSpecification";

const RoleWiseJDandSpecification = () => {
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const [value, setValue] = useState(0);

  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30468),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading">
            <h2>Role Wise JD & Specification</h2>
          </div>

          <div className="tab-panel">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={(_, newValue) => setValue(newValue)}
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
                  <Tab label="Role Wise JD" {...a11yProps(0)} />
                  <Tab label="Role Wise Specification" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <RoleWiseJDLanding />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <RoleWiseSpecification />
              </TabPanel>
            </Box>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default RoleWiseJDandSpecification;
