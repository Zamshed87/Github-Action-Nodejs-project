import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

type TUserRole = {

};
const UserRoleN: React.FC<TUserRole> = () => {
  // Data From Store
  const { buId, wgId, wId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // hooks
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  // for create state
  const [open, setOpen] = useState(false);

  // for view state
  const [viewModal, setViewModal] = useState(false);


  // Api Actions
  const GetAllUserRole = useApiRequest({});

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
    GetAllUserRole?.action({
      urlKey: "GetAllUserRole",
      method: "GET",
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
          currentPage: GetAllUserRole?.data?.currentPage,
          pageSize: GetAllUserRole?.data?.pageSize,
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
  console.log(GetAllUserRole?.data);
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
          data={GetAllUserRole?.data?.data || []}
          filterData={
            GetAllUserRole?.data?.calendarAssignHeader // Filter Object From Api Response
          }
          pagination={{
            current: GetAllUserRole?.data?.currentPage,  // Current Page From Api Response
            pageSize: GetAllUserRole?.data?.pageSize, // Page Size From Api Response
            total: GetAllUserRole?.data?.totalCount, // Total Count From Api Response
          }}
          loading={GetAllUserRole?.loading}
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

export default UserRoleN;
