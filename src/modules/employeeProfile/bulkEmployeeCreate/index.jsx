import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ScrollableTable from "../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import { downloadFile } from "../../../utility/downloadFile";
import { excelFileToArray } from "../../../utility/excelFileToJSON";
import ErrorEmployeeModal from "./ErrorEmployeeModal";

import {
  processBulkUploadEmployeeAction,
  saveBulkUploadEmployeeAction,
} from "./helper";

const initData = {
  files: "",
};

export default function BulkEmployeeCreate() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState([]);
  const [errorData, setErrorData] = useState([]);
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
  const saveHandler = () => {
    const emptyCheck = data?.some(({ strEmployeeCode }) => !strEmployeeCode);
    const isDuplicate =
      new Set(data.map(({ strEmployeeCode }) => strEmployeeCode)).size !==
      data.length;

    const callBack = () => {
      history.push("/profile/employee");
      setData([]);
    };

    if (!data?.length || emptyCheck || isDuplicate) {
      toast.warn(
        "Invalid upload, please check your file or follow employee code which must be unique and not empty"
      );
    } else {
      saveBulkUploadEmployeeAction(
        setIsLoading,
        setOpen,
        setErrorData,
        data,
        callBack
      );
    }
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
      const processData = await excelFileToArray(file, "Employee Bulk Upload");
      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadEmployeeAction(
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
              <div>
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <BackButton />
                      <PrimaryButton
                        className="btn btn-green btn-green-disable"
                        label="Save"
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
                                process.env.NODE_ENV === "development"
                                  ? "/document/downloadfile?id=3"
                                  : "/document/downloadfile?id=3"
                              }`,
                              "Employee Bulk Upload",
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
                                <div>Name</div>
                              </th>
                              <th>
                                <div>Card Number</div>
                              </th>
                              <th>
                                <div>Designation</div>
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
                                <div>Department</div>
                              </th>
                              <th>
                                <div>Employee Division</div>
                              </th>
                              <th>
                                <div>Section</div>
                              </th>
                              <th>
                                <div>HR Position</div>
                              </th>
                              <th>
                                <div>Employment Type</div>
                              </th>
                              <th>
                                <div>Gender</div>
                              </th>
                              <th>
                                <div>Salary Hold</div>
                              </th>
                              <th>
                                <div>Religion Name</div>
                              </th>
                              <th className="text-center">
                                <div>Date Of Birth</div>
                              </th>
                              <th className="text-center">
                                <div>Joining Date</div>
                              </th>
                              <th className="text-center">
                                <div>Confirmation Date</div>
                              </th>
                              <th className="text-center">
                                <div>Intern Close Date</div>
                              </th>
                              <th className="text-center">
                                <div>Probationary Close Date</div>
                              </th>
                              <th className="text-center">
                                <div>Contact From Date</div>
                              </th>
                              <th className="text-center">
                                <div>Contact To Date</div>
                              </th>
                              <th className="text-center">
                                <div>Phone</div>
                              </th>
                              <th className="">
                                <div>Email</div>
                              </th>
                              <th className="text-center">
                                <div>Wing</div>
                              </th>
                              <th className="text-center">
                                <div>Sole Depot</div>
                              </th>
                              <th className="text-center">
                                <div>Region</div>
                              </th>
                              <th className="text-center">
                                <div>Area</div>
                              </th>
                              <th className="text-center">
                                <div>Territory</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.map((data, index) => (
                              <tr key={index}>
                                <td className="tableBody-title">{index + 1}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="emp-avatar">
                                      <AvatarComponent
                                        classess=""
                                        letterCount={1}
                                        label={data?.strEmployeeName}
                                      />
                                    </div>
                                    <div className="ml-2 tableBody-title">
                                      {data?.strEmployeeName}{" "}
                                      {data?.strEmployeeCode &&
                                        `[${data?.strEmployeeCode}]`}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="tableBody-title"
                                    style={{ width: "200px" }}
                                  >
                                    {data?.strCardNumber}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="tableBody-title"
                                    style={{ width: "200px" }}
                                  >
                                    {data?.strDesignation}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strBusinessUnit}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strWorkplaceGroup}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strWorkplace}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strDepartment}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strEmpDivision }
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strSection}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strHrPosition}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strEmploymentType}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strGender}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {`${data?.isSalaryHold}`?.toUpperCase()}
                                  </div>
                                </td>
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strReligionName}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {dateFormatter(data?.dteDateOfBirth)}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {dateFormatter(data?.dteJoiningDate)}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {dateFormatter(data?.dteConfirmationDate)}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.dteInternCloseDate
                                      ? dateFormatter(data?.dteInternCloseDate)
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.dteProbationaryCloseDate
                                      ? dateFormatter(
                                          data?.dteProbationaryCloseDate
                                        )
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.dteContactFromDate
                                      ? dateFormatter(data?.dteContactFromDate)
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.dteContactToDate
                                      ? dateFormatter(data?.dteContactToDate)
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.strPhoneNumber
                                      ? data?.strPhoneNumber
                                      : "-"}
                                  </div>
                                </td>{" "}
                                <td>
                                  <div className="tableBody-title">
                                    {data?.strEmailAddress
                                      ? data?.strEmailAddress
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.strWingName
                                      ? data?.strWingName
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.strSoleDepoName
                                      ? data?.strSoleDepoName
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.strRegionName
                                      ? data?.strRegionName
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.strAreaName
                                      ? data?.strAreaName
                                      : "-"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="tableBody-title">
                                    {data?.strTerritoryName
                                      ? data?.strTerritoryName
                                      : "-"}
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
