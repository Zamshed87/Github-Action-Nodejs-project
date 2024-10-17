import {
  DataTable,
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

const YearlyTaxReturnReport = () => {
  const { orgId, buId, wgId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // form
  const [form] = Form.useForm();
  const landingApi = useApiRequest([]);
  const [data, setData] = useState("");

  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    const workplaceList = values?.workplace?.map((i: any) => i?.value);
    landingApi?.action({
      method: "get",
      urlKey: "EmployeeFullYearTaxReport",
      params: {
        strType: "htmlView",
        workPlaceGroupId: values?.workplaceGroup?.value,
        FiscalYearId: values?.fiscalYear?.value,
        strWorkPlaceList: workplaceList?.length > 0 ? `${workplaceList}` : 0,
        status: values?.status?.value,
      },
      onSuccess: (res) => {
        setData(res);
      },
    });
  };
  const [loading, setLoading] = useState(false);

  // apiStates
  //   const YearTaxApi = useApiRequest([]);
  const getFiscalDDL = useApiRequest({});

  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    getFiscalDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "fiscalYearDDL",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
    });
  }, [orgId, buId, employeeId, wgId]);

  document.title = "Yearly Tax Return Report";

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
        {loading && <Loading />}
        <PCard>
          <PCardHeader title="Yearly Tax Return Report" />
          <div className="card-style">
            <Row gutter={[10, 2]}>
              <Col md={3} sm={24}>
                <PSelect
                  options={
                    getFiscalDDL?.data?.length > 0 ? getFiscalDDL?.data : []
                  }
                  name="fiscalYear"
                  showSearch
                  filterOption={true}
                  label="Fiscal Year"
                  placeholder="Fiscal Year"
                  onChange={(value: number, op: any) => {
                    form.setFieldsValue({ fiscalYear: op });
                  }}
                  rules={[
                    { required: true, message: "Fiscal Year is required" },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={[
                    { required: true, message: "Workplace Group is required" },
                  ]}
                />
              </Col>
              <Col md={8} sm={12} xs={24}>
                <PSelect
                  mode="multiple"
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                  }}
                  rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              <Col md={3} sm={12} xs={24}>
                <PSelect
                  options={[
                    { value: 1, label: "All" },
                    { value: 2, label: "Existing Tax" },
                    { value: 3, label: "No tax" },
                  ]}
                  name="status"
                  label="Status"
                  placeholder="Status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      status: op,
                    });
                  }}
                  rules={[{ required: true, message: "Status is required" }]}
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
            <ul className="d-flex flex-row-reverse mt-3 align-items-center justify-content-start">
              <li className="pr-2 ml-2">
                <Tooltip title="Download as Excel">
                  <button
                    className="btn-save"
                    type="button"
                    onClick={(e) => {
                      const values = form.getFieldsValue(true);
                      e.stopPropagation();
                      const workplaceList = values?.workplace?.map(
                        (i: any) => i?.value
                      );

                      const url = `/PdfAndExcelReport/EmployeeFullYearTaxReport?strType=excelView&workPlaceGroupId=${values?.workplaceGroup?.value}&FiscalYearId=${values?.fiscalYear?.value}&strWorkPlaceList=${workplaceList}&status=${values?.status?.value}`;

                      downloadFile(
                        url,
                        `Yearly Tax Return Report- ${todayDate()}`,
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
                      const workplaceList = values?.workplace?.map(
                        (i: any) => i?.value
                      );

                      const url = `/PdfAndExcelReport/EmployeeFullYearTaxReport?strType=pdfView&workPlaceGroupId=${values?.workplaceGroup?.value}&FiscalYearId=${values?.fiscalYear?.value}&strWorkPlaceList=${workplaceList}&status=${values?.status?.value}`;

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

        <div style={{ overflow: "scroll" }} className=" w-100">
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

export default YearlyTaxReturnReport;
