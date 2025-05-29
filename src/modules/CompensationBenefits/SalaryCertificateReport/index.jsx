import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
} from "../../../common/api";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { getPDFAction } from "../../../utility/downloadFile";
import { customStyles } from "../../../utility/newSelectCustomStyle";
import { useReactToPrint } from "react-to-print";
import { useApiRequest } from "Hooks";
import { APIUrl } from "App";
import IbblBankLetterHead from "../BankAdviceReport/letterheadReports/IbblBankLetterHead";
import LetterHead from "./LetterHead";

const initialValues = {
  date: moment().format("YYYY-MM"),
  employee: "",
  inMonth: new Date().getMonth() + 1,
  intYear: new Date().getFullYear(),
  adviceName: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  adviceName: Yup.object()
    .shape({
      value: Yup.string().required("Salary Code is required"),
      label: Yup.string().required("Salary Code is required"),
    })
    .typeError("Salary Code is required"),
});

const SalaryPayslipReport = () => {
  const [loading, setLoading] = useState(false);
  const { orgId, wgId, buId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { setFieldValue, setValues, values, errors, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema,
      initialValues,
      onSubmit: () => {
        getData();
        pdfViewData(values);
        setIsLandingShow(true);
      },
    });

  const [
    employeeInfo,
    getEmployeeInfo,
    loadingOnEmpInfoFetching,
    setEmployeeInfo,
  ] = useAxiosGet();

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  const topSheetRef = useRef();

  const topSheetPrintFn = useReactToPrint({
    contentRef: topSheetRef,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; }@page {size: A4 ! important}}",
    documentTitle: `${values?.bank?.label} Top Sheet-${moment().format("ll")}`,
  });

  const [payrollPeiodDDL, setPayrollPeiodDDL] = useState([]);
  const [isLandingShow, setIsLandingShow] = useState(true);

  const getData = () => {
    getEmployeeInfo(
      `/PdfAndExcelReport/GetSalaryCertificate?Type=htmlView&EmployeeId=${values?.employee?.value}&MonthId=${values?.inMonth}&YearId=${values?.intYear}&SalaryGenerateRequsetId=${values?.adviceName?.value}`
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30279) {
      permission = item;
    }
  });
  const [landingViewPdf, setLandingViewPdf] = useState("");
  const [letterHeadImage, setLetterHeadImage] = useState("");
  const [signatureImage, setSignatureImage] = useState("");

  // setting up to module
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Salary Certificate";
  }, []);

  const loadImage = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });
  };
  const landingApi = useApiRequest({});

  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
  } = {}) => {
    landingApi.action({
      urlKey: "GetAllWorkplace",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, []);

  const fetchLetterHeadAndSignatureImage = async () => {
    if (landingApi?.data?.length > 0) {
      const letterHeadImageId = landingApi?.data.find(
        (workplace) => workplace.intWorkplaceId === wId
      )?.intLetterHeadId;
      const signatureImageId = landingApi?.data.find(
        (workplace) => workplace.intWorkplaceId === wId
      )?.intSignatureId;
      console.log("letterHeadImageId", letterHeadImageId);
      console.log("signatureImageId", signatureImageId);
      try {
        setLoading(true);
        const letterImg = await loadImage(
          `${APIUrl}/Document/DownloadFile?id=${letterHeadImageId}`
        );
        const signatureImg = await loadImage(
          `${APIUrl}/Document/DownloadFile?id=${signatureImageId}`
        );
        setLoading(false);
        if (letterHeadImageId === 0) {
          setLetterHeadImage(null);
        } else {
          setLetterHeadImage(letterImg);
        }
        if (signatureImageId === 0) {
          setSignatureImage(null);
        } else {
          setSignatureImage(signatureImg);
        }
      } catch (error) {
        setLetterHeadImage(null);
        setSignatureImage(null);
        setLoading(false);
      }
    }
  };

  const pdfData = useApiRequest([]);
  const pdfViewData = (values) => {
    pdfData?.action({
      method: "GET",
      urlKey: "GetSalaryCertificate",
      params: {
        EmployeeId: values?.employee?.value,
        MonthId: values?.inMonth,
        YearId: values?.intYear,
        SalaryGenerateRequsetId: values?.adviceName?.value,
        Type: "pdfView",
      },
      onSuccess: (res) => {
        fetchLetterHeadAndSignatureImage();
        setLandingViewPdf(res);
      },
    });
  };

  return (
    <>
      {(loading || loadingOnEmpInfoFetching) && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center my-1">
                <h2>Salary Certificate Report</h2>
                {employeeInfo && (
                  <Tooltip title="Print" arrow>
                    <button
                      className="btn-save ml-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        reactToPrintFn();
                        // getPDFAction(
                        //   `/PdfAndExcelReport/EmployeeSalaryCertificate?partName=SalaryGenerateHeaderByPayrollMonthNEmployeeId&intEmployeeId=${
                        //     values?.employee?.value
                        //   }&intMonthId=${values?.inMonth}&intYearId=${
                        //     values?.intYear
                        //   }&intSalaryGenerateRequestId=${
                        //     values?.adviceName ? +values?.adviceName?.value : 0
                        //   }`,
                        //   setLoading
                        // );
                      }}
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
                          color: "#637381",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="table-card-body">
              <div className="card-style with-form-card pb-0">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Month</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.date}
                        name="date"
                        type="month"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("adviceName", "");
                          setFieldValue("date", e.target.value);
                          setFieldValue(
                            "inMonth",
                            +e.target.value.split("").slice(-2).join("")
                          );
                          setFieldValue(
                            "intYear",
                            +e.target.value.split("").slice(0, 4).join("")
                          );
                          if (e.target.value && values?.employee?.value) {
                            getPeopleDeskAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${
                                values?.employee?.value
                              }&IntMonth=${+e.target.value
                                .split("")
                                .slice(-2)
                                .join("")}&IntYear=${+e.target.value
                                .split("")
                                .slice(0, 4)
                                .join("")}`,
                              "SalaryGenerateRequestId",
                              "SalaryCode",
                              setPayrollPeiodDDL
                            );
                          }
                          setIsLandingShow(false);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Select Employee</label>

                      <AsyncFormikSelect
                        selectedValue={values?.employee}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("adviceName", "");
                          setFieldValue("employee", valueOption);
                          setEmployeeInfo("");
                          if (
                            values?.inMonth &&
                            values?.intYear &&
                            valueOption?.value
                          ) {
                            getPeopleDeskAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${valueOption?.value}&IntMonth=${values?.inMonth}&IntYear=${values?.intYear}`,
                              "SalaryGenerateRequestId",
                              "SalaryCode",
                              setPayrollPeiodDDL
                            );
                          }
                          setIsLandingShow(false);
                        }}
                        placeholder="Search (min 3 letter)"
                        loadOptions={(v) =>
                          getSearchEmployeeList(buId, wgId, v)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Salary Code</label>
                      <FormikSelect
                        name="adviceName"
                        options={payrollPeiodDDL || []}
                        value={values?.adviceName}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            adviceName: valueOption,
                          }));
                          setIsLandingShow(false);
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <button
                      disabled={
                        !values?.date ||
                        !values?.employee ||
                        !values?.adviceName
                      }
                      style={{ marginTop: "21px" }}
                      className="btn btn-green"
                      type="submit"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="sme-scrollable-table mt-2">
                  <div
                    className="scroll-table scroll-table-height"
                    dangerouslySetInnerHTML={{
                      __html: employeeInfo,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div style={{ overflow: "scroll" }} className="mt-3 w-100">
              {!pdfData?.loading && (
                <div style={{ display: "none" }}>
                  <div ref={contentRef}>
                      <LetterHead
                        letterHeadImage={letterHeadImage}
                        landingViewPdf={landingViewPdf}
                        signatureImage={signatureImage}
                      />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default SalaryPayslipReport;

const thStyles = {
  fontWeight: 600,
  fontSize: "12px !important",
  lineHeight: "18px !important",
  color: `${gray600} !important`,
};
