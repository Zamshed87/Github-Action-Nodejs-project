import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getSerial } from "Utils";
import { useHistory } from "react-router-dom";
import { PModal } from "Components/Modal";
import ViewModal from "./components/view-modal";
import { getQuestionaireById } from "./helper";
import Filter from "modules/TrainingAndDevelopment/filter";
import { setCustomFieldsValue } from "modules/TrainingAndDevelopment/requisition/helper";

const EssInterviewLanding = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, wId, employeeId } = profileData;

  const [filterList, setFilterList] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [loading, setLoading] = useState(false);

  // landing calls
  const landingApi = useApiRequest({});

  // Form Instance
  const [form] = Form.useForm();

  // menu permission
  let QuestionCreationPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30447) {
      QuestionCreationPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    document.title = "Interview";

    // Cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "PeopleDesk";
    };
  }, [dispatch]);

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filters?: any;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: 25 },
    filters = filterList,
  }: TLandingApi) => {
    const payload = {
      assignedToEmployeeId: employeeId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeeded: true,
      assignedToList: filters?.assignedTo || [],
      resignStatusList: filters?.resignStatus || [],
      interviewCompletedByList: filters?.interviewCompletedBy || [],
      statusList: filters?.status || [],
    };
    landingApi?.action({
      urlKey: "GetInterviewLanding",
      method: "POST",
      payload: payload,
    });
  };

  console.log(filterList);

  useEffect(() => {
    landingApiCall({});
  }, [wgId, wId, buId]);

  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
      width: 30,
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      filter: true,
      filterKey: "assignedToList",
      filterSearch: true,
      width: 100,
    },
    {
      title: "Length of Service",
      dataIndex: "lengthOfService",
    },
    {
      title: "Date of Resign",
      dataIndex: "dateOfResign",
    },
    {
      title: "Resign Status",
      dataIndex: "resignStatus",
      filter: true,
      filterKey: "resignStatusList",
      filterSearch: true,
    },
    {
      title: "Interview Completed By",
      dataIndex: "interviewCompletedBy",
      filter: true,
      filterKey: "interviewCompletedByList",
      filterSearch: true,
      width: 100,
    },
    {
      title: "Completed Date",
      dataIndex: "completedDate",
    },
    {
      title: "Interview Type",
      dataIndex: "questionnaireType",
      render: (_: any, rec: any) => rec?.questionnaireType?.label,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 50,
      align: "center",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
      render: (status: string) => (
        <Tag
          style={{
            color: "grey",
            border: "1px solid lightGrey",
            fontWeight: 500,
          }}
          color={status === "Assigned" ? "geekblue" : "green"}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (status: string, rec: any) => (
        <Flex justify="center">
          {status === "Assigned" ? (
            <button
              style={{
                padding: "0 4px",
                fontSize: "10px",
                border: 0,
                backgroundColor:
                  rec?.questionnaireType?.label === "Exit Interview"
                    ? "var(--error)"
                    : rec?.questionnaireType?.label === "Training Assessment"
                    ? "var(--success)"
                    : "var(--orange)",
                color: "white",
                borderRadius: "3px",
              }}
              onClick={() => {
                history.push("/interview", {
                  quesId: rec.id,
                });
              }}
            >
              {rec?.questionnaireType?.label === "Exit Interview"
                ? "Interview"
                : rec?.questionnaireType?.label === "Training Assessment"
                ? "Assessment"
                : "Feedback"}
            </button>
          ) : (
            <button
              style={{
                padding: "0 4px",
                fontSize: "10px",
                border: 0,
                backgroundColor: "green",
                color: "white",
                borderRadius: "3px",
              }}
              onClick={() => {
                getQuestionaireById(rec?.id, setSingleData, setLoading).then(
                  () => {
                    setViewModal(true);
                  }
                );
              }}
            >
              View
            </button>
          )}
        </Flex>
      ),
      align: "center",
      width: 50,
    },
  ];
  return QuestionCreationPermission?.isView ? (
    <>
      {(landingApi.loading || loading) && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount || 0} Questionnaires`}
          />
          <div className="">
            {/* <Filter form={form}>
              <Row gutter={[10, 2]}>
                <Col md={12} sm={24}>
                  <PSelect
                    options={
                      landingApi?.data?.filters?.interviewCompletedByList || []
                    }
                    name="interviewCompletedByList"
                    label="Interview Completed By"
                    mode="multiple"
                    showSearch
                    onChange={(value, op) => {
                      setCustomFieldsValue(
                        form,
                        "interviewCompletedByList",
                        value
                      );
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Interview Completed By is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={12} sm={24}>
                  <PSelect
                    options={landingApi?.data?.filters?.statusList || []}
                    name="statusList"
                    label="Status"
                    mode="multiple"
                    showSearch
                    onChange={(value, op) => {
                      setCustomFieldsValue(form, "statusList", value);
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Status is required",
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
                        .validateFields([])
                        .then(() => {
                          console.log(values);
                          landingApiCall({});
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

                      landingApiCall({});
                    }}
                  />
                </Col>
              </Row>
            </Filter> */}
            {landingApi?.data?.totalCount > 0 ? (
              <DataTable
                bordered
                data={landingApi?.data?.data || []}
                loading={landingApi?.loading}
                header={header}
                pagination={{
                  pageSize: landingApi?.data?.pageSize,
                  total: landingApi?.data?.totalCount,
                }}
                filterData={landingApi?.data?.filters}
                onChange={(pagination, filters) => {
                  setFilterList(filters);
                  landingApiCall({
                    pagination,
                    filters: filters,
                  });
                }}
              />
            ) : (
              <NoResult />
            )}
          </div>
        </PCard>
      </PForm>
      <PModal
        title="View Answers"
        open={viewModal}
        onCancel={() => {
          setViewModal(false);
          setSingleData(null);
        }}
        components={<ViewModal singleData={singleData} />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EssInterviewLanding;
