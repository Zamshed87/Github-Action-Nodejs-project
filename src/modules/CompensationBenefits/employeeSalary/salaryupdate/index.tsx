import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import profileImg from "../../../../assets/images/profile.jpg";

import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { gray200, gray700, gray900 } from "utility/customColor";
import { APIUrl } from "App";
import { MovingOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";

type TAttendenceAdjust = unknown;
const SalaryV2: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // States
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);
  const [rowDto, setRowDto] = React.useState<any[]>([
    {
      intSalaryBreakdownHeaderId: 28,
      strSalaryBreakdownTitle: "(Gross - Conveyance) / 1.6",
      intPayrollElementTypeId: 233,
      strPayrollElementName: "Basic Salary",
      strBasedOn: "Amount",
      strDependOn: "Basic",
      isBasicSalary: true,
      numNumberOfPercent: 0,
      numAmount: 0,
      intSalaryBreakdownHeaderId1: 28,
      intSalaryBreakdownRowId: 104,
      isCustomPayrollFor10ms: "(Gross - Conveyance) / 1.6",
    },
    {
      intSalaryBreakdownHeaderId: 28,
      strSalaryBreakdownTitle: "(Gross - Conveyance) / 1.6",
      intPayrollElementTypeId: 234,
      strPayrollElementName: "House Rent",
      strBasedOn: "Percentage",
      strDependOn: "Basic",
      isBasicSalary: false,
      numNumberOfPercent: 50,
      numAmount: 0,
      intSalaryBreakdownHeaderId1: 28,
      intSalaryBreakdownRowId: 102,
      isCustomPayrollFor10ms: "(Gross - Conveyance) / 1.6",
    },
    {
      intSalaryBreakdownHeaderId: 28,
      strSalaryBreakdownTitle: "(Gross - Conveyance) / 1.6",
      intPayrollElementTypeId: 235,
      strPayrollElementName: "Medical Allowance",
      strBasedOn: "Percentage",
      strDependOn: "Basic",
      isBasicSalary: false,
      numNumberOfPercent: 10,
      numAmount: 0,
      intSalaryBreakdownHeaderId1: 28,
      intSalaryBreakdownRowId: 103,
      isCustomPayrollFor10ms: "(Gross - Conveyance) / 1.6",
    },
    {
      intSalaryBreakdownHeaderId: 28,
      strSalaryBreakdownTitle: "(Gross - Conveyance) / 1.6",
      intPayrollElementTypeId: 236,
      strPayrollElementName: "Conveyance",
      strBasedOn: "Amount",
      strDependOn: "Basic",
      isBasicSalary: false,
      numNumberOfPercent: 0,
      numAmount: 0,
      intSalaryBreakdownHeaderId1: 28,
      intSalaryBreakdownRowId: 105,
      isCustomPayrollFor10ms: "(Gross - Conveyance) / 1.6",
    },
  ]);
  const [accountsDto, setAccountsDto] = React.useState<any[]>([
    {
      accounts: "Bank Pay (0%)",
      key: "Bank Pay",
      numAmount: 0,
    },
    {
      accounts: "Digital/MFS Pay (0%)",
      key: "Digital/MFS Pay",
      numAmount: 0,
    },
    {
      accounts: "Cash Pay (0%)",
      key: "Cash Pay",

      numAmount: 0,
    },
    // {
    //   accounts: "Others/Additional Amount Transfer Into (0%)",
    //   numAmount: 0,
    //   key: "Others/Additional Amount Transfer Into",
    // },
  ]);
  const [dynamicHeader, setDynamicHeader] = React.useState<any[]>([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const bulkLandingAPI = useApiRequest([]);
  const bankDDL = useApiRequest([]);
  const branchDDL = useApiRequest([]);
  // const employmentTypeDDL = useApiRequest([]);
  // const empDepartmentDDL = useApiRequest([]);
  // const workG = useApiRequest([]);
  // const workP = useApiRequest([]);
  // const positionDDL = useApiRequest([]);
  // const empDesignationDDL = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Salary Assign";
  }, []);

  const getSalaryLanding = () => {
    const {
      payrollGroup,
      designation,
      department,
      employeeType,
      joiningDateTo,
      joiningDateFrom,
      hrPosition,
      wp,
    } = form.getFieldsValue(true);

    bulkLandingAPI?.action({
      urlKey: "BulkSalaryAssignLanding",
      method: "post",
      params: {
        accountId: orgId,
        workplaceId: wp?.value,
        payrollGroupId: payrollGroup?.value,
        empTypeId: employeeType?.value,
        hrPositionId: hrPosition?.value,
        departmentId: department?.value,
        designationId: designation?.value,
        fromDate: joiningDateFrom
          ? moment(joiningDateFrom).format("YYYY-MM-DD")
          : undefined,
        toDate: joiningDateTo
          ? moment(joiningDateTo).format("YYYY-MM-DD")
          : undefined,
      },
      onSuccess: (res) => {
        // console.log({ res });

        setRowDto((prev: any) => {
          return [...prev, ...res?.result];
        });
        const updatedHeader: any[] = [];
        res?.result[0]?.salaryElementsBreakdowns?.forEach((element: any) => {
          updatedHeader.push({
            title: `${element.strPayrollElementName}(${element.numNumberOfPercentage})`,
            dataIndex: element.strPayrollElementName,
          });
        });
        setDynamicHeader(updatedHeader);
      },
    });
  };

  // const getEmploymentType = () => {
  //   const { workplaceGroup, wp } = form.getFieldsValue(true);

  //   employmentTypeDDL?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "EmploymentType",
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: workplaceGroup?.value,
  //       IntWorkplaceId: wp?.value,
  //       intId: 0,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.EmploymentType;
  //         res[i].value = item?.Id;
  //       });
  //     },
  //   });
  // };
  // // workplace wise
  // const getWorkplaceGroup = () => {
  //   workG?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "WorkplaceGroup",
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: wgId, // This should be removed
  //       intId: employeeId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplaceGroup;
  //         res[i].value = item?.intWorkplaceGroupId;
  //       });
  //     },
  //   });
  // };
  // const getWorkplace = () => {
  //   const { workplaceGroup } = form.getFieldsValue(true);
  //   workP?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "Workplace",
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: workplaceGroup?.value,
  //       intId: employeeId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplace;
  //         res[i].value = item?.intWorkplaceId;
  //       });
  //     },
  //   });
  // };
  // const getEmployeDepartment = () => {
  //   const { workplaceGroup, wp } = form.getFieldsValue(true);

  //   empDepartmentDDL?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "EmpDepartment",
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: workplaceGroup?.value,
  //       IntWorkplaceId: wp?.value,
  //       intId: 0,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.DepartmentName;
  //         res[i].value = item?.DepartmentId;
  //       });
  //     },
  //   });
  // };
  // const getEmployeDesignation = () => {
  //   const { workplaceGroup, wp } = form.getFieldsValue(true);

  //   empDesignationDDL?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "EmpDesignation",
  //       AccountId: orgId,
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: workplaceGroup?.value,
  //       IntWorkplaceId: wp?.value,
  //       intId: 0,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.DesignationName;
  //         res[i].value = item?.DesignationId;
  //       });
  //     },
  //   });
  // };
  // const getEmployeePosition = () => {
  //   const { workplaceGroup, wp } = form.getFieldsValue(true);

  //   positionDDL?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "Position",
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: workplaceGroup?.value,
  //       IntWorkplaceId: wp?.value,
  //       intId: 0,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.PositionName;
  //         res[i].value = item?.PositionId;
  //       });
  //     },
  //   });
  // };
  //   export const getBreakdownPolicyDDL = async (

  const getPayrollGroupDDL = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

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
        IntWorkplaceId: wp?.value,
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
  const viewHandler = async () => {
    setRowDto((prev: any) => {
      prev = [];
      return prev;
    });
    await form
      .validateFields()
      .then(() => {
        getSalaryLanding();
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  const submitHandler = async () => {
    await form
      .validateFields()
      .then(() => {
        console.log("first");
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };
  const calculateDynamicFields = (row: any) => {
    const dynamicFields = {} as any;

    // Add your logic here based on TGS
    // Example: Calculate each dynamic field based on TGS
    row.salaryElementsBreakdowns?.forEach((element: any) => {
      dynamicFields[element.strPayrollElementName] = (
        row.TGS *
        (element.numNumberOfPercentage / 100)
      ).toFixed(2);
    });
    // console.log({ dynamicFields });

    return dynamicFields;
  };
  // Table Header
  const handleIsPerDayChange = (
    value: number,
    rowIndex: number,
    property: string
  ) => {
    if (property === "TGS") {
      setRowDto((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex][property] = value;

        const data = calculateDynamicFields(updatedRows[rowIndex]);
        const newOB = { ...updatedRows[rowIndex], ...data };
        updatedRows[rowIndex] = newOB;
        return updatedRows;
      });
    } else {
      setRowDto((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex][property] = value;

        return updatedRows;
      });
    }
  };

  // accounts calculations
  const updateDtoHandler = (e: number, row: any, index: number): any => {
    const { grossAmount } = form.getFieldsValue(true);
    let temp = [...accountsDto];

    // Check for invalid input values
    if (e < 0) {
      return toast.warn(`${row?.key} can't be negative`);
    }
    if (e > grossAmount) {
      return toast.warn(`${row?.key} can't be greater than gross`);
    }

    // Update the selected index with the new amount
    temp[index].numAmount = e;
    temp[index].accounts = `${temp[index].key} (${(
      (e * 100) /
      grossAmount
    ).toFixed(6)}%)`;

    // Calculate the remaining amount to be distributed between the other two indexes
    const remainingAmount = grossAmount - e;
    const [index1, index2] = [0, 1, 2].filter((i) => i !== index); // get the other two indexes

    // Distribute remaining amount between the other two indexes
    if (temp[index1].numAmount > remainingAmount) {
      temp[index1].numAmount = remainingAmount;
      temp[index2].numAmount = 0;
    } else if (temp[index2].numAmount > remainingAmount) {
      temp[index2].numAmount = remainingAmount;
      temp[index1].numAmount = 0;
    } else {
      temp[index2].numAmount = remainingAmount - temp[index1].numAmount;
    }

    // Update accounts percentage for all indexes
    temp[index1].accounts = `${temp[index1].key} (${(
      (temp[index1].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;
    temp[index2].accounts = `${temp[index2].key} (${(
      (temp[index2].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;
    temp[index].accounts = `${temp[index].key} (${(
      (temp[index].numAmount * 100) /
      grossAmount
    ).toFixed(6)}%)`;

    // Check for any negative values after adjustments
    if (temp[index1].numAmount < 0 || temp[index2].numAmount < 0) {
      return toast.warn(`Amounts can't be negative`);
    }

    setAccountsDto(temp);
    console.log(e, row, index);
  };

  const salaryBreakDownCalc = (salaryDependsOn = "") => {
    const modifyData: any = [];
    const { grossAmount } = form.getFieldsValue(true);

    rowDto?.forEach((itm: any) => {
      const obj = {
        ...itm,
        [itm?.strPayrollElementName.toLowerCase().split(" ").join("")]:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.ceil(grossAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.ceil(itm?.numAmount)
            : Math.ceil((itm?.numNumberOfPercent * grossAmount) / 100),
        numAmount:
          itm?.strPayrollElementName === "Basic" && salaryDependsOn === "Basic"
            ? Math.ceil(grossAmount)
            : itm?.strBasedOn === "Amount"
            ? Math.ceil(itm?.numAmount)
            : Math.ceil((itm?.numNumberOfPercent * grossAmount) / 100),
        showPercentage: itm?.numNumberOfPercent,
        levelVariable: itm?.strPayrollElementName
          .toLowerCase()
          .split(" ")
          .join(""),
      };
      console.log({ obj });

      modifyData.push(obj);
    });
    const indexOfLowestAmount = modifyData.reduce(
      (minIndex: any, currentObject: any, currentIndex: any, array: any) => {
        return currentObject.numNumberOfPercent <
          array[minIndex].numNumberOfPercent
          ? currentIndex
          : minIndex;
      },
      0
    );
    console.log({ indexOfLowestAmount });
    adjustOverFollowAmount(
      modifyData,
      grossAmount,
      indexOfLowestAmount,
      setRowDto,
      `${modifyData[indexOfLowestAmount]?.strPayrollElementName
        .toLowerCase()
        .split(" ")
        .join("")}`
    );
  };
  const calculate_salary_breakdown = () => {
    const modified_data = [];
    const { basicAmount } = form.getFieldsValue(true);
    console.log({ basicAmount });
    for (const item of rowDto) {
      console.log({ item });

      let amount;

      if (item.isBasicSalary) {
        amount = basicAmount; // Use the basic salary directly
        item.numAmount = basicAmount; // Use the basic salary directly
      } else if (item.strBasedOn === "Percentage") {
        amount = (item.numNumberOfPercent * basicAmount) / 100; // Calculate based on percentage of basic salary
        item.numAmount = (item.numNumberOfPercent * basicAmount) / 100; // Calculate based on percentage of basic salary
      } else {
        amount = item.numAmount; // Use the fixed amount if based on fixed amount
      }

      modified_data.push({
        ...item,
        amount: Math.ceil(amount), // Round to nearest integer
      });
    }

    const total_gross_amount = modified_data.reduce(
      (total, item) => total + item.amount,
      0
    );
    form.setFieldsValue({
      grossAmount: total_gross_amount,
    });
    const accounts = `Cash Pay (${100}%)`;
    const temp = [...accountsDto];
    temp[2].accounts = accounts;
    temp[2].numAmount = total_gross_amount;
    temp[0].numAmount = 0;
    temp[1].numAmount = 0;
    setRowDto(modified_data);
    console.log("Total Gross Amount:", total_gross_amount);
  };

  const adjustOverFollowAmount = (
    array = [],
    grossSalaryAmount: any,
    indexOfLowestAmount: any,
    setterFunc: any,
    payrollElementName: any
  ): any => {
    // console.log({ payrollElementName });
    const totalAmount = array.reduce(
      (acc, obj) => acc + (obj as any).numAmount,
      0
    );
    const overFollowAmount = totalAmount - grossSalaryAmount;
    // console.log({
    //   totalAmount,
    //   elementList: array,
    //   grossSalaryAmount,
    //   overFollowAmount,
    // });
    if (overFollowAmount > 0) {
      // console.log({ isOverFollow: overFollowAmount });
      (array[indexOfLowestAmount] as any).numAmount =
        (array[indexOfLowestAmount] as any)?.numAmount - overFollowAmount;
      (array[indexOfLowestAmount] as any)[payrollElementName] -=
        overFollowAmount;
    } else {
      // console.log({ isNotOverFollow: overFollowAmount });

      (array[indexOfLowestAmount] as any).numAmount =
        (array[indexOfLowestAmount] as any)?.numAmount + overFollowAmount * -1;
      (array[indexOfLowestAmount] as any)[payrollElementName] +=
        overFollowAmount * -1;
    }
    setterFunc(array);
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
            disabled={row?.strBasedOn !== "Amount"}
            // rules={[
            //   // { required: true, message: "Amount Is Required" },
            //   {
            //     validator: (_, value, callback) => {
            //       const isExit = selectedRow.find(
            //         (item: any) => item?.intEmployeeId === row?.intEmployeeId
            //       );
            //       const CA = parseFloat(value);
            //       const BA = parseFloat(form.getFieldValue(`BA_${index}`) || 0);
            //       const MFS = parseFloat(
            //         form.getFieldValue(`MFS_${index}`) || 0
            //       );
            //       const TGS = parseFloat(form.getFieldValue(`TGS_${index}`));
            //       if (isExit) {
            //         if (isNaN(CA) || CA < 0) {
            //           callback("Amount Is Required");
            //         } else if (CA + BA + MFS !== TGS) {
            //           callback("CA + BA + MFS must equal TGS");
            //         } else {
            //           callback();
            //         }
            //       }
            //     },
            //   },
            // ]}
            // disabled={true}
            // onChange={(e: any) => {
            //   handleIsPerDayChange(e, index, "CA");
            //   handleIsPerDayChange(0, index, "BA");
            //   handleIsPerDayChange(0, index, "MFS");

            //   const property1 = `BA_${index}`;
            //   const property2 = `MFS_${index}`;
            //   form.setFieldsValue({
            //     [property1]: 0,
            //     [property2]: 0,
            //   });
            // }}
          />
        </>
      ),
    },

    // {
    //   title: "Per Day Salary",
    //   render: (value: any, row: any, index: number) => (
    //     <>
    //       <PSelect
    //         name={`isPerDay_${index}`}
    //         options={[
    //           { value: 1, label: "Yes" },
    //           { value: 0, label: "No" },
    //         ]}
    //         onChange={(value) => handleIsPerDayChange(value, index, "isPerDay")}
    //         defaultValue={{ value: 1, label: "Yes" }}
    //         // rules={[{ required: true, message: "Per Day Salary is required" }]}
    //       />
    //     </>
    //   ),
    // },
    // {
    //   title: "Total Gross Salary",
    //   render: (value: any, row: any, index: number) => (
    //     <>
    //       <PInput
    //         type="number"
    //         name={`TGS_${index}`}
    //         placeholder="Amount"
    //         rules={[
    //           // { required: true, message: "Amount Is Required" },
    //           {
    //             validator: (_, value, callback) => {
    //               const TGS = parseFloat(value);
    //               const isExit = selectedRow.find(
    //                 (item: any) => item?.intEmployeeId === row?.intEmployeeId
    //               );
    //               if (isExit && isNaN(TGS)) {
    //                 callback("Amount Is Required");
    //               } else if (TGS < 0) {
    //                 callback("Cant be Negative");
    //               } else {
    //                 callback();
    //               }
    //             },
    //           },
    //         ]}
    //         // disabled={true}
    //         onChange={(e: any) => {
    //           handleIsPerDayChange(e, index, "TGS");
    //           handleIsPerDayChange(e, index, "CA");
    //           handleIsPerDayChange(0, index, "BA");
    //           handleIsPerDayChange(0, index, "MFS");
    //           const property = `CA_${index}`;
    //           const property2 = `BA_${index}`;
    //           const property3 = `MFS_${index}`;
    //           form.setFieldsValue({
    //             [property]: e,
    //             [property2]: 0,
    //             [property3]: 0,
    //           });
    //         }}
    //       />
    //     </>
    //   ),
    // },
    // ...dynamicHeader,
    // {
    //   title: "Net Salary Amount",
    //   dataIndex: "TGS",
    // },
    // {
    //   title: "Bank Amount",
    //   render: (value: any, row: any, index: number) => (
    //     <>
    //       <PInput
    //         type="number"
    //         name={`BA_${index}`}
    //         placeholder="Amount"
    //         rules={[
    //           // { required: true, message: "Amount Is Required" },
    //           {
    //             validator: (_, value, callback) => {
    //               const BA = parseFloat(value);
    //               const isExit = selectedRow.find(
    //                 (item: any) => item?.intEmployeeId === row?.intEmployeeId
    //               );
    //               if (isExit && isNaN(BA)) {
    //                 callback("Amount Is Required");
    //               } else if (BA < 0) {
    //                 callback("Cant be Negative");
    //               } else {
    //                 callback();
    //               }
    //             },
    //           },
    //         ]}
    //         // disabled={true}
    //         onChange={(e: any) => {
    //           // const property1 = `MFS_${index}`;
    //           handleIsPerDayChange(e, index, "BA");

    //           handleIsPerDayChange(row?.TGS - e - row?.MFS, index, "CA");
    //           // handleIsPerDayChange(e, index, "BA");
    //           // handleIsPerDayChange(row?.TGS - e, index, "CA");
    //           const property2 = `CA_${index}`;
    //           form.setFieldsValue({
    //             // [property1]: row?.TGS - e,
    //             [property2]: row?.TGS - e - row?.MFS,
    //           });
    //         }}
    //       />
    //     </>
    //   ),
    // },
    // {
    //   title: "MFS Amount",
    //   render: (_: any, row: any, index: number) => (
    //     <>
    //       <PInput
    //         type="number"
    //         name={`MFS_${index}`}
    //         placeholder="Amount"
    //         rules={[
    //           // { required: true, message: "Amount Is Required" },
    //           {
    //             validator: (_, value, callback) => {
    //               const MFS = parseFloat(value);
    //               const isExit = selectedRow.find(
    //                 (item: any) => item?.intEmployeeId === row?.intEmployeeId
    //               );
    //               if (isExit && isNaN(MFS)) {
    //                 callback("Amount Is Required");
    //               } else if (MFS < 0) {
    //                 callback("Cant be Negative");
    //               } else {
    //                 callback();
    //               }
    //             },
    //           },
    //         ]}
    //         // disabled={true}
    //         onChange={(e: any) => {
    //           handleIsPerDayChange(e, index, "MFS");

    //           handleIsPerDayChange(row?.TGS - e - row?.BA, index, "CA");
    //           // handleIsPerDayChange(row?.TGS - row?.CA, index, "BA");
    //           // const property1 = `BA_${index}`;
    //           const property2 = `CA_${index}`;
    //           form.setFieldsValue({
    //             [property2]: row?.TGS - e - row?.BA,
    //             // [property1]: row?.TGS - row?.CA,
    //           });
    //         }}
    //       />
    //     </>
    //   ),
    // },
    // {
    //   title: "Cash Amount",
    //   render: (value: any, row: any, index: number) => (
    //     <>
    //       <PInput
    //         type="number"
    //         name={`CA_${index}`}
    //         placeholder="Amount"
    //         rules={[
    //           // { required: true, message: "Amount Is Required" },
    //           {
    //             validator: (_, value, callback) => {
    //               const isExit = selectedRow.find(
    //                 (item: any) => item?.intEmployeeId === row?.intEmployeeId
    //               );
    //               const CA = parseFloat(value);
    //               const BA = parseFloat(form.getFieldValue(`BA_${index}`) || 0);
    //               const MFS = parseFloat(
    //                 form.getFieldValue(`MFS_${index}`) || 0
    //               );
    //               const TGS = parseFloat(form.getFieldValue(`TGS_${index}`));
    //               if (isExit) {
    //                 if (isNaN(CA) || CA < 0) {
    //                   callback("Amount Is Required");
    //                 } else if (CA + BA + MFS !== TGS) {
    //                   callback("CA + BA + MFS must equal TGS");
    //                 } else {
    //                   callback();
    //                 }
    //               }
    //             },
    //           },
    //         ]}
    //         // disabled={true}
    //         onChange={(e: any) => {
    //           handleIsPerDayChange(e, index, "CA");
    //           handleIsPerDayChange(0, index, "BA");
    //           handleIsPerDayChange(0, index, "MFS");

    //           const property1 = `BA_${index}`;
    //           const property2 = `MFS_${index}`;
    //           form.setFieldsValue({
    //             [property1]: 0,
    //             [property2]: 0,
    //           });
    //         }}
    //       />
    //     </>
    //   ),
    // },
  ];
  const headerAccount: any = [
    {
      title: "Accounts",
      dataIndex: "accounts",
    },
    {
      title: "Net Amount",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            onChange={(e: any) => {
              updateDtoHandler(e, row, index);
            }}
            value={row?.numAmount}
            placeholder="Amount"
            // disabled={index === 2}
          />
        </>
      ),
    },
  ];
  const getBankDDL = () => {
    bankDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Bank",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.BankName;
          res[i].value = item?.BankID;
        });
      },
    });
  };
  const getBranchDDL = () => {
    const { bank } = form.getFieldsValue(true);
    branchDDL?.action({
      urlKey: "BankBranchDDL",
      method: "GET",
      params: {
        BankId: bank?.value,
        AccountID: orgId,
        DistrictId: 0,
      },
    });
  };
  useEffect(() => {
    // getWorkplaceGroup();
    getBankDDL();
  }, [wgId, buId, wId]);
  // console.log({ rowDto });

  return employeeFeature?.isView ? (
    <PForm form={form} initialValues={{}}>
      <PCard>
        <PCardHeader
          title="Salary Assign"
          buttonList={[
            {
              type: "primary",
              content: "Save",
              onClick: () => {
                submitHandler();
              },
              disabled: selectedRow?.length > 0 ? false : true,
              //   icon: <AddOutlined />,
            },
            {
              type: "primary-outline",
              content: "Cancel",
              onClick: () => {
                form.resetFields();
                setSelectedRow([]);
                setRowDto((prev) => {
                  prev = [];
                  return prev;
                });
                // getSalaryLanding();
              },
              // disabled: true,
              //   icon: <AddOutlined />,
            },
          ]}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3 card-style">
          <Col md={13}>
            <div
              className="d-flex justify-content-between align-items-center mt-2"
              style={{
                paddingBottom: "10px",
                marginBottom: "10px",
                // borderBottom: `1px solid ${gray200}`,
              }}
            >
              <div className="d-flex ">
                <div
                  style={{
                    // width: singleData > 0 ? singleData && "auto" : "78px",
                    width: [].length > 0 ? "auto" : "78px",
                  }}
                  className={
                    // singleData > 0
                    //   ? singleData && "add-image-about-info-card height-auto"
                    //   : "add-image-about-info-card"
                    [].length > 0
                      ? "add-image-about-info-card height-auto"
                      : "add-image-about-info-card"
                  }
                >
                  <label
                    htmlFor="contained-button-file"
                    className="label-add-image"
                  >
                    {false ? ( //singleData[0]?.ProfileImageUrl
                      <img
                        src={`${APIUrl}/Document/DownloadFile?id=${0}`}
                        alt=""
                        height="78px"
                        width="78px"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    ) : (
                      <img
                        src={profileImg}
                        alt="iBOS"
                        height="78px"
                        width="78px"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    )}
                  </label>
                </div>
                <div className="content-about-info-card ml-3">
                  <div className="d-flex justify-content-between">
                    <h4
                      className="name-about-info"
                      style={{ marginBottom: "5px" }}
                    >
                      {/* {`${singleData[0]?.EmployeeName}  `}  */}
                      <span style={{ fontWeight: "400", color: gray700 }}>
                        {/* [{singleData[0]?.EmployeeCode}] */}
                      </span>{" "}
                    </h4>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Department -
                      </small>{" "}
                      {/* {`${singleData[0]?.DepartmentName}`} */}
                    </p>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Designation -
                      </small>{" "}
                      {/* {singleData[0]?.DesignationName} */}
                    </p>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Employment Type -
                      </small>{" "}
                      {/* {singleData[0]?.strEmploymentType} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={8}></Col>
          <div className="">
            {/* <FormikCheckBox
                height="15px"
                styleObj={{
                  color: gray900,
                  checkedColor: greenColor,
                  padding: "0px 0px 0px 5px",
                }}
                label={"Hold Salary"}
                name="isHoldSalary"
                value={isHoldSalary}
                checked={isHoldSalary}
                onChange={(e) => {
                  // setIsHoldSalary(e.target.checked);
                  // holdSalaryHandler(e);
                }}
              /> */}
            <div className="ml-1">
              <PInput
                label="Hold Salary?"
                type="checkbox"
                layout="horizontal"
                name="isHoldSalary"
              />
            </div>
            <div>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  // setOpenIncrement(true);
                  // setIsOpen(false);
                }}
                style={{ color: gray900 }}
                className="d-inline-block mt-2 pointer uplaod-para"
              >
                <span style={{ fontSize: "12px" }}>
                  <MovingOutlined
                    sx={{
                      marginRight: "5px",
                      fontSize: "18px",
                      color: gray900,
                    }}
                  />{" "}
                  Increment History
                </span>
              </p>
            </div>
          </div>
        </Row>
        <Row gutter={[10, 2]} className="mb-3">
          {/* <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workG?.data || []}
              name="workplaceGroup"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                  wp: undefined,
                  payrollGroup: undefined,
                });
                getWorkplace();
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workP?.data || []}
              name="wp"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  wp: op,
                });
                getEmploymentType();
                getEmployeDepartment();
                getEmployeDesignation();
                getEmployeePosition();
                getPayrollGroupDDL();
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col> */}
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={[]}
              name="salaryType"
              label="Salary Type"
              placeholder="Salary Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  salaryType: op,
                });
              }}
              rules={[{ required: true, message: "Salary Type is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={payrollGroupDDL?.data || []}
              name="payrollGroup"
              label="Payroll Group"
              placeholder="Payroll Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  payrollGroup: op,
                });
              }}
              rules={[{ required: true, message: "Payroll Group is required" }]}
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
              placeholder="Based On"
              onChange={(value, op) => {
                form.setFieldsValue({
                  basedOn: op,
                });
              }}
              rules={[{ required: true, message: "Based On is required" }]}
            />
          </Col>

          {/* <Col md={6} sm={12} xs={24}>
            <PSelect
              options={employmentTypeDDL?.data || []}
              name="employeeType"
              label="Employment Type"
              placeholder="Employment Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  employeeType: op,
                });
              }}
              //   rules={[
              //     { required: true, message: "Employment Type is required" },
              //   ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
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
                });
              }}
              //   rules={[{ required: true, message: "Department is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
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
              //   rules={[{ required: true, message: "Designation is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
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
              //   rules={[{ required: true, message: "HR Position is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="joiningDateFrom"
              label="Joining Date From"
              placeholder="Joining Date From"
              //   rules={[{ required: true, message: "Joining Date is required" }]}
              // disabled={isEdit}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="joiningDateTo"
              label="Joining Date To"
              placeholder="Joining Date To"
              //   rules={[{ required: true, message: "Joining Date is required" }]}
              // disabled={isEdit}
            />
          </Col> */}

          {/* <Col
            style={{
              marginTop: "23px",
            }}
          >
            <PButton type="primary" content="View" onClick={viewHandler} />
          </Col> */}
        </Row>
        <Row>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { basedOn } = form.getFieldsValue(true);
              if (basedOn?.value === 2) {
                return (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="number"
                      name="basicAmount"
                      label="Basic"
                      placeholder="Basic"
                      onChange={(e: any) => {
                        calculate_salary_breakdown();
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 2,
                          message: "Basic is required",
                        },
                      ]}
                    />
                  </Col>
                );
              } else
                return (
                  <Col md={6} sm={12} xs={24}>
                    <PInput
                      type="number"
                      name="grossAmount"
                      label="Gross"
                      placeholder="Gross"
                      onChange={(e: any) => {
                        console.log(e);
                        const accounts = `Cash Pay (${100}%)`;
                        const temp = [...accountsDto];
                        temp[2].accounts = accounts;
                        temp[2].numAmount = e;
                        temp[0].numAmount = 0;
                        temp[1].numAmount = 0;
                        salaryBreakDownCalc();
                        // (values?.bankPay * 100) /
                        //               values?.totalGrossSalary
                        //             )?.toFixed(6)

                        setAccountsDto([...temp]);
                      }}
                      rules={[
                        {
                          required: basedOn?.value === 1,
                          message: "Gross is required",
                        },
                      ]}
                    />
                  </Col>
                );
            }}
          </Form.Item>
          <Col xs={12}></Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { grossAmount, basicAmount } = form.getFieldsValue(true);

              return (
                <Col md={6} sm={12} xs={24}>
                  <PInput
                    type="number"
                    label="Gross Amount"
                    value={grossAmount}
                    placeholder="GROSS"
                    disabled={true}
                    // rules={[
                    //   {
                    //     required: basedOn?.value === 2,
                    //     message: "Basic is required",
                    //   },
                    // ]}
                  />
                </Col>
              );
            }}
          </Form.Item>
        </Row>
        {true ? (
          <DataTable
            header={header}
            bordered
            data={rowDto || []}
            loading={bulkLandingAPI?.loading}
            // scroll={{ x: 1500 }}
            // rowSelection={{
            //   type: "checkbox",
            //   selectedRowKeys: selectedRow.map((item) => item?.key),
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     setSelectedRow(selectedRows);
            //   },
            //   getCheckboxProps: () => {
            //     // console.log(rec);
            //     // return {
            //     //   disabled: rec?.ApplicationStatus === "Approved",
            //     // };
            //   },
            // }}
          />
        ) : (
          <NoResult title="No Result Found" para="" />
        )}
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        ></Divider>
        <DataTable header={headerAccount} bordered data={accountsDto || []} />
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "16px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        ></Divider>
        <Row gutter={[10, 2]}>
          <Col md={3} className="mt-2">
            Bank Name
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PSelect
              options={bankDDL?.data?.length > 0 ? bankDDL?.data : []}
              name="bank"
              placeholder="Bank"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bank: op,
                });
                getBranchDDL();
              }}
              // rules={[{ required: true, message: "Salary Type is required" }]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Branch Name
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PSelect
              options={branchDDL?.data?.length > 0 ? branchDDL?.data : []}
              name="branch"
              placeholder="Branch"
              onChange={(value, op) => {
                form.setFieldsValue({
                  branch: op,
                  routing: (op as any)?.name,
                });
              }}
              // rules={[{ required: true, message: "Salary Type is required" }]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Routing No
          </Col>
          <Col md={12} className="mt-2">
            <PInput
              type="number"
              name="routing"
              placeholder="Basic"
              rules={[
                {
                  // required: basedOn?.value === 2,
                  message: "Basic is required",
                },
              ]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Swift Code
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PInput
              type="number"
              name="swift"
              disabled={true}
              placeholder="Basic"
              // rules={[
              //   {
              //     // required: basedOn?.value === 2,
              //     message: "Basic is required",
              //   },
              // ]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Account Name
          </Col>
          <Col md={12} className="mt-2">
            {" "}
            <PInput
              type="text"
              name="account"
              placeholder="Account Name"
              // rules={[
              //   {
              //     // required: basedOn?.value === 2,
              //     message: "Basic is required",
              //   },
              // ]}
            />
          </Col>
          <Col md={7}></Col>
          <Col md={3} className="mt-2">
            Account No
          </Col>
          <Col md={12} className="mt-2">
            <PInput
              type="number"
              name="accountNo"
              placeholder="Account No"
              // rules={[
              //   {
              //     // required: basedOn?.value === 2,
              //     message: "Basic is required",
              //   },
              // ]}
            />
          </Col>
          <Col md={7}></Col>
        </Row>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default SalaryV2;
