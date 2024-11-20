/* eslint-disable @typescript-eslint/no-empty-function */
import {
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
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dateFormatter, getDateOfYear } from "utility/dateFormatter";

import { getSerial } from "Utils";

export const IncrementProposal = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName, userName },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [landing, setLanding] = useState<any[]>([
    {
      key: 0,
      workplaceGroup: "Group A",
      workplace: "Office A",
      employeeName: "John Doe",
      designation: "Software Engineer",
      department: "IT",
      section: "Development",
      supervisor: "Jane Smith",
      dottedSupervisor: "Robert Brown",
      lineManager: "Michael Johnson",
      dateOfJoining: "2020-01-15",
      lastIncrementDate: "2023-06-01",
      lastIncrementAmount: 15000,
      recentGrossSalary: 120000,
      proposedIncrementPercent: 5,
      proposedIncrementAmount: 6000,
      proposedGrossSalary: 126000,
      remarks: "Eligible for promotion",
    },
    {
      key: 1,
      workplaceGroup: "Group B",
      workplace: "Office B",
      employeeName: "Alice Green",
      designation: "Project Manager",
      department: "Operations",
      section: "Management",
      supervisor: "Emily White",
      dottedSupervisor: "Chris Blue",
      lineManager: "William Gray",
      dateOfJoining: "2018-03-12",
      lastIncrementDate: "2023-05-10",
      lastIncrementAmount: 20000,
      recentGrossSalary: 150000,
      proposedIncrementPercent: 10,
      proposedIncrementAmount: 15000,
      proposedGrossSalary: 165000,
      remarks: "Outstanding performer",
    },
    {
      key: 2,
      workplaceGroup: "Group C",
      workplace: "Office C",
      employeeName: "Mark Black",
      designation: "HR Specialist",
      department: "Human Resources",
      section: "Recruitment",
      supervisor: "Sophia Green",
      dottedSupervisor: "Nathan Red",
      lineManager: "Liam Yellow",
      dateOfJoining: "2019-07-01",
      lastIncrementDate: "2022-12-15",
      lastIncrementAmount: 10000,
      recentGrossSalary: 90000,
      proposedIncrementPercent: 8,
      proposedIncrementAmount: 7200,
      proposedGrossSalary: 97200,
      remarks: "Consistent performance",
    },
  ]);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30338),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const CommonEmployeeDDL = useApiRequest([]);

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
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // const workplaceGroup = useApiRequest([]);
  // const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Increment Report";
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
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "MonthlyRosterReportForSingleEmployee",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        IsXls: false,
        WorkplaceGroupId: values?.workplaceGroup?.value,
        PageNo: pagination.current || 1,
        EmployeeId: values?.employee?.value,
        PageSize: pagination.pageSize || 25,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.todate).format("YYYY-MM-DD"),
        WorkplaceId: values?.workplace?.value,
        searchTxt: searchText,
      },
    });
  };

  useEffect(() => {
    // getWorkplaceGroup();
    // empBasicInfo(buId, orgId, employeeId, setEmpInfo);

    landingApiCall();
  }, []);

  const header: any = [
    // {
    //     title: "SL",
    //     render: (_: any, rec: any, index: number) =>
    //       getSerial({
    //         currentPage: landingApi?.data?.currentPage,
    //         pageSize: landingApi?.data?.pageSize,
    //         index,
    //       }),
    //     fixed: "left",
    //     width: 35,
    //     align: "center",
    //   },
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      width: 100,
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: 100,
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
      title: "Supervisor",
      dataIndex: "supervisor",
      width: 100,
    },
    {
      title: "Dotted Supervisor",
      dataIndex: "dottedSupervisor",
      width: 100,
    },
    {
      title: "Line Manager",
      dataIndex: "lineManager",
      width: 100,
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      width: 100,
    },
    {
      title: "Last Increment Date",
      dataIndex: "lastIncrementDate",
      width: 100,
    },
    {
      title: "Last Increment Amount",
      dataIndex: "lastIncrementAmount",
      width: 100,
    },
    {
      title: "Recent Gross Salary",
      dataIndex: "recentGrossSalary",
      width: 100,
    },
    // Custom Input Columns
    {
      title: "Proposed Increment (%) by Gross Salary",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={row?.proposedIncrementPercent}
          placeholder="Decimal Number"
          onChange={(e) => {
            const temp = [...landing];
            temp[index].proposedIncrementPercent = e;
            temp[index].proposedIncrementAmount =
              (row?.recentGrossSalary * (e as number)) / 100;
            temp[index].proposedGrossSalary =
              row?.recentGrossSalary + temp[index].proposedIncrementAmount;
            setLanding(temp);
          }}
        />
      ),
    },
    {
      title: "Proposed Increment Amount by Gross Salary",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={row?.proposedIncrementAmount}
          placeholder="Decimal Number"
          onChange={(e) => {
            const temp = [...landing];
            temp[index].proposedIncrementAmount = e;
            temp[index].proposedIncrementPercent =
              ((e as number) * 100) / row?.recentGrossSalary;
            temp[index].proposedGrossSalary = row?.recentGrossSalary + e;
            setLanding(temp);
          }}
        />
      ),
    },
    {
      title: "Proposed Gross Salary",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={row?.proposedGrossSalary}
          placeholder="Decimal Number"
          onChange={(e) => {
            const temp = [...landing];
            temp[index].proposedIncrementAmount =
              (e as number) - row?.recentGrossSalary;
            temp[index].proposedIncrementPercent =
              ((temp[index].proposedIncrementAmount as number) * 100) /
              row?.recentGrossSalary;
            temp[index].proposedGrossSalary = e;
            setLanding(temp);
          }}
        />
      ),
    },
    {
      title: "Remarks",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="text"
          value={row?.remarks}
          placeholder="Textbox"
          onChange={(e) => {
            console.log(e.target?.value);
            const temp = [...landing];
            temp[index].remarks = e.target?.value;
            setLanding(temp);
          }}
        />
      ),
    },
  ];

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
          employee: { value: employeeId, label: userName },

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
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            // title={`Total ${landingApi?.data?.totalCount || 0} employees`}

            // onExport={() => {
            //   const excelLanding = async () => {
            //     setExcelLoading(true);
            //     try {
            //       const values = form.getFieldsValue(true);
            //       // getExcelData(
            //       //   `/Employee/GetInactiveEmployeeList?BusinessUnitId=${buId}&WorkplaceGroupId=${
            //       //     values?.workplaceGroup?.value || wgId
            //       //   }&WorkplaceId=${
            //       //     values?.workplace?.value || wId
            //       //   }&IsXls=true&PageNo=1&PageSize=10000&FromDate=${moment(
            //       //     values?.fromDate
            //       //   ).format("YYYY-MM-DD")}&ToDate=${moment(
            //       //     values?.toDate
            //       //   ).format("YYYY-MM-DD")}`,
            //       //   (res: any) => {
            //       //     const newData = res?.data?.map(
            //       //       (item: any, index: any) => {
            //       //         return {
            //       //           ...item,
            //       //           sl: index + 1,
            //       //         };
            //       //       }
            //       //     );
            //       //     createCommonExcelFile({
            //       //       titleWithDate: `Inactive Employee list for the month of ${getCurrentMonthName()}-${currentYear()}`,
            //       //       fromDate: "",
            //       //       toDate: "",
            //       //       buAddress: (buDetails as any)?.strAddress,
            //       //       businessUnit: values?.workplaceGroup?.value
            //       //         ? (buDetails as any)?.strWorkplace
            //       //         : buName,
            //       //       tableHeader: column,
            //       //       getTableData: () =>
            //       //         getTableDataInactiveEmployees(
            //       //           newData,
            //       //           Object.keys(column)
            //       //         ),
            //       //       getSubTableData: () => {},
            //       //       subHeaderInfoArr: [],
            //       //       subHeaderColumn: [],
            //       //       tableFooter: [],
            //       //       extraInfo: {},
            //       //       tableHeadFontSize: 10,
            //       //       widthList: {
            //       //         C: 30,
            //       //         D: 30,
            //       //         E: 25,
            //       //         F: 20,
            //       //         G: 25,
            //       //         H: 25,
            //       //         I: 25,
            //       //         K: 20,
            //       //       },
            //       //       commonCellRange: "A1:J1",
            //       //       CellAlignment: "left",
            //       //     });
            //       //   }
            //       // );
            //       const newData = landingApi?.data?.data?.map(
            //         (item: any, index: any) => {
            //           return {
            //             ...item,
            //             sl: index + 1,
            //             dteAttendanceDate: moment(
            //               item?.dteAttendanceDate,
            //               "YYYY-MM-DDThh:mm:ss"
            //             ).format("DD MMM, YYYY (dddd)"),
            //           };
            //         }
            //       );
            //       createCommonExcelFile({
            //         titleWithDate: `Employee Roster Report `,
            //         fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
            //         toDate: moment(values?.toDate).format("YYYY-MM-DD"),
            //         buAddress: (buDetails as any)?.strAddress,
            //         businessUnit: values?.workplaceGroup?.value
            //           ? (buDetails as any)?.strWorkplace
            //           : buName,
            //         tableHeader: column,
            //         getTableData: () =>
            //           getTableDataInactiveEmployees(
            //             newData,
            //             Object.keys(column)
            //           ),
            //         getSubTableData: () => {},
            //         subHeaderInfoArr: [],
            //         subHeaderColumn: [],
            //         tableFooter: [],
            //         extraInfo: {},
            //         tableHeadFontSize: 10,
            //         widthList: {
            //           B: 30,
            //           C: 30,
            //           D: 15,
            //           F: 15,
            //           E: 15,
            //         },
            //         commonCellRange: "A1:J1",
            //         CellAlignment: "left",
            //       });
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
              <Col md={3} sm={12} xs={24}>
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
              <Col md={3} sm={12} xs={24}>
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
            data={
              //   landingApi?.data?.data ||
              landing || []
            }
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
            scroll={{ x: 1500 }}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRow.map((item) => item?.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRow(selectedRows);
              },
            }}
            checkBoxColWidth={50}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
