import {
  AccountBalanceWallet,
  Close,
  Comment,
  Dns,
  Edit,
  ListAlt,
  MarkunreadMailbox,
  MonetizationOn,
  NearMe,
  Receipt,
  RequestPage,
  StickyNote2,
  Today
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { Modal } from "react-bootstrap";
import { dateFormatter } from "../../../../../utility/dateFormatter";

export default function ViewModal({
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
  orgId,
  buId,
  setShow,
}) {
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
          <>
            {isVisibleHeading && (
              <Modal.Header className="bg-custom">
                <div className="d-flex w-100 justify-content-between">
                  <Modal.Title className="text-center">{title}</Modal.Title>
                  <div>
                    <div
                      className="crossIcon"
                      style={{ cursor: "pointer" }}
                      onClick={() => onHide()}
                    >
                      <Close />
                    </div>
                  </div>
                </div>
              </Modal.Header>
            )}

            <Modal.Body id="example-modal-sizes-title-xl">
              <div className="reschedule-view-modal">
                <div className="d-flex px-4 pb-2 align-items-center border-bottom">
                  <Avatar
                    alt="Remy Sharp"
                    src=""
                    sx={{ width: "40px !important", height: "40px !important" }}
                  />
                  <div className="employeeTitle ml-3">
                    <h6 className="title-item-name">
                      {singleData?.employeeName} [{singleData?.employeeCode}]
                    </h6>
                    <p className="subtitle-p">{singleData?.designationName}</p>
                    <p className="subtitle-p">{singleData?.departmentName}</p>
                  </div>
                </div>
                <div className="pl-3">
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <MarkunreadMailbox
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {singleData?.loanType}
                      </h6>
                      <p className="subtitle-p">Loan Type</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <Today
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {dateFormatter(singleData?.applicationDate)}
                      </h6>
                      <p className="subtitle-p">Application Date</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <AccountBalanceWallet
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        BDT {singleData?.approveLoanAmount}
                      </h6>
                      <p className="subtitle-p">Loan Amount</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <Receipt
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        BDT {singleData?.approveNumberOfInstallmentAmount}
                      </h6>
                      <p className="subtitle-p">Installment Ammount</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <Dns
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {singleData?.approveNumberOfInstallment}
                      </h6>
                      <p className="subtitle-p">installment Number</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <NearMe
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        BDT {singleData?.paidAmount}
                      </h6>
                      <p className="subtitle-p">Paid Amount</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <StickyNote2
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        BDT {singleData?.remainingBalance}
                      </h6>
                      <p className="subtitle-p">Due Amount</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <RequestPage
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {singleData?.dueInstallment}
                      </h6>
                      <p className="subtitle-p">Due Installment</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <MonetizationOn
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        BDT{" "}
                        {singleData?.reScheduleNumberOfInstallmentAmount || 0}
                      </h6>
                      <p className="subtitle-p">New Installment Amount</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <ListAlt
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {singleData?.reScheduleNumberOfInstallment || 0}
                      </h6>
                      <p className="subtitle-p">New Installment Number</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center border-bottom">
                    <Avatar sx={avatarSx}>
                      <Comment
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {singleData?.description}
                      </h6>
                      <p className="subtitle-p">Purpose</p>
                    </div>
                  </div>
                  <div className="d-flex py-1 align-items-center ">
                    <Avatar sx={avatarSx}>
                      <Today
                        sx={{
                          color: "#616163 !important",
                        }}
                      />
                    </Avatar>
                    <div className="employeeTitle ml-3">
                      <h6 className="title-item-name">
                        {singleData?.reScheduleDateTime
                          ? dateFormatter(singleData?.reScheduleDateTime)
                          : ""}
                      </h6>
                      <p className="subtitle-p">Reschedule Date</p>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="view-modal-footer">
              <button
                className="modal-btn modal-btn-edit"
                onClick={() => {
                  onHide();
                  setShow(true);
                }}
              >
                <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
                Edit
              </button>

              <button
                className="modal-btn modal-btn-edit"
                onClick={() => onHide()}
              >
                Close
              </button>
            </Modal.Footer>
          </>
        </Modal>
      </div>
    </>
  );
}
