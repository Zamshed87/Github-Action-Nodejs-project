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
import { APIUrl } from "App";
import DemoImg from "../../../../assets/images/bigDemo.png";
import PrimaryButton from "common/PrimaryButton";
import { getPeopleDeskAllDDL } from "common/api";

type TAttendanceAdjust = unknown;
const AttendanceShiftChange: React.FC<TAttendanceAdjust> = () => {
  // Data From Store
  const {
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

  const [calenderDDL, setCalenderDDL] = useState([]);
  const getDDL = () => {
    const ddlType = "Calender";
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`,
      "CalenderId",
      "CalenderName",
      setCalenderDDL
    );
  };
  const [openModal, setOpenModal] = useState(false);
  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const AttendanceAdjustmentFilter = useApiRequest([]);
  const ShiftChange = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    getAttendanceFilterData();
  }, [buId, wgId, wId]);

  const getAttendanceFilterData = () => {
    const { date } = form.getFieldsValue(true);
    const yearParam = date ? parseInt(moment(date).format("YYYY")) : "";
    const monthParam = date ? parseInt(moment(date).format("MM")) : "";
    AttendanceAdjustmentFilter?.action({
      urlKey: "GetAttendanceDataOfShiftChange",
      params: {
        MonthId: monthParam,
        YearId: yearParam,
      },
      method: "get",
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Shift Change";
  }, []);

  const submitHandler = async () => {
    if (ShiftChange?.loading)
      return toast.warn("Please wait for the previous request to complete");

    await form
      .validateFields(["calender", "reason"])
      .then(() => {
        const values = form.getFieldsValue(true);
        const payload: Record<string, unknown> = {
          employeeId: employeeId,
          calendarId: values?.calender?.CalenderId,
          remarks: values.reason,
          attendanceListData: selectedRow.map(
            (item) => item?.dteAttendanceDate
          ),
        };
        ShiftChange?.action({
          method: "post",
          urlKey: "CreateNUpdateShiftChangeRequest",
          payload,
          toast: true,
          onSuccess: () => {
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
      dataIndex: "",
      render: (data: any) =>
        moment(data?.dteAttendanceDate).format("DD MMM, YYYY (ddd)"),
      width: 130,
      align: "center",
    },
    {
      title: "Calender Name",
      dataIndex: "runningCalenderName",
      width: 170,
      align: "center",
    },
    {
      title: "Start Time",
      dataIndex: "",
      render: (data: any) => `${data?.runningCalenderStartTime || "-"}`,
      width: 85,
      align: "center",
    },
    {
      title: "End Time",
      dataIndex: "",
      render: (data: any) => `${data?.runningCalenderEndTime || "-"}`,
      width: 85,
      align: "center",
    },
    {
      title: "In Time",
      dataIndex: "",
      render: (data: any) => `${data?.inTime || "-"}`,
      width: 85,
      align: "center",
    },
    {
      title: "Out Time",
      dataIndex: "",
      render: (data: any) => `${data?.outTime || "-"}`,
      width: 85,
      align: "center",
    },
    {
      title: "Req. Calendar Name",
      dataIndex: "",
      render: (data: any) => `${data?.requestedCalendarName || "-"}`,
      width: 150,
      align: "center",
    },
    {
      title: "Prev. Calendar Name",
      dataIndex: "",
      render: (data: any) => `${data?.previousCalendarName || "-"}`,
      width: 150,
      align: "center",
    },
    {
      title: "Attendance Status",
      dataIndex: "",
      render: (_: any, record: any) =>
        record?.attendanceStatus !== "-" ? (
          <AttendanceStatus status={record?.attendanceStatus} rounded />
        ) : (
          "-"
        ),
      align: "center",
      width: 140,
    },
    {
      title: "Approval Status",
      dataIndex: "",
      render: (_: any, record: any) =>
        record?.approvalStatus === "Approved" ? (
          <PBadge text="Approved" type="success" />
        ) : record?.approvalStatus === "Pending" ? (
          <PBadge text="Pending" type="warning" />
        ) : record?.approvalStatus === "Process" ? (
          <PBadge text="Process" type="primary" />
        ) : record?.approvalStatus === "Rejected" ? (
          <PBadge text="Rejected" type="danger" />
        ) : (
          "-"
        ),
      align: "center",
      sorter: false,
      width: 120,
    },
    {
      title: "Remarks",
      dataIndex: "",
      render: (data: any) => `${data?.remarks || "-"}`,
      width: 150,
      align: "center",
    },
  ];

  const onCancel = () => {
    form.setFieldsValue({
      reason: "",
      calender: null,
    });
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
          <PrimaryButton
            type="button"
            className="btn btn-default flex-center"
            label="Change Shift"
            customStyle={{}}
            icon=""
            disabled={!selectedRow.length}
            onClick={() => {
              getDDL();
              setOpenModal(true);
            }}
          />
        </PCardHeader>

        <div>
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
            }}
            checkBoxColWidth={50}
          />
        </div>
      </PCard>

      {/* Confirmation Modal */}
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { calender } = form.getFieldsValue(true);
          return (
            <PModal
              width={900}
              open={openModal}
              onCancel={onCancel}
              title={`Are you sure about changing Shift?`}
              components={
                <PForm form={form} initialValues={{ reason: "", calendar: "" }}>
                  <>
                    <div style={{ maxHeight: "400px" }}>
                      <Row gutter={[10, 2]}>
                        <Col span={8}>
                          <PSelect
                            options={calenderDDL || []}
                            name="calender"
                            label="Calender"
                            placeholder="Calender"
                            showSearch
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                calender: op,
                              });
                            }}
                            rules={[
                              {
                                required: calender == undefined,
                                message: "Calender is required",
                              },
                            ]}
                          />
                        </Col>
                        <Col span={16}>
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

export default AttendanceShiftChange;
