import { AddOutlined } from "@mui/icons-material";
import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CreateEditForm from "./createEdit/CreateEditForm";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

type TSeparationSetupLanding = {};
const SeparationSetupLanding: React.FC<TSeparationSetupLanding> = () => {
  const dispatch = useDispatch();
  // Data From Store
  const { buId, wgId, wId, intAccountId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // Api Actions
  const SeparationSetupLandingApi = useApiRequest([]);

  // Landing Api
  const landingApi = () => {
    SeparationSetupLandingApi.action({
      method: "get",
      urlKey: "GetSeparationSetupLanding",
      params: {
        accountId: intAccountId,
        workplaceId: wId,
      },
    });
  };

  // state
  const [open, setOpen] = useState<any>(false);
  const [data, setData] = useState<any>({});

  let separationSetupFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30399) {
      separationSetupFeature = item;
    }
  });

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    document.title = "Separation Setup";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplaceName",
      sorter: true,
    },
    {
      title: "Employment Type",
      dataIndex: "strEmploymentTypeName",
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignationName",
    },
    {
      title: "Department",
      dataIndex: "strDepartmentName",
    },
    {
      title: "Period In Days",
      dataIndex: "intNoticePeriodDayId",
      className: "text-right",
    },
    {
      title: "Action",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: () => {
                  setOpen(true);
                  setData(record);
                },
              },
              {
                type: "view",
                onClick: () => {
                  setOpen(true);
                  setData({ ...record, isView: true });
                },
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];

  return separationSetupFeature?.isView ? (
    <PCard>
      <PCardHeader
        title="Separation Setup"
        buttonList={[
          {
            type: "primary",
            content: "Create",
            icon: <AddOutlined />,
            onClick: () => {
              setOpen(true);
              setData({});
            },
          },
        ]}
      />

      <DataTable
        header={header}
        bordered
        data={SeparationSetupLandingApi?.data || []}
        loading={SeparationSetupLandingApi?.loading}
        scroll={{ x: 1000 }}
        onChange={(pagination, filters, sorter, extra) => {
          if (extra.action === "sort") return;
        }}
      />
      <PModal
        title={
          data?.isView
            ? "View Separation Setup"
            : data?.intSeparationPolicyTypeId
            ? "Edit Separation Setup"
            : "Create Separation Setup"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setData({});
        }}
        components={
          <CreateEditForm
            setOpen={setOpen}
            landingApi={landingApi}
            data={data}
            setData={setData}
          />
        }
      />
    </PCard>
  ) : (
    <NotPermittedPage />
  );
};

export default SeparationSetupLanding;
