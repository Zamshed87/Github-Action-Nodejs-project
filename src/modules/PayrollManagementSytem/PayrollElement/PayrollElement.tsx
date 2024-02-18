import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreatePayrollElement from "./Create/CreatePayrollElement";

type TPayrollElement = never;
const PayrollElement: React.FC<TPayrollElement> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId } = useSelector(
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
  const DeletePayrollElementTypeById = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "Payroll Element";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Landing Api
  const landingApi = () => {
    GetAllPayrollElementType?.action({
      urlKey: "GetAllPayrollElementType",
      method: "get",
      params: { accountId: orgId, workplaceId: wId },
    });
  };

  const checkUsage = (item: any, type: "delete" | "edit") => {
    IsSalaryElementById?.action({
      urlKey: "IsSalaryElementById",
      method: "get",
      params: {
        accountId: orgId,
        bussinessUnitId: buId,
        workplaceId: wId,
        typeId: item?.intPayrollElementTypeId,
      },
      onSuccess: (res: any) => {
        if (res?.isSalary || res?.isAllowance)
          return toast.warning("This element is used in salary or allowance");

        if (type === "delete") deleteElement(item);
        else if (type === "edit") {
          setRowData(item);
          setOpen(true);
        }
      },
    });
  };
  //  Delete Element
  const deleteElement = (item: any) => {
    DeletePayrollElementTypeById?.action({
      urlKey: "DeletePayrollElementTypeById",
      method: "get",
      params: {
        id: item?.intPayrollElementTypeId,
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
    if (item?.menuReferenceId === 30259) {
      payrollElement = item;
    }
  });
  // Table Header
  const header: any = [
    {
      title: "SL",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Element",
      dataIndex: "strPayrollElementName",
    },
    {
      title: "Is Basic",
      dataIndex: "isBasicSalary",
      render: (data: any) => <div>{data ? "YES" : "NO"}</div>,
    },
    {
      title: "Salary Element",
      dataIndex: "isPrimarySalary",
      render: (data: any) => <div>{data ? "YES" : "NO"}</div>,
    },
    {
      title: "Element Type",
      dataIndex: "isAddition",
      render: (data: any) => <div>{data ? "Addition" : "Deduction"}</div>,
    },
    {
      title: "Taxable",
      dataIndex: "isTaxable",
      render: (data: any) => <div>{data ? "YES" : "NO"}</div>,
    },
    {
      title: "Action",
      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                checkUsage(item, "edit");
              },
            },
            {
              type: "delete",
              onClick: () => {
                checkUsage(item, "delete");
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
              title="Payroll Element"
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
              data={GetAllPayrollElementType?.data || []}
              loading={GetAllPayrollElementType?.loading}
            />
          </PCard>
          <PModal
            title={`${rowData ? "Edit" : "Create"} Payroll Element`}
            open={open}
            width={500}
            onCancel={() => {
              setOpen(false);
            }}
            afterClose={() => {
              setRowData("");
            }}
            components={
              <CreatePayrollElement
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

export default PayrollElement;
