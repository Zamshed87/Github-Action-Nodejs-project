import { Form, Tag } from "antd";
import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getSerial } from "Utils";
import FlipComponent from "./flip-component";
import Loading from "common/loading/Loading";
import { getTransferAndPromotionHistoryById } from "modules/employeeProfile/transferNPromotion/transferNPromotion/helper";
import { getEmployeeIncrementByEmoloyeeId } from "modules/CompensationBenefits/employeeSalary/salaryAssign/helper";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import moment from "moment";
import { todayDate } from "utility/todayDate";
import { getEmployeeLeaveBalanceAndHistory } from "common/HOCLeave/helperAPI";

const EmployeeBooklet = () => {
  // redux
  const { buId, wgId, wId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // state
  const [filterList, setFilterList] = useState<any>({});
  const [openBooklet, setOpenBooklet] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [incrementHistoryList, setIncrementHistoryList] = useState([]);
  const [loanDto, getLoanDto, loadingData, setResLoanData] = useAxiosGet();
  const [leaveBalanceDto, setLeaveBalanceDto] = useState([]);

  const landingApiReward = useApiRequest({});
  const landingApiPunishment = useApiRequest({});

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const empInfo = useApiRequest([]);

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

  const getEmpData = (empId: number) => {
    empInfo.action({
      urlKey: "EmployeeProfileView",
      method: "get",
      params: {
        employeeId: empId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        setSingleData(res);
        !empInfo.loading && setOpenBooklet(true);
      },
    });
  };

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
      {(loading || loadingData) && <Loading />}
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
            onRow={(rec) => ({
              onClick: () => {
                // loan data
                const filterDate = `&fromDate=${moment(
                  rec?.dteJoiningDate
                ).format("YYYY-MM-DD")}&toDate=${todayDate()}`;
                const url = `/Employee/PeopleDeskAllLanding?TableName=LoanApplicationList&intId=${rec.intEmployeeBasicInfoId}&AccountId=${orgId}&BusinessUnitId=${buId}${filterDate}`;
                getLoanDto(url, (res: any) => {
                  setResLoanData(res);
                });

                // basic info data
                getEmpData(rec.intEmployeeBasicInfoId);
                getTransferAndPromotionHistoryById(
                  orgId,
                  rec.intEmployeeBasicInfoId,
                  setHistoryData,
                  setLoading,
                  buId,
                  wgId
                );
                getEmployeeIncrementByEmoloyeeId(
                  orgId,
                  rec.intEmployeeBasicInfoId,
                  setIncrementHistoryList,
                  setLoading,
                  wgId,
                  buId
                );
                getEmployeeLeaveBalanceAndHistory(
                  rec.intEmployeeBasicInfoId,
                  "LeaveBalance",
                  setLeaveBalanceDto,
                  setLoading,
                  "",
                  moment().format("yyyy"),
                  buId,
                  wgId
                );

                landingApiReward.action({
                  urlKey: "GetUserRewardPunishmentLetterLanding",
                  method: "GET",
                  params: {
                    accountId: orgId,
                    userId: rec.intEmployeeBasicInfoId,
                    actionType: 1,
                    pageNo: 0,
                    pageSize: 5000,
                  },
                });
                landingApiPunishment.action({
                  urlKey: "GetUserRewardPunishmentLetterLanding",
                  method: "GET",
                  params: {
                    accountId: orgId,
                    userId: rec.intEmployeeBasicInfoId,
                    actionType: 2,
                    pageNo: 0,
                    pageSize: 5000,
                  },
                });
              },
              className: "pointer",
            })}
          />
        </PCard>
      </PForm>
      <PModal
        style={{ top: 0 }}
        open={openBooklet}
        bodyStyle={{ height: "80vh" }}
        title={"Employee Booklet"}
        width={"1500px"}
        onCancel={() => {
          setOpenBooklet(false);
        }}
        maskClosable={false}
        components={
          <FlipComponent
            singleData={singleData}
            historyData={historyData}
            incrementHistory={incrementHistoryList}
            loanDto={loanDto}
            leaveBalanceDto={leaveBalanceDto}
            landingApiReward={landingApiReward}
            landingApiPunishment={landingApiPunishment}
          />
        }
      />
    </>
  );
};

export default EmployeeBooklet;
