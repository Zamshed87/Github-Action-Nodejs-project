import React, { useEffect, useState } from "react";
import { Col, Form, FormInstance, Row, Tooltip } from "antd";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import Loading from "common/loading/Loading";
import { getSerial } from "Utils";
import { dateFormatter } from "utility/dateFormatter";
import {
  BarsOutlined,
  EditOutlined,
  EyeOutlined,
  CarryOutOutlined,
  HddOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { data } from "./helper";
const TnDPlanningLanding = () => {
  // router states
  const history = useHistory();
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Business Unit",
      dataIndex: "businessUnit",
      filter: true,
      filterKey: "businessUnitList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      filter: true,
      filterKey: "workplaceGroupList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      filter: true,
      filterKey: "workplaceList",
      filterSearch: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Training Type",
      dataIndex: "trainingType",
      filter: true,
      filterKey: "trainingTypeList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Training Title",
      dataIndex: "trainingTitle",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Training Mode",
      dataIndex: "trainingMode",
      filter: true,
      filterKey: "trainingModeList",
      filterSearch: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Training Date & Time",
      dataIndex: "trainingDateTime",
      render: (data: any) => dateFormatter(data),
      sorter: true,
      align: "center",
    },
    {
      title: "Name of Trainer",
      dataIndex: "trainerName",
      filter: true,
      filterKey: "trainerNameList",
      filterSearch: true,
    },
    {
      title: "Trainer Contact No.",
      dataIndex: "trainerContact",
      filter: true,
      filterKey: "trainerContactList",
      filterSearch: true,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (data: any) => dateFormatter(data),
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="View">
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                history.push("/trainingDevelopment/planning/view", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Edit">
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingDevelopment/planning/edit", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Attendance">
            <CarryOutOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingDevelopment/planning/status", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Feedback">
            <HddOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingDevelopment/planning/status", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Assessment">
            <ContainerOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingDevelopment/planning/status", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 120,
    },
  ];

  const landingApiCall = (values: any) => {
    console.log(values);
    getLandingApi("/trainingType");
  };
  useEffect(() => {
    landingApiCall({});
  }, []);

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={`Total ${
              landingApi?.data?.totalCount || 0
            } Training Planning`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push("/trainingDevelopment/planning/create");
                },
              },
            ]}
          />
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
                        console.log(values);
                        landingApiCall(values);
                      })
                      .catch(() => {
                        console.log("error");
                      });
                  }}
                />
              </Col>
            </Row>
          </PCardBody>

          <div className="mb-3">
            <DataTable
              bordered
              // data={landingApi?.data?.data || []}
              data={data}
              loading={landingApi?.loading}
              header={header}
              pagination={{
                pageSize: landingApi?.data?.pageSize,
                total: landingApi?.data?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination, filters) => {
                landingApiCall({});
              }}
            />
          </div>
        </PCard>
      </PForm>
    </div>
  );
};

export default TnDPlanningLanding;
