import { AddOutlined } from "@mui/icons-material";
import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import PBadge from "Components/Badge";
import { ModalFooter, PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Modal, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  AttendanceType,
  EmpFilterType,
} from "modules/timeSheet/attendence/attendenceAdjust/utils/utils";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { AttendanceType, EmpFilterType } from "./utils/utils";

type TAttendenceAdjust = unknown;
const BulkSalaryAssign: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // States
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const CommonEmployeeDDL = useApiRequest([]);
  const AttendanceAdjustmentFilter = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);

  const ManualAttendance = useApiRequest({});
  const dispatch = useDispatch();

  // Life Cycle Hooks
  useEffect(() => {
    const { empSearchType, date, employee } = form.getFieldsValue(true);
    empSearchType && date && employee && getAttendanceFilterData();
  }, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Bulk Salary Assign";
  }, []);

  const getAttendanceFilterData = () => {
    const { empSearchType, date, employee, attendanceStatus } =
      form.getFieldsValue(true);

    const payload = {
      employeeId: employee?.value || employeeId,
      workplaceGroupId: wgId,
      accountId: orgId,
      businessUnitId: buId,
      yearId: parseInt(moment(date).format("YYYY")),
      monthId: parseInt(moment(date).format("MM")),
      applicationDate: null,
      departmentId: 0,
      attendanceStatus: attendanceStatus || "all",
      punchStatus: attendanceStatus || "all",
      jobTypeId: 0,
      attendanceDate: moment(date).format("YYYY-MM-DD"),
      pageNo: 1,
      pageSize: 10,
    };

    AttendanceAdjustmentFilter?.action({
      urlKey:
        empSearchType === 1
          ? "AttendanceAdjustmentFilter"
          : "AttendanceAdjustmentFilterbyDate",
      method: "post",
      payload,
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
  const getEmploymentType = () => {
    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };
  // workplace wise
  const getEmployeDepartment = () => {
    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
  };
  const getEmployeDesignation = () => {
    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });
  };
  const getEmployeePosition = () => {
    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  };
  //   export const getBreakdownPolicyDDL = async (

  const getPayrollGroupDDL = () => {
    payrollGroupDDL?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN DDL",
        IntEmployeeId: employeeId,
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: 0,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strSalaryBreakdownTitle;
          res[i].value = item?.intSalaryBreakdownHeaderId;
        });
      },
    });
  };
  const viewHandler = async () => {
    await form
      .validateFields()
      .then(() => {
        getAttendanceFilterData();
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30397) {
      employeeFeature = item;
    }
  });

  const submitHandler = async () => {
    await form
      .validateFields(["intime", "outtime"])
      .then(() => {
        const values = form.getFieldsValue(true);
        const payload = selectedRow.map((item) => {
          return {
            id: item?.ManualAttendanceId || 0,
            accountId: orgId,
            attendanceSummaryId: item?.AutoId,
            employeeId: item?.EmployeeId,
            attendanceDate: item?.AttendanceDate,
            inTime: values?.inTime || item?.StartTime,
            outTime: values?.outTime || item?.EndTime,
            status: item?.isPresent
              ? "Present"
              : item?.isLeave
              ? "Leave"
              : "Absent",
            requestStatus: values?.attendanceAdujust?.label,
            remarks: values?.strReason || "By HR",
            isApproved: true,
            isActive: true,
            isManagement: true,
            insertUserId: employeeId,
            insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            workPlaceGroup: wgId,
            businessUnitId: buId,
          };
        });

        ManualAttendance?.action({
          method: "post",
          urlKey: "ManualAttendance",
          payload,
          toast: true,
          onSuccess: () => {
            form.setFieldsValue({
              openModal: false,
              attendanceAdujust: undefined,
              intime: "",
              outtime: "",
            });
            setSelectedRow([]);
            getAttendanceFilterData();
          },
        });
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      fixed: "left",
    },
    {
      title: "Employee ID",
      dataIndex: "EmployeeCode",
      fixed: "left",
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
      filterKey: "designationList",
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      sorter: true,
      filter: true,
    },
    {
      title: "Attendance Date",
      dataIndex: "AttendanceDate",
      render: (data: any) => moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "In-Time",
      dataIndex: "InTime",
    },
    {
      title: "Out-Time",
      dataIndex: "OutTime",
    },
    {
      title: "Total Working Hours",
      dataIndex: "WorkingHours",
    },
    {
      title: "Actual Attendance",
      dataIndex: "actualAttendanceStatus",
      align: "center",
      // render: (data: any, record: any, index: number) => {
      //   return (record?.isPresent && record?.isLate) || record?.isLate ? (
      //     <PBadge type="warning" text="Late" />
      //   ) : record?.isPresent ? (
      //     <PBadge type="success" text="Present" />
      //   ) : record?.isHoliday === true ? (
      //     <PBadge type="secondary" text="Holiday" />
      //   ) : record?.isOffday === true ? (
      //     <PBadge type="dark" text="Offday" />
      //   ) : record?.isLeave ? (
      //     <PBadge type="light" text="Leave" />
      //   ) : record?.isMovement ? (
      //     <PBadge type="dark" text="Movement" />
      //   ) : record?.isAbsent ? (
      //     <PBadge type="danger" text="Absent" />
      //   ) : (
      //     ""
      //   );
      // },
    },
    {
      title: "Request Attendance",
      dataIndex: "RequestStatus",
      width: 100,
      filter: true,
      sorter: false,
    },
    {
      title: "Approval Status",
      dataIndex: "ApplicationStatus",
      render: (_: any, record: any) =>
        record?.ApplicationStatus === "Approved" ? (
          <PBadge text="Approved" type="success" />
        ) : record?.ApplicationStatus === "Pending" ? (
          <PBadge text="Pending" type="warning" />
        ) : record?.ApplicationStatus === "Process" ? (
          <PBadge text="Process" type="primary" />
        ) : record?.ApplicationStatus === "Rejected" ? (
          <PBadge text="Rejected" type="danger" />
        ) : (
          ""
        ),
      align: "center",
      filter: true,
      sorter: false,
    },
  ];
  useEffect(() => {
    getEmploymentType();
    getEmployeDepartment();
    getEmployeDesignation();
    getEmployeePosition();
    getPayrollGroupDDL();
  }, [wgId, buId, wId]);

  return employeeFeature?.isView ? (
    <PForm
      form={form}
      initialValues={{
        empSearchType: 1,
        date: moment(),
      }}
    >
      <PCard>
        <PCardHeader
          title="Bulk Salary Assign"
          buttonList={[
            {
              type: "primary",
              content: "Save",
              onClick: () => {
                console.log("first");
              },
              disabled: true,
              //   icon: <AddOutlined />,
            },
            {
              type: "primary-outline",
              content: "Cancel",
              onClick: () => {
                console.log("first");
              },
              disabled: true,
              //   icon: <AddOutlined />,
            },
          ]}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3">
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={payrollGroupDDL?.data || []}
              name="payrollGroup"
              label="Payroll Group"
              placeholder="Payroll Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  payrollGroup: op,
                });
              }}
              rules={[{ required: true, message: "Payroll Group is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={employmentTypeDDL?.data || []}
              name="employeeType"
              label="Employment Type"
              placeholder="Employment Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  employeeType: op,
                });
              }}
              //   rules={[
              //     { required: true, message: "Employment Type is required" },
              //   ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={empDepartmentDDL?.data || []}
              name="department"
              showSearch
              filterOption={true}
              label="Department"
              allowClear
              placeholder="Department"
              onChange={(value, op) => {
                form.setFieldsValue({
                  department: op,
                });
              }}
              //   rules={[{ required: true, message: "Department is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={empDesignationDDL.data || []}
              showSearch
              filterOption={true}
              name="designation"
              label="Designation"
              placeholder="Designation"
              onChange={(value, op) => {
                form.setFieldsValue({
                  designation: op,
                });
              }}
              //   rules={[{ required: true, message: "Designation is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={positionDDL?.data || []}
              name="hrPosition"
              showSearch
              filterOption={true}
              label="HR Position"
              placeholder="HR Position"
              onChange={(value, op) => {
                form.setFieldsValue({
                  hrPosition: op,
                });
              }}
              //   rules={[{ required: true, message: "HR Position is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="joiningDateFrom"
              label="Joining Date From"
              placeholder="Joining Date From"
              //   rules={[{ required: true, message: "Joining Date is required" }]}
              // disabled={isEdit}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="joiningDateTo"
              label="Joining Date To"
              placeholder="Joining Date To"
              //   rules={[{ required: true, message: "Joining Date is required" }]}
              // disabled={isEdit}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={EmpFilterType}
              name="empSearchType"
              label="Employee Search Type"
              placeholder="Employee Search Type"
              onChange={() => {
                form.resetFields(["date", "employee"]);
                setSelectedRow([]);
                AttendanceAdjustmentFilter?.reset();
              }}
              rules={[
                {
                  required: true,
                  message: "Please Select Employee Search Type",
                },
              ]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { empSearchType } = form.getFieldsValue();
              return empSearchType === 1 ? (
                <>
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="date"
                      picker="month"
                      name="date"
                      label="Select a month"
                      placeholder="Select a month"
                      rules={[
                        {
                          required: true,
                          message: "Please Select a month",
                        },
                      ]}
                      onChange={() => {
                        AttendanceAdjustmentFilter?.reset();
                        setSelectedRow([]);
                      }}
                      format={"MMMM-YYYY"}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      name="employee"
                      label="Select a Employee"
                      placeholder="Search Min 2 char"
                      options={CommonEmployeeDDL?.data || []}
                      loading={CommonEmployeeDDL?.loading}
                      onChange={(value, op) => {
                        AttendanceAdjustmentFilter?.reset();
                        setSelectedRow([]);
                        form.setFieldsValue({
                          employee: op,
                        });
                      }}
                      onSearch={(value) => {
                        getEmployee(value);
                      }}
                      showSearch
                      filterOption={false}
                    />
                  </Col>
                </>
              ) : empSearchType === 2 ? (
                <>
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="date"
                      name="date"
                      label="Select a date"
                      placeholder="Select a date"
                      onChange={() => {
                        AttendanceAdjustmentFilter?.reset();
                        setSelectedRow([]);
                      }}
                    />
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      name="attendanceStatus"
                      label="Select Attendance Status"
                      placeholder="Select Attendance Status"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Attendance Status",
                        },
                      ]}
                      options={[
                        {
                          value: "Present",
                          label: "Present",
                        },
                        {
                          value: "Absent",
                          label: "Absent",
                        },
                        {
                          label: "Late",
                          value: "Late",
                        },
                        {
                          value: "Leave",
                          label: "Leave",
                        },
                        {
                          label: "Movement",
                          value: "Movement",
                        },
                      ]}
                      onChange={() => {
                        AttendanceAdjustmentFilter?.reset();
                        setSelectedRow([]);
                      }}
                    />
                  </Col>
                </>
              ) : undefined;
            }}
          </Form.Item>

          <Col
            style={{
              marginTop: "23px",
            }}
          >
            <PButton type="primary" content="View" onClick={viewHandler} />
          </Col>
        </Row>
        <DataTable
          header={header}
          bordered
          data={AttendanceAdjustmentFilter?.data || []}
          loading={AttendanceAdjustmentFilter?.loading}
          scroll={{ x: 1500 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
            getCheckboxProps: (rec) => {
              console.log(rec);
              return {
                disabled: rec?.ApplicationStatus === "Approved",
              };
            },
          }}
        />
      </PCard>

      {/* Confirmation Modal */}
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { openModal, attendanceAdujust } = form.getFieldsValue(true);
          return (
            <PModal
              width={500}
              open={openModal}
              onCancel={() => {
                form.setFieldsValue({
                  openModal: false,
                  attendanceAdujust: undefined,
                  intime: "",
                  outtime: "",
                });
              }}
              title="Are you sure to update attendance?"
              components={
                <PForm form={form}>
                  <>
                    <div>
                      <p>Request Status: {attendanceAdujust?.label}</p>
                      <Row gutter={[10, 2]}>
                        <Col span={12}>
                          <PInput
                            type="date"
                            name="intime"
                            picker="time"
                            label="Select In time"
                            placeholder="Select Intime"
                            format={"hh:mm A"}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Please Select Intime",
                            //   },
                            // ]}
                          />
                        </Col>
                        <Col span={12}>
                          <PInput
                            type="date"
                            name="outtime"
                            picker="time"
                            label="Select Out-Time"
                            placeholder="Select Out-Time"
                            format={"hh:mm A"}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Please Select Out-Time",
                            //   },
                            // ]}
                          />
                        </Col>
                        <Col span={24}>
                          <PInput
                            label="Reason"
                            name={"reason"}
                            type="text"
                            placeholder="Write reason"
                          />
                        </Col>
                      </Row>
                    </div>
                    <ModalFooter
                      submitText="Yes"
                      cancelText="No"
                      onCancel={() => {
                        form.setFieldsValue({
                          openModal: false,
                          attendanceAdujust: undefined,
                          intime: "",
                          outtime: "",
                        });
                      }}
                      onSubmit={submitHandler}
                    />
                  </>
                </PForm>
              }
            />
          );
        }}
      </Form.Item>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default BulkSalaryAssign;
