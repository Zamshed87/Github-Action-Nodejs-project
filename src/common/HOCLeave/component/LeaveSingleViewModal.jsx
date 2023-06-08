/* eslint-disable no-unused-vars */
import { Attachment, Close, Edit } from "@mui/icons-material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ChromeReaderModeOutlinedIcon from "@mui/icons-material/ChromeReaderModeOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import LayersIcon from "@mui/icons-material/Layers";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Avatar, IconButton } from "@mui/material";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import IConfirmModal from "../../IConfirmModal";
import { createLeaveApplication } from "../helperAPI";

export default function LeaveSingleViewModal({
  id,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  singleData,
  handleOpen,
  setSingleData,
  values,
  setValues,
  setImageFile,
  scrollRef,
  setLeaveHistoryData,
  setIsEdit,
  employee,
  setAllData,
  getData,
}) {
  const { userId, orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const demoPopup = (singleData) => {
    const payload = {
      partId: 3,
      leaveApplicationId: singleData?.intApplicationId,
      leaveTypeId: singleData?.LeaveTypeId,
      employeeId: employeeId,
      accountId: orgId,
      businessUnitId: buId,
      applicationDate: singleData?.ApplicationDate,
      appliedFromDate: singleData?.AppliedFromDate,
      appliedToDate: singleData?.AppliedToDate,
      documentFile: singleData?.DocumentFileUrl
        ? singleData?.DocumentFileUrl
        : 0,
      leaveReason: singleData?.Reason,
      addressDuetoLeave: singleData?.AddressDuetoLeave,
      insertBy: employeeId,
    };

    const callback = () => {
      getData();
      setSingleData("");
      onHide();
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete your movement?",
      yesAlertFunc: () => {
        createLeaveApplication(payload, setLoading, callback);
      },
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };
  const avatarSx = {
    background: "#F2F2F7",
    "&": {
      height: "30px",
      width: "30px",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "16px",
    },
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
          fullscreen={fullscreen && fullscreen}
        >
          {isVisibleHeading && (
            <Modal.Header className="bg-custom">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <Modal.Title className="text-center">{title}</Modal.Title>
                <div>
                  <IconButton className="crossIcon" onClick={() => onHide()}>
                    <Close />
                  </IconButton>
                </div>
              </div>
            </Modal.Header>
          )}

          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="businessUnitModal">
              <div className="modal-body-type-two">
                {singleData && (
                  <>
                    <div className="modal-body-top d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <LayersIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div className="modal-body-txt">
                        <h6 className="title-item-name">
                          {singleData?.LeaveType}
                        </h6>
                        <p className="subtitle-p">Leave Type</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <DateRangeOutlinedIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">{`${dateFormatterForInput(
                          singleData?.AppliedFromDate
                        )}  to  ${dateFormatterForInput(
                          singleData?.AppliedToDate
                        )}`}</h6>
                        <p className="subtitle-p">Date Range</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <DateRangeOutlinedIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">
                          {singleData?.TotalDays} Days
                        </h6>
                        <p className="subtitle-p">Duration</p>
                      </div>
                    </div>

                    <div className="modal-body-main d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <ChromeReaderModeOutlinedIcon
                            sx={{ color: "#616163" }}
                          />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">
                          {singleData?.Reason}
                        </h6>
                        <p className="subtitle-p">Reason</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <LocationOnOutlinedIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">
                          {singleData?.AddressDuetoLeave}
                        </h6>
                        <p className="subtitle-p">Location</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <AttachFileOutlinedIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <p className="subtitle-p">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                getDownlloadFileView_Action(
                                  singleData?.DocumentFileUrl
                                )
                              );
                            }}
                          >
                            {singleData?.DocumentFileUrl ? (
                              <Attachment />
                            ) : (
                              "No file exist"
                            )}
                          </span>
                        </p>
                        <p className="subtitle-p">Attachment</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <ArticleOutlinedIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">
                          {singleData?.ApprovalStatus}
                        </h6>
                        <p className="subtitle-p">Status</p>
                      </div>
                    </div>
                    {singleData?.ApprovalStatus === "Pending" && (
                      <button
                        className="btn btn-green btn-green-less"
                        style={{ width: "200px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          demoPopup(singleData);
                        }}
                      >
                        DELETE REQUEST
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="form-modal-footer view-modal-footer">
            {singleData?.ApprovalStatus === "Pending" && (
              <button
                className="modal-btn modal-btn-edit"
                // startIcon={<Edit />}
                onClick={() => {
                  setIsEdit(true);
                  handleOpen();
                  onHide();
                  scrollRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                  setValues({
                    ...values,
                    leaveType: {
                      value: singleData?.LeaveTypeId,
                      label: singleData?.LeaveType,
                    },
                    fromDate: dateFormatterForInput(
                      singleData?.AppliedFromDate
                    ),
                    toDate: dateFormatterForInput(singleData?.AppliedToDate),
                    location: singleData?.AddressDuetoLeave,
                    reason: singleData?.Reason,
                  });
                  setImageFile(singleData?.DocumentFileUrl);
                }}
              >
                <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
                Edit
              </button>
            )}

            <button
              className="modal-btn modal-btn-edit"
              onClick={() => {
                onHide();
                setSingleData("");
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
