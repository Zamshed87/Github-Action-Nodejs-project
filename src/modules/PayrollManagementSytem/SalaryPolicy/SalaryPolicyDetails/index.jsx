/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowBack,
  EventAvailable,
  EventNote,
  Gradient,
  Grain,
  Looks,
  Stars,
  Texture,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { deleteSalaryPolicyById } from "./helper";
import "./styles.css";
const SalaryPolicyDetails = () => {
  const history = useHistory();
  const { id } = useParams();
  const [policy, getPolicy, loading] = useAxiosGet();
  //
  // getting the policy details by id
  useEffect(() => {
    getPolicy(`/Payroll/GetSalaryPolicyById?id=${id}`);
  }, []);
  //
  //
  const wantToDelete = (policyId) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to delete? `,
      yesAlertFunc: () => {
        deleteSalaryPolicyById(policyId, history);
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="table-card salary-policy-details-page-wrapper">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <IconButton onClick={() => history.goBack()}>
                <ArrowBack
                  style={{ width: "18px", height: "18px", color: "#323232" }}
                />
              </IconButton>
              <h2 style={{ color: "#344054" }}>View salary policy details</h2>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-cancel mr-2"
                onClick={() => wantToDelete(policy?.intPolicyId)}
              >
                Delete
              </button>
              <button
                className="btn btn-green btn-green-disabled"
                onClick={() =>
                  history.push(
                    `/administration/payrollConfiguration/salaryPolicy/edit/${policy?.intPolicyId}`
                  )
                }
              >
                Edit
              </button>
            </div>
          </div>
          <div className="table-card-body about-info-card policy-details">
            <div className="row mb-4">
              <div className="col-md-4 d-flex align-items-center">
                <IconButton
                  style={{
                    color: "black",
                    backgroundColor: "#EAECF0",
                    padding: "5px",
                  }}
                >
                  <Looks style={{ width: "25px", height: "25px" }} />
                </IconButton>
                <div className="ml-3">
                  <h2>{policy?.strBusinessUnit || "All"}</h2>
                  <p>Business Unit</p>
                </div>
              </div>

              <div className="col-md-4 d-flex align-items-center">
                <IconButton
                  style={{
                    color: "black",
                    backgroundColor: "#EAECF0",
                    padding: "5px",
                  }}
                >
                  <Stars style={{ width: "25px", height: "25px" }} />
                </IconButton>
                <div className="ml-3">
                  <h2>{policy?.strPolicyName || "-"}</h2>
                  <p>Policy Name</p>
                </div>
              </div>

              <div className="col-md-4 d-flex align-items-center">
                <IconButton
                  style={{
                    color: "black",
                    backgroundColor: "#EAECF0",
                    padding: "5px",
                  }}
                >
                  <EventAvailable style={{ width: "25px", height: "25px" }} />
                </IconButton>
                <div className="ml-3">
                  <h2>
                    {policy?.isSalaryCalculationShouldBeActual
                      ? "Gross Salary/Actual Month Days"
                      : policy?.intGrossSalaryDevidedByDays}
                  </h2>
                  <p>Per day salary calculation</p>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-4 d-flex align-items-center">
                <IconButton
                  style={{
                    color: "black",
                    backgroundColor: "#EAECF0",
                    padding: "5px",
                  }}
                >
                  <Gradient style={{ width: "25px", height: "25px" }} />
                </IconButton>
                <div className="ml-3">
                  <h2>
                    {policy?.intGrossSalaryRoundDigits
                      ? `${policy?.intGrossSalaryRoundDigits}`
                      : policy?.isGrossSalaryRoundUp
                        ? "Round Up"
                        : policy?.isGrossSalaryRoundDown
                          ? "Round Down"
                          : "0"}
                  </h2>
                  <p>Gross salary </p>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <IconButton
                  style={{
                    color: "black",
                    backgroundColor: "#EAECF0",
                    padding: "5px",
                  }}
                >
                  <Grain style={{ width: "25px", height: "25px" }} />
                </IconButton>
                <div className="ml-3">
                  <h2>
                    {policy?.intNetPayableSalaryRoundDigits
                      ? policy?.intNetPayableSalaryRoundDigits
                      : policy?.isNetPayableSalaryRoundUp
                        ? "Round Up"
                        : policy?.isNetPayableSalaryRoundDown
                          ? "Round Down"
                          : "0"}
                  </h2>
                  <p>Net payable</p>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <IconButton
                  style={{
                    color: "black",
                    backgroundColor: "#EAECF0",
                    padding: "5px",
                  }}
                >
                  <Texture style={{ width: "25px", height: "25px" }} />
                </IconButton>
                <div className="ml-3">
                  <h2>
                    {policy?.isSalaryShouldBeFullMonth
                      ? "1 to end of the month"
                      : policy?.intPreviousMonthStartDay ||
                        policy?.intNextMonthEndDay
                        ? `Previous month ${policy?.intPreviousMonthStartDay} to salary month ${policy?.intNextMonthEndDay}`
                        : "0"}
                  </h2>
                  <p>Salary Period</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalaryPolicyDetails;
