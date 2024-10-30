import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateJobClass from "../payscale/CreateJobClass";

type TJobClass = never;
const JobClassLanding: React.FC<TJobClass> = () => {
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
  const jobClassLanding = useApiRequest([]);
  const deleteJobClass = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "Job Class";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Landing Api
  const landingApi = () => {
    jobClassLanding?.action({
      urlKey: "JobClassLanding",
      method: "get",
      params: {
        businessUnitId: buId,
        pageNo: 1,
        pageSize: 1000,
        accountId: orgId,
      },
    });
  };

  //  Delete
  const deleteJobClassById = (item: any) => {
    deleteJobClass?.action({
      urlKey: "DeleteJobClass",
      method: "DELETE",
      params: {
        id: item?.id,
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
    if (item?.menuReferenceId === 30435) {
      payrollElement = item;
    }
  });
  // Table Header
  const header: any = [
    {
      title: "SL",
      align: "center",
      width: 10,

      render: (text: any, record: any, index: number) => index + 1,
    },

    {
      title: "Payscale Class",
      dataIndex: "jobClassName",
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
                setRowData(item);
                setOpen(true);
              },
            },
            // {
            //   type: "delete",
            //   onClick: () => {
            //     deleteJobClassById(item);
            //   },
            // },
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
              title="Payscale Class"
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
              data={jobClassLanding?.data?.jobClassLandingData || []}
              loading={jobClassLanding?.loading}
            />
          </PCard>
          <PModal
            title={`${rowData ? "Edit" : "Create"} Job Class`}
            open={open}
            width={500}
            onCancel={() => {
              setOpen(false);
            }}
            afterClose={() => {
              setRowData("");
            }}
            components={
              <CreateJobClass
                singleData={rowData}
                getData={landingApi}
                modalFooter={true}
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

export default JobClassLanding;
