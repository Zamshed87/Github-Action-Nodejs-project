import React from "react";
import { AccountBalance } from "@mui/icons-material";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  gray700,
  gray900,
  greenColor,
} from "../../../../../utility/customColor";

const BankDetails = ({ empInfo, objProps }) => {
  const { values, setFieldValue, isShowCheckBox } = objProps;
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading check">
          <div className="d-flex align-items-center">
            <AccountBalance
              sx={{ mr: "12px", fontSize: "16px", color: gray900 }}
            />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Bank Details
            </h3>
          </div>

          {isShowCheckBox && (
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label=""
              name="isShowBank"
              checked={values?.isShowBank}
              onChange={(e) => {
                setFieldValue("isShowBank", e.target.checked);
              }}
            />
          )}
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>
              Bank/Wallet Name - <small>{empInfo?.strBankWalletName}</small>
            </p>
            <p>
              Branch Name - <small>{empInfo?.strBranchName || ""}</small>
            </p>
            <p>
              Account Name - <small>
                {empInfo?.intBankOrWalletType === 2
                  ? empInfo?.strBankWalletName
                  : empInfo?.strAccountName}
              </small>
            </p>
            <p>
              Account No - <small>
                {empInfo?.intBankOrWalletType === 2
                  ? empInfo?.strAccountNo
                  : empInfo?.strAccountNo}
              </small>
            </p>
            <p>
              Routing No - <small>{empInfo?.strRoutingNo || ""}</small>
            </p>
            <p>
              Swift Code - <small>{empInfo?.strSwiftCode || ""}</small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankDetails;
