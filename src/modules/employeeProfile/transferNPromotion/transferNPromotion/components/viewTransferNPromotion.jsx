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
import { getPDFAction } from "../../../../../utility/downloadFile";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import Accordion from "../accordion";
import { deleteTransferAndPromotionHistoryById } from "../helper";
import ViewTransferTable from "./viewTransferNPromotionTable";

const ViewTransferNPromotion = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [transferNpromotion, getTransferNpromotion, loading1] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState([]);
  const [loading, setLoading] = useState(false);

  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getSingleData = () => {
    getTransferNpromotion(`/Employee/GetEmpTransferNpromotionById?id=${id}`);
    getEmployeeProfileViewData(
      location?.state?.employeeId,
      setEmpBasic,
      setLoading,
      location?.state?.businessUnitId,
      location?.state?.workplaceGroupId
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
        deleteTransferAndPromotionHistoryById(id, employeeId, history);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const handlePDFDownload = (promotionType, id) => {
    switch (promotionType) {
      case "Promotion":
        return getPDFAction(
          `/PdfAndExcelReport/PromotionReportPDF?IntTransferNPromotionId=${id}&AccountId=${orgId}`,
          setLoading
        );
      case "Transfer":
        return getPDFAction(
          `/PdfAndExcelReport/TransferReportPDF?intTransferId=${id}&IntAccountId=${orgId}`,
          setLoading
        );
      case "Transfer & Promotion":
        return getPDFAction(
          `/PdfAndExcelReport/TransferAndPromotionReportPDF?IntTransferAndPromotionId=${id}&IntAccountId=${orgId}`,
          setLoading
        );
      default:
        return null;
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
              <BackButton title={"Transfer & Promotion Details"} />
            </div>
            {!location?.state?.approval && (
              <div className="d-flex align-items-center">
                {location?.state?.showButton && (
                  <button
                    className="btn btn-cancel mr-2"
                    onClick={() =>
                      wantToDelete(transferNpromotion?.intTransferNpromotionId)
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
                        `/profile/transferandpromotion/transferandpromotion/edit/${id}`,
                        {
                          singleData: transferNpromotion,
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

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                // dispatch(getDownlloadFileView_Action());
                handlePDFDownload(
                  transferNpromotion?.strTransferNpromotionType,
                  transferNpromotion?.intTransferNpromotionId
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
                  {transferNpromotion?.strTransferNpromotionType} Letter
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

            {/* Role extension table */}
            {!!transferNpromotion?.empTransferNpromotionRoleExtensionVMList
              ?.length && (
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
                          {transferNpromotion?.empTransferNpromotionRoleExtensionVMList.map(
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
            {!!transferNpromotion && (
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
                  <ViewTransferTable transferNpromotion={transferNpromotion} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewTransferNPromotion;
