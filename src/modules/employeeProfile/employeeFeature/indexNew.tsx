import {
  Avatar,
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { Form, Tag, message } from "antd";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import {
  columnForFinish,
  columnForHeadOffice,
  getTableDataEmployee,
} from "./helper";
import "./styles.css";
import Loading from "common/loading/Loading";

function EmployeeFeatureNew() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { orgId, buId, wgId, wId, buName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // state
  const [filterList, setFilterList] = useState<any>({});

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const GetBusinessDetailsByBusinessUnitId = useApiRequest({});
  const [excelLoading, setExcelLoading] = useState(false);

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

  const getBUDetails = () => {
    GetBusinessDetailsByBusinessUnitId?.action({
      urlKey: "GetBusinessDetailsByBusinessUnitId",
      method: "GET",
      params: {
        businessUnitId: buId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    getBUDetails();
    document.title = "Employee";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchFunc = debounce((value) => {
    landingApiCall({
      filerList: filterList,
      searchText: value,
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

    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
      filterKey: "strWorkplaceGroupList",
      filterSearch: true,
      width: 60,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
      filterKey: "strWorkplaceList",
      filterSearch: true,
      width: 62,
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
      title: "Job Territory",
      dataIndex: "strJobTerritory",
      // sorter: true,
      // filter: true,
      // filterKey: "strSectionList",
      // filterSearch: true,
      width: 50,
      hidden: orgId === 5 ? false : true,
    },
    {
      title: "Job Location",
      dataIndex: "strJobLocation",
      // sorter: true,
      // filter: true,
      // filterKey: "strSectionList",
      // filterSearch: true,
      hidden: orgId === 5 ? false : true,

      width: 50,
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sorter: true,
      filter: true,
      filterSearch: true,

      filterKey: "strSupervisorNameList",
      width: 60,
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sorter: true,
      filter: true,
      filterSearch: true,
      filterKey: "strLinemanagerList",
      width: 60,
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      sorter: true,
      width: 33,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      filterSearch: true,
      filterKey: "strEmploymentTypeList",
      width: 28,
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteJoiningDate),
      sorter: true,
      dataType: "date",
      width: 35,
    },
    {
      title: "Blood Group",
      dataIndex: "strBloodGroup",
      sorter: true,
      filterKey: "strBloodGroupList",
      filter: true,

      width: 35,
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
    {
      width: 20,
      align: "center",
      render: (_: any, rec: any) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                history.push({
                  pathname: `/profile/employee/${rec?.intEmployeeBasicInfoId}`,
                  state: {
                    buId: rec?.intBusinessUnitId,
                    wgId: rec?.intWorkplaceGroupId,
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ].filter((i) => !i?.hidden);
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={() => {
          // setOpen(true);
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
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
                content: "Bulk Upload",
                onClick: () => {
                  if (employeeFeature?.isCreate) {
                    history.push("/profile/employee/bulk");
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  if (employeeFeature?.isCreate) {
                    history.push("/profile/employee/create");
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
              // {
              //   type: "primary",
              //   content: "Create brand New ",
              //   icon: "plus",
              //   onClick: () => {
              //     if (employeeFeature?.isCreate) {
              //       history.push("/profile/employee/create");
              //     } else {
              //       toast.warn("You don't have permission");
              //     }
              //   },
              // },
            ]}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const { search } = form.getFieldsValue(true);
                  const payload = {
                    businessUnitId: buId,
                    workplaceGroupId: wgId,
                    workplaceId: wId,
                    pageNo: 0,
                    pageSize: 0,
                    isPaginated: false,
                    isHeaderNeed: false,
                    searchTxt: search || "",
                    strBloodGroupList: filterList?.strBloodGroup || [],
                    strDepartmentList: filterList?.strDepartment || [],
                    strWorkplaceGroupList: filterList?.strWorkplaceGroup || [],
                    strWorkplaceList: filterList?.strWorkplace || [],
                    strDivisionList: filterList?.strDivision || [],
                    strDesignationList: filterList?.strDesignation || [],
                    strSupervisorNameList: filterList?.strSupervisorName || [],
                    strEmploymentTypeList: filterList?.strEmploymentType || [],
                    strLinemanagerList: filterList?.strLinemanager || [],
                    strSectionList: filterList?.sectionName || [],
                    strHrPositionList: filterList?.sectionName || [],
                    strDottedSupervisorNameList:
                      filterList?.strDottedSupervisorName || [],
                    strEmployeeStatusList: filterList?.strEmployeeStatus || [],
                    wingNameList: [],
                    soleDepoNameList: [],
                    regionNameList: [],
                    areaNameList: [],
                    territoryNameList: [],
                  };
                  const res = await axios.post(
                    `/Employee/EmployeeProfileLandingPaginationWithMasterFilter`,
                    payload
                  );
                  if (res?.data) {
                    if (!res?.data?.data?.length) {
                      setExcelLoading(false);
                      return message.error("No Employee Data Found");
                    }
                    const newData = res?.data?.data?.map(
                      (item: any, index: number) => ({
                        ...item,
                        sl: index + 1,
                        strEmployeeName: item?.strEmployeeName || " ",
                        intEmployeeId:
                          item?.intEmployeeId ||
                          item?.intEmployeeBasicInfoId ||
                          " ",
                        strEmployeeCode: item?.strEmployeeCode || " ",
                        JoiningDate: item?.dteJoiningDate
                          ? dateFormatter(item?.dteJoiningDate)
                          : item?.JoiningDate || " ",
                        ServiceLength:
                          item?.strServiceLength || item?.ServiceLength || " ",
                        ConfirmationDate: item?.dteConfirmationDate
                          ? dateFormatter(item?.dteConfirmationDate)
                          : item?.ConfirmationDate || " ",
                        strSupervisorName:
                          item?.strSupervisorName ||
                          item?.strSupervisorName ||
                          " ",
                        DottedSupervisor:
                          item?.DottedSupervisor ||
                          item?.strDottedSupervisorName ||
                          " ",
                        strLinemanager: item?.strLinemanager || " ",
                        strDesignation: item?.strDesignation || " ",
                        strDepartment: item?.strDepartment || " ",
                        strOfficeMail: item?.strOfficeMail || " ",
                        strPersonalMail: item?.strPersonalMail || " ",
                        strOfficeMobile: item?.strOfficeMobile || " ",
                        strPersonalMobile: item?.strPersonalMobile || " ",
                        strGender: item?.strGender || " ",
                        strReligion: item?.strReligion || " ",
                        strPayrollGroupName: item?.strPayrollGroupName || " ",
                        strBankWalletName: item?.strBankWalletName || " ",
                        strBranchName: item?.strBranchName || " ",
                        strAccountName_BankDetails:
                          item?.strBankAccountName || " ",
                        strAccountNo: item?.strBankAccountNo || " ",
                        strRoutingNo: item?.strRoutingNo || " ",
                        strBloodGroup: item?.strBloodGroup || " ",
                        strWorkplace:
                          item?.strWorkplace || item?.strWorkplaceName || " ",
                        strWorkplaceGroup:
                          item?.strWorkplaceGroup ||
                          item?.strWorkplaceName ||
                          " ",
                        strBusinessUnit:
                          item?.strBusinessUnit ||
                          item?.strBusinessUnitName ||
                          " ",
                        DateOfBirth: item?.dteDateOfBirth
                          ? dateFormatter(item?.dteDateOfBirth)
                          : item?.DateOfBirth || " ",
                        strEmploymentType:
                          item?.strEmploymentType ||
                          item?.employmentType ||
                          " ",
                        strEmployeeStatus: item?.strEmployeeStatus || " ",
                        contractualFromDate: item?.dteContractFromDate
                          ? dateFormatter(item?.dteContractFromDate)
                          : item?.dteContactFromDate || "",
                        contractualToDate: item?.dteContractToDate
                          ? dateFormatter(item?.dteContractToDate)
                          : item?.dteContactToDate || "",
                      })
                    );
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    createCommonExcelFile({
                      titleWithDate: `Employee List`,
                      fromDate: "",
                      toDate: "",
                      buAddress:
                        GetBusinessDetailsByBusinessUnitId?.data
                          ?.strBusinessUnitAddress,
                      businessUnit: buName,
                      tableHeader:
                        orgId === 5
                          ? columnForFinish
                          : wgId === 3
                          ? columnForHeadOffice
                          : columnForHeadOffice,
                      getTableData: () =>
                        getTableDataEmployee(
                          newData,
                          orgId === 5
                            ? Object.keys(columnForFinish)
                            : wgId === 3
                            ? Object.keys(columnForHeadOffice)
                            : Object.keys(columnForHeadOffice)
                        ),
                      tableFooter: [],
                      extraInfo: {},
                      tableHeadFontSize: 10,
                      widthList: {
                        B: 30,
                        C: 30,
                        D: 30,
                        E: 20,
                        F: 20,
                        G: 15,
                        H: 15,
                        I: 12,
                        J: 15,
                        K: 20,
                        L: 30,
                        M: 25,
                        N: 25,
                      },
                      commonCellRange: "A1:J1",
                      CellAlignment: "left",
                    });
                    setExcelLoading(false);
                  }
                } catch (error: any) {
                  console.log({ error });
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                  // console.log(error?.message);
                }
              };
              excelLanding();
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
              onClick: () =>
                history.push({
                  pathname: `/profile/employee/${record?.intEmployeeBasicInfoId}`,
                  state: {
                    buId: record?.intBusinessUnitId,
                    wgId: record?.intWorkplaceGroupId,
                  },
                }),
              className: "pointer",
            })}
          />
        </PCard>
      </PForm>
      {/* modal not used anymone 🔥 
      <PModal
        open={open}
        title="Create New Employee"
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
         modal not used anymone 🔥
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={false}
              pages={undefined}
              singleData={undefined}
              // isMenuEditPermission={employeeFeature?.isEdit}
              // isOfficeAdmin={isOfficeAdmin}
            />
          </>
        }
      />
      */}
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default EmployeeFeatureNew;
