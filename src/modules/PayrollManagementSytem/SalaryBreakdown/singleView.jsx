import React, { useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Grain } from "@mui/icons-material";
import BackButton from "../../../common/BackButton";
import CircleButton from "../../../common/CircleButton";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { payrollGroupElementList } from "./calculation";

export default function SalaryBreakdownDetails() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [rowDto, setRowDto] = useState([]);

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let salaryBreakdownViewPermission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30260) {
      salaryBreakdownViewPermission = item;
    }
  });

  useEffect(() => {
    if (state?.intSalaryBreakdownHeaderId && !state?.isPerday) {
      payrollGroupElementList(
        orgId,
        state?.intSalaryBreakdownHeaderId,
        setRowDto
      );
    }
  }, [orgId, state]);

  return (
    <>
      {salaryBreakdownViewPermission?.isCreate ? (
        <>
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>View Payroll Group</h2>
              </div>
            </div>
            <div className="card-style" style={{ padding: "12px 10px 10px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <CircleButton
                    icon={<Grain style={{ fontSize: "24px" }} />}
                    title={state?.strSalaryBreakdownTitle}
                    subTitle="Payroll Group Name"
                  />
                </div>
                <div className="col-12">
                  <div className="card-save-border"></div>
                </div>
                <div className="col-12">
                  <div className="salary-breakdown-details">
                    {!state?.isPerday && (
                      <h2>
                        Primary Elements
                        <span
                          className="d-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            history.push({
                              pathname: `/administration/payrollConfiguration/salaryBreakdown`,
                              state: { singleBreakdown: state },
                            });
                          }}
                        >
                          Edit
                        </span>
                      </h2>
                    )}

                    {state?.isDefault ? (
                      <p>Payroll Group is default</p>
                    ) : (
                      <p>Payroll Group is not default</p>
                    )}
                  </div>
                </div>
              </div>

              {!state?.isPerday && (
                <div className="row">
                  <div className="col-lg-4">
                    <div className="salary-breakdown-details-table">
                      <div className="table-card-styled employee-table-card tableOne">
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>Element Name</th>
                              <th>Percentage / Amount</th>
                              <th>Depends On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center">
                                    <div>{index + 1}</div>
                                  </td>
                                  <td>{item?.strPayrollElementName}</td>
                                  {orgId === 10015 ? (
                                    <td>
                                      {item?.isBasic && (
                                        <>(Gross - Conveyance) / 1.6</>
                                      )}
                                      {!item?.isBasic && (
                                        <>
                                          {item?.strBasedOn === "Percentage"
                                            ? item?.numNumberOfPercent
                                            : item?.numAmount}
                                          {item?.strBasedOn === "Percentage"
                                            ? ` % `
                                            : ""}
                                        </>
                                      )}
                                    </td>
                                  ) : (
                                    <td>
                                      {item?.strBasedOn === "Percentage"
                                        ? item?.showPercentage
                                        : item?.numAmount}
                                      {item?.strBasedOn === "Percentage"
                                        ? ` % `
                                        : ""}
                                    </td>
                                  )}
                                  <td>{item?.strDependOn}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </>
  );
}
