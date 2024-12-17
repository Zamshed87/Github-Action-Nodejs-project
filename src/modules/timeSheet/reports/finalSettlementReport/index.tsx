import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useApiRequest } from "Hooks";
import { Col, Collapse, Form, Row, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { todayDate } from "utility/todayDate";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { downloadFile, getPDFAction } from "utility/downloadFile";

const FinalSettlementReport = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId, intAccountId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30509),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [data, setData] = useState("");

  //   const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const CommonEmployeeDDL = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empSectionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Final Settlement Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

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
        console.log("res", res);
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();
    const { workplaceGroup } = form.getFieldsValue(true);

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || 0,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const getEmploymentType = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
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
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,

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
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getEmployeePosition = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
  }, []);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  const submitHandler = () => {
    const values = form.getFieldsValue(true);

    const workplaceIdList = (values?.workplace
      ?.map((i: any) => i?.value || 0)
      ?.join(",") || '') || ''; 
    
    const employeeTypeIdList = (values?.employeeType
      ?.map((i: any) => i?.value || 0)
      ?.join(",") || '') || '';
    
    const departmentIdList = (values?.department
      ?.map((i: any) => i?.value || 0)
      ?.join(",") || '') || '';
    
    const sectionIdList = (values?.section
      ?.map((i: any) => i?.value || 0)
      ?.join(",") || '') || '';
    
    const designationIdList = (values?.designation
      ?.map((i: any) => i?.value || 0)
      ?.join(",") || '') || '';
    
    const hrPositionIdList = (values?.hrPosition
      ?.map((i: any) => i?.value || 0)
      ?.join(",") || '') || '';
    

    console.log("values", values);
    console.log("workplaceList", workplaceIdList);
    landingApi?.action({
      method: "get",
      urlKey: "FinalSettlementReportForAll",
      params: {
        strPartName: "htmlView",
        intAccountId: orgId,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        intWorkplaceGroupId: values?.workplaceGroup?.value || 0,
        strWorkplaceIdList: workplaceIdList || "",
        strEmployeeIdList: values?.employee?.value || "",
        strEmployeeCodeList: values?.employee?.employeeCode || "",
        strDesignationIdList: designationIdList || "",
        strDepartmentIdList: departmentIdList || "",
        strSectionIdList: sectionIdList || "",
        strHrPositionIdList: hrPositionIdList || "",
        strEmploymentTypeIdList: employeeTypeIdList || "",
        intStatus: 0,
      },
      onSuccess: (res) => {
        setData(res);
      },
    });
  };
  return employeeFeature?.isView ? (
    <>
      <PForm form={form} initialValues={{}} onFinish={submitHandler}>
        <PCard>
          {(excelLoading || landingApi?.loading) && <Loading />}
          <PCardHeader
            // exportIcon={true}
            title={`Final Settlement Report`}
          />
          <PCardBody className="mb-3">
            <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
              <Panel header="Collapsable" key="1">
                <Row gutter={[10, 2]}>
                  <Col md={5} sm={12} xs={24}>
                    <PInput
                      type="date"
                      name="fromDate"
                      label="From Date"
                      placeholder="From Date"
                      rules={[
                        {
                          required: true,
                          message: "from Date is required",
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: "To Date is required",
                        },
                      ]}
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
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          workplaceGroup: op,
                          workplace: undefined,
                          department: undefined,
                          section: undefined,
                          designation: undefined,
                          hrPosition: undefined,
                          employeeType: undefined,
                        });
                        if (value) {
                          getWorkplace();
                          getEmployeDepartment();
                          getEmployeDesignation();
                          getEmploymentType();
                          getEmployeePosition();
                        }
                      }}
                      rules={[
                        { required: true, message: "Workplace is required" },
                      ]}
                    />
                  </Col>
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      mode="multiple"
                      options={workplace?.data || []}
                      name="workplace"
                      label="Workplace/Concern"
                      placeholder="Workplace/Concern"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          workplace: op,
                          department: undefined,
                          section: undefined,
                          designation: undefined,
                          hrPosition: undefined,
                          employeeType: undefined,
                        });
                        if (value) {
                          getEmployeDepartment();
                          getEmployeDesignation();
                          getEmploymentType();
                          getEmployeePosition();
                        }
                      }}
                    />
                  </Col>
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      name="employee"
                      label="Employee"
                      placeholder="Search Min 2 char"
                      options={CommonEmployeeDDL?.data || []}
                      loading={CommonEmployeeDDL?.loading}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          employee: op,
                        });
                      }}
                      onSearch={(value) => {
                        getEmployee(value);
                      }}
                      showSearch
                      filterOption={false}
                    />
                  </Col>

                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      mode="multiple"
                      options={employmentTypeDDL?.data || []}
                      name="employeeType"
                      label="Employment Type"
                      placeholder="Employment Type"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          employeeType: op,
                        });
                      }}
                    />
                  </Col>

                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      mode="multiple"
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
                        });
                      }}
                    />
                  </Col>
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      mode="multiple"
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
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      mode="multiple"
                      options={empDesignationDDL.data || []}
                      showSearch
                      filterOption={true}
                      name="designation"
                      label="Designation"
                      placeholder="Designation"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          designation: op,
                        });
                      }}
                    />
                  </Col>
                  <Col md={5} sm={12} xs={24}>
                    <PSelect
                      options={positionDDL?.data || []}
                      name="hrPosition"
                      showSearch
                      filterOption={true}
                      label="HR Position"
                      placeholder="HR Position"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          hrPosition: op,
                        });
                      }}
                    />
                  </Col>

                  {/* <Col md={5} sm={12} xs={24}>
                <PSelect
                  mode="multiple"
                  options={[
                    {
                      value: 1,
                      label: "Friday",
                    },
                    { value: 2, label: "Saturday" },
                    { value: 3, label: "Sunday" },
                    { value: 4, label: "Monday" },
                    { value: 5, label: "Tuseday" },
                    { value: 6, label: "Wednesday" },
                    { value: 7, label: "Thursday" },
                  ]}
                  name="offday"
                  label="Off Day"
                  placeholder=" Off Day"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      offday: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Off Day is required",
                    },
                  ]}
                />
              </Col> */}

                  <Col
                    style={{
                      marginTop: "23px",
                    }}
                  >
                    <PButton type="primary" action="submit" content="View" />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </PCardBody>

          <div>
            {data && (
              <ul className="d-flex flex-row-reverse mt-3 align-items-center justify-content-start">
                <li className="pr-2 ml-2">
                  <Tooltip title="Download as Excel">
                    <button
                      className="btn-save"
                      type="button"
                      onClick={(e) => {
                        const values = form.getFieldsValue(true);
                        e.stopPropagation();
                        
                        const workplaceIdList = (values?.workplace
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || ''; 
                        
                        const employeeTypeIdList = (values?.employeeType
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const departmentIdList = (values?.department
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const sectionIdList = (values?.section
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const designationIdList = (values?.designation
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const hrPositionIdList = (values?.hrPosition
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        

                          const url = `/PdfAndExcelReport/FinalSettlementReportForAll?strPartName=excelView&intAccountId=${orgId}&fromDate=${moment(values?.fromDate).format("YYYY-MM-DD")}&toDate=${moment(values?.toDate).format("YYYY-MM-DD")}&intWorkplaceGroupId=${values?.workplaceGroup?.value || 0}&strWorkplaceIdList=${workplaceIdList || ""}&strEmployeeIdList=${employeeTypeIdList || ""}&strEmployeeCodeList=&strDesignationIdList=${designationIdList || ""}&strDepartmentIdList=${departmentIdList || ""}&strSectionIdList=${sectionIdList || ""}&strHrPositionIdList=${hrPositionIdList || ""}&strEmploymentTypeIdList=${employeeTypeIdList || ""}&intStatus=0`;


                        downloadFile(
                          url,
                          `Final Settlement Report- ${todayDate()}`,
                          "xlsx",
                          setExcelLoading
                        );
                      }}
                      style={{
                        border: "transparent",
                        width: "30px",
                        height: "30px",
                        background: "#f2f2f7",
                        borderRadius: "100px",
                      }}
                    >
                      <DownloadIcon
                        sx={{
                          color: "#101828",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip title="Print as PDF">
                    <button
                      className="btn-save"
                      type="button"
                      onClick={(e) => {
                        const values = form.getFieldsValue(true);
                        e.stopPropagation();
                        const workplaceIdList = (values?.workplace
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || ''; 
                        
                        const employeeTypeIdList = (values?.employeeType
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const departmentIdList = (values?.department
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const sectionIdList = (values?.section
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const designationIdList = (values?.designation
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        
                        const hrPositionIdList = (values?.hrPosition
                          ?.map((i: any) => i?.value || 0)
                          ?.join(",") || '') || '';
                        

                          const url = `/PdfAndExcelReport/FinalSettlementReportForAll?strPartName=pdfView&intAccountId=${orgId}&fromDate=${moment(values?.fromDate).format("YYYY-MM-DD")}&toDate=${moment(values?.toDate).format("YYYY-MM-DD")}&intWorkplaceGroupId=${values?.workplaceGroup?.value || 0}&strWorkplaceIdList=${workplaceIdList || ""}&strEmployeeIdList=${employeeTypeIdList || ""}&strEmployeeCodeList=&strDesignationIdList=${designationIdList || ""}&strDepartmentIdList=${departmentIdList || ""}&strSectionIdList=${sectionIdList || ""}&strHrPositionIdList=${hrPositionIdList || ""}&strEmploymentTypeIdList=${employeeTypeIdList || ""}&intStatus=0`;


                        getPDFAction(url, setExcelLoading);
                      }}
                      // disabled={resDetailsReport?.length <= 0}
                      style={{
                        border: "transparent",
                        width: "30px",
                        height: "30px",
                        background: "#f2f2f7",
                        borderRadius: "100px",
                      }}
                    >
                      <LocalPrintshopIcon
                        sx={{
                          color: "#101828",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </li>
              </ul>
            )}
          </div>

          <div style={{ overflow: "scroll" }} className=" w-100">
            <div
              dangerouslySetInnerHTML={{
                __html: data,
              }}
            />
          </div>
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default FinalSettlementReport;
