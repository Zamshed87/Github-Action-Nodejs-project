import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
// import SortingIcon from "../../../../../common/SortingIcon";
import { InfoOutlined, LocalPrintshopOutlined } from "@mui/icons-material";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import { getPDFAction } from "../../../../../utility/downloadFile";

const CardTable = ({ setFieldValue, rowDto, setRowDto, setLoading }) => {
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));

  return (
    <>
      {rowDto.map((data, index) => (
        <tr
          onClick={(e) => {
            getPDFAction(
              `/emp/PdfAndExcelReport/LoanReportDetails?LoanApplicationId=32`,
              setLoading
            );
          }}
          key={index}
        >
          <td>
            <div className="employeeInfo d-flex align-items-center">
              <AvatarComponent letterCount={1} label={data?.name} />
              {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ height: 25, width: 25 }} /> */}
              <div className="employeeTitle ml-3">
                <p className="employeeName">
                  {data?.name} [{data?.nameId}]
                </p>
              </div>
            </div>
          </td>
          <td>{data?.position}</td>
          <td>{data?.dept}</td>
          <td>
            <div className="d-flex align-items-center">
              <p className="type"> {data?.loanType}</p>
              <LightTooltip
                title={
                  <div className="application-tooltip">
                    <h6>Reason</h6>
                    <h5>Had a meeting with MD Sir Regarding next Project</h5>
                  </div>
                }
                arrow
              >
                <InfoOutlined sx={{ marginLeft: "12px" }} />
              </LightTooltip>
            </div>
            <div>
              <a href="/" className="file">
                file.pdf
              </a>
            </div>
          </td>
          <td>
            BDT {data?.loanAmount}
            <div style={{ marginTop: "6px" }}>
              <small>{data?.date}</small>
            </div>
          </td>
          <td>
            BDT {data?.installmentAmount}
            <div style={{ marginTop: "6px" }}>
              <small>{data?.installment} Installments</small>
            </div>
          </td>
          <td>{data?.approval}</td>
          <td>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                {data?.status === "Completed" && (
                  <Chips label={data.status} classess="success p-2" />
                )}
                {data?.status === "Running" && (
                  <Chips
                    label={data.status}
                    classess="primary p-2"
                    style={{ background: "#E5F0FC", color: "#009CDE" }}
                  />
                )}
                {data?.status === "Not Started" && (
                  <Chips label={data.status} classess="danger p-2" />
                )}
              </div>
              <div>
                <button className="iconButton" onClick={() => {}}>
                  <LocalPrintshopOutlined />
                </button>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CardTable;
