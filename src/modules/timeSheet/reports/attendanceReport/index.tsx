/* eslint-disable @typescript-eslint/no-empty-function */
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
import { Col, Form, Row, Typography } from "antd";
import { getWorkplaceDetails } from "../../../../common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import {} from "react-icons/md";

// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";

import { getCurrentMonthName } from "utility/monthIdToMonthName";
import { currentYear } from "modules/CompensationBenefits/reports/salaryReport/helper";
import { column } from "./helper";
import { getTableDataInactiveEmployees } from "modules/employeeProfile/inactiveEmployees/helper";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30315),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
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
    document.title = "Attendance Report";
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

    const workplaceList = values?.workplace
      ?.map((item: any) => item?.intWorkplaceId)
      .join(",");

    landingApi.action({
      urlKey: "GetEmpAttendanceReport",
      method: "GET",
      params: {
        AccountId: orgId,
        IntBusinessUnitId: buId,
        IsXls: false,
        IsPaginated: true,

        IntWorkplaceGroupId: values?.workplaceGroup?.value,
        // IntWorkplaceId: values?.workplace?.value,
        WorkplaceList: workplaceList?.length > 0 ? `${workplaceList}` : "",
        PageNo: pagination.current || 1,
        PageSize: pagination.pageSize || 25,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        SearchTxt: searchText,
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
    getWorkplaceDetails(wId, setBuDetails);
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
      dataIndex: "workplaceGroup",
      width: 120,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplace",
      width: 120,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 70,
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
      width: 120,
    },

    {
      title: "Designation",
      dataIndex: "designation",

      width: 100,
    },

    {
      title: "Department",
      dataIndex: "department",

      width: 100,
    },
    {
      title: "Section",
      dataIndex: "section",

      width: 100,
    },
    {
      title: "Hr Position",
      dataIndex: "hrPosition",

      width: 100,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",

      width: 100,
    },
    {
      title: "Working Days",
      dataIndex: "workingDays",

      width: 100,
    },
    {
      title: "Present",
      dataIndex: "present",

      width: 100,
    },
    {
      title: "Absent",
      dataIndex: "absent",

      width: 100,
    },

    {
      title: "Late",
      dataIndex: "late",
      width: 80,
    },
    {
      title: "Movement",
      dataIndex: "movement",

      width: 100,
    },
    {
      title: "Casual Leave",
      dataIndex: "casualLeave",
      width: 80,
    },
    {
      title: "Sick Leave",
      dataIndex: "casualLeave",
      width: 80,
    },
    {
      title: "Earn Leave",
      dataIndex: "casualLeave",
      width: 80,
    },
    {
      title: "Medical Leave",
      dataIndex: "medicalLeave",
      width: 80,
    },
    {
      title: "Special Leave",
      dataIndex: "medicalLeave",
      width: 80,
    },
    {
      title: "Off Day",
      dataIndex: "weekend",
      width: 80,
    },
    {
      title: "Holiday",
      dataIndex: "holiday",
      width: 80,
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
    const daysInMonth = fromDateMoment.daysInMonth();
    const endDateMoment = fromDateMoment.clone().add(daysInMonth - 1, "days");

    // Disable dates before fromDate and after next30daysForEmp
    return (
      current &&
      (current < fromDateMoment.startOf("day") ||
        current > endDateMoment.endOf("day"))
    );
  };
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
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
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
                    titleWithDate: `Employees Attendance Report ${getCurrentMonthName()}-${currentYear()}`,
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
                      toDate: value,
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
                  mode="multiple"
                  maxTagCount={"responsive"}
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
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
          </PCardBody>
          <div
            style={{ marginLeft: "-7px" }}
            className=" d-flex justify-content-left align-items-center my-2"
          >
            <div className="d-flex align-items-center">
              <Typography.Title
                level={5}
                style={{ marginLeft: "10px", fontSize: "12px" }}
              >
                {" "}
                Present:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.presentCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Absent:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.absentCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center ">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Late:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.lateCount || 0}
              </Typography.Title>
            </div>
          </div>
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

export default AttendanceReport;
