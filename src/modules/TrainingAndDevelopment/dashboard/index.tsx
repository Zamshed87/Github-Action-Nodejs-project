import {
  CalculatorOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/plots";
import { BarChartOutlined, PieChartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Popover,
  Row,
  Skeleton,
  Table,
  Typography,
} from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import UserInfoCommonField from "../reports/userInfoCommonField";
import DurationChart from "./chart/duration";
import PerticipantsChart from "./chart/perticipants";
import {
  createLineConfig,
  createTrainingModes,
  formateFilterData,
  getRandomGradient,
  pieConfigCostPerParticipants,
  pieConfigNoOfTraining,
  pieConfigParticipants,
  pieConfigTotalCost,
  tableColumns,
  tableColumns2,
  tableColumns3,
  tableColumns4,
} from "./helper";
import "./style.css";
import { getEnumData } from "common/api/commonApi";
import { getSerial } from "Utils";
import { typeDataSetForTrainerOrg } from "../helpers";

const { Title } = Typography;

// need to refactor code

// Bar Chart Data
const barData = [
  { month: "Jul", participants: 24, duration: 106 },
  { month: "Aug", participants: 34, duration: 200 },
  { month: "Sep", participants: 20, duration: 164 },
  { month: "Oct", participants: 30, duration: 130 },
  { month: "Nov", participants: 22, duration: 135 },
  { month: "Dec", participants: 29, duration: 146 },
  { month: "Jan", participants: 26, duration: 122 },
  { month: "Feb", participants: 27, duration: 110 },
  { month: "Mar", participants: 16, duration: 125 },
  { month: "Apr", participants: 21, duration: 189 },
  { month: "May", participants: 14, duration: 157 },
  { month: "Jun", participants: 32, duration: 189 },
];

// Line Chart Data
const lineData = [
  { month: "Jul-23", value: 2 },
  { month: "Aug-23", value: 1 },
  { month: "Sep-23", value: 4 },
  { month: "Oct-23", value: 0 },
  { month: "Nov-23", value: 1 },
  { month: "Dec-23", value: 0 },
  { month: "Jan-24", value: 0 },
  { month: "Feb-24", value: 0 },
  { month: "Mar-24", value: 0 },
  { month: "Apr-24", value: 0 },
  { month: "May-24", value: 0 },
  { month: "Jun-24", value: 0 },
];

// Column Chart Config
const columnConfig = {
  data: barData,
  xField: "month",
  yField: "participants",
  label: { position: "middle", style: { fill: "#FFFFFF", opacity: 0.6 } },
  color: "#1890ff",
};

// Line Chart Config
const lineConfig = {
  data: lineData,
  xField: "month",
  yField: "value",
  smooth: false,
  point: {
    size: 5,
    shape: "diamond",
    style: {
      fill: "white",
      stroke: "#ff4d4f",
      lineWidth: 2,
    },
  },
  color: "#ff4d4f",
};

const TnDDashboard = () => {
  const dispatch = useDispatch();

  const [summaryCard, getSummaryCard, summaryCardLoading, , summaryCardError] =
    useAxiosGet();
  const [
    trininingModeSummary,
    getTrininingModeSummary,
    trininingModeSummaryLoading,
    setTrininingModeSummary,
    trininingModeSummaryError,
  ] = useAxiosGet();

  const [
    upcommingTrainingSummary,
    getUpcommingTrainingSummary,
    upcommingTrainingSummaryLoading,
    ,
    upcommingTrainingSummaryError,
  ] = useAxiosGet();

  const [
    trainingSummaryByMonth,
    getTrainingSummaryByMonth,
    trainingSummaryByMonthLoading,
    setTrainingSummaryByMonth,
    trainingSummaryByMonthError,
  ] = useAxiosGet();

  const [
    participantsByMonthSummary,
    getParticipantsByMonthSummary,
    participantsByMonthLoading,
    setParticipantsByMonth,
    participantsByMonthError,
  ] = useAxiosGet();

  const [
    trainingTypeDDL,
    getTrainingTypeDDL,
    loadingTrainingType,
    setTrainingType,
  ] = useAxiosGet();
  const [
    nameOfTrainerOrgDDL,
    getNameOfTrainerOrgDDL,
    loadingTrainerOrg,
    setNameOfTrainerOrg,
  ] = useAxiosGet();
  const [trainingModeStatusDDL, setTrainingModeStatusDDL] = useState<any>([]);
  const [chartShow, setChartShow] = useState(false);

  const getTrainingModeSummaryDataSetUp = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      list.push({
        noOfTraining: Math.trunc(d?.numberOfTrainings || 0),
        name: d?.trainingModeStatus?.label || "",
        numberOfParticipants: Math.trunc(d?.numberOfParticipants || 0),
        costPerParticipant: Math.trunc(d?.costPerParticipant || 0),
        totalCost: Math.trunc(d?.totalCost || 0),
      });
    });
    console.log(list);
    setTrininingModeSummary(
      list && list.length > 0
        ? list
        : createTrainingModes(trainingModeStatusDDL)
    );
  };

  const landingApiCall = (values: any) => {
    getSummaryCard(
      `/Dashboard/Training/Dashboard/SummaryCard${formateFilterData(values)}`
    );

    getTrininingModeSummary(
      `/Dashboard/Training/Dashboard/TrainingMode${formateFilterData(values)}`,
      getTrainingModeSummaryDataSetUp
    );

    setOpenFilter(false);
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    getEnumData("TrainingModeStatus", setTrainingModeStatusDDL);

    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getNameOfTrainerOrgDDL(
      "/TrainerInformation/Training/TrainerInformation?pageNumber=1&pageSize=200",
      (data: any) => {
        typeDataSetForTrainerOrg(data, setNameOfTrainerOrg, true);
      }
    );
    getSummaryCard(`/Dashboard/Training/Dashboard/SummaryCard`);
    getTrininingModeSummary(
      "/Dashboard/Training/Dashboard/TrainingMode",
      getTrainingModeSummaryDataSetUp
    );
    getUpcommingTrainingSummary("/Dashboard/Training/Dashboard/UpComming");
    setChartShow(false);
    getParticipantsByMonthSummary(
      "/Dashboard/Training/Dashboard/ParticipantsByMonth",
      () => {
        getTrainingSummaryByMonth(
          "/Dashboard/Training/Dashboard/TrainingSummaryByMonth",
          () => {
            setChartShow(true);
          }
        );
      }
    );
  }, []);

  const upcommingTableheader: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          // currentPage: landingApi?.data?.currentPage,
          // pageSize: landingApi?.data?.pageSize,
          currentPage: 1,
          pageSize: 1000, // need to change
          index,
        }),
      fixed: "left",
      align: "center",
      width: 35,
    },
    {
      title: "Organization",
      dataIndex: "organization",
      filter: true,
      filterKey: "organizationList",
      filterSearch: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Training Date",
      dataIndex: "trainingDate",
      width: 50,
      fixed: "left",
    },
    {
      title: "Training Type",
      dataIndex: "trainingType",
      filter: true,
      filterKey: "trainingTypeList",
      filterSearch: true,
      width: 80,
      fixed: "left",
    },
    {
      title: "Training Title",
      dataIndex: "trainingTitle",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
      width: 80,
      fixed: "left",
    },
    {
      title: "Training Organizer",
      dataIndex: "trainingOrganizer",
      // filter: true,
      // filterKey: "trainingOrganizerList",
      // filterSearch: true,
      width: 50,
      render: (_: any, rec: any) => rec?.trainingOrganizer?.label,
    },
    {
      title: "Training Venue",
      dataIndex: "trainingVenue",
      filter: true,
      filterKey: "trainingVenueList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Training Mode",
      dataIndex: "trainingMode",
      width: 50,
      render: (_: any, rec: any) => rec?.trainingMode?.label,
    },
    {
      title: "Duration",
      dataIndex: "trainingDuration",
      filter: true,
      filterKey: "trainingDurationList",
      filterSearch: true,
      width: 35,
    },
    {
      title: "Participants",
      dataIndex: "totalParticipants",
      width: 55,
    },
    {
      title: "Trainer Details",
      dataIndex: "trainerDetails",
      width: 30,
      render: (Id: number, rec: any) => {
        // Process trainerDetails to create a unique, comma-separated list
        const trainerList: any[] = Array.from(
          new Set(
            (rec?.trainerDetails || "")
              .split(",")
              .map((detail: string) => detail.trim())
          )
        ).filter((detail: any) => detail !== "");

        return (
          <Popover
            content={
              <div>
                {trainerList.length > 0 ? (
                  <ul>
                    {trainerList.map((trainer: string, index: number) => (
                      <li key={index}>{trainer}</li>
                    ))}
                  </ul>
                ) : (
                  <span>No trainer details available</span>
                )}
              </div>
            }
            title="Trainer Details"
          >
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
            />
          </Popover>
        );
      },
    },
  ];

  const typeDataSetForType = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    list.unshift({ label: "All", value: 0 });
    setTrainingType(list);
  };

  const [openFilter, setOpenFilter] = useState(false);

  const getSummaryCardCount = () => {
    return [
      {
        title: "Total Training Count",
        count: Math.trunc(summaryCard?.totalTrainingCount || 0),
        icon: <TeamOutlined style={{ fontSize: "30px", color: "#4caf50" }} />,
      },
      {
        title: "Total Training Hour",
        count: Math.trunc(summaryCard?.totalTrainingHours || 0),
        icon: (
          <ClockCircleOutlined style={{ fontSize: "30px", color: "#ff9800" }} />
        ),
      },
      {
        title: "Total Participant",
        count: Math.trunc(summaryCard?.totalParticipantCount || 0),
        icon: <UserOutlined style={{ fontSize: "30px", color: "#3f51b5" }} />,
      },
      {
        title: "Total Feedback Count",
        count: Math.trunc(summaryCard?.totalFeedbackCount || 0),
        icon: (
          <MessageOutlined style={{ fontSize: "30px", color: "#e91e63" }} />
        ),
      },
      {
        title: "Total Assessment Count",
        count: Math.trunc(summaryCard?.totalAssessmentCount || 0),
        icon: (
          <FileTextOutlined style={{ fontSize: "30px", color: "#607d8b" }} />
        ),
      },
      {
        title: "Total Attendance Count",
        count: Math.trunc(summaryCard?.totalAttendanceCount || 0),
        icon: (
          <UserSwitchOutlined style={{ fontSize: "30px", color: "#673ab7" }} />
        ),
      },
      {
        title: "Total Training Cost",
        count: Math.trunc(summaryCard?.totalTrainingCost || 0),
        icon: (
          <DollarCircleOutlined
            style={{ fontSize: "30px", color: "#4caf50" }}
          />
        ),
      },
      {
        title: "Cost Per Participant",
        count: Math.trunc(summaryCard?.costPerParticipant || 0),
        icon: (
          <CalculatorOutlined style={{ fontSize: "30px", color: "#ff5722" }} />
        ),
      },
      {
        title: "Actual Cost Per Participant",
        count: Math.trunc(summaryCard?.actualCostPerParticipant || 0),
        icon: (
          <BarChartOutlined style={{ fontSize: "30px", color: "#009688" }} />
        ),
      },
      {
        title: "Actual Cost Per Hour",
        count: Math.trunc(summaryCard?.actualCostPerHour || 0),
        icon: (
          <PieChartOutlined style={{ fontSize: "30px", color: "#2196f3" }} />
        ),
      },
    ];
  };

  // Form Instance
  const [form] = Form.useForm();
  return (
    <div style={{ padding: "10px" }}>
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={``}
            buttonList={[
              {
                type: "primary",
                content: "Filter",
                icon: "plus",
                onClick: () => {
                  setOpenFilter(true);
                },
              },
            ]}
          />
        </PCard>
      </PForm>
      <Drawer
        title="Filter"
        onClose={() => setOpenFilter(false)}
        open={openFilter}
      >
        <PForm form={form} initialValues={{}}>
          <Row gutter={[10, 2]}>
            <Col md={12} sm={24}>
              <PInput
                type="date"
                name="fromDate"
                label="From Date"
                placeholder="From Date"
                onChange={(value) => {
                  form.setFieldsValue({
                    fromDate: value,
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: "From Date is required",
                  },
                ]}
              />
            </Col>
            <Col md={12} sm={24}>
              <PInput
                type="date"
                name="toDate"
                label="To Date"
                placeholder="To Date"
                onChange={(value) => {
                  form.setFieldsValue({
                    toDate: value,
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: "To Date is required",
                  },
                ]}
              />
            </Col>
            <UserInfoCommonField
              form={form}
              isDepartment={true}
              isDesignation={true}
              col={24}
              // mode="multiple"
            />
            <Col md={24} sm={12} xs={24}>
              <PSelect
                options={trainingTypeDDL || []}
                name="trainingType"
                label={"Training Type"}
                mode="multiple"
                showSearch
                placeholder="Training Type"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    trainingType: op,
                  });
                }}
                // rules={[
                //   {
                //     required: true,
                //     message: "Training Type is required",
                //   },
                // ]}
              />
            </Col>
            <Col md={24} sm={12} xs={24}>
              <PSelect
                options={nameOfTrainerOrgDDL || []}
                name="nameofTrainerOrganization"
                label="Name of Trainer & Organization"
                mode="multiple"
                showSearch
                placeholder="Name of Trainer & Organization"
                onChange={(value, op) => {
                  console.log(op);
                  form.setFieldsValue({
                    nameofTrainerOrganization: op,
                  });
                }}
                // rules={[
                //   {
                //     required: true,
                //     message: "Name of Trainer & Organization is required",
                //   },
                // ]}
              />
            </Col>

            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "25px" }}
                type="primary"
                content={"Filter"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                      landingApiCall(values);
                    })
                    .catch(() => {});
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "25px" }}
                type="secondary"
                content="Reset"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      form.resetFields();
                    })
                    .catch(() => {});
                }}
              />
            </Col>
          </Row>
        </PForm>
      </Drawer>
      <div className="grid-container">
        {summaryCardLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                className="grid-item"
                key={index}
                style={{
                  height: "150px", // Fixed height for all cards
                  border: "1px solid #f0f0f0",
                  width: "242px",
                  borderRadius: "8px",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, background 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Skeleton active />
              </div>
            ))
          : getSummaryCardCount().map((item, index) => (
              <div
                className="grid-item"
                key={index}
                style={{
                  height: "120px", // Fixed height for all cards
                  border: "1px solid #f0f0f0",
                  width: "242px", // need to change
                  borderRadius: "8px",
                  textAlign: "center",
                  paddingBottom: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, background 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = getRandomGradient())
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <div style={{ marginBottom: "10px" }}>{item.icon}</div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: 0,
                    marginTop: "10px",
                    color: "#333",
                  }}
                >
                  {item.count}
                </p>
              </div>
            ))}
      </div>

      <Row gutter={32} style={{ marginTop: "20px" }}>
        {/* Left Metrics Table */}

        {trininingModeSummaryLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Col
              key={index}
              span={3}
              style={{
                margin: "0px",
                padding: "0px",
                height: "200px",
                width: "200px",
              }}
            >
              <Skeleton active />
            </Col>
          ))
        ) : (
          <>
            <Col span={4}>
              <Table
                dataSource={trininingModeSummary || []}
                columns={tableColumns}
                pagination={false}
                size="small"
              />
            </Col>

            {/* Middle Pie Chart */}
            <Col
              span={3}
              style={{
                margin: "0px",
                padding: "0px",
                height: "200px",
                width: "200px",
              }}
            >
              <Pie {...pieConfigNoOfTraining(trininingModeSummary)} />
            </Col>
            <Col span={3}>
              <Table
                dataSource={trininingModeSummary || []}
                columns={tableColumns2}
                pagination={false}
                bordered
                size="small"
              />
            </Col>

            {/* Right Pie Chart */}
            <Col
              span={3}
              style={{
                margin: "0px",
                padding: "0px",
                height: "200px",
                width: "200px",
              }}
            >
              <Pie {...pieConfigParticipants(trininingModeSummary)} />
            </Col>

            <Col span={2}>
              <Table
                dataSource={trininingModeSummary || []}
                columns={tableColumns3}
                pagination={false}
                bordered
                size="small"
              />
            </Col>

            <Col
              span={3}
              style={{
                margin: "0px",
                padding: "0px",
                height: "200px",
                width: "200px",
              }}
            >
              <Pie {...pieConfigTotalCost(trininingModeSummary)} />
            </Col>
            <Col span={3}>
              <Table
                dataSource={trininingModeSummary || []}
                columns={tableColumns4} // f
                pagination={false}
                bordered
                size="small"
              />
            </Col>
            <Col
              span={3}
              style={{
                margin: "0px",
                padding: "0px",
                height: "200px",
                width: "200px",
              }}
            >
              <Pie {...pieConfigCostPerParticipants(trininingModeSummary)} />
            </Col>
          </>
        )}

        {/* Summary Table */}
      </Row>

      {/* Bar Charts */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Number of Participants">
            <div style={{ height: "200px", width: "600px" }}>
              {!chartShow ? (
                <Skeleton active />
              ) : (
                <PerticipantsChart data={participantsByMonthSummary} />
              )}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Training Duration">
            <div style={{ height: "200px", width: "600px" }}>
              {!chartShow ? (
                <Skeleton active />
              ) : (
                <DurationChart
                  data={trainingSummaryByMonth?.trainingDurationByMonthDto}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Line Chart */}
      <Card title="Month-Wise Training Summary">
        <div style={{ height: "200px" }}>
          {!chartShow ? (
            <Skeleton active />
          ) : (
            <Line
              {...createLineConfig(
                trainingSummaryByMonth?.trainingSummaryByMonthDto
              )}
            />
          )}{" "}
        </div>
      </Card>
      <Card title="Upcoming Training">
        <DataTable
          bordered
          data={upcommingTrainingSummary || []}
          loading={upcommingTrainingSummaryLoading}
          header={upcommingTableheader}
          // pagination={{
          //   pageSize: upcommingTrainingSummary?.data?.pageSize,
          //   total: upcommingTrainingSummary?.data?.totalCount,
          // }}
          filterData={upcommingTrainingSummary?.data?.filters}
          // onChange={(pagination, filters) => {
          //   landingApiCall({});
          // }}
        />
      </Card>
    </div>
  );
};

export default TnDDashboard;
