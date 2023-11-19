import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

type TMultiCalendarAssign = {};
const MultiCalendarAssign: React.FC<TMultiCalendarAssign> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Api Actions
  const MultiCalendarAssignLandingFilter = useApiRequest({});

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
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    MultiCalendarAssignLandingFilter?.action({
      urlKey: "MultiCalendarAssignLandingFilter",
      method: "POST",
      payload: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        isNotAssign: false,
        pageNo: pagination?.current || 1,
        pageSize: pagination?.pageSize || 25,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
        designationList: [],
        departmentList: [],
        supervisorNameList: [],
        employmentTypeList: [],
        wingNameList: [],
        soleDepoNameList: [],
        regionNameList: [],
        areaNameList: [],
        territoryNameList: [],
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) =>
        getSerial({
          currentPage: MultiCalendarAssignLandingFilter?.data?.currentPage,
          pageSize: MultiCalendarAssignLandingFilter?.data?.pageSize,
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
  console.log(MultiCalendarAssignLandingFilter?.data);
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
          data={MultiCalendarAssignLandingFilter?.data?.data || []}
          filterData={
            MultiCalendarAssignLandingFilter?.data?.calendarAssignHeader // Filter Object From Api Response
          }
          pagination={{
            current: MultiCalendarAssignLandingFilter?.data?.currentPage, // Page No from api response
            pageSize: MultiCalendarAssignLandingFilter?.data?.pageSize, // Page Size from api response
            total: MultiCalendarAssignLandingFilter?.data?.totalCount, // Total Count from api response
          }}
          loading={MultiCalendarAssignLandingFilter?.loading}
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

export default MultiCalendarAssign;
