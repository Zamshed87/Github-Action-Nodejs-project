import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

type TUserInfo = {};
const UserInfoN: React.FC<TUserInfo> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  // Api Actions
  const apiKeyFromApiPath = useApiRequest({});

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
  };
  const landingApi = ({
    pagination = {},
    filerList = [],
    searchText = "",
  }: TLandingApi = {}) => {
    // apiKeyFromApiPath?.action({
    //   urlKey: "apiKeyFromApiPath",
    //   method: "POST",
    //   payload: {
    //     businessUnitId: buId,
    //     workplaceGroupId: wgId,
    //     workplaceId: wId,
    //     isNotAssign: false,
    //     pageNo: pagination?.current || 1,
    //     pageSize: pagination?.pageSize || 25,
    //     isPaginated: true,
    //     isHeaderNeed: true,
    //     searchTxt: searchText || "",
    //     designationList: [],
    //     departmentList: [],
    //     supervisorNameList: [],
    //     employmentTypeList: [],
    //     wingNameList: [],
    //     soleDepoNameList: [],
    //     regionNameList: [],
    //     areaNameList: [],
    //     territoryNameList: [],
    //   },
    // });
  };

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();

    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Users Info";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) =>
        getSerial({
          currentPage: apiKeyFromApiPath?.data?.currentPage,
          pageSize: apiKeyFromApiPath?.data?.pageSize,
          index,
        }),

      align: "center",
      width: 20,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
      filterKey: "designationList",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
      width: "80px",
    },
    {
      title: "Generate Date",
      dataIndex: "generateDate",
      render: (data: any, record: any, index: number) =>
        moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (data: any, record: any, index: number) =>
        moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (data: any, record: any, index: number) => (
        // Write condition to check status
        <PBadge type="primary" text="Active" />
      ),
      width: "50px",
    },
    {
      title: "Action",
      align: "center",
      render: (data: any, record: any, index: number) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: (e) => {},
              },
              {
                type: "delete",
                onClick: (e) => {},
              },
              {
                type: "view",
                onClick: (e) => {},
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];
  console.log(apiKeyFromApiPath?.data);
  return (
    <>
      <PCard>
        <PCardHeader
          title="Multi Calendar Assign"
          onSearch={() => {}}
          buttonList={[{ type: "primary", content: "Assign" }]}
        />

        <DataTable
          header={header}
          bordered
          data={apiKeyFromApiPath?.data?.data || []}
          filterData={
            apiKeyFromApiPath?.data?.calendarAssignHeader // Filter Object From Api Response
          }
          pagination={{
            current: apiKeyFromApiPath?.data?.currentPage, // Current Page From Api Response
            pageSize: apiKeyFromApiPath?.data?.pageSize, // Page Size From Api Response
            total: apiKeyFromApiPath?.data?.totalCount, // Total Count From Api Response
          }}
          loading={apiKeyFromApiPath?.loading}
          scroll={{ x: 1000 }}
          onChange={(pagination, filters, sorter, extra) => {
            if (extra.action === "sort") return;
            landingApi({
              pagination,
              filerList: filters,
            });
          }}
        />
      </PCard>
    </>
  );
};

export default UserInfoN;
