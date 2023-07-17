/* eslint-disable no-unused-vars */
import { useState } from "react";
import PrintView from "../../../../common/PrintView";

const tableData = [
  {
    leaveType: "Casual Leave",
    dateRange: "11/02/21-21/02/21",
    appDate: "21/02/2021",
    duration: "10",
    Reason: "Personal Problem",
  },
];

const RosterReportPrint = () => {
  const [rowDto, setRowDto] = useState([...tableData]);
  return (
    <>
      <PrintView isSignature>
        <div className="goForPrintBody">
          <div className="table-title">
            <h4>Roster Report</h4>
          </div>
          <div className="table-body">
            <table className="table print-table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Department</th>
                  <th scope="col">Roster Group Name</th>
                  <th scope="col">Calendar Name</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td>Md.Mahabub Hossain [123]</td>
                      <td>Security Guard</td>
                      <td>HR & Admin</td>
                      <td>
                        Triple Shift ACB
                        <br />
                        (Fri Offday)
                      </td>
                      <td>
                        Shift-c
                        <br />
                        (Fri Offday)
                      </td>
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

export default RosterReportPrint;
