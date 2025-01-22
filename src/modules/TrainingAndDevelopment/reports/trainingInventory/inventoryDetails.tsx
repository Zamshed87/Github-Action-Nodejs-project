import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import {
  Button,
  Col,
  Dropdown,
  Form,
  MenuProps,
  Row,
  Space,
  Tooltip,
} from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

import { shallowEqual, useSelector } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
import { MenuOutlined } from "@ant-design/icons";
import {
  ViewTrainingPlan,
  ViewTrainingPlanDetails,
  ViewTrainingSchedule,
} from "modules/TrainingAndDevelopment/planning/helper";
import PlanningView from "modules/TrainingAndDevelopment/planning/planningView";
import { PModal } from "Components/Modal";
const TnDInventoryDetails = () => {
  // router states
  interface LocationState {
    data?: any;
  }

  const location = useLocation<LocationState>();
  const history = useHistory();
  const data = location?.state?.data;

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { intAccountId } = profileData;
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);
  const [viewModalModal, setViewModalModal] = useState(false);
  const [viewData, setViewData] = useState<any>({});
  const [viewDataDetails, setViewDataDetails] = useState<any>({});
  const [scheduleDetails, setScheduleDetails] = useState<any>({});

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
      width: 40,
    },
    {
      title: "Training Type",
      dataIndex: "trainingTypeName",
      filter: true,
      filterKey: "trainingTypeList",
      filterSearch: true,
    },
    {
      title: "Training Title",
      dataIndex: "trainingTitleName",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
    },
    {
      title: "Training Mode",
      dataIndex: "trainingMode",
      width: 50,
      render: (_: any, rec: any) => rec?.trainingMode?.label,
    },
    {
      title: "Objectives",
      dataIndex: "trainingObjectives",
    },
    {
      title: "Training Date & Time",
      dataIndex: "trainingDateTime",
      render: (data: any) => dateFormatter(data),
      width: 80,
    },
    {
      title: "Training Organization & Trainer",
      dataIndex: "trainingOrganization",
      render: (_: any, rec: any) =>
        rec?.trainingOrganization + ", " + rec?.trainerName,
    },
    {
      title: "Training Duration",
      dataIndex: "trainingDuration",
      width: 80,
    },
    {
      title: "Cost per Person",
      dataIndex: "costPerPerson",
      width: 80,
      render: (data: any) => data?.toFixed(2),
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
              rec?.trainingId,
              setLoading,
              () => {
                ViewTrainingPlanDetails(
                  rec?.trainingId,
                  setLoading,
                  setViewDataDetails,
                  () => {
                    ViewTrainingSchedule(
                      rec?.trainingId,
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
    // {
    //   label: (
    //     <h1
    //       onClick={() => {
    //         ViewTrainingPlan(
    //           rec?.id,
    //           setLoading,
    //           (d: any) => {
    //             history.push("/trainingAndDevelopment/training/attendance", {
    //               data: d,
    //             });
    //           },

    //         );
    //         // history.push("/trainingAndDevelopment/training/attendance", {
    //         //   data: rec, // need to change this
    //         // });
    //       }}
    //       rel="noopener noreferrer"
    //     >
    //       Attendance
    //     </h1>
    //   ),
    //   key: "2",
    // },
    {
      label: (
        <h1
          onClick={() => {
            ViewTrainingPlan(
              rec?.trainingId,
              setLoading,
              (d: any) => {
                history.push("/trainingAndDevelopment/training/feedback", {
                  data: d,
                  service: "inventory",
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
              rec?.trainingId,
              setLoading,
              (d: any) => {
                history.push("/trainingAndDevelopment/training/assessment", {
                  data: d,
                  service: "inventory",
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
  ];
  const landingApiCall = (values: any) => {
    getLandingApi(
      `/TrainingReport/TrainingInventoryDetailReport/${data?.trainingId}?employeeId=${data?.employeeId}`
    );
  };
  useEffect(() => {
    landingApiCall({});
  }, []);

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm
        form={form}
        initialValues={{
          employeeName: data?.employeeName,
          departmentName: data?.departmentName,
          designationName: data?.designationName,
          workplaceName: data?.workplaceName,
          workplaceGroupName: data?.workplaceGroupName,
          numberOfTraining: data?.numberOfTraining,
          trainingHour: data?.trainingHour,
          totalTrainingCost: data?.totalTrainingCost,
        }}
      >
        <PCard>
          <PCardHeader backButton title={`Details of Training Inventory`} />
          <PCardBody>
            <Row gutter={[10, 2]}>
              {/* <UserInfoCommonField form={form} /> */}
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Employee Name"
                  label="Employee Name"
                  name="employeeName"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Department Name"
                  label="Department Name"
                  name="departmentName"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Designation Name"
                  label="Designation Name"
                  name="designationName"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Workplace Name"
                  label="Workplace Name"
                  name="workplaceName"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Workplace Group Name"
                  label="Workplace Group Name"
                  name="workplaceGroupName"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Number of Training"
                  label="Number of Training"
                  name="numberOfTraining"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Hour"
                  label="Training Hour"
                  name="trainingHour"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Total Training Cost"
                  label="Total Training Cost"
                  name="totalTrainingCost"
                  disabled={true}
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
      <PModal
        open={viewModalModal}
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

export default TnDInventoryDetails;
