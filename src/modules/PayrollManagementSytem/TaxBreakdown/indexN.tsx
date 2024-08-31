import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const TaxBreakdown = () => {
  // Data From Store
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const history = useHistory();

  // Api Actions
  const GetAllSalaryBreakdownLanding = useApiRequest([]);

  const landingApi = () => {
    GetAllSalaryBreakdownLanding?.action({
      urlKey: "GetAllTaxBreakdownLanding",
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
      title: "Tax Group Name",
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
      render: (data: any, item: any) => (
        <div>{item?.isDefault ? "Yes" : "No"}</div>
      ),
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
                    pathname: `/administration/payrollConfiguration/incomeTaxGroup/edit/id:${item?.intSalaryBreakdownHeaderId}`,
                    state: item,
                  });
                },
              },
              {
                type: "view",
                onClick: () => {
                  history.push({
                    pathname: `/administration/payrollConfiguration/incomeTaxGroup/${item?.intSalaryBreakdownHeaderId}`,
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
  return (
    <>
      <PForm
        onFinish={() => {
          history.push(
            "/administration/payrollConfiguration/incomeTaxGroup/create"
          );
        }}
      >
        <PCard>
          <PCardHeader
            title="Tax Group List"
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
              landingApi();
            }}
          />
        </PCard>
      </PForm>
    </>
  );
};

export default TaxBreakdown;
