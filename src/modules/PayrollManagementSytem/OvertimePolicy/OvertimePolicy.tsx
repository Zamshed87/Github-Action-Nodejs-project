import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

type TOvertimePolicy = {};
const OvertimePolicyN: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const history = useHistory();

  // Api Actions
  const AccountWiseGetOverTimeConfig = useApiRequest({});

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
    AccountWiseGetOverTimeConfig?.action({
      urlKey: "AccountWiseGetOverTimeConfig",
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
          currentPage: AccountWiseGetOverTimeConfig?.data?.currentPage,
          pageSize: AccountWiseGetOverTimeConfig?.data?.pageSize,
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
  console.log(AccountWiseGetOverTimeConfig?.data);
  return (
    <>
      <PForm
        onFinish={() => {
          history.push(
            "/administration/payrollConfiguration/overtimePolicy/create"
          );
        }}
      >
        <PCard>
          <PCardHeader title="Over Time Policy" submitText="Create" />

          <DataTable
            header={header}
            bordered
            data={AccountWiseGetOverTimeConfig?.data?.data || []}
            loading={AccountWiseGetOverTimeConfig?.loading}
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
      </PForm>
    </>
  );
};

export default OvertimePolicyN;
