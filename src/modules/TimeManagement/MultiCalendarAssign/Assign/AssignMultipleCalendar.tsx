import {
  DataTable,
  PButton,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, message } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
type AssignMultipleCalendarType = {
  setOpen: any;
  selectedRowData: any;
};
const AssignMultipleCalendar: React.FC<AssignMultipleCalendarType> = ({
  setOpen,
  selectedRowData,
}) => {
  // Data From Store
  const { buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // States
  const [rowData, setRowData] = React.useState<any>(null);

  const [form] = Form.useForm();

  const DatewiseCalanderForEmployee = useApiRequest([]);
  const CalendarDDL = useApiRequest([]);
  const AssignMultiCalander = useApiRequest([]);

  const getEmpCalendarInfo = () => {
    const { date } = form.getFieldsValue(true);
    DatewiseCalanderForEmployee?.action({
      urlKey: "DatewiseCalanderForEmployee",
      method: "GET",
      params: {
        employeeId: selectedRowData?.employeeId,
        attendanceDate: moment(date).format("YYYY-MM-DD"),
      },
      onSuccess: (data) => {
        const modifyData = data?.map((item: any) => {
          return {
            ...item,
            isSrc: true,
          };
        });
        setRowData(modifyData);
      },
    });
  };
  const getCalendarList = () => {
    CalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Calender",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, i: number) => {
          data[i].value = item.CalenderId;
          data[i].label = item.CalenderName;
        });
      },
    });
  };

  useEffect(() => {
    selectedRowData && getCalendarList();
  }, [selectedRowData]);

  const addCalendar = async () => {
    await form
      .validateFields()
      .then((values) => {
        const { date, calendar } = values;
        const isExist = rowData?.some(
          (itm: any) => itm.calendarId === calendar?.value
        );
        if (isExist)
          return message.warning(
            "Same calendar can not be added multiple times"
          );
        const data = {
          timeAttendanceDailySummaryId: 0,
          timeAttendanceDailySummaryDetailsId: 0,
          nightShift: false,
          employeeId: selectedRowData?.employeeId,
          employeeName: selectedRowData?.employeeName,
          attendenceDate: moment(date).format("YYYY-MM-DD"),
          calendarId: calendar?.value,
          calendarName: calendar?.label,
        };
        setRowData((prev: any) => [...prev, data]);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
      .catch((info) => {});
  };

  const submitHandler = async () => {
    // Checking validation
    if (!rowData?.length) return message.warning("No data found");
    // Checking changes
    const isChanged = rowData?.some((item: any) => !item?.isSrc);

    if (!isChanged) return message.warning("No changes found");
    const payload = rowData?.map((item: any) => {
      const data = {
        ...item,
        timeAttendanceDailySummaryId: item?.timeAttendanceDailySummaryId || 0,
        timeAttendanceDailySummaryDetailsId:
          item?.timeAttendanceDailySummaryDetailsId || 0,
        createdBy: employeeId,
      };
      return data;
    });

    // API Call
    AssignMultiCalander?.action({
      urlKey: "AssignMultiCalander",
      method: "POST",
      payload: payload,
      toast: true,
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const header = [
    {
      title: "SL",
      render: (data: any, rec: any) => rec.key + 1,
      align: "center",
    },
    { title: "Calendar Name", dataIndex: "calendarName" },
    {
      title: "Action",
      render: (data: any, rec: any, idx: number) => {
        return (
          <TableButton
            buttonsList={[
              {
                isActive: !rec?.isSrc,
                type: "delete",
                onClick: () => {
                  const filterData = rowData?.filter(
                    (item: any, i: number) => idx !== i
                  );
                  setRowData(filterData);
                },
              },
            ]}
          />
        );
      },
      align: "center",
    },
  ];

  return (
    <PForm form={form}>
      <Row gutter={[10, 2]} className="mb-2">
        <Col span={10}>
          <PInput
            type="date"
            name="date"
            label="Attandance Date"
            rules={[{ required: true, message: "Attandance date required" }]}
            onChange={() => {
              getEmpCalendarInfo();
            }}
            disabled={rowData?.filter((item: any) => !item?.isSrc)?.length > 0}
          />
        </Col>
        <Col span={10}>
          <PSelect
            options={CalendarDDL?.data || []}
            name="calendar"
            label="Calendar"
            placeholder="Select Calendar"
            rules={[{ required: true, message: "Calendar required" }]}
            onChange={(value: any, op: any) => {
              form.setFieldsValue({
                calendar: op,
              });
            }}
          />
        </Col>
        <Col span={4} style={{ marginTop: "24px" }}>
          <PButton type="primary" content="Add" onClick={addCalendar} />
        </Col>
      </Row>
      {/* Table  */}
      <DataTable
        title={"Calendar List"}
        header={header}
        data={rowData || []}
        loading={DatewiseCalanderForEmployee?.loading}
        bordered
      />

      {/* Footer  */}
      <ModalFooter
        onSubmit={submitHandler}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </PForm>
  );
};

export default AssignMultipleCalendar;
