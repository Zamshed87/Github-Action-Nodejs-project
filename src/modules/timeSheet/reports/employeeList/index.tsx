import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { Col, Form, Row, Tag } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 131),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [filterList, setFilterList] = useState({});
  const [, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Employee List";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "WorkplaceWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        empId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
    IsForXl?: boolean;
    date?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: values?.workplaceGroup?.value || 0,

      workplaceId: values?.workplace?.value || 0,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      fromDate: values?.fromDate
        ? moment(values?.fromDate).format("YYYY-MM-DD")
        : null,
      toDate: values?.toDate
        ? moment(values?.toDate).format("YYYY-MM-DD")
        : null,

      strDepartmentList: filerList?.strDepartment || [],
      strWorkplaceGroupList: filerList?.strWorkplaceGroup || [],
      strWorkplaceList: filerList?.strWorkplace || [],
      strLinemanagerList: filerList?.strLinemanager || [],
      strEmploymentTypeList: filerList?.strEmploymentType || [],
      strSupervisorNameList: filerList?.strSupervisorName || [],
      strDottedSupervisorNameList: filerList?.strDottedSupervisorName || [],
      strDivisionList: filerList?.strDivision || [],
      strPayrollGroupList: filerList?.strPayrollGroup || [],
      strDesignationList: filerList?.strDesignation || [],
      strHrPositionList: filerList?.strHrPosition || [],
      strBankList: filerList?.strBank || [],
      strSectionList: filerList?.strSection || [],
      //   unnecesary
      wingNameList: [],
      soleDepoNameList: [],
      regionNameList: [],
      areaNameList: [],
      territoryNameList: [],
    };
    landingApi.action({
      urlKey: "EmployeeReportWithFilter",
      method: "POST",
      payload: payload,
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 35,
      align: "center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      width: 150,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      width: 150,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 150,
      fixed: "left",
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
      width: 200,
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Division",
      dataIndex: "strDivision",
      sorter: true,
      filter: true,
      filterKey: "strDivisionList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Section",
      dataIndex: "strSection",
      sorter: true,
      filter: true,
      filterKey: "strSectionList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "HR Position",
      dataIndex: "strHrPosition",
      sorter: true,
      filter: true,
      filterKey: "strHrPositionList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Employment Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      filterKey: "strEmploymentTypeList",
      filterSearch: true,
      width: 180,
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      render: (_: any, rec: any) => dateFormatter(rec?.dateOfJoining),
      width: 120,
    },
    {
      title: "Service Length",
      dataIndex: "strServiceLength",
      width: 120,
    },

    {
      title: "Salary Type",
      dataIndex: "strSalaryType",
      width: 100,
    },
    {
      title: "Payroll Group",
      dataIndex: "payrollGroup",
      width: 100,
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sorter: true,
      filter: true,
      filterKey: "strSupervisorNameList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Dotted Supervisor",
      dataIndex: "strDottedSupervisorName",
      sorter: true,
      filter: true,
      filterKey: "strDottedSupervisorNameList",
      filterSearch: true,
      width: 180,
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sorter: true,
      filter: true,
      filterKey: "strLinemanagerList",
      filterSearch: true,
      width: 150,
    },
    {
      title: "Date of Permanent",
      dataIndex: "dateOfJoining",
      render: (_: any, rec: any) => dateFormatter(rec?.dateOfConfirmation),
      width: 140,
    },
    {
      title: "Father's Name",
      dataIndex: "fatherName",
      width: 120,
    },
    {
      title: "Mother's Name",
      dataIndex: "motherName",
      width: 120,
    },
    {
      title: "Present Address",
      dataIndex: "presentAddress",
      width: 200,
    },
    {
      title: "Permanent Address",
      dataIndex: "permanentAddress",
      width: 200,
    },
    {
      title: "Employee Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Place of Brith",
      dataIndex: "strBirthPlace",
      width: 100,
    },
    {
      title: "Personal Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Date of Birth",
      //   dataIndex: "dateOfBirth",
      render: (_: any, rec: any) => dateFormatter(rec?.dateOfBirth),
      width: 120,
    },
    {
      title: "Religion",
      dataIndex: "religion",
      width: 100,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 100,
    },
    {
      title: "Marital Status",
      dataIndex: "maritialStatus",
      width: 100,
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      width: 100,
    },
    {
      title: "Personal Mobile",
      dataIndex: "personalMobile",
      width: 120,
    },
    {
      title: "Official Mobile",
      dataIndex: "mobileNo",
      width: 100,
    },
    {
      title: "Nominee Name",
      dataIndex: "nomineeName",
      width: 120,
    },
    {
      title: "Relationship",
      dataIndex: "nomineeRelationship",
      width: 100,
    },
    {
      title: "Nominee NID/BRC",
      dataIndex: "nomineeNID",
      width: 130,
    },
    {
      title: "Emergency Contact Number",
      dataIndex: "EmeregencyContact",
      width: 200,
    },
    {
      title: "Employee NID",
      dataIndex: "nid",
      width: 100,
    },
    {
      title: "BRC",
      dataIndex: "birthID",
      width: 100,
    },
    {
      title: "TIN No.",
      dataIndex: "tin",
      width: 100,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      width: 200,

      // sorter: true,
      // filter: true,
      // filterKey: "strBankList",
      // filterSearch: true,
      // width: 150,
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      width: 100,
    },
    {
      title: "Account No",
      dataIndex: "accountNo",
      width: 150,
    },
    {
      title: "Routing",
      dataIndex: "routingNo",
      width: 100,
    },
    {
      title: "Status",

      render: (_: any, rec: any) => {
        return (
          <div>
            {rec?.empStatus === "Active" ? (
              <Tag color="green">{rec?.empStatus}</Tag>
            ) : rec?.empStatus === "Inactive" ? (
              <Tag color="red">{rec?.empStatus}</Tag>
            ) : null}
          </div>
        );
      },

      width: 100,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      filerList: filterList,
      searchText: value,
    });
  }, 500);
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.page,
              pageSize: landingApi?.data?.totalCount,
            },
          });
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
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  const payload = {
                    businessUnitId: buId,
                    workplaceGroupId: values?.workplaceGroup?.value || 0,

                    workplaceId: values?.workplace?.value || 0,
                    pageNo: 0,
                    pageSize: 0,
                    isPaginated: true,
                    isHeaderNeed: true,
                    searchTxt: "",
                    fromDate: values?.fromDate
                      ? moment(values?.fromDate).format("YYYY-MM-DD")
                      : null,
                    toDate: values?.toDate
                      ? moment(values?.toDate).format("YYYY-MM-DD")
                      : null,

                    strDepartmentList: (filterList as any)?.strDepartment || [],
                    strWorkplaceGroupList:
                      (filterList as any)?.strWorkplaceGroup || [],
                    strWorkplaceList: (filterList as any)?.strWorkplace || [],
                    strLinemanagerList:
                      (filterList as any)?.strLinemanager || [],
                    strEmploymentTypeList:
                      (filterList as any)?.strEmploymentType || [],
                    strSupervisorNameList:
                      (filterList as any)?.strSupervisorName || [],
                    strDottedSupervisorNameList:
                      (filterList as any)?.strDottedSupervisorName || [],
                    strDivisionList: (filterList as any)?.strDivision || [],
                    strPayrollGroupList:
                      (filterList as any)?.strPayrollGroup || [],
                    strDesignationList:
                      (filterList as any)?.strDesignation || [],
                    strHrPositionList: (filterList as any)?.strHrPosition || [],
                    strBankList: (filterList as any)?.strBank || [],
                    strSectionList: (filterList as any)?.strSection || [],
                    //   unnecesary
                    wingNameList: [],
                    soleDepoNameList: [],
                    regionNameList: [],
                    areaNameList: [],
                    territoryNameList: [],
                  };
                  const url =
                    "/PdfAndExcelReport/EmployeeReportWithFilter_RDLC";
                  downloadEmployeeCardFile(
                    url,
                    payload,
                    `Employee List - ${todayDate()}`,
                    "xlsx",
                    setExcelLoading
                  );
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                  // console.log(error?.message);
                }
              };
              excelLanding();
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "from Date is required",
                  //     },
                  //   ]}
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  disabledDate={disabledDate}
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "To Date is required",
                  //     },
                  //   ]}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={
                    [
                      //   { required: true, message: "Workplace Group is required" },
                    ]
                  }
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>

              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody>

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
              setFilterList(filters);
              landingApiCall({
                pagination,
                filerList: filters,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmployeeList;
