/*
 * Title: Letter Generate Landing
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import { EyeOutlined, PrinterOutlined, SendOutlined } from "@ant-design/icons";
import { Form, Tooltip } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getSerial } from "Utils";

const LetterGenerateLanding = () => {
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
  let letterGenPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30441) {
      letterGenPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Letter Generate";
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
    //  {
    //    title: "Created Date",
    //    dataIndex: "createdAt",
    //    render: (data: any) => dateFormatter(data),
    //  },

    {
      title: "Action",
      dataIndex: "templateId",
      render: (templateId: number, rec: any) => (
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
          <Tooltip placement="bottom" title={"Print"}>
            <PrinterOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Send"}>
            <SendOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                marginRight: "5px",
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return letterGenPermission?.isView ? (
    <>
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount} templates`}
            buttonList={[
              {
                type: "primary",
                content: "Generate Letter",
                icon: "plus",
                onClick: () => {
                  if (letterGenPermission?.isCreate) {
                    history.push(
                      "/profile/customReportsBuilder/letterGenerate/generateLetter"
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
      {/* <PModal
        title="View Template"
        open={open}
        onCancel={() => {
          setOpen(false);
          setSingleData({});
        }}
        components={<TemplateViewModal singleData={singleData} />}
        width={1000}
      /> */}
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default LetterGenerateLanding;
