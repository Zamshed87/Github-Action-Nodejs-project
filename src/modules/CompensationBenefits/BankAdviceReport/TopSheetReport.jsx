import React from "react";

const TopSheetReport = () => {
  return (
    <>
      <div>
        <table className="pdf-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Workplace</th>
              <th>Department</th>
              <th>Section</th>
              <th>ID NO</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Basic</th>
              <th>Gross</th>
              <th className="calendar-name">Calendar Name</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Late</th>
              <th>OT Hour</th>
              <th>OT Rate</th>
              <th>Net Payable</th>
              <th>Signature</th>
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
};

export default TopSheetReport;
