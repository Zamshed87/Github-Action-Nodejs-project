import React from "react";
import AddIcon from "@mui/icons-material/Add";
import bankDetails from "../../../../assets/images/bankDetails.svg";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Avatar } from "@material-ui/core";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ViewModal from "../../../../common/ViewModal";
import ConfirmationModal from "./component/ConfirmationModal";
import Button from "@mui/material/Button";
import BankForm from "./component/BankForm";
import DigitalBankForm from "./component/DigitalBankForm";
import { AttachMoneyOutlined, EditOutlined } from "@mui/icons-material";
import "./style.css";
import { gray900, success700 } from "../../../../utility/customColor";
import CashForm from "./component/CashForm";

const BankDetails = ({ objProps, isEditBtn, editBtnHandler, empId }) => {
  const {
    setRowDto,
    rowDto,
    setConfirmationMOdal,
    confirmationMOdal,
    setIsBank,
    isBank,
    setIsCash,
    isCash,
    setIsDigitalBanking,
    isDigitalBanking,
    setBankData,
    bankData,
    empBasic,
    getEmpData,
    isOfficeAdmin
  } = objProps;

  return (
    <div className="bankDetailsCard about-info-card pb-0">
      <div className="about-info-card-heading">
        <div className="bank-card-about-info-head">
          <p className="bankCard-title">Bank Details</p>
          {bankData === "create" && (
            <>
              <div
                className="d-flex justify-content-between"
                style={{ marginLeft: "24px" }}
              >
                {/* bank */}
                <div
                  className={`${isBank ? "radioClicked" : "radioNotClicked"
                    }`}
                  onClick={() => {
                    setIsBank(true);
                    setIsCash(false);
                    setIsDigitalBanking(false);
                  }}
                  style={{ marginRight: "24px" }}
                >
                  <div className="radioOptions">
                    {isBank ? (
                      <RadioButtonCheckedIcon className="bankRadio" />
                    ) : (
                      <RadioButtonUncheckedIcon className="bankRadio" />
                    )}

                    <label className="bankRadioLabel" for="flexRadioDefault1">
                      BANK
                    </label>
                  </div>
                </div>
                {/* digital bank */}
                <div
                  className={`${isDigitalBanking ? "radioClicked" : "radioNotClicked"
                    }`}
                  onClick={() => {
                    setIsBank(false);
                    setIsCash(false);
                    setIsDigitalBanking(true);
                  }}
                  style={{ marginRight: "24px" }}
                >
                  <div className="radioOptions">
                    {!isDigitalBanking ? (
                      <RadioButtonUncheckedIcon className="bankRadio" />
                    ) : (
                      <RadioButtonCheckedIcon className="bankRadio" />
                    )}
                    <label className="bankRadioLabel" for="flexRadioDefault2">
                      DIGITAL BANKING
                    </label>
                  </div>
                </div>
                {/* cash */}
                <div
                  className={`${isCash ? "cashRadioClicked" : "cashRadioNotClicked"
                    }`}
                  onClick={() => {
                    setIsBank(false);
                    setIsCash(true);
                    setIsDigitalBanking(false);
                  }}
                >
                  <div className="radioOptions">
                    {!isCash ? (
                      <RadioButtonUncheckedIcon className="bankRadio" />
                    ) : (
                      <RadioButtonCheckedIcon className="bankRadio" />
                    )}
                    <label className="bankRadioLabel" for="flexRadioDefault3">
                      CASH
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* bank info empty */}
        {(bankData === "empty" && isOfficeAdmin) && (
          <div className="addBankInfo">
            <AddIcon
              onClick={() => setBankData("create")}
              sx={{ cursor: "pointer", fontSize: "16px", color: gray900 }}
            />
          </div>
        )}

        {/* bank info edit */}
        {(isEditBtn && bankData === "complete" && isOfficeAdmin) && (
          <div onClick={editBtnHandler} className="addBankInfo pointer">
            <Avatar className="edit-icon-btn">
              <EditOutlined sx={{ color: gray900, fontSize: "16px" }} />
            </Avatar>
          </div>
        )}
      </div>
      <div className="card-body p-0">

        {/* if empty information */}
        {(bankData === "empty" && isOfficeAdmin) && (
          <div className="d-flex align-items-center justify-content-center flex-column h-100 empty-bankInfo">
            <img src={bankDetails} alt="iBOS" />
            <p>No bank information available</p>

            <Button
              onClick={() => setBankData("create")}
              type="button"
              variant="text"
              sx={{
                padding: "6px 22px",
                borderRadius: "8px",
                color: success700,
                fontSize: "12px",
                lineHeight: "18px",
                fontWeight: "700",
              }}
            >
              Add Info
            </Button>
          </div>
        )}

        {/* bank data create stage  */}
        {bankData === "create" && (
          <>
            {!isEditBtn && (
              <div>
                <p className="instruction-bank">
                  "You can fill in the bank information only once."
                </p>
              </div>
            )}
            <div style={{ marginTop: "20px" }}>
              {isBank && (
                <BankForm
                  isEditBtn={isEditBtn}
                  getEmpData={getEmpData}
                  setBankData={setBankData}
                  setConfirmationMOdal={setConfirmationMOdal}
                  // setHasBankData={setHasBankData}
                  empBasic={empBasic}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  singleData={{
                    bankName: {
                      value: empBasic?.intBankOrWalletType === 1 ? empBasic?.intBankWalletId : 0,
                      label: empBasic?.intBankOrWalletType === 1 ? empBasic?.strBankWalletName : "",
                    },
                    branchName: {
                      value: empBasic?.intBankBranchId || 0,
                      label: empBasic?.strBranchName || "",
                    },
                    routingNo: empBasic?.strRoutingNo,
                    districtName: empBasic?.strDistrict || "",
                    swiftCode: empBasic?.strSwiftCode,
                    accName: empBasic?.strAccountName,
                    accNo: empBasic?.intBankOrWalletType === 1 ? empBasic?.strAccountNo : "",
                    isDefault: empBasic?.isPrimarySalaryAccount || false,
                  }}
                ></BankForm>
              )}
              {isDigitalBanking && (
                <DigitalBankForm
                  singleData={{
                    gateway: {
                      value: empBasic?.intBankOrWalletType === 2 ? empBasic?.intBankWalletId : 0,
                      label: empBasic?.intBankOrWalletType === 2 ? empBasic?.strBankWalletName : "",
                    },
                    // accountName: empBasic?.DigitalBankingName,
                    mobileNo: empBasic?.intBankOrWalletType === 2 ? empBasic?.strAccountNo : "",
                    isDefault: empBasic?.isPrimarySalaryAccount || false,
                  }}
                  empBasic={empBasic}
                  setBankData={setBankData}
                  setConfirmationMOdal={setConfirmationMOdal}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                ></DigitalBankForm>
              )}
              {isCash && (
                <CashForm
                  singleData={{
                    gateway: {
                      value: empBasic?.intBankOrWalletType === 2 ? empBasic?.intBankWalletId : 0,
                      label: empBasic?.intBankOrWalletType === 2 ? empBasic?.strBankWalletName : "",
                    },
                    // accountName: empBasic?.DigitalBankingName,
                    mobileNo: empBasic?.intBankOrWalletType === 2 ? empBasic?.strAccountNo : "",
                  }}
                  empBasic={empBasic}
                  setBankData={setBankData}
                  setConfirmationMOdal={setConfirmationMOdal}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                ></CashForm>
              )}
            </div>
          </>
        )}

        {/* bank info view details */}
        {bankData === "complete" && empBasic?.strAccountName && (
          <div className="row pt-4 pb-4">
            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="d-flex bankDetailsInfo bigBankNameIcon align-items-center flex-wrap">
                <Avatar>
                  <AccountBalanceIcon />
                </Avatar>
                <div>
                  <p className="bankName">{isBank ? empBasic?.strBankWalletName : ""}</p>
                  <p className="branchName">
                    {empBasic?.strBranchName} Branch
                  </p>
                  <p className="branchName">
                    {empBasic?.strDistrict} District
                  </p>
                  <p className="routingNo">
                    Routing No <span>{empBasic?.strRoutingNo}</span>
                  </p>
                  <p className="swiftCode">
                    Swift Code <span>{empBasic?.strSwiftCode}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="d-flex">
                <div className="accNameIcon" style={{ marginRight: "20px" }}>
                  <Avatar>
                    <PersonIcon sx={{ color: gray900, fontSize: "16px" }} />
                  </Avatar>
                </div>
                <div>
                  <p className="bankNo">{empBasic?.strAccountName}</p>
                  <p className="bankNo-title">Account Name</p>
                </div>
              </div>
              <div className="d-flex" style={{ marginTop: "15px" }}>
                <div className="accNameIcon" style={{ marginRight: "20px" }}>
                  <Avatar>
                    <AccountBalanceWalletIcon sx={{ color: gray900, fontSize: "16px" }} />
                  </Avatar>
                </div>
                <div>
                  <p className="bankNo">{isBank ? empBasic?.strAccountNo : ""}</p>
                  <p className="bankNo-title">Account No</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* digital banking info details */}
        {bankData === "complete" && !empBasic?.strAccountName && (empBasic?.intBankOrWalletType !== 3) && (
          <div className="pt-1 pb-3">
            <div className="d-flex align-items-center flex-wrap">
              <div className="accNameIcon">
                <Avatar>
                  <AccountBalanceIcon sx={{ color: gray900, fontSize: "16px" }} />
                </Avatar>
              </div>
              <div>
                <p className="digitalBankName ml-3">{empBasic?.strBankWalletName}</p>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap mt-3">
              <div className="accNameIcon">
                <Avatar>
                  <PersonIcon sx={{ color: gray900, fontSize: "16px" }} />
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="bankNo">{empBasic?.strAccountNo}</p>
                <p className="bankNo-title">Mobile No</p>
              </div>
            </div>
          </div>
        )}

        {/* cash info view */}
        {bankData === "complete" && (empBasic?.intBankOrWalletType === 3) && (
          <div className="pt-1 pb-3">
            <div className="d-flex align-items-center flex-wrap">
              <div className="accNameIcon">
                <Avatar>
                  <AttachMoneyOutlined sx={{ color: gray900, fontSize: "16px" }} />
                </Avatar>
              </div>
              <div>
                <p className="digitalBankName ml-3">Cash Payment</p>
              </div>
            </div>
          </div>
        )}

      </div>
      <ViewModal
        show={confirmationMOdal}
        title={"Confirm your bank info"}
        onHide={() => setConfirmationMOdal(false)}
        size="md"
        backdrop="static"
        classes="default-modal creat-job-modal"
      >
        <ConfirmationModal
          rowDto={rowDto}
          setConfirmationMOdal={setConfirmationMOdal}
          setBankData={setBankData}
          getEmpData={getEmpData}
          empId={empId}
          isEditBtn={isEditBtn}
          empBasic={empBasic}
          isBank={isBank}
          isDigitalBanking={isDigitalBanking}
          isCash={isCash}
        ></ConfirmationModal>
      </ViewModal>
    </div>
  );
};

export default BankDetails;
