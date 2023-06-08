import {
  LockOutlined,
  MailOutlineOutlined,
  SearchOutlined
} from "@mui/icons-material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { DateRangePicker } from "materialui-daterange-picker";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikDatePicker from "../../../../common/DatePicker";
import DropDownDatePicker from "../../../../common/DropDownDatePicker";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import SiderDrawer from "../../../../common/SiderDrawer";
import CircleChart from "../../../dashboard/Charts/CircleChart";
import AsyncFormikSelect from "./../../../../common/AsyncFormikSelect";
import FilterSearch from "./../../../../common/FilterSearch";
import FormikTextArea from "./../../../../common/FormikTextArea";
import ImageUploadView from "./../../../../common/ImageUploadView";
import LoginInput from "./../../../../common/login/LoginInput";
import MasterFilter from "./../../../../common/MasterFilter";
import PrimaryButton from "./../../../../common/PrimaryButton";
import SideMenu from "./../../../../layout/menuComponent/SideMenu";
import { dateFormatter } from "./../../../../utility/dateFormatter";
import {
  customStyles,
  customStylesLarge
} from "./../../../../utility/selectCustomStyle";
import DateFilter from "./DateFilter";
import MasterPopOverFilter from "./masterPopOverFilter/index";

const initData = {
  email: "",
  password: "",
  firstName: "",
  address: "",
  phone: "",
  bio: "",
  description: "",
  country: "",
  employee: "",
  search: "",
  amount: "",
  fromRange: "",
  noted: "",
  details: "",
  inputFieldType: "",
  searchString: "",
};

const validationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
  lastName: Yup.string().required("Last Name is required"),
  phone: Yup.string().required("Phone is required"),
  bio: Yup.string().required("Bio is required"),
  country: Yup.object()
    .shape({
      label: Yup.string().required("Country is required"),
      value: Yup.string().required("Country is required"),
    })
    .typeError("Country is required"),
  amount: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Amount is required"),
  fromRange: Yup.number()
    .min(0, "Salary alaways positive number")
    .required("Salary is required"),
});

