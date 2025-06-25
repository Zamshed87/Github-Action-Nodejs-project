import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  excelFileToArray,
  excelFileToSpecificIndexInfo,
} from "utility/excelFileToJSON";
import { processNewBulkUploadSalaryAction } from "./helper";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import PrimaryButton from "common/PrimaryButton";
import { downloadFile } from "utility/downloadFile";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { useApiRequest } from "Hooks";
import { Tag } from "antd";
import { DataTable } from "Components";
import { ModalFooter, PModal } from "Components/Modal";
import { todayDate } from "utility/todayDate";
import { isDevServer } from "App";

const initialValues = {
  file: "",
};

const BulkMovementCreate = () => {
  const { buId, employeeId, orgId, wgId, wId, wName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const payrollGroupDDL = useApiRequest([]);
  const postBulk = useApiRequest([]);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [numberOfRow, setNumberOfRow] = useState(20);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30333) {
      permission = item;
    }
  });

  // const [open, setOpen] = useState(false);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const payscaleDDL = useApiRequest([]);

  // const handleClose = () => {
  //   setOpen(false);
  //   setErrorData([]);
  // };

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(file, "EmployeeSalary", 3);
      const payrollInfo = await excelFileToSpecificIndexInfo(
        file,
        "EmployeeSalary",
        1
      );
      const elementInfo = await excelFileToSpecificIndexInfo(
        file,
        "EmployeeSalary",
        2
      );
      if (processData.length < 1) return toast.warn("No data found!");
      // processBulkUploadSalaryAction(processData, setData, setIsLoading);

      processNewBulkUploadSalaryAction(
        processData,
        setData,
        setIsLoading,
        elementInfo,
        payrollInfo,
        values,
        setErrorData,
        setOpen,
        employeeId,
        wId
      );
    } catch (error) {
      toast.warn("Failed to process!");
    }
  };

  const saveHandler = (values) => {
    // const callBack = () => {
    //   setData([]);
    // };
    data?.length > 0
      ? postBulk.action({
          urlKey: data[0]?.isGrade
            ? "SalaryGradeBasedBulkUpload"
            : "SalaryBulkUpload",
          method: "post",
          payload: data,
          // toast: true,
          onSuccess: (res) => {
            // callBack();
            toast.success(res?.data?.message || "Successful");

            const modifiedResponse = data.map((item) => {
              const responseItem = res.find((r) => r.slNo === item.slNo);
              return {
                ...item,
                status: responseItem.isInserted ? "Success" : "Failed",
                message: responseItem.message,
              };
            });
            setData(modifiedResponse);
          },
          onError: (err) => {
            isDevServer && console.log({ err });
            toast.error(
              err?.response?.data?.message ||
                err?.response?.data?.Message ||
                err?.response?.data?.title ||
                "Something went wrong"
            );
          },
        })
      : toast.warn("Please Upload Excel File");
  };

  const { handleSubmit, resetForm, setFieldValue, values } = useFormik({
    initialValues,
    onSubmit: () => {
      saveHandler();
    },
  });
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
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strSalaryBreakdownTitle;
          res[i].value = item?.intSalaryBreakdownHeaderId;
        });
      },
    });
  };
  useEffect(() => {
    getPayrollGroupDDL();
  }, [wgId, wId]);

  // Generate dynamic columns for elements
  const dynamicColumns = (source) => {
    const columns = [];
    if (source.length > 0) {
      const elementKeys = source[0].salaryElements.map(
        (element) => element.elementName
      );
      elementKeys.forEach((key) => {
        columns.push({
          title: key,
          dataIndex: "salaryElements",
          key,
          width: 70,
          render: (elements) => {
            const element = elements.find((el) => el.elementName === key);
            return element ? element.amount : null;
          },
        });
      });
    }
    return columns;
  };

  // Fixed columns for Employee Name and Code
  const fixedColumns = [
    {
      title: "SL",
      dataIndex: "slNo",
      // key: "empName",
    },
    {
      title: "Employee Name",
      dataIndex: "empName",
      // key: "empName",
      width: 120,
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      // key: "empCode",
      width: 70,
    },
    {
      title: "Slab Count",
      dataIndex: "slabElement",

      width: 80,
      hidden: data[0]?.isGrade ? false : true,
    },
    {
      title: "Gross Salary",
      dataIndex: "gross",
      // key: "empCode",
      width: 70,
    },
    {
      title: "Bank",
      dataIndex: "bank",
      // key: "empCode",
      width: 50,
    },
    {
      title: "Cash",
      dataIndex: "cash",
      // key: "empCode",
      width: 50,
    },
    {
      title: "Digital",
      dataIndex: "digital",
      // key: "empCode",
      width: 60,
    },
    {
      title: "Mismatch Amount",
      dataIndex: "misMatch",
      // key: "empCode",
      width: 70,
    },
    {
      title: "Payment Mismatch",
      dataIndex: "pmm",
      // key: "empCode",
      width: 70,
    },
  ];
  const responseColumns = (source) => {
    return [
      {
        title: "Status",
        dataIndex: "status",
        // key: "empName",
        width: 70,
        render: (_, rec) => {
          return (
            <div>
              {rec?.status === "Success" ? (
                <Tag color="green">{rec?.status}</Tag>
              ) : (
                <Tag color="red">{rec?.status}</Tag>
              )}
            </div>
          );
        },
        hidden: source[0]?.status ? false : true,
      },
      {
        title: "Message",
        dataIndex: "message",
        // key: "empCode",
        width: 40,
        hidden: source[0]?.status ? false : true,
      },
    ].filter((i) => !i.hidden);
  };

  // Combine fixed and dynamic columns
  // const columns=(source)=> = {retrun[...fixedColumns, ...dynamicColumns(source)]};
  const columns = (source) => [
    ...fixedColumns,
    ...dynamicColumns(source),
    ...responseColumns(source),
  ];
  const getPayScaleDDL = () => {
    payscaleDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "PayscaleSetupbyWorkplaceDDL",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        accountId: orgId,
        intWorkplaceId: wId,
      },
    });
  };
  return (
    <>
      {isLoading && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card-heading justify-content-between mt-5">
            <BackButton title="Bulk Salary Assign" />
            <PrimaryButton
              className="btn btn-green btn-green-disable"
              label="Save"
              type="submit"
            />
          </div>

          <div className="card-style pb-0 mb-2">
            <div className="row py-2">
              {[3, 12, 15]?.includes(orgId) && (
                <div className="col-md-3" style={{ marginTop: "-12px" }}>
                  <div className="input-field-main">
                    <label>Grade Based</label>

                    <FormikSelect
                      name="isGrade"
                      classes="input-sm"
                      styles={customStyles}
                      options={[
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                      ]}
                      value={values?.isGrade}
                      onChange={(valueOption) => {
                        if (valueOption?.value) {
                          getPayScaleDDL();
                        }

                        setFieldValue("isGrade", valueOption);
                        setFieldValue("pg", null);
                        setFieldValue("payScale", null);
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="col-md-3" style={{ marginTop: "-12px" }}>
                {!values?.isGrade?.value && (
                  <div className="input-field-main">
                    <label>Payroll Group</label>

                    <FormikSelect
                      name="pg"
                      classes="input-sm"
                      styles={customStyles}
                      options={payrollGroupDDL?.data || []}
                      value={values?.pg}
                      onChange={(valueOption) => {
                        setFieldValue("pg", valueOption);
                      }}
                    />
                  </div>
                )}
                {values?.isGrade?.value && (
                  <div className="input-field-main">
                    <label>Payscale</label>

                    <FormikSelect
                      name="payScale"
                      classes="input-sm"
                      styles={customStyles}
                      options={payscaleDDL?.data || []}
                      value={values?.payScale}
                      onChange={(valueOption) => {
                        setFieldValue("payScale", valueOption);
                        setFieldValue("pg", null);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="col-6 d-flex align-items-center my-2">
                <PrimaryButton
                  disabled={!numberOfRow}
                  className="btn btn-default mr-1"
                  label="Download Demo"
                  onClick={() => {
                    const url = values?.isGrade?.value
                      ? `/PdfAndExcelReport/DownloadExcelForGradeBasedSalary?payscaleId=${values?.payScale?.value}&numberOfRow=100`
                      : `/PdfAndExcelReport/DownloadExcelforSalaryBulk?parrollGroupId=${values?.pg?.value}&numberOfRow=100`;
                    downloadFile(
                      url,
                      `${todayDate()}_${wName}_Employee_Salary_Bulk`,
                      "xlsx",
                      setIsLoading
                    );
                  }}
                  type="button"
                />
                <input
                  name="file"
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => {
                    processData(e.target.files?.[0]);
                  }}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </div>
            </div>
          </div>

          {data.length > 0 && (
            // <div className="table-card-body mt-3">
            //   <div className="table-card-styled tableOne">
            //     <table className="table">
            //       <thead>
            //         <tr>
            //           <th>
            //             <div>SL</div>
            //           </th>
            //           <th>
            //             <div>Employee Code</div>
            //           </th>
            //           <th>
            //             <div>Employee Name</div>
            //           </th>
            //           <th>
            //             <div>Payroll Group</div>
            //           </th>
            //           <th>
            //             <div>Gross Salary</div>
            //           </th>
            //           <th>
            //             <div>Bank</div>
            //           </th>
            //           <th>
            //             <div>Cash</div>
            //           </th>
            //           <th>
            //             <div>Digital</div>
            //           </th>
            //           <th>
            //             <div>Routing No</div>
            //           </th>
            //           <th>
            //             <div>Swift Code</div>
            //           </th>
            //           <th>
            //             <div>Account No</div>
            //           </th>
            //           <th>
            //             <div>Account Name</div>
            //           </th>
            //           <th>
            //             <div>Message</div>
            //           </th>
            //         </tr>
            //       </thead>
            //       <tbody>
            //         {data.map((item, index) => (
            //           <tr key={index}>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {index + 1}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.employeeCode || item?.EmployeeCode}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.employeeName}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.payrollGroup}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.grossSalary}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.bankPay}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.cashPay}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.digitalPay}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.routingNo}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.swiftCode}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.accountNo}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 {item?.accountName}
            //               </div>
            //             </td>
            //             <td>
            //               <div className="content tableBody-title">
            //                 <span
            //                   style={{
            //                     color:
            //                       item?.isBankDetailsInserted &&
            //                       item?.isSalaryInserted
            //                         ? "green"
            //                         : item?.isBankDetailsInserted ||
            //                           item?.isSalaryInserted
            //                         ? "orange"
            //                         : "red",
            //                   }}
            //                 >
            //                   {item?.exMessage || item?.ExMessage}
            //                 </span>
            //               </div>
            //             </td>

            //             {/* <td>
            //               <div className="content tableBody-title">
            //                 {moment(item?.dteToTime, "HH:mm:ss").format("h:mm")}
            //               </div>
            //             </td> */}
            //           </tr>
            //         ))}
            //       </tbody>
            //     </table>
            //   </div>
            // </div>
            <DataTable
              data={data}
              header={columns(data)}
              bordered
              scroll={{ x: 2000 }}
            />
          )}
        </form>
      ) : (
        <NotPermittedPage />
      )}
      <PModal
        width={1500}
        open={open}
        onCancel={() => setOpen(false)}
        title={`Warning Mismatch Calculation`}
        components={
          <>
            <DataTable
              header={columns(errorData)}
              bordered
              data={errorData || []}
            />
            <ModalFooter
              submitText={`Skip (${errorData?.length}) and Proceed`}
              submitAction="button"
              cancelText={false}
              onSubmit={() => {
                setOpen(false);
                setErrorData([]);
              }}
            />
          </>
        }
      />
      {/* <BulkMovementCreateStatusModal
        show={open}
        title={"Response Data List"}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        classes="default-modal"
        errorData={errorData}
        resetForm={resetForm}
      /> */}
    </>
  );
};

export default BulkMovementCreate;
