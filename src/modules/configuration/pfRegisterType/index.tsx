import { AddOutlined } from "@mui/icons-material";
import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import PBadge from "Components/Badge";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateEditPfRegisterType from "./CreateEdit/CreateEditPfRegisterType";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

type TPFRegisterTypeLanding = {};
const PFRegisterTypeLanding: React.FC<TPFRegisterTypeLanding> = () => {
  // Data From Store
  const { buId, wgId, wId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // Api Actions
  const pfRegisterTypeLandingApi = useApiRequest([]);

  // state
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>("");

  let pfRegisterType: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30396) {
      pfRegisterType = item;
    }
  });

  // Landing Api
  const landingApi = () => {
    pfRegisterTypeLandingApi.action({
      method: "get",
      urlKey: "GetAllPFRegisterType",
      params: {
        accountId: orgId,
        workplaceId: wId,
      },
    });
    //   urlKey: "apiKeyFromApiPath",
    //   method: "POST",
    //   payload: {
    //     businessUnitId: buId,
    //     workplaceGroupId: wgId,
    //     workplaceId: wId,
    //     isNotAssign: false,
    //     pageNo: pagination?.current || 1,
    //     pageSize: pagination?.pageSize || 25,
    //     isPaginated: true,
    //     isHeaderNeed: true,
    //     searchTxt: searchText || "",
    //     designationList: [],
    //     departmentList: [],
    //     supervisorNameList: [],
    //     employmentTypeList: [],
    //     wingNameList: [],
    //     soleDepoNameList: [],
    //     regionNameList: [],
    //     areaNameList: [],
    //     territoryNameList: [],
    //   },
    // });
  };

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "PF Register Type";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "PF Register Type Name",
      dataIndex: "strPfregisterType",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      align: "center",
      render: (data: any, record: any, index: number) =>
        // Write condition to check status
        record?.isActive ? (
          <PBadge type="primary" text="Active" />
        ) : (
          <PBadge type="danger" text="InActive" />
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
                onClick: () => {
                  setData(record);
                  setOpen(true);
                },
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];

  return pfRegisterType?.isView ? (
    <>
      <PCard>
        <PCardHeader
          title="PF Register Type"
          buttonList={[
            {
              type: "primary",
              content: "Create",
              icon: <AddOutlined />,
              onClick: () => {
                setOpen(true);
              },
            },
          ]}
        />
        <DataTable
          header={header}
          bordered
          data={pfRegisterTypeLandingApi?.data || []}
          loading={pfRegisterTypeLandingApi?.loading}
          scroll={{ x: 1000 }}
        />
      </PCard>
      <PModal
        title={
          data?.intPfregisterTypeId
            ? "Edit PF Register Type"
            : "Create PF Register Type"
        }
        open={open}
        onCancel={() => {
          setData("");
          setOpen(false);
        }}
        components={
          <CreateEditPfRegisterType
            setOpen={setOpen}
            data={data}
            setData={setData}
            landingApi={landingApi}
          />
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PFRegisterTypeLanding;
