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
import { getPDFAction } from "utility/downloadFile";
import { useLocation } from "react-router-dom";
import EmployeeInfoCard from "./EmployeeInfoCard";

const PfEmployeeReportView = () => {
  const location = useLocation();
  // Get employeeId from URL query parameter instead of location state
  const queryParams = new URLSearchParams(location.search);
  const employeeId = queryParams.get("employeeId")
    ? parseInt(queryParams.get("employeeId") || "0")
    : undefined;

  // Fallback to location state if query param is not available (for backward compatibility)
  const { employeeId: stateEmployeeId } = (location.state || {}) as {
    employeeId?: number;
  };

  // Use query param employeeId if available, otherwise use the one from state
  const finalEmployeeId = employeeId || stateEmployeeId;

  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30510),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Investment By Org Details";
  }, []);

  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    landingApi.action({
      urlKey: "GetEmployeeMonthWisePfDetailReport",
      method: "GET",
      params: {
        employeeId: finalEmployeeId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, []);
  console.log("landingApi", landingApi?.data);
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
      title: "Month-Year",
      dataIndex: "strMonthYear",
      render: (_: any, rec: any) => {
        const date = rec?.dteMonthYear
          ? moment(rec.dteMonthYear).format("MMM-YYYY")
          : "-";
        return <>{date}</>;
      },
      sorter: true,
      width: 15,
    },
    {
      title: "Employee Contribution",
      dataIndex: "numEmployeeContribution",
      render: (_: any, rec: any) => (
        <>{rec?.numEmployeeContribution?.toLocaleString() || 0}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Company Contribution",
      dataIndex: "numCompanyContribution",
      render: (_: any, rec: any) => (
        <>{rec?.numCompanyContribution?.toLocaleString() || 0}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Employee Profit",
      dataIndex: "numEmployeeProfit",
      render: (_: any, rec: any) => (
        <>{rec?.numEmployeeProfit?.toLocaleString() || 0}</>
      ),
      sorter: true,
      width: 15,
    },
    {
      title: "Company Profit",
      dataIndex: "numCompanyProfit",
      render: (_: any, rec: any) => (
        <>{rec?.numCompanyProfit?.toLocaleString() || 0}</>
      ),
      sorter: true,
      width: 15,
    },
    {
      title: "Total Profit Amount",
      dataIndex: "numTotalProfit",
      render: (_: any, rec: any) => (
        <>{rec?.numTotalProfit?.toLocaleString() || 0}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Total PF Amount",
      dataIndex: "numTotalPFAmount",
      render: (_: any, rec: any) => (
        <>{rec?.numTotalPFAmount?.toLocaleString() || 0}</>
      ),
      sorter: true,
      width: 20,
    },
    {
      title: "Last Profit Share Date",
      dataIndex: "dteLastProfitShareDate",
      render: (_: any, rec: any) => (
        <>
          {rec?.dteLastProfitShareDate
            ? dateFormatter(rec.dteLastProfitShareDate)
            : "-"}
        </>
      ),
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
          {(landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            printIcon={true}
            backButton={true}
            title={`PF Employee Wise Details`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            pdfExport={() => {
              try {
                getPDFAction(
                  `/PdfAndExcelReport/GetEmployeeMonthWisePfDetailReport?employeeId=${finalEmployeeId || 0}`,
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
          {landingApi?.data?.data?.length > 0 ? (
            <EmployeeInfoCard employee={landingApi.data.data[0]} />
          ) : (
            <p>No employee data available</p>
          )}
          {landingApi?.data?.data && (
            <DataTable
              scroll={{ x: 1700 }}
              bordered
              data={
                landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
              }
              header={header}
            />
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfEmployeeReportView;
