import { EditOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Row, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  Flex,
  PButton,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import { createTrainerInfo, updateTrainerInfo } from "./helper";

const TrainerInfo = ({ setOpenTraingTypeModal }: any) => {
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
      title: "Inhouser Trainer?",
      dataIndex: "inhouserTrainer",
      filter: true,
      filterKey: "inhouserTrainerList",
      filterSearch: true,
    },
    {
      title: "Name of Trainer",
      dataIndex: "nameofTrainer",
      filter: true,
      filterKey: "nameofTrainerList",
      filterSearch: true,
    },
    {
      title: "Name of Organization",
      dataIndex: "nameOfOrganization",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Contact No",
      dataIndex: "trainerContactNo",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Email",
      dataIndex: "trainerEmail",
      filter: true,
      filterKey: "trainerEmailList",
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
                updateTrainerInfo(
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
                  trainingType: rec?.strName,
                  remarks: rec?.strRemarks,
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
    getLandingApi("/TrainingAndDevelopment/GetAllTrainingType");
  };
  useEffect(() => {
    landingApiCall();
  }, []);

  // Watch for editAction changes
  const editAction = Form.useWatch("editAction", form);

  return (
    <div>
      {(loading || landingLoading) && <Loading />}
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader title={`Total ${landingApi?.length || 0} Trainer`} />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={4} sm={24}>
              <Checkbox
                name="inhouseTrainer"
                onChange={(e) => {
                  form.setFieldsValue({
                    inhouseTrainer: e.target.checked,
                  });
                }}
              >
                Inhouse Trainer?
              </Checkbox>
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Name of Trainer"
                label="Name of Trainer"
                name="nameofTrainer"
                rules={[
                  {
                    required: true,
                    message: "Name of Trainer is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Name of Organization"
                label="Name of Organization"
                name="nameofOrganization"
                rules={[
                  {
                    required: true,
                    message: "Name of Organization is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Trainer Email"
                label="Trainer Email"
                name="trainerEmail"
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
                        ? updateTrainerInfo(
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
                        : createTrainerInfo(
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

export default TrainerInfo;
