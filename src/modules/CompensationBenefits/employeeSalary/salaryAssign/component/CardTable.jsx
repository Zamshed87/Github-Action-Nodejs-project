import React from "react";
import Chips from "../../../../../common/Chips";
import AvatarComponent from "../../../../../common/AvatarComponent";
import { toast } from "react-toastify";
import { numberWithCommas } from "../../../../../utility/numberWithCommas";
import { getBreakdownListDDL, getByIdBreakdownListDDL } from "../helper";
import { shallowEqual, useSelector } from "react-redux";

const CardTable = ({ propsObj }) => {
  const {
    rowDto,
    setSalaryInfoId,
    setSideDrawer,
    permission,
    defaultPayrollElement,
    setBreakDownList,
    setSingleData,
    setLoading,
    setIsBulk,
    setStep,
    setSelectedEmployee,
  } = propsObj;

  const { orgId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      {rowDto?.map((data, index) => (
        <tr
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            if (!permission?.isEdit)
              return toast.warn("You don't have permission");
            // if (singleData[0]?.EmployeeId === data?.EmployeeId) {
            //   setSideDrawer(true);
            // }
            setSingleData(data);
            setSideDrawer(true);
            setIsBulk(false);
            setStep(1);
            setSelectedEmployee([]);
            setSalaryInfoId(data?.EmployeeId);
            if (data?.intSalaryBreakdownHeaderId) {
              if (data?.Status === "Assigned") {
                getByIdBreakdownListDDL(
                  "ASSIGNED_BREAKDOWN_ELEMENT_BY_EMPLOYEE_ID",
                  orgId,
                  data?.EmployeeId || 0,
                  data?.intSalaryBreakdownHeaderId,
                  setBreakDownList,
                  data?.numNetGrossSalary,
                  setLoading,
                  wId
                );
              }
            } else {
              if (defaultPayrollElement?.length > 0) {
                getBreakdownListDDL(
                  "BREAKDOWN ELEMENT BY ID",
                  orgId,
                  defaultPayrollElement[0]?.value,
                  0,
                  setBreakDownList
                );
              }
            }
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <td>
            <p className="tableBody-title pl-1">{index + 1}</p>
          </td>
          <td>
            <p className="tableBody-title pl-1">{data?.EmployeeCode}</p>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div className="emp-avatar">
                <AvatarComponent
                  classess=""
                  letterCount={1}
                  label={data?.EmployeeName}
                />
              </div>
              <div className="ml-2">
                <span className="tableBody-title">{data?.EmployeeName}</span>
              </div>
            </div>
          </td>
          {/* desig */}
          <td>
            <div className="content tableBody-title">
              {data?.DesignationName}
            </div>
          </td>
          <td>
            <div className="content tableBody-title">
              {data?.WorkplaceGroupName}
            </div>
          </td>
          {wgId === 3 ? (
            <>
              <td>
                <div className="content tableBody-title">{data?.wingName}</div>
              </td>
              <td>
                <div className="content tableBody-title">
                  {data?.soleDepoName}
                </div>
              </td>
              <td>
                <div className="content tableBody-title">
                  {data?.regionName}
                </div>
              </td>
              <td>
                <div className="content tableBody-title">{data?.areaName}</div>
              </td>
              <td>
                <div className="content tableBody-title">
                  {data?.TerritoryName}
                </div>
              </td>
            </>
          ) : null}
          {/* dept */}
          <td>
            <div className="content tableBody-title">
              {data?.DepartmentName}
            </div>
          </td>
          <td>
            <div className="content tableBody-title text-right">
              {data?.PerdaySalary !== 0
                ? numberWithCommas(data?.PerdaySalary)
                : ""}
            </div>
          </td>
          <td>
            <div className="content tableBody-title text-right mr-3">
              {numberWithCommas(data?.numBasicORGross) || ""}
            </div>
          </td>
          <td>
            <div className="content tableBody-title text-right mr-3">
              {data?.numNetGrossSalary !== 0
                ? numberWithCommas(data?.numNetGrossSalary)
                : ""}
            </div>
          </td>
          <td className="text-center">
            {data?.Status === "Assigned" && (
              <Chips label="Assigned" classess="success p-2" />
            )}
            {data?.Status === "Not Assigned" && (
              <Chips label="Not Assigned" classess="secondary p-2" />
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default CardTable;
