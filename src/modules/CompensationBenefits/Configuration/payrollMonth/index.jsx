/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../../utility/newSelectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import PayrollMonthModal from "./components/PayrollMonthModal";

const initData = {
  search: "",
  year: "",
};
const tableBodyData = [
  {
    id: "1",
    year: "2021",
    month: "January",
    fromDate: "01-Jan-2021",
    toDate: "31-Jan-2021",
    type: "Monthly",
  },
  {
    id: "2",
    year: "2021",
    month: "October",
    fromDate: "09-Oct-2021",
    toDate: "20-Oct-2021",
    type: "Partially",
  },
  {
    id: "3",
    year: "2022",
    month: "May",
    fromDate: "01-May-2022",
    toDate: "30-May-2022",
    type: "Monthly",
  },
  {
    id: "4",
    year: "2022",
    month: "March",
    fromDate: "07-Mar-2022",
    toDate: "10-Mar-2022",
    type: "Partially",
  },
];

const PayRollMonth = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);
  // row Data
  const [rowDto, setRowDto] = useState([...tableBodyData]);

  // for create state
  const [show, setShow] = useState(false);

  const saveHandler = (values) => {
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
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <div className="col-md-12">
              <div className="table-card">
                <div className="table-card-heading">
                  <div></div>
                  <div className="d-flex flex-wrap">
                    <li style={{ marginRight: "24px", listStyle: "none", width: "200px" }}>
                      <div className="input-field-main">
                        <FormikSelect
                          name="year"
                          options={yearDDLAction(5, 10) || []}
                          value={values?.year}
                          // label="Year"
                          placeholder="Year"
                          onChange={(valueOption) => {
                            setFieldValue("year", valueOption);
                          }}
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Payroll Month"}
                        icon={<AddOutlined sx={{ fontSize: "15px" }} />}
                        onClick={(e) => {
                          setShow(true);
                        }}
                      />
                    </li>
                  </div>
                </div>
                <div className="table-card-body mt-2">
                  <div className="table-responsive table-card-styled tableOne table-calendar-setup">
                    <table className="table align-middle mt-3">
                      <thead style={{ color: "#212529" }}>
                        <tr>
                          <th>
                            <div className="pl-3">SL</div>
                          </th>
                          <th>
                            <div className="pl-3">Month</div>
                          </th>
                          <th>
                            <div className="pl-3">Year</div>
                          </th>
                          <th>
                            <div className="pl-3">From Date</div>
                          </th>
                          <th>
                            <div className="pl-3">To Date</div>
                          </th>
                          <th>
                            <div className="pl-3">Type</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="tableBody-title pl-3 py-1">{index + 1}</div>
                              </td>
                              <td>
                                <div className="tableBody-title pl-3">{item.month}</div>
                              </td>
                              <td>
                                <div className="tableBody-title pl-3">{item.year}</div>
                              </td>
                              <td>
                                <div className="tableBody-title pl-3">{item.fromDate}</div>
                              </td>
                              <td>
                                <div className="tableBody-title pl-3">{item.toDate}</div>
                              </td>
                              <td>
                                <div className="tableBody-title pl-3">{item.type}</div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <ViewModal
        size="lg"
        title={`Create Payroll Month`}
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => setShow(false)}
      >
        <PayrollMonthModal setShow={setShow} />
      </ViewModal>
    </>
  );
};

export default PayRollMonth;
