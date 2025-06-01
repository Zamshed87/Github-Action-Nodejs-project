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

  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Employee Wise Report";
  }, []);

  /**
   * WorkplaceGroupList (Example: 1,2,3)
WorkplaceList (Example: 1,2,3)
DepartmentList (Example: 1,2,3)
EmployeeStatusList (Example: 1,2,3)
IsPaginate (default: true),
PageSize: 25,
PageNo: 1
   */

  const landingApi = useApiRequest({});
  //ProvidentFund/GetEmployeePfSummaryReport?EmployeeStatusList=Active%2CInactive&PageSize=50&PageNo=1
  const landingApiCall = () => {
    const values = form.getFieldsValue(true);

    // Transform selected workplace groups into comma-separated list
    const workplaceGroupList = values?.workplaceGroup
      ?.map((item: any) => item.value)
      .join(",");

    // Transform selected workplaces into comma-separated list
    const workplaceList = values?.workplace
      ?.map((item: any) => item.value)
      .join(",");

    // Transform selected departments into comma-separated list
    const departmentList = values?.department
      ?.map((item: any) => item.value)
      .join(",");

    // Transform selected employee status into comma-separated list
    const employeeStatusList = values?.employeeStatus
      ?.map((item: any) => item.label)
      .join(",");

    landingApi.action({
      urlKey: "GetEmployeePfSummaryReport",
      method: "GET",
      params: {
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        intBusinessUnitId: buId,
        WorkplaceGroupList: workplaceGroupList || undefined,
        WorkplaceList: workplaceList || undefined,
        DepartmentList: departmentList || undefined,
        EmployeeStatusList: employeeStatusList || undefined,
        IsPaginate: true,
        PageSize: 25,
        PageNo: 1,
      },
    });
  };

  const searchFunc = debounce((values) => {
    landingApiCall();
  }, 500);

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      width: 5,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      width: 20,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      width: 20,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      sorter: true,
      width: 20,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      width: 20,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
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
              {
                type: "view",
                onClick: (e: any) => {
                  console.log("rec", rec);
                  if (!employeeFeature?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  history.push(
                    `/BenefitsManagement/reports/PFEmployeeWise/view`,
                    {
                      employeeId: rec?.intEmployeeId,
                    }
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
  const departmentDDL = useApiRequest([]);

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
    departmentDDL.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        accountId: orgId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any) => {
          item.label = item.strDepartment;
          item.value = item.intDepartmentId;
        });
      },
    });
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
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
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
                      mode="multiple"
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
                      options={departmentDDL?.data || []}
                      name="department"
                      label="Department"
                      placeholder="Department"
                      mode="multiple"
                      loading={departmentDDL?.loading}
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
                        { label: "All", value: 1 },
                        { label: "Active", value: 2 },
                        { label: "InActive", value: 3 },
                        { label: "Separated", value: 4 },
                      ]}
                      name="employeeStatus"
                      label="Employee Status"
                      placeholder="Employee Status"
                      mode="multiple"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          employeeStatus: op,
                        });
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
              onChange={(pagination, filters, sorter, extra) => {
                if (extra.action === "sort") return;
                landingApiCall();
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
