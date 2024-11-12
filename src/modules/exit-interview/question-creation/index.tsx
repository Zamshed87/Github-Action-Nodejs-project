import { EyeOutlined } from "@ant-design/icons";
import { Form, Tooltip } from "antd";
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
import { dateFormatter } from "utility/dateFormatter";
import { getSerial } from "Utils";

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
  const { orgId, buId, wgId, wId } = profileData;

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

  // landing calls
  const landingApi = useApiRequest({});

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filters?: any;
    searchText?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: 25 },
    filters = filterList,
  }: TLandingApi) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeeded: true,
      letterTypeList: filters?.letterType || [],
      createdByList: filters?.createdByEmployee || [],
      letterNameList: filters?.letterName || [],
      issuedEmployeeIdList: filters?.issuedEmployeeName || [],
    };
    landingApi?.action({
      urlKey: "GetGeneratedLetterLanding",
      method: "POST",
      payload: payload,
    });
  };

  useEffect(() => {
    landingApiCall({});
  }, [wgId, wId, buId]);

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
      title: "Letter Type",
      dataIndex: "letterType",
      filter: true,
      filterKey: "letterTypeList",
      filterSearch: true,
    },
    {
      title: "Letter Name",
      dataIndex: "letterName",
      filter: true,
      filterKey: "letterNameList",
      filterSearch: true,
    },
    {
      title: "Issued To",
      dataIndex: "issuedEmployeeName",
      filter: true,
      filterKey: "issuedEmployeeIdList",
      filterSearch: true,
    },
    {
      title: "Issued By",
      dataIndex: "createdByEmployee",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Issued Date",
      dataIndex: "createdAt",
      render: (data: any) => dateFormatter(data),
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
                setSingleData(rec);
                setOpen(true);
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
                data={[]}
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
        components={<>hi</>}
        width={1000}
      />
      {/* <div className="d-none">
        <div ref={printLetterRef}>
          <LetterPrint singleData={pdfData} />
        </div>
      </div> */}
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationLanding;
