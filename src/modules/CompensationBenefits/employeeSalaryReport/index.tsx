import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { downloadFile, getPDFAction } from "utility/downloadFile";

const EmployeeSalaryReport = () => {
  const dispatch = useDispatch();
  // redux states data
  const {
    permissionList,
    profileData: {
      buId,
      wId,
      wgId,
      orgId,
      intAccountId,
      employeeId,
      wgName,
      wName,
    },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const featurePermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30629),
    []
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Employee Salary Report | PeopleDesk";
  }, []);

  const [form] = Form.useForm();

  //   api states and actions
  const [loading, setLoading] = useState(false);
  const landingApi = useApiRequest({});
  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const payscaleApi = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empSectionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);

  const [grade, setGrade] = useState();

  const getPayscale = () => {
    payscaleApi?.action({
      urlKey: "GetPayScaleSetupDDLbyEmployee",
      method: "GET",
      params: {
        employeeId: employeeId,
      },
    });
  };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplaceDDL?.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  const getPayrollGroupDDL = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    payrollGroupDDL?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN DDL",
        IntEmployeeId: employeeId,
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: 0,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strSalaryBreakdownTitle;
          res[i].value = item?.intSalaryBreakdownHeaderId;
        });
      },
    });
  };

  const workplaaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getEmployeDepartment = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };

  const getEmployeDesignation = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getEmployeeSection = () => {
    const { department, workplace, workplaceGroup } = form.getFieldsValue(true);
    empSectionDDL?.action({
      urlKey: "SectionIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        departmentId: department?.value || 0,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,

      },

      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strSectionName;
          res[i].value = item?.intSectionId;
        });
      },
    });
  };

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    const payrollGroupList = values?.payrollGroup
      ?.map((item: any) => item.value)
      .join(",");
    landingApi.action({
      urlKey: "GetEmployeeSalaryReport",
      method: "GET",
      params: {
        strFormat: "html",
        intAccountId: orgId,
        intWorkplaceId: values?.workplace?.value || wId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: values?.workplaceGroup?.value || wgId,
        intDepartmentId: values?.department?.value,
        intSectionId: values?.section?.value,
        intDesignationId: values?.designation?.value,
        strPayrollGroupList: payrollGroupList,
        isGradeBasedSalary: values?.payrollType?.value === 1 ? true : false,
      },
      onError() {
        toast.error("No Data Found");
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    workplaaceGroup();
    getWorkplace();
    getEmployeDepartment();
    getEmployeDesignation()
    getEmployeeSection()
  }, [wId]);

  return featurePermission?.isView ? (
    <>
      <PForm
        initialValues={{
          workplaceGroup: { value: wgId, label: wgName },
          workplace: { value: wId, label: wName },
        }}
        form={form}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Employee Salary Report`}
            onExport={() => {
              const values = form.getFieldsValue(true);
              const payrollGroupList = values?.payrollGroup
                ?.map((item: any) => item.value)
                .join(",");
              const gradeBased =
                values?.payrollType?.value === 1 ? true : false;
              const url = `/SalaryReport/GetEmployeeSalaryReport?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${
                values?.workplace?.value
              }&intWorkplaceGroupId=${
                values?.workplaceGroup?.value
              }&isGradeBasedSalary=${gradeBased}&strPayrollGroupList=${
                payrollGroupList || []
              }&intDepartmentId=${
                values?.department?.value || 0
              }&intSectionId=${values?.section?.value || 0}&intDesignationId=${
                values?.designation?.value || 0
              }&strFormat=excel`;
              downloadFile(url, "Employee Salary", "xlsx", setLoading);
            }}
            printIcon={true}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              const payrollGroupList = values?.payrollGroup
                ?.map((item: any) => item.value)
                .join(",");
              const gradeBased =
                values?.payrollType?.value === 1 ? true : false;
              const url = `/SalaryReport/GetEmployeeSalaryReport?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${
                values?.workplace?.value
              }&intWorkplaceGroupId=${
                values?.workplaceGroup?.value
              }&isGradeBasedSalary=${gradeBased}&strPayrollGroupList=${
                payrollGroupList || []
              }&intDepartmentId=${
                values?.department?.value || 0
              }&intSectionId=${values?.section?.value || 0}&intDesignationId=${
                values?.designation?.value || 0
              }&strFormat=pdf`;
              getPDFAction(url, setLoading, "Employee Salary");
            }}
          />
          <PCardBody className="">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  options={workplaceGroup.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                      department: undefined,
                      section: undefined,
                      designation: undefined,
                      payrollGroup: undefined,
                      payrollType: undefined,
                    });
                    if (value) {
                      getWorkplace();
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Workplace Group is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={workplaceDDL?.data || []}
                  name="workplace"
                  label="Workplace/Concern"
                  placeholder="Workplace/Concern"
                  showSearch
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                      department: undefined,
                      section: undefined,
                      designation: undefined,
                      payrollGroup: undefined,
                      payrollType: undefined,
                    });
                    if (value) {
                      getEmployeDepartment();
                      getEmployeDesignation();
                      getEmployeeSection();
                    }
                  }}
                  rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              {/* Need to add payroll type just for grade and non-grade  */}
              <Col md={6} sm={24}>
                <PSelect
                  options={[
                    { value: 1, label: "Grade Based" },
                    { value: 2, label: "Non Grade Based" },
                  ]}
                  name="payrollType"
                  label="Payroll Type"
                  placeholder="Payroll Type"
                  showSearch
                  allowClear
                  onChange={(value, op) => {
                    if (value === 1) {
                      getPayscale();
                    } else {
                      getPayrollGroupDDL();
                    }

                    form.setFieldsValue({
                      payrollType: op,
                      payrollGroup: undefined,
                      payScale: undefined,
                    });
                    setGrade(value);
                  }}
                />
              </Col>
              {grade === 1 && (
                <Col md={6} sm={24}>
                  <PSelect
                    options={payscaleApi?.data || []}
                    name="payrollGroup"
                    label="Pay Scale"
                    showSearch
                    allowClear
                    mode="multiple"
                    filterOption={true}
                    placeholder="Pay Scale"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        payrollGroup: op,
                      });
                    }}
                  />
                </Col>
              )}
              {grade === 2 && (
                <Col md={6} sm={24}>
                  <PSelect
                    options={payrollGroupDDL?.data || []}
                    name="payrollGroup"
                    label="Payroll Group"
                    showSearch
                    allowClear
                    mode="multiple"
                    filterOption={true}
                    placeholder="Payroll Group"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        payrollGroup: op,
                      });
                    }}
                  />
                </Col>
              )}

              <Col md={6} sm={24}>
                <PSelect
                  options={empDepartmentDDL?.data || []}
                  name="department"
                  showSearch
                  filterOption={true}
                  label="Department"
                  allowClear
                  placeholder="Department"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                      section: undefined,
                      designation: undefined,
                    });
                    value && getEmployeeSection();
                  }}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={empSectionDDL.data || []}
                  name="section"
                  showSearch
                  allowClear
                  filterOption={true}
                  label="Section"
                  placeholder="Section"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      section: op,
                    });
                  }}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={empDesignationDDL.data || []}
                  showSearch
                  filterOption={true}
                  name="designation"
                  allowClear
                  label="Designation"
                  placeholder="Designation"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      designation: op,
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
          </PCardBody>
          {!landingApi?.error && !landingApi?.loading && landingApi?.data && (
            <>
              {loading && <Loading />}
              <div className="sme-scrollable-table mt-2">
                <div
                  className="scroll-table scroll-table-height"
                  dangerouslySetInnerHTML={{
                    __html: landingApi?.data,
                  }}
                ></div>
              </div>
            </>
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmployeeSalaryReport;
