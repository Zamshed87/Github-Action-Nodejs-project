import { Form } from "antd";
import PReport from "common/CommonReport/PReport";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
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
  // menu permission

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 100),
    []
  );

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Payroll Summary";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const makeUrl = (format) => {
    const values = form.getFieldsValue(true);
    console.log(values);
    const wGroupParams = values?.workplaceGroup
      ? `&IntWorkplacegroupId=${values?.workplaceGroup?.value}`
      : "";
    let wParams = "";
    if (values?.workplaceId?.length > 0) {
      values?.workplaceId.forEach((item) => {
        wParams += `&ListofWorkplace=${item}`;
      });
    }
    const fromDate = moment(values?.fromDate).format("YYYY-MM-DD");
    const toDate = moment(values?.toDate).format("YYYY-MM-DD");

    return `/PdfAndExcelReport/GetSalarySummaryReport?DteFromDate=${fromDate}&DteToDate=${toDate}${wGroupParams}${wParams}&StrFormat=${format}`;
  };

  const landingApiCall = (searchText = "") => {
    getLandingApi(makeUrl("Html"), (res) => {
      setData(res);
    });
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
        pdfUrl={makeUrl("pdf")}
        excelUrl={makeUrl("Excel")}
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
            mode={{
              workplace: true,
            }}
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
