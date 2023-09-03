/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { ArrowBack, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { customStylesSmall } from "../../../utility/selectCustomStyle";
import {
  employementTypes,
  salaryBreakdownList as allSalaryBreakdownList
} from "./helper";
import "./styles.css";

//
//
const BreakdownSalaryAssign = () => {
  const [salaryBreakdownList, setSalaryBreakDownList] = useState(
    allSalaryBreakdownList
  );
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => dispatch(setFirstLevelNameAction("Administration")), []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        actions.resetForm(initialValues);
      }}
    >
      {({ values, setFieldValue, errors, touched, handleSubmit }) => (
        <div className="table-card breakdown-salary-assign-page-wrapper">
          <div className="table-card-heading">
            <h2 style={{ color: "#344054" }}>
              <IconButton onClick={() => history.goBack()}>
                <ArrowBack style={{ width: "20px", marginRight: "5px" }} />
              </IconButton>
              Create Breakdown Salary Assign
            </h2>
          </div>
          <div className="table-card-body about-info-card p-0 mt-3">
            <Form onSubmit={handleSubmit}>
              <div
                className="p-4"
                style={{ borderBottom: "1px solid #EAECF0" }}
              >
                <div className="w-25">
                  <label style={{ marginBottom: "10px" }}>
                    Select Employement Type
                  </label>
                  <FormikSelect
                    name="employementType"
                    options={employementTypes}
                    value={values?.employementType}
                    onChange={(valueOption) =>
                      setFieldValue("employementType", valueOption)
                    }
                    placeholder=""
                    styles={customStylesSmall}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="mt-4">
                  <label
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "#344054",
                      marginBottom: "1em",
                    }}
                  >
                    Primary Element Breakdown
                  </label>

                  <div className="primary-element-assign-form-input-wrapper">
                    <label>Basic Salary</label>
                    <div className="d-flex align-items-center">
                      <FormikInput
                        classes="input-sm"
                        className="form-control"
                        type="text"
                        name="basicSalary"
                        value={values?.basicSalary}
                        onChange={(e) =>
                          setFieldValue("basicSalary", e.target.value)
                        }
                        errors={errors}
                        touched={touched}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  <div className="primary-element-assign-form-input-wrapper">
                    <label>House Rent</label>
                    <div className="d-flex align-items-center">
                      <FormikInput
                        classes="input-sm"
                        className="form-control"
                        type="text"
                        name="houseRent"
                        value={values?.houseRent}
                        onChange={(e) =>
                          setFieldValue("houseRent", e.target.value)
                        }
                        errors={errors}
                        touched={touched}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  <div className="primary-element-assign-form-input-wrapper">
                    <label>Medical Allowance</label>
                    <div className="d-flex align-items-center">
                      <FormikInput
                        classes="input-sm"
                        className="form-control"
                        type="text"
                        name="medicalAllowance"
                        value={values?.medicalAllowance}
                        onChange={(e) =>
                          setFieldValue("medicalAllowance", e.target.value)
                        }
                        errors={errors}
                        touched={touched}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>

                  <div className="primary-element-assign-form-input-wrapper">
                    <label>Conveyance Allowance</label>
                    <div className="d-flex align-items-center">
                      <FormikInput
                        classes="input-sm"
                        className="form-control"
                        type="text"
                        name="conveyanceAllowance"
                        value={values?.conveyanceAllowance}
                        onChange={(e) =>
                          setFieldValue("conveyanceAllowance", e.target.value)
                        }
                        errors={errors}
                        touched={touched}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <button type="submit" className="btn btn-green">
                  Add
                </button>
              </div>
            </Form>
          </div>
          <div
            className="table-card-heading"
            style={{ border: "none", margin: "1em 0" }}
          >
            <h2 style={{ color: "#344054" }}>Employement Breakdown List</h2>
          </div>

          <div className="table-card-body">
            <div className="table-card-styled tableOne">
              <table className="table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Employement Type</th>
                    <th>Basic Salary</th>
                    <th>House Rent</th>
                    <th>Medical Allowance</th>
                    <th>Conveyance Allowance</th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {salaryBreakdownList?.map((item, index) => (
                    <tr key={index} className="hasEvent">
                      <td>{index + 1}</td>
                      <td>{item?.employementType}</td>
                      <td>{item?.basicSalary}%</td>
                      <td>{item?.houseRent}%</td>
                      <td>{item?.medicalAllowance}%</td>
                      <td>{item?.conveyanceAllowance}%</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end">
                          <button className="iconButton">
                            <EditOutlined sx={{ fontSize: "20px" }} />
                          </button>
                          <button
                            type="button"
                            className="iconButton mt-0 mt-md-2 mt-lg-0"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default BreakdownSalaryAssign;

const initialValues = {
  employementType: { label: "", value: "" },
  basicSalary: "",
  houseRent: "",
  medicalAllowance: "",
  conveyanceAllowance: "",
};

const validationSchema = Yup.object().shape({
  employementType: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }),
  basicSalary: Yup.string(),
  houseRent: Yup.string(),
  medicalAllowance: Yup.string(),
  conveyanceAllowance: Yup.string(),
});
