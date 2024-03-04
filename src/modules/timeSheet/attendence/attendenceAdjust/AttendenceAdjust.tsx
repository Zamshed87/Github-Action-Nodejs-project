import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";

import PBadge from "Components/Badge";
import { ModalFooter, PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Modal, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AttendanceType, EmpFilterType } from "./utils/utils";
import { convertTo12HourFormat } from "utility/timeFormatter";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

type TAttendenceAdjust = unknown;
const AttendenceAdjustN: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  // States
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const CommonEmployeeDDL = useApiRequest([]);
  const AttendanceAdjustmentFilter = useApiRequest([]);
  const ManualAttendance = useApiRequest({});
  const empDepartmentDDL = useApiRequest([]);

  // Life Cycle Hooks
  useEffect(() => {
    const { empSearchType, date, employee } = form.getFieldsValue(true);
    empSearchType && date && employee && getAttendanceFilterData();
    getEmployeDepartment();
  }, [buId, wgId, wId]);

  const getAttendanceFilterData = () => {
    const {
      empSearchType,
      date,
      tdate,
      employee,
      attendanceStatus,
      department,
    } = form.getFieldsValue(true);

    const payload = {
      employeeId: employee?.value || employeeId,
      workplaceGroupId: wgId,
      accountId: orgId,
      businessUnitId: buId,
      yearId: parseInt(moment(date).format("YYYY")),
      monthId: parseInt(moment(date).format("MM")),
      applicationDate: null,
      departmentId: department?.value,
      attendanceStatus: attendanceStatus || "all",
      punchStatus: attendanceStatus || "all",
      attendanceDate: moment(date).format("YYYY-MM-DD"),
      jobTypeId: 0,
      pageNo: 1,
      pageSize: 25,
    };

    AttendanceAdjustmentFilter?.action({
      urlKey:
        empSearchType === 1
          ? "AttendanceAdjustmentFilter"
          : "AttendanceAdjustmentFilterbyDate",
      method: "post",
      payload:
        empSearchType === 1
          ? payload
          : {
              ...payload,

              attendanceToDate: moment(tdate).format("YYYY-MM-DD"),
            },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Attendence Adjust";
  }, []);

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
        res.forEach((item: any, i: number) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
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
        // console.error("Validate Failed:", info?.message);
      });
  };

  const submitHandler = async () => {
    // console.log({selectedRow})
    await form
      .validateFields(["intime", "outtime"])
      .then(() => {
        const values = form.getFieldsValue(true);
        // console.log({ values });
        const payload = selectedRow.map((item) => {
          // console.log({item})
          // console.log("values?.outtime", values?.outtime)
          return {
            id: item?.ManualAttendanceId || 0,
            accountId: orgId,
            attendanceSummaryId: item?.AutoId,
            employeeId: item?.EmployeeId,
            attendanceDate: item?.AttendanceDate,
            // inTime: values?.intime ?  moment(values?.intime).format("HH:mm:ss") : item?.StartTime,
            // outTime: values?.outtime ?  moment(values?.outtime).format("HH:mm:ss") : item?.EndTime,
            // `${data?.InTime} - ${data?.OutTime}`,
            inTime:
              values?.attendanceAdujust?.label === "Absent" ||
              values?.attendanceAdujust?.label === "Late"
                ? null
                : values?.intime
                ? moment(values?.intime).format("HH:mm:ss")
                : moment(moment(item?.InTime, "h:mma")).format("HH:mm:ss") ||
                  null,
            outTime:
              values?.attendanceAdujust?.label === "Absent" ||
              values?.attendanceAdujust?.label === "Late"
                ? null
                : values?.outtime
                ? moment(values?.outtime).format("HH:mm:ss")
                : moment(moment(item?.OutTime, "h:mma")).format("HH:mm:ss") ||
                  null,
            status: item?.isPresent
              ? "Present"
              : item?.isLeave
              ? "Leave"
              : "Absent",
            requestStatus: values?.attendanceAdujust?.label,
            remarks: values?.reason || "By HR",
            isApproved: true,
            isActive: true,
            isManagement: true,
            insertUserId: employeeId,
            insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            workPlaceGroup: wgId,
            businessUnitId: buId,
          };
        });
        // console.log({payload})

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
      width: 30,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      fixed: "left",
      width: 120,
    },
    {
      title: "Employee ID",
      dataIndex: "EmployeeCode",
      fixed: "left",
      width: 90,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      width: 100,
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
      filterKey: "designationList",
      width: 120,
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      sorter: true,
      filter: true,
      width: 120,
    },
    {
      title: "Calender Name",
      dataIndex: "CalendarName",
      sorter: true,
      filter: true,
      // width: 130,
    },
    {
      title: "Attendance Date",
      dataIndex: "AttendanceDate",
      render: (data: any) => moment(data).format("DD-MMM-YYYY"),
      // width: 130,
    },
    {
      title: "Punch In/Out",
      dataIndex: "",
      render: (data: any) => `${data?.InTime} - ${data?.OutTime}`,
      // width: 130,
    },
    {
      title: "Manual In/Out",
      dataIndex: "",
      render: (data: any) =>
        `${data?.ManulInTime || "N/A"} - ${data?.ManulOutTime || "N/A"}`,
      // width: 130,
    },
    {
      title: "Calender Time In/Out",
      dataIndex: "",
      render: (data: any) => {
        const startTime = data?.CalenderStartTime
          ? convertTo12HourFormat(data.CalenderStartTime)
          : "N/A";
        const endTime = data?.CalenderEndTime
          ? convertTo12HourFormat(data.CalenderEndTime)
          : "N/A";
        return `${startTime} - ${endTime}`;
      },
      // width: 130,
    },
    {
      title: "Late Min",
      dataIndex: "LateMin",
      // width: 100,
    },
    {
      title: "Total Working Hours",
      dataIndex: "WorkingHours",
    },
    // change after that
    {
      title: "Total OT Hours",
      dataIndex: "OverTimeCalednder",
    },
    {
      title: "Actual Attendance",
      dataIndex: "actualAttendanceStatus",
      render: (_: any, record: any) =>
        record?.actualAttendanceStatus === "Present" ? (
          <PBadge text="Present" type="success" />
        ) : record?.actualAttendanceStatus === "Absence" ? (
          <PBadge text="Absence" type="warning" />
        ) : record?.actualAttendanceStatus === "Holiday" ? (
          <PBadge text="Holiday" type="light" />
        ) : record?.actualAttendanceStatus === "Late" ? (
          <PBadge text="Late" type="danger" />
        ) : record?.actualAttendanceStatus === "Offday" ? (
          <PBadge text="Offday" type="light" />
        ) : (
          ""
        ),
      align: "center",
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
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { date } = form.getFieldsValue(true);
    const fromDateMoment = moment(date, "MM/DD/YYYY");
    const endDateMoment = fromDateMoment.clone().add(29, "days");

    // Disable dates before fromDate and after next3daysForEmp
    return (
      current &&
      (current < fromDateMoment.startOf("day") ||
        current > endDateMoment.endOf("day"))
    );
  };
  return (
    <PForm
      form={form}
      initialValues={{
        empSearchType: 1,
        date: moment(),
      }}
      // onFinish={() => {
      //   const values = form.getFieldsValue(true);
      //   // submitHandler({
      //   //   values,
      //   //   getData,
      //   //   resetForm: form.resetFields,
      //   //   setIsAddEditForm,
      //   //   isEdit,
      //   // });
      // }}
    >
      <PCard>
        <PCardHeader title="Adjust Attendance">
          <PSelect
            options={AttendanceType}
            name="attendanceAdujust"
            placeholder="Change Attendance"
            style={{ width: "200px" }}
            onSelect={(value: any, op: any) => {
              form.setFieldsValue({
                attendanceAdujust: op,
              });

              value === 1 &&
                form.setFieldsValue({
                  openModal: true,
                  intime:
                    selectedRow?.length === 1
                      ? selectedRow[0]?.InTime ? moment(selectedRow[0]?.InTime, "h:mma") : ""
                      : "",
                  outtime:
                    selectedRow?.length === 1
                      ? selectedRow[0]?.OutTime ? moment(selectedRow[0]?.OutTime, "h:mma") : ""
                      : "",
                });

              (value === 2 || value === 3) &&
                Modal.confirm({
                  title: "Are you sure to update attendance?",
                  onOk: submitHandler,
                });
            }}
            disabled={!selectedRow.length}
          />
        </PCardHeader>
        <div className="card-style">
          <Row gutter={[10, 2]} className="mb-3">
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
                const { empSearchType } = form.getFieldsValue(true);
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
                    <Col md={6} sm={24}>
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
                        rules={[
                          { required: true, message: "Department is required" },
                        ]}
                      />
                    </Col>
                    <Col md={6} sm={12} xs={24}>
                      <PInput
                        type="date"
                        name="date"
                        label="Select from date"
                        placeholder="Select a date"
                        onChange={() => {
                          AttendanceAdjustmentFilter?.reset();
                          setSelectedRow([]);
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please Select a date",
                          },
                        ]}
                      />
                    </Col>
                    <Col md={6} sm={12} xs={24}>
                      <PInput
                        type="date"
                        name="tdate"
                        label="Select to date"
                        placeholder="Select a date"
                        onChange={() => {
                          AttendanceAdjustmentFilter?.reset();
                          setSelectedRow([]);
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please Select a date",
                          },
                        ]}
                        max={30}
                        disabledDate={disabledDate}
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
              <PButton
                type="primary"
                content="View"
                onClick={() => {
                  viewHandler();
                }}
              />
            </Col>
          </Row>
        </div>

        <div className="mt-4">
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

              // getCheckboxProps: (rec) => {
              //   return {
              //     disabled: rec?.ApplicationStatus === "Approved",
              //   };
              // },
            }}
            checkBoxColWidth={50}
          />
        </div>
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
                <PForm
                  form={form}
                  // initialValues={{
                  //   openModal: false,
                  //   attendanceAdujust: undefined,
                  //   intime: "",
                  //   outtime: "",
                  // }}
                >
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
  );
};

export default AttendenceAdjustN;
