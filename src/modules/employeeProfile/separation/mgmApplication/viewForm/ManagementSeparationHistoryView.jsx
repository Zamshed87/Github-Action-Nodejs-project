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
import Loading from "common/loading/Loading";
import AssetHistory from "./AssetHistory";
import EmploymentHistory from "./EmploymentHistory";
import HistoryPrintView from "./HistoryPrintView";
import DueAmount from "./DueAmount";

const ManagementSeparationHistoryView = ({
  id,
  type,
  demoPopup,
  data,
  buttonType,
  setComment,
  loading,
}) => {
  const printRef = useRef();
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [value, setValue] = useState(0);
  const [empBasic, setEmpBasic] = useState({});
  const [approveListData, getData, approvalListLoading, setApproveListData] =
    useAxiosGet();
  const [assetHistory, setAssetHistory] = useState([]);
  const [employmentHistory, setEmploymentHistory] = useState([]);

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
          setAssetHistory(res?.assetHistory);
          setEmploymentHistory(res?.employeeHistory);
        }
      );
    }
  }, [id, orgId]);

  return (
    <>
      {loading && <Loading />}
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
          pageStyle={
            "@page { !important width: 100% } @media print { .tab-panel { display: none } .historyPrintView { display: block!important } }"
          }
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
                {type === "dueAmount" && (
                  <Tab label="Due Amount" {...a11yProps(3)} />
                )}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ApprovalList
                approveListData={approveListData}
                setApproveListData={setApproveListData}
                loading={approvalListLoading}
                type={type}
                demoPopup={demoPopup}
                data={data}
                buttonType={buttonType}
                setComment={setComment}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <EmploymentHistory
                employmentHistory={employmentHistory}
                loading={loading}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <AssetHistory assetHistory={assetHistory} loading={loading} />
            </TabPanel>
            {type === "dueAmount" && (
              <TabPanel value={value} index={3}>
                <DueAmount type={type} />
              </TabPanel>
            )}
          </Box>
        </div>
        <div className="historyPrintView" style={{ display: "none" }}>
          <HistoryPrintView
            approveListData={approveListData}
            assetHistory={assetHistory}
            employmentHistory={employmentHistory}
          />
        </div>
      </div>
    </>
  );
};

export default ManagementSeparationHistoryView;
