import {
  AttachmentOutlined,
  CheckCircle,
  FileUpload,
  HideSource,
  Info,
  NoAccounts,
  Unpublished,
  VisibilityOffOutlined,
  VisibilityOutlined
} from "@mui/icons-material";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import placeholderImg from "../../assets/images/placeholderImg.png";
import AsyncFormikSelect from "../../common/AsyncFormikSelect";
import FormikInput from "../../common/FormikInput";
import FormikMuiDatePicker from "../../common/FormikMuiDatePicker";
import FormikSelect from "../../common/FormikSelect";
import FormikSelectWithIcon from "../../common/FormikSelectWithIcon";
import FormikTextArea from "../../common/FormikTextArea";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import { gray300, success500 } from "../../utility/customColor";
import { customStyles } from "../../utility/selectCustomStyle";
import { yearDDLAction } from "../../utility/yearDDL";
import { attachment_action } from "../policyUpload/helper";

let date = new Date();
let currentYear = date.getFullYear();

const initData = {
  name: "",
  number: "",
  fromDate: "",
  toDate: "",
  email: "",
  password: "",
  dropDown: "",
  time: "",
  password2: "",
  reason: "",
  employee: "",
  year: { value: currentYear, label: currentYear },
  inputFieldType: "",
  businessUnit: "",
  fromMonth: "",
  datePicker: "",
};

const validationSchema = Yup.object({});

