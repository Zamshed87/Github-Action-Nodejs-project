import { Line, Pie } from "@ant-design/plots";
import "./style.css";
import { Card, Col, Divider, Drawer, Form, Row, Table, Typography } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import UserInfoCommonField from "../reports/userInfoCommonField";
import DurationChart from "./chart/duration";
import PerticipantsChart from "./chart/perticipants";
import {
  TeamOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined,
  FileTextOutlined,
  UserSwitchOutlined,
  DollarCircleOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import { BarChartOutlined, PieChartOutlined } from "@mui/icons-material";
import { PModal } from "Components/Modal";
import { formatDate } from "../requisition/helper";

const { Title } = Typography;

// need to refactor code

const data = [
  {
    title: "Total Training Count",
    count: 45,
    icon: <TeamOutlined style={{ fontSize: "30px", color: "#4caf50" }} />,
  },
  {
    title: "Total Training Hour",
    count: 56,
    icon: (
      <ClockCircleOutlined style={{ fontSize: "30px", color: "#ff9800" }} />
    ),
  },
  {
    title: "Total Participant",
    count: 177,
    icon: <UserOutlined style={{ fontSize: "30px", color: "#3f51b5" }} />,
  },
  {
    title: "Total Feedback Count",
    count: 333,
    icon: <MessageOutlined style={{ fontSize: "30px", color: "#e91e63" }} />,
  },
  {
    title: "Total Assessment Count",
    count: 62,
    icon: <FileTextOutlined style={{ fontSize: "30px", color: "#607d8b" }} />,
  },
  {
    title: "Total Attendance Count",
    count: 22,
    icon: <UserSwitchOutlined style={{ fontSize: "30px", color: "#673ab7" }} />,
  },
  {
    title: "Total Training Cost",
    count: 34,
    icon: (
      <DollarCircleOutlined style={{ fontSize: "30px", color: "#4caf50" }} />
    ),
  },
  {
    title: "Cost Per Participant",
    count: 21,
    icon: <CalculatorOutlined style={{ fontSize: "30px", color: "#ff5722" }} />,
  },
  {
    title: "Actual Cost Per Participant",
    count: 56,
    icon: <BarChartOutlined style={{ fontSize: "30px", color: "#009688" }} />,
  },
  {
    title: "Actual Cost Per Hour",
    count: 33,
    icon: <PieChartOutlined style={{ fontSize: "30px", color: "#2196f3" }} />,
  },
];

const data2 = [
  {
    title: "Total Attendance Count",
    count: 22,
    icon: <UserSwitchOutlined style={{ fontSize: "30px", color: "#673ab7" }} />,
  },
  {
    title: "Total Training Cost",
    count: 34,
    icon: (
      <DollarCircleOutlined style={{ fontSize: "30px", color: "#4caf50" }} />
    ),
  },
  {
    title: "Cost Per Participant",
    count: 21,
    icon: <CalculatorOutlined style={{ fontSize: "30px", color: "#ff5722" }} />,
  },
  {
    title: "Actual Cost Per Participant",
    count: 56,
    icon: <BarChartOutlined style={{ fontSize: "30px", color: "#009688" }} />,
  },
  {
    title: "Actual Cost Per Hour",
    count: 33,
    icon: <PieChartOutlined style={{ fontSize: "30px", color: "#2196f3" }} />,
  },
];

// Table Data
const tableData = [
  { key: "1", name: "Classroom", noOfTraining: 30 },
  { key: "2", name: "Online", noOfTraining: 20 },
  { key: "3", name: "Offline", noOfTraining: 10 },
  { key: "4", name: "Total", noOfTraining: 60 },
  { key: "5", name: "Total A", noOfTraining: 60 },
];

const tableColumns = [
  { title: "Training Mode", dataIndex: "name", key: "name", width: 40 },
  {
    title: "No. of Training",
    dataIndex: "noOfTraining",
    key: "noOfTraining",
    width: 30,
  },
];

const tableColumns2 = [
  {
    title: "Participant",
    dataIndex: "noOfTraining",
    key: "noOfTraining",
    width: 10,
  },
];

const tableColumns3 = [
  {
    title: "Total Cost (BDT)",
    dataIndex: "noOfTraining",
    key: "totalCost",
    width: 10,
  },
];

const tableColumns4 = [
  {
    title: "Cost Per Participant (BDT)",
    dataIndex: "noOfTraining",
    key: "costPerParticipant",
    width: 10,
  },
];

// Pie Chart Data
const pieData = [
  { type: "Training Mode 1", value: 37 },
  { type: "Training Mode 2", value: 30 },
  { type: "Training Mode 3", value: 15 },
  { type: "Training Mode 4", value: 10 },
  { type: "Training Mode 5", value: 8 },
];

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

// Pie Chart Config
const pieConfig = {
  data: pieData,
  angleField: "value",
  colorField: "type",
  label: {
    type: "inner",
    content: "{value}",
  },
  legend: false || undefined,
  interactions: [
    {
      type: "element-active",
    },
  ],
};

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
  smooth: true,
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
    ,
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
  const landingApiCall = (values: any) => {
    getSummaryCard(
      `/Training/Dashboard/SummaryCard${formateFilterData(values)}`
    );
    getTrininingModeSummary("/Training/Dashboard/TrainingMode");
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getNameOfTrainerOrgDDL(
      "/TrainerInformation/Training/TrainerInformation",
      typeDataSetForTrainerOrg
    );
    landingApiCall({});
  }, []);

  const formateFilterData = (data: any) => {
    let str = "";
    str += `?fromDate=${formatDate(data?.fromDate)}&toDate=${formatDate(
      data?.toDate
    )}&BusinessUnitIds=${data?.businessUnit?.value}&DepartmentIds=${
      data?.department?.value
    }&DesignationIds=${
      data?.designation?.value
    }&TrainingTypeIds=${data?.trainingType
      ?.map((item: any) => item?.value)
      .join(",")}&TrainerIds=${data?.nameofTrainerOrganization
      ?.map((item: any) => item?.value)
      .join(",")}`;

    return str;
  };
  const typeDataSetForTrainerOrg = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true)
        list.push({
          label: `${d?.name} - ${d?.organization}`,
          value: d?.id,
          ...d,
        });
    });
    list.unshift({ label: "All", value: 0 });
    setNameOfTrainerOrg(list);
  };

  const typeDataSetForType = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    list.unshift({ label: "All", value: 0 });
    setTrainingType(list);
  };

  const [openFilter, setOpenFilter] = useState(false);

  const header: any = [
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
      width: 40,
    },
    {
      title: "Organization",
      dataIndex: "organizationName",
      filter: true,
      filterKey: "organizationList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Training Date",
      dataIndex: "trainingDate",
      filter: true,
      filterKey: "trainingDateList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Training Type",
      dataIndex: "trainingTypeName",
      filter: true,
      filterKey: "trainingTypeList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Training Title",
      dataIndex: "trainingTitleName",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Training Organizer",
      dataIndex: "trainingOrganizerName",
      filter: true,
      filterKey: "trainingOrganizerList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Training Venue",
      dataIndex: "trainingVenue",
      filter: true,
      filterKey: "trainingVenueList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Training Mode",
      dataIndex: "trainingMode",
      width: 100,
      render: (_: any, rec: any) => rec?.trainingModeStatus?.label,
    },
    {
      title: "Training Duration",
      dataIndex: "trainingDuration",
      filter: true,
      filterKey: "trainingDurationList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Total Participants",
      dataIndex: "totalParticipants",
      filter: true,
      filterKey: "totalParticipantsList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Trainer Details",
      dataIndex: "trainerDetails",
      filter: true,
      filterKey: "trainerDetailsList",
      filterSearch: true,
      width: 150,
    },
  ];

  const getRandomGradient = () => {
    const colors = [
      "#ff7e5f",
      "#feb47b",
      "#4facfe",
      "#00f2fe",
      "#a18cd1",
      "#fbc2eb",
      "#fad0c4",
      "#ff9a9e",
      "#ff6a88",
      "#c471ed",
    ];

    const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
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

            <Col md={12} sm={24}>
              <PButton
                style={{ marginTop: "39px" }}
                type="primary"
                content="View"
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
          </Row>
        </PForm>
      </Drawer>
      <div className="grid-container">
        {data.map((item, index) => (
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
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = getRandomGradient())
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
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

      <Row gutter={32} style={{ marginTop: "30px" }}>
        {/* Left Metrics Table */}
        <Col span={4}>
          <Table
            dataSource={tableData}
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
          <Pie {...pieConfig} />
        </Col>
        <Col span={3}>
          <Table
            dataSource={tableData}
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
          <Pie {...pieConfig} />
        </Col>

        <Col span={2}>
          <Table
            dataSource={tableData}
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
          <Pie {...pieConfig} />
        </Col>
        <Col span={3}>
          <Table
            dataSource={tableData}
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
          <Pie {...pieConfig} />
        </Col>

        {/* Summary Table */}
      </Row>

      {/* Bar Charts */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Number of Participants">
            <div style={{ height: "200px", width: "600px" }}>
              <PerticipantsChart />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Training Duration">
            <div style={{ height: "200px", width: "600px" }}>
              <DurationChart />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Line Chart */}
      <Card title="Month-Wise Training Summary">
        <div style={{ height: "250px" }}>
          <Line {...lineConfig} />
        </div>
      </Card>
      <Card title="Upcoming Training">
        <DataTable
          bordered
          data={upcommingTrainingSummary || []}
          loading={upcommingTrainingSummary}
          header={header}
          pagination={{
            pageSize: upcommingTrainingSummary?.data?.pageSize,
            total: upcommingTrainingSummary?.data?.totalCount,
          }}
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
