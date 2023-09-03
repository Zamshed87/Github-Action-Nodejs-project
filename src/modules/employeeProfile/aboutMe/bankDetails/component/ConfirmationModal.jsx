import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import confirmationModalImg from "../../../../../assets/images/bankConfirmationModal.svg";
import { todayDate } from "../../../../../utility/todayDate";
import { bankDetailsAction } from "../../helper";
const ConfirmationModal = ({
  rowDto,
  setConfirmationMOdal,
  setBankData,
  getEmpData,
  empId,
  isEditBtn,
  empBasic,
  isBank,
  isDigitalBanking,
  isCash
}) => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const { buId, orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const handleConfirm = () => {
    let payload = {};

    payload = {
      ...payload,
      partId: empBasic?.intEmployeeBasicInfoId ? 2 : 1,
      intEmployeeBankDetailsId: empBasic?.intEmployeeBankDetailsId || 0,
      intEmployeeBasicInfoId: +empId || 0,
      isPrimarySalaryAccount: true,
      isActive: true,
      intWorkplaceId: 0,
      intBusinessUnitId: buId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    if (isBank) {
      //swift code validation
      // const swiftRegex = /[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?/;
      // const swiftCodeValidate = rowDto[0]?.swiftCode.match(swiftRegex);
      // swift code check
      // if (rowDto[0]?.swiftCode) {
      //   if (swiftCodeValidate?.length === 2) {
      //     payload = {
      //       ...payload,
      //       strSwiftCode: rowDto[0]?.swiftCode || "",
      //     };
      //   } else {
      //     return toast.warn("Please provide valid Swift Code (IBBLBDDH102) !");
      //   }
      // } else {
      //   return toast.warn("Swift Code is required !");
      // }
      payload = {
        ...payload,
        intBankOrWalletType: 1,
        intBankWalletId: rowDto[0]?.bankId || 0,
        strBankWalletName: rowDto[0]?.bankName || "",
        strDistrict: rowDto[0]?.districtName || "",
        intBankBranchId: rowDto[0]?.branchId || 0,
        strBranchName: rowDto[0]?.branch || "",
        strRoutingNo: rowDto[0]?.routingNo || "",
        strAccountName: rowDto[0]?.accName || "",
        strAccountNo: rowDto[0]?.accNo || "",
        strSwiftCode: rowDto[0]?.swiftCode || "",

      };
      bankDetailsAction(payload, setLoading, getEmpData, setConfirmationMOdal);
    }

    if (isDigitalBanking) {
      payload = {
        ...payload,
        intBankOrWalletType: 2,
        intBankWalletId: rowDto[0]?.gatewayId || 0,
        strBankWalletName: rowDto[0]?.gateway || "",
        strDistrict: "",
        intBankBranchId: 0,
        strBranchName: "",
        strRoutingNo: "",
        strAccountName: "",
        strAccountNo: rowDto[0]?.mobileNo || "",
      };

      bankDetailsAction(payload, setLoading, getEmpData, setConfirmationMOdal);
    }
    if (isCash) {
      payload = {
        ...payload,
        intBankOrWalletType: 3,
        intBankWalletId: 0,
        strBankWalletName: "",
        strDistrict: "",
        intBankBranchId: 0,
        strBranchName: "",
        strRoutingNo: "",
        strAccountName: "",
        strAccountNo: "",
      };
      bankDetailsAction(payload, setLoading, getEmpData, setConfirmationMOdal);
    }
  };

  return (
    <div>
      <div className="modal-body-inside p-3 bg-white border-top shadow">
        <div className="d-flex align-items-center border-bottom pt-2 pb-4">
          <img
            src={confirmationModalImg}
            alt=""
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          {isBank ? (
            <p className="confirmation-instruction ml-3">
              Please check your bank info again. After your confirmation you can
              not change or edit anything of bank information.
            </p>
          ) : (
            <p className="confirmation-instruction ml-3">
              Please check your digital banking info again. After your
              confirmation you can not change or edit anything of digital
              banking information.
            </p>
          )}
        </div>
        {rowDto[0]?.bankName && (
          <div className="pl-3 mt-3 mb-2">
            <p className="bankName">{rowDto[0]?.bankName}</p>
            <p className="branchName mt-1">{rowDto[0]?.branch}</p>
            <p className="branchName mt-1">{rowDto[0]?.districtName}</p>
            <p className="routingNo mt-1">
              Routing No <span>{rowDto[0]?.routingNo}</span>
            </p>
            <p className="swiftCode mt-1">
              Swift Code <span>{rowDto[0]?.swiftCode}</span>
            </p>
            <p className="swiftCode mt-1">
              Account Name <span>{rowDto[0]?.accName}</span>
            </p>
            <p className="swiftCode mt-1">
              Account no <span>{rowDto[0]?.accNo}</span>
            </p>
          </div>
        )}
        {rowDto[0]?.gateway && (
          <div className="pl-3 mt-5 mb-5">
            <p className="bankName">{rowDto[0]?.gateway}</p>
            <p className="swiftCode mt-1">
              Mobile no <span>{rowDto[0]?.mobileNo}</span>
            </p>
          </div>
        )}

        {rowDto[0]?.cash && (
          <div className="pl-3 mt-5 mb-5">
            <p className="bankName">Cash Payment</p>
          </div>
        )}
      </div>
      <div className="modal-footer d-flex justify-content-end bg-white">
        <button
          className="btn btn-cancel"
          type="button"
          // style={{
          //   color: "rgba(0, 0, 0, 0.7)",
          //   background: "#F2F2F7",
          //   fontSize: "10px",
          //   lineHeight: "16px",
          //   letterSpacing: "0.2px",
          //   borderRadius: "8px",
          //   padding: "8px 15px",
          //   textTransform: "uppercase",
          // }}
          onClick={() => {
            setConfirmationMOdal(false);
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-green btn-green-disable"
          type="button"
          onClick={() => {
            handleConfirm();
          }}
        // style={{
        //   fontSize: "10px",
        //   padding: "0",
        //   margin: "0",
        // }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
