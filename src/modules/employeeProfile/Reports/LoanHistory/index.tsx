import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import { Form, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { dateFormatter, getDateOfYear } from "utility/dateFormatter";
import { debounce } from "lodash";
import { InfoOutlined } from "@mui/icons-material";
import { LightTooltip } from "common/LightTooltip";
import { getPDFAction, postPDFAction } from "utility/downloadFile";
import PFilter from "utility/filter/PFilter";
import { formatFilterValueList } from "utility/filter/helper";

const EmLoanHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, wId, buId, wgId },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 99),
    []
  );

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});

  const [, setFilterList] = useState({});
  const [, setBuDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [pages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  // Form Instance
  const [form] = Form.useForm();
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Loan History";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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
      urlKey: "GetLoanApplicationByAdvanceFilter",
      method: "POST",
      payload: {
        businessUnitId: buId,
        loanTypeId: 0,
        departmentIdList: formatFilterValueList(values?.department),
        designationIdList: formatFilterValueList(values?.designation),
        employeeId: 0,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.todate).format("YYYY-MM-DD"),
        minimumAmount: 0,
        maximumAmount: 0,
        applicationStatus: "",
        installmentStatus: "",
        pageSize: pagination?.pageSize || 500,
        pageNo: pagination?.current || 1,
        ispaginated: true,
        searchText: searchText || "",
        workplaceGroupId: wgId,
        workplaceId: wId,
        WorkplaceGroupList:
          values?.workplaceGroup?.value == 0 ||
          values?.workplaceGroup?.value == undefined
            ? decodedToken.workplaceGroupList
            : values?.workplaceGroup?.value.toString(),
        WorkplaceList:
          values?.workplace?.value == 0 || values?.workplace?.value == undefined
            ? decodedToken.workplaceList
            : values?.workplace?.value.toString(),
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, []);

  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      fixed: "left",
      width: 35,
      align: "center",
    },
    {
      title: "Work. Group/Location",
      dataIndex: "strWorkPlaceGroupName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkPlaceName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      width: 35,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        );
      },
      fixed: "left",
      width: 60,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",

      width: 70,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",

      width: 70,
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      render: (_: any, rec: any) => dateFormatter(rec?.applicationDate),
      width: 60,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      render: (_: any, record: any) => (
        <div>
          <LightTooltip
            title={
              <div className="application-tooltip">
                <h6>Reason</h6>
                <span className="tableBody-title">{record?.description}</span>
              </div>
            }
            arrow
          >
            <InfoOutlined sx={{ fontSize: "15px" }} className="mr-1" />
          </LightTooltip>
          <span>{record?.loanType}</span>
        </div>
      ),
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      render: (_: any, record: any) => (
        <>
          <span>BDT {record?.loanAmount}</span>
        </>
      ),
    },
    {
      title: "Installment",
      dataIndex: "numberOfInstallment",
      width: 30,
    },
    {
      title: "Approval",
      dataIndex: "applicationStatus",
      render: (_: any, rec: any) => (
        <div className="d-flex align-items-center justify-content-center">
          <div>
            {rec?.applicationStatus === "Approved" && (
              <Tag color="green">{rec?.applicationStatus}</Tag>
            )}
            {rec?.applicationStatus === "Pending" && (
              <Tag color="gold">{rec?.applicationStatus}</Tag>
            )}
            {rec?.applicationStatus === "Rejected" && (
              <Tag color="red">{rec?.applicationStatus}</Tag>
            )}
          </div>
        </div>
      ),
      width: 50,
    },
    {
      title: "Status",
      dataIndex: "installmentStatus",
      render: (_: any, rec: any) => (
        <div className="d-flex align-items-center justify-content-center">
          <div>
            {rec?.installmentStatus === "Completed" ? (
              <Tag color="green">{rec?.installmentStatus}</Tag>
            ) : rec?.installmentStatus === "Running" ? (
              <Tag color="gold">{rec?.installmentStatus}</Tag>
            ) : rec?.installmentStatus === "Not Started" ? (
              <Tag color="blue">{rec?.installmentStatus}</Tag>
            ) : rec?.installmentStatus === "deleted" ? (
              <Tag color="red">{rec?.installmentStatus}</Tag>
            ) : null}
          </div>
        </div>
      ),
      width: 50,
    },
  ];
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
          fromDate: moment(getDateOfYear("first")),
          toDate: moment(getDateOfYear("last")),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {loading && <Loading />}
          <PCardHeader
            backButton
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const values = form.getFieldsValue(true);
              const payload = {
                businessUnitId: buId,
                loanTypeId: 0,
                departmentIdList: formatFilterValueList(values?.department),
                designationIdList: formatFilterValueList(values?.designation),
                employeeId: 0,
                fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                toDate: moment(values?.todate).format("YYYY-MM-DD"),
                minimumAmount: 0,
                maximumAmount: 0,
                applicationStatus: "",
                installmentStatus: "",
                pageSize: 1000,
                pageNo: 1,
                ispaginated: false,
                searchText: "",
                workplaceGroupId: wgId,
                workplaceId: wId,
                WorkplaceGroupList:
                  values?.workplaceGroup?.value == 0 ||
                  values?.workplaceGroup?.value == undefined
                    ? decodedToken.workplaceGroupList
                    : values?.workplaceGroup?.value.toString(),
                WorkplaceList:
                  values?.workplace?.value == 0 ||
                  values?.workplace?.value == undefined
                    ? decodedToken.workplaceList
                    : values?.workplace?.value.toString(),
              };
              postPDFAction(
                "/PdfAndExcelReport/LoanReportAll",
                payload,
                setLoading
              );
            }}
          />
          <PFilter form={form} landingApiCall={landingApiCall} />
          <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onRow={(record: any) => ({
              onClick: () => {
                const values = form.getFieldsValue(true);
                getPDFAction(
                  `/PdfAndExcelReport/EmpLoanReportPdf?PartType=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${
                    values?.workplace?.value || wId
                  }&intLoanId=${record?.loanApplicationId}`,
                  setLoading
                );
              },
              className: "pointer",
            })}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);

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

export default EmLoanHistory;
