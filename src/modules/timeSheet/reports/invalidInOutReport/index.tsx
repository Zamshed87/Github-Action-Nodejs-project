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
import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";

const MgmtInOutReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wId, wgId, employeeId, orgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30341),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});

  const [filterList, setFilterList] = useState({});
  const [pages, setPages] = useState({
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
    document.title = "Invalid In/Out Report";
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
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    // /TimeSheetReport/TimeManagementDynamicPIVOTReport?
    landingApi.action({
      urlKey: "TimeManagementDynamicPIVOTReport",
      method: "GET",
      params: {
        reportType: "InvalidInOutAttendanceData",
        accountId: orgId,
        businessUnitId: buId,
        isHeaderNeed: true,
        workplaceGroupId: values?.workplaceGroup?.value || wgId,
        WorkplaceList: values?.workplace?.value || wId,
        pageNo: pagination.current || pages?.current,
        pageSize: pagination.pageSize || pages?.pageSize,
        isPaginated: true,
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        searchTxt: searchText || "",
        departments:
          filerList?.department?.length > 0 ? `${filerList?.department}` : "",
        designations:
          filerList?.designation?.length > 0 ? `${filerList?.designation}` : "",
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      fixed: "left",
      width: 15,
      align: "center",
    },

    {
      title: "Employee Id",
      dataIndex: "employeeId",
      width: 30,
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
      dataIndex: "designation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
      width: 50,
    },

    {
      title: "Date",
      dataIndex: "attendanceDate",
      render: (_: any, rec: any) => dateFormatter(rec?.attendanceDate),
      width: 30,
    },

    {
      title: "Attendance Time",
      dataIndex: "attendanceTime",
      width: 30,
    },
    {
      title: "Attendance Source",
      dataIndex: "attendanceSource",
      width: 50,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
      filerList: filterList,
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
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: pages?.current,
              pageSize: landingApi?.data[0]?.totalCount,
            },
          });
        }}
      >
        <PCard>
          <PCardHeader
            // exportIcon={true}
            title={`Invalid In/Out Report`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            // onExport={() => {}}
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
                  // disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={
                    [
                      // { required: true, message: "Workplace Group is required" },
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
                  // disabled={+id ? true : false}
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

          <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: pages?.pageSize,
              total: landingApi?.data?.data?.[0]?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              const values = form.getFieldsValue(true);
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
                filerList: filters,
                searchText: values?.search,
              });
            }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MgmtInOutReport;
