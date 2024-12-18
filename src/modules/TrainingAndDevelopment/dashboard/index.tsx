import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Statistic,
  Typography,
  Divider,
  Form,
} from "antd";
import { Pie, Line, Column } from "@ant-design/plots";
import DurationChart from "./chart/duration";
import PerticipantsChart from "./chart/perticipants";
import UserInfoCommonField from "../reports/userInfoCommonField";
import { PButton, PCard, PCardBody, PForm, PInput, PSelect } from "Components";
import { useDispatch } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const { Title } = Typography;

// Table Data
const tableData = [
  { key: "1", name: "Total Training Count", value: "Info." },
  { key: "2", name: "Total Training Hour", value: "Info." },
  { key: "3", name: "Total Participant", value: "Info." },
  { key: "4", name: "Total Feedback Count", value: "Info." },
  { key: "5", name: "Total Assessment Count", value: "Info." },
];

const tableColumns = [
  { title: "Metric", dataIndex: "name", key: "name" },
  { title: "Value", dataIndex: "value", key: "value" },
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
  appendPadding: 5,
  data: pieData,
  angleField: "value",
  colorField: "type",
  radius: 0.8,
  label: {
    type: "outer",
    content: "{name} {percentage}",
  },
  legend: false || undefined,
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

const statisticsData = [
  {
    key: "1",
    title: "Total Attendance Count",
    value: "Info.",
  },
  {
    key: "2",
    title: "Total Training Cost",
    value: "Info.",
  },
  {
    key: "3",
    title: "Cost Per Participant",
    value: "Info.",
  },
  {
    key: "4",
    title: "Actual Cost Per Hour",
    value: "Info.",
  },
];

const statisticsColumns = [
  {
    title: "Statistic",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const TnDDashboard = () => {
  const dispatch = useDispatch();
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
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getNameOfTrainerOrgDDL(
      "/TrainerInformation/Training/TrainerInformation",
      typeDataSetForTrainerOrg
    );
  }, []);
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

  // Form Instance
  const [form] = Form.useForm();
  return (
    <div style={{ padding: "10px" }}>
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
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
              <Col md={6} sm={24}>
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
              />
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingTypeDDL || []}
                  name="trainingType"
                  label={"Training Type"}
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
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={nameOfTrainerOrgDDL || []}
                  name="nameofTrainerOrganization"
                  label="Name of Trainer & Organization"
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
        </PCard>
      </PForm>
      <Row gutter={24} style={{ marginTop: "40px" }}>
        {/* Left Metrics Table */}
        <Col span={6}>
          <Table
            dataSource={tableData}
            columns={tableColumns}
            pagination={false}
            bordered
            size="middle"
          />
        </Col>

        {/* Middle Pie Chart */}
        <Col span={6}>
          <Pie
            {...pieConfig}
            style={{
              marginTop: "0px",
              paddingTop: "0px",
              width: "220px",
              height: "200px",
            }}
          />
        </Col>

        {/* Right Pie Chart */}
        <Col span={6}>
          <Pie
            {...pieConfig}
            style={{
              marginTop: "0px",
              paddingTop: "0px",
              width: "220px",
              height: "200px",
            }}
          />
        </Col>

        {/* Summary Table */}
        <Col span={6}>
          <Table
            dataSource={statisticsData}
            columns={statisticsColumns}
            pagination={false}
            bordered
            size="middle"
          />
        </Col>
      </Row>

      <Divider />
      <Row gutter={24} style={{ marginTop: "40px" }}>
        {/* Left Metrics Table */}
        <Col span={6}>
          <Table
            dataSource={tableData}
            columns={tableColumns}
            pagination={false}
            bordered
            size="middle"
          />
        </Col>

        {/* Middle Pie Chart */}
        <Col span={6}>
          <Pie
            {...pieConfig}
            style={{
              marginTop: "0px",
              paddingTop: "0px",
              width: "220px",
              height: "200px",
            }}
          />
        </Col>

        {/* Right Pie Chart */}
        <Col span={6}>
          <Pie
            {...pieConfig}
            style={{
              marginTop: "0px",
              paddingTop: "0px",
              width: "220px",
              height: "200px",
            }}
          />
        </Col>

        {/* Summary Table */}
        <Col span={6}>
          <Table
            dataSource={statisticsData}
            columns={statisticsColumns}
            pagination={false}
            bordered
            size="middle"
          />
        </Col>
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

      <Divider />

      {/* Line Chart */}
      <Card title="Month-Wise Training Summary">
        <Line {...lineConfig} />
      </Card>
    </div>
  );
};

export default TnDDashboard;
