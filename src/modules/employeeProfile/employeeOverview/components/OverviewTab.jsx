import React, { useState } from "react";
import "../employeeOverview.css";
import Contact from "./contact/Contact";
import Documents from "./documents/Documents";
import Education from "./education/Education";
import Experience from "./Experience";
import Family from "./familyAndRelationShip/Family";
import GeneralInfo from "./generalInfo/GeneralInfo";
import Identification from "./identification/Identification";
import IncrementInfo from "./IncrementInfo";
import Others from "./others/Others";
import TransferAndPromotionInfo from "./TransferAndPromotionInfo";
import OAuth from "./OAuth/OAuth";
import UserEndRewardPunishmentLanding from "modules/employeeProfile/rewardsAndPunishment/rewardPunishmentLetter";
import TrainingDevelopment from "./Experience/TrainingDevelopment";

function OverviewTab({ empId, wgId, buId, intAccountId, getProgress }) {
  const [index, setIndex] = useState(0);
  const tabName = [
    { name: "General Info", id: 0 },
    { name: "Contact & Places", id: 1 },
    { name: "Identification", id: 2 },
    { name: "Work Experience", id: 3 },
    { name: "Training & Development", id: 12 },
    { name: "Education", id: 4 },
    { name: "Transfer & Promotion History", id: 5 },
    { name: "Increment History", id: 6 },
    { name: "Reward And Punishment", id: 7 },
    { name: "Contact Information", id: 8 },
    { name: "Documents", id: 9 },
    { name: "others", id: 10 },
    { name: "Social Media Information", id: 11 },
  ];
  const filteredTabName =
    intAccountId !== 12
      ? tabName.filter((tab) => tab.name !== "Reward And Punishment")
      : tabName;

  return (
    <>
      <div className="overview-filter">
        <div className="filter-tabs">
          <div className="row-filter-tabs">
            <div className="row">
              <div className="col-md-3">
                <div className="tabs-name">
                  {filteredTabName?.map((item, i) => {
                    return (
                      <button
                        key={i}
                        className={`btn btn-tab ${
                          item.id === index && "btn btn-tab-active"
                        }`}
                        onClick={() => setIndex(item.id)}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-9">
                <div className="form-main">
                  <GeneralInfo
                    empId={empId}
                    index={index}
                    tabIndex={0}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <Contact
                    empId={empId}
                    wgId={wgId}
                    buId={buId}
                    index={index}
                    tabIndex={1}
                    getProgress={getProgress}
                  />
                  <Identification
                    empId={empId}
                    index={index}
                    tabIndex={2}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <Experience
                    empId={empId}
                    index={index}
                    tabIndex={3}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <TrainingDevelopment
                    index={index}
                    tabIndex={12}
                    empId={empId}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <Education
                    empId={empId}
                    index={index}
                    tabIndex={4}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <TransferAndPromotionInfo
                    empId={empId}
                    index={index}
                    tabIndex={5}
                    wgId={wgId}
                    buId={buId}
                  />
                  <IncrementInfo
                    empId={empId}
                    index={index}
                    tabIndex={6}
                    wgId={wgId}
                    buId={buId}
                  />
                  <UserEndRewardPunishmentLanding
                    empId={empId}
                    index={index}
                    tabIndex={7}
                    wgId={wgId}
                    buId={buId}
                  />
                  <Family
                    empId={empId}
                    index={index}
                    tabIndex={8}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <Documents
                    empId={empId}
                    index={index}
                    wgId={wgId}
                    buId={buId}
                    tabIndex={9}
                    getProgress={getProgress}
                  />
                  <Others
                    empId={empId}
                    index={index}
                    tabIndex={10}
                    wgId={wgId}
                    buId={buId}
                    getProgress={getProgress}
                  />
                  <OAuth
                    empId={empId}
                    index={index}
                    tabIndex={11}
                    getProgress={getProgress}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewTab;
