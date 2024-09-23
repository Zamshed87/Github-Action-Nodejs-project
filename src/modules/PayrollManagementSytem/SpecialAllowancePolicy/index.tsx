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
// import AddEditForm from "./addEditForm";
import Loading from "common/loading/Loading";
import AddEditForm from "./AddEditForm";

const AllowancePolicy = () => {
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
      urlKey: "GetPayrollElementConfigLanding",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        WorkplaceGroupId: wgId,
        WorkplaceId: wId,
        pageNo: 1,
        pageSize: 500,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Allowance & Deduction Policy";

    return () => {
      document.title = "Peopledesk";
    };
  }, [buId, orgId]);

  let emploteeFeaturePermisionCheck: any = null;

  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30433) {
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
      title: "Payroll Element",
      dataIndex: "payrollElementType",
    },

    {
      title: "Divided By",
      dataIndex: "dividedBy",
    },
    {
      title: "Days",
      dataIndex: "dividedByDays",
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
                    urlKey: "DeletePayrollElementConfig",
                    method: "DELETE",
                    params: {
                      id: rec?.id,
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
            title="Allowance & Deduction Policy"
            submitText="Create"
            submitIcon={<AddOutlined />}
            buttonList={[]}
          />

          <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data.data : []
            }
            loading={landingApi?.loading}
            header={header}
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title={
          id
            ? "Edit Allowance & Deduction Policy"
            : "Create Allowance & Deduction Policy"
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

export default AllowancePolicy;
