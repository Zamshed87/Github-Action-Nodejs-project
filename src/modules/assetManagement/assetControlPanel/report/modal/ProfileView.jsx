import React, { useRef, useState } from "react";
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
import { useDispatch } from "react-redux";
import { printDateTime } from "utility/getPrintDateTime";

const ProfileView = () => {
  const printRef = useRef();
  const dispatch = useDispatch();
  const [singleData, getSingleData, loading, setSingleData] = useAxiosGet({});
  const [depreciationRowDto, setDepreciationRowDto] = useState([]);
  const [maintenanceRowDto, setMaintenanceRowDto] = useState([]);
  const [usesHistoryRowDto, setUsesHistoryRowDto] = useState([]);
  const [documentsRowDto, setDocumentsRowDto] = useState([]);
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
                  {
                    "Lenovo IdeaPad 1 14AMN7 AMD Ryzen 5 512GB SSD 14 FHD Laptop with DDR5 RAM"
                  }
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
                  {"163,000"}
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
                  {"15,000"}
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
                  {"148,000"}
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
                  {"1605"}
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
                  {"AT-78-145365"}
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
                  {"10-12-2022"}
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
                  {"Global Brand Pvt Ltd."}
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
                  {"Ryzen 5 7520U"}
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
                  {"Dev-13"}
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
                  {"2 Year six month days"}
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
                  {"IT Equipment"}
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
                  {"Laptop"}
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
                  {"163,000"}
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
                  {"Lenovo"}
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
                  {"06-10-2025"}
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
                  {"25-12-2022"}
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
                  <Chips label={"Available"} classess="success" />
                </p>
              </div>
            </div>
            <div style={{ width: "30%" }}>
              <img
                // src={`${APIUrl}/Document/DownloadFile?id=${strProfileImageUrl}`}
                src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
                {"25-05-2024"}
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
                {
                  "Lenovo IdeaPad 1 14AMN7 AMD Ryzen 5 512GB SSD 14 FHD Laptop with DDR5 RAM"
                }
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
                {"Purchase for Production Department"}
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
                uniqueKey="id"
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
                uniqueKey="id"
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
                uniqueKey="id"
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
                uniqueKey="id"
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
