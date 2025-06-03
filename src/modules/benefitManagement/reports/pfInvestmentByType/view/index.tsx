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
import usePfInvestmentConfig from "modules/benefitManagement/PfInvestment/PfInvestmentCreate/components/PfInvestmentConfig/usePfInvestmentConfig";

const PfInvestmentByTypeReportView = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, orgId, wId },
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
    document.title = "Benefits Management - PF Investment By Type Details";
  }, []);

  const { investmentType, loadingInvestmentType } = usePfInvestmentConfig({
    callInvestmentType: true,
    callInvestmentOrganization: true,
  });

  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    landingApi.action({
      urlKey: "GetTypeWiseDetailsReport",
      method: "GET",
      params: {
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        BusinessUnitId: buId,
        InvestmentTypeId: values?.investmentType || 0,
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
      title: "Investment To Organization",
      dataIndex: "investmentOrg",
      sorter: true,
      width: 35,
    },
    {
      title: "Investment Date",
      dataIndex: "investmentDate",
      render: (_: any, rec: any) => (
        <>{dateFormatter(rec?.investmentDate)}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Investment Amount",
      dataIndex: "investmentAmount",
      sorter: true,
      width: 30,
    },
    {
      title: "Collection Date",
      dataIndex: "collectionDate",
      render: (_: any, rec: any) => (
        <>{dateFormatter(rec?.collectionDate)}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Principal Collection",
      dataIndex: "principalAmount",
      sorter: true,
      width: 30,
    },
    {
      title: "Interest Collection",
      dataIndex: "interestCollection",
      sorter: true,
      width: 30,
    },
    {
      title: "Total Collection",
      dataIndex: "totalCollection",
      sorter: true,
      width: 20,
    },
     {
      title: "Investment Balance",
      dataIndex: "investmentBalance",
      sorter: true,
      width: 30,
    },
    {
      title: "Collection Status",
      dataIndex: "collectionStatus",
      sorter: true,
      width: 20,
    },
    {
      title: "Comments",
      dataIndex: "remark",
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
            title={`PF Investment By Type Details`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="investmentType"
                  label="Investment Type"
                  placeholder="Select Investment Type"
                  onChange={(value) => {
                    form.setFieldsValue({ investmentType: value });
                  }}
                  options={investmentType}
                  loading={loadingInvestmentType}
                  rules={[
                    {
                      required: true,
                      message: "Investment Type is required",
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

export default PfInvestmentByTypeReportView;
