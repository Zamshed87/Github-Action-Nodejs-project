import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDateOfYear } from "utility/dateFormatter";
import {} from "react-icons/md";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { getWorkplaceDetails } from "common/api";
import PfEmployeeDetails from "./rightSideDetails";
import { getMultipleDepartment } from "./view/helper";
import { setCustomFieldsValue } from "utility/filter/helper";

const PfEmployeeReport = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, orgId, wId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30510),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const [filterList, setFilterList] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Employee Wise Report";
  }, []);

  // Define a type for the landing API parameters
  type TLandingApi = {
    pagination?: {
      pageSize?: number;
      current?: number;
    };
    filerList?: any;
    searchText?: string;
  };

  const landingApi = useApiRequest({});
  //ProvidentFund/GetEmployeePfSummaryReport?EmployeeStatusList=Active%2CInactive&PageSize=50&PageNo=1
  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    // Transform selected workplace groups into an array of values
    const workplaceGroupList = values?.workplaceGroup?.value;

    // Transform selected workplaces into an array of values
    const workplaceList = values?.workplace?.map((item: any) => item.value);

    // Transform selected departments into an array of values
    const departmentList = values?.department?.map((item: any) => item.value);

    // Transform selected employee status into an array of values
    let employeeStatusList = values?.employeeStatus?.map(
      (item: any) => item.label
    );

    if (employeeStatusList?.length === 1 && employeeStatusList[0] === "All") {
      employeeStatusList = ["Active", "Inactive", "Separated"];
    }

    landingApi.action({
      urlKey: "PostEmployeePfSummaryReport",
      method: "POST",
      payload: {
        intBusinessUnitId: buId,
        strWorkplaceGroupList: [workplaceGroupList],
        strWorkplaceList: workplaceList || [],
        strDepartmentList: departmentList || [],
        strEmployeeStatusList: employeeStatusList || [],
        isPaginate: true,
        pageSize: pagination?.pageSize || 25,
        pageNo: pagination?.current || 1,
        searchText: searchText || "",
      },
    });
  };

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      width: 5,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      filter: true,
      filterKey: "strWorkplaceGroupList",
      sorter: true,
      width: 20,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      filter: true,
      filterKey: "strWorkplaceList",
      sorter: true,
      width: 20,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      filter: true,
      filterKey: "strEmployeeNameList",
      sorter: true,
      width: 20,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      filter: true,
      filterKey: "strDepartmentList",
      sorter: true,
      width: 20,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      filter: true,
      filterKey: "strDesignationList",
      sorter: true,
      width: 20,
    },
    {
      title: "Total Employee Contribution Amount",
      dataIndex: "numTotalEmployeeContribution",
      sorter: true,
      width: 20,
    },
    {
      title: "Total Company Contribution Amount",
      dataIndex: "numTotalCompanyContribution",
      sorter: true,
      width: 20,
    },
    {
      title: "Total Profit Share Amount",
      dataIndex: "numTotalProfitShareAmount",
      sorter: true,
      width: 20,
    },
    {
      title: "Total PF Amount",
      dataIndex: "numTotalPFAmount",
      sorter: true,
      width: 20,
    },
    {
      title: "Last Profit Share Date",
      dataIndex: "dteLastProfitShareDate",
      render: (text: any) => (text ? moment(text).format("DD/MM/YYYY") : ""),
      sorter: true,
      width: 20,
    },

    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_: any, rec: any) => (
        <>
          <TableButton
            buttonsList={[
              rec?.isPrintable && {
                type: "view",
                onClick: (e: any) => {
                  if (!employeeFeature?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  // Open in a new window instead of redirecting
                  window.open(
                    `/BenefitsManagement/reports/PFEmployeeWise/view?employeeId=${rec?.intEmployeeId}`,
                    "_blank"
                  );
                },
              },
            ]}
          />
        </>
      ),
    },
  ];

  const [buDetails, setBuDetails] = useState({});

  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);

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

  const getDepartments = () => {
    const { workplace } = form.getFieldsValue(true);

    getMultipleDepartment(setLoading, workplace, setDepartmentDDL);
  };

  useEffect(() => {
    getWorkplaceGroup();
  }, []);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(getDateOfYear("first")),
          toDate: moment(getDateOfYear("last")),
        }}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(excelLoading || landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={false}
            printIcon={false}
            title={`PF Employee Wise Report`}
          />
          <PCardBody className="mb-3">
            <div className="d-flex justify-content-between">
              <div style={{ width: "60%" }}>
                <Row gutter={[10, 2]}>
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      options={workplaceGroup?.data || []}
                      maxTagCount={"responsive"}
                      name="workplaceGroup"
                      label="Workplace Group"
                      placeholder="Workplace Group"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          workplaceGroup: op,
                          workplace: undefined,
                          department: undefined, // Reset department when workplace group changes
                        });
                        getWorkplace();
                      }}
                    />
                  </Col>
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      options={workplace?.data || []}
                      maxTagCount={"responsive"}
                      name="workplace"
                      label="Workplace"
                      placeholder="Workplace"
                      mode="multiple"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          workplace: op,
                          department: undefined, // Reset department when workplace changes
                        });
                        getWorkplaceDetails(value, setBuDetails);
                        getDepartments();
                      }}
                    />
                  </Col>

                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      maxTagCount={"responsive"}
                      options={departmentDDL || []}
                      name="department"
                      label="Department"
                      placeholder="Department"
                      mode="multiple"
                      loading={false}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          department: op,
                        });
                      }}
                    />
                  </Col>

                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      maxTagCount={"responsive"}
                      options={[
                        { label: "All", value: 0 },
                        { label: "Active", value: 2 },
                        { label: "InActive", value: 3 },
                        { label: "Separated", value: 4 },
                      ]}
                      name="employeeStatus"
                      label="Employee Status"
                      placeholder="Employee Status"
                      mode="multiple"
                      onChange={(value, op) => {
                        setCustomFieldsValue(form, "employeeStatus", op);
                      }}
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
              </div>
              <div style={{ width: "40%" }}>
                <PfEmployeeDetails landingApi={landingApi} />
              </div>
            </div>
          </PCardBody>
          {landingApi?.data?.data && (
            <DataTable
              scroll={{ x: 2500 }}
              bordered
              data={
                landingApi?.data?.data?.listofEmployeeWisePfSummaryReport || []
              }
              loading={landingApi?.loading}
              header={header}
              pagination={{
                total: landingApi?.data?.totalCount || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "25", "50", "100"],
                pageSize: landingApi?.data?.pageSize || 25,
                current: landingApi?.data?.pageNo || 1,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
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
            />
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfEmployeeReport;
