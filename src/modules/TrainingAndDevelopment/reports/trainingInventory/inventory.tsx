import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { Button, Col, Form, Row, Space, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

import { getEnumData } from "common/api/commonApi";
import { shallowEqual, useSelector } from "react-redux";
import UserInfoCommonField from "../userInfoCommonField";
const TnDInventory = () => {
  // router states
  const history = useHistory();

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

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroupName",
      filter: true,
      filterKey: "workplaceGroupList",
      filterSearch: true,
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      filter: true,
      filterKey: "workplaceList",
      filterSearch: true,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "No of Training",
      dataIndex: "numberOfTraining",
      filter: true,
      filterKey: "noOfTrainingList",
      filterSearch: true,
    },
    {
      title: "Training Hour",
      dataIndex: "trainingHour",
    },
    {
      title: "Total Training Cost",
      dataIndex: "totalTrainingCost",
      filter: true,
      filterKey: "totalTrainingCostList",
      filterSearch: true,
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
                history.push(
                  `/trainingAndDevelopment/reports/trainingInventory/details`,
                  {
                    data: rec,
                  }
                );
              }}
            >
              Details
            </Button>
          </Tooltip>
        </Space>
      ),
      align: "center",
      width: 40,
    },
  ];
  const typeDataSetForType = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    setTrainingType(list);
  };

  const typeDataSetForTitle = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    setTrainingTitle(list);
  };
  const landingApiCall = (values: any) => {
    getLandingApi(`/TrainingReport/TrainingInventoryReport/${intAccountId}`);
  };
  useEffect(() => {
    landingApiCall({});
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getTrainingTitleDDL("/TrainingTitle/Training/Title", typeDataSetForTitle);
    getEnumData("TrainingModeStatus", setTrainingModeStatusDDL);
  }, []);

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        <PCard>
          {/* <PCardHeader
            title={`Total ${
              landingApi?.data?.totalCount || 0
            } Training Requisition`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push("/trainingAndDevelopment/requisition/create");
                },
              },
            ]}
          /> */}
          <PCardBody>
            <Row gutter={[10, 2]}>
              <UserInfoCommonField form={form} />
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
                  rules={[
                    {
                      required: true,
                      message: "Training Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingTitleDDL || []}
                  name="trainingTitle"
                  label={"Training Title"}
                  placeholder="Training Title"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingTitle: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Title is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingModeStatusDDL || []}
                  name="trainingMode"
                  label="Training Mode"
                  placeholder="Training Mode"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingMode: op,
                    });
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
    </div>
  );
};

export default TnDInventory;
