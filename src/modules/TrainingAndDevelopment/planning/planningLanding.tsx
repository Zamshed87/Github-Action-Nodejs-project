import {
  CarryOutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ContainerOutlined,
  EditOutlined,
  EyeOutlined,
  HddOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
import { getSerial } from "Utils";
import { Col, Form, Row, Tag, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dateFormatter } from "utility/dateFormatter";

import { ViewTrainingPlan, ViewTrainingPlanDetails } from "./helper";
import { PModal } from "Components/Modal";
import PlanningView from "./planningView";
import Chips from "common/Chips";
const TnDPlanningLanding = () => {
  // router states
  const history = useHistory();
  const dispatch = useDispatch();

  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModalModal] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [viewDataDetails, setViewDataDetails] = useState<any>(null);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  // table column
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
      title: "Business Unit",
      dataIndex: "businessUnitName",
      filter: true,
      filterKey: "businessUnitList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroupName",
      filter: true,
      filterKey: "workplaceGroupList",
      filterSearch: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      filter: true,
      filterKey: "workplaceList",
      filterSearch: true,
      width: 100,
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
      title: "Training Mode",
      dataIndex: "trainingMode",
      filter: true,
      filterKey: "trainingModeList",
      filterSearch: true,
      width: 100,
      fixed: "left",
      render: (_: any, rec: any) => rec?.trainingModeStatus?.label,
    },
    {
      title: "Training Date & Time",
      dataIndex: "startDate",
      render: (data: any) => dateFormatter(data),
      sorter: true,
      align: "center",
    },
    // {
    //   title: "Name of Trainer",
    //   dataIndex: "trainerName",
    //   filter: true,
    //   filterKey: "trainerNameList",
    //   filterSearch: true,
    // },
    // {
    //   title: "Trainer Contact No.",
    //   dataIndex: "trainerContact",
    //   filter: true,
    //   filterKey: "trainerContactList",
    //   filterSearch: true,
    // },
    // {
    //   title: "Created By",
    //   dataIndex: "createdBy",
    //   filter: true,
    //   filterKey: "createdByList",
    //   filterSearch: true,
    // },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdDate",
    //   render: (data: any) => dateFormatter(data),
    //   sorter: true,
    // },
    {
      title: "Status",
      dataIndex: "status",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
      render: (status: any) => (
        <>
          {status?.label === "Upcoming" && (
            <Tag icon={<ClockCircleOutlined />} color="default">
              Upcoming
            </Tag>
          )}
          {status?.label === "Ongoing" && (
            <Tag
              icon={<SyncOutlined style={{ paddingTop: "1px" }} spin />}
              color="processing"
            >
              Ongoing
            </Tag>
          )}
          {status?.label === "Completed" && (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Completed
            </Tag>
          )}
          {status?.label === "Canceled" && (
            <Tag icon={<CloseCircleOutlined />} color="magenta">
              Canceled
            </Tag>
          )}
        </>
      ),
      width: 100,
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
                ViewTrainingPlan(
                  rec?.id,
                  setLoading,
                  () => {
                    ViewTrainingPlanDetails(
                      rec?.id,
                      setLoading,
                      setViewDataDetails,
                      () => {
                        setViewModalModal(true);
                      }
                    );
                  },
                  setViewData
                );
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
                ViewTrainingPlan(
                  rec?.id,
                  setLoading,
                  (d: any) => {
                    ViewTrainingPlanDetails(
                      rec?.id,
                      setLoading,
                      setViewDataDetails,
                      (details: any) => {
                        history.push("/trainingAndDevelopment/planning/edit", {
                          data: d,
                          dataDetails: details,
                        });
                      }
                    );
                  },
                  setViewData
                );
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
                ViewTrainingPlan(
                  rec?.id,
                  setLoading,
                  (d: any) => {
                    history.push(
                      "/trainingAndDevelopment/training/attendance",
                      {
                        data: d,
                      }
                    );
                  },
                  setViewData
                );
                // history.push("/trainingAndDevelopment/training/attendance", {
                //   data: rec, // need to change this
                // });
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
                history.push("/trainingAndDevelopment/planning/status", {
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
                history.push("/trainingAndDevelopment/planning/status", {
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
    getLandingApi("/Training/Training/GetAllTraining");
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));

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
                  history.push("/trainingAndDevelopment/planning/create");
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
                        landingApiCall(values);
                      })
                      .catch(() => {});
                  }}
                />
              </Col>
            </Row>
          </PCardBody>

          <div className="mb-3">
            <DataTable
              bordered
              data={landingApi || []}
              loading={landingLoading}
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
      {/* Training Title Modal */}
      <PModal
        open={viewModal}
        title={"Training Planning"}
        width={1200}
        onCancel={() => {
          setViewModalModal(false);
          // getTrainingTitleDDL(
          //   "/TrainingTitle/Training/Title",
          //   typeDataSetForTitle
          // );
        }}
        maskClosable={false}
        components={
          <>
            <PlanningView
              data={viewData}
              dataDetails={viewDataDetails}
              // setOpenTrainingTitleModal={setOpenTrainingTitleModal}
            />
          </>
        }
      />
    </div>
  );
};

export default TnDPlanningLanding;
