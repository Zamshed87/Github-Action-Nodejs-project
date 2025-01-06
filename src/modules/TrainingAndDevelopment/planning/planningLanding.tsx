import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MenuOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
import { getSerial } from "Utils";
import { Col, Dropdown, Form, MenuProps, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dateFormatter } from "utility/dateFormatter";

import { PModal } from "Components/Modal";
import IConfirmModal from "common/IConfirmModal";
import moment from "moment";
import {
  cancelTrainingPlan,
  ViewTrainingPlan,
  ViewTrainingPlanDetails,
  ViewTrainingSchedule,
} from "./helper";
import PlanningView from "./planningView";
import Filter from "../filter";
import UserInfoCommonField from "../reports/userInfoCommonField";
import { getEnumData } from "common/api/commonApi";
import { formatDate, setCustomFieldsValue } from "../requisition/helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { formatFilterValue, typeDataSetForTitle } from "../helpers";
const TnDPlanningLanding = () => {
  const defaultToDate = moment();
  const defaultFromDate = moment().subtract(3, "months");
  // router states
  const history = useHistory();
  const dispatch = useDispatch();

  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  const [
    trainingTypeDDL,
    getTrainingTypeDDL,
    loadingTrainingType,
    setTrainingType,
  ] = useAxiosGet();

  const [
    trainingTitleDDL,
    getTrainingTitleDDL,
    loadingTrainingTitle,
    setTrainingTitle,
  ] = useAxiosGet();
  const [trainingModeStatusDDL, setTrainingModeStatusDDL] = useState<any>([]);

  // state
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModalModal] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [viewDataDetails, setViewDataDetails] = useState<any>(null);
  const [scheduleDetails, setScheduleDetails] = useState<any>(null);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30513) {
      permission = item;
    }
  });

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

  const dateNewFormatter = (startDate: string, endDate: string) => {
    const start = moment(startDate).format("YYYY-MM-DD hh:mm A");
    const end = moment(endDate).format("YYYY-MM-DD hh:mm A");
    return `${start} to ${end}`;
  };
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.currentPage,
          pageSize: landingApi?.pageSize,
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
      width: 130,
      fixed: "left",
    },
    {
      title: "Training Title",
      dataIndex: "trainingTitleName",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
      width: 130,
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
      render: (text: any, record: any) =>
        dateNewFormatter(record.startDate, record.endDate),
      sorter: true,
      align: "left",
      width: 150,
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
              style={{ borderRadius: "50px" }}
              icon={<SyncOutlined style={{ paddingTop: "1px" }} spin />}
              color="processing"
            >
              Ongoing
            </Tag>
          )}
          {status?.label === "Completed" && (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{ borderRadius: "50px" }}
            >
              Completed
            </Tag>
          )}
          {status?.label === "Canceled" && (
            <Tag
              icon={<CloseCircleOutlined />}
              color="magenta"
              style={{ borderRadius: "50px" }}
            >
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
      landingApiCall();
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

  const landingApiCall = (
    pagination: { current: number; pageSize: number } = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    const values = form.getFieldsValue(true);
    const fromDate = values?.fromDate;
    const toDate = values?.toDate;

    const apiUrl = `/Training/GetAllTraining?status=&fromDate=${formatDate(
      fromDate
    )}&toDate=${formatDate(toDate)}&businessUnitIds=${formatFilterValue(
      values?.bUnitId
    )}&workplaceGroupIds=${formatFilterValue(
      values?.workplaceGroupId
    )}&workplaceIds=${formatFilterValue(values?.workplaceId)}&trainingModeIds=${
      formatFilterValue(values?.trainingMode)
        ? formatFilterValue(values?.trainingMode)
        : ""
    }&trainingTitleIds=${formatFilterValue(
      values?.trainingTitle
    )}&trainingTypeIds=${formatFilterValue(values?.trainingType)}&pageNumber=${
      pagination?.current
    }&pageSize=${pagination?.pageSize}`;

    //GetAllTraining?fromDate=2024-11-01&toDate=2025-01-03&businessUnitIds=0&workplaceGroupIds=0&workplaceIds=0&trainingTypeIds=0&trainingTitleIds=7&pageNumber=1&pageSize=50

    console.log(apiUrl); // Check the constructed URL
    getLandingApi(apiUrl);
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    getEnumData(
      "TrainingModeStatus",
      setTrainingModeStatusDDL,
      setLoading,
      true
    );
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getTrainingTitleDDL(
      "/TrainingTitle/Training/Title?pageNumber=1&pageSize=200",
      (data: any) => {
        typeDataSetForTitle(data, setTrainingTitle, true);
      }
    );
    landingApiCall();
  }, []);

  return permission?.isView ? (
    <div>
      {(loading || landingLoading) && <Loading />}
      <PForm
        form={form}
        initialValues={{
          fromDate: defaultFromDate,
          toDate: defaultToDate,
          bUnit: { label: "All", value: 0 },
          workplaceGroup: { label: "All", value: 0 },
          workplace: { label: "All", value: 0 },
          department: { label: "All", value: 0 },
          hrPosition: { label: "All", value: 0 },
          trainingType: { label: "All", value: 0 },
          trainingTitle: { label: "All", value: 0 },
          trainingMode: { label: "All", value: 0 },
        }}
      >
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.totalCount || 0} Training Planning`}
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

          <div className="mb-3">
            <Filter form={form}>
              <Row gutter={[10, 2]}>
                <Col md={12} sm={24}>
                  <PInput
                    type="date"
                    name="fromDate"
                    label="From Date"
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
                  col={12}
                  // mode="multiple"
                />
                <Col md={12} sm={12} xs={24}>
                  <PSelect
                    options={trainingTypeDDL || []}
                    name="trainingType"
                    mode="multiple"
                    label={"Training Type"}
                    placeholder="Training Type"
                    onChange={(value, op) => {
                      setCustomFieldsValue(form, "trainingType", value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Training Type is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={12} sm={12} xs={24}>
                  <PSelect
                    options={trainingTitleDDL || []}
                    name="trainingTitle"
                    label={"Training Title"}
                    mode="multiple"
                    placeholder="Training Title"
                    onChange={(value, op) => {
                      setCustomFieldsValue(form, "trainingTitle", value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Training Title is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={12} sm={12} xs={24}>
                  <PSelect
                    options={trainingModeStatusDDL || []}
                    name="trainingMode"
                    label="Training Mode"
                    mode="multiple"
                    placeholder="Training Mode"
                    onChange={(value, op) => {
                      setCustomFieldsValue(form, "trainingMode", value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Training Mode is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PButton
                    style={{ marginTop: "20px" }}
                    type="primary"
                    content={"View"}
                    onClick={() => {
                      const values = form.getFieldsValue(true);
                      form
                        .validateFields()
                        .then(() => {
                          console.log(values);
                          landingApiCall();
                        })
                        .catch(() => {});
                    }}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PButton
                    style={{ marginTop: "20px" }}
                    type="secondary"
                    content="Reset"
                    onClick={() => {
                      const values = form.getFieldsValue(true);
                      form.resetFields();
                      form.setFieldsValue({
                        fromDate: defaultFromDate,
                        toDate: defaultToDate,
                        bUnit: { label: "All", value: 0 },
                        workplaceGroup: { label: "All", value: 0 },
                        workplace: { label: "All", value: 0 },
                        department: { label: "All", value: 0 },
                        hrPosition: { label: "All", value: 0 },
                        trainingType: { label: "All", value: 0 },
                        trainingTitle: { label: "All", value: 0 },
                        trainingMode: [""],
                      });
                      landingApiCall();
                    }}
                  />
                </Col>
              </Row>
            </Filter>
            <DataTable
              bordered
              data={landingApi?.data || []}
              loading={landingLoading}
              header={header}
              pagination={{
                pageSize: landingApi?.pageSize,
                total: landingApi?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination, filters) => {
                landingApiCall(pagination);
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
              scheduleDetails={scheduleDetails}
              // setOpenTrainingTitleModal={setOpenTrainingTitleModal}
            />
          </>
        }
      />
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TnDPlanningLanding;
