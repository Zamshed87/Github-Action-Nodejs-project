import SingleInfo from "common/SingleInfo";
import moment from "moment";
import React from "react";

const HeaderView = ({ loanByIdDto }) => {
  return (
    <>
      <div>
        <SingleInfo
          label={"Employee"}
          value={`${loanByIdDto?.objHeader?.strEmployeeName}[${loanByIdDto?.objHeader?.strEmployeeCode}]`}
        />
        <SingleInfo
          label={"Loan ID"}
          value={loanByIdDto?.objHeader?.strLoanId}
        />
        <SingleInfo
          label={"Effective Date"}
          value={moment(loanByIdDto?.objHeader?.dteEffectiveDate).format(
            "MMM, YYYY"
          )}
        />
        <SingleInfo
          label={"Loan Amount"}
          value={loanByIdDto?.objHeader?.numLoanAmount}
        />
        <SingleInfo
          label={"Interest"}
          value={`${loanByIdDto?.objHeader?.numInterest}%`}
        />
        <SingleInfo
          label={"Loan Amount With Interest"}
          value={loanByIdDto?.objHeader?.numTotalInterest} // need
        />
      </div>
      <div>
        <SingleInfo
          label={"Installment Number"}
          value={loanByIdDto?.objHeader?.intNumberOfInstallment}
        />
        <SingleInfo
          label={"Settelement Installment"}
          value={loanByIdDto?.objHeader?.settledInstallment}
        />
        <SingleInfo
          label={"Settled Amount"}
          value={loanByIdDto?.objHeader?.settledAmount}
        />
        <SingleInfo
          label={"Un-Settled Amount"}
          value={loanByIdDto?.objHeader?.unSettledAmount}
        />
        <SingleInfo
          label={"Description"}
          value={loanByIdDto?.objHeader?.strDescription}
        />
        <SingleInfo
          label={"Status"}
          value={loanByIdDto?.objHeader?.strStatus}
        />
      </div>
    </>
  );
};

export default HeaderView;
