import React, { useEffect, useRef, useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import ReactToPrint from "react-to-print";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { PrintOutlined } from "@mui/icons-material";
import { shallowEqual, useSelector } from "react-redux";
import EmpBasicInfo from "./EmpBasicInfo";
import ApprovalList from "./ApprovalList";
import TabPanel, {
  a11yProps,
} from "modules/trainingDevelopment/assessment/assessmentFormDetails/tabpanel";

const ManagementSeparationHistoryView = ({ id }) => {
  const printRef = useRef();
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [value, setValue] = useState(0);
  const [empBasic, setEmpBasic] = useState({});
  const [approveListData, getData, loading, setApproveListData] = useAxiosGet();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (id) {
      getData(
        `/SaasMasterData/GetEmpSeparationViewById?AccountId=${orgId}&Id=${id}`,
        (res) => {
          setEmpBasic(res);
          setApproveListData(res?.approvalView);
        }
      );
    }
  }, [id, orgId]);

  return (
    <>
      <div className="mb-2 d-flex justify-content-end">
        <ReactToPrint
          documentTitle={"Separation History View"}
          trigger={() => (
            <Button
              variant="outlined"
              sx={{
                borderColor: "rgba(0, 0, 0, 0.6)",
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1.15px",
                "&:hover": {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
              }}
              startIcon={
                <PrintOutlined
                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                  className="emp-print-icon"
                />
              }
            >
              Print
            </Button>
          )}
          content={() => printRef.current}
          pageStyle={"@page { !important width: 100% } @media print {}"}
        />
      </div>
      <div ref={printRef}>
        <EmpBasicInfo empBasic={empBasic} />
        <div className="tab-panel">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
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
                <Tab label="Approval History" {...a11yProps(0)} />
                <Tab label="Employment History" {...a11yProps(1)} />
                <Tab label="Asset History" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ApprovalList
                approveListData={approveListData}
                loading={loading}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div>Employment History</div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div>Asset History</div>
            </TabPanel>
          </Box>
        </div>
      </div>
    </>
  );
};

export default ManagementSeparationHistoryView;
