import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Row, Tooltip, Checkbox } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";

import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const TnDAttendanceSave = () => {
  interface LocationState {
    data?: any;
  }

  const location = useLocation<LocationState>();
  const history = useHistory();
  const data = location?.state?.data;

  const [loading, setLoading] = useState(false);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  const [form] = Form.useForm();
  const params = useParams<{ type: string }>();
  const { type } = params;
  //   api calls
  const CommonEmployeeDDL = useApiRequest([]);
  const [trainingTypeDDL, getTrainingTypeDDL, loadingTrainingType] =
    useAxiosGet();
  const [trainingTitleDDL, getTrainingTitleDDL, loadingTrainingTitle] =
    useAxiosGet();
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  const [upcommi, setUpcommi] = useState(false);

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  useEffect(() => {
    getTrainingTypeDDL("/trainingType");
  }, [profileData?.buId, profileData?.wgId]);

  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Participants List",
      dataIndex: "perticipant",
      width: 120,
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      width: 50,
    },
    {
      title: "workplaceGroup",
      dataIndex: "workplaceGroup",
      width: 50,
    },
    {
      title: "workplace",
      dataIndex: "workplace",
    },
    {
      title: "Attendance",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="View">
            <Checkbox
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onChange={() => {
                console.log("checked");
              }}
            ></Checkbox>
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
      {loading || (loadingTrainingType && <Loading />)}
      <PForm
        form={form}
        initialValues={{ reasonForRequisition: data?.requestor }}
      >
        <PCard>
          <PCardHeader
            backButton
            title={`Attendance Tracker`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                icon: <SaveOutlined />,
                onClick: () => {
                  const values = form.getFieldsValue(true);

                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                    })
                    .catch(() => {
                      console.log("error");
                    });
                },
              },
            ]}
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  disabled={type === "view" || type === "status"}
                  options={trainingTypeDDL || []}
                  name="trainingType"
                  label="Training Type"
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
                  label="Training Title"
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
                  options={[]}
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
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[]} // need to change
                  name="trainingOrganizer"
                  label="Training Organizer"
                  placeholder="Training Organizer"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingOrganizer: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Organizer is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[]}
                  name="trainingStatus"
                  label="Training Status"
                  placeholder="Training Status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingStatus: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Status is required",
                    },
                  ]}
                />
              </Col>

              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Vanue"
                  label="Training Vanue"
                  name="trainingVanue"
                  rules={[
                    {
                      required: true,
                      message: "Training Vanue is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Duration"
                  label="Training Duration"
                  name="trainingDuration"
                  rules={[
                    {
                      required: true,
                      message: "Training Duration is required",
                    },
                  ]}
                />
              </Col>

              <Col md={6} sm={24}>
                <PInput
                  type="date"
                  name="attendanceDate"
                  label="Attendance Date"
                  placeholder="Training Start Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      attendanceDate: value,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Attendance Date is required",
                    },
                  ]}
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

export default TnDAttendanceSave;
