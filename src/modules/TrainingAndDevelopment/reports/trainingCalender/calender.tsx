import React, { useEffect, useState } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Col, Form, Row, Select, SelectProps } from "antd";
import moment from "moment";
import "./calender.css";
import { PButton, PCardBody, PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import UserInfoCommonField from "../userInfoCommonField";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import Loading from "common/loading/Loading";

const getListData = (value: moment.Moment) => {
  let listData: { type: string; content: string }[] = []; // Specify the type of listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is war" },
        { type: "success", content: "This is us" },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is war." },
        { type: "success", content: "This ist." },
        { type: "error", content: "Thient." },
      ];
      break;
    case 16:
      listData = [
        { type: "warning", content: "This it" },
        { type: "success", content: "This.." },
        { type: "error", content: "Th1." },
        { type: "error", content: "Thist 2." },
        { type: "error", content: "This int 3." },
        { type: "error", content: "This ient 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: moment.Moment) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const TrainingCalender: React.FC = () => {
  const dispatch = useDispatch();
  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;
  const [form] = Form.useForm();
  const [calenderData, getCalenderData, loadingCalender, setCalenderData] =
    useAxiosGet();

  const monthCellRender = (value: moment.Moment) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const days = [
    {
      date: "2024-12-01T00:00:00",
      trainingCalendarDto: [
        {
          trainingId: 17,
          trainingTitle: "Kotlin Development",
          trainingDate: "2024-12-01T00:00:00",
          trainingName: "Database Management",
          startTime: "03:00:00",
          endTime: "06:00:00",
          venueAddress: "asdasd",
          objectives: "aasd",
          trainingModeStatus: 0,
          trainingOrganizerType: 0,
          status: null,
        },
        {
          trainingId: 19,
          trainingTitle: "Kotlin Development",
          trainingDate: "2024-12-01T00:00:00",
          trainingName: "Database Management",
          startTime: "06:00:00",
          endTime: "19:00:00",
          venueAddress: "ASDASD",
          objectives: "ADNAN",
          trainingModeStatus: 0,
          trainingOrganizerType: 0,
          status: null,
        },
        {
          trainingId: 21,
          trainingTitle: "SQL",
          trainingDate: "2024-12-01T00:00:00",
          trainingName: "Database Management",
          startTime: "01:00:00",
          endTime: "02:00:00",
          venueAddress: "dddd",
          objectives: "sdfsdf",
          trainingModeStatus: 0,
          trainingOrganizerType: 0,
          status: null,
        },
        {
          trainingId: 26,
          trainingTitle: "Kotlin Development",
          trainingDate: "2024-12-01T00:00:00",
          trainingName: "Database Management",
          startTime: "01:00:00",
          endTime: "04:00:00",
          venueAddress: "sdss",
          objectives: "dfsgsd",
          trainingModeStatus: 0,
          trainingOrganizerType: 0,
          status: null,
        },
      ],
    },
    {
      date: "2024-12-08T00:00:00",
      trainingCalendarDto: [
        {
          trainingId: 25,
          trainingTitle: "Kotlin Development",
          trainingDate: "2024-12-08T00:00:00",
          trainingName: "DevOps ",
          startTime: "03:00:00",
          endTime: "20:00:00",
          venueAddress: "asdasd",
          objectives: "asdad",
          trainingModeStatus: 0,
          trainingOrganizerType: 0,
          status: null,
        },
      ],
    },
  ];

  const getListData = (value: moment.Moment) => {
    const date = value.format("YYYY-MM-DD");
    const day = days.find((d) => moment(d?.date).format("YYYY-MM-DD") === date);
    return day ? day?.trainingCalendarDto : [];
  };

  const dateCellRender = (value: moment.Moment) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item: any) => (
          <li key={item.trainingId}>
            <Badge
              status="success"
              text={`${item.trainingTitle} (${item.startTime} - ${item.endTime})`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const onPanelChange = (
    value: moment.Moment,
    mode: CalendarProps<moment.Moment>["mode"]
  ) => {
    const month = value.format("MM");
    const year = value.format("YYYY");
    console.log(value.format("YYYY-MM"), mode); // This will log only the month and year
    getCalenderData(
      `/Training/Training/Calander?businessUnitId=0&workplaceGroupId=0&workplaceId=0&month=${month}&year=${year}`
    );
  };

  const customHeaderRender = ({ value, onChange }: any) => {
    const monthOptions = [];
    const current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let index = 0; index < 12; index++) {
      monthOptions.push(
        <Select.Option key={index} value={index}>
          {months[index]}
        </Select.Option>
      );
    }

    const month = value.month();
    const year = value.year();
    const yearOptions = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      yearOptions.push(
        <Select.Option key={i} value={i}>
          {i}
        </Select.Option>
      );
    }

    return (
      <div style={{ padding: 8 }}>
        <Row justify="end" gutter={8}>
          <Col>
            <Select
              value={year}
              onChange={(newYear) => {
                const now = value.clone().year(newYear);
                onChange(now);
              }}
              style={{ width: 100 }}
            >
              {yearOptions}
            </Select>
          </Col>
          <Col>
            <Select
              value={month}
              onChange={(newMonth) => {
                const now = value.clone().month(newMonth);
                onChange(now);
              }}
              style={{ width: 100 }}
            >
              {monthOptions}
            </Select>
          </Col>
        </Row>
      </div>
    );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    const currentMonth = moment().format("MM");
    const currentYear = moment().format("YYYY");
    getCalenderData(
      `/Training/Training/Calander?businessUnitId=0&workplaceGroupId=0&workplaceId=0&month=${currentMonth}&year=${currentYear}`
    );
  }, []);

  return (
    <div>
      {loadingCalender && <Loading />}
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader title="Training Calander" />
        <PCardBody styles={{ marginTop: "20px" }}>
          <Row gutter={[10, 2]}>
            <UserInfoCommonField form={form} />
            {/* <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "22px" }}
                type="primary"
                content="View"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                      // landingApiCall(values);
                    })
                    .catch(() => {});
                }}
              />
            </Col> */}
          </Row>
        </PCardBody>

        {/* </PCard> */}
        <div style={{ height: "40%", width: "100%", padding: "30px" }}>
          <Calendar
            onPanelChange={onPanelChange}
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
            headerRender={customHeaderRender}
          />
        </div>
      </PForm>
    </div>
  );
};

export default TrainingCalender;
