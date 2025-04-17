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

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Typography } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDateOfYear } from "utility/dateFormatter";
import {} from "react-icons/md";

// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
// import { debounce } from "lodash";

import { timeFormatter } from "utility/timeFormatter";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { todayDate } from "utility/todayDate";
import PFilter from "utility/filter/PFilter";
import { formatFilterValue } from "utility/filter/helper";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30380),
    []
  );
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
    document.title = "Early Out Report";
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
  const [, getExcelData, apiLoading] = useAxiosGet();

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
  }: // searchText = "",
  TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    // const workplaceList = `${values?.workplace
    //   ?.map((item: any) => item?.intWorkplaceId)
    //   .join(",")}`;
    landingApi.action({
      urlKey: "GetEarlyOutReport",
      method: "GET",
      params: {
        IntBusinessUnitId: buId,
        IsXls: false,
        IntWorkplaceGroupId: values?.workplaceGroup?.value,
        departments: formatFilterValue(values?.department),
        sections: formatFilterValue(values?.section),
        // IntWorkplaceId: values?.workplace?.value,
        WorkplaceList: values?.workplace?.value,
        PageNo: pagination.current || 1,
        PageSize: pagination.pageSize || 25,
        Date: moment(values?.fromDate).format("YYYY-MM-DD"),
        // SearchTxt: searchText,
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
      width: 35,
      align: "center",
    },

    // {
    //   title: "Work. Group/Location",
    //   dataIndex: "workplaceGroup",
    //   width: 120,
    //   fixed: "left",
    // },
    // {
    //   title: "Workplace/Concern",
    //   dataIndex: "workplace",
    //   width: 120,
    //   fixed: "left",
    // },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 70,
      fixed: "left",
    },

    {
      title: "Employee",
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
      title: "Calender Name",
      dataIndex: "calenderName",

      width: 100,
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
      render: (_: any, record: any) => timeFormatter(record?.outTime) || "N/A",

      width: 100,
    },
    {
      title: "Early Out (min)",
      dataIndex: "earlyOut",
      render: (_: any, record: any) => timeFormatter(record?.earlyOut) || "N/A",

      width: 100,
    },
  ];
  //   const searchFunc = debounce((value) => {
  //     landingApiCall({
  //       searchText: value,
  //     });
  //   }, 500);

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
          {(excelLoading || apiLoading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            // onSearch={(e) => {
            //   searchFunc(e?.target?.value);
            //   form.setFieldsValue({
            //     search: e?.target?.value,
            //   });
            // }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  const workplaceList = `${values?.workplace
                    ?.map((item: any) => item?.intWorkplaceId)
                    .join(",")}`;
                  const url = `/PdfAndExcelReport/DailyAttendanceReportPDF?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${
                    values?.workplaceGroup?.value
                  }&workplaceList=${workplaceList}&AttendanceDate=${moment(
                    values?.fromDate
                  ).format(
                    "YYYY-MM-DD"
                  )}&PageNo=1&PageSize=10000&ReportType=excel`;
                  downloadFile(
                    url,
                    `Attendance Report (${
                      values?.fromDate
                        ? moment(values.fromDate).format("YYYY-MM-DD")
                        : todayDate()
                    })`,
                    "xlsx",
                    setExcelLoading
                  );
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                  // console.log(error?.message);
                }
              };
              excelLanding();
            }}
            printIcon={true}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              // const list = landingApi?.data?.data?.map(
              //   (item: any) => item?.employeeId
              // );
              const pdfName = `Attendance Report (${
                values?.fromDate
                  ? moment(values.fromDate).format("YYYY-MM-DD")
                  : todayDate()
              }).pdf`;
              const workplaceList = `${values?.workplace
                ?.map((item: any) => item?.intWorkplaceId)
                .join(",")}`;
              getPDFAction(
                `/PdfAndExcelReport/DailyAttendanceReportPDF?ReportType=pdf&IntAccountId=${orgId}&AttendanceDate=${moment(
                  values?.fromDate
                ).format("YYYY-MM-DD")}${
                  buId ? `&IntBusinessUnitId=${buId}` : ""
                }${
                  values?.workplaceGroup?.value
                    ? `&IntWorkplaceGroupId=${values?.workplaceGroup?.value}`
                    : ""
                }${values?.workplace ? `&workplaceList=${workplaceList}` : ""}`,
                setLoading,
                pdfName
              );
            }}
          />
          {/* <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="Date"
                  placeholder="Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
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
          <PFilter
            form={form}
            landingApiCall={landingApiCall}
            isSection={true}
            ishideDate={true}
            showDesignation={"NO"}
          >
            <Col md={12} sm={12} xs={24}>
              <PInput
                type="date"
                name="fromDate"
                label="Date"
                placeholder="Date"
                onChange={(value) => {
                  form.setFieldsValue({
                    fromDate: value,
                  });
                }}
              />
            </Col>
          </PFilter>
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
                Total:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.totalEarlyOut || 0}
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
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AttendanceReport;
