import { Attachment, Cancel, CheckCircle, Close } from "@mui/icons-material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ChromeReaderModeOutlinedIcon from "@mui/icons-material/ChromeReaderModeOutlined";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import DemoImg from "../../../../../assets/images/bigDemo.png";
import IConfirmModal from "../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../common/MuiIcon";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { failColor, successColor } from "../../../../../utility/customColor";
import {
  getAllSeparationListDataForApproval,
  separationApproveReject,
} from "../helper";

export default function ViewFormComponent({ objProps }) {
  const {
    show,
    title,
    onHide,
    size,
    backdrop,
    classes,
    singleData,
    setSingleData,
    appliedStatus,
    setApplicationListData,
    setAllData,
    isVisibleHeading = true,
    fullscreen = false,
    setLoading,
  } = objProps;
  const { orgId, employeeId, isOfficeAdmin, wId, buId, strDisplayName } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  var LogoURL = "";
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

  const demoPopup = (action, text, item) => {
    const payload = [
      {
        applicationId: item?.application?.intSeparationId,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
        approverEmployeeName: strDisplayName,
        comments: "",
      },
    ];

    const callback = () => {
      setSingleData("");
      onHide();
      getAllSeparationListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          businessUnitId: buId,
          workplaceGroupId: 0,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          accountId: orgId,
          intId: 0,
          workplaceId: wId,
        },
        setApplicationListData,
        setAllData,
        setLoading
      );
    };
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        separationApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const dispatch = useDispatch();

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
                  <IconButton
                    className="crossIcon"
                    onClick={() => {
                      onHide();
                      setSingleData("");
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
              </div>
            </Modal.Header>
          )}

          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="">
              <div className="modal-body-type-two">
                <>
                  <div className="modal-body-top d-flex">
                    <div className="employeeInfo d-flex align-items-center">
                      {LogoURL ? (
                        <img
                          src={`https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${LogoURL}`}
                          alt="icon"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <img
                          src={DemoImg}
                          alt="icon"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      <div className="ml-3">
                        <h6 className="title-item-name">
                          {singleData?.strEmployeeName}
                        </h6>
                        <p className="subtitle-p">
                          {singleData?.strDesignation},
                          {singleData?.strEmploymentType}
                        </p>
                        <p className="subtitle-p">
                          {singleData?.strDepartment}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body-main d-flex align-items-center">
                    <div style={{ marginRight: "17px" }}>
                      <Avatar sx={avatarSx}>
                        <AttachFileOutlinedIcon sx={{ color: "#616163" }} />
                      </Avatar>
                    </div>
                    <div>
                      {singleData?.application?.strDocumentId
                        .split(",")
                        .map((item, i) => (
                          <>
                            <h6
                              key={i}
                              className="title-item-name"
                              onClick={() => {
                                dispatch(getDownlloadFileView_Action(item));
                              }}
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#0072E5",
                                cursor: "pointer",
                              }}
                            >
                              {item ? (
                                <div>
                                  <Attachment style={{ fontSize: "20px" }} />
                                  {`Attachment_${i + 1}`}
                                </div>
                              ) : (
                                "No attachment"
                              )}
                            </h6>
                          </>
                        ))}
                      <p className="subtitle-p">Attachment</p>
                    </div>
                  </div>
                  <div className="modal-body-main d-flex align-items-center">
                    <div style={{ marginRight: "17px" }}>
                      <Avatar sx={avatarSx}>
                        <ArticleOutlinedIcon sx={{ color: "#616163" }} />
                      </Avatar>
                    </div>
                    <div>
                      <h6 className="title-item-name">
                        {singleData?.application?.strStatus}
                      </h6>
                      <p className="subtitle-p">Status</p>
                    </div>
                  </div>
                  <div className="modal-body-main d-flex align-items-center">
                    <div style={{ marginRight: "17px" }}>
                      <Avatar sx={avatarSx}>
                        <ChromeReaderModeOutlinedIcon
                          sx={{ color: "#616163" }}
                        />
                      </Avatar>
                    </div>
                    <div>
                      <small
                        className="subtitle-p"
                        dangerouslySetInnerHTML={{
                          __html: singleData?.strReason,
                        }}
                      />
                    </div>
                  </div>
                </>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="view-modal-footer">
            {appliedStatus?.label === "Pending" ? (
              <div className="leave-approved">
                <div className="d-flex actionIcon justify-content-center">
                  <Tooltip title="Approve">
                    <div
                      className="p-2 mr-0 muiIconHover success "
                      onClick={(e) => {
                        e.stopPropagation();
                        demoPopup("approve", "Approve", singleData);
                      }}
                    >
                      <MuiIcon
                        icon={
                          <CheckCircle
                            sx={{ color: successColor, fontSize: "16px" }}
                          />
                        }
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="p-2 muiIconHover  danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        demoPopup("reject", "Reject", singleData);
                      }}
                    >
                      <MuiIcon
                        icon={
                          <Cancel sx={{ color: failColor, fontSize: "16px" }} />
                        }
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <button
              className="btn btn-cancel"
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
