import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { yearDDLAction } from "utility/yearDDL";
import { todayDate } from "utility/todayDate";

const EmLeaveHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 100),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const [data, setData] = useState("");

  // const [, getExcelData, apiLoading] = useAxiosGet();

  // const [, setFilterList] = useState({});
  // const [buDetails, setBuDetails] = useState({});
  // const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [pages] = useState({
  //   current: 1,
  //   pageSize: paginationSize,
  //   total: 0,
  // });

  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Leave History";
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

  // type TLandingApi = {
  //   pagination?: {
  //     current?: number;
  //     pageSize?: number;
  //   };
  //   filerList?: any;
  //   searchText?: string;
  //   excelDownload?: boolean;
  //   IsForXl?: boolean;
  //   date?: string;
  // };
  const landingApiCall = (searchText = "") =>
    //   {
    //   pagination = { current: 1, pageSize: paginationSize },
    //   searchText = "",
    // }: TLandingApi = {}
    {
      const values = form.getFieldsValue(true);

      // const workplaceList = `${values?.workplace
      //   ?.map((item: any) => item?.intWorkplaceId)
      //   .join(",")}`;
      const workplaceList = values?.workplace
        ?.map((item: any) => item?.intWorkplaceId)
        .join(",");
      landingApi.action({
        urlKey: "GetLeaveHistoryReport",
        method: "GET",
        params: {
          strPartName: "htmlView",
          intAccountId: orgId,
          intYear: values?.yearDDL?.value,
          strWorkplaceGroupList: values?.workplaceGroup?.value,
          strWorkplaceList: `${workplaceList}` || "",
          strSearchTxt: searchText || "",
          BusinessUnitId: buId,
        },
        onSuccess: (res) => {
          setData(res);
        },
      });
    };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);

  // const header: any = [
  //   {
  //     title: "SL",
  //     render: (_: any, rec: any, index: number) =>
  //       (pages?.current - 1) * pages?.pageSize + index + 1,
  //     fixed: "left",
  //     width: 35,
  //     align: "center",
  //   },
  //   {
  //     title: "Work. Group/Location",
  //     dataIndex: "workplaceGroup",
  //     width: 55,
  //     fixed: "left",
  //   },
  //   {
  //     title: "Workplace/Concern",
  //     dataIndex: "workplace",
  //     width: 55,
  //     fixed: "left",
  //   },
  //   {
  //     title: "Employee Id",
  //     dataIndex: "employeeCode",
  //     width: 35,
  //     fixed: "left",
  //   },

  //   {
  //     title: "Employee Name",
  //     dataIndex: "employee",
  //     render: (_: any, rec: any) => {
  //       return (
  //         <div className="d-flex align-items-center">
  //           <Avatar title={rec?.employee} />
  //           <span className="ml-2">{rec?.employee}</span>
  //         </div>
  //       );
  //     },
  //     fixed: "left",
  //     width: 60,
  //   },

  //   {
  //     title: "Designation",
  //     dataIndex: "designation",

  //     width: 70,
  //   },

  //   {
  //     title: "Department",
  //     dataIndex: "department",

  //     width: 70,
  //   },
  //   {
  //     title: "Section",
  //     dataIndex: "section",

  //     width: 70,
  //   },

  //   {
  //     title: "CL",
  //     dataIndex: "clTaken",
  //     render: (_: any, rec: any) => (
  //       <span>
  //         {rec?.clTaken || 0}/{rec?.clBalance || 0}
  //       </span>
  //     ),
  //     width: 30,
  //   },
  //   {
  //     title: "SL",
  //     dataIndex: "slTaken",
  //     render: (_: any, rec: any) => (
  //       <span>
  //         {rec?.slTaken || 0}/{rec?.slBalance || 0}
  //       </span>
  //     ),
  //     width: 30,
  //   },
  //   {
  //     title: "EL",
  //     dataIndex: "elTaken",
  //     render: (_: any, rec: any) => (
  //       <span>
  //         {rec?.elTaken || 0}/{rec?.elBalance || 0}
  //       </span>
  //     ),
  //     width: 30,
  //   },
  //   {
  //     title: "LWP",
  //     dataIndex: "lwpTaken",
  //     render: (_: any, rec: any) => (
  //       <span>
  //         {rec?.lwpTaken || 0}/{rec?.lwpBalance || 0}
  //       </span>
  //     ),
  //     width: 30,
  //   },
  //   {
  //     title: "ML",
  //     dataIndex: "CL",
  //     render: (_: any, rec: any) => (
  //       <span>
  //         {rec?.mlTaken || 0}/{rec?.mlBalance || 0}
  //       </span>
  //     ),
  //     width: 30,
  //   },
  // ];
  const searchFunc = debounce((value) => {
    landingApiCall(value);
  }, 500);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            backButton
            // exportIcon={true}
            title={`Leave History`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            // onExport={() => {
            //   const excelLanding = async () => {
            //     setExcelLoading(true);
            //     try {
            //       const values = form.getFieldsValue(true);
            //       getExcelData(
            //         `/Employee/LeaveBalanceHistoryForAllEmployee?BusinessUnitId=${buId}&yearId=${values.yearDDL?.value}&WorkplaceGroupId=${values?.workplaceGroup?.value}&WorkplaceId=${values?.workplace?.value}&IsPaginated=false&PageNo=0&PageSize=0`,
            //         (res: any) => {
            //           const newData = res?.data?.map(
            //             (item: any, index: any) => {
            //               return {
            //                 ...item,
            //                 sl: index + 1,
            //                 clTaken: `${item?.clTaken || 0}/${
            //                   item?.clBalance || 0
            //                 }`,
            //                 slTaken: `${item?.slTaken || 0}/${
            //                   item?.slBalance || 0
            //                 }`,
            //                 elTaken: `${item?.elTaken || 0}/${
            //                   item?.elBalance || 0
            //                 }`,
            //                 LWP: `${item?.lwpTaken || 0}/${
            //                   item?.lwpBalance || 0
            //                 }`,
            //                 ML: `${item?.mlTaken || 0}/${item?.mlBalance || 0}`,
            //               };
            //             }
            //           );
            //           createCommonExcelFile({
            //             titleWithDate: `Leave History Report for the month of ${getCurrentMonthName()}-${currentYear()}`,
            //             fromDate: "",
            //             toDate: "",
            //             buAddress: (buDetails as any)?.strAddress,
            //             businessUnit: values?.workplaceGroup?.value
            //               ? (buDetails as any)?.strWorkplace
            //               : buName,
            //             tableHeader: column,
            //             getTableData: () =>
            //               getTableDataInactiveEmployees(
            //                 newData,
            //                 Object.keys(column)
            //               ),
            //             getSubTableData: () => {},
            //             subHeaderInfoArr: [],
            //             subHeaderColumn: [],
            //             tableFooter: [],
            //             extraInfo: {},
            //             tableHeadFontSize: 10,
            //             widthList: {
            //               C: 30,
            //               D: 15,
            //               E: 25,
            //               F: 20,
            //               G: 25,
            //               H: 25,
            //               I: 25,
            //               K: 20,
            //             },
            //             commonCellRange: "A1:J1",
            //             CellAlignment: "left",
            //           });
            //         }
            //       );

            //       setExcelLoading(false);
            //     } catch (error: any) {
            //       toast.error("Failed to download excel");
            //       setExcelLoading(false);
            //       // console.log(error?.message);
            //     }
            //   };
            //   excelLanding();
            // }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={yearDDLAction(2, 0) || []}
                  name="yearDDL"
                  label="Year"
                  placeholder="Year"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      yearDDL: op,
                    });
                  }}
                  rules={[{ required: true, message: "Year is required" }]}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={[
                    { required: true, message: "Workplace Group is required" },
                  ]}
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
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    // getWorkplaceDetails(value, setBuDetails);
                  }}
                  rules={[{ required: true, message: "Workplace is required" }]}
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
          <div>
            {data && (
              <ul className="d-flex flex-row-reverse mt-3 align-items-center justify-content-start">
                <li className="pr-2 ml-2">
                  <Tooltip title="Download as Excel">
                    <button
                      className="btn-save"
                      type="button"
                      onClick={(e) => {
                        const values = form.getFieldsValue(true);
                        e.stopPropagation();
                        const workplaceList = values?.workplace?.map(
                          (i: any) => i?.value
                        );

                        const url = `/PdfAndExcelReport/GetLeaveHistoryReport?strPartName=excelView&intAccountId=${orgId}&intYear=${
                          values?.yearDDL?.value
                        }&strWorkplaceGroupList=${
                          values?.workplaceGroup?.value
                        }&strWorkplaceList=${workplaceList}&strSearchTxt=${
                          values?.search || ""
                        }`;

                        downloadFile(
                          url,
                          `Monthly Leave History- ${todayDate()}`,
                          "xlsx",
                          setLoading
                        );
                      }}
                      style={{
                        border: "transparent",
                        width: "30px",
                        height: "30px",
                        background: "#f2f2f7",
                        borderRadius: "100px",
                      }}
                    >
                      <DownloadIcon
                        sx={{
                          color: "#101828",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip title="Print as PDF">
                    <button
                      className="btn-save"
                      type="button"
                      onClick={(e) => {
                        const values = form.getFieldsValue(true);
                        e.stopPropagation();
                        const workplaceList = values?.workplace?.map(
                          (i: any) => i?.value
                        );
                        const url = `/PdfAndExcelReport/GetLeaveHistoryReport?strPartName=pdfView&intAccountId=${orgId}&intYear=${
                          values?.yearDDL?.value
                        }&strWorkplaceGroupList=${
                          values?.workplaceGroup?.value
                        }&strWorkplaceList=${workplaceList}&strSearchTxt=${
                          values?.search || ""
                        }`;

                        getPDFAction(url, setLoading);
                      }}
                      // disabled={resDetailsReport?.length <= 0}
                      style={{
                        border: "transparent",
                        width: "30px",
                        height: "30px",
                        background: "#f2f2f7",
                        borderRadius: "100px",
                      }}
                    >
                      <LocalPrintshopIcon
                        sx={{
                          color: "#101828",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </li>
              </ul>
            )}
          </div>

          <div
            style={{ overflow: "scroll", marginTop: "-35px" }}
            className=" w-100"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: data,
              }}
            />
          </div>

          {/* <DataTable
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
                hasLeave(record) &&
                  getPDFAction(
                    `/PdfAndExcelReport/LeaveHistoryReport?EmployeeId=${record?.employeeId}&fromDate=${values?.yearDDL?.value}-01-01&toDate=${values?.yearDDL?.value}-12-31`,
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
              });
            }}
            scroll={{ x: 2000 }}
          /> */}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmLeaveHistory;
