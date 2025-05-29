import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { dateFormatter, getDateOfYear } from "utility/dateFormatter";
import {} from "react-icons/md";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { useParams } from "react-router-dom";
import usePfInvestmentConfig from "modules/benefitManagement/PfInvestment/PfInvestmentCreate/components/PfInvestmentConfig/usePfInvestmentConfig";

const PfInvestmentByOrgReportView = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30510),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Investment By Org Details";
  }, []);

  const { investmentOrganization, loadingInvestmentOrganization } =
    usePfInvestmentConfig({
      callInvestmentType: false,
      callInvestmentOrganization: true,
    });

  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "GetInvestmentDetailReportByOrganization",
      method: "GET",
      params: {
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        intBusinessUnitId: buId,
        InvestmentOrgId: values?.investmentOrganizationId || 0,
      },
    });
  };

  const searchFunc = debounce((values) => {
    landingApiCall();
  }, 500);

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      width: 5,
    },
    {
      title: "Investment Type",
      dataIndex: "strOrgName",
      sorter: true,
      width: 20,
    },
    {
      title: "Investment Date",
      dataIndex: "dteInvestmentDate",
      render: (_: any, rec: any) => (
        <>{dateFormatter(rec?.dteInvestmentDate)}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Investment Amount",
      dataIndex: "numInvestmentAmount",
      sorter: true,
      width: 30,
    },
    {
      title: "Collection Date",
      dataIndex: "dteCollectionDate",
      render: (_: any, rec: any) => (
        <>{dateFormatter(rec?.dteCollectionDate)}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Principal Collection",
      dataIndex: "numPrincipalAmount",
      sorter: true,
      width: 30,
    },
    {
      title: "Interest Collection",
      dataIndex: "numInterestAmount",
      sorter: true,
      width: 30,
    },
    {
      title: "Total Collection",
      dataIndex: "numTotalCollection",
      sorter: true,
      width: 20,
    },
    {
      title: "Collection Status",
      dataIndex: "strCollectionStatus",
      sorter: true,
      width: 20,
    },
    {
      title: "Comments",
      dataIndex: "strComments",
      sorter: true,
      width: 20,
    },
  ];

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(getDateOfYear("first")),
          toDate: moment(getDateOfYear("last")),
        }}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(excelLoading || landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={false}
            printIcon={false}
            backButton={true}
            title={`PF Investment By Org Details`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                if (landingApi?.data?.length === 0) return null;
                try {
                  const values = form.getFieldsValue(true);
                  downloadFile(
                    `/MarketVisitReport/MarketVisitReport?format=excel&intAccountId=${orgId}&intWorkplaceId=${wId}&fromDate=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&toDate=${moment(
                      values?.toDate
                    ).format("YYYY-MM-DD")}&strSearch=${
                      values?.search || ""
                    }&employeeId=${values?.employee?.value || 0}`,
                    "Market Visit Report",
                    "xlsx",
                    setLoading
                  );
                  setExcelLoading(false);
                } catch (error: any) {
                  console.log("error", error);
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                }
              };
              excelLanding();
            }}
            pdfExport={() => {
              try {
                const values = form.getFieldsValue(true);
                getPDFAction(
                  `/MarketVisitReport/MarketVisitReport?format=pdf&intAccountId=${orgId}&intWorkplaceId=${wId}&fromDate=${moment(
                    values?.fromDate
                  ).format("YYYY-MM-DD")}&toDate=${moment(
                    values?.toDate
                  ).format("YYYY-MM-DD")}&employeeId=${
                    values?.employee?.value || 0
                  }&strSearch=${values?.search || ""}`,
                  setLoading
                );
              } catch (error: any) {
                toast.error(
                  error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong",
                  {
                    toastId: "marketvisitreport_error",
                  }
                );
              }
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="investmentOrganizationId"
                  label="Investment Organization"
                  placeholder="Select Investment Organization"
                  onChange={(value) => {
                    form.setFieldsValue({ investmentOrganizationId: value });
                  }}
                  options={investmentOrganization}
                  loading={loadingInvestmentOrganization}
                  rules={[
                    {
                      required: true,
                      message: "Investment Organization is required",
                    },
                  ]}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
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
          {landingApi?.data?.data && (
            <DataTable
              scroll={{ x: 1700 }}
              bordered
              data={
                landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
              }
              loading={landingApi?.loading}
              header={header}
              onChange={(pagination, filters, sorter, extra) => {
                if (extra.action === "sort") return;
                landingApiCall();
              }}
            />
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfInvestmentByOrgReportView;
