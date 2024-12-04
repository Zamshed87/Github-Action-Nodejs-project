/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Col, Row } from "antd";
import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import PersonalInfo from "./contents/PersonalInfo";
import "./booklet.css";
import { Flex, PButton } from "Components";
import FixedInfo from "./fixed-info";
import PromotionHistory from "./contents/PromotionHistory";
import IncrementHistory from "./contents/IncrementHistory";
import TransferHistory from "./contents/TransferHistory";
import LoanHistory from "./contents/LoanHistory";
import LeaveBalanceData from "./contents/LeaveBalanceData";
import RewardHistory from "./contents/RewardHistory";
import PunishmentHistory from "./contents/PunishmentHistory";
import WorkExperienceHistory from "./contents/WorkExperienceHistory";
import EducationalInfo from "./contents/EducationalInfo";
import TrainingInfo from "./contents/TrainingInfo";
import FamilyAndRelationship from "./contents/FamilyAndRelationship";

const FlipComponent = ({
  singleData,
  historyData,
  incrementHistory,
  loanDto,
  leaveBalanceDto,
  landingApiReward,
  landingApiPunishment,
}) => {
  const book = useRef();

  const goToPreviousPage = () => {
    if (book.current) {
      book.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (book.current) {
      book.current.pageFlip().flipNext();
    }
  };
  document.onkeydown = (e) => {
    if (e.keyCode === 37) goToPreviousPage();
    if (e.keyCode === 39) goToNextPage();
  };

  return (
    <div className="lifeCycle">
      <Row gutter={8}>
        <Col md={5}>
          <FixedInfo singleData={singleData?.employeeProfileLandingView} />
        </Col>
        <Col style={{ maxWidth: "1100px" }} md={19}>
          <div className="book-wrapper">
            <Flex className=" mb-2" justify="flex-end">
              <PButton
                type="primary"
                className="mr-2"
                onClick={goToPreviousPage}
                content="Prev Page"
              />
              <PButton
                type="primary"
                onClick={goToNextPage}
                content="Next Page"
              />
            </Flex>

            <HTMLFlipBook
              width={1090}
              height={550}
              ref={book}
              maxShadowOpacity={3}
              showCover={false}
              drawShadow={true}
              className="flipbook"
              flippingTime={1000}
            >
              <div className="page">
                <PersonalInfo
                  singleData={singleData?.employeeProfileLandingView}
                  passportNo={singleData?.empEmployeePhotoIdentity?.strPassport}
                  nidNo={singleData?.empEmployeePhotoIdentity?.strNid}
                  empSignatureId={
                    singleData?.empEmployeePhotoIdentity?.intSignatureFileUrlId
                  }
                  birthId={singleData?.empEmployeePhotoIdentity?.strBirthId}
                  presentAddress={
                    singleData?.empEmployeeAddress[0]?.strAddressDetails
                  }
                  permanentAddress={
                    singleData?.empEmployeeAddress[1]?.strAddressDetails
                  }
                />
              </div>
              <div className="page">
                <PromotionHistory historyData={historyData} />
              </div>
              <div className="page">
                <IncrementHistory incrementHistory={incrementHistory} />
              </div>
              <div className="page">
                <TransferHistory historyData={historyData} />
              </div>
              <div className="page">
                <LoanHistory loanDto={loanDto} />
              </div>
              <div className="page">
                <LeaveBalanceData leaveBalanceDto={leaveBalanceDto} />
              </div>
              <div className="page">
                <RewardHistory landingApiReward={landingApiReward} />
              </div>
              <div className="page">
                <PunishmentHistory
                  landingApiPunishment={landingApiPunishment}
                />
              </div>
              <div className="page">
                <WorkExperienceHistory
                  workHistory={singleData?.empJobExperience}
                />
              </div>
              <div className="page">
                <TrainingInfo
                  trainingHistory={singleData?.empEmployeeTraining}
                />
              </div>
              <div className="page">
                <EducationalInfo
                  eduHistory={singleData?.empEmployeeEducation}
                />
              </div>
              <div className="page">
                <FamilyAndRelationship
                  familyHistory={singleData?.empEmployeeRelativesContact?.filter(
                    (dto: any) => dto?.strGrantorNomineeType === "Grantor"
                  )}
                  historyType="Family"
                />
              </div>
              <div className="page">
                <FamilyAndRelationship
                  familyHistory={singleData?.empEmployeeRelativesContact?.filter(
                    (dto: any) => dto?.strGrantorNomineeType === "Emergency"
                  )}
                  historyType="Emergency"
                />
              </div>
              <div className="page">
                <FamilyAndRelationship
                  familyHistory={singleData?.empEmployeeRelativesContact?.filter(
                    (dto: any) => dto?.strGrantorNomineeType === "Nominee"
                  )}
                  historyType="Nominee"
                />
              </div>
            </HTMLFlipBook>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FlipComponent;
