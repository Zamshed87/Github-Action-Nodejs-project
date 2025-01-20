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
import { InfoOutlined } from "@mui/icons-material";
import profileImg from "../../../assets/images/profile.jpg";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dateFormatter } from "utility/dateFormatter";
import { Popover } from "@mui/material";

import { yearDDLAction } from "utility/yearDDL";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getTableDataDailyAttendance } from "modules/timeSheet/reports/lateReport/helper";
import { processDataFromExcelSecurityDeposit } from "./helper";

export const SecurityDepositCRUD = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, employeeId, orgId, wId, wgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [landing, setLanding] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30338),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const deleteProposal = useApiRequest({});
  const empDepartmentDDL = useApiRequest({});
  const securityTypeDDL = useApiRequest({});
  const createUpdateDeposite = useApiRequest({});

  const CommonEmployeeDDL = useApiRequest([]);

  const getEmployee = (value: any = "") => {
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
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
    document.title = "Security Deposit";
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
      onError: (res: any) => {
        setLanding([]);
        toast.warn(res?.response?.data?.title);
      },
    });
  };
  const getEmployeDepartment = () => {
    // const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res?.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  const getSecurityType = () => {
    // const { workplaceGroup, workplace } = form.getFieldsValue(true);

    securityTypeDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res?.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  useEffect(() => {
    getEmployee();
    getEmployeDepartment();
    getSecurityType();
  }, []);
  //  Delete Element
  //   const deleteProposalById = (item: any) => {
  //     deleteProposal?.action({
  //       urlKey: "DeleteIncrementProposal",
  //       method: "DELETE",
  //       params: {
  //         Id: item?.id,
  //       },
  //       toast: true,
  //       onSuccess: () => {
  //         setSelectedRow([]);

  //         landingApiCall();
  //       },
  //     });
  //   };
  const header: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    // {
    //   title: "Workplace Group",
    //   dataIndex: "workplaceGroupName",
    //   width: 100,
    // },
    // {
    //   title: "Workplace",
    //   dataIndex: "workplaceName",
    //   width: 100,
    // },
    {
      title: "Employee Code",
      dataIndex: "employeeName",
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
    //  Custom Input Columns
    {
      title: "Deposits Money",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={+row?.depositeMoney || 0}
          placeholder="Decimal Number"
          onChange={(e) => {
            if ((e as number) < 0) {
              return toast.warn("number must be positive");
            }

            const temp = [...landing];
            temp[index].depositeMoney = e;

            setLanding(temp);
          }}
        />
      ),
    },

    {
      title: "Comment",
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
    // {
    //   title: "Status",
    //   width: 150,

    //   // render: (_: any, rec: any) => {
    //   //   return (
    //   //     <div>
    //   //       {rec?.strEmployeeStatus === "Approved" ? (
    //   //         <Tag color="green">{rec?.status}</Tag>
    //   //       ) : rec?.status === "Rejected" ? (
    //   //         <Tag color="red">{rec?.status}</Tag>
    //   //       ) : rec?.status === "Pending" ? (
    //   //         <Tag color="orange">{rec?.status}</Tag>
    //   //       ) : (
    //   //         <Tag color="default">{rec?.status}</Tag>
    //   //       )}

    //   //     </div>
    //   //   );
    //   // },
    //   render: (_: any, rec: any) => (
    //     <div className="d-flex align-items-center">
    //       <span className="ml-2">
    //         {rec?.strEmployeeStatus === "Approved" ? (
    //           <Tag color="green">{rec?.status}</Tag>
    //         ) : rec?.status === "Rejected" ? (
    //           <Tag color="red">{rec?.status}</Tag>
    //         ) : rec?.status === "Pending" ? (
    //           <Tag color="orange">{rec?.status}</Tag>
    //         ) : (
    //           <Tag color="default">{rec?.status}</Tag>
    //         )}
    //       </span>
    //       {rec?.approvalLog?.length > 0 && (
    //         <InfoOutlined
    //           className="ml-2"
    //           sx={{ cursor: "pointer", fontSize: "17px" }}
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             setAnchorElHistory(e.currentTarget as any);
    //             setSelectedSingleEmployee(rec);
    //           }}
    //         />
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={
            [
              // {
              //   type: "delete",
              //   onClick: () => {
              //     deleteProposalById(item);
              //   },
              // },
            ]
          }
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
    status: "Status",
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
    const values = form.getFieldsValue(true);
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
        depositTypeId: values?.securityTypeDDL?.value || 0,
        employeeId: i?.employeeId,
        depositAmount: i?.depositeMoney,
        comment: i?.remarks,
        // actionBy: employeeId,
      };
    });
    createUpdateDeposite?.action({
      urlKey: "Deposit",
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
          >
            <Row>
              <Col>
                <input
                  style={{ width: "100px" }}
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => {
                    setSelectedRow([]);
                    setLanding([]);
                    !!e.target.files?.[0] && setLoading(true);
                    processDataFromExcelSecurityDeposit(
                      e.target.files?.[0],
                      employeeId,
                      orgId,
                      buId,
                      wgId,
                      setLoading,
                      setLanding
                    );
                  }}
                  // onClick={(e) => {
                  //   e.target.value = null;
                  // }}
                />
              </Col>
            </Row>
          </PCardHeader>
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  options={
                    empDepartmentDDL?.data?.length > 0
                      ? empDepartmentDDL?.data
                      : []
                  }
                  name="department"
                  label="Department"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
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
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  allowClear
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
                  // onSearch={(value) => {
                  //   getEmployee(value);
                  // }}
                  showSearch
                  // filterOption={false}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Employee is required",
                  //   },
                  // ]}
                />
              </Col>

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
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  options={
                    securityTypeDDL?.data.length > 0
                      ? securityTypeDDL?.data
                      : []
                  }
                  name="securityTypeDDL"
                  label="Deposite Security Type"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      securityTypeDDL: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="month"
                  name="monthYear"
                  format={"MMM-YYYY"}
                  label="Month-Year"
                  placeholder=""
                  onChange={(value) => {
                    form.setFieldsValue({
                      monthYear: value,
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
