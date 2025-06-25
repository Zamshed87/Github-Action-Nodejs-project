import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import axios from "axios";
import {
  initialValueForNOCApplication,
  updateDataById,
  validationSchemaForNOCApplication,
} from "./utils";
import {
  getPeopleDeskAllLanding,
  getSearchEmployeeListWithWarning,
} from "common/api";
import { todayDate } from "utility/todayDate";
import { APIUrl } from "App";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DDLForAddress } from "modules/employeeProfile/employeeOverview/components/helper";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import DefaultInput from "common/DefaultInput";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import DemoImg from "../../../assets/images/demo.png";
import { toast } from "react-toastify";
import AsyncFormikSelect from "common/AsyncFormikSelect";

const NOCForm = () => {
  const {
    profileData: { orgId, intAccountId, buId, employeeId, wgId, wId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation() || false;
  const [countryDDL, setCountryDDL] = useState([]);

  const isManagement = state && state.isManagement ? state.isManagement : false;
  const [, getReqInfoById, loadingById] = useAxiosGet([]);
  const [, saveNOCApplicationReq, loadingSave] = useAxiosPost([]);
  const dispatch = useDispatch();
  const { type, id } = useParams();
  const [employeeInfo, setEmployeeInfo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);

  const {
    handleSubmit,
    values,
    setFieldValue,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValueForNOCApplication || {},
    validationSchema: validationSchemaForNOCApplication,
    onSubmit: (values) => {
      // Ensure attachmentList is always an array, even if empty
      const safeAttachmentList = attachmentList || [];
      saveHandler(safeAttachmentList, values, () => {
        setEmployeeInfo([]);
        setAttachmentList([]);
        resetForm(initialValueForNOCApplication);
      });
    },
  });
  const saveHandler = (attachmentList, values, cb) => {
    const fileList = [];
    // Handle case when attachmentList is empty or undefined
    if (attachmentList && attachmentList.length > 0) {
      attachmentList.forEach((item) => {
        const data = item?.response?.[0];
        if (data?.globalFileUrlId) {
          fileList.push(data?.globalFileUrlId);
        }
      });
    }

    const payload = {
      nocType: values?.nocType?.label || "",
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      passportNumber: values?.passportNumber || "",
      countryName: values?.country?.label || "",
      countryId: values?.country?.value || 0,
      purpose: values?.purpose || "",
      fileIds: fileList?.length > 0 ? fileList.join(",") : "",
      actionBy: employeeId,
    };

    if (id && type === "edit") {
      setLoading(true);
      axios
        .put(`${APIUrl}/NocApplication/${id}`, payload)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            toast.success("NOC application updated successfully!");
            cb?.();
          }
        })
        .catch((error) => {
          console.error("Error updating NOC application:", error);
          toast.warn("Failed to update NOC application. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // For creating a new record
      const newPayload = {
        accountId: intAccountId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        employeeId: values?.employee?.value || 0,
        ...payload,
        isActive: true,
      };
      saveNOCApplicationReq(
        `/NocApplication`,
        newPayload,
        () => {
          !id && cb?.();
        },
        true
      );
    }
  };

  const getEmpInfoDetails = (empId) => {
    getPeopleDeskAllLanding(
      "EmployeeBasicById",
      orgId,
      buId,
      empId ? empId : employeeId,
      setEmployeeInfo,
      null,
      setLoading
    );
  };
  const getNOCApplicationInfoById = (id) => {
    getReqInfoById(`/NocApplication/${+id}`, (res) => {
      const { updateInitialValue } = updateDataById(res);

      // Helper function to determine file type
      const getFileType = (fileName) => {
        if (!fileName) return "document";
        const extension = fileName?.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
          return "image";
        } else if (extension === "pdf") {
          return "pdf";
        }
        return "document";
      };

      // Handle attachment list safely
      let attachmentList = [];

      if (
        res?.fileIds &&
        Array.isArray(res.fileIds) &&
        res.fileIds.length > 0
      ) {
        attachmentList = res.fileIds.map((item, index) => {
          const fileName = `Attachment ${index + 1}`;
          const fileType = getFileType(fileName);
          return {
            lastModified: new Date(),
            lastModifiedDate: todayDate(),
            name: fileName,
            response: [
              {
                fileName: fileName,
                globalFileUrlId: item,
                intAutoId: item,
                isActive: true,
              },
            ],
            url: `${APIUrl}/Document/DownloadFile?id=${item}`,
            status: "done",
            type:
              fileType === "image"
                ? "image/jpeg"
                : fileType === "pdf"
                ? "application/pdf"
                : "application/octet-stream",
            uid: `Attachment ${item}-${index + 1}`,
          };
        });
      } else if (res?.strFileIds && typeof res.strFileIds === "string") {
        // Fallback to the old format if needed
        const fileIds = res.strFileIds
          .split(",")
          .filter((id) => id.trim() !== "");
        attachmentList = fileIds.map((item, index) => {
          const fileName = `Attachment ${index + 1}`;
          const fileType = getFileType(fileName);
          return {
            lastModified: new Date(),
            lastModifiedDate: todayDate(),
            name: fileName,
            response: [
              {
                fileName: fileName,
                globalFileUrlId: item.trim(),
                intAutoId: item.trim(),
                isActive: true,
              },
            ],
            url: `${APIUrl}/Document/DownloadFile?id=${item.trim()}`,
            status: "done",
            type:
              fileType === "image"
                ? "image/jpeg"
                : fileType === "pdf"
                ? "application/pdf"
                : "application/octet-stream",
            uid: `Attachment ${item.trim()}-${index + 1}`,
          };
        });
      }

      getEmpInfoDetails(res?.intEmployeeBasicInfoId || res?.employeeId);
      setAttachmentList(attachmentList);
      setValues((prev) => ({
        ...prev,
        ...updateInitialValue,
      }));
    });
  };

  useEffect(() => {
    dispatch(
      setFirstLevelNameAction(
        isManagement ? "Employee Management" : "Employee Self Service"
      )
    );
    !isManagement && type !== "view" && getEmpInfoDetails(employeeId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getNOCApplicationInfoById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);
  useEffect(() => {
    DDLForAddress(
      "Country",
      orgId,
      buId,
      setCountryDDL,
      "CountryId",
      "CountryName"
    );
  }, [employeeId, buId, orgId]);
  useEffect(() => {
    if (employeeInfo?.[0]?.EmployeeId) {
      setFieldValue(
        "employee",
        {
          value: employeeInfo?.[0]?.EmployeeId,
          label: employeeInfo?.[0]?.EmployeeName,
        } || ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeInfo?.[0]?.EmployeeId]);

  return (
    <form onSubmit={handleSubmit}>
      {(loading || loadingById || loadingSave) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>{`NOC Application Form`}</h2>
          </div>
          <ul className={type === "view" ? "d-none" : "d-flex flex-wrap"}>
            {" "}
            <li>
              <button
                type="button"
                className="btn btn-cancel mr-2"
                onClick={() => {
                  setEmployeeInfo([]);
                  setAttachmentList([]);
                  resetForm(initialValueForNOCApplication);
                }}
              >
                Reset
              </button>
            </li>
            <li>
              <button type="submit" className="btn btn-green w-100">
                {id ? "Edit" : "Create"} Request
              </button>
            </li>
          </ul>
        </div>

        <div className="card-style">
          <div className="row pb-2">
            <div className="col-md-3 col-lg-4">
              <label>Employee</label>
              <AsyncFormikSelect
                selectedValue={values?.employee}
                isSearchIcon={true}
                handleChange={(valueOption) => {
                  setEmployeeInfo([]);
                  setFieldValue("employee", valueOption);
                  setFieldValue("setGetAssignShiftInfo", []);
                  if (valueOption) {
                    getEmpInfoDetails(valueOption?.value);
                  }
                }}
                placeholder="Search (min 3 letter)"
                loadOptions={(v) =>
                  getSearchEmployeeListWithWarning(buId, wgId, v)
                }
                isDisabled={id || !isManagement}
              />
            </div>
            <div
              className="col-md-3 col-lg-8"
              style={{
                marginTop: "22px",
              }}
            >
              {employeeInfo?.[0]?.EmployeeName && (
                <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
                  {employeeInfo?.[0]?.strProfileImageUrl ? (
                    <img
                      src={
                        employeeInfo?.[0]?.strProfileImageUrl
                          ? `${APIUrl}/Document/DownloadFile?id=${employeeInfo?.[0]?.strProfileImageUrl}`
                          : DemoImg
                      }
                      alt="Profile"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={DemoImg}
                      alt="Profile"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="employeeTitle ml-2">
                    <div className="d-flex align-items-center">
                      <p className="employeeName">
                        {employeeInfo?.[0]?.EmployeeName
                          ? employeeInfo?.[0]?.EmployeeName
                          : ""}
                      </p>

                      <p className="employeePosition ml-3">
                        Designation:{" "}
                        <b>
                          {employeeInfo?.[0]?.DesignationName
                            ? employeeInfo?.[0]?.DesignationName
                            : ""}
                        </b>
                      </p>

                      <p className="employeePosition ml-3">
                        Department:{" "}
                        <b>
                          {employeeInfo?.[0]?.DepartmentName
                            ? employeeInfo?.[0]?.DepartmentName
                            : ""}
                        </b>
                      </p>
                      <p className="employeePosition ml-3">
                        Emp Code:{" "}
                        <b>
                          {employeeInfo?.[0]?.EmployeeCode
                            ? employeeInfo?.[0]?.EmployeeCode
                            : ""}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-3 col-lg-4">
              <label>NOC Type</label>
              <FormikSelect
                name="nocType"
                options={[
                  {
                    value: 1,
                    label: "Travel",
                  },
                  {
                    value: 1,
                    label: "Medical",
                  },
                  {
                    value: 1,
                    label: "Others",
                  },
                ]}
                value={values?.nocType}
                onChange={(valueOption) => {
                  setFieldValue("nocType", valueOption);
                }}
                placeholder=""
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={type === "view"}
              />
            </div>
            <div className="col-md-3 col-lg-4">
              <div className="input-field-main">
                <label>From Date </label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.fromDate}
                  placeholder="From Date"
                  name="fromDate"
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("fromDate", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                  disabled={type === "view"}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-4">
              <div className="input-field-main">
                <label>To Date </label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.toDate}
                  placeholder="To Date"
                  name="toDate"
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("toDate", e.target.value);
                  }}
                  min={values?.fromDate}
                  errors={errors}
                  touched={touched}
                  disabled={type === "view"}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-4">
              <div className="input-field-main">
                <label>Passport No</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.passportNumber}
                  placeholder="Passport Number"
                  name="passportNumber"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("passportNumber", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                  disabled={type === "view"}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-4">
              <label>Country</label>
              <FormikSelect
                name="country"
                options={countryDDL || []}
                value={values?.country}
                onChange={(valueOption) => {
                  setFieldValue("country", valueOption);
                }}
                placeholder=""
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={type === "view"}
              />
            </div>
            <div className="col-md-3 col-lg-4">
              <div className="input-field-main">
                <label>Purpose</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.purpose}
                  placeholder="purpose"
                  name="purpose"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("purpose", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                  disabled={type === "view"}
                />
              </div>
            </div>{" "}
            <div className="col-md-3 col-lg-4 mt-3">
              <FileUploadComponents
                propsObj={{
                  isOpen,
                  setIsOpen,
                  destroyOnClose: false,
                  attachmentList: attachmentList || [],
                  setAttachmentList,
                  accountId: orgId,
                  tableReferrence: "NOC",
                  documentTypeId: 24,
                  userId: employeeId,
                  buId,
                  accept: "image/png, image/jpeg, image/jpg, application/pdf",
                  maxCount: 5,
                  listType: "picture",
                  title: "Upload Attachment",
                  subText: "Supported: Images (PNG, JPG, JPEG) and PDF files",
                  showUploadList: attachmentList && attachmentList.length > 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NOCForm;
