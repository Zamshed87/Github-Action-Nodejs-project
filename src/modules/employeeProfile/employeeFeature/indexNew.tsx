import { AddOutlined } from "@mui/icons-material";
import {
  Avatar,
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  TableButton,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { Form, message } from "antd";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import AddEditForm from "./addEditFile";
import {
  columnForHeadOffice,
  columnForMarketing,
  getTableDataEmployee,
} from "./helper";
import "./styles.css";
import { toast } from "react-toastify";

function EmployeeFeatureNew() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { buId, wgId, wgName, wId, buName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // state
  const [open, setOpen] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const GetBusinessDetailsByBusinessUnitId = useApiRequest({});

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
      pageSize: pagination?.pageSize || 25,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      strDepartmentList: filerList?.strDepartment || [],
      strDesignationList: filerList?.strDesignation || [],
      strSupervisorNameList: filerList?.strSupervisorName || [],
      strEmploymentTypeList: filerList?.strEmploymentType || [],
      strLinemanagerList: filerList?.strLinemanager || [],
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
    landingApiCall({ searchText: value });
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
      width: 25,
      align: "center",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      sorter: true,
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
    },
    {
      title: "Reference Id",
      dataIndex: "strReferenceId",
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
    },
    {
      title: "Wing",
      dataIndex: "wingName",
      sorter: true,
      filter: true,
      filterKey: "wingNameList",

      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sorter: true,
      filter: true,
      filterKey: "soleDepoNameList",
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sorter: true,
      filter: true,
      filterKey: "regionNameList",
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sorter: true,
      filter: true,
      filterKey: "areaNameList",
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Territory",
      dataIndex: "territoryName",
      sorter: true,
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sorter: true,
      filter: true,
      filterKey: "strSupervisorNameList",
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sorter: true,
      filter: true,
      filterKey: "strLinemanagerList",
    },
    {
      title: "Pin Number",
      dataIndex: "pinNo",
      sorter: true,
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      filterKey: "strEmploymentTypeList",
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteJoiningDate),
      sorter: true,
      dataType: "date",
    },
    {
      width: 50,
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
  ];
  // console.log(landingApi?.data);
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={() => {
          setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
            }}
            submitText="Create New"
            submitIcon={<AddOutlined />}
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
            ]}
            onExport={() => {
              const excelLanding = async () => {
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
                    strDepartmentList: [],
                    strDesignationList: [],
                    strSupervisorNameList: [],
                    strEmploymentTypeList: [],
                    strLinemanagerList: [],
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
                        wgId === 3 ? columnForMarketing : columnForHeadOffice,
                      getTableData: () =>
                        getTableDataEmployee(
                          newData,
                          wgId === 3
                            ? Object.keys(columnForMarketing)
                            : Object.keys(columnForHeadOffice)
                        ),
                      tableFooter: [],
                      extraInfo: {},
                      tableHeadFontSize: 10,
                      widthList:
                        wgId === 3
                          ? {
                              C: 30,
                              E: 30,
                              F: 30,
                              G: 15,
                              H: 15,
                              I: 15,
                              J: 15,
                              K: 20,
                              L: 30,
                              M: 25,
                              N: 25,
                            }
                          : {
                              C: 30,
                              E: 30,
                              F: 30,
                              G: 30,
                              H: 25,
                              I: 25,
                              J: 20,
                            },
                      commonCellRange: "A1:J1",
                      CellAlignment: "left",
                    });
                  }
                } catch (error: any) {
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
            header={header?.filter((item) => !item?.hidden)}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              const { search } = form.getFieldsValue(true);
              landingApiCall({
                pagination,
                filerList: filters,
                searchText: search,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title="Create New Employee"
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={false}
              pages={undefined}
              singleData={undefined}
            />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default EmployeeFeatureNew;
