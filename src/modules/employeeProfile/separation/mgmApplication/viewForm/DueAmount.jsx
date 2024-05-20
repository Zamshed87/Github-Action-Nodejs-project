import React, { useEffect } from "react";
import { calculateTotalAmounts, dueAmountSaveHandler } from "../utils";
import SalaryElementTable from "./SalaryElementTable";
import { Divider } from "@mui/material";
import PrimaryButton from "common/PrimaryButton";
import Loading from "common/loading/Loading";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { formatMoney } from "utility/formatMoney";

const DueAmount = ({
  type,
  finalSettlementLoading,
  duesRowDto,
  setDuesRowDto,
  deductionRowDto,
  setDeductionRowDto,
  setTotalDuesAmount,
  setTotalDeductionAmount,
  totalDuesAmount,
  totalDeductionAmount,
  separationId,
  empId,
  getData,
  setOpenModal,
  empBasicInfo,
  intEmployeeId,
  getSingleDataLoading,
}) => {
  const [, saveDueAmount, dueAmountLoading] = useAxiosPost({});
  useEffect(() => {
    const { totalDuesAmount, totalDeductionAmount } = calculateTotalAmounts(
      deductionRowDto,
      duesRowDto
    );
    setTotalDeductionAmount(totalDeductionAmount);
    setTotalDuesAmount(totalDuesAmount);
  }, [deductionRowDto, duesRowDto]);

  return (
    <>
      {(finalSettlementLoading || dueAmountLoading || getSingleDataLoading) && (
        <Loading />
      )}
      <div className="p-2">
        <div className="row">
          <div className="col-lg-6">
            <SalaryElementTable
              title="Dues"
              rowDto={duesRowDto}
              setRowDto={setDuesRowDto}
              showHeader={true}
              isDisabled={true}
              type={type}
            />
          </div>
          <div className="col-lg-6">
            <SalaryElementTable
              title="Deductions"
              rowDto={deductionRowDto}
              setRowDto={setDeductionRowDto}
              showHeader={true}
              isDisabled={true}
              type={type}
            />
          </div>
          <div className="col-lg-12 mt-2">
            <div className="row">
              <div className="col-lg-6">
                <div className="d-flex justify-content-end my-2">
                  <p>
                    <span className="mr-3">
                      <b>{"Total Dues (BDT)"}</b>
                    </span>
                    <span>
                      <b>{formatMoney(totalDuesAmount || 0)}</b>
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex justify-content-end my-2">
                  <p>
                    <span className="mr-3">
                      <b>{"Total Deductions (BDT)"}</b>
                    </span>
                    <span>
                      <b>{formatMoney(totalDeductionAmount || 0)}</b>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <Divider className="mb-2" />
            <div className="d-flex justify-content-end my-2">
              <p>
                <span className="mr-3">
                  <b>Employee Will Get (BDT)</b>
                </span>
                <span>
                  <b>{formatMoney(totalDuesAmount - totalDeductionAmount)}</b>
                </span>
              </p>
            </div>
            {type !== "dueView" ? (
              <div className="d-flex justify-content-end my-3">
                <PrimaryButton
                  type="button"
                  className="btn btn-green"
                  label="Save"
                  onClick={(e) => {
                    e.stopPropagation();
                    dueAmountSaveHandler(
                      separationId,
                      empId,
                      empBasicInfo,
                      totalDuesAmount,
                      totalDeductionAmount,
                      duesRowDto,
                      deductionRowDto,
                      saveDueAmount,
                      intEmployeeId,
                      () => {
                        getData();
                        setOpenModal(false);
                      }
                    );
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default DueAmount;
