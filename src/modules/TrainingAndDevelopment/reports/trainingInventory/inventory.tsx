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
import Filter from "modules/TrainingAndDevelopment/filter";
import {
  formatDate,
  setCustomFieldsValue,
} from "modules/TrainingAndDevelopment/requisition/helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import {
  formatFilterValue,
  typeDataSetForTitle,
} from "modules/TrainingAndDevelopment/helpers";
import { getSerial } from "Utils";
const TnDInventory = () => {
  // router states
  const history = useHistory();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30516) {
      permission = item;
    }
  });
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
      // filter: true,
      // filterKey: "noOfTrainingList",
      // filterSearch: true,
    },
    {
      title: "Training Hour",
      dataIndex: "trainingHour",
    },
    {
      title: "Total Training Cost",
      dataIndex: "totalTrainingCost",
      // filter: true,
      // filterKey: "totalTrainingCostList",
      // filterSearch: true,
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <div>
          <button
            style={{
              height: "24px",
              fontSize: "12px",
              padding: "0px 12px 0px 12px",
            }}
            className="btn btn-default"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              history.push(
                `/trainingAndDevelopment/reports/trainingInventory/details`,
                {
                  data: rec,
                }
              );
            }}
          >
            Details
          </button>
        </div>
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

  const landingApiCall = (
    pagination: { current: number; pageSize: number } = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    const values = form.getFieldsValue(true);
    console.log(values);
    const fromDate = values?.fromDate;
    const toDate = values?.toDate;
    getLandingApi(
      `/TrainingReport/TrainingInventoryReport/${intAccountId}?fromDate=${formatDate(
        fromDate
      )}&toDate=${formatDate(toDate)}&businessUnitIds=${formatFilterValue(
        values?.bUnitId
      )}&workplaceGroupIds=${formatFilterValue(
        values?.workplaceGroupId
      )}&workplaceIds=${formatFilterValue(
        values?.workplaceId
      )}&trainingModeIds=${
        formatFilterValue(values?.trainingMode)
          ? formatFilterValue(values?.trainingMode)
          : ""
      }&trainingTitleIds=${formatFilterValue(
        values?.trainingTitle
      )}&trainingTypeIds=${formatFilterValue(
        values?.trainingType
      )}&pageNumber=${pagination?.current}&pageSize=${pagination?.pageSize}`
    );
  };
  useEffect(() => {
    landingApiCall();
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getTrainingTitleDDL(
      "/TrainingTitle/Training/Title?pageNumber=1&pageSize=1000",
      (data: any) => {
        typeDataSetForTitle(data, setTrainingTitle, true);
      }
    );
    getEnumData("TrainingModeStatus", setTrainingModeStatusDDL);
  }, []);

  return permission?.isView ? (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        <PCard>
          {/* <PCardBody>
            
          </PCardBody> */}

          <div className="mb-3">
            <Filter form={form}>
              <Row gutter={[10, 2]}>
                <UserInfoCommonField form={form} col={12} />
                <Col md={12} sm={12} xs={24}>
                  <PSelect
                    options={trainingTypeDDL || []}
                    name="trainingType"
                    label={"Training Type"}
                    mode="multiple"
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
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TnDInventory;
