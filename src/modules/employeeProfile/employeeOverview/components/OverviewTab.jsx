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

function OverviewTab({ empId, wgId, buId, intAccountId }) {
  const [index, setIndex] = useState(0);
  const tabName = [
    { name: "General Info" },
    { name: "Contact & Places" },
    { name: "Identification" },
    { name: "Experience" },
    { name: "Education" },
    { name: "Transfer & Promotion History" },
    { name: "Increment History" },
    { name: "Reward And Punishment" },
    { name: "Family & Relationships" },
    { name: "Documents" },
    { name: "others" },
    { name: "Social Media Information" },
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
                          i === index && "btn btn-tab-active"
                        }`}
                        onClick={() => setIndex(i)}
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
                  />
                  <Contact
                    empId={empId}
                    wgId={wgId}
                    buId={buId}
                    index={index}
                    tabIndex={1}
                  />
                  <Identification
                    empId={empId}
                    index={index}
                    tabIndex={2}
                    wgId={wgId}
                    buId={buId}
                  />
                  <Experience
                    empId={empId}
                    index={index}
                    tabIndex={3}
                    wgId={wgId}
                    buId={buId}
                  />
                  <Education
                    empId={empId}
                    index={index}
                    tabIndex={4}
                    wgId={wgId}
                    buId={buId}
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
                  />
                  <Documents
                    empId={empId}
                    index={index}
                    wgId={wgId}
                    buId={buId}
                    tabIndex={9}
                  />
                  <Others
                    empId={empId}
                    index={index}
                    tabIndex={10}
                    wgId={wgId}
                    buId={buId}
                  />
                  <OAuth empId={empId} index={index} tabIndex={11} />
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
