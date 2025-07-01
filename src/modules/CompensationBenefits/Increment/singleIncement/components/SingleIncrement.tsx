import {
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getEmployeeProfileViewData } from "modules/employeeProfile/employeeFeature/helper";
import moment from "moment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Loading from "common/loading/Loading";
import { Alert } from "@mui/material";
import { roundToDecimals } from "modules/CompensationBenefits/employeeSalary/salaryAssign/salaryAssignCal";
import { GeneralInfo } from "./GeneralInfo";
import { LetterContainer } from "./LetterContainer";

type TIncrement = unknown;
const SingleIncrement: React.FC<TIncrement> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId, buName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // const regex = /^[0-9]*\.?[0-9]*$/;

  const location = useLocation();
  const { id }: any = useParams();
  const history = useHistory();
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // States
  const [, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState<any[]>([]);

  const [slabDDL, setSlabDDL] = useState<any[]>([]);
  const [empBasic, setEmpBasic] = useState([]);
  const [oldAmount, setOldAmount] = useState<number>(0);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const createIncrement = useApiRequest([]);
  const payscaleApi = useApiRequest([]);
  const breakDownPolicyApi = useApiRequest([]);
  const employeeInfo = useApiRequest([]);
  const getById = useApiRequest({});
  const assignBreakdownApi = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);
  const employeeDDLApi = useApiRequest([]);
  const employeeIncrementByIdApi = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Single Increment";
  }, []);

  const getAssignedBreakdown = () => {
    const { employee } = form?.getFieldsValue(true);
    assignBreakdownApi?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId:
          employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
        IntEmployeeId:
          employee?.value ||
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,
        IntWorkplaceId: wId || 0,
      },
      onSuccess: (res) => {
        const modify = res?.map((i: any) => {
          return {
            ...i,
            // strBasedOn: i?.isBasicSalary ? "Amount" : "Percentage",
            strPayrollElementName: i?.strSalaryElement,
            strSalaryBreakdownTitle: i?.strSalaryBreakdownHeaderTitle,
            intSalaryBreakdownHeaderId: i?.intSalaryBreakdownHeaderId,
            intSalaryBreakdownRowId: i?.intSalaryBreakdownRowId,
            intPayrollElementTypeId: i?.intSalaryElementId,
            basedOn: i?.strBasedOn,
          };
        });
        // form.setFieldsValue({
        //   grossAmount: res[0]?.numNetGrossSalary,
        // });
        if (employeeInfo?.data[0]?.isGradeBasedSalary) {
          const modifyforGrade = [...modify];
          // modifyforGrade[0].strBasedOn = "Amount";
          setRowDto(modifyforGrade);
        } else {
          setRowDto(modify);
          // default_gross_calculation();
        }
      },
    });
  };
  const getEmployeeInfo = () => {
    const { employee } = form?.getFieldsValue(true);

    employeeInfo?.action({
      urlKey: "EmployeeSalaryManagement",
      method: "post",
      payload: {
        partType: "EmployeeSalaryInfoByEmployeeId",
        departmentId: 0,
        designationId: 0,
        supervisorId: 0,
        strStatus: "Assigned",
        employeeId:
          employee?.value ||
          (location?.state as any)?.singleData?.incrementList?.[0]
            ?.intEmployeeId,

        accountId: orgId,
        businessUnitId: buId,
        WorkplaceGroupId: wgId,
        workplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        form.setFieldsValue({
          salaryType: {
            label: res[0]?.isGradeBasedSalary ? "Grade" : "Non-Grade",
            value: res[0]?.isGradeBasedSalary ? "Grade" : "Non-Grade",
          },
        });
      },
    });
  };

  const getBreakDownPolicyElements = () => {
    const { payrollGroup } = form.getFieldsValue(true);
    breakDownPolicyApi?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN ELEMENT BY ID",

        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: payrollGroup?.value,
        IntWorkplaceId: 0,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].numAmount = roundToDecimals(item?.numAmount || 0);
        });
        setRowDto(res);
      },
    });
  };

  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  const submitHandler = async () => {
    const values = form.getFieldsValue(true);
    if (!values?.grossAmount) {
      return toast.warn("Gross Amount is required ");
    }
    if (
      values?.salaryType?.value !== "Grade" &&
      !values?.basicAmount &&
      (values?.basedOn?.value === 2 || values?.basedOn === 2)
    ) {
      return toast.warn("Basic Amount is required ");
    }
    if (
      employeeIncrementByIdApi?.data?.oldGrossAmount > +values?.grossAmount ||
      employeeInfo?.data[0]?.numNetGrossSalary > +values?.grossAmount
    ) {
      return toast.warn("Amount should be greater than previous amount");
    }

    const elementSum = rowDto?.reduce((acc, i) => acc + i?.numAmount, 0);

    if (Math.round(elementSum) !== values?.grossAmount) {
      return toast.warn(
        "Breakdonwn Elements Net Amount Must Be Equal To Gross Amount!!!"
      );
    }
    if (
      values?.basedOn?.value === 2 &&
      (employeeIncrementByIdApi?.data?.oldGrossAmount >
        Math.round(values?.grossAmount) ||
        employeeInfo?.data[0]?.numNetGrossSalary >
          Math.round(values?.grossAmount))
    ) {
      return toast.warn(
        "Net Amount Must Be Greater than Previous Gross Amount!!!"
      );
    }

    const modifiedBreakDown = rowDto?.map((i) => {
      return {
        dependsOn: i?.strBasedOn,
        payrollElementId: i?.intPayrollElementTypeId,
        amount: roundToDecimals(i?.numAmount || 0),
        numberOfPercent: i?.strBasedOn === "Amount" ? 0 : i?.numNumberOfPercent,
      };
    });
    console.log({ values });
    const gradeBasedPayload = {
      id: id || 0,
      payScaleName:
        values?.salaryType?.value === "Grade" ? values?.payscale?.label : "",
      salaryBreakDownHeaderId:
        values?.salaryType?.value !== "Grade" ? values?.payrollGroup?.value : 0,
      salaryBreakDownHeaderTitle:
        values?.salaryType?.value !== "Grade"
          ? values?.payrollGroup?.label
          : "",
      newGrossAmount: values?.grossAmount,

      employeeId: values?.employee?.value,
      accountId: orgId,
      businessUnitId: buId,
      isGradeBasedSalary: values?.salaryType?.value === "Grade" ? true : false,
      payScaleId: values?.payscale?.value || values?.payscale,
      slabCount:
        values?.slabCount?.value === 0
          ? 0
          : values?.slabCount?.value || values?.slabCount || 0,
      oldGrossAmount:
        Math.round(employeeIncrementByIdApi?.data?.oldGrossAmount) ||
        employeeInfo?.data[0]?.numNetGrossSalary ||
        0,
      incrementDependOn:
        values?.salaryType?.value !== "Grade" ? values?.basedOn?.label : "",
      incrementDependOnValue:
        values?.salaryType?.value !== "Grade"
          ? values?.basedOn?.value === 2
            ? values?.basicAmount
            : values?.grossAmount
          : 0,
      incrementPercentage: 0,
      incrementAmount:
        Math.round(values?.grossAmount) -
        (Math.round(employeeIncrementByIdApi?.data?.oldGrossAmount) ||
          Math.round(employeeInfo?.data[0]?.numNetGrossSalary)),
      workPlaceId: wId,
      workPlaceGroupId: wgId,
      effectiveDate: moment(values?.dteEffectiveDate).format("YYYY-MM-DD"),
      rows: modifiedBreakDown,
      actionBy: employeeId,
    };
    // if (orgId === 10022) {
    //   IConfirmModal(confirmObject);
    // } else {
    createIncrement.action({
      urlKey: id ? "UpdateEmployeeIncrement" : "CreateEmployeeIncrementNew",
      method: id ? "put" : "post",
      payload: gradeBasedPayload,
      toast: true,
      onSuccess: () => {
        history.push(`/compensationAndBenefits/increment`);
      },
    });
  };

  // elements calculations
  const updateRowDtoHandler = (e: number, row: any, index: number): any => {
    const { grossAmount, salaryType, basedOn, slabCount } =
      form.getFieldsValue(true);
    const temp = [...rowDto];

    // Check for invalid input values
    if (e < 0) {
      return toast.warn(`${row?.strPayrollElementName} can't be negative`);
    }
    if (
      salaryType?.value !== "Grade" &&
      basedOn?.value === 1 &&
      e > grossAmount
    ) {
      return toast.warn(
        `${row?.strPayrollElementName} can't be greater than gross`
      );
    }

    // Update the selected index with the new amount
    // console.log({ temp }, { basedOn }, temp[index], temp[index].isBasicSalary);
    if (
      temp[index]?.basedOn === "Amount" ||
      temp[index]?.strBasedOn === "Amount"
    ) {
      temp[index].numAmount = roundToDecimals(e || 0);
    } else {
      temp[index].numAmount = e + e * (slabCount || 0);
    }
    if (temp[index].isBasicSalary) {
      temp[index].baseAmount = e;
    }
    setRowDto((prev) => {
      prev = temp;
      return prev;
    });

    if (basedOn?.value === 2 || salaryType?.value === "Grade") {
      basic_or_grade_calculation();
    }
    if (basedOn?.value === 1 && salaryType?.value !== "Grade") {
      new_gross_calculation();
    }
  };
  const resolveCalculativeFormulas = (
    data: any[],
    grossAmount = 0,
    maxTries = 10
  ) => {
    let result = [...data];
    let labelToAmountMap: Record<string, number> = {};

    // Step 1: Add non-calculative to map
    result.forEach((item) => {
      if (item.strBasedOn !== "Calculative") {
        labelToAmountMap[item.strPayrollElementName.trim()] =
          item.numAmount || 0;
      }
    });

    labelToAmountMap["Gross"] = grossAmount;

    let pass = 0;

    while (pass < maxTries) {
      let updated = false;

      result = result.map((item) => {
        if (item.strBasedOn === "Calculative") {
          let formula = item.strFormula || item.formula || "";

          // Replace all #Label# with actual values
          for (const label in labelToAmountMap) {
            const regex = new RegExp(`#${label.trim()}#`, "g");
            formula = formula.replace(regex, `(${labelToAmountMap[label]})`);
          }

          // Replace % N → * (N / 100)
          formula = formula.replace(/% *(\d+(\.\d+)?)/g, "* ($1 / 100)");

          try {
            if (formula.match(/#\w+#/)) throw new Error("Unresolved label");

            const evaluated = eval(formula);
            const amount = roundToDecimals(
              Number.isFinite(evaluated) ? evaluated : 0
            );

            labelToAmountMap[item.strPayrollElementName.trim()] = amount;

            updated = true;
            return {
              ...item,
              numAmount: amount,
              amount: amount,
            };
          } catch {
            return item; // Retry next pass
          }
        }

        return item;
      });

      if (!updated) break;
      pass++;
    }

    return result;
  };
  const basic_or_grade_calculation = () => {
    let basicAmount = 0;
    const modified_data = [];
    const values = form.getFieldsValue(true);
    // const { basicAmount } = form.getFieldsValue(true);
    if (values?.salaryType?.value === "Grade") {
      basicAmount = rowDto[0]?.numAmount;
      // basicAmount = rowDto[0]?.numAmount;
    } else {
      basicAmount = values?.basicAmount || 0;
    }
    for (const item of rowDto) {
      let amount;

      if (item?.isBasicSalary) {
        amount = basicAmount; // Use the basic salary directly
        item.numAmount = basicAmount;
        item.baseAmount =
          // item?.baseAmount ||
          values?.basedOn?.value !== 2
            ? item?.baseAmount || getById?.data?.payScaleElements[0]?.netAmount
            : values?.basicAmount;
      } else if (
        item.strBasedOn === "Percentage" ||
        item.strBasedOn === "Percent"
      ) {
        amount =
          roundToDecimals((item.numNumberOfPercent * basicAmount) / 100) || 0; // Calculate based on percentage of basic salary
        item.numAmount =
          roundToDecimals((item.numNumberOfPercent * basicAmount) / 100) || 0; // Calculate based on percentage of basic salary
      } else {
        amount = roundToDecimals(item.numAmount) || 0; // Use the fixed amount if based on fixed amount
      }

      modified_data.push({
        ...item,
        amount: roundToDecimals(amount) || 0, // Round to nearest integer
      });
    }

    let total_gross_amount = calculateGross(modified_data);

    const final_data = resolveCalculativeFormulas(
      modified_data,
      total_gross_amount
    );
    total_gross_amount = calculateGross(final_data);

    setRowDto(final_data);
  };
  const new_gross_calculation = () => {
    const { grossAmount } = form.getFieldsValue(true);
    const modify = rowDto.map((item) => {
      if (item.strBasedOn === "Percentage") {
        return {
          ...item,
          numAmount: roundToDecimals(
            (grossAmount * item.numNumberOfPercent) / 100
          ),
        };
      }
      return item; // Leave as-is if based on "Amount"
    });
    const final_data = resolveCalculativeFormulas(modify, grossAmount);
    setRowDto(final_data);
  };
  const calculateGross = (data: any[]) => {
    const total_gross_amount = data.reduce(
      (total, item) => total + item.amount,
      0
    );
    form.setFieldsValue({
      grossAmount: total_gross_amount,
    });
    return total_gross_amount;
  };
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      // fixed: "left",
    },
    {
      title: "Payroll Element",
      dataIndex: "strPayrollElementName",
    },
    {
      title: "Based On",
      dataIndex: "strBasedOn",
    },
    {
      title: "Amount/Percentage",
      render: (value: any, row: any) => (
        <>
          {row?.strBasedOn === "Amount"
            ? row?.numAmount
            : row?.strBasedOn === "Calculative"
            ? row?.formula || row?.strFormula
            : row?.numNumberOfPercent}
        </>
      ),
    },
    {
      title: "Net Amount",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            // name={`numAmount_${index}`}
            value={row?.numAmount}
            placeholder="Amount"
            onChange={(e: any) => {
              if (isNaN(e)) {
                return toast.warn("Only numeric value allowed");
              }
              const values = form.getFieldsValue(true);
              if (
                values?.salaryType?.value !== "Grade" &&
                row?.strDependOn !== "Gross" &&
                index === 0
              ) {
                form.setFieldsValue({
                  basicAmount: +e,
                });
              }
              // if (values?.salaryType?.value == "Grade") {
              //   form.setFieldsValue({
              //     slabCount: 0,
              //   });
              //   if (index !== 0) {
              //     rowDto[0].numAmount =
              //       getById?.data?.payScaleElements[0]?.netAmount;
              //     rowDto[0].baseAmount =
              //       getById?.data?.payScaleElements[0]?.netAmount;
              //   }
              // }
              updateRowDtoHandler(+e, row, index);
            }}
            disabled={
              (location?.state as any)?.viewOnly ||
              row?.strBasedOn !== "Amount" ||
              (row?.strDependOn !== "Gross" && row?.isBasicSalary)
            }
          />
        </>
      ),
    },
  ];

  // for assigned
  const getAssignedPayscaleInfo = (res: any) => {
    getById?.action({
      urlKey: "GetPayScaleSetupById",
      method: "get",
      params: {
        id: res?.payScaleId,
      },

      onSuccess: (data: any) => {
        form.setFieldsValue({
          salaryType: { value: "Grade", label: "Grade" },
          payscale: { value: res?.payScaleId, label: data?.payScaleName },
          payscaleJobLevel: {
            value: data?.jobLevelId,
            label: data?.jobLevelName,
          },
          payscaleGrade: {
            value: data?.jobGradeId,
            label: data?.jobGradeName,
          },
          payscaleClass: {
            value: data?.jobClassId,
            label: data?.jobClassName,
          },
          slabCount: {
            value: res?.slabCount,
            label: `${
              res?.slabCount > data?.incrementSlabCount ? "Efficiency" : "Slab"
            } ${res?.slabCount}`,
          },
        });
        let temp = [];
        for (let i = res?.slabCount; i <= data?.incrementSlabCount; i++) {
          temp.push({
            value: i,
            label: `Slab ${i}`,
          });
        }
        for (
          let i = res?.slabCount;
          i <= data?.extendedIncrementSlabCount + data?.incrementSlabCount &&
          data?.extendedIncrementSlabCount !== 0 &&
          res?.slabCount !==
            data?.extendedIncrementSlabCount + data?.incrementSlabCount;
          i++
        ) {
          if (
            data?.incrementSlabCount + (i - res?.slabCount + 1) >
            data?.extendedIncrementSlabCount + data?.incrementSlabCount
          ) {
            break;
          }

          temp.push({
            value: data?.incrementSlabCount + (i - res?.slabCount + 1),
            label: `Efficiency ${
              data?.incrementSlabCount + (i - res?.slabCount + 1)
            }`,
          });
        }
        setSlabDDL(temp);

        // basic_or_grade_calculation();
      },
    });
  };
  useEffect(() => {
    if (id) {
      employeeIncrementByIdApi?.action({
        urlKey: "GetEmployeeIncrementById",
        method: "get",
        params: {
          id: id,
        },
        onSuccess: (res) => {
          setOldAmount(res?.oldGrossAmount);
          const modify = res?.rows?.map((i: any) => {
            return {
              ...i,
              // strBasedOn: i?.isBasicSalary ? "Amount" : "Percentage",
              numAmount: roundToDecimals(i?.amount || 0),
              numNumberOfPercent: i?.numberOfPercent,
              strBasedOn: i?.dependsOn,
              strDependOn: i?.dependsOn,
              strPayrollElementName: i?.payrollElement,
              //   strSalaryBreakdownTitle: i?.strSalaryBreakdownHeaderTitle,
              //   intSalaryBreakdownHeaderId: i?.intSalaryBreakdownHeaderId,
              //   intSalaryBreakdownRowId: i?.intSalaryBreakdownRowId,
              intPayrollElementTypeId: i?.payrollElementId,
              isBasicSalary: i?.isBasic,
            };
          });
          const newGross = res?.rows?.reduce(
            (acc: any, i: any) => acc + i?.amount,
            0
          );
          // console.log(employeeInfo?.data[0], "here");
          form.setFieldsValue({
            grossAmount: Math.round(newGross),
            basicAmount:
              (location?.state as any)?.singleData?.incrementList?.[0]
                ?.strIncrementDependOn === "Basic" &&
              res?.incrementDependOnValue,
            payrollGroup: res?.isGradeBasedSalary
              ? undefined
              : {
                  value: res?.salaryBreakDownHeaderId,
                  label: res?.salaryBreakDownHeaderTitle,
                },
            // basedOn: 1,

            dteEffectiveDate: moment(res?.effectiveDate),
            employee: {
              value: (location?.state as any)?.singleData?.incrementList?.[0]
                ?.intEmployeeId,
              label: (location?.state as any)?.singleData?.incrementList?.[0]
                ?.strEmployeeName,
            },
            salaryType: {
              label: res?.isGradeBasedSalary ? "Grade" : "Non-Grade",
              value: res?.isGradeBasedSalary ? "Grade" : "Non-Grade",
            },
          });

          setRowDto(modify);
          res?.isGradeBasedSalary && getAssignedPayscaleInfo(res);
        },
      });
    }
  }, [location?.state]);

  useEffect(() => {
    if (!id) {
      employeeInfo?.data[0]?.isGradeBasedSalary &&
        getById?.action({
          urlKey: "GetPayScaleSetupById",
          method: "get",
          params: {
            id: employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
          },

          onSuccess: (res: any) => {
            form.setFieldsValue({
              salaryType: { value: "Grade", label: "Grade" },
              payscale: {
                value: employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
                label: employeeInfo?.data[0]?.PayrollGroupName,
              },
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
              slabCount: {
                value: employeeInfo?.data[0]?.intSlabCount,
                label: `${
                  employeeInfo?.data[0]?.intSlabCount > res?.incrementSlabCount
                    ? "Efficiency"
                    : "Slab"
                } ${employeeInfo?.data[0]?.intSlabCount}`,
              },
            });
            let temp = [];
            for (
              let i = employeeInfo?.data[0]?.intSlabCount;
              i <= res?.incrementSlabCount;
              i++
            ) {
              temp.push({
                value: i,
                label: `Slab ${i}`,
              });
            }
            for (
              let i = employeeInfo?.data[0]?.intSlabCount;
              i <= res?.extendedIncrementSlabCount + res?.incrementSlabCount &&
              res?.extendedIncrementSlabCount !== 0 &&
              employeeInfo?.data[0]?.intSlabCount !==
                res?.extendedIncrementSlabCount + res?.incrementSlabCount;
              i++
            ) {
              if (
                res?.incrementSlabCount +
                  (i - employeeInfo?.data[0]?.intSlabCount + 1) >
                res?.extendedIncrementSlabCount + res?.incrementSlabCount
              ) {
                break;
              }

              temp.push({
                value:
                  res?.incrementSlabCount +
                  (i - employeeInfo?.data[0]?.intSlabCount + 1),
                label: `Efficiency ${
                  res?.incrementSlabCount +
                  (i - employeeInfo?.data[0]?.intSlabCount + 1)
                }`,
              });
            }
            setSlabDDL(temp);

            // basic_or_grade_calculation();
          },
        });
      form.setFieldsValue({
        grossAmount: employeeInfo?.data[0]?.numNetGrossSalary,
      });
      !employeeInfo?.data[0]?.isGradeBasedSalary &&
        form.setFieldsValue({
          grossAmount: employeeInfo?.data[0]?.numNetGrossSalary,
          basicAmount: employeeInfo?.data[0]?.numBasicORGross,
          payrollGroup: employeeInfo?.data[0]?.isGradeBasedSalary
            ? undefined
            : {
                value: employeeInfo?.data[0]?.intSalaryBreakdownHeaderId,
                label: employeeInfo?.data[0]?.strSalaryBreakdownTitle,
              },
          basedOn:
            employeeInfo?.data[0]?.strDependOn?.toLowerCase() === "basic"
              ? { value: 2, label: "Basic" }
              : { value: 1, label: "Gross" },

          salaryType: employeeInfo?.data[0]?.isGradeBasedSalary
            ? "Grade"
            : "Non-Grade",
          // slabCount: {
          //   value: employeeInfo?.data[0]?.intSlabCount,
          //   label: employeeInfo?.data[0]?.intSlabCount,
          // },
        });
      getAssignedBreakdown();
    }
  }, [employeeInfo?.data[0]]);

  return employeeFeature?.isView ? (
    <PForm
      form={form}
      initialValues={{
        transferType: "Cash",
      }}
      onFinish={submitHandler}
    >
      {(employeeIncrementByIdApi?.loading ||
        // isPromotionEligibleCheckApi?.loading ||
        employeeDDLApi?.loading ||
        payrollGroupDDL?.loading ||
        assignBreakdownApi?.loading ||
        getById?.loading ||
        employeeInfo?.loading ||
        payscaleApi?.loading ||
        createIncrement?.loading) && <Loading />}
      <PCard>
        <PCardHeader
          backButton
          title={`${
            (location?.state as any)?.viewOnly ? "View" : id ? "Edit" : "Create"
          } Increment`}
          submitText={
            (location?.state as any)?.viewOnly
              ? undefined
              : `${id ? "Update" : "Save"}`
          }
        ></PCardHeader>

        <GeneralInfo
          form={form}
          employeeDDLApi={employeeDDLApi}
          id={id}
          payscaleApi={payscaleApi}
          payrollGroupDDL={payrollGroupDDL}
          buId={buId}
          wgId={wgId}
          wId={wId}
          employeeId={employeeId}
          setRowDto={setRowDto}
          getEmployeeInfo={getEmployeeInfo}
          getEmployeeProfileViewData={getEmployeeProfileViewData}
          setLoading={setLoading}
          setEmpBasic={setEmpBasic}
          empBasic={empBasic}
          location={location}
          orgId={orgId}
          getBreakDownPolicyElements={getBreakDownPolicyElements}
          setSlabDDL={setSlabDDL}
          getById={getById}
          history={history}
          rowDto={rowDto}
          oldAmount={oldAmount}
        />
        {/* <LetterContainer
          location={location}
          orgId={orgId}
          empBasic={empBasic}
          buName={buName}
          form={form}
          employeeIncrementByIdApi={employeeIncrementByIdApi}
          rowDto={rowDto}
        /> */}
        <Row className="mb-2">
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { basedOn, grossAmount, basicAmount, salaryType } =
                form.getFieldsValue(true);
              if (salaryType?.value !== "Grade" && basedOn?.value === 2) {
                return (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="text"
                      value={basicAmount}
                      disabled={(location?.state as any)?.viewOnly}
                      label={
                        <span>
                          <span className="text-danger ">* </span> Basic{" "}
                        </span>
                      }
                      placeholder="Basic"
                      onChange={(e: any) => {
                        if (isNaN(e?.target?.value)) {
                          return toast.warn("Only numeric value allowed");
                        } else {
                          form.setFieldsValue({
                            basicAmount: +e?.target?.value,
                          });

                          basic_or_grade_calculation();
                        }
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 2 || basedOn === 2,
                          message: "Basic is required",
                        },
                      ]}
                    />
                  </Col>
                );
              } else
                return salaryType?.value !== "Grade" ? (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="text"
                      // name="grossAmount"
                      value={grossAmount}
                      disabled={(location?.state as any)?.viewOnly}
                      label={
                        <span>
                          <span className="text-danger ">* </span> Gross{" "}
                        </span>
                      }
                      placeholder="Gross"
                      onChange={(e: any) => {
                        if (isNaN(e?.target?.value)) {
                          return toast.warn("Only numeric value allowed");
                        } else {
                          form.setFieldsValue({
                            grossAmount: +e?.target?.value,
                          });
                          new_gross_calculation();
                        }
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 1 || basedOn === 1,
                          message: "Gross is required",
                        },
                      ]}
                    />
                  </Col>
                ) : salaryType?.value == "Grade" ? (
                  <Col md={6} sm={12} xs={24}>
                    <PSelect
                      options={slabDDL}
                      name="slabCount"
                      disabled={(location?.state as any)?.viewOnly}
                      label="Slab Count"
                      placeholder="Slab Count"
                      onChange={(value, op) => {
                        let temp = [...rowDto];
                        const efficiency =
                          value > getById?.data?.incrementSlabCount
                            ? value - getById?.data?.incrementSlabCount
                            : 0;
                        const actualSlab = value - efficiency;
                        // console.log({ actualSlab, efficiency });
                        temp[0].numAmount =
                          getById?.data?.payScaleElements[0]?.netAmount +
                          actualSlab * getById?.data?.incrementAmount +
                          efficiency * getById?.data?.extendedIncrementAmount;

                        setRowDto((prev) => {
                          prev = temp;
                          return prev;
                        });
                        basic_or_grade_calculation();
                        form.setFieldsValue({
                          slabCount: value,
                        });
                      }}
                      rules={[
                        {
                          required: salaryType?.value == "Grade",
                          message: "Slab Count is required",
                        },
                      ]}
                    />
                  </Col>
                ) : undefined;
            }}
          </Form.Item>
          <Col xs={12}></Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { grossAmount } = form.getFieldsValue(true);

              return (
                <Col md={6} sm={12} xs={24}>
                  <PInput
                    type="number"
                    label="Gross Amount"
                    value={grossAmount}
                    placeholder="GROSS"
                    disabled={true}
                  />
                </Col>
              );
            }}
          </Form.Item>
        </Row>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { grossAmount, salaryType } = form.getFieldsValue(true);
            const elementSum = rowDto?.reduce(
              (acc, i) => acc + i?.numAmount,
              0
            );
            return (
              grossAmount > 0 &&
              salaryType?.label !== "Grade" &&
              Math.round(elementSum) !== grossAmount && (
                <Alert
                  icon={<InfoOutlinedIcon fontSize="inherit" />}
                  severity="warning"
                  style={{
                    height: "84px",
                    margin: "10px 0",
                    top: "1px",
                  }}
                >
                  <div>
                    <div className="mb-3">
                      <h2>
                        Gross Amount and Breakdown Sum Amount Mismatch <br />
                        Adjust By
                        {elementSum > grossAmount ? " Reducing " : " Adding "}
                        Amount{" "}
                        {roundToDecimals(Math.abs(elementSum - grossAmount))}
                      </h2>
                    </div>
                  </div>
                </Alert>
              )
            );
          }}
        </Form.Item>
        {rowDto?.length > 0 ? (
          <DataTable header={header} bordered data={rowDto || []} />
        ) : (
          <NoResult title="No Result Found" para="" />
        )}
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default SingleIncrement;
