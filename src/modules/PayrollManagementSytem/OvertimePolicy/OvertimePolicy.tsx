import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

type TOvertimePolicy = unknown;
const OvertimePolicyN: React.FC<TOvertimePolicy> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const history = useHistory();

  // Api Actions
  const GetOverTimeConfig = useApiRequest([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Overtime Policy";
  }, []);

  // Landing Api
  const landingApi = () => {
    GetOverTimeConfig?.action({
      urlKey: "GetOverTimeConfig",
      method: "GET",
      params: {
        accountId: orgId,
        workplaceId: wId,
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
      dataIndex: "sl",
      align: "center",
      width: 15,
    },
    {
      title: "Policy Name",
      dataIndex: "strPolicyName",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplaceName",
    },
    {
      title: "HR Position",
      dataIndex: "strHrPositionName",
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
    },

    {
      title: "Action",
      align: "center",
      render: (data: any, rec: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: () => {
                  history.push(
                    `/administration/payrollConfiguration/overtimePolicy/edit/policyID:${rec?.intOtconfigId}`,
                    { ...rec }
                  );
                },
              },
              {
                type: "delete",
                // onClick: () => {},
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
            "/administration/payrollConfiguration/overtimePolicy/create"
          );
        }}
      >
        <PCard>
          <PCardHeader title="Over Time Policy" submitText="Create" />

          <DataTable
            header={header}
            bordered
            data={GetOverTimeConfig?.data || []}
            loading={GetOverTimeConfig?.loading}
            scroll={{ x: 1000 }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
            }}
          />
        </PCard>
      </PForm>
    </>
  );
};

export default OvertimePolicyN;
