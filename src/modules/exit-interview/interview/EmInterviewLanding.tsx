import { Form } from "antd";
import Loading from "common/loading/Loading";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getSerial } from "Utils";
import InterviewModal from "./components/interview-modal";
import { getQuestionaireById } from "./helper";
import { useHistory } from "react-router-dom";

const EmInterviewLanding = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, wId } = profileData;

  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterList, setFilterList] = useState({});
  const [interviewModal, setInterviewModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  // landing calls
  const landingApi = useApiRequest({});

  // Form Instance
  const [form] = Form.useForm();

  // menu permission
  let QuestionCreationPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30445) {
      QuestionCreationPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
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
      //   assignedToEmployeeId: 0,
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
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Interview Completed By",
      dataIndex: "interviewCompletedBy",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
      width: 100,
    },
    {
      title: "Completed Date",
      dataIndex: "completedDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 50,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (status: string, rec: any) => (
        <Flex justify="center">
          {status === "Assigned" ? (
            <button
              onClick={() => {
                history.push("/interview", {
                  state: { quesId: rec.id, empId: 1 },
                });
                // getQuestionaireById(
                //   rec.id,
                //   setSingleData,
                //   setLoading,
                //   setInterviewModal
                // );
              }}
            >
              Interview
            </button>
          ) : (
            <button>View</button>
          )}
        </Flex>
      ),
      align: "center",
      width: 50,
    },
  ];

  return QuestionCreationPermission?.isView ? (
    <>
      {(loading || landingApi.loading) && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount || 0} Questionnaires`}
          />
          <div className="mb-3">
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
        title="View Template"
        open={interviewModal}
        onCancel={() => {
          setInterviewModal(false);
          setSingleData({});
        }}
        components={<InterviewModal singleData={singleData} />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmInterviewLanding;
