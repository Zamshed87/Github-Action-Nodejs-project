import { Form, Tag } from "antd";
import Loading from "common/loading/Loading";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getSerial } from "Utils";
import { useHistory } from "react-router-dom";
import ViewModal from "./components/view-modal";
import { PModal } from "Components/Modal";
import { getQuestionaireById } from "./helper";

const EmInterviewLanding = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, wId } = profileData;

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
                backgroundColor: "var(--error)",
                color: "white",
                borderRadius: "3px",
              }}
              onClick={() => {
                history.push("/interview", {
                  quesId: rec.id,
                });
              }}
            >
              INTERVIEW
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
              VIEW
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

export default EmInterviewLanding;
