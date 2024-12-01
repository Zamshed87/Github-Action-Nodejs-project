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
import { createTrainingCost, updateTrainingCost } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import { EditOutlined } from "@ant-design/icons";

const TrainingCost = ({ setOpenCostTypeModal }: any) => {
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
      title: "Cost Type",
      dataIndex: "strName",
      filter: true,
      filterKey: "costTypeList",
      filterSearch: true,
    },
    {
      title: "Description",
      dataIndex: "strDescription",
      filter: true,
      filterKey: "costDescriptionList",
      filterSearch: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip
            placement="bottom"
            title={rec?.isActive ? "Inactive" : "Active"}
          >
            <Switch
              size="small"
              checked={rec?.isActive}
              onChange={() => {
                updateTrainingCost(
                  form,
                  profileData,
                  setLoading,
                  rec,
                  true,
                  () => {
                    landingApiCall();
                  }
                );
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Edit">
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                form.setFieldsValue({
                  costType: rec?.strName,
                  costDescription: rec?.strDescription,
                  singleData: rec,
                  editAction: true,
                });
              }}
            />
          </Tooltip>

          {/* <Tooltip placement="bottom" title="Delete">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                deleteTrainingType(rec, setLoading, () => {
                  landingApiCall();
                  form.resetFields();
                });
              }}
            />
          </Tooltip> */}
        </Flex>
      ),
      align: "center",
      width: 30,
    },
  ];
  const landingApiCall = () => {
    getLandingApi("/TrainingCostType/Training/CostType");
  };
  useEffect(() => {
    landingApiCall();
  }, []);

  // Watch for editAction changes
  const editAction = Form.useWatch("editAction", form);

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader
          title={`Total ${
            landingApi?.data?.totalCount || 0
          } Training Cost Type`}
        />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Cost Type"
                label="Cost Type"
                name="costType"
                rules={[
                  {
                    required: true,
                    message: "Cost Type is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Description"
                label="Cost Description"
                name="costDescription"
              />
            </Col>
            <Col md={6} sm={24}>
              <Form.Item name="editAction" hidden>
                <input type="hidden" />
              </Form.Item>
              <PButton
                style={{
                  marginTop: "22px",
                  backgroundColor: editAction ? "red" : "",
                }}
                type="primary"
                content={editAction ? "Edit" : "Save"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      editAction
                        ? updateTrainingCost(
                            form,
                            profileData,
                            setLoading,
                            values?.singleData,
                            false,
                            () => {
                              landingApiCall();
                              form.resetFields();
                            }
                          )
                        : createTrainingCost(
                            form,
                            profileData,
                            setLoading,
                            () => {
                              landingApiCall();
                              // Reset form after successful submission
                              form.resetFields();
                            }
                            // setOpenTraingTypeModal
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
            data={landingApi || []}
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

export default TrainingCost;
