import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import { getTableDataInactiveEmployees } from "modules/employeeProfile/inactiveEmployees/helper";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getDateOfYear } from "utility/dateFormatter";
import { getPDFAction } from "utility/downloadFile";
import PFilter from "utility/filter/PFilter";
import { formatFilterValue } from "utility/filter/helper";
import Loading from "../../../../common/loading/Loading";
import { column } from "./helper";

const EmMovementHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wId, wgId, buName },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 101),
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
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
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
    document.title = "Movement Report";

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
      urlKey: "EmployeeMovementReportAll",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        IsXls: false,
        WorkplaceGroupId: wgId,
        WorkplaceId: wId,
        departments: formatFilterValue(values?.department),
        designations: formatFilterValue(values?.designation),
        PageNo: pagination.current || 1,
        PageSize: pagination!.pageSize! > 1 ? pagination?.pageSize : 25,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        SearchText: searchText || "",
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
      dataIndex: "workplaceGroupName",
      width: 100,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplaceName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 50,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      fixed: "left",
      width: 70,
    },

    {
      title: "Designation",
      dataIndex: "designationName",

      width: 70,
    },

    {
      title: "Department",
      dataIndex: "departmentName",

      width: 70,
    },
    {
      title: "Section",
      dataIndex: "sectionName",

      width: 70,
    },
    {
      title: "Duration (Day)",
      dataIndex: "rawDuration",
      //   render: (_: any, rec: any) => dateFormatter(rec?.JoiningDate),
      width: 100,
    },
    {
      title: "Reason",
      dataIndex: "reason",
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
          {(excelLoading || loading) && <Loading />}
          <PCardHeader
            backButton
            exportIcon={true}
            printIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  const newData = landingApi?.data?.data?.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                      };
                    }
                  );
                  createCommonExcelFile({
                    titleWithDate: `Movement Report ${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")} to ${moment(values?.toDate).format(
                      "YYYY-MM-DD"
                    )}`,
                    fromDate: "",
                    toDate: "",
                    buAddress: (buDetails as any)?.strAddress,
                    businessUnit: values?.workplaceGroup?.value
                      ? (buDetails as any)?.strWorkplace
                      : buName,
                    tableHeader: column,
                    getTableData: () =>
                      getTableDataInactiveEmployees(
                        newData,
                        Object.keys(column)
                      ),
                    getSubTableData: () => {},
                    subHeaderInfoArr: [],
                    subHeaderColumn: [],
                    tableFooter: [],
                    extraInfo: {},
                    tableHeadFontSize: 10,
                    widthList: {
                      C: 30,
                      D: 30,
                      E: 25,
                      F: 20,
                      G: 25,
                      H: 25,
                      I: 25,
                      K: 20,
                    },
                    commonCellRange: "A1:J1",
                    CellAlignment: "left",
                  });

                  setExcelLoading(false);
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                }
              };
              excelLanding();
            }}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              getPDFAction(
                `/PdfAndExcelReport/MovementReport?BusinessUnitId=${buId}&WorkplaceId=${wgId}&WorkplaceGroupId=${wId}&departments=${formatFilterValue(
                  values?.department
                )}&designations=${formatFilterValue(
                  values?.designation
                )}&FromDate=${moment(values?.fromDate).format(
                  "YYYY-MM-DD"
                )}&ToDate=${moment(values?.toDate).format(
                  "YYYY-MM-DD"
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
                }`,
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
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);

              landingApiCall({
                pagination,
                searchText: form.getFieldValue("search"),
              });
            }}
            // scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmMovementHistory;
