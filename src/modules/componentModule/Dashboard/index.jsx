import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import FormikSelect from "../../../common/FormikSelect";
import { dateFormatterForDashboard } from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { currentYear } from "../../timeSheet/attendence/attendanceApprovalRequest/utilities/currentYear";
import "./style.css";
// import FilterListIcon from "@mui/icons-material/FilterList";
import { Clear } from "@mui/icons-material";
import { FormGroup, IconButton, Popover } from "@mui/material";
import FormikToggle from "../../../common/FormikToggle";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { blueColor, gray700, gray900 } from "../../../utility/customColor";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
// import EmployeeDashboard from "./components/EmployeeDashboard";

const validationSchema = Yup.object({});
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
  type: { value: 1, label: "Employee" },
};

const fakeCardData = [
  {
    header: "Today Attendence",
    value: {
      present: 44,
      late: 23,
      absent: 7,
    },
    border: "#F79009",
  },
  // {
  //   header: "Today Attendance Missed",
  //   value: {
  //     today: 72,
  //     yesterday: 31,
  //   },
  //   border: "#7A5AF8",
  // },
  {
    header: "Movement",
    value: {
      today: 72,
      yesterday: 31,
      tommorrow: 51,
    },
    border: "#D444F1",
  },
  {
    header: "Leave",
    value: {
      today: 72,
      tommorrow: 51,
    },
    border: "#F63D68",
  },
  {
    header: "Overtime",
    value: {
      today: "193 Hrs, 20 Min",
      tommorrow: "200 Hrs, 32 Min",
    },
    border: "#2970FF",
  },
  {
    header: "Approval",
    value: {
      total: 100,
    },
    border: "#34A853",
  },
];

const NewDashboard = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Dashboard"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [modifyData, setModifyData] = useState([]);

  const handleChange = (event) => {
    setModifyData(
      modifyData.map((item) => {
        if (item?.header === event.target.name) {
          return {
            ...item,
            isView: event?.target?.checked,
          };
        } else {
          return {
            ...item,
          };
        }
      })
    );
  };

  useEffect(() => {
    const fakeData = fakeCardData?.map((item) => ({
      ...item,
      isView: true,
    }));
    setModifyData(fakeData);
  }, []);

  const onRemoveCardHandeler = (key) => {
    setModifyData(
      modifyData.map((item) => {
        if (item?.header === key) {
          return {
            ...item,
            isView: false,
          };
        } else {
          return {
            ...item,
          };
        }
      })
    );
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <div className="table-card newDashboard">
            <div className="greatingHeading">
              <div>
                <p
                  style={{
                    color: "#344054",
                    fontWeight: 400,
                    fontSize: "12px",
                  }}
                >
                  {dateFormatterForDashboard()}
                </p>
                <h4
                  style={{
                    color: "#667085",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                  }}
                >
                  Hello Ishrat Jahan, Welcom Back !
                </h4>
              </div>

              <div className="selectType newDashboardSelect">
                {/* <div className="filterBtn">
                  <button
                    type="button"
                    className="iconButton mt-0 mt-md-2 mt-lg-0 px-2"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      e.stopPropagation();
                    }}
                  >
                    <FilterListIcon />
                    <span className="ml-2">Filter</span>
                  </button>
                </div> */}
                <div className="input-field-main">
                  <FormikSelect
                    name="type"
                    isClearable={false}
                    options={[
                      { value: 1, label: "Employee" },
                      { value: 2, label: "Manager" },
                      { value: 2, label: "Supervisor" },
                    ]}
                    value={values?.type}
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                    }}
                    styles={{
                      ...customStyles,
                      control: (provided, state) => ({
                        ...provided,
                        minHeight: "30px",
                        height: "30px",
                        borderRadius: "4px",
                        border: `1px solid transparent !important`,
                        ":hover": {
                          backgroundColor: `#eaecf0`,
                          border: `1px solid transparent !important`,
                        },
                        ":focus": {
                          border: `1px solid transparent !important`,
                        },
                        ":focus-within": {
                          border: `1px solid transparent !important`,
                        },
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        fontSize: "14px",
                        color: gray700,
                        height: "22px",
                      }),
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
            {values?.type?.value === 1 ? (
              <EmployeeDashboard />
            ) : values?.type?.value === 2 ? (
              <ManagerDashboard
                fakeCardData={modifyData}
                onRemoveCardHandeler={onRemoveCardHandeler}
              />
            ) : null}
            {/* <ManagerDashboard
              fakeCardData={modifyData}
              onRemoveCardHandeler={onRemoveCardHandeler}
            /> */}
            {/* conditional rendering */}
            {/* <EmployeeDashboard /> */}
            <div>
              <Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "300px",
                    minHeight: "200px",
                    borderRadius: "4px",
                  },
                }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                  setAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "middle",
                }}
              >
                <div
                  className="master-filter-modal-container employeeProfile-src-filter-main"
                  style={{ height: "auto" }}
                >
                  <div className="master-filter-header employeeProfile-src-filter-header">
                    <div></div>
                    <IconButton
                      onClick={() => {
                        setAnchorEl(null);
                      }}
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>
                  <hr />
                  <div className="body-employeeProfile-master-filter">
                    <div className="content-input-field">
                      <FormGroup>
                        {modifyData?.map((item, idx) => {
                          return (
                            <FormikToggle
                              key={idx}
                              name={item?.header}
                              label={item?.header}
                              color={blueColor}
                              checked={item?.isView}
                              onChange={handleChange}
                            />
                          );
                        })}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default NewDashboard;
