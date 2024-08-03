import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { downloadFile, getPDFAction } from "utility/downloadFile";

const FoodAllowenceReport = () => {
  const dispatch = useDispatch();
  // redux states data
  const {
    permissionList,
    profileData: { buId, wId, orgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const featurePermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30423),
    []
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Attendance Log";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const [form] = Form.useForm();

  //   api states and actions
  const [loading, setLoading] = useState(false);
  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    landingApi.action({
      urlKey: "FoodAllowenceLanding",
      method: "GET",
      params: {
        strPartName: "htmlView",
        intAccountId: orgId,
        intWorkplaceId: wId,
        intBusinessUnitId: buId,
        payrollYearId: moment(values?.payrollMonth).format("YYYY"),
        payrollMonthId: moment(values?.payrollMonth).format("MM"),
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, [wId]);

  return featurePermission?.isView ? (
    <>
      <PForm
        initialValues={{
          payrollMonth: "",
        }}
        form={form}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Food Allowence Report`}
            onExport={() => {
              const values = form.getFieldsValue(true);
              const url = `/PdfAndExcelReport/GetFoodAllowenceReport?strPartName=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${wId}&payrollYearId=${moment(
                values?.payrollMonth
              ).format("YYYY")}&payrollMonthId=${moment(
                values?.payrollMonth
              ).format("MM")}`;
              downloadFile(url, "Salary Details Report", "xlsx", setLoading);
            }}
            printIcon={true}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              const url = `/PdfAndExcelReport/GetFoodAllowenceReport?strPartName=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${wId}&payrollYearId=${moment(
                values?.payrollMonth
              ).format("YYYY")}&payrollMonthId=${parseInt(
                moment(values?.payrollMonth).format("MM")
              )}`;
              getPDFAction(url, setLoading);
            }}
          />
          <PCardBody className="">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  format="MMM-YYYY"
                  picker="month"
                  name="payrollMonth"
                  label="Payroll Month"
                  placeholder="Payroll Month"
                  onChange={(value) => {
                    form.setFieldsValue({
                      payrollMonth: value,
                    });
                  }}
                  rules={[
                    { required: true, message: "This field is required" },
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
          </PCardBody>
          {!landingApi?.error && !landingApi?.loading && (
            <>
              {loading && <Loading />}
              <div className="sme-scrollable-table mt-2">
                <div
                  className="scroll-table scroll-table-height"
                  dangerouslySetInnerHTML={{
                    __html: landingApi?.data,
                  }}
                ></div>
              </div>
            </>
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default FoodAllowenceReport;
