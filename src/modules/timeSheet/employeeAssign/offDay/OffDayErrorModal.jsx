/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import NoResult from "common/NoResult";
import { Modal } from "react-bootstrap";
import { crudOffDayAssignWithError } from "./helper";
import IConfirmModal from "common/IConfirmModal";

export default function OffDayErrorModal({
  isVisibleHeading = true,
  show,
  title,
  onHide,
  size,
  backdrop,
  classes,
  errorData,
  errorPayload,
  setErrorData,
  setErroModalOpen,
  setErrorPayload,
  cb,
  setLoading,
}) {
  const demoPopup = () => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `These employees have overlapping Off Days. Previous Off Days will be deleted to apply the new schedule. Are you Sure?`,
      yesAlertFunc: () => {
        crudOffDayAssignWithError(
          { ...errorPayload, isErrorAvoid: true },
          setErrorData,
          setErroModalOpen,
          setErrorPayload,
          setLoading,
          cb
        );
      },
      noAlertFunc: () => null,
    };
    IConfirmModal(confirmObject);
  };
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
            <button
              type="button"
              className="btn btn-green"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => {
                demoPopup();
              }}
            >
              Continue
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
