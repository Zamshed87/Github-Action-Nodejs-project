import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { downloadFile } from "../../../../utility/downloadFile";
import {
  excelFileToArray,
  excelFileToSpecificIndexInfo,
} from "../../../../utility/excelFileToJSON";
import {
  processBulkUploadIncrementAction,
  saveBulkUploadIncrementAction,
  saveBulkUploadIncrementActionUpdate,
} from "./helper";
import { isDevServer } from "App";
import BackButton from "common/BackButton";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { useApiRequest } from "Hooks";
import { DataTable } from "Components";
import { ModalFooter, PModal } from "Components/Modal";
import { Tag } from "antd";

const initData = {
  files: "",
};

export default function BulkIncrementEntry() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const payrollGroupDDL = useApiRequest([]);
  const bulkUploadApi = useApiRequest([]);

  const { buId, orgId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
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
  const saveHandler = () => {
    const callBack = () => {
      // history.push("/compensationAndBenefits/increment");
      setData([]);
    };
    data?.length > 0
      ? bulkUploadApi?.action({
          urlKey: "IncrementBulkUpload",
          method: "post",
          payload: data,
          toast: true,
          onSuccess: (res) => {
            // callBack();
            // toast.success(res?.data?.message || "Successful");

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
        })
      : toast.warn("Please Upload Excel File");
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30304) {
      permission = item;
    }
  });

  const processData = async (file, values) => {
    try {
      const processData = await excelFileToArray(file, "EmployeesIncrement", 3);
      const payrollInfo = await excelFileToSpecificIndexInfo(
        file,
        "EmployeesIncrement",
        1
      );
      const elementInfo = await excelFileToSpecificIndexInfo(
        file,
        "EmployeesIncrement",
        2
      );

      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadIncrementAction(
        processData,
        setData,
        setIsLoading,
        elementInfo,
        payrollInfo,
        values,
        setErrorData,
        setOpen,
        employeeId
      );
    } catch (error) {
      isDevServer && console.log({ error });
      toast.warn("Failed to process!");
    }
  };
  useEffect(() => {
    getPayrollGroupDDL();
  }, [wgId, wId]);
  // Generate dynamic columns for elements
  const dynamicColumns = (source) => {
    const columns = [];
    if (source.length > 0) {
      const elementKeys = source[0].payrollElements.map(
        (element) => element.elementName
      );
      elementKeys.forEach((key) => {
        columns.push({
          title: key,
          dataIndex: "payrollElements",
          key,
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
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      // key: "empCode",
      width: 40,
    },
    {
      title: "Gross Salary",
      dataIndex: "gross",
      // key: "empCode",
      width: 50,
    },
    {
      title: "Mismatch Amount",
      dataIndex: "misMatch",
      // key: "empCode",
      width: 40,
    },
  ];
  const responseColumns = (source) => {
    return [
      {
        title: "Status",
        dataIndex: "status",
        // key: "empName",
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
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, setValues, setFieldValue, values }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {isLoading && <Loading />}
              <div>
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="d-flex justify-content-between">
                      <BackButton title={"Bulk Increment"} />
                      <div className="table-card-heading justify-content-end">
                        <PrimaryButton
                          className="btn btn-green btn-green-disable"
                          label="Save"
                          type="submit"
                        />
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-md-3" style={{ marginTop: "-12px" }}>
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
                      </div>

                      <div className="col-md-6 d-flex align-items-center">
                        <PrimaryButton
                          className="btn btn-default mr-1"
                          label="Download Demo"
                          onClick={() => {
                            downloadFile(
                              `/PdfAndExcelReport/DownloadExcelforSalaryIncrement?parrollGroupId=${values?.pg?.value}&numberOfRow=100`,
                              "EmployeesIncrement",
                              "xlsx",
                              setIsLoading
                            );
                          }}
                          type="button"
                        />
                        <input
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            processData(e.target.files?.[0], values);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
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
                      //             <div>Employee Id</div>
                      //           </th>
                      //           <th>
                      //             <div>Name</div>
                      //           </th>
                      //           <th>
                      //             <div>Designation</div>
                      //           </th>
                      //           {/* <th>
                      //             <div>Depend On</div>
                      //           </th>
                      //           <th>
                      //             <div>Increment Percentage/Amount</div>
                      //           </th> */}
                      //           <th>
                      //             <div>Fixed Amount</div>
                      //           </th>
                      //           <th>
                      //             <div>Percentage Based On Basic</div>
                      //           </th>
                      //           <th>
                      //             <div>Percentage Based On Gross</div>
                      //           </th>
                      //           <th>
                      //             <div>Effective Date</div>
                      //           </th>
                      //         </tr>
                      //       </thead>
                      //       <tbody>
                      //         {data.map((item, index) => (
                      //           <tr key={item?.intEmployeeId}>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {index + 1}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.intEmployeeId}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.strEmployeeName}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.strDesignation}
                      //               </div>
                      //             </td>
                      //             {/* <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.strIncrementDependOn}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.numIncrementPercentageOrAmount}
                      //               </div>
                      //             </td> */}
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.numIncrementAmountBasedOnAmount}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.numIncrementPercentageBasedOnBasic}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {item?.numIncrementPercentBasedOnGross}
                      //               </div>
                      //             </td>
                      //             <td>
                      //               <div className="content tableBody-title">
                      //                 {/* {item?.dteEffectiveDate} */}
                      //                 {dateFormatter(item?.dteEffectiveDate)}
                      //               </div>
                      //             </td>
                      //           </tr>
                      //         ))}
                      //       </tbody>
                      //     </table>
                      //   </div>
                      // </div>
                      <DataTable data={data} header={columns(data)} bordered />
                    )}
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>

              <PModal
                width={900}
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
