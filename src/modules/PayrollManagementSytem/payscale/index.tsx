import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateEditPayscale from "./CreateEditPayscale";
// import CreatePayrollElement from "./Create/CreatePayrollElement";

type TPayscale = never;
const PayscaleLanding: React.FC<TPayscale> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  //   States
  const [rowData, setRowData] = useState<any>("");
  const [open, setOpen] = useState(false);
  // Api Actions
  const GetAllPayrollElementType = useApiRequest([]);
  const IsSalaryElementById = useApiRequest({});
  const deletePayScale = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "Payscale Setup";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Landing Api
  const landingApi = () => {
    GetAllPayrollElementType?.action({
      urlKey: "GetPayScaleSetupLanding",
      method: "get",
      params: {
        businessUnitId: buId,
        pageNo: 1,
        pageSize: 150,
        accountId: orgId,
      },
    });
  };

  //  Delete Element
  const deleteElement = (item: any) => {
    deletePayScale?.action({
      urlKey: "DeletePayScaleSetup",
      method: "delete",
      params: {
        id: item?.id,
        actionBy: employeeId,
      },
      toast: true,
      onSuccess: () => {
        landingApi();
      },
    });
  };

  // menu permission check
  let payrollElement: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30442) {
      payrollElement = item;
    }
  });
  // Table Header
  const header: any = [
    {
      title: "SL",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
      width: 20,
    },
    {
      title: "PayScale Name",
      dataIndex: "payScaleName",
      width: 50,
    },
    {
      title: "Payscale Class",
      dataIndex: "jobClassName",
      width: 50,
    },
    {
      title: "Payscale Grade",
      dataIndex: "jobGradeName",
      width: 50,
    },
    {
      title: "Payscale Level",
      dataIndex: "jobLevelName",
      width: 50,
    },

    {
      title: "",
      width: 20,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                // checkUsage(item, "edit");
                setRowData(item);
                setOpen(true);
              },
            },
            {
              type: "delete",
              onClick: () => {
                deleteElement(item);
              },
            },
          ]}
        />
      ),
    },
  ];
  return (
    <>
      {payrollElement?.isCreate ? (
        <>
          <PCard>
            <PCardHeader
              title="Payscale Setup"
              buttonList={[
                {
                  type: "primary",
                  content: "Create",
                  onClick: () => {
                    setOpen(true);
                  },
                },
              ]}
            />

            <DataTable
              header={header}
              bordered
              data={
                GetAllPayrollElementType?.data?.payScaleSetupLandingData || []
              }
              loading={GetAllPayrollElementType?.loading}
            />
          </PCard>
          <PModal
            title={`${rowData ? "Edit" : "Create"} Payscale`}
            open={open}
            width={900}
            onCancel={() => {
              setOpen(false);
            }}
            afterClose={() => {
              setRowData("");
            }}
            components={
              <CreateEditPayscale
                rowData={rowData}
                landingApi={landingApi}
                setOpen={setOpen}
              />
            }
          />
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default PayscaleLanding;
