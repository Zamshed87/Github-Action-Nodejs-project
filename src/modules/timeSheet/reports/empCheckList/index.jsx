import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import * as Yup from "yup";
// import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getAssignedSalaryDetailsReportRDLC } from "./helper";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import NoResult from "common/NoResult";
import DefaultInput from "common/DefaultInput";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import { getPeopleDeskAllDDL } from "common/api";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
// import { getSalaryDetailsReportRDLC } from "../reports/salaryDetailsReport/helper";

const validationSchema = Yup.object({});

const EmpCheckList = () => {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();

  // redux
  const { orgId, buId, wId, wgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [detailsData, setDetailsData] = useState("");
  const [detailsReportLoading, setDetailsReportLoading] = useState(false);
  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars

  // const [tableAllowanceHead, setTableAllowanceHead] = useState([]);
  // const [tableDeductionHead, setTableDeductionHead] = useState([]);
  // const [tableColumn, setTableColumn] = useState([]);

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues: {
      fDate: monthFirstDate(),
      tDate: monthLastDate(),
      workplaceGroup: "",
      workplace: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (!values?.workplace) {
        return toast.warn("Select Workplace");
      }
      if (orgId && buId && values?.workplace?.value) {
        getAssignedSalaryDetailsReportRDLC(
          "htmlView",
          orgId,
          buId,
          values?.workplace?.value,
          setLoading,
          setDetailsData,
          values?.fDate,
          values?.tDate
        );
      }
    },
  });
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30408) {
      permission = item;
    }
  });
  // let saveHandler = () => {};
  //   const getData = (param = "htmlView") => {

  //   };
  useEffect(() => {
    // if (orgId && buId && wId) {
    //   getAssignedSalaryDetailsReportRDLC(
    //     "htmlView",
    //     orgId,
    //     buId,
    //     values?.workplace?.value || wId,
    //     setLoading,
    //     setDetailsData,
    //     values?.fDate,
    //     values?.tDate
    //   );
    // }
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [orgId, buId, wgId]);

  //  default workplace data will be loading for the first time visiting 
  useEffect(() => {
    if (wId) {
      getAssignedSalaryDetailsReportRDLC(
        "htmlView",
        orgId,
        buId,
        wId,
        setLoading,
        setDetailsData,
        values?.fDate,
        values?.tDate
      );
    }
  }, []);

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
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading" style={{ display: "flex" }}>
            <h2>Employee CheckList Data</h2>
          </div>
          <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
            <div className="row">
              {/* bu */}
              <div className="col-lg-2">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    placeholder=""
                    value={values?.fDate}
                    name="fDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    placeholder=""
                    value={values?.tDate}
                    name="tDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("tDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    min={values?.fDate}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Workplace Group</label>
                  <FormikSelect
                    name="workplaceGroup"
                    options={[...workplaceGroupDDL] || []}
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setWorkplaceDDL([]);
                      setFieldValue("workplaceGroup", valueOption);
                      setFieldValue("workplace", "");
                      if (valueOption?.value) {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                          "intWorkplaceId",
                          "strWorkplace",
                          setWorkplaceDDL
                        );
                      }
                    }}
                    placeholder=""
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Workplace</label>
                  <FormikSelect
                    name="workplace"
                    options={[...workplaceDDL] || []}
                    value={values?.workplace}
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption);
                    }}
                    placeholder=""
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="col-1">
                <button
                  style={{ marginTop: "21px" }}
                  className="btn btn-green btn-green-disable"
                  type="submit"
                >
                  View
                </button>
              </div>
            </div>
          </div>
          {detailsData?.length > 0 ? (
            <>
              <div>
                <ul className="d-flex flex-wrap align-items-center justify-content-end">
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
                            `/PdfAndExcelReport/GetAssignedSalaryDetailsReport_Matador?strPartName=excelView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${
                              values?.workplace?.value || wId
                            }&dteFromDate=${values?.fDate}&dteToDate=${
                              values?.tDate
                            }`,
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
                              `/PdfAndExcelReport/GetAssignedSalaryDetailsReport_Matador?strPartName=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${
                                values?.workplace?.value || wId
                              }`,
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
            </>
          ) : (
            <>{<NoResult title="No Result Found" para="" />}</>
          )}
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
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};
export default EmpCheckList;
