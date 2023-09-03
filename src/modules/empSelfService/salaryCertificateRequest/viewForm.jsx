/* eslint-disable react-hooks/exhaustive-deps */
import Loading from "../../../common/loading/Loading";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { gray600, gray700 } from "../../../utility/customColor";
import { APIUrl } from "../../../App";
import ProfileImg from "../../../assets/images/profile.jpg";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import BackButton from "../../../common/BackButton";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import NoResult from "../../../common/NoResult";

const SelfSalaryCertificateView = () => {
  const params = useParams();

  const { orgId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [employeeInfo, getEmployeeInfo] = useAxiosGet();
  const [, getSingleSalaryInfo, loadingOnSalaryInfoFetching] = useAxiosGet();
  const [viewPaySlipData, getViewPaySlipData, loadingViewPaySlipData] =
    useAxiosGet();
  const [, getGenerateRequestId, loadingGenerateRequestIdData] = useAxiosGet();

  const numTotal = (arr, property, intPayrollElementTypeId) => {
    return arr
      .filter(
        (item) => item?.intPayrollElementTypeId === intPayrollElementTypeId
      )
      .reduce((sum, item) => sum + item[property], 0);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  useEffect(() => {
    getEmployeeInfo(`/Employee/EmployeeProfileView?employeeId=${employeeId}`);
    params?.id &&
      getSingleSalaryInfo(
        `/Employee/SalaryCertificateApplication?strPartName=SalaryCertificateByID&intAccountId=${orgId}&intEmployeeId=${employeeId}&intSalaryCertificateRequestId=${params?.id}`,
        (data) => {
          getGenerateRequestId(
            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&intId=${employeeId}&IntMonth=${data[0]?.intPayRollMonth}&IntYear=${data[0]?.intPayRollYear}&WorkplaceGroupId=${wgId}`,
            (res) => {
              if (res[0]?.SalaryGenerateRequestId) {
                getViewPaySlipData(
                  `/Payroll/SalarySelectQueryAll?partName=SalaryPaySlipByEmployeeId&intMonthId=${data[0]?.intPayRollMonth}&intYearId=${data[0]?.intPayRollYear}&IntEmployeeId=${employeeId}&intSalaryGenerateRequestId=${res[0]?.SalaryGenerateRequestId}&intWorkplaceGroupId=${wgId}`
                );
              }
            }
          );
        }
      );
  }, []);

  return (
    <>
      {(loadingOnSalaryInfoFetching ||
        loadingViewPaySlipData ||
        loadingGenerateRequestIdData) && <Loading />}
      <form>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>{`Salary Certificate Info`}</h2>
            </div>
          </div>
          <div className="table-card-body">
            <div className="card-style with-form-card pb-0">
              {employeeInfo?.employeeProfileLandingView && (
                <div className="d-flex align-items-center mt-2 pb-2">
                  <div>
                    {employeeInfo?.employeeProfileLandingView
                      ?.intEmployeeImageUrlId > 0 ? (
                      <img
                        src={`${APIUrl}/Document/DownloadFile?id=${employeeInfo?.employeeProfileLandingView?.intEmployeeImageUrlId}`}
                        alt="Profile Pic"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    ) : (
                      <img
                        src={ProfileImg}
                        alt="Profile Pic"
                        width="78px"
                        height="78px"
                        style={{ height: "inherit" }}
                      />
                    )}
                  </div>
                  <div>
                    <div className="content-about-info-card ml-3">
                      <div className="d-flex justify-content-between">
                        <h4
                          className="name-about-info"
                          style={{ marginBottom: "5px" }}
                        >
                          {
                            employeeInfo?.employeeProfileLandingView
                              ?.strEmployeeName
                          }
                          <span style={{ fontWeight: "400", color: gray700 }}>
                            [
                            {
                              employeeInfo?.employeeProfileLandingView
                                ?.strCardNumber
                            }
                            ]
                          </span>
                        </h4>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Department -
                          </small>
                          {
                            employeeInfo?.employeeProfileLandingView
                              ?.strDepartment
                          }
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Designation -
                          </small>
                          {
                            employeeInfo?.employeeProfileLandingView
                              ?.strDesignation
                          }
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Employment Type -
                          </small>
                          {
                            employeeInfo?.employeeProfileLandingView
                              ?.strEmploymentType
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {viewPaySlipData?.length ? (
              <div className="table-card-styled tableOne mt-3">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>
                        <p className="pl-1" style={thStyles}>
                          Income Head
                        </p>
                      </th>
                      <th colSpan="3" style={{ textAlign: "right" }}>
                        <p style={thStyles}>Amount in BDT</p>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <p style={thStyles} className="pl-1">
                          A. Benefits:
                        </p>
                      </th>
                      <th>
                        <p style={thStyles}></p>
                      </th>
                    </tr>

                    {viewPaySlipData
                      .filter((item) => item?.intPayrollElementTypeId === 1)
                      .map((item, index) => (
                        <tr key={index}>
                          <td>
                            <p>{item?.strPayrollElement}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{item?.numAmount}</p>
                          </td>
                        </tr>
                      ))}

                    <tr>
                      <th>
                        <p style={thStyles} className="pl-1">
                          Total benefits
                        </p>
                      </th>
                      <th style={{ textAlign: "right" }}>
                        <p style={thStyles}>
                          {numberWithCommas(
                            numTotal(viewPaySlipData, "numAmount", 1)
                          )}
                        </p>
                      </th>
                    </tr>

                    <tr>
                      <th>
                        <p style={thStyles} className="pl-1">
                          B. Deductions:
                        </p>
                      </th>
                      <th>
                        <p></p>
                      </th>
                    </tr>

                    {viewPaySlipData
                      .filter((item) => item?.intPayrollElementTypeId === 0)
                      .map((item, index) => (
                        <tr key={index}>
                          <td>
                            <p>{item?.strPayrollElement}</p>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <p>{item?.numAmount}</p>
                          </td>
                        </tr>
                      ))}

                    <tr>
                      <th>
                        <p style={thStyles} className="pl-1">
                          Total deductions
                        </p>
                      </th>
                      <th style={{ textAlign: "right" }}>
                        <p style={thStyles}>
                          {numberWithCommas(
                            numTotal(viewPaySlipData, "numAmount", 0)
                          )}
                        </p>
                      </th>
                    </tr>

                    <tr>
                      <th>
                        <p style={thStyles} className="pl-1">
                          Net Take Home (A-B)
                        </p>
                      </th>
                      <th style={{ textAlign: "right" }}>
                        <p style={thStyles}>
                          {numberWithCommas(
                            numTotal(viewPaySlipData, "numAmount", 1) -
                            numTotal(viewPaySlipData, "numAmount", 0)
                          )}
                        </p>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <NoResult />
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default SelfSalaryCertificateView;

const thStyles = {
  fontWeight: 600,
  fontSize: "12px !important",
  lineHeight: "18px !important",
  color: `${gray600} !important`,
};
