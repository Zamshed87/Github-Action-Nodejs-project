import { IconButton } from "@mui/material";
import { Row } from "antd";
import { useReactToPrint } from "react-to-print";
import pdfIcon from "assets/images/pdfIcon.svg";
import { SaveAlt } from "@mui/icons-material";

import React, { useRef } from "react";
import { todayDate } from "utility/todayDate";
import { gray900 } from "utility/customColor";
import IncrementLetter from "./IncrementLetter";

export const LetterContainer = ({
  location,
  orgId,
  empBasic,
  buName,
  form,
  employeeIncrementByIdApi,
  rowDto,
}: any) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; }@page {size: portrait ! important}}",
    documentTitle: `Increment Letter- ${
      (empBasic as any)?.employeeProfileLandingView?.strEmployeeName
    } ${todayDate()}`,
  });
  return (
    <>
      <Row gutter={[10, 2]} className="mb-3">
        {((location?.state as any)?.singleData?.incrementList[0]?.strStatus ===
          "Approved By Admin" ||
          (location?.state as any)?.singleData?.incrementList[0]?.strStatus ===
            "Approved") &&
          orgId === 5 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                reactToPrintFn();
              }}
              style={{
                height: "32px",
                width: "199px",
                boxSizing: "border-box",
                border: " 1px solid #EAECF0",
                borderRadius: "4px",
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div>
                  <img
                    className="pb-1"
                    style={{ width: "23px", height: "23px" }}
                    src={pdfIcon}
                    alt=""
                  />
                </div>
                <p
                  style={{
                    color: "#344054",
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                  className="pl-2"
                >
                  Increment Letter
                </p>
              </div>
              <div>
                <SaveAlt
                  sx={{
                    color: gray900,
                    fontSize: "16px",
                  }}
                />
              </div>
            </IconButton>
          )}
      </Row>

      <div className="d-none">
        <div
          ref={contentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            margin: "80px 0",
          }}
        >
          <IncrementLetter
            orgId={orgId}
            empBasic={empBasic}
            buName={buName}
            employeeIncrementByIdApi={employeeIncrementByIdApi}
            form={form}
            rowDto={rowDto}
          />
        </div>
      </div>
    </>
  );
};
