import { PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
type AssignMultipleCalendarType = {
  setOpen: any;
  rowData: any;
};
const AssignMultipleCalendar: React.FC<AssignMultipleCalendarType> = ({
  setOpen,
  rowData,
}) => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const [form] = Form.useForm();

  const DatewiseCalanderForEmployee = useApiRequest({});
  const CalendarDDL = useApiRequest({});

  const getEmpCalendarInfo = () => {
    const { date } = form.getFieldsValue(true);
    DatewiseCalanderForEmployee?.action({
      urlKey: "DatewiseCalanderForEmployee",
      method: "GET",
      params: {
        employeeId: rowData?.employeeId,
        attendanceDate: moment(date).format("YYYY-MM-DD"),
      },
    });
  };
  const getCalendarList = () => {
    CalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
    });
  };
  useEffect(() => {
    rowData && getCalendarList();
  }, [rowData]);

  return (
    <PForm form={form}>
      <Row gutter={[10, 2]}>
        <Col span={12}>
          <PInput
            type="date"
            name="date"
            label="Attandance Date"
            onChange={() => {
              getEmpCalendarInfo();
            }}
          />
        </Col>
        <Col span={12}>
          <PSelect
            options={CalendarDDL?.data || []}
            name="calendar"
            label="Attandance Date"
          />
        </Col>
      </Row>
      <ModalFooter
        onSubmit={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </PForm>
  );
};

export default AssignMultipleCalendar;
