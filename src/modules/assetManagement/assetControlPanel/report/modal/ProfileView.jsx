import React, { useEffect, useRef, useState } from "react";
import { PrintOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import ReactToPrint from "react-to-print";
import { gray700 } from "utility/customColor";
import Chips from "common/Chips";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import NoResult from "common/NoResult";
import {
  depreciationColumn,
  documentsColumn,
  maintenanceColumn,
  usesHistoryColumn,
} from "../utils";
import PeopleDeskTable from "common/peopleDeskTable";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { printDateTime } from "utility/getPrintDateTime";
import { formatMoney } from "utility/formatMoney";
import { dateFormatter } from "utility/dateFormatter";
import { APIUrl } from "App";

const ProfileView = ({ assetId }) => {
  const printRef = useRef();
  const dispatch = useDispatch();
  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [singleData, getSingleData, loading, setSingleData] = useAxiosGet(null);
  const [depreciationRowDto, setDepreciationRowDto] = useState([]);
  const [maintenanceRowDto, setMaintenanceRowDto] = useState([]);
  const [usesHistoryRowDto, setUsesHistoryRowDto] = useState([]);
  const [documentsRowDto, setDocumentsRowDto] = useState([]);

  useEffect(() => {
    if (assetId) {
      getSingleData(
        `/AssetManagement/GetAssetProfileReport?accountId=${orgId}&branchId=${buId}&AssetId=${assetId}&workplaceId=${wId}&workplaceGroupId=${wgId}`,
        (res) => {
          setSingleData(res?.AssetHeaderData);
          setDepreciationRowDto(res?.Depreciation);
          setMaintenanceRowDto(res?.MaintenanceOrServicingLog);
          setUsesHistoryRowDto(res?.UsesHistory);
          setDocumentsRowDto(res?.Documents);
        }
      );
    }
  }, [assetId, orgId, buId, wId, wgId]);

  return (
    <>
      <div className="mb-2 d-flex justify-content-end">
        <ReactToPrint
          documentTitle={"Asset Profile"}
          trigger={() => (
            <Button
              variant="outlined"
              sx={{
                borderColor: "rgba(0, 0, 0, 0.6)",
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1.15px",
                "&:hover": {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
              }}
              startIcon={
                <PrintOutlined
                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                  className="emp-print-icon"
                />
              }
            >
              Print/PDF
            </Button>
          )}
          content={() => printRef.current}
          pageStyle={
            "@page { !important width: 100% } @media print { .name-about-info {font-size: 24px!important} .documents{ display: none!important} .printDateTime{display: block!important} }"
          }
        />
      </div>
      <div ref={printRef}>
        <div className="card-about-info-main about-info-card">
          <div className="d-flex justify-content-between">
            <div style={{ width: "70%" }}>
              <h4 className="name-about-info">Asset Profile</h4>
              <div className="single-info d-flex justify-content-between mt-4 pt-4">
                <p style={{ color: gray700, width: "20%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Asset Name
                  </small>
                </p>
                <p style={{ width: "80%" }}>
                  <span>: </span>
                  {singleData?.AssetName}
                </p>
              </div>
            </div>
            <div style={{ width: "30%" }}>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "75%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Acquisition Value
                  </small>
                </p>
                <p style={{ width: "25%" }}>
                  <span>: </span>
                  {formatMoney(singleData?.AcquisitionValue)}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "75%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Total Depreciation Value
                  </small>
                </p>
                <p style={{ width: "25%" }}>
                  <span>: </span>
                  {formatMoney(singleData?.TotalDepreciationValue)}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "75%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Net Book Value
                  </small>
                </p>
                <p style={{ width: "25%" }}>
                  <span>: </span>
                  {formatMoney(singleData?.NetBookValue)}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "75%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Maintenance /Servicing
                  </small>
                </p>
                <p style={{ width: "25%" }}>
                  <span>: </span>
                  {formatMoney(singleData?.MaintenaceOrServicingCost)}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div style={{ width: "30%" }}>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Asset No
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.AssetNo}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Acquisition Date
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {dateFormatter(singleData?.AcquisitionDate)}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Supplier
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.Supplier || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Model
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.Model || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    SL No
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.Serialnumber || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Age
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.Age || "N/A"}
                </p>
              </div>
            </div>
            <div style={{ width: "30%" }}>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Category
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.CategoryName || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Sub Category
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.SubCategoryName}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Acquisition Value
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {formatMoney(singleData?.AcquisitionValue)}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Brand
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.BrandValue || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Warranty End Date
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {dateFormatter(singleData?.WarrantyEndDate) || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Registration Date
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {dateFormatter(singleData?.RegistrationDate) || "N/A"}
                </p>
              </div>
              <div className="single-info d-flex justify-content-between mb-1">
                <p style={{ color: gray700, width: "46.7%" }}>
                  <small
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontWeight: "600",
                    }}
                  >
                    Status
                  </small>
                </p>
                <p style={{ width: "53.3%" }}>
                  <span>: </span>
                  {singleData?.Status === "Available" ? (
                    <Chips label={"Available"} classess="success" />
                  ) : singleData?.Status === "Maintenance" ? (
                    <Chips label={"Maintenance"} classess="danger" />
                  ) : singleData?.Status === "Assign" ? (
                    <Chips label={"Assign"} classess="warning" />
                  ) : singleData?.Status === "Unavailable" ? (
                    <Chips label="Unavailable" classess="hold" />
                  ) : null}
                </p>
              </div>
            </div>
            <div
              style={{
                width: "30%",
                border: "1px solid #101828 !important",
                boxShadow:
                  "0px 0.497024px 0.994048px rgba(0, 0, 0, 0.3), 0px 0.994048px 2.98214px 0.994048px rgba(0, 0, 0, 0.15)",
              }}
            >
              <img
                src={
                  singleData?.ImageProfileID
                    ? `${APIUrl}/Document/DownloadFile?id=${singleData?.ImageProfileID}`
                    : "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
                }
                alt="asset-image"
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
            </div>
          </div>
          <div>
            <div className="single-info d-flex justify-content-between mb-1">
              <p style={{ color: gray700, width: "20%" }}>
                <small
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.5",
                    fontWeight: "600",
                  }}
                >
                  Last Depreciation Run Date
                </small>
              </p>
              <p style={{ width: "80%" }}>
                <span>: </span>
                {dateFormatter(singleData?.LastDepreciationrunDate) || "N/A"}
              </p>
            </div>
            <div className="single-info d-flex justify-content-between mb-1">
              <p style={{ color: gray700, width: "20%" }}>
                <small
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.5",
                    fontWeight: "600",
                  }}
                >
                  Asset Description
                </small>
              </p>
              <p style={{ width: "80%" }}>
                <span>: </span>
                {singleData?.AssetDescription || "N/A"}
              </p>
            </div>
            <div className="single-info d-flex justify-content-between mb-1">
              <p style={{ color: gray700, width: "20%" }}>
                <small
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.5",
                    fontWeight: "600",
                  }}
                >
                  Note
                </small>
              </p>
              <p style={{ width: "80%" }}>
                <span>: </span>
                {singleData?.Note || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <h6>Depreciation</h6>
            {depreciationRowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={depreciationColumn()}
                rowDto={depreciationRowDto}
                setRowDto={setDepreciationRowDto}
                // uniqueKey="id"
                isPagination={false}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="col-lg-12">
            <h6>Maintenance/ Servicing Log</h6>
            {maintenanceRowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={maintenanceColumn()}
                rowDto={maintenanceRowDto}
                setRowDto={setMaintenanceRowDto}
                // uniqueKey="id"
                isPagination={false}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="col-lg-12">
            <h6>Uses History</h6>
            {usesHistoryRowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={usesHistoryColumn()}
                rowDto={usesHistoryRowDto}
                setRowDto={setUsesHistoryRowDto}
                // uniqueKey="id"
                isPagination={false}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="col-lg-12 documents">
            <h6>Documents</h6>
            {documentsRowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={documentsColumn(dispatch)}
                rowDto={documentsRowDto}
                setRowDto={setDocumentsRowDto}
                // uniqueKey="id"
                isPagination={false}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
          <div
            className="col-lg-12 printDateTime mt-4"
            style={{ display: "none" }}
          >
            <span>Print Date Time: {printDateTime()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileView;
