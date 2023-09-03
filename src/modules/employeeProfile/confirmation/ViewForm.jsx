import React from "react";

const ViewForm = ({ setIsAddEditForm, singleSalaryData }) => {
  // const removeNullFromArray = (arrayToClean) => {
  //   return arrayToClean?.filter((itm) => itm?.PayrollElementName !== null);
  // };
  // const myArray =
  //   singleSalaryData?.length > 0 ? removeNullFromArray(singleSalaryData) : [];

  return (
    <>
      <div className="provide-salary-info">
        <div className="row">
          {singleSalaryData?.length > 0 && (
            <>
              <div className="col-lg-8">
                <h6 style={{ fontSize: "12px" }}>Provide Salary Information</h6>
              </div>
              <div className="col-lg-4">
                <h6 style={{ marginBottom: "0", fontSize: "12px" }}>
                  Effective Month: {singleSalaryData[0]?.EffectiveMonth}
                </h6>
                <h6 style={{ fontSize: "12px" }}>
                  Effective Year: {singleSalaryData[0]?.EffectiveYear}
                </h6>
              </div>
            </>
          )}
        </div>
        <div className="row">
          <div className="col-lg-8">
            <h5># Payroll Elements</h5>
          </div>
          <div className="col-lg-4">
            <h5>Amount</h5>
          </div>
        </div>
        <hr />
        <div className="row">
          {/* {singleSalaryData?.length > 0 && (
            <>
              <div className="col-lg-8">
                <h4>1. Basic</h4>
              </div>
              <div className="col-lg-4">
                <h4>{singleSalaryData[0]?.BasicSalary || 0}</h4>
              </div>
              <div className="col-lg-8">
                <h4>2. Medical</h4>
              </div>
              <div className="col-lg-4">
                <h4>{singleSalaryData[0]?.MedicalAllowance || 0}</h4>
              </div>
              <div className="col-lg-8">
                <h4>3. House</h4>
              </div>
              <div className="col-lg-4">
                <h4>{singleSalaryData[0].HouseAllowance || 0}</h4>
              </div>
              <div className="col-lg-8">
                <h4>4. Conveyance Salary</h4>
              </div>
              <div className="col-lg-4">
                <h4>{singleSalaryData[0]?.ConveyanceAllowance || 0}</h4>
              </div>
              <div className="col-lg-8">
                <h4>5. Special Salary</h4>
              </div>
              <div className="col-lg-4">
                <h4>{singleSalaryData[0]?.SpecialAllowance || 0}</h4>
              </div>
              <div className="col-lg-8">
                <h4>6. CBA Deduction Salary</h4>
              </div>
              <div className="col-lg-4">
                <h4>{singleSalaryData[0]?.CBADeduction || 0}</h4>
              </div>
            </>
          )} */}
          {/* {myArray?.length > 0 &&
            myArray?.map((item, index) => {
              return (
                <>
                  <div className="col-lg-8">
                    <h4>
                      {index + 7}. {item?.PayrollElementName}
                    </h4>
                  </div>
                  <div className="col-lg-4">
                    <h4>{item?.OthersAmount || 0}</h4>
                  </div>
                </>
              );
            })} */}
          {singleSalaryData?.length > 0 && (
            <>
              <div className="col-lg-8">
                <h4 style={{ fontWeight: "600" }}>Gross Salary</h4>
              </div>
              <div className="col-lg-4">
                <h4 style={{ fontWeight: "600" }}>
                  {singleSalaryData[0]?.numGrossSalary || 0}
                </h4>
              </div>
              <div className="col-lg-8">
                <h4 style={{ fontWeight: "600" }}>Total Payable</h4>
              </div>
              <div className="col-lg-4">
                <h4 style={{ fontWeight: "600" }}>
                  {/* {singleSalaryData[0]?.TotalSalary || 0} */}
                  {singleSalaryData[0]?.numGrossSalary || 0}
                </h4>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="provide-salary-info-cancel">
        <button
          type="button"
          className="btn-cancel mr-0"
          onClick={() => setIsAddEditForm(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ViewForm;
