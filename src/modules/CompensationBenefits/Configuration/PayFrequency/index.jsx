/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Chips from "../../../../common/Chips";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getPayrollFrequencyAllLanding } from "./helper";
import "./styles.css";

const initData = {
  search: "",
};

export default function PayFrequency() {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => { };
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([]);

  const getData = () => {
    getPayrollFrequencyAllLanding("PayFrequency", buId, setRowDto, setLoading);
  };
  // const obj = {tableName:"PayrollGroup",buId, orgId, empId, setRowDto,setAllData, setLoading };
  useEffect(() => {
    getData();
  }, [buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 75) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, []);

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
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="col-md-12">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="table-card-head-right"></div>
                    </div>
                    <div className="table-card-body">
                      <div className="table-responsive table-card-styled tableOne">
                        <table className="table align-middle">
                          <thead style={{ color: "#212529" }}>
                            <tr>
                              <th className="px-2">SL</th>
                              <th>
                                <div className="d-flex align-items-center justify-content-start">
                                  Payroll Frequency
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center">
                                  Code
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-center">
                                  Active
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto.map((item, index) => {
                              const {
                                PayFrequencyCode,
                                PayFrequencyName,
                                IsActive,
                              } = item;
                              return (
                                <tr>
                                  <td><div className="tableBody-title" style={{ width: "fit-content", marginLeft: ".5em" }}>{index + 1}</div></td>
                                  <td>
                                    <div className="tableBody-title">
                                      {PayFrequencyName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title">
                                      {PayFrequencyCode}
                                    </div>
                                  </td>

                                  <td>
                                    <div className="status text-center">
                                      {IsActive ? (
                                        <Chips
                                          label="active"
                                          classess="success"
                                        />
                                      ) : (
                                        <Chips
                                          label="inactive"
                                          classess="danger"
                                        />
                                      )}
                                    </div>
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
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
