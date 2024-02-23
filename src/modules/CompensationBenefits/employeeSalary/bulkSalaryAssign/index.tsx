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
  const [rowDto, setRowDto] = React.useState<any[]>([]);
  const [dynamicHeader, setDynamicHeader] = React.useState<any[]>([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const bulkLandingAPI = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const workG = useApiRequest([]);
  const workP = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Bulk Salary Assign";
  }, []);

  const getSalaryLanding = () => {
    const {
      payrollGroup,
      designation,
      department,
      employeeType,
      joiningDateTo,
      joiningDateFrom,
      hrPosition,
      wp,
    } = form.getFieldsValue(true);

    bulkLandingAPI?.action({
      urlKey: "BulkSalaryAssignLanding",
      method: "post",
      params: {
        accountId: orgId,
        workplaceId: wp?.value,
        payrollGroupId: payrollGroup?.value,
        empTypeId: employeeType?.value,
        hrPositionId: hrPosition?.value,
        departmentId: department?.value,
        designationId: designation?.value,
        fromDate: joiningDateFrom
          ? moment(joiningDateFrom).format("YYYY-MM-DD")
          : undefined,
        toDate: joiningDateTo
          ? moment(joiningDateTo).format("YYYY-MM-DD")
          : undefined,
      },
      onSuccess: (res) => {
        console.log({ res });

        setRowDto(res?.result);
        const updatedHeader: any[] = [];

        // Loop through each object in 'data' and generate dynamic columns
        res?.result.forEach((item: any, index: any) => {
          // ... your existing columns

          // Add the "Total Gross Salary" object

          // Generate dynamic columns based on the 'salaryElementsBreakdowns' array
          item.salaryElementsBreakdowns.forEach((element: any) => {
            updatedHeader.push({
              title: `${element.strPayrollElementName}(${element.numNumberOfPercentage})`,
              dataIndex: `salaryElementsBreakdowns_${element.intSalaryElemenetRowId}_${index}`,
              render: (value: any, row: any, rowIndex: number) =>
                row[rowIndex]?.TGS * (element.numNumberOfPercentage / 100),
            });
          });
          setDynamicHeader(updatedHeader);
        });
      },
    });
  };

  const getEmploymentType = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
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
  const getWorkplaceGroup = () => {
    workG?.action({
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
    workP?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  const getEmployeDepartment = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
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
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
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
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
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
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    payrollGroupDDL?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN DDL",
        IntEmployeeId: employeeId,
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: 0,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
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
        getSalaryLanding();
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
        // const values = form.getFieldsValue(true);
        // const payload = selectedRow.map((item) => {
        //   return {
        //     id: item?.ManualAttendanceId || 0,
        //     accountId: orgId,
        //     attendanceSummaryId: item?.AutoId,
        //     employeeId: item?.EmployeeId,
        //     attendanceDate: item?.AttendanceDate,
        //     inTime: values?.inTime || item?.StartTime,
        //     outTime: values?.outTime || item?.EndTime,
        //     status: item?.isPresent
        //       ? "Present"
        //       : item?.isLeave
        //       ? "Leave"
        //       : "Absent",
        //     requestStatus: values?.attendanceAdujust?.label,
        //     remarks: values?.strReason || "By HR",
        //     isApproved: true,
        //     isActive: true,
        //     isManagement: true,
        //     insertUserId: employeeId,
        //     insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        //     workPlaceGroup: wgId,
        //     businessUnitId: buId,
        //   };
        // });
        // ManualAttendance?.action({
        //   method: "post",
        //   urlKey: "ManualAttendance",
        //   payload,
        //   toast: true,
        //   onSuccess: () => {
        //     form.setFieldsValue({
        //       openModal: false,
        //       attendanceAdujust: undefined,
        //       intime: "",
        //       outtime: "",
        //     });
        //     setSelectedRow([]);
        //     getAttendanceFilterData();
        //   },
        // });
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };

  // Table Header
  const handleIsPerDayChange = (
    value: number,
    rowIndex: number,
    property: string
  ) => {
    setRowDto((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex][property] = value;
      return updatedRows;
    });
  };
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      // fixed: "left",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      // fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      fixed: "left",
    },
    {
      title: "Designation",
      dataIndex: "strDesignationName",
      // sorter: true,
      // filter: true,
      // filterKey: "designationList",
    },
    {
      title: "Department",
      dataIndex: "strDepartmentName",
      // sorter: true,
      // filter: true,
      // filterKey: "departmentList",
    },

    {
      title: "Per Day Salary",
      render: (value: any, row: any, index: number) => (
        <>
          <PSelect
            name={`isPerDay_${index}`}
            options={[
              { value: 1, label: "Yes" },
              { value: 0, label: "No" },
            ]}
            onChange={(value, op) =>
              handleIsPerDayChange(value, index, "isPerDay")
            }
            defaultValue={row.isPerDay}
            rules={[{ required: true, message: "Per Day Salary is required" }]}
          />
        </>
      ),
    },
    {
      title: "Total Gross Salary",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            name={`TGS_${index}`}
            placeholder="Amount"
            rules={[{ required: true, message: "Amount Is Required" }]}
            // disabled={true}
            onChange={(e: any) => handleIsPerDayChange(e, index, "TGS")}
          />
        </>
      ),
    },
    ...dynamicHeader.map((element: any) => {
      return {
        title: element.title,
        dataIndex: element.dataIndex,
        render: (value: any, row: any, index: number) => {
          const salaryBreakdowns = row?.salaryElementsBreakdowns || [];
          const matchingBreakdown = salaryBreakdowns.find(
            (breakdown: any) =>
              breakdown.intSalaryElemenetRowId ===
              element.intSalaryElemenetRowId
          );
          return matchingBreakdown
            ? matchingBreakdown.numNumberOfPercentage
            : null;
        },
      };
    }),
    // {
    //   title: "In-Time",
    //   dataIndex: "InTime",
    // },
    // {
    //   title: "Out-Time",
    //   dataIndex: "OutTime",
    // },
    // {
    //   title: "Total Working Hours",
    //   dataIndex: "WorkingHours",
    // },
    // {
    //   title: "Actual Attendance",
    //   dataIndex: "actualAttendanceStatus",
    //   align: "center",
    //   // render: (data: any, record: any, index: number) => {
    //   //   return (record?.isPresent && record?.isLate) || record?.isLate ? (
    //   //     <PBadge type="warning" text="Late" />
    //   //   ) : record?.isPresent ? (
    //   //     <PBadge type="success" text="Present" />
    //   //   ) : record?.isHoliday === true ? (
    //   //     <PBadge type="secondary" text="Holiday" />
    //   //   ) : record?.isOffday === true ? (
    //   //     <PBadge type="dark" text="Offday" />
    //   //   ) : record?.isLeave ? (
    //   //     <PBadge type="light" text="Leave" />
    //   //   ) : record?.isMovement ? (
    //   //     <PBadge type="dark" text="Movement" />
    //   //   ) : record?.isAbsent ? (
    //   //     <PBadge type="danger" text="Absent" />
    //   //   ) : (
    //   //     ""
    //   //   );
    //   // },
    // },
    // {
    //   title: "Request Attendance",
    //   dataIndex: "RequestStatus",
    //   width: 100,
    //   filter: true,
    //   sorter: false,
    // },
    // {
    //   title: "Approval Status",
    //   dataIndex: "ApplicationStatus",
    //   render: (_: any, record: any) =>
    //     record?.ApplicationStatus === "Approved" ? (
    //       <PBadge text="Approved" type="success" />
    //     ) : record?.ApplicationStatus === "Pending" ? (
    //       <PBadge text="Pending" type="warning" />
    //     ) : record?.ApplicationStatus === "Process" ? (
    //       <PBadge text="Process" type="primary" />
    //     ) : record?.ApplicationStatus === "Rejected" ? (
    //       <PBadge text="Rejected" type="danger" />
    //     ) : (
    //       ""
    //     ),
    //   align: "center",
    //   filter: true,
    //   sorter: false,
    // },
  ];
  useEffect(() => {
    getWorkplaceGroup();
  }, [wgId, buId, wId]);
  console.log({ rowDto });

  return employeeFeature?.isView ? (
    <PForm form={form} initialValues={{}}>
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
              options={workG?.data || []}
              name="workplaceGroup"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                });
                getWorkplace();
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workP?.data || []}
              name="wp"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  wp: op,
                });
                getEmploymentType();
                getEmployeDepartment();
                getEmployeDesignation();
                getEmployeePosition();
                getPayrollGroupDDL();
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
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
          data={rowDto || []}
          loading={bulkLandingAPI?.loading}
          scroll={{ x: 1500 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
            getCheckboxProps: (rec) => {
              console.log(rec);
              // return {
              //   disabled: rec?.ApplicationStatus === "Approved",
              // };
            },
          }}
        />
      </PCard>

      {/* Confirmation Modal */}
      {/* <Form.Item shouldUpdate noStyle>
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
        </Form.Item> */}
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default BulkSalaryAssign;
