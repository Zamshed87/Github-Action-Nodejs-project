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

export const LatePunishmentAssign = () => {
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
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
    landingApi.action({
      urlKey: "LatePunishmentPolicyAssignLoader",
      method: "POST",
      payload: payload,
      onSuccess: (res: any) => {
        setEmpIDString(res?.employeeIdList);
      },
    });
  };
  // useEffects
  // sidebar
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // {
    //   title: "Work. Group/Location",
    //   dataIndex: "strWorkplaceGroup",
    //   sorter: true,
    //   filter: true,
    //   filterKey: "strWorkplaceGroupList",
    //   filterSearch: true,
    //   width: 60,
    //   fixed: "left",
    // },
    // {
    //   title: "Workplace/Concern",
    //   dataIndex: "strWorkplace",
    //   sorter: true,
    //   filter: true,
    //   filterKey: "strWorkplaceList",
    //   filterSearch: true,
    //   width: 55,
    //   fixed: "left",
    // },

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
            // exportIcon={true}
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
            // submitText="Create New"
            // submitIcon={<AddOutlined />}
            buttonList={[
              {
                type: "primary",
                content: `Assign ${landingApi?.data?.totalCount}`,
                onClick: () => {
                  //   if (employeeFeature?.isCreate) {

                  //   } else {
                  //     // toast.warn("You don't have permission");
                  //   }
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
                  //   if (employeeFeature?.isCreate) {
                  //   } else {
                  //     // toast.warn("You don't have permission");
                  //   }
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

          {/* Example Using Data Table Designed By Ant-Design v4 */}
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

              // getCheckboxProps: (rec) => {
              //   return {
              //     disabled: rec?.ApplicationStatus === "Approved",
              //   };
              // },
            }}
            // checkBoxColWidth={50}
            // scroll={{ x: 2000 }}
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
        components={
          <>
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
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};
