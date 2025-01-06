import {
  BarsOutlined,
  EditOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
import { getSerial } from "Utils";
import { Col, Form, Row, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  formatDate,
  setCustomFieldsValue,
  ViewTrainingRequistion,
} from "./helper";

import { PModal } from "Components/Modal";
import RequisitionView from "./requisitionView";
import Chips from "common/Chips";
import moment from "moment";
import { dateFormatter } from "utility/dateFormatter";
import Filter from "../filter";
import UserInfoCommonField from "../reports/userInfoCommonField";
import { getEnumData } from "common/api/commonApi";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { formatFilterValue } from "../helpers";
const TnDRequisitionLanding = () => {
  const defaultToDate = moment();
  const defaultFromDate = moment().subtract(3, "months");
  const dispatch = useDispatch();
  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30512) {
      permission = item;
    }
  });
  // router states
  const history = useHistory();
  const location = useLocation();
  const firstSegment = location.pathname.split("/")[1];

  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();
  const [reqStatusDDL, setReqStatus] = useState([]);

  // state
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModalModal] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [
    trainingTypeDDL,
    getTrainingTypeDDL,
    loadingTrainingType,
    setTrainingType,
  ] = useAxiosGet();
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
    },
    {
      title: "Requestor",
      dataIndex: "employmentName",
      // filter: true,
      // filterKey: "requestorList",
      // filterSearch: true,
    },
    {
      title: "Training Type",
      dataIndex: "trainingTypeName",
      // filter: true,
      // filterKey: "trainingTypeList",
      // filterSearch: true,
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      // filter: true,
      // filterKey: "createdByList",
      // filterSearch: true,
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
      render: (status: any) => {
        let statusClass = "secondary p-2 rounded-5"; // Default class

        if (status?.label === "Pending") {
          statusClass = "success p-2 rounded-5";
        } else if (status?.label === "Assigned") {
          statusClass = "secondary p-2 rounded-5";
        } else if (status?.label === "Deferred") {
          statusClass = "warning p-2 rounded-5";
        }

        return (
          <div>
            <Chips label={status?.label} classess={statusClass} />
          </div>
        );
      },
      width: 30,
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId: number, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                ViewTrainingRequistion(rec?.id, setLoading, setViewData, () => {
                  setViewModalModal(true);
                });
                // history.push("/trainingAndDevelopment/requisition/view", {
                //   data: rec,
                // });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Edit"}>
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                ViewTrainingRequistion(
                  rec?.id,
                  setLoading,
                  setViewData,
                  (d: any) => {
                    history.push("/trainingAndDevelopment/requisition/edit", {
                      data: d,
                    });
                  }
                );
              }}
            />
          </Tooltip>
          {/* <Tooltip placement="bottom" title={"Status"}>
            <BarsOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingAndDevelopment/requisition/status", {
                  data: rec,
                });
              }}
            />
          </Tooltip> */}
        </Flex>
      ),
      align: "center",
    },
  ];
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

    const apiUrl = `/TrainingRequisition/Training/TrainingRequisition?fromDate=${formatDate(
      fromDate
    )}&toDate=${formatDate(toDate)}&trainingTypeIds=${formatFilterValue(
      values?.trainingType
    )}&departmentIds=${formatFilterValue(
      values?.departmentId
    )}&designationIds=${formatFilterValue(values?.hrPositionId)}&statusIds=${
      formatFilterValue(values?.requisitionStatus)
        ? formatFilterValue(values?.requisitionStatus)
        : ""
    }&pageNumber=${pagination?.current}&pageSize=${pagination?.pageSize}`;

    console.log(apiUrl); // Check the constructed URL
    getLandingApi(apiUrl);
  };
  useEffect(() => {
    dispatch(
      setFirstLevelNameAction(
        firstSegment === "SelfService"
          ? "Employee Self Service"
          : "Training & Development"
      )
    );

    getTrainingTypeDDL("/TrainingType/Training/Type", (data: any) => {
      const list: any = [];
      data?.map((d: any) => {
        if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
      });
      list.unshift({ label: "All", value: 0 });
      setTrainingType(list);
    });
    getEnumData("RequisitionStatus", setReqStatus, setLoading, true);
    landingApiCall();
  }, []);

  return permission?.isView ? (
    <div>
      {loading || (landingLoading && <Loading />)}

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
          requisitionStatus: { label: "All", value: "" },
        }}
      >
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.totalCount || 0} Training Requisition`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  if (firstSegment === "SelfService") {
                    history.push(
                      "/SelfService/traininganddevelopment/trainingRequisition/create"
                    );
                  } else {
                    history.push("/trainingAndDevelopment/requisition/create");
                  }
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
                  isDepartment={true}
                  isDesignation={true}
                />
                <Col md={12} sm={24}>
                  <PSelect
                    options={trainingTypeDDL || []}
                    name="trainingType"
                    label="Training Type"
                    mode="multiple"
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
                <Col md={12} sm={24}>
                  <PSelect
                    options={reqStatusDDL || []}
                    name="requisitionStatus"
                    mode="multiple"
                    disabled={false}
                    label="Requisition Status"
                    onChange={(value, op) => {
                      setCustomFieldsValue(form, "requisitionStatus", value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Requisition Status is required",
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
                        .validateFields(["fromDate", "toDate"])
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
                      form.resetFields([]);
                      form.setFieldsValue({
                        fromDate: defaultFromDate,
                        toDate: defaultToDate,
                        bUnit: { label: "All", value: 0 },
                        workplaceGroup: { label: "All", value: 0 },
                        workplace: { label: "All", value: 0 },
                        department: { label: "All", value: 0 },
                        hrPosition: { label: "All", value: 0 },
                        requisitionStatus: [""],
                        trainingType: [0],
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
        title={"Training Requisition View"}
        width={1000}
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
            <RequisitionView
              data={viewData}
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

export default TnDRequisitionLanding;
