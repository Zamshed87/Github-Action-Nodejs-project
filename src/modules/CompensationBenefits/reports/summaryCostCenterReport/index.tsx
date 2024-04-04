import {
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tooltip } from "antd";
import { getPeopleDeskAllDDL } from "common/api";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import Loading from "common/loading/Loading";
import { todayDate } from "utility/todayDate";

const SummaryCostCenterReport = () => {
  const { orgId, buId, wgId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // form
  const [form] = Form.useForm();

  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    getCostCenterReportLanding("htmlView", values);
  };

  // apiStates
  const CostCenterReportLanding = useApiRequest([]);
  const [salaryCodeDDL, getSalaryCodeAPI, , setSalaryCodeDDL] = useAxiosPost(
    []
  );
  const [data, setData] = useState("");
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWorkplaceDDL([]);
    setSalaryCodeDDL([]);
    // setFieldValue("salaryCode", "");
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${0}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  // Functions
  const getCostCenterReportLanding = (partName: string, values: any) => {
    CostCenterReportLanding?.action({
      method: "get",
      urlKey: "costCenterReportLanding",
      params: {
        strPartName: partName,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        intMonthId: moment(values?.month).format("MM"),
        intYearId: moment(values?.month).format("YYYY"),
        strSalaryCode: values?.salaryCode?.strSalaryCode,
      },
      onSuccess: (res) => {
        setData(res);
      },
    });
  };

  const getSalaryCodeByFromDateAndWId = (month: any) => {
    getSalaryCodeAPI(`/Payroll/GetSalaryCode`, {
      fromDate: moment(month).startOf("month").format("YYYY-MM-DD"),
      toDate: moment(month).endOf("month").format("YYYY-MM-DD"),
      workPlaceId: (workplaceDDL || []).map((w: any) => w?.intWorkplaceId),
    });
  };

  return (
    <>
      <PForm
        form={form}
        initialValues={{
          serviceLengthType: 2 /* 1 for Month */,
          isDividedByLength: false,
        }}
        onFinish={submitHandler}
      >
        {(loading || CostCenterReportLanding.loading) && <Loading />}
        <PCard>
          <PCardHeader title="Salary Summary Cost Center Report" />
          <div className="card-style">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PInput
                  type="date"
                  picker="month"
                  format="MMM, YYYY"
                  name="month"
                  placeholder="Select Month"
                  label="Select Month"
                  onChange={(e: any) => {
                    getSalaryCodeByFromDateAndWId(e);
                    form.setFieldsValue({ salaryCode: "" });
                    setData("");
                  }}
                  rules={[{ required: true, message: "Month Is Required" }]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={salaryCodeDDL || []}
                  name="salaryCode"
                  showSearch
                  filterOption={true}
                  label="Salary-Code"
                  placeholder="Salary-Code"
                  onChange={(value: number, op: any) => {
                    form.setFieldsValue({ salaryCode: op });
                  }}
                  rules={[
                    { required: true, message: "Salary-Code is required" },
                  ]}
                />
              </Col>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </div>
        </PCard>
        <div>
          {data && (
            <ul className="d-flex flex-wrap align-items-center justify-content-start">
              <li className="pr-2">
                <Tooltip title="Download as Excel">
                  <button
                    className="btn-save"
                    type="button"
                    onClick={(e) => {
                      const values = form.getFieldsValue(true);
                      e.stopPropagation();

                      const url = `/PdfAndExcelReport/GetSalaryCostCenterReportMatador?strPartName=excelView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${moment(
                        values?.month
                      ).format("MM")}&intYearId=${moment(values?.month).format(
                        "YYYY"
                      )}&strSalaryCode=${values?.salaryCode?.strSalaryCode}`;
                      downloadFile(
                        url,
                        `Salary Summary Cost Center Report- ${todayDate()}`,
                        "xlsx",
                        setLoading
                      );
                    }}
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
                <Tooltip title="Print as PDF">
                  <button
                    className="btn-save"
                    type="button"
                    onClick={(e) => {
                      const values = form.getFieldsValue(true);
                      e.stopPropagation();
                      const url = `/PdfAndExcelReport/GetSalaryCostCenterReportMatador?strPartName=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${moment(
                        values?.month
                      ).format("MM")}&intYearId=${moment(values?.month).format(
                        "YYYY"
                      )}&strSalaryCode=${values?.salaryCode?.strSalaryCode}`;

                      getPDFAction(url, setLoading);
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
          )}
        </div>

        <div style={{ overflow: "scroll" }} className="mt-3 w-100">
          <div
            dangerouslySetInnerHTML={{
              __html: data,
            }}
          />
        </div>
      </PForm>
    </>
  );
};

export default SummaryCostCenterReport;
