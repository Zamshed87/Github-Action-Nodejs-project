import { Col, Form, FormInstance, Row, Switch, Tooltip } from "antd";
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
} from "Components";
import React, { useEffect, useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import axios from "axios";
import { message } from "antd";
import { title } from "process";
import { dateFormatter } from "utility/dateFormatter";
import { shallowEqual, useSelector } from "react-redux";
import { createTrainingType, dataDemo, updateTrainingType } from "./helper";

const TrainingType = ({ setOpenTraingTypeModal }: any) => {
  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: 1,
          pageSize: 1000,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "trainingType",
      dataIndex: "strName",
      filter: true,
      filterKey: "trainingTypeList",
      filterSearch: true,
    },
    {
      title: "Remarks",
      dataIndex: "strRemarks",
      filter: true,
      filterKey: "remarksList",
      filterSearch: true,
    },
    {
      title: "Created by",
      dataIndex: "intCreatedBy",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Created Date,",
      dataIndex: "createdDate",
      render: (text: any) => dateFormatter(text),
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Status">
            <Switch
              size="small"
              defaultChecked={rec?.isActive}
              onChange={() => {
                updateTrainingType(form, profileData, setLoading, rec, true);
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];
  const landingApiCall = () => {
    getLandingApi("/TrainingAndDevelopment/GetAllTrainingType");
  };
  useEffect(() => {
    landingApiCall();
  }, []);

  return (
    <div>
      {(loading || landingLoading) && <Loading />}
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader title={`Total ${landingApi?.length || 0} Training Type`} />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Training Type"
                label="Training Type"
                name="trainingType"
                rules={[
                  {
                    required: true,
                    message: "Training Type is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Remarks"
                label="Remarks"
                name="remarks"
              />
            </Col>
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "22px" }}
                type="primary"
                content="Save"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                      createTrainingType(
                        form,
                        profileData,
                        setLoading,
                        setOpenTraingTypeModal
                      );
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
            data={dataDemo || []}
            loading={landingLoading}
            header={header}
            // pagination={{
            //   pageSize: landingApi?.data?.pageSize,
            //   total: landingApi?.data?.totalCount,
            // }}
            filterData={landingApi?.data?.filters}
            // onChange={(pagination, filters) => {
            //   landingApiCall();
            // }}
          />
        </div>
        {/* </PCard> */}
      </PForm>
    </div>
  );
};

export default TrainingType;
