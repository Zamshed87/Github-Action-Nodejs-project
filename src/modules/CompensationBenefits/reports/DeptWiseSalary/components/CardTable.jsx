import React from "react";
import ScrollableTable from "../../../../../common/ScrollableTable";

const CardTable = ({ rowDto }) => {
  return (
    <>
      <ScrollableTable>
        <thead>
          <th>Department</th>
          <th className="text-center">Man Power</th>
          <th className="text-center">O.T AMT</th>
          <th className="text-center">E.SIDE</th>
          <th className="text-center">N/A AMT</th>
          <th className="text-center">ATT. Bonus</th>
          <th className="text-center">Salary</th>
          <th className="text-center">Gross Salary</th>
          <th className="text-center">C.B.A Subscription</th>
          <th className="text-center">Deduct AMT</th>
          <th className="text-center">Net Payable</th>
        </thead>
        <tbody>
          {rowDto?.length > 0 &&
            rowDto.map((data, index) => (
              <tr key={index}>
                <td>{data?.departmentName}</td>
                <td>
                  <p
                    className="text-center"
                    style={{ color: "rgba(0, 0, 0, 0.7)" }}
                  >
                    {data?.manPowerCount}
                  </p>
                </td>
                <td className="text-center">{data?.overTimeAmount}</td>
                <td className="text-center">{data?.extraSideDutyAmount}</td>
                <td className="text-center">{data?.nightDutyAmount}</td>
                <td className="text-center">{data?.attendanceBonusAmount}</td>
                <td className="text-center">{data?.salary}</td>
                <td className="text-center">{data?.grossSalary}</td>
                <td className="text-center">{data?.cbaAmount}</td>
                <td className="text-center">{data?.deductAmount}</td>
                <td className="text-center">{data?.netPayable}</td>
              </tr>
            ))}
        </tbody>
      </ScrollableTable>
    </>
  );
};

export default CardTable;
