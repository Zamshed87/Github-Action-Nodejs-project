import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import { downloadFile } from "../../../utility/downloadFile";
import { excelFileToArray } from "../../../utility/excelFileToJSON";
import {
  processBulkUploadOvertimeAction,
  saveBulkUploadAction
} from "./helper";

const initData = {
  files: "",
};

export default function BulkUploadEntry() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {
    saveBulkUploadAction(setIsLoading, data);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 133) {
      permission = item;
    }
  });

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(file, "OvertimeBulkUpload");
      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadOvertimeAction(
        processData,
        setData,
        setIsLoading,
        buId,
        employeeId
      );
    } catch (error) {
      toast.warn("Failed to process!");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {isLoading && <Loading />}
              <div className="overtime-entry">
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="table-card-heading justify-content-end">
                      {data.length > 0 && (
                        <PrimaryButton
                          className="btn btn-default"
                          label="Submit"
                          type="submit"
                        />
                      )}
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-6 d-flex align-items-center">
                        <PrimaryButton
                          className="btn btn-default mr-1"
                          label="Download"
                          onClick={(e) => {
                            downloadFile(
                              "/Document/DownloadFile?id=637786365538845615_Overtime%20Bulk%20Upload.xlsx",
                              "Overtime Bulk Upload",
                              "xlsx",
                              setIsLoading
                            );
                          }}
                          type="button"
                        />
                        <input
                          type="file"
                          onChange={(e) => {
                            processData(e.target.files?.[0]);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                      </div>
                    </div>

                    {data.length > 0 && (
                      <div className="table-card-body">
                        <div className="table-card-styled tableOne">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Overtime</th>
                                <th>Remarks</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((item) => (
                                <tr key={item?.employeeCode}>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.employeeCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.employeeName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.employeeDesignationName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {dateFormatter(item?.onlyDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.fromTime}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.toTime}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.overtimeHour}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.remarks}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      <Chips
                                        label={
                                          item?.isValid
                                            ? "Right Data"
                                            : "Wrong Data"
                                        }
                                        classess={
                                          item?.isValid ? "success" : "danger"
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
