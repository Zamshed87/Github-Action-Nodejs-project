import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import { roundToDecimals } from "modules/CompensationBenefits/employeeSalary/salaryAssign/salaryAssignCal";
import moment from "moment";
import React, { useEffect } from "react";
import { gray700 } from "utility/customColor";
// import { attachment_action } from "common/api";
// import { getTransferAndPromotionHistoryById } from "../helper";
// import Accordion from "../accordion";

// import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
// import { setOrganizationDDLFunc } from "modules/roleExtension/ExtensionCreate/helper";
// import HistoryTransferTable from "modules/employeeProfile/transferNPromotion/transferNPromotion/components/HistoryTransferTable";
// import {
//   AttachmentOutlined,
//   FileUpload,
//   VisibilityOutlined,
// } from "@mui/icons-material";

export const GeneralInfo = ({
  form,
  employeeDDLApi,
  id,
  payscaleApi,
  buId,
  wgId,
  orgId,
  wId,
  employeeId,
  setRowDto,
  getEmployeeInfo,
  getEmployeeProfileViewData,
  getBreakDownPolicyElements,
  setEmpBasic,
  empBasic,
  setLoading,
  location,
  setSlabDDL,
  payrollGroupDDL,
  getById,
}: any) => {
  // ------------- transfer⚠️
  // const [transferRowDto, setTransferRowDtoRowDto] = useState<any[]>([]);
  // const [organizationDDL, setOrganizationDDL] = useState([]);
  // const [fileId, setFileId] = useState<any>(0);
  // const organizationTypeList = [
  //   {
  //     label: "Business Unit",
  //     value: 1,
  //   },
  //   {
  //     label: "Workplace Group",
  //     value: 2,
  //   },
  //   {
  //     label: "Workplace",
  //     value: 3,
  //   },
  // ];
  // const [historyData, setHistoryData] = useState([]);
  // const onRoleAdd = (values: any) => {
  //   setTransferRowDtoRowDto([
  //     ...transferRowDto,
  //     {
  //       intOrganizationTypeId: +values?.orgType?.value,
  //       strOrganizationTypeName: values?.orgType?.label,
  //       intOrganizationReffId: values?.orgName?.value,
  //       strOrganizationReffName: values?.orgName?.label,
  //     },
  //   ]);
  // };
  // const isPromotionEligibleCheckApi = useApiRequest([]);
  // const buApi = useApiRequest([]);
  // const userRoleApi = useApiRequest([]);
  // const workplaceGroupApi = useApiRequest([]);
  // const workplaceApi = useApiRequest([]);
  // const departmentApi = useApiRequest([]);
  // const designationApi = useApiRequest([]);
  // const supervisorDDL = useApiRequest([]);
  // -----------
  // ------------- transfer⚠️
  // const getBU = () => {
  //   // const { employee } = form.getFieldsValue(true);
  //   buApi?.action({
  //     urlKey: "BusinessUnitIdAll",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strBusinessUnit;
  //         res[i].value = item?.intBusinessUnitId;
  //       });
  //     },
  //   });
  // };
  // const getworkplaceGroup = () => {
  //   const { businessUnit } = form.getFieldsValue(true);
  //   workplaceGroupApi?.action({
  //     urlKey: "WorkplaceGroupIdAll",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: businessUnit?.value || buId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplaceGroup;
  //         res[i].value = item?.intWorkplaceGroupId;
  //       });
  //     },
  //   });
  // };
  // const getworkplace = () => {
  //   const { businessUnit, workplaceGroup } = form.getFieldsValue(true);
  //   workplaceApi?.action({
  //     urlKey: "WorkplaceIdAll",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: businessUnit?.value || buId,
  //       workplaceGroupId: workplaceGroup?.value || wgId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplace;
  //         res[i].value = item?.intWorkplaceId;
  //       });
  //     },
  //   });
  // };
  // const getDepartment = () => {
  //   const { businessUnit, workplaceGroup, workplace } =
  //     form.getFieldsValue(true);
  //   departmentApi?.action({
  //     urlKey: "DepartmentIdAll",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: businessUnit?.value || buId,
  //       workplaceGroupId: workplaceGroup?.value || wgId,
  //       workplaceId: workplace?.value || wId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strDepartment;
  //         res[i].value = item?.intDepartmentId;
  //       });
  //     },
  //   });
  // };
  // const getDesignation = () => {
  //   const { businessUnit, workplaceGroup, workplace } =
  //     form.getFieldsValue(true);
  //   designationApi?.action({
  //     urlKey: "DesignationIdAll",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: businessUnit?.value || buId,
  //       workplaceGroupId: workplaceGroup?.value || wgId,
  //       workplaceId: workplace?.value || wId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.designationName;
  //         res[i].value = item?.designationId;
  //       });
  //     },
  //   });
  // };
  // const getUserRole = () => {
  //   const { businessUnit } = form.getFieldsValue(true);
  //   userRoleApi?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       BusinessUnitId: businessUnit?.value || buId,
  //       DDLType: "UserRoleDDLWithoutDefault",
  //       WorkplaceGroupId: wgId,
  //       intId: 0,
  //       intWorkplaceId: wId,
  //       intYear: "",
  //     },
  //     // onSuccess: (res) => {
  //     //   res.forEach((item: any, i: any) => {
  //     //     res[i].label = item?.strWorkplaceGroup;
  //     //     res[i].value = item?.intWorkplaceGroupId;
  //     //   });
  //     // },
  //   });
  // };
  // const getSupervisor = (value: any) => {
  //   if (value?.length < 2) return supervisorDDL?.reset();

  //   supervisorDDL?.action({
  //     urlKey: "CommonEmployeeDDL",
  //     method: "GET",
  //     params: {
  //       businessUnitId: buId,
  //       workplaceGroupId: wgId,
  //       searchText: value,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.employeeName;
  //         res[i].value = item?.employeeId;
  //       });
  //     },
  //   });
  // };
  // image
  // const inputFile = useRef<any>(null);
  // const onButtonClick = () => {
  //   inputFile.current.click();
  // };
  // -------------------

  // ------------- transfer⚠️

  // const transferheader: any = [
  //   {
  //     title: "SL",
  //     render: (value: any, row: any, index: number) => index + 1,
  //     align: "center",
  //     width: 20,
  //     // fixed: "left",
  //   },

  //   {
  //     title: "Org Type",
  //     dataIndex: "strOrganizationTypeName",
  //   },
  //   {
  //     title: "Org Name",
  //     dataIndex: "strOrganizationReffName",
  //   },
  //   {
  //     width: 20,
  //     align: "center",
  //     render: (_: any, rec: any, index: any) => (
  //       <TableButton
  //         buttonsList={[
  //           {
  //             type: "delete",
  //             onClick: () => {
  //               setTransferRowDtoRowDto((prev) => [
  //                 ...prev.filter(
  //                   (prev_item, item_index) => item_index !== index
  //                 ),
  //               ]);
  //             },
  //           },
  //         ]}
  //       />
  //     ),
  //   },
  // ];
  // ---------------
  const getEmployee = (value: any) => {
    if (value?.length < 2) return employeeDDLApi?.reset();
    // const { salaryType } = form.getFieldsValue(true);

    employeeDDLApi?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
        // isGradeBased: salaryType?.value === "Grade" ? true : false,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const getPayrollGroupDDL = () => {
    payrollGroupDDL?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN DDL",
        IntEmployeeId: employeeId,
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: 0,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res: any) => {
        res?.forEach((item: any, i: any) => {
          res[i].label = item?.strSalaryBreakdownTitle;
          res[i].value = item?.intSalaryBreakdownHeaderId;
        });
      },
    });
  };
  const getPayscale = () => {
    const { employee } = form.getFieldsValue(true);
    payscaleApi?.action({
      urlKey: "GetPayScaleSetupDDLbyEmployee",
      method: "GET",
      params: {
        employeeId:
          employee?.value ||
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,
      },
    });
  };
  const getPayscaleById = (value: number, op: any) => {
    getById?.action({
      urlKey: "GetPayScaleSetupById",
      method: "get",
      params: {
        id: value,
      },

      onSuccess: (res: any) => {
        const modify = res?.payScaleElements?.map((i: any) => {
          return {
            ...i,
            intSalaryBreakdownRowId: i?.id,
            intSalaryBreakdownHeaderId: value,
            strSalaryBreakdownTitle: (op as any)?.label,
            intPayrollElementTypeId: i?.payrollElementId,
            strPayrollElementName: i?.payrollElementName,
            strBasedOn: i?.basedOn,
            strDependOn: "Basic",
            baseAmount: i?.isBasic ? roundToDecimals(i?.netAmount) : 0,
            isBasicSalary: i?.isBasic,
            numNumberOfPercent: i?.amountOrPercentage,
            numAmount: roundToDecimals(i?.netAmount),
            numberOfPercent: i?.amountOrPercentage,
          };
        });
        const gross = modify.reduce(
          (acc: any, i: any) => acc + i?.numAmount,
          0
        );
        form.setFieldsValue({
          payscaleJobLevel: {
            value: res?.jobLevelId,
            label: res?.jobLevelName,
          },
          payscaleGrade: {
            value: res?.jobGradeId,
            label: res?.jobGradeName,
          },
          payscaleClass: {
            value: res?.jobClassId,
            label: res?.jobClassName,
          },
          grossAmount: Math.round(gross),
        });
        const temp = [];
        for (let i = 0; i <= res?.incrementSlabCount; i++) {
          temp.push({
            value: i,
            label: `Slab ${i}`,
          });
        }
        for (
          let i = 1;
          i <= res?.extendedIncrementSlabCount &&
          res?.extendedIncrementSlabCount !== 0;
          i++
        ) {
          temp.push({
            value: res?.incrementSlabCount + i,
            label: `Efficiency ${res?.incrementSlabCount + i}`,
          });
        }
        setSlabDDL(temp);
        setRowDto(modify);
        // basic_or_grade_calculation();
      },
    });
  };

  useEffect(() => {
    if (id) {
      getEmployeeProfileViewData(
        (location?.state as any)?.singleData?.incrementList?.[0]?.intEmployeeId,

        setEmpBasic,
        setLoading,
        (location?.state as any)?.singleData?.incrementList?.[0]
          ?.intBusinessUnitId,
        (location?.state as any)?.singleData?.incrementList?.[0]
          ?.intWorkplaceGroupId
      );
      //   getAssignedBreakdown();
      form.setFieldsValue({
        employee: {
          value: (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,
          label: (location?.state as any)?.singleData?.incrementList?.[0]
            ?.strEmployeeName,
        },
        transferNPromotionType: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.strTransferNpromotionType,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.strTransferNpromotionType,
        },
        effectiveDate: moment(
          (location?.state as any)?.singleData?.transferPromotionObj
            ?.dteEffectiveDate
        ),
        businessUnit: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intBusinessUnitId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.businessUnitName,
        },
        workplaceGroup: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intWorkplaceGroupId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.workplaceGroupName,
        },
        workplace: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intWorkplaceId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.workplaceName,
        },
        department: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intDepartmentId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.departmentName,
        },
        designation: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intDepartmentId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.departmentName,
        },
        supervisor: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intSupervisorId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.supervisorName,
        },
        lineManager: {
          value: (location?.state as any)?.singleData?.transferPromotionObj
            ?.intLineManagerId,
          label: (location?.state as any)?.singleData?.transferPromotionObj
            ?.lineManagerName,
        },
        role: (location?.state as any)?.singleData?.transferPromotionObj
          ?.empTransferNpromotionUserRoleVMList
          ? (
              location?.state as any
            )?.singleData?.transferPromotionObj?.empTransferNpromotionUserRoleVMList.map(
              (item: any) => {
                return {
                  intTransferNpromotionUserRoleId:
                    item?.intTransferNpromotionUserRoleId,
                  intTransferNpromotionId: item?.intTransferNpromotionId,
                  value: item?.intUserRoleId,
                  label: item?.strUserRoleName,
                };
              }
            )
          : [],
        remarks: (location?.state as any)?.singleData?.transferPromotionObj
          ?.strRemarks,
        isRoleExtension: (location?.state as any)?.singleData
          ?.transferPromotionObj?.empTransferNpromotionRoleExtensionVMList
          ?.length
          ? true
          : false,
        basedOn:
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.strIncrementDependOn === "Basic"
            ? { value: 2, label: "Basic" }
            : { value: 1, label: "Gross" },

        // basedOn: {
        //   value:
        //     (location?.state as any)?.singleData?.incrementList?.[0]
        //       ?.strIncrementDependOn === "Basic"
        //       ? 2
        //       :
        //       (location?.state as any)?.singleData?.incrementList?.[0]
        //           ?.strIncrementDependOn === "Gross"
        //       ? 1
        //       : 3,
        //   label: (location?.state as any)?.singleData?.incrementList?.[0]
        //     ?.strIncrementDependOn,
        // },
        numIncrementPercentageOrAmount: (location?.state as any)?.singleData
          ?.incrementList?.[0]?.numIncrementPercentageOrAmount,
        dteEffectiveDate: moment(
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.dteEffectiveDate
        ),
        promote:
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intTransferNpromotionReferenceId === 0
            ? false
            : true,
      });
    }
    // ------------- transfer⚠️

    // if (
    //   (location?.state as any)?.singleData?.transferPromotionObj?.intEmployeeId
    // ) {
    //   getTransferAndPromotionHistoryById(
    //     orgId,
    //     (location?.state as any)?.singleData?.transferPromotionObj
    //       ?.intEmployeeId,
    //     setHistoryData,
    //     setLoading,
    //     buId,
    //     wgId
    //   );
    //   (location?.state as any)?.singleData?.transferPromotionObj &&
    //     setTransferRowDtoRowDto(
    //       (location?.state as any)?.singleData?.transferPromotionObj
    //         ?.empTransferNpromotionRoleExtensionVMList
    //     );
    //   setFileId(
    //     (location?.state as any)?.singleData?.transferPromotionObj
    //       ?.intAttachementId
    //   );
    // }
    // ----------
  }, [location?.state]);
  useEffect(() => {
    getPayscale();
    getPayrollGroupDDL();
    getEmployeeInfo();
    // getBU();
  }, [wgId, buId, wId, location.state]);
  return (
    <Row gutter={[10, 2]} className="mb-3 card-style">
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={employeeDDLApi?.data || []}
          name="employee"
          label="Select Employee"
          disabled={id ? true : false}
          placeholder="Search minimum 2 character"
          onChange={(value, op) => {
            form.setFieldsValue({
              employee: op,
            });
            getPayscale();
            getEmployeeInfo();

            getEmployeeProfileViewData(
              value,
              setEmpBasic,
              setLoading,
              buId,
              wgId
            );
            // ------------- transfer⚠️

            // getTransferAndPromotionHistoryById(
            //   orgId,
            //   value,
            //   setHistoryData,
            //   setLoading,
            //   buId,
            //   wgId
            // );

            setRowDto([]);
            // getAssignedBreakdown();
          }}
          showSearch
          filterOption={false}
          // notFoundContent={null}
          loading={employeeDDLApi?.loading}
          onSearch={(value) => {
            getEmployee(value);
          }}
          rules={[{ required: true, message: "Employee is required" }]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { employee } = form.getFieldsValue(true);
          return employee?.value ? (
            <Col md={12}>
              <div className="d-flex flex-column mt-3 pt-1">
                <p
                  style={{
                    color: gray700,
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {
                    (empBasic as any)?.employeeProfileLandingView
                      ?.strDesignation
                  }
                </p>
                <p
                  style={{
                    color: gray700,
                    fontSize: "15px",
                    fontWeight: "400",
                  }}
                >
                  Designation
                </p>
              </div>
            </Col>
          ) : undefined;
        }}
      </Form.Item>

      <Divider
        style={{
          marginBlock: "4px",
          marginTop: "16px",
          fontSize: "14px",
          fontWeight: 600,
        }}
        orientation="left"
      >
        {" "}
        Employee increment log
      </Divider>
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={
            orgId === 3 || orgId === 12
              ? [
                  { value: "Grade", label: "Grade" },
                  { value: "Non-Grade", label: "Non-Grade" },
                ]
              : [
                  { value: "Non-Grade", label: "Non-Grade" },
                  // { value: "Grade", label: "Grade" },
                ]
          }
          name="salaryType"
          disabled={(location?.state as any)?.viewOnly}
          label="Salary Type"
          placeholder="Salary Type"
          onChange={(value, op) => {
            form.setFieldsValue({
              salaryType: op,
              grossAmount: undefined,
              slabCount: undefined,
              payscale: undefined,
              payrollGroup: undefined,
              payscaleClass: undefined,
              payscaleGrade: undefined,
              payscaleJobLevel: undefined,
              basedOn: undefined,
              basicAmount: undefined,
              // employee: undefined,
            });
            setRowDto([]);
          }}
          rules={[{ required: true, message: "Salary Type is required" }]}
        />
      </Col>
      <Form.Item shouldUpdate noStyle>
        {() => {
          const { salaryType } = form.getFieldsValue(true);
          return salaryType?.value === "Grade" ? (
            <>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={payscaleApi?.data || []}
                  name="payscale"
                  label="Payscale"
                  disabled={(location?.state as any)?.viewOnly}
                  placeholder="Payscale"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      payscale: op,
                      slabCount: undefined,
                      // payscaleClass: (op as any)?.jobClass,
                      // payscaleGrade: (op as any)?.jobGrade,
                      // payscaleJobLevel: (op as any)?.jobLevel,
                    });
                    getPayscaleById(value, op);
                  }}
                  rules={[
                    {
                      required: salaryType?.value === "Grade",
                      message: "Payscale is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[]}
                  disabled={true}
                  name="payscaleClass"
                  label="Payscale Class"
                  placeholder="Payscale Class"
                  // onChange={(value, op) => {}}
                  // rules={[
                  //   {
                  //     required: salaryType?.value === "Grade",
                  //     message: "Payscale is required",
                  //   },
                  // ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[]}
                  name="payscaleGrade"
                  label="Payscale Grade"
                  disabled={true}
                  placeholder="Payscale Grade"
                  // onChange={(value, op) => {

                  // }}
                  // rules={[
                  //   {
                  //     required: salaryType?.value === "Grade",
                  //     message: "Payscale is required",
                  //   },
                  // ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[]}
                  name="payscaleJobLevel"
                  disabled={true}
                  label="Payscale Job Level"
                  placeholder="Payscale Job Level"
                  // onChange={(value, op) => {

                  // }}
                  // rules={[
                  //   {
                  //     required: salaryType?.value === "Grade",
                  //     message: "Payscale is required",
                  //   },
                  // ]}
                />
              </Col>
            </>
          ) : (
            <>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={payrollGroupDDL?.data || []}
                  name="payrollGroup"
                  // disabled={true}
                  disabled={(location?.state as any)?.viewOnly}
                  label="Payroll Group"
                  placeholder="Payroll Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      payrollGroup: op,
                      grossAmount: undefined,
                      basicAmount: undefined,
                      basedOn:
                        (op as any)?.strDependOn?.toLowerCase() === "basic"
                          ? { value: 2, label: "Basic" }
                          : { value: 1, label: "Gross" },
                    });
                    getBreakDownPolicyElements();
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Payroll Group is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[
                    { value: 1, label: "Gross" },
                    { value: 2, label: "Basic" },
                  ]}
                  name="basedOn"
                  label="Based On"
                  disabled={true}
                  placeholder="Based On"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      basedOn: op,
                      basicAmount: undefined,
                      grossAmount: undefined,
                    });
                  }}
                  rules={[{ required: true, message: "Based On is required" }]}
                />
              </Col>
              {/* <Col md={6} sm={12} xs={24}>
            <PSelect
              options={[
                { value: 1, label: "Gross" },
                { value: 2, label: "Basic" },
                { value: 3, label: "Amount" },
              ]}
              name="basedOn"
              label="Depend On"
              placeholder="Depend On"
              onChange={(value, op) => {
                form.setFieldsValue({
                  basedOn: op,
                  basicAmount: undefined,
                  grossAmount: undefined,
                  numIncrementPercentageOrAmount: undefined,
                });
                // getBreakDownPolicyElements();
              }}
              rules={[
                { required: true, message: "Depend is required" },
              ]}
            />
          </Col> */}
              {/* <Col md={6} sm={12} xs={24}>
            <PInput
              type="number"
              name="numIncrementPercentageOrAmount"
              label={
                basedOn?.label === "Amount"
                  ? "Increment Amount"
                  : "Increment percentage (%)"
              }
              placeholder=""
              min={0}
              rules={[
                {
                  required:
                    salaryType?.value !== "Grade" ? true : false,
                  message: "required",
                },
              ]}
            />
          </Col> */}
            </>
          );
        }}
      </Form.Item>
      <Col md={6} sm={12} xs={24}>
        <PInput
          type="date"
          name="dteEffectiveDate"
          label="Effective Date"
          disabled={(location?.state as any)?.viewOnly}
          placeholder="Effective Date"
          rules={[
            {
              required: true,
              message: "Effective Date is required",
            },
          ]}
        />
      </Col>
      {/* 🔥🔥 Hidded the checkbox only If the check box is enabled the complete functionality of promote will work. this part is been hidden according to the instruction from avishek voumik vai. 🔥🔥 */}

      {/* promotion part */}
      {/* <Divider
    style={{
      marginBlock: "4px",
      marginTop: "6px",
      fontSize: "14px",
      fontWeight: 600,
    }}
    orientation="left"
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <PInput
        type="checkbox"
        layout="horizontal"
        name="isPromote"
        onChange={() => {}}
      />
      <span>Promote?</span>
    </div>
  </Divider> */}
      {/* <Form.Item shouldUpdate noStyle>
    {() => {
      const { isPromote, employee, isRoleExtension, orgName, orgType } =
        form.getFieldsValue(true);

      return isPromote ? (
        <>
          {employee?.value && (
            <Col md={24}>
              <h3
                style={{
                  color: " gray700 !important",
                  fontSize: "16px",
                  lineHeight: "20px",
                  fontWeight: "500",
                }}
              >
                Employee current information
              </h3>
            </Col>
          )}
          {employee?.value && (
            <Col md={24}>
              <Accordion empBasic={empBasic} />
            </Col>
          )}
          <Col md={24} className="my-3">
            <h3
              style={{
                color: " gray700 !important",
                fontSize: "16px",
                lineHeight: "20px",
                fontWeight: "500",
              }}
            >
              Select the employee encouraging type and effective date
            </h3>
          </Col>
          <Col md={6}>
            <PSelect
              options={[
                // { value: "Transfer", label: "Transfer" },
                { value: "Promotion", label: "Promotion" },
                // {
                //   value: "Transfer & Promotion",
                //   label: "Transfer & Promotion",
                // },
              ]}
              name="transferNPromotionType"
              label="Select Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  transferNPromotionType: op,
                });
              }}
              rules={[
                { required: isPromote, message: "Type is required" },
              ]}
            />
          </Col>
          <Col md={6}>
            <PInput
              type="date"
              name="effectiveDate"
              label="Effective Date"
              placeholder="Effective Date"
              rules={[
                {
                  required: true,
                  message: "Effective Date is required",
                },
              ]}
            />
          </Col>
          <Col md={24} className="my-3">
            <h3
              style={{
                color: " gray700 !important",
                fontSize: "16px",
                lineHeight: "20px",
                fontWeight: "500",
              }}
            >
              Employee administrative information
            </h3>
          </Col>
          <Col md={6}>
            <PSelect
              options={buApi?.data || []}
              name="businessUnit"
              label="Business Unit"
              onChange={(value, op) => {
                form.setFieldsValue({
                  businessUnit: op,
                });
                getworkplaceGroup();
                getUserRole();
              }}
              rules={[
                {
                  required: isPromote,
                  message: "Business Unit is required",
                },
              ]}
            />
          </Col>
          <Col md={6}>
            <PSelect
              options={workplaceGroupApi?.data || []}
              name="workplaceGroup"
              label="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                });
                getworkplace();
              }}
              rules={[
                {
                  required: isPromote,
                  message: "Workplace Group is required",
                },
              ]}
            />
          </Col>
          <Col md={6}>
            <PSelect
              options={workplaceApi?.data || []}
              name="workplace"
              label="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplace: op,
                });
                getDepartment();
                getDesignation();
              }}
              rules={[
                {
                  required: isPromote,
                  message: "Workplace is required",
                },
              ]}
            />
          </Col>
          <Col md={6}>
            <PSelect
              options={departmentApi?.data || []}
              name="department"
              label="Department"
              onChange={(value, op) => {
                form.setFieldsValue({
                  department: op,
                });
              }}
              rules={[
                {
                  required: isPromote,
                  message: "Department is required",
                },
              ]}
            />
          </Col>
          <Col md={6}>
            <PSelect
              options={designationApi?.data || []}
              name="designation"
              label="Designation"
              onChange={(value, op) => {
                form.setFieldsValue({
                  designation: op,
                });
              }}
              rules={[
                {
                  required: isPromote,
                  message: "Designation is required",
                },
              ]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PSelect
              options={supervisorDDL?.data || []}
              name="supervisor"
              label="Supervisor"
              placeholder="Search (min 3 letter)"
              // disabled={!workplaceGroup?.value}
              onChange={(value, op) => {
                form.setFieldsValue({
                  supervisor: op,
                });
              }}
              showSearch
              filterOption={false}
              // notFoundContent={null}
              loading={supervisorDDL?.loading}
              onSearch={(value) => {
                getSupervisor(value);
              }}
              rules={[
                {
                  required: true,
                  message: "Supervisor is required",
                },
              ]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PSelect
              options={supervisorDDL?.data || []}
              name="lineManager"
              label="Line Manager"
              placeholder="Search (min 3 letter)"
              // disabled={!workplaceGroup?.value}
              onChange={(value, op) => {
                form.setFieldsValue({
                  lineManager: op,
                });
              }}
              showSearch
              filterOption={false}
              // notFoundContent={null}
              loading={supervisorDDL?.loading}
              onSearch={(value) => {
                getSupervisor(value);
              }}
              rules={[
                {
                  required: true,
                  message: "Line Manager is required",
                },
              ]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PSelect
              allowClear
              mode="multiple"
              options={userRoleApi?.data || []}
              name="role"
              label="Role"
              placeholder="Search (min 3 letter)"
              // disabled={!workplaceGroup?.value}
              onChange={(value, op) => {
                form.setFieldsValue({
                  role: op,
                });
              }}
              loading={userRoleApi?.loading}
              rules={[
                {
                  required: true,
                  message: "Role is required",
                },
              ]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              type="text"
              placeholder="Remarks"
              label="Remarks"
              name="remarks"
            />
          </Col>
          <Col md={6} sm={24} className="mt-2">
            <div className="input-main position-group-select">
              {fileId ? (
                <>
                  <label className="lebel-bold mr-2">Attachment</label>
                  <VisibilityOutlined
                    sx={{
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      dispatch(
                        getDownlloadFileView_Action(
                          id && !fileId?.globalFileUrlId
                            ? (location.state as any)?.singleData
                                ?.transferPromotionObj?.intAttachementId
                            : fileId?.globalFileUrlId
                        )
                      );
                    }}
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <div
              className={fileId ? " mt-0 " : "mt-3"}
              onClick={onButtonClick}
              style={{ cursor: "pointer" }}
              // style={{ cursor: "pointer", position: "relative" }}
            >
              <input
                onChange={(e) => {
                  if (e.target.files?.[0] && employee?.value) {
                    attachment_action(
                      orgId,
                      "TransferNPromotion",
                      31,
                      buId,
                      employee?.value,
                      e.target.files,
                      setLoading
                    )
                      .then((data) => {
                        setFileId(data?.[0]);
                      })
                      .catch((error) => {
                        setFileId("");
                      });
                  }
                }}
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
              />
              <div style={{ fontSize: "14px" }}>
                {!fileId ? (
                  <>
                    <FileUpload
                      sx={{
                        marginRight: "5px",
                        fontSize: "18px",
                      }}
                    />{" "}
                    Click to upload
                  </>
                ) : (
                  ""
                )}
              </div>
              {fileId ? (
                <div className="d-flex align-items-center">
                  <AttachmentOutlined
                    sx={{
                      marginRight: "5px",
                      color: "#0072E5",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#0072E5",
                      cursor: "pointer",
                    }}
                  >
                    {fileId?.fileName || "Attachment"}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </Col>
          <Divider
            style={{
              marginBlock: "4px",
              marginTop: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
            orientation="left"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <PInput
                type="checkbox"
                layout="horizontal"
                name="isRoleExtension"
                onChange={() => {}}
              />
              <span>
                {" "}
                Is this employee applicable for role extension?
              </span>
            </div>
          </Divider>
          {isRoleExtension && (
            <Col md={6} sm={24} className="mt-2">
              <PSelect
                options={organizationTypeList}
                name="orgType"
                label="Organization Type"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    orgType: op,
                  });
                  // console.log({ op });
                  setOrganizationDDLFunc(
                    orgId,
                    wgId,
                    buId,
                    employeeId,
                    op,
                    setOrganizationDDL
                  );
                }}
                // rules={[
                //   {
                //     required: isPromote,
                //     message: "Organization Type is required",
                //   },
                // ]}
              />
            </Col>
          )}
          {isRoleExtension && (
            <Col md={6} sm={24} className="mt-2">
              <PSelect
                options={organizationDDL || []}
                name="orgName"
                label="Organization Name"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    orgName: op,
                  });
                }}
                // rules={[
                //   {
                //     required: isPromote,
                //     message: "Organization Type is required",
                //   },
                // ]}
              />
            </Col>
          )}
          {isRoleExtension && (
            <Col md={6} sm={24} className="mt-4 pt-1">
              <PButton
                type="primary"
                action="button"
                content="View"
                onClick={() => {
                  const roleExist = transferRowDto?.some(
                    (item) =>
                      item?.intOrganizationTypeId === orgType?.value &&
                      item?.intOrganizationReffId === orgName?.value
                  );

                  if (roleExist)
                    return toast.warn("Already extis this role");
                  onRoleAdd(form.getFieldsValue(true));

                  form.setFieldsValue({
                    orgType: undefined,
                    orgName: undefined,
                  });
                }}
              />
            </Col>
          )}
          {isRoleExtension && (
            <Divider
              style={{
                marginBlock: "4px",
                marginTop: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}
              orientation="left"
            >
              Role Extension List
            </Divider>
          )}
          {isRoleExtension && transferRowDto?.length > 0 ? (
            <Col md={12} sm={24} className="mt-2">
              <DataTable
                header={transferheader}
                bordered
                data={transferRowDto || []}
              />
            </Col>
          ) : null}

          <Divider
            style={{
              marginBlock: "4px",
              marginTop: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
            orientation="left"
          >
            History of transfers and promotions
          </Divider>
          {historyData.length > 0 ? (
            <Col md={24} sm={24} className="mt-2">
              <HistoryTransferTable historyData={historyData} />
            </Col>
          ) : (
            <NoResult
              title={"No Transfer And Promotion History Found"}
            />
          )}
        </>
      ) : undefined;
    }}
  </Form.Item> */}
    </Row>
  );
};
