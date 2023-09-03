import { AddOutlined } from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import BtnActionMenu from "../../../../common/BtnActionMenu";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AssessmentPreview from "./assessment";
import { getSingleSchedule } from "./helper";
import SubmissionDetails from "./submission";
import TabPanel, { a11yProps } from "./tabpanel";

const AssessmentFormDetailsLanding = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [singleData, setSingleData] = useState({});

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSingleSchedule(setSingleData, setLoading, orgId, buId, params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <div className="table-card">
          <div className="table-card-heading mb-2">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>{singleData?.strTrainingName}</h2>
            </div>
            <div className="table-header-right">
              {moment().format() < moment(singleData?.dteCourseCompletionDate).format() &&
              <BtnActionMenu
                className="btn btn-default flex-center btn-deafult-create-job"
                icon={
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                }
                label="Assessment"
                options={[
                  {
                    value: 1,
                    label: "Pre Assessment",
                    onClick: () => {
                      history.push(
                        `/trainingAndDevelopment/assessment/assessmentForm/create/pre/${params?.id}`
                      );
                    },
                  },
                  {
                    value: 2,
                    label: "Post Assessment",
                    onClick: () => {
                      history.push(
                        `/trainingAndDevelopment/assessment/assessmentForm/create/post/${params?.id}`
                      );
                    },
                  },
                ]}
              />
              }
            </div>
          </div>

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
                  <Tab label="Assessment" {...a11yProps(0)} />
                  <Tab label="Submission" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <AssessmentPreview scheduleId={singleData?.intScheduleId} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <SubmissionDetails data={singleData} />
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

export default AssessmentFormDetailsLanding;
