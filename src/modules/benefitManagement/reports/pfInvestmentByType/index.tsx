import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDateOfYear } from "utility/dateFormatter";
import {} from "react-icons/md";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const PfInvestmentByTypeReport = () => {
  const history = useHistory();
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
    document.title = "Benefits Management - PF Investment By Type Report";
  }, []);

  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "GetTypeWiseReport",
      method: "GET",
      params: {
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        BusinessUnitId: buId,
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
      dataIndex: "investmentType",
      sorter: true,
      width: 20,
    },
    {
      title: "Total Time of Investment",
      dataIndex: "investmentCount",
      sorter: true,
      width: 20,
    },
    {
      title: "Total Invested Amount",
      dataIndex: "investmentAmount",
      sorter: true,
      width: 20,
    },
    {
      title: "Total Collected Amount",
      dataIndex: "investmentCollectedAmount",
      sorter: true,
      width: 20,
    },
    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_: any, rec: any) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "view",
                onClick: (e: any) => {
                  if (!employeeFeature?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  history.push(
                    `/BenefitsManagement/reports/pfInvestmentbyType/View/${rec?.intId}`
                  );
                },
              },
            ]}
          />
        </>
      ),
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
            title={`PF Investment By Type Report`}
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

export default PfInvestmentByTypeReport;
