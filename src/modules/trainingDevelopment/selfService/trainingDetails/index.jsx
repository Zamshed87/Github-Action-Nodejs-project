import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import TabPanel, {
  a11yProps,
} from "../../assessment/assessmentFormDetails/tabpanel";
import TrainingDetailsCard from "../../common/TrainingDetailsCard";
import AssessmentSubmission from "./assessmentSubmission";
import { getAssesmentQuestions } from "./helper";

const TrainingDetails = () => {
  const { employeeId } = useSelector(
    // const { orgId, buId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [questions, setQuestions] = useState([
    // {
    //   strQuestion:
    //     "Which of the following is NOT a common problem with field studies?",
    //   options: [
    //     {
    //       strOption:
    //         "Users use the field session to ask for new features or complain about the UI.",
    //     },
    //     {
    //       strOption:
    //         "Users slide into the “host” role and try to please the researcher.",
    //     },
    //     {
    //       strOption:
    //         "Users talk about their activities instead of showing what they do to the researcher.",
    //     },
    //     {
    //       strOption:
    //         "Users ignore the researcher and engage in tasks unrelated to the study.",
    //     },
    //   ],
    // },
    // {
    //   strQuestion:
    //     "Which of the following is NOT a common problem with field studies?",
    //   options: [
    //     {
    //       strOption:
    //         "Users use the field session to ask for new features or complain about the UI.",
    //     },
    //     {
    //       strOption:
    //         "Users slide into the “host” role and try to please the researcher.",
    //     },
    //     {
    //       strOption:
    //         "Users talk about their activities instead of showing what they do to the researcher.",
    //     },
    //     {
    //       strOption:
    //         "Users ignore the researcher and engage in tasks unrelated to the study.",
    //     },
    //   ],
    // },
    // {
    //   strQuestion:
    //     "Which of the following is NOT a common problem with field studies?",
    //   options: [
    //     {
    //       strOption:
    //         "Users use the field session to ask for new features or complain about the UI.",
    //     },
    //     {
    //       strOption:
    //         "Users slide into the “host” role and try to please the researcher.",
    //     },
    //     {
    //       strOption:
    //         "Users talk about their activities instead of showing what they do to the researcher.",
    //     },
    //     {
    //       strOption:
    //         "Users ignore the researcher and engage in tasks unrelated to the study.",
    //     },
    //   ],
    // },
  ]);
  // eslint-disable-next-line
  const [allData, setAllData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(true);
  const { state } = useLocation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    getAssesmentQuestions(
      state?.intScheduleId,
      employeeId,
      newValue === 0 ? true : false,
      setLoading,
      setQuestions,
      setAllData
    );
  };

  const getData = () => {
    getAssesmentQuestions(
      state?.intScheduleId,
      employeeId,
      "true",
      setLoading,
      setQuestions,
      setAllData
    );
  };
  const permission = {
    isCreate: true,
  };

  useEffect(() => {
    setIsSubmit(true);
    questions.forEach((item) =>
      item?.options.forEach((op) => {
        if (op?.isAnswer) {
          setIsSubmit(false);
        }
      })
    );
  }, [questions]);
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [state?.intScheduleId]);

  // const questions = [
  //   {
  //     strQuestion:
  //       "Which of the following is NOT a common problem with field studies?",
  //     options: [
  //       {
  //         strOption:
  //           "Users use the field session to ask for new features or complain about the UI.",
  //       },
  //       {
  //         strOption:
  //           "Users slide into the “host” role and try to please the researcher.",
  //       },
  //       {
  //         strOption:
  //           "Users talk about their activities instead of showing what they do to the researcher.",
  //       },
  //       {
  //         strOption:
  //           "Users ignore the researcher and engage in tasks unrelated to the study.",
  //       },
  //     ],
  //   },
  //   {
  //     strQuestion:
  //       "Which of the following is NOT a common problem with field studies?",
  //     options: [
  //       {
  //         strOption:
  //           "Users use the field session to ask for new features or complain about the UI.",
  //       },
  //       {
  //         strOption:
  //           "Users slide into the “host” role and try to please the researcher.",
  //       },
  //       {
  //         strOption:
  //           "Users talk about their activities instead of showing what they do to the researcher.",
  //       },
  //       {
  //         strOption:
  //           "Users ignore the researcher and engage in tasks unrelated to the study.",
  //       },
  //     ],
  //   },
  //   {
  //     strQuestion:
  //       "Which of the following is NOT a common problem with field studies?",
  //     options: [
  //       {
  //         strOption:
  //           "Users use the field session to ask for new features or complain about the UI.",
  //       },
  //       {
  //         strOption:
  //           "Users slide into the “host” role and try to please the researcher.",
  //       },
  //       {
  //         strOption:
  //           "Users talk about their activities instead of showing what they do to the researcher.",
  //       },
  //       {
  //         strOption:
  //           "Users ignore the researcher and engage in tasks unrelated to the study.",
  //       },
  //     ],
  //   },
  // ];

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Assessment</h2>
            </div>
          </div>

          <div className="table-body mt-2">
            <div className="">
              <TrainingDetailsCard
                data={{
                  trainingName: state?.strTrainingName,
                  resourcePerson: state?.strResourcePersonName,
                  requestedBy: state?.strEmployeeName,
                  batchSize: state?.intBatchSize,
                  batchNo: state?.strBatchNo,
                  fromDate: state?.dteFromDate,
                  toDate: state?.dteToDate,
                  duration: state?.numTotalDuration,
                  venue: state?.strVenue,
                  remark: state?.strRemarks,
                }}
              />

              <div className="tab-panel mt-1">
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
                      <Tab label="Pre-Assessment" {...a11yProps(0)} />
                      <Tab label="Post-Assessment" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    {/* <ProvidentNFund
                      rowDto={viewPFWithYear?.fiscalYearWisePFInfoViewModel}
                      loading={loading1}
                    /> */}
                    {/* <AssessmentPreview /> */}
                    <AssessmentSubmission
                      state={state}
                      questions={questions}
                      setQuestions={setQuestions}
                      setLoading={setLoading}
                      isSubmit={isSubmit}
                      getData={getData}
                      lastSubmission={state?.dteLastAssesmentSubmissionDate}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {/* <SubmissionDetails /> */}
                    <AssessmentSubmission
                      questions={questions}
                      state={state}
                      setQuestions={setQuestions}
                      setLoading={setLoading}
                      isSubmit={isSubmit}
                      getData={getData}
                      lastSubmission={state?.dteLastAssesmentSubmissionDate}
                    />
                  </TabPanel>
                </Box>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default TrainingDetails;
