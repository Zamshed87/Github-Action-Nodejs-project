import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateGrade from "../payscale/CreateGrade";

type TJobGrade = never;
const GradeLanding: React.FC<TJobGrade> = () => {
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
  const gradeLanding = useApiRequest([]);
  const deleteGrade = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "Grade";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Landing Api
  const landingApi = () => {
    gradeLanding?.action({
      urlKey: "JobGradeLanding",
      method: "get",
      params: {
        businessUnitId: 1,
        pageNo: 1,
        pageSize: 100,
        accountId: orgId,
      },
    });
  };

  //  Delete Element
  const deleteGradeById = (item: any) => {
    deleteGrade?.action({
      urlKey: "DeleteJobGrade",
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
    if (item?.menuReferenceId === 30436) {
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
      title: "Job Class",
      dataIndex: "jobClassName",
    },
    {
      title: "Job Grade",
      dataIndex: "jobGradeName",
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
                setRowData(item);
                setOpen(true);
              },
            },
            {
              type: "delete",
              onClick: () => {
                deleteGradeById(item);
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
              title="Job Grade"
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
              data={gradeLanding?.data?.jobGradeLandingData || []}
              loading={gradeLanding?.loading}
            />
          </PCard>
          <PModal
            title={`${rowData ? "Edit" : "Create"} Job Grade`}
            open={open}
            width={500}
            onCancel={() => {
              setOpen(false);
            }}
            afterClose={() => {
              setRowData("");
            }}
            components={
              <CreateGrade
                getData={landingApi}
                modalFooter={true}
                setOpen={setOpen}
                singleData={rowData}
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

export default GradeLanding;
