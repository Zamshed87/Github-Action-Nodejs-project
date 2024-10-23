/*
 * Title: Letter Config Landing
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Form, Switch } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { getSerial } from "Utils";
import TemplateViewModal from "./templateViewModal";

const LetterConfigLanding = () => {
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
  let letterConfigPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30440) {
      letterConfigPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Letter Configuration";
    () => {
      document.title = "PeopleDesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    searchText = "",
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
      searchTxt: searchText || "",
      letterTypeList: filters?.letterType || [],
      createdByList: filters?.createdByEmployee || [],
      statusList: filters?.status || [],
    };
    landingApi.action({
      urlKey: "GetLetterTemplateLanding",
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
    },
    {
      title: "Created By",
      dataIndex: "createdByEmployee",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      render: (data: any) => dateFormatter(data),
    },
    {
      title: "Status",
      dataIndex: "status",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
      render: (data: any) => (
        <>
          <Switch size="small" checked={data === "Active" ? true : false} />{" "}
        </>
      ),
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "templateId",
      render: (templateId: number, rec: any) => (
        <Flex justify="center">
          <EditOutlined
            style={{
              color: "green",
              fontSize: "14px",
              cursor: "pointer",
              marginRight: "5px",
            }}
            onClick={() => {
              history.push({
                pathname: `/profile/customReportsBuilder/letterConfiguration/createLetter/${templateId}`,
                state: rec,
              });
            }}
          />
          <EyeOutlined
            style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
            onClick={() => {
              setSingleData(rec);
              setOpen(true);
            }}
          />
        </Flex>
      ),
      align: "center",
    },
  ];

  return letterConfigPermission?.isView ? (
    <>
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount} templates`}
            buttonList={[
              {
                type: "primary",
                content: "Configure Letter",
                icon: "plus",
                onClick: () => {
                  if (letterConfigPermission?.isCreate) {
                    history.push(
                      "/profile/customReportsBuilder/letterConfiguration/createLetter"
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <div className="mb-3">
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
        components={<TemplateViewModal singleData={singleData} />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default LetterConfigLanding;
