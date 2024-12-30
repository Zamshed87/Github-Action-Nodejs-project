import React from "react";
import { dateFormatterReport } from "utility/dateFormatter";
import { convert_number_to_word } from "utility/numberToWord";
import { todayDate } from "utility/todayDate";

export default function IncrementLetter({
  orgId,
  empBasic,
  buName,
  employeeIncrementByIdApi,
  form,
  rowDto,
}: any) {
  return (
    <>
      <p style={{ fontSize: "16px" }} className="mb-5">
        Date: {todayDate()}
      </p>
      <p style={{ fontSize: "16px" }} className="my-2">
        To
      </p>
      <p style={{ fontSize: "16px" }} className="my-2">
        Name: {(empBasic as any)?.employeeProfileLandingView?.strEmployeeName}
      </p>
      <p style={{ fontSize: "16px" }} className="my-2">
        Designation:{" "}
        {(empBasic as any)?.employeeProfileLandingView?.strDesignation}
      </p>
      <p style={{ fontSize: "16px" }} className="my-2">
        Department:{" "}
        {(empBasic as any)?.employeeProfileLandingView?.strDepartment}
      </p>
      <p style={{ fontSize: "16px" }} className="mt-2 mb-3">
        Employee Id:
        {(empBasic as any)?.employeeProfileLandingView?.strEmployeeCode}
      </p>
      <p
        style={{
          fontSize: "16px",
          textAlign: "center",
          textDecoration: "underline",
        }}
        className="my-3"
      >
        <strong>Subject: Salary Increment</strong>
      </p>
      <h2 style={{ fontSize: "16px" }} className="my-2">
        {(empBasic as any)?.employeeProfileLandingView?.strEmployeeName}
      </h2>
      <h2 style={{ fontSize: "16px" }} className="my-2">
        Congratulations!
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        In recognition of your previous performance, we are glad to inform you
        that the {buName} {orgId === 5 ? " (SFOC)" : ""} Management has decided
        to give you an increment of{" "}
        <strong>{employeeIncrementByIdApi?.data?.incrementAmount} BDT</strong>{" "}
        which will be effective from{" "}
        <strong>
          {dateFormatterReport(employeeIncrementByIdApi?.data?.effectiveDate)}
        </strong>
        . Your revised salary breakdown is as follows:
      </p>
      {/* <h3>Your revised monthly salary breakdown is as follows:</h3> */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "40px auto 5px auto",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "5px" }}>
              Salary Components
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "5px",
                textAlign: "right",
              }}
            >
              Amount (BDT)
            </th>
          </tr>
        </thead>
        <tbody>
          {rowDto.map((item: any, index: any) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                {item.strPayrollElementName}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                {item.amount}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              <strong>Total Gross Salary</strong>
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <strong>{form.getFieldsValue(true).grossAmount}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mb-2" style={{ fontSize: "16px", lineHeight: "1.5" }}>
        In Words:{" "}
        <strong>
          {convert_number_to_word(form.getFieldsValue(true).grossAmount)} Taka
          Only
        </strong>
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        We deeply appreciate your contribution and excellent work over the last
        year. Thank you for your agility and focus on delivering business
        results and taking{orgId === 5 ? " (SFOC)" : ""}
        forward.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }} className="my-2">
        With best wishes,
      </p>
      <p
        className="mt-5"
        style={{
          width: "20%",
          borderBottom: "1px solid #000",
        }}
      ></p>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }} className="mt-2">
        {orgId === 5 ? "Adiba S. Ajanee" : ""}
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        {orgId === 5 ? "Deputy Managing Partner" : ""}
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{buName}</p>
    </>
  );
}
