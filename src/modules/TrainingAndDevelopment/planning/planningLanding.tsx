import {
  CarryOutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ContainerOutlined,
  EditOutlined,
  EyeOutlined,
  HddOutlined,
  MenuOutlined,
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
import { Col, Dropdown, Form, MenuProps, Row, Tag, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dateFormatter } from "utility/dateFormatter";

import {
  cancelTrainingPlan,
  ViewTrainingPlan,
  ViewTrainingPlanDetails,
  ViewTrainingSchedule,
} from "./helper";
import { PModal } from "Components/Modal";
import PlanningView from "./planningView";
import Chips from "common/Chips";
import IConfirmModal from "common/IConfirmModal";
import moment from "moment";
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
  const [scheduleDetails, setScheduleDetails] = useState<any>(null);

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
      width: 80,
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
    {
      title: "Created By",
      dataIndex: "createdByName",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      render: (data: any) => dateFormatter(data),
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      // filter: true,
      // filterKey: "statusList",
      // filterSearch: true,
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
      width: 120,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Dropdown menu={{ items: getMenuItems(rec) }} trigger={["click"]}>
          <MenuOutlined onClick={(e) => e.preventDefault()} />
        </Dropdown>
      ),
      align: "center",
      width: 60,
    },
  ];

  const getMenuItems = (rec: any): MenuProps["items"] => [
    {
      label: (
        <h1
          rel="noopener noreferrer"
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
                    ViewTrainingSchedule(
                      rec?.id,
                      setLoading,
                      setScheduleDetails,
                      () => {
                        setViewModalModal(true);
                      }
                    );
                  }
                );
              },
              setViewData
            );
          }}
        >
          View
        </h1>
      ),
      key: "0",
    },
    {
      label: (
        <h1
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
          rel="noopener noreferrer"
        >
          Edit
        </h1>
      ),
      key: "1",
    },
    {
      label: (
        <h1
          onClick={() => {
            ViewTrainingPlan(
              rec?.id,
              setLoading,
              (d: any) => {
                history.push("/trainingAndDevelopment/training/attendance", {
                  data: d,
                });
              },
              setViewData
            );
            // history.push("/trainingAndDevelopment/training/attendance", {
            //   data: rec, // need to change this
            // });
          }}
          rel="noopener noreferrer"
        >
          Attendance
        </h1>
      ),
      key: "2",
    },
    {
      label: (
        <h1
          onClick={() => {
            ViewTrainingPlan(
              rec?.id,
              setLoading,
              (d: any) => {
                history.push("/trainingAndDevelopment/training/feedback", {
                  data: d,
                });
              },
              setViewData
            );
          }}
          rel="noopener noreferrer"
        >
          Feedback
        </h1>
      ),
      key: "3",
    },
    {
      label: (
        <h1
          onClick={() => {
            ViewTrainingPlan(
              rec?.id,
              setLoading,
              (d: any) => {
                history.push("/trainingAndDevelopment/training/assessment", {
                  data: d,
                });
              },
              setViewData
            );
          }}
          rel="noopener noreferrer"
        >
          Assessment
        </h1>
      ),
      key: "4",
    },
    {
      type: "divider",
    },
    {
      label: (
        <h1
          style={{ color: "red" }}
          onClick={() => {
            doCancelConfirmation(rec);
          }}
          rel="noopener noreferrer"
        >
          Cancel
        </h1>
      ),
      key: "5",
    },
  ];

  const doCancelConfirmation = (rec: any) => {
    let payload = {};
    const callback = () => {
      landingApiCall({});
    };

    payload = {};

    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to cancel this training?`,
      yesAlertFunc: () => {
        cancelTrainingPlan(rec?.id, setLoading, callback);
      },
      noAlertFunc: () => null,
    };
    IConfirmModal(confirmObject);
  };

  const landingApiCall = (values: any) => {
    const formatDate = (date: string) => {
      return moment(date).format("YYYY-MM-DD");
    };

    const apiUrl =
      values?.fromDate && values?.toDate
        ? `/Training/Training/GetAllTraining?fromDate=${formatDate(
            values?.fromDate
          )}&toDate=${formatDate(values?.toDate)}`
        : "/Training/Training/GetAllTraining";

    getLandingApi(apiUrl);
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
              // pagination={{
              //   pageSize: landingApi?.data?.pageSize,
              //   total: landingApi?.data?.totalCount,
              // }}
              filterData={landingApi?.data?.filters}
              // onChange={(pagination, filters) => {
              //   landingApiCall({});
              // }}
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
              scheduleDetails={scheduleDetails}
              // setOpenTrainingTitleModal={setOpenTrainingTitleModal}
            />
          </>
        }
      />
    </div>
  );
};

export default TnDPlanningLanding;
