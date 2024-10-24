import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateJobLevel from "../payscale/CreateJoblevel";

type TJobLvel = never;
const JobLevelLanding: React.FC<TJobLvel> = () => {
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
  const jobLevelLanding = useApiRequest([]);
  const deleteJobLevel = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "Job Level";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Landing Api
  const landingApi = () => {
    jobLevelLanding?.action({
      urlKey: "JobLevelLanding",
      method: "get",
      params: {
        businessUnitId: buId,
        pageNo: 1,
        pageSize: 100,
        accountId: orgId,
      },
    });
  };

  //  Delete Element
  const deleteJobLevelById = (item: any) => {
    deleteJobLevel?.action({
      urlKey: "DeleteJobLevel",
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
    if (item?.menuReferenceId === 30437) {
      payrollElement = item;
    }
  });
  // Table Header
  const header: any = [
    {
      title: "SL",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
      width: 30,
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
                setRowData(item);
                setOpen(true);
              },
            },
            // {
            //   type: "delete",
            //   onClick: () => {
            //     deleteJobLevelById(item);
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
              title="Payscale Level"
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
              data={jobLevelLanding?.data?.jobLevelLandingData || []}
              loading={jobLevelLanding?.loading}
            />
          </PCard>
          <PModal
            title={`${rowData ? "Edit" : "Create"} Job Level`}
            open={open}
            width={500}
            onCancel={() => {
              setOpen(false);
            }}
            afterClose={() => {
              setRowData("");
            }}
            components={
              <CreateJobLevel
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

export default JobLevelLanding;
