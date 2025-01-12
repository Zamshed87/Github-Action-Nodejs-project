/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { Close, DownloadOutlined, PriorityHigh } from "@mui/icons-material";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import image from "./assets/johariWindow-02.jpg";
import {
  JohariWindowPDFView,
  onCreateJohariWindow,
  onExportPDFJohariWindow,
  onGetJohariWindow,
} from "./helper";
import { useFormik } from "formik";
import ImageViewer from "../../../../common/ImageViewer";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
const initialValues = {
  employee: "",
  year: "",
  open: [],
  hidden: [],
  blind: [],
  unknown: [],
};
const JohariWindow = () => {
  const {
    profileData: { employeeId, strDisplayName, orgId, buId, wgId, wId },
    permissionList,
  } = useSelector((store) => store?.auth);

  const { values, handleSubmit, setValues, resetForm } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      onCreateJohariWindow({
        formValues,
        resetForm,
        setEmployeeBasicInfo,
        setJohariWindow,
        johariWindow,
        employeeId,
        employeeInfo,
        createJohariWindow,
        getJohariWindows,
        values,
        setValues,
      });
    },
  });
  // eslint-disable-next-line no-unused-vars
  const [employeeInfo, getEmployeeInfo, , setEmployeeBasicInfo] = useAxiosGet();
  const [employeeDDL, getEmployeeDDL, loadingOnGetEmployeeDDL, setEmployeeDDL] =
    useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [
    johariWindow,
    getJohariWindows,
    loadingOnGetJohariWindows,
    setJohariWindow,
  ] = useAxiosGet();
  const [johariWindowsChipsDDL, getJohariWindowsChips, loadingOnGetChip] =
    useAxiosGet();
  const [, createJohariWindow, loadingOnCreateJohariWindow] = useAxiosPost();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [
    departmentDDL,
    getDepartmentDDL,
    departmentDDLloader,
    setDepartmentDDL,
  ] = useAxiosGet();
  const [sectionDDL, getSectionDDL, sectionDDLloader, setSectionDDL] =
    useAxiosGet();

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30489),
    [permissionList]
  );
  useEffect(() => {
    // getYearDDL(`/PMS/YearDDL?AccountId=${orgId}&BusinessUnitId=${buId}`);

    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initialValues.year = theYearData;
      setValues((prev) => ({
        ...prev,
        year: theYearData,
      }));
      // setFieldValue("yearDDLgroup", theYearData);
    });

    getJohariWindowsChips(`/PMS/GetJohariWindoWChips`);
    getDepartmentDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0&workplaceGroupId=${wgId}&intWorkplaceId=${wId}`,
      (data) => {
        const modifiedDDL = data?.map((item) => ({
          ...item,
          value: item?.DepartmentId,
          label: item?.DepartmentName,
        }));
        setDepartmentDDL(modifiedDDL);
      }
    );
  }, [employeeId, strDisplayName]);
  return (
    <>
      {(loadingOnGetEmployeeDDL ||
        loadingOnGetJohariWindows ||
        loadingOnCreateJohariWindow ||
        loadingOnGetChip ||
        sectionDDLloader ||
        fiscalYearDDLloader ||
        departmentDDLloader) && <Loading />}
      {permission?.isCreate ? (
        <>
          <div className="table-card">
            <div className="table-card-heading justify-content-between">
              <h2 style={{ color: "#344054" }}>Johari Window</h2>
              <ul className="d-flex flex-wrap">
                <li>
                  <Button
                    onClick={() => {
                      setShowHelpModal(true);
                    }}
                    className="mr-3"
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(0, 0, 0, 0.6)",
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "10px",
                      fontWeight: "bold",
                      letterSpacing: "1.25px",
                      "&:hover": {
                        borderColor: "rgba(0, 0, 0, 0.6)",
                      },
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    }}
                    startIcon={
                      <PriorityHigh
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          transform: "rotate(-180deg)",
                          marginBottom: "2px",
                          fontSize: "11px !important",
                          marginRight: "-8px",
                        }}
                        className="emp-print-icon"
                      />
                    }
                  >
                    Help
                  </Button>
                </li>
                <li>
                  <Button
                    disabled={
                      !values?.employee || !employeeInfo || !values?.year
                    }
                    className="mr-3"
                    variant="outlined"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onExportPDFJohariWindow("Johari Window");
                    }}
                    sx={{
                      borderColor: "rgba(0, 0, 0, 0.6)",
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "10px",
                      fontWeight: "bold",
                      letterSpacing: "1.25px",
                      "&:hover": {
                        borderColor: "rgba(0, 0, 0, 0.6)",
                      },
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    }}
                    startIcon={
                      <DownloadOutlined
                        sx={{
                          color:
                            !values?.employee || !employeeInfo || !values?.year
                              ? "rgb(184 178 182 / 0.6)"
                              : "rgba(0, 0, 0, 0.6)",
                          marginBottom: "2px",
                          fontSize: "16px !important",
                          marginRight: "-4px",
                        }}
                        className="emp-print-icon"
                      />
                    }
                  >
                    Download PDF
                  </Button>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-green w-100"
                    onClick={handleSubmit}
                    disabled={
                      !values?.employee || !employeeInfo || !values?.year
                    }
                  >
                    Save
                  </button>
                </li>
              </ul>
            </div>
            <div className="table-card-body" style={{ marginTop: "8px" }}>
              <div className="card-style">
                <div className="row" style={{ margin: "0 -8px !important" }}>
                  <div className="input-field-main col-md-3">
                    <label>Department</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="department"
                      options={departmentDDL?.length > 0 ? departmentDDL : []}
                      value={values?.department}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          getSectionDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=masterSectionDDL&AccountId=${orgId}&BusinessUnitId=${buId}&IntDepartmentId=${valueOption?.value}&intId=0&workplaceGroupId=${wgId}&intWorkplaceId=${wId}`
                          );
                          setValues((prev) => ({
                            ...prev,
                            department: valueOption,
                            section: "",
                          }));
                        } else {
                          setSectionDDL([]);
                          setValues((prev) => ({
                            ...prev,
                            department: "",
                            section: "",
                          }));
                        }
                      }}
                      styles={customStyles}
                    />
                  </div>
                  <div className="input-field-main col-md-3">
                    <label>Section</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="section"
                      options={sectionDDL?.length > 0 ? sectionDDL : []}
                      value={values?.section}
                      isDisabled={!values?.department}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setValues((prev) => ({
                            ...prev,
                            section: valueOption,
                          }));
                          getEmployeeDDL(
                            // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${valueOption?.value}&intAutoId=${values?.department?.value}`,
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&AccountId=${orgId}&BusinessUnitId=${buId}&intAutoId=${valueOption?.value}&IntDepartmentId=${values?.department?.value}&workplaceGroupId=${wgId}&intWorkplaceId=${wId}`,
                            (data) => {
                              const modifiedDDL = data?.map((item) => ({
                                ...item,
                                value: item?.EmployeeId,
                                label: item?.EmployeeOnlyName,
                              }));
                              setEmployeeDDL(modifiedDDL);
                            }
                          );
                        } else {
                          setValues((prev) => ({
                            ...prev,
                            section: "",
                          }));
                        }
                      }}
                      styles={customStyles}
                    />
                  </div>
                  <div className="input-field-main col-md-3">
                    <label>Employee</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="employee"
                      options={employeeDDL || []}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        if (valueOption?.value !== values?.employee?.value) {
                          setValues((prev) => ({
                            ...prev,
                            employee: valueOption,
                            open: [],
                            blind: [],
                            unknown: [],
                            hidden: [],
                          }));
                          setEmployeeBasicInfo(null);
                          // if (valueOption?.value) {
                          //   getEmployeeInfo(
                          //     `/Employee/GetEmpAllBasicInfoById?id=${valueOption?.value}`
                          //   );
                          // }
                        }
                      }}
                      isDisabled={!values?.section}
                      styles={customStyles}
                    />
                  </div>
                  <div className="input-field-main col-md-3">
                    <label>Year</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="year"
                      options={fiscalYearDDL || []}
                      value={values?.year}
                      onChange={(valueOption) => {
                        onGetJohariWindow({
                          setValues,
                          valueOption,
                          values,
                          getJohariWindows,
                        });
                      }}
                      styles={customStyles}
                    />
                  </div>
                  <div className="input-field-main col-md-3">
                    <label>Employee Type</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      isDisabled={!values?.employee}
                      name="employeeType"
                      options={[
                        { value: 1, label: "Management" },
                        { value: 2, label: "Non Management" },
                      ]}
                      value={values?.employeeType}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          employeeType: valueOption,
                        }));
                      }}
                      styles={customStyles}
                    />
                  </div>
                </div>
                {values?.employee ? (
                  <div className="row">
                    <div className="col-md-5 py-2 d-flex align-item-center">
                      <p style={{ fontWeight: "bold" }}>
                        Name : {values?.employee?.label}
                      </p>
                    </div>
                    <div className="col-md-5 py-2 d-flex align-item-center">
                      <p style={{ fontWeight: "bold" }}>
                        Designation : {values?.employee?.DesignationName}
                      </p>
                    </div>
                    <div className="col-md-5 py-2 d-flex align-item-center">
                      <p style={{ fontWeight: "bold" }}>
                        Enroll : {values?.employee?.value}
                      </p>
                    </div>
                    <div className="col-md-5 py-2 d-flex align-item-center">
                      <p style={{ fontWeight: "bold" }}>
                        Workplace : {values?.employee?.WorkplaceName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="mt-3">
                <div className="row justify-content-between mx-0">
                  <div
                    className="card-style"
                    style={{ width: "49.3%", minHeight: "150px" }}
                  >
                    <div className="row mt-2 align-item-center">
                      <div className="col-md-2">
                        <p>Open</p>
                      </div>
                      <div className="input-field-main col-md-5">
                        <FormikSelect
                          classes="input-sm form-control"
                          options={johariWindowsChipsDDL || []}
                          disabled={!values?.employee}
                          onChange={(valueOption) => {
                            if (
                              values?.open?.some(
                                (item) => item?.value === valueOption?.value
                              )
                            ) {
                              toast.warn("Chip already exist");
                            } else {
                              setValues((prev) => ({
                                ...(prev || {}),
                                open: [...prev?.open, valueOption],
                              }));
                            }
                          }}
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div>
                      <ul className="d-flex flex-wrap ">
                        {values?.open?.map((item, index) => (
                          <li
                            key={index}
                            style={{ backgroundColor: "#EEEEEE", border: 0 }}
                            className="chips success relative chips-two mr-1 mb-2"
                          >
                            {item?.label}
                            <span
                              className="pointer cross-chips-icon white"
                              onClick={() => {
                                const modifiedOpenList = values?.open?.filter(
                                  (nestedItem) =>
                                    nestedItem?.value !== item?.value
                                );
                                setValues((prev) => ({
                                  ...prev,
                                  open: modifiedOpenList,
                                }));
                              }}
                            >
                              <Close sx={{ fontSize: "12px" }} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div
                    className="card-style"
                    style={{ width: "49.3%", minHeight: "150px" }}
                  >
                    <div className="row mt-2 align-item-center">
                      <div className="col-md-2">
                        <p>Blind</p>
                      </div>
                      <div className="input-field-main col-md-5">
                        <FormikSelect
                          classes="input-sm form-control"
                          options={johariWindowsChipsDDL || []}
                          styles={customStyles}
                          onChange={(valueOption) => {
                            if (
                              values?.blind?.some(
                                (item) => item?.value === valueOption?.value
                              )
                            ) {
                              toast.warn("Chip already exist");
                            } else {
                              setValues((prev) => ({
                                ...(prev || {}),
                                blind: [...prev?.blind, valueOption],
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <ul className="d-flex flex-wrap ">
                        {values?.blind?.map((item, index) => (
                          <li
                            key={index}
                            style={{ backgroundColor: "#EEEEEE", border: 0 }}
                            className="chips success relative chips-two mr-1 mb-2"
                          >
                            {item?.label}
                            <span
                              className="pointer cross-chips-icon white"
                              onClick={() => {
                                const modifiedBlindList = values?.blind?.filter(
                                  (nestedItem) =>
                                    nestedItem?.value !== item?.value
                                );
                                setValues((prev) => ({
                                  ...prev,
                                  blind: modifiedBlindList,
                                }));
                              }}
                            >
                              <Close sx={{ fontSize: "12px" }} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-between mx-0 mt-3">
                  <div
                    className="card-style"
                    style={{ width: "49.3%", minHeight: "150px" }}
                  >
                    <div className="row mt-2 align-item-center">
                      <div className="col-md-2">
                        <p>Hidden</p>
                      </div>
                      <div className="input-field-main col-md-5">
                        <FormikSelect
                          classes="input-sm form-control"
                          options={johariWindowsChipsDDL || []}
                          disabled={!values?.employee}
                          onChange={(valueOption) => {
                            if (
                              values?.hidden?.some(
                                (item) => item?.value === valueOption?.value
                              )
                            ) {
                              toast.warn("Chip already exist");
                            } else {
                              setValues((prev) => ({
                                ...(prev || {}),
                                hidden: [...prev?.hidden, valueOption],
                              }));
                            }
                          }}
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div>
                      <ul className="d-flex flex-wrap ">
                        {values?.hidden?.map((item, index) => (
                          <li
                            key={index}
                            style={{ backgroundColor: "#EEEEEE", border: 0 }}
                            className="chips success relative chips-two mr-1 mb-2"
                          >
                            {item?.label}
                            <span
                              className="pointer cross-chips-icon white"
                              onClick={() => {
                                const modifiedHiddenList =
                                  values?.hidden?.filter(
                                    (nestedItem) =>
                                      nestedItem?.value !== item?.value
                                  );
                                setValues((prev) => ({
                                  ...prev,
                                  hidden: modifiedHiddenList,
                                }));
                              }}
                            >
                              <Close sx={{ fontSize: "12px" }} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div
                    className="card-style"
                    style={{ width: "49.3%", minHeight: "150px" }}
                  >
                    <div className="row mt-2 align-item-center">
                      <div className="col-md-2">
                        <p>Unknown</p>
                      </div>
                      <div className="input-field-main col-md-5">
                        <FormikSelect
                          classes="input-sm form-control"
                          options={johariWindowsChipsDDL || []}
                          styles={customStyles}
                          onChange={(valueOption) => {
                            if (
                              values?.unknown?.some(
                                (item) => item?.value === valueOption?.value
                              )
                            ) {
                              toast.warn("Chip already exist");
                            } else {
                              setValues((prev) => ({
                                ...(prev || {}),
                                unknown: [...prev?.unknown, valueOption],
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <ul className="d-flex flex-wrap ">
                        {values?.unknown?.map((item, index) => (
                          <li
                            key={index}
                            style={{ backgroundColor: "#EEEEEE", border: 0 }}
                            className="chips success relative chips-two mr-1 mb-2"
                          >
                            {item?.label}
                            <span
                              className="pointer cross-chips-icon white"
                              onClick={() => {
                                const modifiedUnknownList =
                                  values?.unknown?.filter(
                                    (nestedItem) =>
                                      nestedItem?.value !== item?.value
                                  );
                                setValues((prev) => ({
                                  ...prev,
                                  unknown: modifiedUnknownList,
                                }));
                              }}
                            >
                              <Close sx={{ fontSize: "12px" }} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ImageViewer
            show={showHelpModal}
            onHide={() => setShowHelpModal(false)}
            title="Johari Window"
            modelSize="md"
            image={image}
          />

          <div id="pdf-section" className="d-none">
            <JohariWindowPDFView
              employeeFullName={values?.employee?.label}
              employeeId={values?.employee?.value}
              designation={employeeInfo?.[0]?.designationName}
              workplace={employeeInfo?.[0]?.workplaceName}
              year={values?.year?.label}
              chipList={values}
            />
          </div>
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default JohariWindow;
