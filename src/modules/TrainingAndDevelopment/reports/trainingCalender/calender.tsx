import React, { useEffect } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Col, Form, Row } from "antd";
import moment from "moment";
import "./calender.css";
import { PButton, PCardBody, PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

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

  const getBUnitDDL = useApiRequest({});
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

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
      Date: "2024-12-20T00:00:00",
      Events: [
        {
          TrainingId: 1,
          TrainingTitle: "Leadership Training",
          TrainingName: "Advanced Leadership Skills",
          StartTime: "09:00:00",
          EndTime: "12:00:00",
          VenueAddress: "123 Business St., City",
          Objectives: "Improve leadership skills",
          TrainingModeStatus: 1,
          TrainingOrganizerType: 2,
          Status: 1,
        },
        {
          TrainingId: 2,
          TrainingTitle: "Leadership Training",
          TrainingName: "Effective Communication",
          StartTime: "13:00:00",
          EndTime: "16:00:00",
          VenueAddress: "123 Business St., City",
          Objectives: "Enhance communication skills",
          TrainingModeStatus: 1,
          TrainingOrganizerType: 2,
          Status: 1,
        },
      ],
    },
    {
      Date: "2024-12-21T00:00:00",
      Events: [
        {
          TrainingId: 3,
          TrainingTitle: "Technical Skills Training",
          TrainingName: "Advanced Java Programming",
          StartTime: "10:00:00",
          EndTime: "16:00:00",
          VenueAddress: "456 Tech Ave., City",
          Objectives: "Enhance Java programming skills",
          TrainingModeStatus: 1,
          TrainingOrganizerType: 1,
          Status: 1,
        },
      ],
    },
  ];

  const getListData = (value: moment.Moment) => {
    const date = value.format("YYYY-MM-DD");
    const day = days.find((d) => moment(d.Date).format("YYYY-MM-DD") === date);
    return day ? day.Events : [];
  };
  const dateCellRender = (value: moment.Moment) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item: any) => (
          <li key={item.TrainingId}>
            <Badge
              status="success"
              text={`${item.TrainingName} (${item.StartTime} - ${item.EndTime})`}
            />
          </li>
        ))}
      </ul>
    );
  };

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
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
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  const onPanelChange = (
    value: moment.Moment,
    mode: CalendarProps<moment.Moment>["mode"]
  ) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    getBUnitDDL.action({
      urlKey: "BusinessUnitWithRoleExtension",
      method: "GET",
      params: {
        workplaceGroupId: wgId,
        businessUnitId: buId,
        empId: employeeId || 0,
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
    getWorkplaceGroup();
  }, [buId, wgId]);

  return (
    <div>
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader title="Training Calander" />
        <PCardBody styles={{ marginTop: "20px" }}>
          <Row gutter={[10, 2]}>
            <Col md={6} sm={12} xs={24}>
              <PSelect
                options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
                name="bUnit"
                label="Business Unit"
                showSearch
                filterOption={true}
                placeholder="Business Unit"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    bUnit: op,
                  });
                }}
                rules={[
                  { required: true, message: "Business Unit is required" },
                ]}
              />
            </Col>
            <Col md={6} sm={12} xs={24}>
              <PSelect
                options={workplaceGroup?.data || []}
                name="workplaceGroup"
                label="Workplace Group"
                placeholder="Workplace Group"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplaceGroup: op,
                    workplace: undefined,
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
                options={workplace?.data || []}
                name="workplace"
                label="Workplace"
                placeholder="Workplace"
                // disabled={+id ? true : false}
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                  // getEmployeDepartment();
                  // getEmployeePosition();

                  //   getDesignation();
                }}
                rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "22px" }}
                type="primary"
                content="View"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      // landingApiCall(values);
                    })
                    .catch(() => {});
                }}
              />
            </Col>
          </Row>
        </PCardBody>

        {/* </PCard> */}
      </PForm>
      <div style={{ height: "40%", width: "100%", padding: "30px" }}>
        <Calendar
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
        />
      </div>
    </div>
  );
};

export default TrainingCalender;
