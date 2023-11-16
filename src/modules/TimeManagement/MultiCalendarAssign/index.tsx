import { DataTable, PCard, PCardHeader } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

type TMultiCalendarAssign = {};
const MultiCalendarAssign: React.FC<TMultiCalendarAssign> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const MultiCalendarAssignLandingFilter = useApiRequest({});

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

  useEffect(() => {
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  console.log(MultiCalendarAssignLandingFilter?.data);

  const header: any = [
    {
      title: "SL",
      dataIndex: "sl",
      render: (value: any, row: any, index: number) =>
        (MultiCalendarAssignLandingFilter?.data?.currentPage - 1) *
          MultiCalendarAssignLandingFilter?.data?.pageSize +
        index +
        1,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
    },
    {
      title: "Generate Date",
      dataIndex: "generateDate",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
    },
    {
      title: "Roster Name",
      dataIndex: "rosterGroupName",
    },
    {
      title: "Calender Name",
      dataIndex: "calendarName",
    },
    {
      title: "Action",
      dataIndex: "",
    },
  ];

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
          pagination={{
            current: MultiCalendarAssignLandingFilter?.data?.currentPage,
            pageSize: MultiCalendarAssignLandingFilter?.data?.pageSize,
            total: MultiCalendarAssignLandingFilter?.data?.totalCount,
          }}
          loading={MultiCalendarAssignLandingFilter?.loading}
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
