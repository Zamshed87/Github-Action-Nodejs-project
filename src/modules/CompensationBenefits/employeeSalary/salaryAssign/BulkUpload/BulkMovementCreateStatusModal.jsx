import React from "react";
import { Modal } from "react-bootstrap";
import { Chip, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { dateFormatter } from "utility/dateFormatter";
import { timeFormatter } from "utility/timeFormatter";
import NoResult from "common/NoResult";


const BulkMovementCreateStatusModal = ({
  isVisibleHeading = true,
  show,
  title,
  onHide,
  size,
  backdrop,
  classes,
  errorData,
}) => {
  return (
    <>
      <div className="viewModal">
        <Modal
          show={show}
          onHide={onHide}
          size={size}
          backdrop={backdrop}
          aria-labelledby="example-modal-sizes-title-xl"
          className={classes}
        >
          {isVisibleHeading && (
            <Modal.Header className="bg-custom">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <Modal.Title className="text-center">{title}</Modal.Title>
                <div>
                  <IconButton onClick={() => onHide()}>
                    <Close />
                  </IconButton>
                </div>
              </div>
            </Modal.Header>
          )}

          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="businessUnitModal">
              <div className="modalBody pt-0 px-0">
                <div className="table-card-body px-2">
                  <div className="table-card-styled tableOne mt-1">
                    {errorData?.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>
                              <div>SL</div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Employee Id</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Movement Type</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>From Date</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>From Time</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>To Date</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>To Time</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Location</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Reason</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Status</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {errorData.map((item, index) => (
                            <tr className="hasEvent" key={index}>
                              <td>
                                <div className="content tableBody-title">
                                  {index + 1}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strEmployeeCode}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strMovementType}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {dateFormatter(item?.dteFromDate)}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {timeFormatter(item?.dteFromTime)}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {dateFormatter(item?.dteToDate)}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {timeFormatter(item?.dteToTime)}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strLocation}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strReason}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  <Chip
                                    label={item?.strMessage}
                                    color={
                                      item?.isSuccess ? "success" : "error"
                                    }
                                    size="small"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <>{<NoResult title="No Result Found" para="" />}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="form-modal-footer">
            <button
              type="button"
              className="btn btn-cancel"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => {
                onHide();
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default BulkMovementCreateStatusModal;
