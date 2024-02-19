import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import * as Yup from "yup";
// import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getAssignedSalaryDetailsReportRDLC } from "./helper";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import { downloadFile, getPDFAction } from "utility/downloadFile";
// import { getSalaryDetailsReportRDLC } from "../reports/salaryDetailsReport/helper";

const validationSchema = Yup.object({});

const EmpCheckList = () => {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();

  // redux
  const { orgId, buId, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [detailsData, setDetailsData] = useState("");
  const [detailsReportLoading, setDetailsReportLoading] = useState(false);
  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars

  // const [tableAllowanceHead, setTableAllowanceHead] = useState([]);
  // const [tableDeductionHead, setTableDeductionHead] = useState([]);
  // const [tableColumn, setTableColumn] = useState([]);

  const { values, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: () => {
      // saveHandler();
    },
  });

  // let saveHandler = () => {};
  //   const getData = (param = "htmlView") => {

  //   };
  useEffect(() => {
    if (orgId && buId && wId) {
      getAssignedSalaryDetailsReportRDLC(
        "htmlView",
        orgId,
        buId,
        wId,
        setLoading,
        setDetailsData
      );
    }
  }, [orgId, buId, wId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Report-Employee CheckList";
  }, []);

  //   const totalEmpLOnSalarySheet = useMemo(() => {
  //     return rowDto.reduce((accumulator, currentValue) => {
  //       if (currentValue["SalaryGenerateHeaderId"] !== null) {
  //         return accumulator + 1;
  //       }
  //       return accumulator;
  //     }, 0);
  //   }, [rowDto]);

  return (
    <form onSubmit={handleSubmit}>
      {(loading || detailsReportLoading) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ display: "flex" }}>
          <h2>Employee CheckList Data</h2>
        </div>
        <div>
          <ul
            style={{ marginTop: "-27px" }}
            className="d-flex flex-wrap align-items-center justify-content-end"
          >
            <li className="pr-2">
              <Tooltip title="Download the salary report as Excel" arrow>
                <button
                  className="btn-save"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (detailsData?.length <= 0) {
                      return toast.warn("No Data Found");
                    }

                    downloadFile(
                      `/PdfAndExcelReport/GetAssignedSalaryDetailsReport_Matador?strPartName=excelView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${wId}`,
                      "Employee CheckList Report",
                      "xlsx",
                      setLoading
                    );
                  }}
                  // disabled={resDetailsReport?.length <= 0}
                  style={{
                    border: "transparent",
                    width: "30px",
                    height: "30px",
                    background: "#f2f2f7",
                    borderRadius: "100px",
                  }}
                >
                  <DownloadIcon
                    sx={{
                      color: "#101828",
                      fontSize: "16px",
                    }}
                  />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Print as PDF" arrow>
                <button
                  className="btn-save"
                  type="button"
                  onClick={() => {
                    if (detailsData?.length <= 0) {
                      return toast.warn("No Data Found");
                    } else {
                      getPDFAction(
                        `/PdfAndExcelReport/GetAssignedSalaryDetailsReport_Matador?strPartName=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${wId}`,
                        setLoading
                      );
                    }
                  }}
                  // disabled={resDetailsReport?.length <= 0}
                  style={{
                    border: "transparent",
                    width: "30px",
                    height: "30px",
                    background: "#f2f2f7",
                    borderRadius: "100px",
                  }}
                >
                  <LocalPrintshopIcon
                    sx={{
                      color: "#101828",
                      fontSize: "16px",
                    }}
                  />
                </button>
              </Tooltip>
            </li>
          </ul>
        </div>
        <div className="table-card-body mt-3" style={{ overflow: "hidden" }}>
          <div>
            <>
              <div className="sme-scrollable-table">
                <div
                  className="scroll-table scroll-table-height"
                  dangerouslySetInnerHTML={{ __html: detailsData }}
                ></div>
              </div>
            </>
          </div>
        </div>
      </div>
    </form>
  );
};
export default EmpCheckList;
