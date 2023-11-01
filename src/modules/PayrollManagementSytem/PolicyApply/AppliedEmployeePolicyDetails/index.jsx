/* eslint-disable react-hooks/exhaustive-deps */
import {
  EventAvailable,
  EventNote,
  Gradient,
  Grain,
  Looks,
  Stars,
  Texture
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import { gray900 } from "../../../../utility/customColor";
import { getAssignedPolicy } from "./helper";
import ProfileCard from "./ProfileCard.jsx";
import "./styles.css";
const AppliedEmployeePolicyDetails = () => {
  const [loading, setLoading] = useState(false);
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { employeeBasicInfoId, policyId } = useParams();

  // descriptions
  const [employeeDescription, setEmployeeDescription] = useState(null);
  const [policyDescription, setPolicyDescription] = useState(null);

  useEffect(() => {
    getAssignedPolicy(
      orgId,
      buId,
      employeeBasicInfoId,
      policyId,
      setPolicyDescription,
      setEmployeeDescription,
      setLoading
    );
  }, [employeeBasicInfoId]);

  return (
    <>
      {loading && <Loading />}
      {employeeDescription ? (
        <div className="table-card ">
          <div className="table-card-heading">
            <BackButton title={"View Policy Apply"} />
          </div>
          <div className="card-style ">
            <div className="row">
              <div className="col-12">
                <div className="mt-2">
                  <ProfileCard
                    empBasic={employeeDescription}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
            {policyDescription && (
              <div className="ml-1 mb-2">
                <div className="row" style={{ marginTop: "12px" }}>
                  <div className="col-md-2  d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Looks style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>{policyDescription?.strBusinessUnit || "All"}</h2>
                      <p>Business Unit</p>
                    </div>
                  </div>

                  <div className="col-md-2  d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Stars style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>{policyDescription?.strPolicyName}</h2>
                      <p>Policy Name</p>
                    </div>
                  </div>

                  <div className="col-md-2  d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <EventNote style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>
                        {policyDescription?.isMonthly
                          ? "Monthly"
                          : policyDescription?.isOnlyPresentDays
                          ? "Only Present Day"
                          : "-"}
                      </h2>
                      <p>Salary Format</p>
                    </div>
                  </div>
                  <div className="col-md-3  d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <EventAvailable style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>
                        {policyDescription?.isSalaryCalculationShouldBeActual
                          ? "Gross Salary/Actual Month Days"
                          : policyDescription?.intGrossSalaryDevidedByDays
                          ? policyDescription?.intGrossSalaryDevidedByDays
                          : "-"}
                      </h2>
                      <p>Per day salary calculation</p>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: "12px" }}>
                  <div className="col-md-2  d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Gradient style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>
                        {policyDescription?.intGrossSalaryRoundDigits
                          ? policyDescription?.intGrossSalaryRoundDigits
                          : policyDescription?.isGrossSalaryRoundUp
                          ? "Round Up"
                          : policyDescription?.isGrossSalaryRoundDown
                          ? "Round Down"
                          : "-"}
                      </h2>
                      <p>Gross salary </p>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Grain style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>
                        {policyDescription?.intNetPayableSalaryRoundDigits
                          ? policyDescription?.intNetPayableSalaryRoundDigits
                          : policyDescription?.isNetPayableSalaryRoundUp
                          ? "Round Up"
                          : policyDescription?.isNetPayableSalaryRoundDown
                          ? "Round Down"
                          : "-"}
                      </h2>
                      <p>Net payable</p>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <IconButton
                      style={{
                        color: gray900,
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Texture style={{ fontSize: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>
                        {policyDescription?.isSalaryShouldBeFullMonth
                          ? "1 to end of the month"
                          : policyDescription?.intPreviousMonthStartDay &&
                            policyDescription?.intNextMonthEndDay
                          ? `Previous month ${policyDescription?.intPreviousMonthStartDay} to salary month ${policyDescription?.intNextMonthEndDay}`
                          : "-"}
                      </h2>
                      <p>Salary Period</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default AppliedEmployeePolicyDetails;
