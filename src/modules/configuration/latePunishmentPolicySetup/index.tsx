import { AddOutlined } from "@mui/icons-material";
import { Form } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { method } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddEditForm from "./addEditForm";

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
  const [view, setView] = useState(false);
  const [id, setId] = useState("");

  const [form] = Form.useForm();
  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    landingApi.action({
      urlKey: "LatePunishmentPolicyLanding",
      method: "GET",
      params: {
        WorkPlaceGroupId: wgId,
        WorkplaceId: wId,
        PageNo: 1,
        PageSize: 1000,
        searchText: "",
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Late Punishment Policy";

    return () => {
      document.title = "Peopledesk";
    };
  }, [buId, wgId, wId]);

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

  //   {
  //     "latePunishmentPolicyLandingData": [
  //       {
  //         "latePunishmentPolicyId": 1,
  //         "latePunishmentPolicyName": "New Punishment Policy",
  //         "latePunishmentPolicyCode": "",
  //         "howMuchLateDaysForPenalty": 3,
  //         "equalAbsent": 1,
  //         "firstPriority": "SL",
  //         "secondPriority": "",
  //         "thirdPriority": "",
  //         "amountDeductionDependsOn": "",
  //         "amountForFixedAmount": 0
  //       }
  //     ],
  //     "currentPage": 1,
  //     "totalCount": 1,
  //     "pageSize": 50
  //   }

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
    },
    {
      title: "Policy Name",
      dataIndex: "latePunishmentPolicyName",
      sorter: true,
    },
    {
      title: "Policy Code",
      dataIndex: "latePunishmentPolicyCode",
      sorter: true,
    },
    {
      title: "Late Days",
      dataIndex: "howMuchLateDaysForPenalty",
      sorter: true,
    },
    {
      title: "Equal Absent",
      dataIndex: "equalAbsent",
      sorter: true,
    },
    {
      title: "First Priority",
      dataIndex: "firstPriority",
      sorter: true,
    },
    {
      title: "Second Priority",
      dataIndex: "secondPriority",
      sorter: true,
    },
    {
      title: "Third Priority",
      dataIndex: "thirdPriority",
      sorter: true,
    },
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
