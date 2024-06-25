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
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";

import { column, getTableDataDailyAttendance } from "./helper";
import { timeFormatter } from "utility/timeFormatter";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getPDFAction } from "utility/downloadFile";

const LateReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30384),
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
    document.title = "Late Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
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
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
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

    landingApi.action({
      urlKey: "GetLateReport",
      method: "GET",
      params: {
        IntBusinessUnitId: buId,
        IsXls: false,
        IntWorkplaceGroupId: values?.workplaceGroup?.value,
        IntWorkplaceId: values?.workplace?.value,
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
      title: "In Time",
      dataIndex: "intime",
      render: (_: any, record: any) => timeFormatter(record?.intime) || "N/A",

      width: 100,
    },
    {
      title: "Late (mins)",
      dataIndex: "late",
      //   render: (_: any, record: any) => timeFormatter(record?.earlyOut) || "N/A",

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
                  getExcelData(
                    `/TimeSheetReport/GetLateReport?IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${
                      values?.workplaceGroup?.value
                    }&IntWorkplaceId=${values?.workplace?.value}&Date=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&IsXls=true&PageNo=1&PageSize=10000`,

                    (res: any) => {
                      const newData = res?.data?.map(
                        (item: any, index: any) => {
                          return {
                            ...item,
                            sl: index + 1,
                            intime: timeFormatter(item?.intime) || "N/A",
                          };
                        }
                      );
                      createCommonExcelFile({
                        titleWithDate: `Late Report for ${moment(
                          values?.fromDate
                        ).format("YYYY-MM-DD")} }`,
                        fromDate: "",
                        toDate: "",
                        buAddress: (buDetails as any)?.strAddress,
                        businessUnit: values?.workplaceGroup?.value
                          ? (buDetails as any)?.strWorkplace
                          : buName,
                        tableHeader: column,
                        getTableData: () =>
                          getTableDataDailyAttendance(
                            newData,
                            Object.keys(column)
                          ),
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
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
                    }
                  );
                  setExcelLoading(false);
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
              const list = landingApi?.data?.data?.map(
                (item: any) => item?.employeeId
              );
              getPDFAction(
                `/PdfAndExcelReport/DailyAttendanceReportPDF?IntAccountId=${orgId}&AttendanceDate=${moment(
                  values?.fromDate
                )?.format("YYYY-MM-DD")}${
                  buId ? `&IntBusinessUnitId=${buId}` : ""
                }${
                  values?.workplaceGroup?.value
                    ? `&IntWorkplaceGroupId=${values?.workplaceGroup?.value}`
                    : ""
                }${
                  landingApi?.data?.data?.length !==
                  landingApi?.data?.totalCount
                    ? `&EmployeeIdList=${list}`
                    : ""
                }${
                  values?.workplace?.value
                    ? `&IntWorkplaceId=${values?.workplace?.value}`
                    : ""
                }`,
                setLoading
              );
            }}
          />
          <PCardBody className="mb-3">
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
                {landingApi?.data?.totalLate || 0}
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

export default LateReport;
