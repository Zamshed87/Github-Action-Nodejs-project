import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import ScrollableTable from "../../../../../common/ScrollableTable";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const ScrollTable = ({ objProps }) => {
  const { rowDto, status, setStatus, statusDDL, values, filterActiveInactive } =
    objProps;
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
 
  return (
    <>
      <ScrollableTable
        classes="salary-process-table"
        secondClasses="table-card-styled tableOne scroll-table-height"
      >
        <thead>
          <tr>
            <th style={{ width: "30px" }}>
              <div>SL</div>
            </th>
            <th>
              <div>Code</div>
            </th>
            <th
              className="fixed-column"
              style={{ left: "125px" }}
              // style={{ minWidth: "250px" }}
            >
              <div>Employee Name</div>
            </th>
            <th style={{ minWidth: "220px" }}>
              <div>Designation</div>
            </th>
            <th style={{ minWidth: "150px" }}>Department</th>
            <th style={{ minWidth: "150px" }}>Department Section</th>
            <th style={{ minWidth: "120px", textAlign: "center" }}>
              <div> Employment Type</div>
            </th>
            <th>
              <div>Date of Joining</div>
            </th>
            <th style={{ minWidth: "100px" }}>
              <div>Payroll Group</div>
            </th>
            <th style={{ minWidth: "150px" }}>
              <div>{supervisor || "Supervisor"}</div>
            </th>
            <th>
              <div>Date of Permanent</div>
            </th>
            <th style={{ minWidth: "150px" }}>
              <div>Father's Name</div>
            </th>
            <th style={{ minWidth: "150px" }}>
              <div>Mother's Name</div>
            </th>
            <th style={{ minWidth: "300px" }}>
              <div>Present Address</div>
            </th>
            <th style={{ minWidth: "250px" }}>
              <div>Permanent Address</div>
            </th>
            <th style={{ minWidth: "180px" }}>
              <div>Employee Email</div>
            </th>
            <th style={{ minWidth: "100px" }}>
              <div> DoB</div>
            </th>
            <th style={{ minWidth: "100px" }}>
              <div>Religion</div>
            </th>
            <th style={{ minWidth: "80px" }}>
              <div>Gender</div>
            </th>
            <th style={{ minWidth: "100px" }}>
              <div>Marital Status</div>
            </th>
            <th style={{ minWidth: "100px" }}>
              <div>Blood Group</div>{" "}
            </th>
            <th style={{ minWidth: "120px" }}>
              <div>Mobile</div>
            </th>
            <th style={{ minWidth: "130px" }}>
              <div>NID</div>
            </th>
            <th style={{ minWidth: "120px" }}>
              <div>BID</div>
            </th>
            <th style={{ minWidth: "250px" }}>
              <div>Bank Name</div>
            </th>
            <th style={{ minWidth: "200px" }}>
              <div>Branch</div>
            </th>
            <th style={{ minWidth: "140px" }}>
              <div>Account No</div>
            </th>
            <th style={{ minWidth: "120px" }}>
              <div>Routing</div>
            </th>
            {/* <th className="text-right" style={{ minWidth: "50px" }}>
              <div>Basic</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>House</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>Medical</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>Conveyance</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>Washing</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>Special</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>CBA</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>Gross Salary</div>
            </th>
            <th className="text-right" style={{ minWidth: "100px" }}>
              <div>Total Salary</div>
            </th> */}
            <th className="text-center" style={{ minWidth: "100px" }}>
              <div className="sortable d-flex align-items-center justify-content-center">
                <span>Status</span>
                <span>
                  <Select
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                      },
                      "& .MuiSelect-select": {
                        paddingRight: "15px !important",
                        marginTop: "-15px",
                      },
                    }}
                    className="selectBtn"
                    name="status"
                    IconComponent={
                      status && status !== "Active"
                        ? ArrowDropUp
                        : ArrowDropDown
                    }
                    value={values?.status}
                    onChange={(e) => {
                      filterActiveInactive(e.target.value?.label);
                      setStatus(e.target.value?.label);
                    }}
                  >
                    {statusDDL?.length > 0 &&
                      statusDDL?.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item}>
                            {item?.label}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.length > 0 &&
            rowDto?.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className="tableBody-title">{index + 1}</div>{" "}
                </td>
                <td>
                  <div className="tableBody-title">{data?.EmployeeCode}</div>{" "}
                </td>
                <td className="fixed-column" style={{ left: "125px" }}>
                  <div className="employeeInfo d-flex align-items-center">
                    <AvatarComponent
                      letterCount={1}
                      label={data?.EmployeeName}
                    />
                    <div className="employeeTitle ml-2">
                      <p className="employeeName tableBody-title">
                        {data?.EmployeeName}{" "}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.Designation}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.strDepartment}</div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {data?.DepartmentSection}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {data?.EmploymentType ? data?.EmploymentType : "-"}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {dateFormatter(data?.DateOfJoining)}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.PayrollGroup}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.Supervisor}</div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {dateFormatter(data?.DateOfConfirmation)}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {data?.FatherName ? data?.FatherName : "-"}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.MotherName}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.PresentAddress}</div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {data?.PermanentAddress}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.Email}</div>
                </td>
                <td>
                  <div className="tableBody-title">
                    {dateFormatter(data?.DateOfBirth)}
                  </div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.Religion}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.Gender}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.MaritialStatus}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.BloodGroup}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.MobileNo}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.NID}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.BirthID}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.BankName}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.BranchName}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.AccountNo}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data?.RoutingNo}</div>
                </td>
                {/* <td className="text-right">
                  <div className="tableBody-title">{data?.BasicSalary}</div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">{data?.HouseAllowance}</div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">
                    {data?.MedicalAllowance}
                  </div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">
                    {data?.ConveyanceAllowance}
                  </div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">
                    {data?.WashingAllowance}
                  </div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">
                    {data?.SpecialAllowance}
                  </div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">{data?.CBA}</div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">{data?.GrossSalary}</div>
                </td>
                <td className="text-right">
                  <div className="tableBody-title">{data?.TotalSalary}</div>
                </td> */}
                <td className="text-center">
                  {data?.EmpStatus === "Active" ? (
                    <Chips label="Active" classess="success" />
                  ) : (
                    <Chips label="Inactive" classess="mx-2 danger" />
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </ScrollableTable>
    </>
  );
};

export default ScrollTable;
