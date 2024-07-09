import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { excelFileToArray } from "utility/excelFileToJSON";
import {
  processBulkUploadSalaryAction,
  saveBulkUploadSalaryAction,
} from "./helper";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import PrimaryButton from "common/PrimaryButton";
import { downloadFile } from "utility/downloadFile";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const initialValues = {
  file: "",
};

const BulkMovementCreate = () => {
  const { buId, employeeId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

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

  // const handleClose = () => {
  //   setOpen(false);
  //   setErrorData([]);
  // };

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(file, "Employees", 2);
      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadSalaryAction(processData, setData, setIsLoading);
    } catch (error) {
      toast.warn("Failed to process!");
    }
  };

  const saveHandler = (values) => {
    // const callBack = () => {
    //   setData([]);
    // };
    data?.length > 0
      ? saveBulkUploadSalaryAction(
          setIsLoading,
          data,
          "",
          orgId,
          buId,
          employeeId,
          setErrorData,
          wgId,
          setData
        )
      : toast.warn("Please Upload Excel File");
  };

  const { handleSubmit, resetForm } = useFormik({
    initialValues,
    onSubmit: () => {
      saveHandler();
    },
  });

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
            <div className="row">
              <div className="col-8 d-flex align-items-center my-2">
                <input
                  type="number"
                  value={numberOfRow}
                  onChange={(e) => setNumberOfRow(e.target.value)}
                  placeholder="Number of Rows"
                  className="form-control mr-2"
                  style={{ width: "100px", marginRight: "8px" }}
                />
                <PrimaryButton
                  disabled={!numberOfRow}
                  className="btn btn-default mr-1"
                  label="Download Demo"
                  onClick={() => {
                    downloadFile(
                      `/PdfAndExcelReport/downloadexcelemployeeList?workPlaceGroupId=${wgId}&numberOfRow=${numberOfRow}`,
                      "Employees Salary",
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
            <div className="table-card-body mt-3">
              <div className="table-card-styled tableOne">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <div>SL</div>
                      </th>
                      <th>
                        <div>Employee Code</div>
                      </th>
                      <th>
                        <div>Employee Name</div>
                      </th>
                      <th>
                        <div>Payroll Group</div>
                      </th>
                      <th>
                        <div>Gross Salary</div>
                      </th>
                      <th>
                        <div>Bank</div>
                      </th>
                      <th>
                        <div>Cash</div>
                      </th>
                      <th>
                        <div>Digital</div>
                      </th>
                      <th>
                        <div>Routing No</div>
                      </th>
                      <th>
                        <div>Swift Code</div>
                      </th>
                      <th>
                        <div>Account No</div>
                      </th>
                      <th>
                        <div>Account Name</div>
                      </th>
                      <th>
                        <div>Message</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="content tableBody-title">
                            {index + 1}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.employeeCode || item?.EmployeeCode}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.employeeName}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.payrollGroup}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.grossSalary}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.bankPay}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.cashPay}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.digitalPay}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.routingNo}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.swiftCode}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.accountNo}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.accountName}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            <span
                              style={{
                                color:
                                  item?.isBankDetailsInserted &&
                                  item?.isSalaryInserted
                                    ? "green"
                                    : item?.isBankDetailsInserted ||
                                      item?.isSalaryInserted
                                    ? "orange"
                                    : "red",
                              }}
                            >
                              {item?.exMessage || item?.ExMessage}
                            </span>
                          </div>
                        </td>

                        {/* <td>
                          <div className="content tableBody-title">
                            {moment(item?.dteToTime, "HH:mm:ss").format("h:mm")}
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
      ) : (
        <NotPermittedPage />
      )}
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
