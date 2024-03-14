import React, { useState } from "react";
import { deductionRowDtoData, duesRowDtoData } from "../utils";
import SalaryElementTable from "./SalaryElementTable";
import { Divider } from "@mui/material";
import PrimaryButton from "common/PrimaryButton";

const DueAmount = ({ type }) => {
  const [duesRowDto, setDuesRowDto] = useState(duesRowDtoData);
  const [deductionRowDto, setDeductionRowDto] = useState(deductionRowDtoData);
  return (
    <div className="p-2">
      <div className="row">
        <div className="col-lg-6">
          <SalaryElementTable
            title="Dues"
            footerTitle="Total Dues (BDT)"
            rowDto={duesRowDto}
            setRowDto={setDuesRowDto}
            showHeader={true}
            isDisabled={true}
          />
        </div>
        <div className="col-lg-6">
          <SalaryElementTable
            title="Deductions"
            footerTitle="Total Deductions (BDT)"
            rowDto={deductionRowDto}
            setRowDto={setDeductionRowDto}
            showHeader={false}
            isDisabled={false}
          />
        </div>
        <div className="col-lg-12">
          <Divider className="mb-2" />
          <div className="d-flex justify-content-end my-2">
            <p>
              <span className="mr-3">
                <b>Employee Will Get (BDT)</b>
              </span>
              <span>
                <b>{0}</b>
              </span>
            </p>
          </div>
          <div className="d-flex justify-content-end my-3">
            <PrimaryButton
              type="button"
              className="btn btn-green"
              label="Save"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueAmount;
