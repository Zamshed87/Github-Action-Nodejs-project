import {
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import PBadge from "Components/Badge";
import { ModalFooter, PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AttendanceStatus from "common/AttendanceStatus";
import { AttendanceType } from "../attendenceAdjust/utils/utils";
import ChangedInOutTimeEmpListModal from "../attendenceAdjust/component/ChangedInOutTime";
import { APIUrl } from "App";
import DemoImg from "../../../../assets/images/bigDemo.png";

const updateRowDto = ({
  fieldName,
  value,
  index,
  selectedRow,
  setSelectedRow,
}: any) => {
  const data = [...selectedRow];
  data[index][fieldName] = value;
  setSelectedRow(data);
};
const tableHeadColumn = (
  selectedRow: any,
  setSelectedRow: any,
  isAllChecked: boolean
) => {
  return [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      width: 120,
    },
    {
      title: "Employee ID",
      dataIndex: "EmployeeCode",
      width: 90,
    },
    {
      title: "Attendance Date",
      dataIndex: "AttendanceDate",
      render: (data: any) => moment(data).format("DD-MMM-YYYY"),
      width: 100,
    },
    {
      title: "Actual Attendance",
      dataIndex: "actualAttendanceStatus",
      render: (_: any, record: any) =>
        record?.actualAttendanceStatus === "Present" ? (
          <PBadge text="Present" type="success" />
        ) : record?.actualAttendanceStatus === "Absent" ? (
          <PBadge text="Absent" type="warning" />
        ) : record?.actualAttendanceStatus === "Holiday" ? (
          <PBadge text="Holiday" type="light" />
        ) : record?.actualAttendanceStatus === "Late" ? (
          <PBadge text="Late" type="danger" />
        ) : record?.actualAttendanceStatus === "Offday" ? (
          <PBadge text="Offday" type="light" />
        ) : record?.actualAttendanceStatus === "Leave" ? (
          <PBadge text="Leave" type="light" />
        ) : record?.actualAttendanceStatus === "Movement" ? (
          <PBadge text="Movement" type="light" />
        ) : (
          ""
        ),
      align: "center",
      width: 100,
    },
    {
      title: "Reason",
      dataIndex: "reasonUpdate",
      render: (_: any, record: any, idx: number) => (
        <div>
          <PInput
            type="text"
            placeholder="Write reason"
            value={record?.strReason}
            onChange={(e) => {
              updateRowDto({
                fieldName: "strReason",
                value: e?.target?.value,
                index: idx,
                selectedRow,
                setSelectedRow,
              });
            }}
            disabled={isAllChecked}
          />
        </div>
      ),
      width: 200,
    },
  ];
};

type TAttendenceAdjust = unknown;
const SelfAttendenceAdjust: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const {
    orgId,
    buId,
    wgId,
    wId,
    employeeId,
    intProfileImageUrl,
    userName,
    strDesignation,
  } = useSelector((state: any) => state?.auth?.profileData, shallowEqual);
  const dispatch = useDispatch();
  // States
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);
  const [selectedPayloadState, setSelectedPayloadState] = React.useState<any[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const AttendanceAdjustmentFilter = useApiRequest([]);
  const ManualAttendance = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    getAttendanceFilterData();
  }, [buId, wgId, wId]);

  const getAttendanceFilterData = (isCustom = false) => {
    const { empSearchType, date, tdate, attendanceStatus, department } =
      form.getFieldsValue(true);

    const payload = {
      employeeId: employeeId,
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
      dteAttendanceFromDate: moment(date).format("YYYY-MM-DD"),
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
          ? isCustom
            ? {
                ...payload,
                attendanceToDate: moment(tdate).format("YYYY-MM-DD"),
              }
            : payload
          : {
              ...payload,

              attendanceToDate: moment(tdate).format("YYYY-MM-DD"),
            },
      onSuccess(data) {
        data.forEach((item: any, i: any) => {
          data[i].strReason = null;
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Self Attendence Adjust";
  }, []);

  const submitHandler = async () => {
    if (ManualAttendance?.loading)
      return toast.warn("Please wait for the previous request to complete");

    await form
      .validateFields(["intime", "outtime"])
      .then(() => {
        const values = form.getFieldsValue(true);
        let payload: any[] = [];
        if (values?.attendanceAdujust?.label === "Changed In/Out Time") {
          const isEmpty = selectedPayloadState?.some(
            (item) => !item?.intimeUpdate || !item?.outtimeUpdate
          );
          if (isEmpty) {
            return toast.warn("Please fill all time fields");
          }
          payload = selectedPayloadState.map((item) => {
            const inTImeStr =
              item?.inDateUpdate +
              "T" +
              moment(item?.intimeUpdate).format("HH:mm:ss");
            const outTimeStr =
              item?.outDateUpdate +
              "T" +
              moment(item?.outtimeUpdate).format("HH:mm:ss");
            return {
              id: item?.ManualAttendanceId || 0,
              accountId: orgId,
              attendanceSummaryId: item?.AutoId,
              employeeId: item?.EmployeeId,
              attendanceDate: item?.AttendanceDate,
              inDateTime: inTImeStr || null,
              outDateTime: outTimeStr || null,

              currentStatus: item?.isPresent
                ? "Present"
                : item?.isLeave
                ? "Leave"
                : "Absent",
              requestStatus: values?.attendanceAdujust?.label,
              remarks: item?.reasonUpdate || "By HR",
              isApproved: true,
              isActive: true,
              isManagement: true,
              insertUserId: employeeId,
              insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
              workPlaceGroup: wgId,
              businessUnitId: buId,
              isAdditionalCalendar: item?.isAdditionalCalendar ? true : false,
              additionalCalendarId: item?.isAdditionalCalendar
                ? item?.additionalCalendarId
                : 0,
            };
          });
        } else {
          payload = selectedRow.map((item) => {
            return {
              id: item?.ManualAttendanceId || 0,
              accountId: orgId,
              attendanceSummaryId: item?.AutoId,
              employeeId: item?.EmployeeId,
              attendanceDate: item?.AttendanceDate,
              inDateTime:
                values?.attendanceAdujust?.label === "Absent" ||
                values?.attendanceAdujust?.label === "Late" ||
                values?.attendanceAdujust?.label === "Present"
                  ? null
                  : values?.intime
                  ? moment(values?.intime).format("YYYY-MM-DDTHH:mm:ss")
                  : moment(moment(item?.InTime, "h:mma")).format(
                      "YYYY-MM-DDTHH:mm:ss"
                    ) || null,
              outDateTime:
                values?.attendanceAdujust?.label === "Absent" ||
                values?.attendanceAdujust?.label === "Late" ||
                values?.attendanceAdujust?.label === "Present"
                  ? null
                  : values?.outtime
                  ? moment(values?.outtime).format("YYYY-MM-DDTHH:mm:ss")
                  : moment(moment(item?.OutTime, "h:mma")).format(
                      "YYYY-MM-DDTHH:mm:ss"
                    ) || null,

              currentStatus: item?.isPresent
                ? "Present"
                : item?.isLeave
                ? "Leave"
                : "Absent",
              requestStatus: values?.attendanceAdujust?.label,
              remarks: item?.strReason || "By HR",
              isApproved: true,
              isActive: true,
              isManagement: true,
              insertUserId: employeeId,
              insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
              workPlaceGroup: wgId,
              businessUnitId: buId,
            };
          });
        }
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
              reason: "",
              reasonAll: false,
            });
            setOpenModal(false);
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
    },
    {
      title: "Attendance Date",
      dataIndex: "AttendanceDate",
      render: (data: any) => moment(data).format("DD MMM, YYYY (ddd)"),
      width: 120,
    },
    {
      title: "In Time",
      dataIndex: "",
      render: (data: any) => `${data?.InTime || "-"}`,
      width: 100,
    },
    {
      title: "Out Time",
      dataIndex: "",
      render: (data: any) => `${data?.OutTime || "-"}`,
      width: 100,
    },
    {
      title: "Manual In-Time",
      dataIndex: "",
      render: (data: any) => `${data?.ManulInTime || "-"}`,
      width: 120,
    },
    {
      title: "Manual Out-Time",
      dataIndex: "",
      render: (data: any) => `${data?.ManulOutTime || "-"}`,
      width: 120,
    },
    {
      title: "Total Working Hours",
      dataIndex: "WorkingHours",
      width: 120,
    },
    {
      title: "Actual Attendance",
      dataIndex: "actualAttendanceStatus",
      render: (_: any, record: any) => (
        <AttendanceStatus status={record?.actualAttendanceStatus} rounded />
      ),
      align: "center",
      width: 120,
    },
    {
      title: "Request Attendance",
      dataIndex: "RequestStatus",
      render: (data: any) => <AttendanceStatus status={data} />,
      align: "center",
      width: 130,
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
      sorter: false,
      width: 120,
    },
  ];

  const onCancel = () => {
    form.setFieldsValue({
      attendanceAdujust: undefined,
      reason: "",
      reasonAll: false,
    });
    const modifiedObj = selectedRow?.map((dto) => {
      return {
        ...dto,
        strReason: null,
      };
    });
    setSelectedRow(modifiedObj);
    setOpenModal(false);
  };

  const title = (
    <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
      <img
        src={
          intProfileImageUrl
            ? `${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`
            : DemoImg
        }
        alt="Profile"
        style={{
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <div className="employeeTitle ml-2">
        <p className="employeeName">{userName}</p>
        <p className="employeePosition">{strDesignation}</p>
      </div>
    </div>
  );

  return (
    <PForm
      form={form}
      initialValues={{
        empSearchType: 1,
        date: moment(),
      }}
    >
      <PCard>
        <PCardHeader title={title}>
          <PInput
            type="date"
            picker="month"
            name="date"
            placeholder="Select a month"
            rules={[
              {
                required: true,
                message: "Please Select a month",
              },
            ]}
            onChange={() => {
              getAttendanceFilterData();
              setSelectedRow([]);
            }}
            format={"MMMM-YYYY"}
          />
          <PSelect
            options={AttendanceType}
            name="attendanceAdujust"
            placeholder="Change Attendance"
            style={{ width: "200px" }}
            onSelect={(value: any, op: any) => {
              form.setFieldsValue({
                attendanceAdujust: op,
              });

              value === 4 &&
                form.setFieldsValue({
                  openModal: true,
                  reason: "",
                  intime:
                    selectedRow?.length === 1
                      ? selectedRow[0]?.InTime
                        ? moment(selectedRow[0]?.InTime, "h:mma")
                        : ""
                      : "",
                  outtime:
                    selectedRow?.length === 1
                      ? selectedRow[0]?.OutTime
                        ? moment(selectedRow[0]?.OutTime, "h:mma")
                        : ""
                      : "",
                });

              (value === 1 || value === 2 || value === 3) && setOpenModal(true);
            }}
            disabled={!selectedRow.length}
          />
        </PCardHeader>

        <div className="mt-4">
          <DataTable
            header={header}
            bordered
            data={AttendanceAdjustmentFilter?.data || []}
            loading={AttendanceAdjustmentFilter?.loading}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRow.map((item) => item?.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRow(selectedRows);
              },

              // getCheckboxProps: (rec) => {
              //   return {
              //     disabled: moment(rec?.AttendanceDate, "YYYY-MM-DD").isAfter(
              //       moment().format("YYYY-MM-DD")
              //     ),
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
              width={
                attendanceAdujust?.label !== "Changed In/Out Time" ? 500 : 1200
              }
              open={openModal}
              onCancel={() => {
                form.setFieldsValue({
                  openModal: false,
                  attendanceAdujust: undefined,
                  intime: "",
                  outtime: "",
                  reason: "",
                });
              }}
              title="Are You Sure To Update Attendance?"
              components={
                <PForm
                  form={form}
                  initialValues={{
                    openModal: false,
                    attendanceAdujust: undefined,
                    intime: "",
                    outtime: "",
                    reason: "",
                    calendar: "",
                  }}
                >
                  <>
                    {attendanceAdujust?.label !== "Changed In/Out Time" ? (
                      <>
                        <div>
                          <p>Request Status: {attendanceAdujust?.label}</p>
                          <Row gutter={[10, 2]}>
                            <Col span={12}>
                              <PInput
                                type="date"
                                name="intime"
                                format={"DD/MM/YYYY hh:mm A"}
                                label="Select In-Time"
                                placeholder="Select In-Time"
                                showTime={{ use12Hours: true }}
                              />
                            </Col>
                            <Col span={12}>
                              <PInput
                                type="date"
                                name="outtime"
                                label="Select Out-Time"
                                placeholder="Select Out-Time"
                                format={"DD/MM/YYYY hh:mm A"}
                                showTime={{ use12Hours: true }}
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
                              reason: "",
                              reasonAll: false,
                            });
                          }}
                          onSubmit={submitHandler}
                        />
                      </>
                    ) : (
                      <>
                        <ChangedInOutTimeEmpListModal
                          selectedRow={selectedRow}
                          rowDto={selectedPayloadState}
                          setRowDto={setSelectedPayloadState}
                          value={form?.getFieldsValue(true)}
                        />
                        <ModalFooter
                          submitText="Yes"
                          cancelText="No"
                          onCancel={() => {
                            form.setFieldsValue({
                              openModal: false,
                              attendanceAdujust: undefined,
                              intime: "",
                              outtime: "",
                              reason: "",
                              calendar: "",

                              reasonAll: false,
                            });
                          }}
                          onSubmit={submitHandler}
                        />
                      </>
                    )}
                  </>
                </PForm>
              }
            />
          );
        }}
      </Form.Item>
      {/* Confirmation Modal */}
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { attendanceAdujust, reason } = form.getFieldsValue(true);
          return (
            <PModal
              width={900}
              open={openModal}
              onCancel={onCancel}
              title={`Are you sure to update attendance to ${attendanceAdujust?.label}?`}
              components={
                <PForm form={form}>
                  <>
                    <div style={{ maxHeight: "400px" }}>
                      <p>
                        Request Status:{" "}
                        {(() => {
                          const attendanceMapping: any = {
                            present: { text: "Present", type: "success" },
                            absent: { text: "Absent", type: "warning" },
                            late: { text: "Late", type: "danger" },
                          };

                          const attendanceStatus =
                            attendanceAdujust?.label?.toLowerCase();
                          const badgeProps =
                            attendanceMapping[attendanceStatus];

                          return badgeProps ? (
                            <PBadge
                              text={badgeProps.text}
                              type={badgeProps.type}
                            />
                          ) : null;
                        })()}
                        {/* <strong>{attendanceAdujust?.label}</strong>{" "} */}
                      </p>
                      <Row gutter={[10, 2]}>
                        <Col span={18}>
                          <PInput
                            label="Reason"
                            name={"reason"}
                            type="text"
                            placeholder="Write reason"
                          />
                        </Col>
                        <Col className="mt-3" span={6}>
                          <PInput
                            label="Apply to All?"
                            type="checkbox"
                            name="reasonAll"
                            layout="horizontal"
                            onChange={(e) => {
                              const modifiedObj = selectedRow?.map((dto) => {
                                return {
                                  ...dto,
                                  strReason: reason,
                                };
                              });
                              e.target.checked && setSelectedRow(modifiedObj);
                            }}
                          />
                        </Col>
                      </Row>
                      <div className="mt-2">
                        {selectedRow.length > 0 ? (
                          <DataTable
                            header={tableHeadColumn(
                              selectedRow,
                              setSelectedRow,
                              form.getFieldValue("reasonAll")
                            )}
                            bordered
                            data={selectedRow || []}
                            checkBoxColWidth={50}
                            scroll={{ y: 285 }}
                          />
                        ) : null}
                      </div>
                    </div>

                    <ModalFooter
                      submitText="Update"
                      cancelText="Cancel"
                      onCancel={onCancel}
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

export default SelfAttendenceAdjust;
