import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NoResult from "../../../../common/NoResult";
import { colorLess } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { getEmployeeIncrementByEmoloyeeId } from "../../../CompensationBenefits/employeeSalary/salaryAssign/helper";

const IncrementInfo = ({ index, tabIndex, empId }) => {
  const [incrementHistoryList, setIncrementHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getEmployeeIncrementByEmoloyeeId(
      orgId,
      empId,
      setIncrementHistoryList,
      setLoading,
      wgId,
      buId
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId, orgId]);

  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <div className="table-card-body">
              <div className="table-card-styled tableOne">
                <table className="table">
                  {incrementHistoryList?.length > 0 ? (
                    <thead>
                      <tr>
                        <th className="sortable" style={{ width: "30px" }}>
                          SL
                        </th>
                        <th>Increment Date</th>
                        <th>Increment Amount</th>
                        <th>Gross Salary</th>
                      </tr>
                    </thead>
                  ) : (
                    ""
                  )}

                  <tbody>
                    {incrementHistoryList?.length > 0 ? (
                      <>
                        {incrementHistoryList?.map((data, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                background:
                                  data?.strStatus === "Pending"
                                    ? "#FEF9DF"
                                    : "",
                              }}
                            >
                              <div className="tableBody-title pl-1">
                                {index + 1}
                              </div>
                            </td>
                            <td
                              style={{
                                background:
                                  data?.strStatus === "Pending"
                                    ? "#FEF9DF"
                                    : "",
                              }}
                            >
                              {dateFormatter(data?.dteEffectiveDate)}
                            </td>
                            <td
                              style={{
                                background:
                                  data?.strStatus === "Pending"
                                    ? "#FEF9DF"
                                    : "",
                              }}
                            >
                              <div className="text-right">
                                {data?.numIncrementAmount}
                              </div>
                            </td>
                            <td
                              style={{
                                background:
                                  data?.strStatus === "Pending"
                                    ? "#FEF9DF"
                                    : "",
                              }}
                            >
                              <div className="text-right">
                                {numberWithCommas(data?.numCurrentGrossAmount)}
                              </div>
                            </td>
                            <td
                              style={{
                                background:
                                  data?.strStatus === "Pending"
                                    ? "#FEF9DF"
                                    : "",
                              }}
                            >
                              <div className="text-right">
                                {numberWithCommas(data?.numOldGrossAmount)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {!loading && (
                          <tr className="boxShadowNone">
                            <td
                              colSpan="8"
                              style={{
                                border: `1px solid ${colorLess}`,
                              }}
                            >
                              <NoResult
                                title="No Increment History Found"
                                para=""
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default IncrementInfo;
