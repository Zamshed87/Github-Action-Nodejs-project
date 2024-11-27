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
  TableButton,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dateFormatter } from "utility/dateFormatter";

import { yearDDLAction } from "utility/yearDDL";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getTableDataDailyAttendance } from "modules/timeSheet/reports/lateReport/helper";

export const IncrementProposal = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, employeeId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [landing, setLanding] = useState<any[]>([]);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30338),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const deleteProposal = useApiRequest({});
  const createUpdateIncrementProposal = useApiRequest({});

  const CommonEmployeeDDL = useApiRequest([]);

  const getEmployee = (value: any = "") => {
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "GetSupervisorDDL",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        AccountId: orgId,
        // workplaceId: wId,
        // searchText: value,
      },
      // onSuccess: (res) => {
      //   res.forEach((item: any, i: number) => {
      //     res[i].label = item?.employeeName;
      //     res[i].value = item?.employeeId;
      //   });
      // },
    });
  };
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const options: any = [
    { value: "", label: "All" },
    { value: true, label: "Assigned" },
    { value: false, label: "Not-Assigned" },
  ];
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
      urlKey: "GetIncrementProposalLoader",
      method: "GET",
      params: {
        supervisorId: values?.supervisor?.value,
        IncrementYear: `${values?.intYear?.value}`,
        isInserted: values?.isInserted,
        // isInserted: "true",
      },
      onSuccess: (res) => {
        const modify = res?.map((i: any, index: number) => {
          return {
            ...i,
            key: index,
            proposedGrossSalary:
              +i?.recentGrossSalary + +i?.incrementProposalAmount,
          };
        });
        setLanding(modify);
        const selected = modify?.filter((i: any) => i?.id > 0);
        if (selected?.length) {
          setSelectedRow(selected);
        }
      },
    });
  };

  useEffect(() => {
    getEmployee();
    // getWorkplaceGroup();
    // empBasicInfo(buId, orgId, employeeId, setEmpInfo);

    // landingApiCall();
  }, []);
  //  Delete Element
  const deleteProposalById = (item: any) => {
    deleteProposal?.action({
      urlKey: "DeleteIncrementProposal",
      method: "DELETE",
      params: {
        Id: item?.id,
      },
      toast: true,
      onSuccess: () => {
        setSelectedRow([]);

        landingApiCall();
      },
    });
  };
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
      dataIndex: "workplaceGroupName",
      width: 100,
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: 100,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      width: 100,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      width: 100,
    },
    {
      title: "Section",
      dataIndex: "sectionName",
      width: 100,
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
      width: 100,
    },
    {
      title: "Dotted Supervisor",
      dataIndex: "dottedSupervisorName",
      width: 100,
    },
    {
      title: "Line Manager",
      dataIndex: "lineManagerName",
      width: 100,
    },
    {
      title: "Increment Year",
      dataIndex: "incrementYear",
      width: 100,
    },
    {
      title: "Date of Joining",
      dataIndex: "joiningDate",
      render: (data: any) => (data ? dateFormatter(data) : "-"),
      width: 100,
    },
    {
      title: "Last Increment Date",
      dataIndex: "lastIncrementDate",
      render: (data: any) => (data ? dateFormatter(data) : "-"),
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
          value={+row?.incrementProposalPercentage || 0}
          placeholder="Decimal Number"
          onChange={(e) => {
            if ((e as number) < 0) {
              return toast.warn("number must be positive");
            }
            if ((e as number) > 100) {
              return toast.warn("Percentage cant be greater than 100");
            }

            const temp = [...landing];
            temp[index].incrementProposalPercentage = e;
            temp[index].incrementProposalAmount =
              (row?.recentGrossSalary * (e as number)) / 100;
            temp[index].proposedGrossSalary =
              row?.recentGrossSalary + temp[index].incrementProposalAmount;
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
          value={row?.incrementProposalAmount || 0}
          placeholder="Decimal Number"
          onChange={(e) => {
            if ((e as number) < 0) {
              return toast.warn("number must be positive");
            }
            const temp = [...landing];
            temp[index].incrementProposalAmount = e;
            temp[index].incrementProposalPercentage =
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
          value={row?.proposedGrossSalary || 0}
          placeholder="Decimal Number"
          onChange={(e) => {
            if ((e as number) < 0) {
              return toast.warn("number must be positive");
            }
            const temp = [...landing];
            temp[index].incrementProposalAmount =
              (e as number) - row?.recentGrossSalary;
            temp[index].incrementProposalPercentage =
              ((temp[index].incrementProposalAmount as number) * 100) /
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
    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                deleteProposalById(item);
              },
            },
          ]}
        />
      ),
    },
  ];
  const columns = {
    sl: "SL",
    workplaceGroupName: "Workplace Group",
    workplaceName: "Workplace",
    employeeName: "Employee Name",
    designationName: "Designation",
    departmentName: "Department",
    sectionName: "Section",
    supervisorName: "Supervisor",
    dottedSupervisorName: "Dotted Supervisor",
    lineManagerName: "Line Manager",
    incrementYear: "Increment Year",
    joiningDate: "Date of Joining",
    lastIncrementDate: "Last Increment Date",
    lastIncrementAmount: "Last Increment Amount",
    recentGrossSalary: "Recent Gross Salary",
    incrementProposalPercentage: "Proposed Increment (%) by Gross Salary",
    incrementProposalAmount: "Proposed Increment Amount by Gross Salary",
    proposedGrossSalary: "Proposed Gross Salary",
    remarks: "Remarks",
  };
  // const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //   const { fromDate } = form.getFieldsValue(true);
  //   const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
  //   // Disable dates before fromDate and after next3daysForEmp
  //   return current && current < fromDateMoment.startOf("day");
  // };
  const viewHandler = async () => {
    setSelectedRow([]);
    await form
      .validateFields()
      .then(() => {
        landingApiCall();
      })
      .catch(() => {
        console.error("Validate Failed:");
      });
  };
  const onFinish = () => {
    if (selectedRow?.length == 0) {
      return toast.warn("Select Employees First");
    }
    const selectedRowEmpID = selectedRow.map((item) => item?.employeeId);
    const updatedSelectedRows = landing?.filter((item) =>
      selectedRowEmpID.includes(item.employeeId)
    );

    if (
      updatedSelectedRows?.filter((i) => i?.incrementProposalAmount === 0)
        ?.length > 0
    ) {
      return toast.warn("Please fill up the input fields");
    }

    const modify = updatedSelectedRows?.map((i) => {
      return {
        ...i,
        actionBy: employeeId,
      };
    });
    createUpdateIncrementProposal?.action({
      urlKey: "CreateUpdateIncrementProposal",
      method: "post",
      payload: modify,
      toast: true,
      onSuccess: () => {
        landingApiCall();
      },
    });
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={
          {
            // employee: { value: employeeId, label: userName },
            // fromDate: moment(getDateOfYear("first")),
            // toDate: moment(getDateOfYear("last")),
          }
        }
        onFinish={onFinish}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            submitText="Save"
            exportIcon={
              landingApi?.data?.length > 0 &&
              landingApi?.data?.every((i: any) => i?.id > 0)
            }
            title={`Total ${landingApi?.data?.length || 0} employees`}
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
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const newData = landingApi?.data?.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                        lastIncrementDate: item?.lastIncrementDate
                          ? dateFormatter(item?.lastIncrementDate)
                          : "-",
                        joiningDate: item?.joiningDate
                          ? dateFormatter(item?.joiningDate)
                          : "-",
                        proposedGrossSalary:
                          +item?.recentGrossSalary +
                          +item?.incrementProposalAmount,
                      };
                    }
                  );
                  createCommonExcelFile({
                    titleWithDate: `Increment Proposal Report - ${dateFormatter(
                      todayDate()
                    )} `,
                    fromDate: "",
                    toDate: "",
                    buAddress: "",
                    businessUnit: buName,
                    tableHeader: columns,
                    getTableData: () =>
                      getTableDataDailyAttendance(
                        newData,
                        Object.keys(columns)
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
                      B: 30,
                      D: 30,
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
                <PSelect
                  allowClear
                  name="supervisor"
                  label="Supervisor"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      supervisor: op,
                    });
                    // empBasicInfo(buId, orgId, value, setEmpInfo);
                  }}
                  // onSearch={(value) => {
                  //   getEmployee(value);
                  // }}
                  // showSearch
                  // filterOption={false}
                  rules={[
                    {
                      required: true,
                      message: "Supervisor is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={yearDDLAction()}
                  name="intYear"
                  label="Year"
                  placeholder="Year"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      intYear: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Year is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={options}
                  name="isInserted"
                  label="Status"
                  placeholder="isInserted"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      isInserted: value,
                    });
                  }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Year is required",
                  //   },
                  // ]}
                />
              </Col>
              {/* <Col md={3} sm={12} xs={24}>
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
              </Col> */}

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
                <PButton
                  type="primary"
                  action="button"
                  onClick={() => {
                    viewHandler();
                  }}
                  content="View"
                />
              </Col>
            </Row>
          </PCardBody>

          <DataTable
            bordered
            data={
              // landingApi?.data ||
              landing || []
            }
            loading={landingApi?.loading}
            header={header}
            // pagination={{
            //   pageSize: landingApi?.data?.pageSize,
            //   total: landingApi?.data?.totalCount,
            // }}
            // onChange={(pagination, filters, sorter, extra) => {
            //   // Return if sort function is called
            //   if (extra.action === "sort") return;
            //   setFilterList(filters);

            //   landingApiCall({
            //     pagination,
            //   });
            // }}
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
