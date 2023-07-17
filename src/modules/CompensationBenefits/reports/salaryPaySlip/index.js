/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ScrollableTable from "../../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  dateFormatter,
  getMonthwithYear,
} from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import PopOverFilter from "./components/PopOverFilter";
import { getSalaryDetailsAction } from "./helper";
import "./saleryPayslip.css";
import TimeSheetHeading from "./TimeSheetHeading.jsx";

const initData = {
  search: "",
  month: `${new Date().getFullYear()}-0${new Date().getMonth() + 1}`,
  workplaceGroup: "",
  department: "",
  designation: "",
  employee: "",
};

export default function AttendanceReport() {
  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    getData();
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [monthValue, setMonthValue] = useState(null);

  const monthYear = `${new Date().getFullYear()}-0${new Date().getMonth() + 1}`;
  const searchData = (keywords) => {
    try {
      if (!keywords) {
        setRowDto([...allData]);
        return;
      }
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      let newData = allData?.filter(
        (item) =>
          regex.test(
            item?.salaryGenerateHeaderObj?.strEmployeeName?.toLowerCase()
          ) ||
          regex.test(
            item?.salaryGenerateHeaderObj?.strEmployeeCode?.toLowerCase()
          ) ||
          regex.test(
            item?.salaryGenerateHeaderObj?.strDesignation?.toLowerCase()
          ) ||
          regex.test(
            item?.salaryGenerateHeaderObj?.strDepartment?.toLowerCase()
          )
      );
      setRowDto([...newData]);
      setLoading(false);
    } catch (error) {
      setRowDto([]);
      setLoading(false);
    }
  };

  const getData = () => {
    let date = new Date();
    getSalaryDetailsAction(
      buId,
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      0,
      0,
      0,
      setLoading,
      setRowDto,
      setAllData
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 81) {
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
                    <TimeSheetHeading
                      values={values}
                      setFieldValue={setFieldValue}
                      handleClick={handleClick}
                      searchData={searchData}
                      setLoading={setLoading}
                      buId={buId}
                      isFilter={isFilter}
                      setIsFilter={setIsFilter}
                      resetForm={resetForm}
                      setMonthValue={setMonthValue}
                      initData={initData}
                    />
                    <div className="pt-3">
                      <h6
                        style={{
                          color: "rgba(0, 0, 0, 0.7)",
                          fontSize: "14px",
                        }}
                      >
                        Salary Details of
                        {` ${getMonthwithYear(
                          monthValue ? monthValue : monthYear
                        )}`}
                      </h6>
                    </div>
                    <div className="table-card-body">
                      <ScrollableTable>
                        <thead>
                          {/* <th>SL</th> */}
                          <th>Employee</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Employment Type</th>
                          <th
                            className="text-right"
                            style={{ minWidth: "100px" }}
                          >
                            Date of Joining
                          </th>
                          <th>Bank Name</th>
                          <th>Branch Name</th>
                          <th>Bank Account Name</th>
                          <th className="text-center">Account Number</th>
                          <th className="text-center">Routing Number</th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Working Days
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Present
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Absent
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Late
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Movement
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Sick Leave
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Casual Leave
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Earned Leave
                          </th>
                          <th className="text-center">Leave Without Pay</th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Off Day
                          </th>
                          <th
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            Holiday
                          </th>
                          <th className="text-right">Basic</th>
                          <th className="text-right">House Allowance</th>
                          <th className="text-right">Medical Allowance</th>
                          <th className="text-right">Transport Allowance</th>

                          <th className="text-right">Provident Fund</th>
                          <th className="text-right">Gratuity Fund</th>

                          <th className="text-right">Net Payable Salary</th>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto.map((data, index) => (
                              <tr
                                key={index}
                                onClick={() =>
                                  getPDFAction(
                                    `/emp/PdfAndExcelReport/EmployeeBasedSalaryReport?EmployeeId=${data?.salaryGenerateHeaderObj?.intEmployeeId}&Year=${data?.salaryGenerateHeaderObj?.intYearId}&Month=${data?.salaryGenerateHeaderObj?.intMonthId}`,
                                    setLoading
                                  )
                                }
                              >
                                {/* <td>{index+1}</td> */}
                                <td>
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strEmployeeName
                                  }
                                  [
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strEmployeeCode
                                  }
                                  ]
                                </td>
                                <td>
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strDesignation
                                  }
                                </td>
                                <td>
                                  {data?.salaryGenerateHeaderObj?.strDepartment}
                                </td>
                                <td>
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strEmploymentType
                                  }
                                </td>
                                <td className="text-right">
                                  {dateFormatter(
                                    data?.salaryGenerateHeaderObj
                                      ?.dteJoiningDate
                                  )}
                                </td>
                                <td>
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strFinancialInstitution
                                  }
                                </td>
                                <td>
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strBankBranchName
                                  }
                                </td>
                                <td>
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strAccountName
                                  }
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.strAccountNo}
                                </td>
                                <td className="text-center">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.strRoutingNumber
                                  }
                                </td>
                                <td className="text-center">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.intTotalWorkingDays
                                  }
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intPresent}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intAbsent}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intLate}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intMovement}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intSl}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intCl}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intEl}
                                </td>
                                <td className="text-center">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.intTotalWithoutPayLeaveCal
                                  }
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intOffday}
                                </td>
                                <td className="text-center">
                                  {data?.salaryGenerateHeaderObj?.intHolyday}
                                </td>
                                <td className="text-right">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.numBasicSalary
                                  }
                                </td>
                                <td className="text-right">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.numHouseRentAllowance
                                  }
                                </td>
                                <td className="text-right">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.numMedicalAllowance
                                  }
                                </td>
                                <td className="text-right">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.numConveyanceAllowance
                                  }
                                </td>

                                <td className="text-right">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.numTotalPfbalance
                                  }
                                </td>
                                <td className="text-right">
                                  {data?.salaryGenerateHeaderObj?.numGratuity}
                                </td>

                                <td className="text-right">
                                  {
                                    data?.salaryGenerateHeaderObj
                                      ?.numNetPayableAmountCal
                                  }
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </ScrollableTable>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
            <PopOverFilter
              propsObj={{
                id,
                open,
                anchorEl,
                setAnchorEl,
                handleClose,
                setFieldValue,
                values,
                errors,
                touched,
                setLoading,
                setAllData,
                setRowDto,
                buId,
                orgId,
                setIsFilter,
                setMonthValue,
                resetForm,
              }}
              masterFilterHandler={handleClick}
            />
          </>
        )}
      </Formik>
    </>
  );
}
