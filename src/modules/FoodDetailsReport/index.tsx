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
import { getSerial } from "Utils";
import { Col, Form, Row, Tag } from "antd";
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
import { dateFormatter } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import { debounce } from "lodash";
import { isDevServer } from "App";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getTableDataDailyAttendance } from "modules/timeSheet/reports/lateReport/helper";

const FoodDetailsReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 145),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const placeApi = useApiRequest({});
  const [tableKey, setTableKey] = useState(0);

  const [filterList, setFilterList] = useState([]);
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Food  Details Report ";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  // const getWorkplaceGroup = () => {
  //   workplaceGroup?.action({
  //     urlKey: "WorkplaceGroupWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: wgId,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplaceGroup;
  //         res[i].value = item?.intWorkplaceGroupId;
  //       });
  //     },
  //   });
  // };

  // const getWorkplace = () => {
  //   const { workplaceGroup } = form.getFieldsValue(true);
  //   workplace?.action({
  //     urlKey: "WorkplaceWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: workplaceGroup?.value,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res: any) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplace;
  //         res[i].value = item?.intWorkplaceId;
  //       });
  //     },
  //   });
  // };

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
    // const payload = {
    //   businessUnitId: buId,
    //   workplaceGroupId: values?.workplaceGroup?.value || 0,

    //   workplaceId: values?.workplace?.value || 0,
    //   pageNo: pagination?.current,
    //   pageSize: pagination?.pageSize,
    //   isPaginated: true,
    //   isHeaderNeed: true,
    //   searchTxt: searchText || "",
    //   fromDate: values?.fromDate
    //     ? moment(values?.fromDate).format("YYYY-MM-DD")
    //     : null,
    //   toDate: values?.toDate
    //     ? moment(values?.toDate).format("YYYY-MM-DD")
    //     : null,

    //   strDepartmentList: filerList?.strDepartment || [],
    //   strWorkplaceGroupList: filerList?.strWorkplaceGroup || [],
    //   strWorkplaceList: filerList?.strWorkplace || [],
    //   strLinemanagerList: filerList?.strLinemanager || [],
    //   strEmploymentTypeList: filerList?.strEmploymentType || [],
    //   strSupervisorNameList: filerList?.strSupervisorName || [],
    //   strDottedSupervisorNameList: filerList?.strDottedSupervisorName || [],
    //   strDivisionList: filerList?.strDivision || [],
    //   strPayrollGroupList: filerList?.strPayrollGroup || [],
    //   strDesignationList: filerList?.strDesignation || [],
    //   strHrPositionList: filerList?.strHrPosition || [],
    //   strBankList: filerList?.strBank || [],
    //   strSectionList: filerList?.strSection || [],
    //   //   unnecesary
    //   wingNameList: [],
    //   soleDepoNameList: [],
    //   regionNameList: [],
    //   areaNameList: [],
    //   territoryNameList: [],
    // };

    const dailyParams = {
      accountId: orgId,
      mealDate: values?.fromDate
        ? moment(values?.fromDate).format("YYYY-MM-DD")
        : todayDate(),
      isDownload: false,
      MealConsumePlaceId: values?.place || 0,
    };
    const monthlyParams = {
      PartId: 1,
      FromDate: values?.fromDate
        ? moment(values?.fromDate).format("YYYY-MM-DD")
        : todayDate(),
      ToDate: values?.toDate
        ? moment(values?.toDate).format("YYYY-MM-DD")
        : todayDate(),
      ReportType: 0,
      LoginBy: 0,
      BusinessUnitId: buId,
      MealConsumePlaceId: values?.place || 0,
    };
    landingApi.action({
      urlKey:
        values?.reportType === 1
          ? "GetDailyCafeteriaReport"
          : "GetCafeteriaReportALL",
      method: "get",
      //   payload: payload,

      params: values?.reportType === 1 ? dailyParams : monthlyParams,
    });
  };
  //   const placeDDL = () => {
  //     // const values = form.getFieldsValue(true);

  //     placeApi.action({
  //       urlKey: "PeopleDeskAllDDL",
  //       method: "get",
  //       //   payload: payload,
  //       params: {
  //         DDLType: "mealConsume",
  //         AccountId: orgId,
  //         intId: 0,
  //         BusinessUnitId: buId,
  //         WorkplaceGroupId: wgId,
  //       },
  //       onSuccess: (res) => {
  //         res?.push({ value: 0, label: "All" });
  //       },
  //     });
  //   };

  useEffect(() => {
    // getWorkplaceGroup();
    landingApiCall();
    // placeDDL();
  }, [wgId]);
  const header: any = () => {
    const { reportType } = form.getFieldsValue(true);
    return [
      {
        title: "SL",
        //   render: (_: any, rec: any, index: number) =>
        //     getSerial({
        //       currentPage: landingApi?.data?.currentPage,
        //       pageSize: landingApi?.data?.pageSize,
        //       index,
        //     }),

        fixed: "left",
        render: (_: any, rec: any, index: number) => index + 1,
        width: 35,
        align: "center",
      },

      {
        title: "Workplace Group",
        dataIndex: "workPlaceGroupName",
        width: 150,
        fixed: "left",
        sorter: true,
        filter: true,
        hidden: reportType === 2 ? true : false,
      },
      {
        title: "Workplace Group",
        dataIndex: "strWorkplaceGroup",
        width: 150,
        fixed: "left",
        sorter: true,
        filter: true,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Workplace",
        dataIndex: "strWorkplace",
        width: 150,
        fixed: "left",
        sorter: true,
        filter: true,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Workplace",
        dataIndex: "workPlaceName",
        width: 150,
        fixed: "left",
        sorter: true,
        filter: true,
        hidden: reportType === 2 ? true : false,
      },
      {
        title: "Employee Code",
        dataIndex: "employeeCode",
        width: 150,
        fixed: "left",
      },
      {
        title: "Employee Name",
        dataIndex: "employeeFullName",
        render: (_: any, rec: any) => {
          return (
            <div className="d-flex align-items-center">
              <Avatar title={rec?.employeeFullName} />
              <span className="ml-2">{rec?.employeeFullName}</span>
            </div>
          );
        },
        width: 150,
        fixed: "left",
      },

      {
        title: "Designation",
        dataIndex: "designationName",
        sorter: true,
        filter: true,
        //   filterKey: "strDesignationList",
        //   filterSearch: true,
        width: 150,
      },
      //   {
      //     title: "Business Unit",
      //     dataIndex: "businessUnitName",
      //     //   sorter: true,
      //     //   filter: true,
      //     //   filterKey: "strDivisionList",
      //     //   filterSearch: true,
      //     width: 150,
      //     hidden: reportType === 2 ? true : false,
      //   },
      {
        title: "Department",
        dataIndex: "departmentName",
        sorter: true,
        filter: true,
        //   filterKey: "strDepartmentList",
        //   filterSearch: true,
        width: 150,
      },
      {
        title: "Meal Type",
        dataIndex: "MealTypeName",
        sorter: true,
        filter: true,
        //   filterKey: "strDepartmentList",
        //   filterSearch: true,
        width: 150,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Meal Count",
        dataIndex: "mealCount",
        // sorter: true,
        // filter: true,
        //   filterKey: "strSectionList",
        //   filterSearch: true,
        width: 150,
        hidden: reportType === 2 ? true : false,
      },
      {
        title: "Meal Date",
        dataIndex: "mealDate",
        // sorter: true,
        // filter: true,
        hidden: reportType === 2 ? true : false,

        //   filterKey: "strHrPositionList",
        //   filterSearch: true,
        width: 150,
      },
      //   {
      //     title: "Consumption Place",
      //     dataIndex: "mealConsumePlaceName",
      //     sorter: true,
      //     filter: true,
      //     hidden: reportType === 2 ? true : false,
      //     //   filterKey: "strEmploymentTypeList",
      //     //   filterSearch: true,
      //     width: 180,
      //   },
      //   {
      //     title: "Consume Place",
      //     dataIndex: "MealConsumePlace",
      //     sorter: true,
      //     filter: true,
      //     width: 150,
      //     hidden: reportType === 2 ? true : false,
      //   },
      {
        title: "Own Meal",
        dataIndex: "own_Meal_Count",
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Guest Meal",
        dataIndex: "guest_Meal_Count",
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Guest Own Contribution (BDT)",
        dataIndex: "Guest_Own_Contribution",
        // sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: " Guest Company Contribution (BDT)",
        dataIndex: "Guest_Company_Contribution",
        // sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },

      {
        title: "Total Guest Bill (BDT)",
        dataIndex: "Total_Guest_Bill",
        // sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },

      {
        title: "Total Meal",
        dataIndex: "total_Meal_Count",
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Rate",
        dataIndex: "rate",
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },

      {
        title: "Own Bill (BDT)",
        dataIndex: "own_contribution_Bill",
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      {
        title: "Company Contribution (BDT)",
        dataIndex: "company_contribution_Bill",
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      //   {
      //     title: "Guest Bill (BDT)",
      //     dataIndex: "guestTk",
      //     sorter: true,
      //     width: 100,
      //     hidden: reportType === 1 ? true : false,
      //   },aa
      {
        title: "Total Bill (BDT)",
        // dataIndex: "totalTk",
        render: (_: any, rec: any, index: number) =>
          rec?.company_contribution_Bill +
          rec?.own_contribution_Bill +
          rec?.Total_Guest_Bill,
        sorter: true,
        width: 100,
        hidden: reportType === 1 ? true : false,
      },
      // {
      //   title: "Date of Joining",
      //   dataIndex: "dateOfJoining",
      //   render: (_: any, rec: any) => dateFormatter(rec?.dateOfJoining),
      //   width: 120,
      // },

      // {
      //   title: "Status",

      //   render: (_: any, rec: any) => {
      //     return (
      //       <div>
      //         {rec?.empStatus === "Active" ? (
      //           <Tag color="green">{rec?.empStatus}</Tag>
      //         ) : rec?.empStatus === "Inactive" ? (
      //           <Tag color="red">{rec?.empStatus}</Tag>
      //         ) : null}
      //       </div>
      //     );
      //   },

      //   width: 100,
      // },
    ].filter((i) => !i?.hidden);
  };

  const dailyMealColumns = {
    sl: "SL",
    workPlaceGroupName: "WorkPlace Group",
    workPlaceName: "WorkPlace",
    employeeCode: "Employee Code",
    employeeFullName: "Employee Name",
    designationName: "Designation",
    // businessUnitName: "Business Unit",
    departmentName: "Department",
    mealCount: "Meal Count",
    mealDate: "Meal Date",
    // mealConsumePlaceName: "Consumption Place",
  };
  const monthlyMealColumns = {
    sl: "SL",
    strWorkplaceGroup: "Workplace Group",
    strWorkplace: "Workplace",
    employeeCode: "Employee Code",
    employeeFullName: "Employee Name",
    designationName: "Designation",
    departmentName: "Department",
    MealTypeName: "Meal Type",
    own_Meal_Count: "Own Meal",
    guest_Meal_Count: "Guest Meal",
    Guest_Own_Contribution: "Guest Own Contribution",
    Guest_Company_Contribution: "Guest Company Contribution",
    Total_Guest_Bill: "Total Guest Bill",
    total_Meal_Count: "Total Meal",
    rate: "Rate",
    own_contribution_Bill: "Own Bill (BDT)",
    company_contribution_Bill: "Company Contribution (BDT)",
    total: "Total Bill (BDT)",
  };
  //   const searchFunc = debounce((value) => {
  //     landingApiCall({
  //       filerList: filterList,
  //       searchText: value,
  //     });
  //   }, 500);
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
          reportType: 1,
          fromDate: moment(todayDate()),
        }}
        onFinish={() => {
          landingApiCall();
          setTableKey((prev) => prev + 1);
          setFilterList([]);
          //     {
          //     pagination: {
          //       current: landingApi?.data?.page,
          //       pageSize: landingApi?.data?.totalCount,
          //     },
          //   }
        }}
      >
        <PCard>
          {landingApi?.loading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total meal ${
              filterList?.length > 0
                ? filterList?.reduce(
                    (acc: any, item: any) =>
                      acc + +item?.mealCount || acc + +item?.total_Meal_Count,
                    0
                  )
                : landingApi?.data?.length > 0
                ? landingApi?.data?.reduce(
                    (acc: any, item: any) =>
                      acc + +item?.mealCount || acc + +item?.total_Meal_Count,
                    0
                  )
                : 0
            } `}
            // onSearch={(e) => {
            //   searchFunc(e?.target?.value);
            //   form.setFieldsValue({
            //     search: e?.target?.value,
            //   });
            // }}
            onExport={() => {
              // e.stopPropagation();
              const values = form.getFieldsValue(true);
              const excelLanding = async () => {
                const tempData =
                  filterList?.length > 0 ? filterList : landingApi?.data;

                try {
                  if (tempData?.length > 0) {
                    const newData = tempData?.map((item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                        total:
                          item?.company_contribution_Bill +
                          item?.own_contribution_Bill +
                          item?.Total_Guest_Bill,
                      };
                    });
                    // const date = todayDate();

                    createCommonExcelFile({
                      titleWithDate: `${
                        values?.reportType === 1
                          ? "Daily Cafeteria Details Report"
                          : "Monthly Cafeteria Details Report"
                      } ${moment(values?.fromDate).format("YYYY-MM-DD")} `,
                      fromDate: "",
                      toDate: "",
                      buAddress: "",
                      businessUnit: buName,
                      tableHeader:
                        values?.reportType === 1
                          ? dailyMealColumns
                          : monthlyMealColumns,
                      getTableData: () =>
                        getTableDataDailyAttendance(
                          newData,
                          Object.keys(
                            values?.reportType === 1
                              ? dailyMealColumns
                              : monthlyMealColumns
                          )
                        ),
                      getSubTableData: () => {},
                      subHeaderInfoArr: [],
                      subHeaderColumn: [],
                      tableFooter: [],
                      extraInfo: {},
                      tableHeadFontSize: 10,
                      widthList: {
                        B: 30,
                        C: 30,
                        D: 15,
                        E: 25,
                        F: 20,
                        G: 25,
                        H: 15,
                        I: 15,
                        J: 20,
                        K: 20,
                      },
                      commonCellRange: "A1:J1",
                      CellAlignment: "left",
                    });
                  } else {
                    toast.warn("Empty Employee Data");
                  }
                } catch (error) {
                  isDevServer && console.log(error);
                  toast.warn("Failed to download excel");
                }
              };
              excelLanding();
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={[
                    { value: 1, label: "Daily" },
                    { value: 2, label: "Monthly" },
                  ]}
                  name="reportType"
                  label="Report type"
                  placeholder="Report type"
                  //   disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      reportType: value,

                      //   workplace: undefined,
                    });
                  }}
                  rules={
                    [
                      //   { required: true, message: "Workplace Group is required" },
                    ]
                  }
                />
              </Col>
              {/* <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={placeApi?.data || []}
                  name="place"
                  label="Place"
                  placeholder="Place"
                  //   disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      place: value,

                      //   workplace: undefined,
                    });
                  }}
                  rules={
                    [
                      //   { required: true, message: "Workplace Group is required" },
                    ]
                  }
                />
              </Col> */}
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { reportType } = form.getFieldsValue(true);
                  return (
                    <>
                      <Col md={5} sm={12} xs={24}>
                        <PInput
                          type="date"
                          name="fromDate"
                          label={`${reportType === 1 ? "Date" : "From Date"}`}
                          placeholder={`${
                            reportType === 1 ? "Date" : "From Date"
                          }`}
                          //   rules={[
                          //     {
                          //       required: true,
                          //       message: "from Date is required",
                          //     },
                          //   ]}
                          onChange={(value) => {
                            form.setFieldsValue({
                              fromDate: value,
                            });
                          }}
                        />
                      </Col>
                      {reportType !== 1 && (
                        <Col md={5} sm={12} xs={24}>
                          <PInput
                            type="date"
                            name="toDate"
                            label="To Date"
                            placeholder="To Date"
                            disabledDate={disabledDate}
                            //   rules={[
                            //     {
                            //       required: true,
                            //       message: "To Date is required",
                            //     },
                            //   ]}
                            onChange={(value) => {
                              form.setFieldsValue({
                                toDate: value,
                              });
                            }}
                          />
                        </Col>
                      )}
                    </>
                  );
                }}
              </Form.Item>

              {/* <Col md={5} sm={12} xs={24}>
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
              </Col> */}

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
            key={tableKey}
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header()}
            // pagination={{
            //   pageSize: landingApi?.data?.pageSize,
            //   total: landingApi?.data?.totalCount,
            // }}
            // filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(extra?.currentDataSource);
              console.log({ extra });
              //   landingApiCall({
              //     pagination,
              //     filerList: filters,
              //   });
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

export default FoodDetailsReport;
