/*
 * Title: Exit interview landing
 * Author: Khurshida Meem
 * Date: 12-11-2024
 *
 */

import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Form, Switch, Tooltip } from "antd";
import axios from "axios";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getSerial } from "Utils";
import { getSingleQuestionnaire } from "./helper";
import Loading from "common/loading/Loading";
import QuestionaireView from "./QuestionaireView";

const QuestionCreationLanding = () => {
  // router states
  const history = useHistory();

  // Form Instance
  const [form] = Form.useForm();

  //   Data from redux state
  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, wId } = profileData;

  // menu permission
  let QuestionCreationPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30444) {
      QuestionCreationPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Question Creation";

    // Cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "PeopleDesk";
    };
  }, [dispatch]);

  // states
  const [filterList, setFilterList] = useState({});
  const [open, setOpen] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);

  // landing calls
  const landingApi = useApiRequest({});

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
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeeded: true,
      typeList: filters?.type || [],
      createdByList: filters?.createdBy || [],
      statusList: filters?.status || [],
    };
    landingApi?.action({
      urlKey: "GetQuestionLanding",
      method: "POST",
      payload: payload,
    });
  };

  useEffect(() => {
    landingApiCall({});
  }, [wgId, wId, buId]);

  const [switchStatus, setSwitchStatus] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    const initialSwitchStatus = (landingApi?.data?.data || []).reduce(
      (acc: any, item: any) => {
        acc[item.id] = item.status === "Active";
        return acc;
      },
      {}
    );
    setSwitchStatus(initialSwitchStatus);
  }, [landingApi?.data?.data]);

  const handleSwitchChange = (checked: boolean, id: number) => {
    setSwitchStatus((prev) => ({
      ...prev,
      [id]: checked,
    }));
    axios?.put("/Questionnaire/Active", {
      id,
      active: checked,
    });
  };

  // table column
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
    },
    {
      title: "Survey Type",
      dataIndex: "type",
      filter: true,
      filterKey: "typeList",
      filterSearch: true,
    },
    {
      title: "Survey Title",
      dataIndex: "title",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
    },
    {
      title: "Number of Questions",
      dataIndex: "noOfQuestions",
      width: 50,
    },
    {
      title: "Status",
      dataIndex: "status",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
      render: (_data: any, rec: any) => (
        <>
          <Switch
            size="small"
            checked={switchStatus[rec.id]}
            onChange={(checked) => handleSwitchChange(checked, rec.id)}
          />{" "}
        </>
      ),
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (_: number, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                getSingleQuestionnaire(
                  rec?.id,
                  setSingleData,
                  setLoading,
                  setOpen
                );
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Edit"}>
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 4px",
              }}
              onClick={() => {
                history.push(
                  `/profile/exitInterview/questionCreation/edit/${rec.id}`
                );
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return QuestionCreationPermission?.isView ? (
    <>
      {(loading || landingApi.loading) && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount || 0} Questions`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  if (QuestionCreationPermission?.isCreate) {
                    history.push(
                      `/profile/exitInterview/questionCreation/create`
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
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
        open={open}
        onCancel={() => {
          setOpen(false);
          setSingleData({});
        }}
        components={<QuestionaireView singleData={singleData} />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationLanding;
