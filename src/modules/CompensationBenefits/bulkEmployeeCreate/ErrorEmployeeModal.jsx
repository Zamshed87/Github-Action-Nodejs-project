/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Modal } from "react-bootstrap";
import NoResult from "../../../common/NoResult";

export default function ErrorEmployeeModal({
  isVisibleHeading = true,
  show,
  title,
  onHide,
  size,
  backdrop,
  classes,
  errorData,
}) {
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
                                <span>Employee Name</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Description</span>
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
                                  {item?.title}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.body}
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
}
