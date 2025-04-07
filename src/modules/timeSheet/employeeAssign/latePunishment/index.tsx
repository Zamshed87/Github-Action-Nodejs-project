import { Form } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  Avatar,
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getSerial } from "Utils";
import AddEditForm from "./component";
import { apiCall } from "./helper";

export const LatePunishmentAssign = () => {
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, wId, permissionList } = useSelector(
    (state: any) => ({
      buId: state?.auth?.profileData?.buId,
      wgId: state?.auth?.profileData?.wgId,
      wId: state?.auth?.profileData?.wId,
      permissionList: state?.auth?.permissionList,
    }),
    shallowEqual
  );

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30432) {
      employeeFeature = item;
    }
  });
  // state
  const [filterList, setFilterList] = useState<any>({});
  const [empIDString, setEmpIDString] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    isNotAssign?: boolean;
  };
  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
    isNotAssign = true,
  }: TLandingApi = {}) => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      isNotAssign: isNotAssign,
      pageNo: pagination?.current || 1,
      pageSize: pagination?.pageSize || 100,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      designationList: filerList?.designation || [],
      employmentTypeList: filerList?.employmentType || [],
      departmentList: filerList?.department || [],
      hrPositionList: filerList?.hrPosition || [],
      sectionList: filerList?.section || [],
    };
    apiCall("LatePunishmentPolicyAssignLoader", payload, (res: any) => {
      setEmpIDString(res?.employeeIdList);
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Late Punishment Assign";
    return () => {
      document.title = "Peopledesk";
    };
  }, []);

  useEffect(() => {
    landingApiCall();
  }, [wgId, wId]);

  const searchFunc = debounce((value) => {
    const values = form.getFieldsValue(true);
    landingApiCall({
      filerList: filterList,
      searchText: value,
      isNotAssign: values?.assigned?.value === 1 ? true : false,
    });
  }, 500);

  const modalContent = (
    <AddEditForm
      getData={() => {
        const values = form.getFieldsValue(true);
        landingApiCall({
          isNotAssign: values?.assigned?.value === 1 ? true : false,
        });
      }}
      empIDString={empIDString}
      setIsAddEditForm={setOpen}
      setCheckedList={setSelectedRow}
    />
  );

  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 15,
      align: "center",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 50,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeCode",
      sorter: true,
      fixed: "left",
      width: 40,
    },

    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
      filterKey: "designationList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      sorter: true,
      filter: true,
      filterKey: "hrPositionList",
      filterSearch: true,
      width: 50,
    },

    {
      title: "Type",
      dataIndex: "employmentType",
      sorter: true,
      filter: true,
      filterSearch: true,
      filterKey: "employmentTypeList",
      width: 45,
    },
    {
      title: "Policy Name",
      dataIndex: "latePunishmentPolicyName",

      width: 150,
    },
  ];
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          assigned: { value: 1, label: "Not Assigned" },
        }}
        onFinish={() => {
          // setOpen(true);
        }}
      >
        <PCard>
          {landingApi?.loading && <Loading />}
          <PCardHeader
            title={`${
              selectedRow?.length > 0
                ? `Total ${selectedRow?.length}
                      employee${`${
                        selectedRow?.length > 1 ? "s" : ""
                      }`} selected
                      from ${landingApi?.data?.totalCount}`
                : `Total ${landingApi?.data?.totalCount || 0} employees`
            }`}
            buttonListRightLeft={false}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            buttonList={[
              {
                type: "primary",
                content: `Assign ${landingApi?.data?.totalCount}`,
                onClick: () => {
                  setEmpIDString(landingApi?.data?.employeeIdList);
                  setOpen(true);
                },
              },
              {
                type: "primary",
                className: ` ${
                  selectedRow?.length === 0 ? "d-none" : "d-block"
                }`,
                content: `Assign ${selectedRow?.length}`,
                onClick: () => {
                  const payload: any = selectedRow?.map(
                    (i: any) => i?.employeeId
                  );

                  setEmpIDString(payload);

                  setOpen(true);
                },
              },
            ]}
          >
            <PSelect
              options={[
                { value: 1, label: "Not Assigned" },
                { value: 0, label: "Assigned" },
              ]}
              name="assigned"
              placeholder=""
              style={{ width: "200px" }}
              onSelect={(value: any, op: any) => {
                form.setFieldsValue({
                  assigned: op,
                });
                landingApiCall({ isNotAssign: value === 1 ? true : false });
              }}
            />
          </PCardHeader>

          <DataTable
            bordered
            data={landingApi?.data?.loaderDataList || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.header}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              const { search } = form.getFieldsValue(true);
              setFilterList(filters);
              landingApiCall({
                pagination,
                filerList: filters,
                searchText: search,
              });
            }}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRow.map((item) => item?.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRow(selectedRows);
              },
            }}
          />
        </PCard>
      </PForm>
      <PModal
        open={open}
        title={"Assign Late Punishment Policy"}
        width=""
        onCancel={() => {
          setSelectedRow([]);
          setOpen(false);
        }}
        maskClosable={false}
        components={modalContent}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};
