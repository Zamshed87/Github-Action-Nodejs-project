import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { isDevServer } from "App";
import {
  processBulkUploadEmployeeAction,
  processBulkUploadTnP,
  saveBulkUploadEmployeeAction,
  saveBulkUploadTnP,
} from "./helper";
import { excelFileToArray } from "utility/excelFileToJSON";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import PrimaryButton from "common/PrimaryButton";
import { downloadFile } from "utility/downloadFile";
import ScrollableTable from "common/ScrollableTable";
import AvatarComponent from "common/AvatarComponent";
import { dateFormatter, dateFormatterReport } from "utility/dateFormatter";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import ErrorEmployeeModal from "modules/CompensationBenefits/bulkEmployeeCreate/ErrorEmployeeModal";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import Chips from "common/Chips";

const initData = {
  files: "",
};

export default function BulkUploadTransferNPromotion() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [isSaveData, setIsSaveData] = useState(false);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  // for create state
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { intUrlId, orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // old way
  // const saveHandler = (values) => {
  //   const emptyCheck = data?.some((item) => item?.strEmployeeCode === "");
  //   var duplicateCheck = data.map((item) => item?.strEmployeeCode);
  //   var isDuplicate = duplicateCheck.some((item, idx) => {
  //     return duplicateCheck.indexOf(item) !== idx;
  //   });

  //   const callBack = () => {
  //     history.push("/profile/employee");
  //     setData([]);
  //   };

  //   if (data?.length <= 0 || emptyCheck || isDuplicate) {
  //     toast.warn(
  //       "Invalid upload, please check your file or follow employee code which must be unique and not empty"
  //     );
  //   } else {
  //     saveBulkUploadEmployeeAction(
  //       setIsLoading,
  //       setOpen,
  //       setErrorData,
  //       data,
  //       callBack
  //     );
  //   }
  // };

  // new way
  const saveHandler = (v, cb) => {
    if (isSaveData) {
      setIsSaveData(false);
      setData([]);
      cb();
      return;
    }
    const emptyCheck = data?.some(({ strEmployeeCode }) => !strEmployeeCode);
    const isExistSalaryType = data?.some(({ strSalaryType }) => !strSalaryType);
    const isDuplicate =
      new Set(data.map(({ strEmployeeCode }) => strEmployeeCode)).size !==
      data.length;

    const callBack = (list) => {
      // history.push("/profile/employee");
      setIsSaveData(true);

      const mergedData = data.map((item) => {
        const listItem = list.find((l) => l.rowId === item.rowId);
        return listItem ? { ...item, ...listItem } : item;
      });

      setData(mergedData);
    };
    if (data?.length <= 0) {
      toast.warn(
        "Empty data found, please check your file. Upload and try again"
      );
      return;
    }
    // if (isExistSalaryType) {
    //   toast.warn("Salary Type is required");
    //   return;
    // }
    // if (!data?.length || emptyCheck || isDuplicate) {
    //   toast.warn(
    //     "Invalid upload, please check your file or follow employee code which must be unique and not empty"
    //   );
    // } else {
    //   saveBulkUploadTnP(setIsLoading, setOpen, setErrorData, data, callBack);
    // }
    saveBulkUploadTnP(setIsLoading, setOpen, setErrorData, data, callBack);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      permission = item;
    }
  });

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(file, "TransNProm");
      console.log(processData);
      if (processData.length < 1) return toast.warn("No data found!");
      console.log(processData);
      processBulkUploadTnP(
        processData,
        setData,
        setIsLoading,
        intUrlId,
        orgId,
        employeeId
      );
    } catch (error) {
      toast.warn("Failed to process!");
    }
  };

  // console.log(data);

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
        {({ handleSubmit, resetForm, values }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {isLoading && <Loading />}
              <div>
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <BackButton />
                      <PrimaryButton
                        className="btn btn-green btn-green-disable"
                        label={isSaveData ? "Reset" : "Save"}
                        type="submit"
                      />
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6 d-flex align-items-center">
                        <PrimaryButton
                          className="btn btn-default mr-1"
                          label="Download Demo"
                          onClick={() => {
                            downloadFile(
                              `${
                                isDevServer
                                  ? "/document/downloadfile?id=7600"
                                  : "/document/downloadfile?id=2635"
                              }`,
                              "TransNProm",
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
                            !!e.target.files?.[0] && setIsLoading(true);
                            processData(e.target.files?.[0]);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                      </div>
                    </div>
                    {console.log(data)}
                    {data.length > 0 && (
                      <div className="table-card-body mt-3">
                        <ScrollableTable
                          classes="salary-process-table"
                          secondClasses="table-card-styled tableOne scroll-table-height"
                        >
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>

                              <th>
                                <div>Employee Name</div>
                              </th>
                              <th>
                                <div>Employee Code</div>
                              </th>
                              <th>
                                <div>Type</div>
                              </th>
                              <th>
                                <div>Effective Date</div>
                              </th>
                              <th>
                                <div>Business Unit</div>
                              </th>
                              <th>
                                <div>Workplace Group</div>
                              </th>
                              <th>
                                <div>Workplace</div>
                              </th>
                              <th>
                                <div>Employment Type</div>
                              </th>
                              <th>
                                <div>HR Position</div>
                              </th>
                              <th>
                                <div>Department</div>
                              </th>
                              <th>
                                <div>Section</div>
                              </th>
                              <th>
                                <div>Designation</div>
                              </th>
                              <th>
                                <div>Supervisor</div>
                              </th>
                              <th>
                                <div>Dotted Supervisor</div>
                              </th>
                              <th>
                                <div>Line Manager</div>
                              </th>
                              <th>
                                <div>Remarks</div>
                              </th>
                              <th>
                                <div>Status</div>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {data.map((item, index) => (
                              <tr key={index}>
                                <td className="tableBody-title">{index + 1}</td>

                                <td>
                                  <div className="tableBody-title">
                                    {item?.employeeName || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.employeeCode || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.transferNpromotionType || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {dateFormatter(item?.effectiveDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.businessUnit || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.workplaceGroup || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.workplace || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.employmentType || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.hrPosition || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.department || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.section || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.designation || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.supervisorCode || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.dottedSupervisorCode || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.lineManagerCode || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {item?.remarks || "-"}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    <Chips
                                      label={item?.statusMessage}
                                      classess={
                                        item?.isInserted ? "success" : "warning"
                                      }
                                    />{" "}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </ScrollableTable>
                      </div>
                    )}
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
              {/* addEdit form Modal */}
              <ErrorEmployeeModal
                show={open}
                title={"Error Data List"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                values={values}
                errorData={errorData}
                resetForm={resetForm}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
