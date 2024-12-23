import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import { Button, Col, Form, Row, Space, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

import { shallowEqual, useSelector } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
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

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
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
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Tooltip placement="bottom" title="Training Details">
            <Button
              type="link"
              onClick={() => {
                // history.push(
                //   `/trainingAndDevelopment/reports/trainingInventory/details`,
                //   {
                //     data: rec,
                //   }
                // );
              }}
            >
              Something
            </Button>
          </Tooltip>
        </Space>
      ),
      align: "center",
      width: 80,
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
      {/* Training Title Modal */}
    </div>
  );
};

export default TnDInventoryDetails;
