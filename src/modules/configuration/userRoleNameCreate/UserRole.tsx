import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddEditForm from "./addEditForm/indexN.jsx";
import { PlusOutlined } from "@ant-design/icons";
import Chips from "common/Chips.jsx";

type TUserRole = {};
const UserRoleN: React.FC<TUserRole> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Form Instance
  const [form] = Form.useForm();

  // state
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let permission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30297) {
      permission = item;
    }
  });

  // Api Actions
  const GetAllUserRole = useApiRequest([]);

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
  };
  const landingApi = ({
    pagination = {},
    filerList = [],
    searchText = "",
  }: TLandingApi = {}) => {
    GetAllUserRole?.action({
      urlKey: "GetAllUserRole",
      method: "GET",
      payload:''
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId, id]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,

      align: "center",
      width: 20,
    },
    {
      title: "User Role Name",
      dataIndex: "strRoleName",
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      sorter: true,
      render: (_: any, rec: any) => (
        <>
          <Chips
            label={rec?.isActive ? "Active" : "Inactive"}
            classess={`${rec?.isActive ? "success" : "danger"}`}
          />
        </>
      ),
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
                onClick: (e) => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  e.stopPropagation();
                  setOpen(true);
                  setId(record?.intRoleId);
                },
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          if (!permission?.isCreate)
            return toast.warn("You don't have permission");
          setOpen(true);
          setId("");
        }}
      >
        <PCard>
          <PCardHeader
            onSearch={() => {}}
            submitText="User Role"
            submitIcon=<PlusOutlined />
          />

          <DataTable
            header={header}
            bordered
            data={GetAllUserRole?.data || []}
            loading={GetAllUserRole?.loading}
            scroll={{ x: 1000 }}
          />
        </PCard>
      </PForm>
      <PModal
        open={open}
        title={id ? "Edit User Role" : "Create User Role"}
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={landingApi}
              setIsAddEditForm={setOpen}
              isEdit={id ? true : false}
              id={id}
              setId={setId}
            />
          </>
        }
      />
    </>
  );
};

export default UserRoleN;