export default function FormInputDisplay({ index, tabIndex }) {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${orgId}&BusinessUnitId=${buId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
  const [imageFile, setImageFile] = useState("");
  const dispatch = useDispatch();
  // image
  const inputFile = useRef(null);

  // month default
  let date = new Date();
  let initYear = date.getFullYear(); // 2022
  let initMonth = date.getMonth() + 1; // 6
  let modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

  const onButtonClick = () => {
    inputFile.current.click();
  };
  const saveHandler = (values, cb) => {};

  return (
    index === tabIndex && (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            fromMonth: `${initYear}-${modifyMonthResult}`,
          }}
          validationSchema={validationSchema}
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
                <div className="common-overview-part">
                  <div>
                    <div className="table-card-heading">
                      <h2>Border Form</h2>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Text Field</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.name}
                            onChange={(e) => {
                              setFieldValue("name", e.target.value);
                            }}
                            name="name"
                            type="text"
                            className="form-control"
                            label=""
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Number Field</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.number}
                            onChange={(e) => {
                              setFieldValue("number", e.target.value);
                            }}
                            name="number"
                            type="number"
                            className="form-control"
                            label=""
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Email Field</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.email}
                            onChange={(e) => {
                              setFieldValue("email", e.target.value);
                            }}
                            name="email"
                            type="email"
                            className="form-control"
                            label=""
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Password Field</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.password}
                            onChange={(e) => {
                              setFieldValue("password", e.target.value);
                            }}
                            name="password"
                            type="password"
                            className="form-control"
                            label=""
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>From Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.fromDate}
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                            name="fromDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>To Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.toDate}
                            min={values?.fromDate}
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            name="toDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/* new momnth picker  */}
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>New Month Picker Creating..</label>
                          <div className="">
                            <FormikInput
                              classes="input-sm month-picker"
                              value={values?.fromMonth}
                              name="fromMonth"
                              type="month"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("fromMonth", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Dropdown Field</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="dropDown"
                            options={[
                              { value: 1, label: "Option-1" },
                              { value: 2, label: "Option-2" },
                            ]}
                            value={values?.dropDown}
                            onChange={(valueOption) => {
                              setFieldValue("dropDown", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Time Field</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.time}
                            onChange={(e) => {
                              setFieldValue("time", e.target.value);
                            }}
                            name="time"
                            type="time"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-password-main">
                          <label>Password With Icon</label>
                          <div className="input-password">
                            <FormikInput
                              classes="input-sm"
                              value={values?.password2}
                              name="password2"
                              type={isShowPassword ? "text" : "password"}
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                if (e.target.value.includes(" ")) {
                                  e.target.value = e.target.value.replace(
                                    /\s/g,
                                    ""
                                  );
                                  setFieldValue("password2", e.target.value);
                                }
                                setFieldValue("password2", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                            <button
                              type="button"
                              onClick={() => setIsShowPassword(!isShowPassword)}
                              className="btn-showPassword"
                            >
                              {isShowPassword ? (
                                <VisibilityOutlined
                                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                                />
                              ) : (
                                <VisibilityOffOutlined
                                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label>Searchable DDL</label>
                        <AsyncFormikSelect
                          selectedValue={values?.employee}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            setFieldValue("employee", valueOption);
                          }}
                          loadOptions={loadUserList}
                        />
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Year DDL</label>
                          <FormikSelect
                            name="year"
                            options={yearDDLAction(5, 10)}
                            value={values?.year}
                            label=""
                            isClearable={false}
                            onChange={(valueOption) => {
                              setFieldValue("year", valueOption);
                            }}
                            placeholder="Year"
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            isDisabled={false}
                            menuPosition="fixed"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label>Dropdown With Icon</label>
                        <FormikSelectWithIcon
                          menuPosition="fixed"
                          name="inputFieldType"
                          options={[
                            {
                              value: 1,
                              label: "Present",
                              icon: <CheckCircle />,
                            },
                            {
                              value: 2,
                              label: "Absent",
                              icon: <Unpublished />,
                            },
                            { value: 3, label: "Late", icon: <Info /> },
                            {
                              value: 4,
                              label: "Movement",
                              icon: <HideSource />,
                            },
                            {
                              value: 5,
                              label: "Leave",
                              icon: <NoAccounts />,
                            },
                          ]}
                          value={values?.inputFieldType}
                          label=""
                          onChange={(valueOption) => {
                            setFieldValue("inputFieldType", valueOption);
                          }}
                          placeholder=""
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>Multiple Add With DDL</label>
                          <FormikSelect
                            placeholder=" "
                            classes="input-sm"
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "auto",
                                height: "auto",
                                borderRadius: "4px",
                                border: `1px solid ${gray300}`,
                                ":hover": {
                                  border: `2px solid ${success500}`,
                                },
                                ":focus": {
                                  border: `1px solid ${success500}`,
                                },
                                boxShadow: `${success500}!important`,
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height: "auto",
                                padding: "0 6px",
                              }),
                            }}
                            name="businessUnit"
                            options={[
                              { value: 1, label: "Option-1" },
                              { value: 2, label: "Option-2" },
                              { value: 3, label: "Option-3" },
                              { value: 4, label: "Option-4" },
                            ]}
                            value={values?.businessUnit}
                            onChange={(valueOption) => {
                              setFieldValue("businessUnit", valueOption);
                            }}
                            isMulti
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label>Date Picker</label>
                        <FormikMuiDatePicker
                          type="date"
                          value={values?.datePicker}
                          onChange={(date) => {
                            setFieldValue("datePicker", date);
                          }}
                          errors={errors}
                          touched={touched}
                          clearable={true}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="table-card-heading">
                      <h2>Textarea</h2>
                    </div>
                    <br />
                    <div className="table-card-heading">
                      <h2>Textarea</h2>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="input-filed-main">
                          <label htmlFor="">Reason</label>
                          <FormikTextArea
                            classes="textarea-with-label common-textarea"
                            value={values?.reason}
                            name="reason"
                            type="text"
                            placeholder=""
                            onChange={(e) => {
                              setFieldValue("reason", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="table-card-heading">
                      <h2>Attachment Upload</h2>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="upload-common-attachment">
                          <div className="input-main position-group-select">
                            <label className="lebel-bold mr-2">
                              Upload File
                            </label>
                            {imageFile?.globalFileUrlId && (
                              <VisibilityOutlined
                                sx={{
                                  color: "rgba(0, 0, 0, 0.6)",
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      imageFile?.globalFileUrlId
                                    )
                                  );
                                }}
                              />
                            )}
                          </div>
                          <div
                            className={
                              imageFile?.globalFileUrlId
                                ? "image-upload-box with-img"
                                : "image-upload-box"
                            }
                            onClick={onButtonClick}
                            style={{
                              cursor: "pointer",
                              position: "relative",
                              height: "35px",
                            }}
                          >
                            <input
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  attachment_action(
                                    orgId,
                                    "PolicyUpload",
                                    13,
                                    buId,
                                    employeeId,
                                    e.target.files,
                                    setLoading
                                  )
                                    .then((data) => {
                                      setImageFile(data?.[0]);
                                    })
                                    .catch((error) => {
                                      setImageFile("");
                                    });
                                }
                              }}
                              type="file"
                              ref={inputFile}
                              id="file"
                              style={{ display: "none" }}
                            />
                            <div>
                              {!imageFile?.globalFileUrlId && (
                                <img
                                  style={{
                                    maxWidth: "40px",
                                    objectFit: "contain",
                                  }}
                                  src={placeholderImg}
                                  className="img-fluid"
                                  alt="Drag or browse"
                                />
                              )}
                            </div>
                            {imageFile?.globalFileUrlId && (
                              <div
                                className="d-flex align-items-center"
                                onClick={() => {
                                  // dispatch(getDownlloadFileView_Action(imageFile?.id));
                                }}
                              >
                                <AttachmentOutlined
                                  sx={{ marginRight: "5px", color: "#0072E5" }}
                                />
                                <p
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "#0072E5",
                                    cursor: "pointer",
                                  }}
                                >
                                  {imageFile?.fileName || "Attachment"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="upload-common-attachment click-upload-attachment">
                          <div className="input-main position-group-select">
                            {imageFile?.globalFileUrlId && (
                              <>
                                <label className="lebel-bold mr-2">
                                  Upload File
                                </label>
                                <VisibilityOutlined
                                  sx={{
                                    color: "rgba(0, 0, 0, 0.6)",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        imageFile?.globalFileUrlId
                                      )
                                    );
                                  }}
                                />
                              </>
                            )}
                          </div>
                          <p
                            onClick={onButtonClick}
                            className={
                              imageFile?.globalFileUrlId ? " mt-0 " : "mt-4"
                            }
                          >
                            <input
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  attachment_action(
                                    orgId,
                                    "LeaveAndMovement",
                                    15,
                                    buId,
                                    employeeId,
                                    e.target.files,
                                    setLoading
                                  )
                                    .then((data) => {
                                      setImageFile(data?.[0]);
                                    })
                                    .catch((error) => {
                                      setImageFile("");
                                    });
                                }
                              }}
                              type="file"
                              id="file"
                              ref={inputFile}
                              style={{ display: "none" }}
                            />
                            <div style={{ fontSize: "12px" }}>
                              {!imageFile?.globalFileUrlId && (
                                <>
                                  <FileUpload
                                    sx={{
                                      marginRight: "5px",
                                      fontSize: "16px",
                                    }}
                                  />{" "}
                                  Click to upload
                                </>
                              )}
                            </div>
                            {imageFile?.globalFileUrlId && (
                              <div
                                className="d-flex align-items-center"
                                onClick={() => {
                                  // dispatch(getDownlloadFileView_Action(imageFile?.globalFileUrlId));
                                }}
                              >
                                <AttachmentOutlined
                                  sx={{ marginRight: "5px", color: "#0072E5" }}
                                />
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "#0072E5",
                                    cursor: "pointer",
                                  }}
                                >
                                  {imageFile?.fileName || "Attachment"}
                                </div>
                              </div>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </>
    )
  );
}
