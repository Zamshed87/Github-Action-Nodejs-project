/* eslint-disable react-hooks/exhaustive-deps */
import { styled } from "@material-ui/styles";
import { CreateOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AvatarComponent from "../../../../../common/AvatarComponent";
import NoResult from "../../../../../common/NoResult";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const Cardtable = ({
  tableData,
  setView,
  setShow,
  setSingleData,
  rowData,
  loading,
}) => {
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },

    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));

  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [selfEmployee, setSelfEmployee] = useState([]);

  useEffect(() => {
    const findSelfEmployee = tableData?.filter(
      (item) => item?.employeeId === employeeId
    );
    setSelfEmployee(findSelfEmployee);
  }, [tableData]);

  return (
    <div className="table-card-styled pt-3">
      {selfEmployee?.length > 0 ? (
        <table className="table reschedule-table ">
          <thead>
            <tr>
              <th scope="col">
                <div className="d-flex align-items-center  ">
                  Employee
                  {/* <SortingIcon /> */}
                </div>
              </th>
              <th scope="col">Designation</th>
              <th scope="col">Department</th>
              <th scope="col">
                <div className="d-flex align-items-center  ">
                  Loan Type & Date
                  {/* <SortingIcon /> */}
                </div>
              </th>
              <th>Loan Details</th>
              <th scope="col">Due Details</th>
              <th scope="col">Reschedule Details</th>
              <th className="text-right">Reschedule Date</th>
              <th className="m-0 p-0"></th>
            </tr>
          </thead>
          <tbody>
            {selfEmployee?.map((data, i) => (
              <tr
                key={i}
                className="hasEvent"
                onClick={() => {
                  setSingleData(data);
                  setView(true);
                }}
              >
                <td>
                  <div className="d-flex align-items-center">
                    <div className="emp-avatar">
                      <AvatarComponent
                        classess=""
                        letterCount={1}
                        label={data?.employeeName}
                      />
                    </div>
                    <div className="ml-2">
                      <div className="">
                        {data?.employeeName}{" "}
                        {data?.employeeCode && `[${data?.employeeCode}]`}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{data?.designationName}</td>
                <td>{data?.departmentName}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <p className="type"> {data?.loanType}</p>

                    <LightTooltip
                      title={
                        <div className="movement-tooltip p-2">
                          <p className="tooltip-title">Reason</p>
                          <p className="tooltip-subTitle mb-0">
                            {data?.description}
                          </p>
                        </div>
                      }
                      arrow
                    >
                      <InfoOutlined sx={{ marginLeft: "12px" }} />
                    </LightTooltip>
                  </div>
                  <div>{dateFormatter(data?.applicationDate)}</div>
                </td>
                <td>
                  <p>BDT {data?.approveLoanAmount}</p>
                  <div>{data?.approveNumberOfInstallment} installments</div>
                </td>
                <td>
                  <p>BDT {data?.remainingBalance}</p>
                  <div>{data?.dueInstallment} installments</div>
                </td>
                <td>
                  {data?.reScheduleNumberOfInstallment ? (
                    <>
                      <p>BDT {data?.reScheduleNumberOfInstallmentAmount}</p>
                      <div>
                        {data?.reScheduleNumberOfInstallment} installments
                      </div>
                    </>
                  ) : null}
                </td>
                <td className="text-right">
                  <p>{dateFormatter(data?.effectiveDate)}</p>
                </td>
                <td className="m-0 p-0">
                  <button
                    type="button"
                    className="iconButton mt-0 mt-md-2 mt-lg-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSingleData(data);
                      setShow(true);
                    }}
                  >
                    <CreateOutlined />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>{!loading && <NoResult title="No Result Found" para="" />}</>
      )}
    </div>
  );
};

export default Cardtable;
