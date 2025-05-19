import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import PFilter from "utility/filter/PFilter";
import { formatFilterValue } from "utility/filter/helper";
import { numberWithCommas } from "utility/numberWithCommas";
import { todayDate } from "utility/todayDate";

const EmOverTimeReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, orgId },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 102),
    []
  );

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // Form Instance
  const [form] = Form.useForm();
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Overtime Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // data call
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
    IsForXl?: boolean;
    date?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    landingApi.action({
      urlKey: "OvertimeReport",
      method: "GET",
      params: {
        PartType: "CalculatedHistoryReportForAllEmployee",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        WorkplaceGroupList:
          values?.workplaceGroup?.value == 0 ||
          values?.workplaceGroup?.value == undefined
            ? decodedToken.workplaceGroupList
            : values?.workplaceGroup?.value.toString(),
        WorkplaceList:
          values?.workplace?.value == 0 || values?.workplace?.value == undefined
            ? decodedToken.workplaceList
            : values?.workplace?.value.toString(),
        departments: formatFilterValue(values?.department),
        designations: formatFilterValue(values?.designation),
        PageNo: pagination.current || pages?.current,
        PageSize: pagination.pageSize || pages?.pageSize,
        IsPaginated: true,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        SearchText: searchText || "",
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, []);

  //   table column
  const header: any = () => {
    return [
      {
        title: "SL",
        render: (_: any, rec: any, index: number) =>
          (pages?.current - 1) * pages?.pageSize + index + 1,
        fixed: "left",
        width: 20,
        align: "center",
      },
      {
        title: "Workplace/Concern",
        dataIndex: "workplace",
        width: 80,
        fixed: "left",
      },
      {
        title: "Employee Id",
        dataIndex: "employeeCode",
        width: 30,
        fixed: "left",
      },

      {
        title: "Employee Name",
        dataIndex: "employee",
        render: (_: any, rec: any) => {
          return (
            <div className="d-flex align-items-center">
              <Avatar title={rec?.employee} />
              <span className="ml-2">{rec?.employee}</span>
            </div>
          );
        },
        fixed: "left",
        width: 80,
      },

      {
        title: "Designation",
        dataIndex: "designation",

        width: 60,
      },

      {
        title: "Department",
        dataIndex: "department",

        width: 60,
      },
      {
        title: "Employement Type",
        dataIndex: "employementType",

        width: 60,
      },
      {
        title: "Basic Salary",
        dataIndex: "basicSalary",
        width: 50,
      },
      {
        title: "Salary",
        dataIndex: "salary",
        width: 60,
      },
      {
        title: "Hour",
        dataIndex: "hours",
        width: 40,
      },
      {
        title: "Hour Amount Rate",
        dataIndex: "perHourRate",
        width: 40,
        render: (_: any, data: any) => {
          return <span className="text-right">{data?.perHourRate}</span>;
        },
      },
      {
        title: "Total Amount",
        dataIndex: "Hour Amount Rate",
        sort: false,
        filter: false,
        width: 40,
        fixed: "right",
        render: (_: any, data: any) => {
          return (
            <span className="text-right">
              {numberWithCommas(data?.payAmount)}
            </span>
          );
        },
      },
    ];
  };
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: pages?.current,
              pageSize: pages?.pageSize,
            },
          });
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            backButton
            exportIcon={true}
            title={`Total ${landingApi?.data[0]?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const values = form.getFieldsValue(true);
              const url = `/PdfAndExcelReport/EmployeeOvertimeReport?strPartName=excelView&partType=CalculatedHistoryReportForAllEmployee&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&dteFromDate=${moment(
                values?.fromDate
              ).format("YYYY-MM-DD")}&dteToDate=${moment(values?.toDate).format(
                "YYYY-MM-DD"
              )}&IsPaginated=false&intPageNo=1&intPageSize=20&departments=${formatFilterValue(
                values?.department
              )}&designations=${formatFilterValue(
                values?.designation
              )}&WorkplaceGroupList=${
                values?.workplaceGroup?.value == 0 ||
                values?.workplaceGroup?.value == undefined
                  ? decodedToken.workplaceGroupList
                  : values?.workplaceGroup?.value.toString()
              }&WorkplaceList=${
                values?.workplace?.value == 0 ||
                values?.workplace?.value == undefined
                  ? decodedToken.workplaceList
                  : values?.workplace?.value.toString()
              }`;
              downloadFile(
                url,
                `Overtime_Report (${todayDate()})`,
                "xlsx",
                setExcelLoading
              );
            }}
            printIcon={true}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              const url = `/PdfAndExcelReport/EmployeeOvertimeReport?strPartName=pdfView&partType=CalculatedHistoryReportForAllEmployee&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&dteFromDate=${moment(
                values?.fromDate
              ).format("YYYY-MM-DD")}&dteToDate=${moment(values?.toDate).format(
                "YYYY-MM-DD"
              )}&IsPaginated=false&intPageNo=1&intPageSize=20&departments=${formatFilterValue(
                values?.department
              )}&designations=${formatFilterValue(
                values?.designation
              )}&WorkplaceGroupList=${
                values?.workplaceGroup?.value == 0 ||
                values?.workplaceGroup?.value == undefined
                  ? decodedToken.workplaceGroupList
                  : values?.workplaceGroup?.value.toString()
              }&WorkplaceList=${
                values?.workplace?.value == 0 ||
                values?.workplace?.value == undefined
                  ? decodedToken.workplaceList
                  : values?.workplace?.value.toString()
              }`;
              getPDFAction(url, setExcelLoading);
            }}
          />
          <PFilter form={form} landingApiCall={landingApiCall} />
          <DataTable
            bordered
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header()}
            pagination={{
              pageSize: pages?.pageSize,
              total: landingApi?.data[0]?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);
              setPages({
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
              });
              landingApiCall({
                pagination,
                searchText: form.getFieldValue("search"),
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmOverTimeReport;
