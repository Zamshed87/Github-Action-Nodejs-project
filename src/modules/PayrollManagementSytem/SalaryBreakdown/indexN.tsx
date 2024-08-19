import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { isDevServer } from "App";

type TindexN = {};
const SalaryBreakdownN: React.FC<TindexN> = () => {
  // Data From Store
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const history = useHistory();

  // Api Actions
  const GetAllSalaryBreakdownLanding = useApiRequest([]);

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
    GetAllSalaryBreakdownLanding?.action({
      urlKey: "GetAllSalaryBreakdownLanding",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        departmentId: 0,
        designationId: 0,
        employmentTypeId: 0,
        EmployeeId: employeeId || 0,
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
      render: (text: any, record: any, index: any) => index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Payroll Group Name",
      dataIndex: "strSalaryBreakdownTitle",
    },
    {
      title: "Payroll Policy",
      dataIndex: "strSalaryPolicy",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace group",
      dataIndex: "workplaceGroup",
      sorter: true,
      filter: true,
    },

    {
      title: "Is Default",
      dataIndex: "isDefault",
      render: (data: any, item: any) => <div>{item?.isDefault ? "Yes" : "No"}</div>,
      sorter: true,
      filter: false,
    },
    {
      title: "Action",
      align: "center",
      render: (data: any, item: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "edit",
                // isActive: isDevServer,
                onClick: () => {
                  history.push({
                    pathname: `/administration/payrollConfiguration/salaryBreakdown/edit/id:${item?.intSalaryBreakdownHeaderId}`,
                    state: item,
                  });
                },
              },
              {
                type: "view",
                onClick: () => {
                  history.push({
                    pathname: `/administration/payrollConfiguration/salaryBreakdown/${item?.intSalaryBreakdownHeaderId}`,
                    state: item,
                  });
                },
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];
  console.log(GetAllSalaryBreakdownLanding?.data);
  return (
    <>
      <PForm
        onFinish={() => {
          history.push(
            "/administration/payrollConfiguration/salaryBreakdown/create"
          );
        }}
      >
        <PCard>
          <PCardHeader
            title="Payroll Group List"
            submitText="Create"
            // onSearch={() => {}}
            // buttonList={[{ type: "primary", content: "Create" }]}
          />

          <DataTable
            header={header}
            bordered
            data={GetAllSalaryBreakdownLanding?.data || []}
            loading={GetAllSalaryBreakdownLanding?.loading}
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

export default SalaryBreakdownN;
