import { AddOutlined } from "@mui/icons-material";
import { Form } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddEditForm from "./addEditForm";
import Loading from "common/loading/Loading";

const LatePunishmentPolicy = () => {
  const dispatch = useDispatch();

  const { orgId, buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  const [open, setOpen] = useState(false);
  // const [view, setView] = useState(false);
  const [id, setId] = useState("");

  const [form] = Form.useForm();
  const landingApi = useApiRequest({});
  const deleteApi = useApiRequest({});

  const landingApiCall = () => {
    landingApi.action({
      urlKey: "LatePunishmentPolicyLanding",
      method: "GET",
      params: {
        AccountId: orgId,
        BusinessUnitId: buId,
        PageNo: 1,
        PageSize: 500,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Late Punishment Policy";

    return () => {
      document.title = "Peopledesk";
    };
  }, [buId, orgId]);

  let emploteeFeaturePermisionCheck: any = null;

  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30426) {
      emploteeFeaturePermisionCheck = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
    },
    {
      title: "Policy Name",
      dataIndex: "policyName",
      sorter: true,
    },

    {
      title: "Late Days",
      dataIndex: "howMuchLateDays",
      sorter: true,
    },
    {
      title: "Equal Absent",
      dataIndex: "equalAbsentDays",
      sorter: true,
    },
    {
      title: "First Priority",
      dataIndex: "punishmentEffectOn",
      sorter: true,
    },
    {
      title: "Second Priority",
      dataIndex: "thenEffectOn",
      sorter: true,
    },
    // {
    //   title: "Third Priority",
    //   dataIndex: "thirdPriority",
    //   sorter: true,
    // },
    {
      width: 20,
      align: "center",
      render: (_: any, rec: any) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: (e: any) => {
                  if (!emploteeFeaturePermisionCheck?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  setOpen(true);
                  setId(rec);
                },
              },
              {
                type: "delete",
                onClick: (e: any) => {
                  if (!emploteeFeaturePermisionCheck?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  const cb = () => {
                    landingApiCall();
                  };
                  deleteApi.action({
                    urlKey: "DeleteLatePunishmentPolicy",
                    method: "DELETE",
                    params: {
                      PunishmentPolicyId: rec?.id,
                    },
                    onSuccess: () => {
                      cb();
                    },
                  });
                },
              },
            ]}
          />
        </>
      ),
    },
  ];

  return emploteeFeaturePermisionCheck?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={() => {
          setOpen(true);
        }}
      >
        {(landingApi?.loading || deleteApi?.loading) && <Loading />}
        <PCard>
          <PCardHeader
            title="Late Punishment Policy"
            submitText="Create"
            submitIcon={<AddOutlined />}
            buttonList={[]}
          />

          <DataTable
            bordered
            data={
              landingApi?.data?.latePunishmentPolicyLandingData?.length > 0
                ? landingApi?.data.latePunishmentPolicyLandingData
                : []
            }
            loading={landingApi?.loading}
            header={header}
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title={
          id ? "Edit Late Punishment Policy" : "Create Late Punishment Policy"
        }
        width=""
        onCancel={() => {
          setOpen(false);
          setId("");
        }}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={id ? true : false}
              singleData={id}
              setId={setId}
            />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default LatePunishmentPolicy;