export default function FormControl() {
  // image
  const [uploadImage, setUploadImage] = useState([]);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const { buLogo } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const empAttachment_action = async (attachment, cb) => {
    let formData = new FormData();
    attachment.forEach((file) => {
      formData.append("files", file?.file);
    });
    try {
      let { data } = await axios.post(
        "/recruitment/Document/UploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      toast.error(error.response.message || "Document not upload");
    }
  };

  const dataRanges = [{ label: "" }];
  const toggle = () => setDateOpen(false);
  // date module
  const [dateOpen, setDateOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // open
  // const config = {
  //   toolbarSticky: true,
  //   askBeforePasteFromWord: false,
  //   askBeforePasteHTML: false,
  //   readonly: false, // all options from https://xdsoft.net/jodit/doc/
  // };
  const saveHandler = (values) => {};

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${1}&BusinessUnitId=${2}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
  const [sideDrawer, setSideDrawer] = useState(false);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
              <div className="dashboard-head">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="company-logo">
                        <img
                          src={`https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${buLogo}`}
                          alt="logo"
                        />
                      </div>
                    </div>
                    <div className="col-md-10">
                      <div>
                        <h2>Component</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-2">
                    <SideMenu />
                  </div>
                  <div className="col-md-10 my-5">
                    <h2>Form</h2>
                    <div className="my-3">
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Master Filter</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <MasterFilter
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                            }}
                            handleClick={handleClick}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Login Form</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <LoginInput
                            label="Work Email"
                            value={values?.email}
                            name="email"
                            type="email"
                            leadicon={<MailOutlineOutlined />}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-md-3">
                          <LoginInput
                            label="Password"
                            value={values?.password}
                            name="password"
                            type="password"
                            className="form-control"
                            leadicon={<LockOutlined />}
                            passwordicon={" "}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>
                          Dashboard Form Large
                        </h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormikInput
                            value={values?.firstName}
                            name="firstName"
                            type="date"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormikInput
                            label="Last Name"
                            value={values?.lastName}
                            name="lastName"
                            type="text"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>
                          Dashboard Form Small
                        </h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <label>Address</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.address}
                            name="address"
                            type="text"
                            className="form-control"
                            placeholder="Address"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Phone</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.phone}
                            name="phone"
                            type="text"
                            className="form-control"
                            placeholder="Phone"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormikInput
                            classes="input-borderless"
                            label="Noted"
                            value={values?.noted}
                            name="noted"
                            type="text"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Search</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormikInput
                            classes="search-input fixed-width "
                            inputClasses="search-inner-input"
                            placeholder="Search"
                            value={values?.search}
                            name="search"
                            type="text"
                            trailicon={
                              <SearchOutlined sx={{ color: "#323232" }} />
                            }
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Number</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormikInput
                            inputClasses="input-number"
                            label="Number"
                            value={values?.amount}
                            name="amount"
                            type="number"
                            className="form-control"
                            isNumber={true}
                            incrementHandler={(e) => {
                              setFieldValue("amount", +values?.amount + 1);
                            }}
                            decrementHandler={(e) => {
                              if (!values?.amount || values?.amount < 0) {
                                setFieldValue("amount", 0);
                              } else {
                                setFieldValue("amount", +values?.amount - 1);
                              }
                            }}
                            errors={errors}
                            touched={touched}
                          />
                          <FormikInput
                            classes="input-borderless"
                            inputClasses="input-number"
                            label="Salary"
                            value={values?.fromRange}
                            name="fromRange"
                            type="number"
                            className="form-control"
                            isNumber={true}
                            incrementHandler={(e) => {
                              setFieldValue(
                                "fromRange",
                                +values?.fromRange + 1
                              );
                            }}
                            decrementHandler={(e) => {
                              if (!values?.fromRange || values?.fromRange < 0) {
                                setFieldValue("fromRange", 0);
                              } else {
                                setFieldValue(
                                  "fromRange",
                                  +values?.fromRange - 1
                                );
                              }
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Date</h6>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">
                          <FilterSearch
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
                            }}
                            cancelHandler={() =>
                              setFieldValue("searchString", "")
                            }
                            handleClick={handleClick}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div style={{ padding: "10px 16px 13px" }}>
                          <div onClick={() => setDateOpen(!dateOpen)}>
                            <FormikInput
                              classes="search-input input-sm"
                              inputClasses="search-inner-input"
                              placeholder="Select Date Range"
                              value={`${
                                values?.dateRange?.startDate || "Start Date"
                              } - ${values?.dateRange?.endDate || "End Date"}`}
                              name="dateRange"
                              type="text"
                              onChange={(e) => setFieldValue("dateRange", "")}
                              trailicon={
                                <DateRangeIcon sx={{ color: "#323232" }} />
                              }
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <DateRangePicker
                            open={dateOpen}
                            definedRanges={dataRanges}
                            toggle={toggle}
                            wrapperClassName="date-rang-picker simple-date-rang-picker"
                            onChange={(range) => {
                              if (range) {
                                setFieldValue("dateRange", {
                                  startDate: dateFormatter(range?.startDate),
                                  endDate: dateFormatter(range?.endDate),
                                });
                                setDateOpen(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Textarea</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormikTextArea
                            className="form-control"
                            label="Bio"
                            value={values?.bio}
                            name="bio"
                            type="text"
                            rows="5"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <label>Description</label>
                          <FormikTextArea
                            classes="textarea-with-label"
                            value={values?.description}
                            name="description"
                            type="text"
                            placeholder="Description"
                            // disabled
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Rich Text Editor</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <ReactQuill
                            value={values?.details}
                            onChange={(value) =>
                              setFieldValue("details", value)
                            }
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "14px" }}>Select</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormikSelect
                            name="country"
                            options={[
                              { value: 1, label: "BD" },
                              { value: 2, label: "UK" },
                              { value: 3, label: "USA" },
                            ]}
                            value={values?.country}
                            label="Country"
                            onChange={(valueOption) => {
                              setFieldValue("country", valueOption);
                            }}
                            placeholder="Country"
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            isDisabled={false}
                          />
                        </div>
                        <div className="col-md-3">
                          <FormikSelect
                            name="inputFieldType"
                            options={[
                              { value: 1, label: "BD" },
                              { value: 2, label: "UK" },
                              { value: 3, label: "USA" },
                            ]}
                            value={values?.inputFieldType}
                            label="Field Type"
                            onChange={(valueOption) => {
                              setFieldValue("inputFieldType", valueOption);
                            }}
                            placeholder="Field Type"
                            styles={customStylesLarge}
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-3">
                          <label>Employee</label>
                          <AsyncFormikSelect
                            selectedValue={values?.employee}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("employee", valueOption);
                            }}
                            loadOptions={loadUserList}
                          />
                        </div>
                      </div>
                      <div>
                        <DropDownDatePicker
                          values={values}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          label={"From Date"}
                        ></DropDownDatePicker>
                      </div>
                      <div className="row my-5">
                        <div className="col-md-6">
                          <ImageUploadView
                            setOpen={setImageUploadModal}
                            singleDataImageId={""}
                            uploadImageId={uploadImage[0]?.id}
                          />
                        </div>
                      </div>
                      <div className="row my-5">
                        <div className="col-md-2">
                          <PrimaryButton
                            type="submit"
                            className="btn btn-basic"
                            label="Submit"
                          />
                        </div>
                      </div>
                      {/* Date picker */}
                      <FormikDatePicker
                        label="Select Date"
                        value={values?.toDate}
                        name="toDate"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                      <div className="col-md-6 pipeline-stepper">
                        <ul className="stepper">
                          <li className="stepper__item">
                            <div>step 1</div>
                          </li>
                          <li className="stepper__item">
                            <div>step 2</div>
                          </li>
                          <li className="stepper__item">
                            <div>step 3</div>
                          </li>
                          <li className="stepper__item">
                            <div>step 4</div>
                          </li>
                        </ul>
                      </div>

                      <div className="col-md-3">
                        {/* Circle Charts */}
                        <CircleChart />
                      </div>
                      <button
                        className="btn btn-green"
                        onClick={() => setSideDrawer(true)}
                      >
                        Side Drawer
                      </button>
                      <SiderDrawer
                        styles={{
                          width: "50%",
                        }}
                        setIsOpen={setSideDrawer}
                        isOpen={sideDrawer}
                      ></SiderDrawer>
                    </div>
                  </div>
                </div>
              </div>

              {/* DateFilter */}
              <DateFilter
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  setDateOpen,
                  dateOpen,
                }}
                isOnlyDate={true}
              />

              {/* DropZone */}
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={imageUploadModal}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setImageUploadModal(false)}
                onSave={() => {
                  setImageUploadModal(false);
                  empAttachment_action(fileObjects).then((data) => {
                    setUploadImage(data);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

              {/* MasterPopOverFilter */}
              <MasterPopOverFilter
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  setDateOpen,
                  dateOpen,
                }}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

/*
control: (provided, state) => ({
    ...provided,
    minHeight: "40px",
    height: "40px",
    borderRadius: "4px",
  }),

*/
