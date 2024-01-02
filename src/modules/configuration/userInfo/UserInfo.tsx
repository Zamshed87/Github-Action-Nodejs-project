import {
  Avatar,
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import Chips from "common/Chips";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { PModal } from "Components/Modal";
import AddEditFormComponentN from "./addEditForm";

type TUserInfo = {};
const UserInfoN: React.FC<TUserInfo> = () => {
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  // Api Actions
  const history = useHistory();
  // row Data

  // for create state
  const [open, setOpen] = useState(false);

  // for view state
  const [viewModal, setViewModal] = useState(false);

  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
  };


  // single Data
  const [singelUser, setSingelUser] = useState("");


  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Users Info";
  }, []);

  // apis
  const EmployeeListForUserLandingPagination = useApiRequest([]);

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
    searchText = "",
  }: TLandingApi = {}) => {
    EmployeeListForUserLandingPagination?.action({
      urlKey: "EmployeeListForUserLandingPagination",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        isNotAssign: false,
        pageNo: pagination?.current || 1,
        pageSize: pagination?.pageSize || 25,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
        isUser: 0,
        IsForXl: false,
      },
      onSuccess: (res) => {
        res?.data?.map((item: any, index: number) => {
          return {
            ...item,
            initialSerialNumber: index + 1,
          };
        });
      },
    });
  };
  const searchFunc = debounce((value) => {
    landingApi({ searchText: value });
  }, 500);

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let permission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30) {
      permission = item;
    }
  });
  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      sorter: true,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          <Avatar title={record?.strEmployeeName} />
          <span className="ml-2">{record?.strEmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
      fieldType: "string",
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      fieldType: "number",
    },
    {
      title: "User ID (Login)",
      dataIndex: "strLoginId",
      sorter: true,
      // filter: true,
      fieldType: "number",
    },

    {
      title: "Mobile No.",
      dataIndex: "strPersonalMobile",
      sorter: true,
      // filter: true,
      fieldType: "number",
    },
    {
      title: "Status",
      dataIndex: "userStatus",
      render: (_: any, record: any) => (
        <Chips
          label={record?.userStatus ? "Active" : "Inactive"}
          classess={record?.userStatus ? "success" : "danger"}
        />
      ),
      sorter: true,
      // filter: true,
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
                  setSingelUser(record);
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
          setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            title={`Total ${
              EmployeeListForUserLandingPagination?.data?.totalCount || 0
            } employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
            }}
            buttonList={[
              {
                type: "primary",
                content: "+User",
                onClick: () => {
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  history.push(
                    `/administration/roleManagement/usersInfo/create`
                  );
                },
              },
            ]}
          />

          <DataTable
            header={header}
            bordered
            data={EmployeeListForUserLandingPagination?.data?.data || []}
            filterData={
              EmployeeListForUserLandingPagination?.data?.calendarAssignHeader // Filter Object From Api Response
            }
            pagination={{
              current: EmployeeListForUserLandingPagination?.data?.currentPage, // Current Page From Api Response
              pageSize: EmployeeListForUserLandingPagination?.data?.pageSize, // Page Size From Api Response
              total: EmployeeListForUserLandingPagination?.data?.totalCount, // Total Count From Api Response
            }}
            loading={EmployeeListForUserLandingPagination?.loading}
            scroll={{ x: 1000 }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
              landingApi({
                pagination,
                filerList: filters,
              });
            }}
          />
        </PCard>

        {/* View Form Modal */}
        {/* <ViewFormComponent
          show={viewModal}
          title={"User Details"}
          onHide={handleViewClose}
          size="lg"
          backdrop="static"
          singelUser={singelUser}
          classes="default-modal"
          handleOpen={handleOpen}
          orgId={orgId}
          buId={buId}
          singleData={singleData}
          setSingleData={setSingleData}
        /> */}

        {/* addEdit form Modal */}
      </PForm>
      <PModal
        open={open}
        title="Edit User"
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
            <AddEditFormComponentN
              singelUser={singelUser}
              isCreate={false}
              onHide={handleClose}
              getData={landingApi}
            />
          </>
        }
      />
    </>
  );
};

export default UserInfoN;
