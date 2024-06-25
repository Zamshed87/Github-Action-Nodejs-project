/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import PrintView from "../../../../common/PrintView";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { getAttendenceDetailsReport } from "../helper";
import "./attendanceReport.css";

const GorForPrint = () => {
  const location = useLocation();
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const empId = location.state.employeeId;
  const fromDate = location.state.fromDate;
  const toDate = location.state.toDate;

  const [rowDto, setRowDto] = useState(null);
  const [empDto, setEmpDto] = useState(null);
  const [, setAllData] = useState(null);
  const [buDto, setBudto] = useState(null);

  useEffect(() => {
    getAttendenceDetailsReport(0, empId, fromDate, toDate, setRowDto);
    getPeopleDeskAllLanding(
      "EmployeeBasicById",
      "",
      "",
      empId,
      setEmpDto,
      setAllData
    );
    getPeopleDeskAllLanding(
      "BusinessUnitById",
      "",
      "",
      buId,
      setBudto,
      setAllData
    );
  }, []);

  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  return (
    <>
      <PrintView isSignature singleData={buDto?.Result[0]}>
        <div className="goForPrintBody">
          <div className="sub-header">
            <div className="row">
              <div className="col-lg-4">
                <h6>{empDto?.Result[0]?.EmployeeName}</h6>
                <h5>
                  {empDto?.Result[0]?.DesignationName},
                  {empDto?.Result[0]?.EmploymentTypeName}
                </h5>
                <h5>{empDto?.Result[0]?.DepartmentName}</h5>
              </div>
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-4">
                    <p>Workplace Group</p>
                    <p>Business Unit</p>
                    <p>{supervisor || "Supervisor"}</p>
                  </div>
                  <div className="col-lg-8">
                    <small>{empDto?.Result[0]?.WorkplaceName}</small>
                    <small>{empDto?.Result[0]?.BusinessUnitName}</small>
                    <small>{empDto?.Result[0]?.SupervisorName}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-title">
            <h4>
              Attendance Details From {dateFormatter(fromDate)} To{" "}
              {dateFormatter(toDate)}
            </h4>
          </div>
          <div className="table-body">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">In-time</th>
                  <th scope="col">Out-time</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reason</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td>{data?.Attendance}</td>
                      <td>{data?.InTime}</td>
                      <td>{data?.OutTime}</td>
                      <td>{data?.AttStatus}</td>
                      <td>{data?.MReason}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PrintView>
    </>
  );
};

export default GorForPrint;
