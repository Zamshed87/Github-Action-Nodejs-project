import { Form, Tag } from "antd";
import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getSerial } from "Utils";
import FlipComponent from "./flip-component";

const EmployeeBooklet = () => {
  // redux
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // state
  const [filterList, setFilterList] = useState<any>({});
  const [openBooklet, setOpenBooklet] = useState(false);

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
    excelDownload?: boolean;
  };
  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination?.current || 1,
      pageSize: pagination?.pageSize || 100,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      salartType: "",
      hrPosition: 0,
      strBloodGroupList: filerList?.strBloodGroup || [],
      strDepartmentList: filerList?.strDepartment || [],
      strWorkplaceGroupList: filerList?.strWorkplaceGroup || [],
      strWorkplaceList: filerList?.strWorkplace || [],
      strDivisionList: filerList?.strDivision || [],
      strDesignationList: filerList?.strDesignation || [],
      strSupervisorNameList: filerList?.strSupervisorName || [],
      strEmploymentTypeList: filerList?.strEmploymentType || [],
      strLinemanagerList: filerList?.strLinemanager || [],
      strSectionList: filerList?.sectionName || [],
      strHrPositionList: filerList?.sectionName || [],
      strDottedSupervisorNameList: filerList?.strDottedSupervisorName || [],
      strEmployeeStatusList: filerList?.strEmployeeStatus || [],
      wingNameList: [],
      soleDepoNameList: [],
      regionNameList: [],
      areaNameList: [],
      territoryNameList: [],
    };
    landingApi.action({
      urlKey: "EmployeeProfileLandingPaginationWithMasterFilter",
      method: "POST",
      payload: payload,
    });
  };

  const searchFunc = debounce((value) => {
    landingApiCall({
      filerList: filterList,
      searchText: value,
    });
  }, 500);

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
      width: 10,
      align: "center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
      filterKey: "strWorkplaceGroupList",
      filterSearch: true,
      width: 40,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
      filterKey: "strWorkplaceList",
      filterSearch: true,
      width: 55,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 50,
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      sorter: true,
      fixed: "left",
      width: 40,
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Section",
      dataIndex: "sectionName",
      sorter: true,
      filter: true,
      filterKey: "strSectionList",
      filterSearch: true,
      width: 50,
    },

    {
      title: "Status",
      dataIndex: "strEmployeeStatus",
      render: (_: any, rec: any) => {
        return (
          <div>
            {rec?.strEmployeeStatus === "Active" ? (
              <Tag color="green">{rec?.strEmployeeStatus}</Tag>
            ) : rec?.strEmployeeStatus === "Inactive" ? (
              <Tag color="red">{rec?.strEmployeeStatus}</Tag>
            ) : rec?.strEmployeeStatus === "Salary Hold" ? (
              <Tag color="orange">{rec?.strEmployeeStatus}</Tag>
            ) : (
              <Tag color="gold">{rec?.strEmployeeStatus}</Tag>
            )}
          </div>
        );
      },
      sorter: true,
      filter: true,
      filterKey: "strEmployeeStatusList",
      filterSearch: true,
      width: 35,
    },
  ];

  useEffect(() => {
    landingApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          // setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
          />

          {/* Example Using Data Table Designed By Ant-Design v4 */}
          <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
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
            scroll={{ x: 2000 }}
            onRow={(record) => ({
              onClick: () => {
                setOpenBooklet(true);
              },
              className: "pointer",
            })}
          />
        </PCard>
      </PForm>
      <PModal
        style={{ top: 0 }}
        open={openBooklet}
        bodyStyle={{ height: "85vh" }}
        title={"Employee Booklet"}
        width={"100vw"}
        onCancel={() => {
          setOpenBooklet(false);
        }}
        maskClosable={false}
        components={<FlipComponent />}
      />
    </>
  );
};

export default EmployeeBooklet;
