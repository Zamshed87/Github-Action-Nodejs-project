import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";

import { getTableDataInactiveEmployees } from "modules/employeeProfile/inactiveEmployees/helper";
import { column } from "./helper";
import { getDateOfYear } from "utility/dateFormatter";
import { getPDFAction } from "utility/downloadFile";
import PFilter from "utility/filter/PFilter";
import { formatFilterValue } from "utility/filter/helper";

const EmMovementHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wId, wgId, employeeId, buName },
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

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Movement Report";

    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "WorkplaceWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        empId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

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
        ToDate: moment(values?.todate).format("YYYY-MM-DD"),
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
      width: 50,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplaceName",
      width: 50,
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
      width: 30,
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
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
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
                  // console.log(error?.message);
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
                )}&ToDate=${moment(values?.todate).format(
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
          {/* <PCardBody className="mb-3">
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
                  disabledDate={disabledDate}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={
                    [
                      //   { required: true, message: "Workplace Group is required" },
                    ]
                  }
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
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
          </PCardBody> */}
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
