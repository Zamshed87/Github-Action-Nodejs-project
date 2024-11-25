import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Row } from "antd";
import Loading from "common/loading/Loading";
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
                  name="employee"
                  label="Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
                  }}
                  showSearch
                  filterOption={false}
                  allowClear={true}
                  rules={[
                    {
                      required: true,
                      message: "Employee is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
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
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </div>
  );
};

export default TnDAttendanceSave;
