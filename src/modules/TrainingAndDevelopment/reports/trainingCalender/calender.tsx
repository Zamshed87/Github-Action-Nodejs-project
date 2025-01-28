import type { CalendarProps } from "antd";
import { Badge, Calendar, Card, Col, Form, List, Row, Select } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PCardBody, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import UserInfoCommonField from "../userInfoCommonField";
import "./calender.css";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const firstSegment = location.pathname.split("/")[1];
  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (firstSegment !== "SelfService" && item?.menuReferenceId === 30515) {
      permission = item;
    }
    if (firstSegment === "SelfService" && item?.menuReferenceId === 30515) {
      permission = item;
    }
  });
  dispatch(
    setFirstLevelNameAction(
      firstSegment === "SelfService"
        ? "Employee Self Service"
        : "Training & Development"
    )
  );
  const { buId, wgId, employeeId, orgId } = profileData;
  const [form] = Form.useForm();
  const [calenderData, getCalenderData, loadingCalender, setCalenderData] =
    useAxiosGet();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [month, setMonth] = useState(moment().format("MM"));
  const [year, setYear] = useState(moment().format("YYYY"));

  const monthCellRender = (value: moment.Moment) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const getListData = (value: moment.Moment) => {
    const date = value.format("YYYY-MM-DD");
    const day = calenderData?.days?.find(
      (d: any) => moment(d?.date).format("YYYY-MM-DD") === date
    );
    return day ? day?.trainingCalendarDto : [];
  };

  const dateCellRender = (value: moment.Moment) => {
    const listData = getListData(value);
    return (
      <div
        id="dashboard-calendar-specific"
        className="events"
        onClick={() => {
          setModalData(listData);
          setIsModalVisible(true);
        }}
      >
        <ul>
          {listData.map((item: any) => (
            <li key={item.trainingId} id="dashboard-calendar-specific">
              {item?.status?.value == 3 ? (
                <Badge
                  className="custom-badge"
                  status="error"
                  text={`${item.trainingTitle} `}
                />
              ) : item?.status?.value == 1 ? (
                <Badge
                  className="custom-badge"
                  status="processing"
                  text={`${item.trainingTitle}`}
                />
              ) : item?.status?.value == 0 ? (
                <Badge
                  className="custom-badge"
                  status="warning"
                  text={`${item.trainingTitle}`}
                />
              ) : (
                <Badge
                  className="custom-badge"
                  status="success"
                  text={`${item.trainingTitle}`}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const onPanelChange = (
    value: moment.Moment,
    mode: CalendarProps<moment.Moment>["mode"]
  ) => {
    const values = form.getFieldsValue(true);
    const month = value.format("MM");
    const year = value.format("YYYY");
    console.log(value.format("YYYY-MM"), mode); // This will log only the month and year
    setMonth(month);
    setYear(year);
    // getCalenderData(
    //   `/Training/Training/Calander?businessUnitId=${values?.bUnit?.value}&workplaceGroupId=${values?.workplaceGroup?.value}&workplaceId=${values?.workplace?.value}&month=${month}&year=${year}`
    // );
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
        <Row justify="start" gutter={8}>
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

  const bUnit = Form.useWatch("bUnit", form);
  const workplaceGroup = Form.useWatch("workplaceGroup", form);
  const workplace = Form.useWatch("workplace", form);

  useEffect(() => {
    const values = form.getFieldsValue(true);
    console.log(month, year, bUnit, workplaceGroup, workplace);
    if (
      month &&
      year &&
      bUnit &&
      bUnit?.intBusinessUnitId !== 0 &&
      workplaceGroup &&
      workplaceGroup?.intWorkplaceGroupId !== 0 &&
      workplace &&
      workplace?.intWorkplaceId !== 0
    ) {
      getCalenderData(
        `/Training/Calander?businessUnitId=${
          values?.bUnit?.value || 0
        }&workplaceGroupId=${values?.workplaceGroup?.value || 0}&workplaceId=${
          values?.workplace?.value || 0
        }&month=${month}&year=${year}`
      );
    }
  }, [month, year, bUnit, workplaceGroup, workplace]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    getCalenderData(
      `/Training/Calander?businessUnitId=${0}&workplaceGroupId=${0}&workplaceId=${0}&month=${month}&year=${year}`
    );
  }, []);

  return permission?.isView ? (
    <div>
      {loadingCalender && <Loading />}
      <PForm
        form={form}
        initialValues={{
          bUnit: { label: "All", value: 0 },
          workplaceGroup: { label: "All", value: 0 },
          workplace: { label: "All", value: 0 },
        }}
      >
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
        {/* <div style={{ height: "40%", width: "100%", padding: "30px" }}>
          <Calendar
            onPanelChange={onPanelChange}
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
            headerRender={customHeaderRender}
          />
        </div> */}
      </PForm>
      <div id="dashboard-calendar-specific" className="calendar-container">
        <Calendar
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          headerRender={customHeaderRender}
        />
      </div>
      <PModal
        open={isModalVisible}
        title={""}
        width={450}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        maskClosable={false}
        components={
          <List
            dataSource={modalData}
            renderItem={(item: any) => (
              <List.Item>
                <Card bordered={true} style={{ width: "100%" }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <h3>{item.trainingTitle}</h3>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Time:</strong>{" "}
                        {`${item.startTime} - ${item.endTime}`}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Status:</strong> {item?.status?.label || "N/A"}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Training Mode:</strong>{" "}
                        {item?.trainingModeStatus?.label || "N/A"}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Objectives:</strong> {item.objectives}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        }
      />
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TrainingCalender;
