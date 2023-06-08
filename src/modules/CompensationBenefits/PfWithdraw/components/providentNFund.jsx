/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import { useState } from "react";
import { numberWithCommas } from "../../../../utility/numberWithCommas";


export default function ProvidentNFund({ rowDto }) {
  return (
    <div className="newTable">
      <div className="table-card-body">
        <div className="table-card-styled tableOne">
          <p
            style={{ fontWeight: 600, fontSize: "12px", color: "#475467" }}
            className="py-2"
          >
            Fiscal Year
          </p>
          <table aria-label="collapsible table" className="table">
            <tbody>
              {rowDto?.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const total = (arr, property) => {
    return arr.reduce((sum, item) => sum + item[property], 0);
  };

  return (
    <>
      <tr>
        <td>{row?.strFiscalYear}</td>
        <td className="text-right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </td>
      </tr>
      <tr>
        <td colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="table-card-body table-expandable">
              <div className="table-card-styled tableOne">
                <table aria-label="purchases" className="table">
                  <thead>
                    <tr className="bold-header">
                      <th>Month</th>
                      <th>Employee Contribution</th>
                      <th>Org. Contribution</th>
                      <th>Total PF Amount</th>
                    </tr>
                    <tr>
                      <th>Total</th>
                      <th>
                        ৳
                        {numberWithCommas(
                          total(
                            row?.pfInformationViewModel,
                            "employeeContribution"
                          )
                        )}
                      </th>
                      <th>
                        ৳
                        {numberWithCommas(
                          total(row?.pfInformationViewModel, "orgContribution")
                        )}
                      </th>
                      <th>
                        ৳
                        {numberWithCommas(
                          total(row?.pfInformationViewModel, "totalPfAmount")
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {row?.pfInformationViewModel.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.month}</td>
                        <td>{item?.employeeContribution}</td>
                        <td>{item?.orgContribution}</td>
                        <td>{item?.totalPfAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
}
