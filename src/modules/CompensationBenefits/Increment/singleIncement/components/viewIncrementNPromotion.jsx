import { SaveAlt } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import pdfIcon from "../../../../../assets/images/pdfIcon.svg";
import BackButton from "../../../../../common/BackButton";
import IConfirmModal from "../../../../../common/IConfirmModal";
import Loading from "../../../../../common/loading/Loading";
import { gray900 } from "../../../../../utility/customColor";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../../utility/downloadFile";
import { getEmployeeProfileViewData } from "../../../salaryAssignAndDeduction/helper";
import Accordion from "../accordion";
import { deleteIncrementAndPromotionHistoryById } from "../helper";

import ViewTransferTable from "./viewTransferNPromotionTable";

const ViewIncrementNPromotion = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [incrementNpromotion, getIncrementNpromotion, loading1] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState([]);
  const [loading, setLoading] = useState(false);

  const { employeeId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getSingleData = () => {
    getIncrementNpromotion(
      `/Employee/GetEmployeeIncrementById?autoId=${id}&employeeId=${location?.state?.employeeId}&businessUnitId=${location?.state?.buId}&workplaceGroupId=${location?.state?.wgId}`
    );
    getEmployeeProfileViewData(
      location?.state?.employeeId,
      setEmpBasic,
      setLoading,
      location?.state?.buId,
      location?.state?.wgId
    );
  };

  // getting the policy details by id
  useEffect(() => {
    getSingleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wantToDelete = (id) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to delete? `,
      yesAlertFunc: () => {
        const payload = {
          isPromotion: false,
          incrementList: [
            {
              intIncrementId:
                incrementNpromotion.incrementList?.[0]?.intIncrementId,
              intEmployeeId:
                incrementNpromotion?.incrementList?.[0]?.intEmployeeId,
              strEmployeeName:
                incrementNpromotion.incrementList?.[0]?.strEmployeeName,
              intAccountId: orgId,
              intBusinessUnitId: buId,
              strIncrementDependOn:
                incrementNpromotion.incrementList?.[0]?.strIncrementDependOn,
              numIncrementPercentageOrAmount:
                incrementNpromotion.incrementList?.[0]
                  ?.numIncrementPercentageOrAmount,
              dteEffectiveDate:
                incrementNpromotion.incrementList?.[0]?.dteEffectiveDate,
              isActive: false,
              intCreatedBy: employeeId,
            },
          ],
          transferPromotionObj: null,
        };
        deleteIncrementAndPromotionHistoryById(payload, history);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const handleIncrementPDFDownload = (intIncrementId) => {
    getPDFAction(
      `/PdfAndExcelReport/IncrementLetterReportPDF?IntAccountId=${orgId}&intIncrementId=${intIncrementId}`,
      setLoading
    );
  };

  const handlePromotionPDFDownload = (
    isPromotion,
    intTransferNpromotionReferenceId
  ) => {
    if (isPromotion) {
      getPDFAction(
        `/PdfAndExcelReport/PromotionReportPDF?IntTransferNPromotionId=${intTransferNpromotionReferenceId}&AccountId=${orgId}`,
        setLoading
      );
    }
  };

  return (
    <>
      {loading || loading1 ? (
        <Loading />
      ) : (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton title={"Increment & Promotion Details"} />
            </div>
            {!location?.state?.approval && (
              <div className="d-flex align-items-center">
                {location?.state?.showButton && (
                  <button
                    className="btn btn-cancel mr-2"
                    onClick={() =>
                      wantToDelete(
                        incrementNpromotion?.incrementList?.[0]?.intIncrementId
                      )
                    }
                  >
                    Delete
                  </button>
                )}
                {location?.state?.showButton && (
                  <button
                    className="btn btn-green btn-green-disabled"
                    onClick={() =>
                      history.push(
                        `/compensationAndBenefits/increment/singleIncrement/edit/${id}`,
                        {
                          singleData: incrementNpromotion,
                        }
                      )
                    }
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
          <div
            className="table-card-body card-style my-3"
            style={{ minHeight: "auto" }}
          >
            <div className="mt-2">
              <Accordion empBasic={empBasic} />
            </div>

            <div className="col-lg-12 mb-2 mt-3 px-0">
              <h3
                style={{
                  color: " gray700 !important",
                  fontSize: "16px",
                  lineHeight: "20px",
                  fontWeight: "500",
                }}
              >
                Increment Log
              </h3>
            </div>

            <div className="col-lg-6 mb-3 mt-3 px-0 d-flex">
              <div className="d-flex flex-column mr-4">
                <p
                  style={{
                    color: "gray700 !important",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: "600",
                  }}
                >
                  {
                    incrementNpromotion?.incrementList?.[0]
                      ?.strIncrementDependOn
                  }{" "}
                  {incrementNpromotion?.incrementList?.[0]
                    ?.strIncrementDependOn === "Amount"
                    ? ""
                    : "Salary"}
                </p>
                <p
                  style={{
                    color: "gray500 !important",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: "400",
                  }}
                >
                  Depand On
                </p>
              </div>
              <div className="d-flex flex-column mr-4">
                <p
                  style={{
                    color: "gray700 !important",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: "600",
                  }}
                >
                  {
                    incrementNpromotion?.incrementList?.[0]
                      ?.numIncrementPercentageOrAmount
                  }
                  {incrementNpromotion?.incrementList?.[0]
                    ?.strIncrementDependOn === "Amount"
                    ? " Tk"
                    : " %"}
                </p>
                <p
                  style={{
                    color: "gray500 !important",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: "400",
                  }}
                >
                  Increment Percentage/Amount
                </p>
              </div>
              <div className="d-flex flex-column">
                <p
                  style={{
                    color: "gray700 !important",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: "600",
                  }}
                >
                  {dateFormatter(
                    incrementNpromotion?.incrementList?.[0]?.dteEffectiveDate
                  )}
                </p>
                <p
                  style={{
                    color: "gray500 !important",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: "400",
                  }}
                >
                  Effective Date
                </p>
              </div>
            </div>

            <div className="d-flex">
              {/* Increment Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  // dispatch(getDownlloadFileView_Action());
                  handleIncrementPDFDownload(
                    incrementNpromotion?.incrementList?.[0]?.intIncrementId
                  );
                }}
                style={{
                  height: "32px",
                  width: "199px",
                  boxSizing: "border-box",
                  border: " 1px solid #EAECF0",
                  borderRadius: "4px",
                }}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <img
                      className="pb-1"
                      style={{ width: "23px", height: "23px" }}
                      src={pdfIcon}
                      alt=""
                    />
                  </div>
                  <p
                    style={{
                      color: "#344054",
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                    className="pl-2"
                  >
                    Increment Letter
                  </p>
                </div>
                <div>
                  <SaveAlt
                    sx={{
                      color: gray900,
                      fontSize: "16px",
                    }}
                  />
                </div>
              </IconButton>

              {/* Promotion Button */}
              {incrementNpromotion?.isPromotion && (
                <div className="ml-4">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePromotionPDFDownload(
                        incrementNpromotion?.isPromotion,
                        incrementNpromotion?.incrementList?.[0]
                          ?.intTransferNpromotionReferenceId
                      );
                    }}
                    style={{
                      height: "32px",
                      width: "199px",
                      boxSizing: "border-box",
                      border: " 1px solid #EAECF0",
                      borderRadius: "4px",
                    }}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <div>
                        <img
                          className="pb-1"
                          style={{ width: "23px", height: "23px" }}
                          src={pdfIcon}
                          alt=""
                        />
                      </div>
                      <p
                        style={{
                          color: "#344054",
                          fontSize: "12px",
                          fontWeight: 400,
                        }}
                        className="pl-2"
                      >
                        Promotion Letter
                      </p>
                    </div>
                    <div>
                      <SaveAlt
                        sx={{
                          color: gray900,
                          fontSize: "16px",
                        }}
                      />
                    </div>
                  </IconButton>
                </div>
              )}
            </div>

            {/* Role extension table */}
            {!!incrementNpromotion?.transferPromotionObj
              ?.empTransferNpromotionRoleExtensionVMList?.length && (
              <div>
                <div className="col-lg-12 mb-2 mt-3 px-0">
                  <h3
                    style={{
                      color: " gray700 !important",
                      fontSize: "16px",
                      lineHeight: "20px",
                      fontWeight: "500",
                    }}
                  >
                    Role Extension List
                  </h3>
                </div>
                <div className="col-md-12 mx-0 px-0">
                  <div className="table-card-body px-0">
                    <div
                      className="table-card-styled tableOne"
                      style={{ marginTop: "12px" }}
                    >
                      <table className="table">
                        <thead>
                          <tr className="py-1">
                            <th>SL</th>
                            <th>
                              <div>
                                <span className="mr-1"> Org Type</span>
                              </div>
                            </th>
                            <th>
                              <div>
                                <span className="mr-1"> Org Name</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {incrementNpromotion?.transferPromotionObj?.empTransferNpromotionRoleExtensionVMList.map(
                            (item, index) => (
                              <tr className="hasEvent" key={index + 1}>
                                <td>
                                  <p className="tableBody-title">{index + 1}</p>
                                </td>
                                <td>
                                  <p className="tableBody-title">
                                    {item?.strOrganizationTypeName}
                                  </p>
                                </td>
                                <td>
                                  <p className="tableBody-title">
                                    {" "}
                                    {item?.strOrganizationReffName}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Proposed History transfers and promotions */}
            {incrementNpromotion?.isPromotion && (
              <div className="pt-2">
                <div className="col-lg-12 mb-2 pl-0">
                  <h3
                    style={{
                      color: " gray700 !important",
                      fontSize: "16px",
                      lineHeight: "20px",
                      fontWeight: "500",
                    }}
                  >
                    Proposed Transfer/Promotion
                  </h3>
                </div>
                <div className="table-colored">
                  <ViewTransferTable
                    transferNpromotion={
                      incrementNpromotion?.transferPromotionObj
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewIncrementNPromotion;
