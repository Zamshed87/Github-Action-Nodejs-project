import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { todayDate } from "utility/todayDate";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { downloadFile, getPDFAction } from "utility/downloadFile";

const FinalSettlementReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30509),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [data, setData] = useState("");

  //   const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const CommonEmployeeDDL = useApiRequest([]);

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Final Settlement Report";
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
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
  }, []);
  // const header = [
  //   { title: "SL", dataIndex: "sl", width: 50, align: "center", fixed: "left" },
  //   {
  //     title: "Workplace Group",
  //     dataIndex: "workplaceGroup",
  //     filter: true,
  //     width: 150,
  //   },
  //   { title: "Workplace", dataIndex: "workplace", filter: true, width: 150 },
  //   {
  //     title: "Employee Name",
  //     dataIndex: "employeeName",
  //     filter: true,
  //     width: 150,
  //   },
  //   { title: "Employee Code", dataIndex: "employeeCode", width: 150 },
  //   {
  //     title: "Designation",
  //     dataIndex: "designation",
  //     filter: true,
  //     width: 150,
  //   },
  //   { title: "Department", dataIndex: "department", filter: true, width: 150 },
  //   { title: "Section", dataIndex: "section", filter: true, width: 150 },
  //   { title: "HR Position", dataIndex: "hrPosition", filter: true, width: 150 },
  //   {
  //     title: "Employment Type",
  //     dataIndex: "employmentType",
  //     filter: true,
  //     width: 150,
  //   },
  //   { title: "Joining Date", dataIndex: "joiningDate", width: 150 },
  //   { title: "Service Length", dataIndex: "serviceLength", width: 150 },
  //   { title: "Salary Type", dataIndex: "salaryType", width: 150 },
  //   { title: "Payroll Group", dataIndex: "payrollGroup", width: 150 },
  //   { title: "Gross Salary", dataIndex: "grossSalary", width: 150 },
  //   { title: "Basic", dataIndex: "basic", width: 100 },
  //   { title: "House", dataIndex: "house", width: 100 },
  //   { title: "Medical", dataIndex: "medical", width: 100 },
  //   { title: "Transport / Conveyance", dataIndex: "transport", width: 150 },
  //   { title: "Remaining Loan Amount", dataIndex: "remainingLoan", width: 150 },
  //   { title: "PF Fund (Own Contribution)", dataIndex: "pfOwn", width: 200 },
  //   {
  //     title: "PF Fund (Company Contribution)",
  //     dataIndex: "pfCompany",
  //     width: 200,
  //   },
  //   { title: "Overtime", dataIndex: "overtime", width: 100 },
  //   { title: "Expense", dataIndex: "expense", width: 100 },
  //   { title: "Tax", dataIndex: "tax", width: 100 },
  //   {
  //     title: "Earnings / Allowance (TA/DA, Others)",
  //     dataIndex: "earningsAllowance",
  //     width: 250,
  //   },
  //   {
  //     title: "Deductions (Lunch, Others)",
  //     dataIndex: "deductions",
  //     width: 200,
  //   },
  //   {
  //     title: "Total Attendance (P, LWP, A)",
  //     dataIndex: "totalAttendance",
  //     width: 200,
  //   },
  // ];

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    const workplaceList = values?.workplace?.map((i: any) => i?.value);
    landingApi?.action({
      method: "get",
      urlKey: "FinalSettlementReportForAll",
      params: {
        strPartName: "htmlView",
        intAccountId: orgId,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        // workPlaceGroupId: values?.workplaceGroup?.value,
        // FiscalYearId: values?.fiscalYear?.value,
        // strWorkPlaceList: workplaceList?.length > 0 ? `${workplaceList}` : 0,
        status: values?.status?.value,
      },
      onSuccess: (res) => {
        setData(res);
      },
    });
  };
  return employeeFeature?.isView ? (
    <>
      <PForm form={form} initialValues={{}} onFinish={submitHandler}>
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            // exportIcon={true}
            title={`Final Settlement Report`}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  rules={[
                    {
                      required: true,
                      message: "from Date is required",
                    },
                  ]}
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
                  rules={[
                    {
                      required: true,
                      message: "To Date is required",
                    },
                  ]}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="employee"
                  label="Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                    // empBasicInfo(buId, orgId, value, setEmpInfo);
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="status"
                  label="Status"
                  placeholder=""
                  options={[
                    { value: 2, label: "All" },
                    { value: 1, label: "Active" },
                    { value: 0, label: "Inactive" },
                  ]}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      status: op,
                    });
                    // empBasicInfo(buId, orgId, value, setEmpInfo);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
              {/* <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  //   disabled={+id ? true : false}
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
                  //   disabled={+id ? true : false}
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

          {/* <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);
              landingApiCall({
                pagination,
                filerList: filters,
              });
            }}
            scroll={{ x: 2000 }}
          /> */}

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

                        const url = `/PdfAndExcelReport/FinalSettlementReportForAll?strPartName=excelView&intAccountId=${orgId}&fromDate=${moment(
                          values?.fromDate
                        ).format("YYYY-MM-DD")}&toDate=${moment(
                          values?.toDate
                        ).format("YYYY-MM-DD")}`;

                        downloadFile(
                          url,
                          `Final Settlement Report- ${todayDate()}`,
                          "xlsx",
                          setExcelLoading
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

                        const url = `/PdfAndExcelReport/FinalSettlementReportForAll?strPartName=pdfView&intAccountId=${orgId}&fromDate=${moment(
                          values?.fromDate
                        ).format("YYYY-MM-DD")}&toDate=${moment(
                          values?.toDate
                        ).format("YYYY-MM-DD")}`;

                        getPDFAction(url, setExcelLoading);
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

          <div style={{ overflow: "scroll" }} className=" w-100">
            <div
              dangerouslySetInnerHTML={{
                __html: data,
              }}
            />
          </div>
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default FinalSettlementReport;
