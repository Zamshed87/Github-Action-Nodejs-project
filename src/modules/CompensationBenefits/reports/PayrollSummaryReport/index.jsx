import { Avatar, Form } from "antd";
import PReport from "common/CommonReport/PReport";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { formatFilterValue } from "utility/filter/helper";
import PFilter from "utility/filter/PFilter";

const PayrollSummaryReport = () => {
  const [
    landingApi,
    getLandingApi,
    landingLoading,
    ,
    landingError,
    setLoading,
  ] = useAxiosGet();
  const [data, setData] = useState("");

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId },
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 100),
    []
  );
  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;
  // menu permission

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Payroll Summary";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const landingApiCall = (searchText = "") => {
    const values = form.getFieldsValue(true);
    getLandingApi(
      `/PdfAndExcelReport/GetSalarySummaryReport?DteFromDate=2025-01-01&DteToDate=2025-01-31&StrFormat=Html`,
      (res) => {}
    );
  };

  useEffect(() => {
    // form.setFieldValue("yearDDL", { value: new Date().getFullYear() });
    landingApiCall();
  }, []);
  return permission?.isView ? (
    <div>
      <PReport
        reportType="RDLC"
        reportName={"Payroll Summary Report"}
        pdfUrl="bbbb"
        excelUrl="aaa"
        form={form}
        data={data}
        loading={landingLoading}
        setLoading={setLoading}
        // header={header}
        landingApiCall={landingApiCall}
        pageSize={landingApi?.data?.pageSize}
        totalCount={landingApi?.data?.totalCount}
        filter={
          <PFilter
            form={form}
            showDesignation={"NO"}
            showDepartment={"NO"}
            isSection={false}
            landingApiCall={() => {
              landingApiCall();
            }}
            // resetApiCall={() => {
            //   form.setFieldValue("yearDDL", {
            //     value: new Date().getFullYear(),
            //   });
            // }}
          />
        }
      />
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PayrollSummaryReport;
