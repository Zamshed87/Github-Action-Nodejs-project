import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PModal } from "Components/Modal";
import AssignMultipleCalendar from "./Assign/AssignMultipleCalendar";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

// eslint-disable-next-line @typescript-eslint/ban-types
type TMultiCalendarAssign = {};
const MultiCalendarAssign: React.FC<TMultiCalendarAssign> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Multi Calendar Assign";
  }, []);
  // States
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = React.useState<any>("");

  // Api Actions
  const MultiCalendarAssignLandingFilter = useApiRequest({});

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
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
        isNotAssign: filerList?.calendarAssignId?.length
          ? filerList?.calendarAssignId?.includes(2)
            ? true
            : false
          : undefined,
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
        hrPositionList: [],
        sectionList: [],
      },
      onSuccess: (res) => {
        res.calendarAssignHeader.status = [
          {
            value: 1,
            label: "Assign",
          },
          { value: 2, label: "Not Assign" },
        ];
        console.log(res);
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
      fixed: "left",
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
      title: "Section",
      dataIndex: "section",
      sorter: true,
      filter: true,
      filterKey: "sectionList",
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
      render: (data: any) =>
        data ? moment(data).format("DD-MMM-YYYY") : "N/A",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (data: any) => moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "calendarAssignId",
      align: "center",
      filter: true,
      filterKey: "status",
      render: (data: any) =>
        // Write condition to check status
        data ? (
          <PBadge type="primary" text="Assigned" />
        ) : (
          <PBadge type="danger" text="Not Assign" />
        ),
      width: "50px",
    },
    {
      title: "Action",
      align: "center",
      render: (data: any, record: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                isActive: record?.calendarAssignId,
                type: "calender",
                onClick: () => {
                  setSelectedRowData(record);
                  setOpen(true);
                },
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];

  return (
    <>
      <PCard>
        <PCardHeader
          title="Multiple Calendar Assign"
          // text={`Total Record: ${
          //   MultiCalendarAssignLandingFilter?.data?.totalCount || 0
          // }`}
          onSearch={(e) => {
            landingApi({ searchText: e?.target?.value || "" });
          }}
          // onSearch={(e) => searchFunc(e?.target?.value || "")}
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
      <PModal
        open={open}
        title={`Multiple Calendar Assign ${
          selectedRowData?.employeeName
            ? "| Employee: " + selectedRowData?.employeeName
            : ""
        }`}
        onCancel={() => {
          setOpen(false);
          setSelectedRowData("");
        }}
        width={800}
        components={
          <AssignMultipleCalendar
            setOpen={setOpen}
            selectedRowData={selectedRowData}
          />
        }
      />
    </>
  );
};

export default MultiCalendarAssign;
