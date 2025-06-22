import { PButton, PCardBody, PInput, PSelect } from "Components";
import useTdsChallanFormFields from "./useTdsChallanFormFields";
import { Col, Form, Row } from "antd";
import TdsChallanFilters from "modules/CompensationBenefits/TdsChallan/components/filter/TdsChallanFilters";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

const TdsChallanFormFields = ({ form, addData }) => {
  const { fetchBankMfs, bankOrMfsOptions, loadingBankOrMfs } =
    useTdsChallanFormFields(form);
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  console.log(isOpen, attachmentList, "la la");
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const transactionMode = Form.useWatch("StrTransactionMode", form);
  const getBankMfsLabel = () => {
    if (transactionMode == "Bank") return "Bank";
    return "MFS";
  };
  const getBranchMfsLabel = () => {
    if (transactionMode == "Bank") return "Branch Name";
    return "MFS Number";
  };
  return (
    <>
      <PCardBody className="mb-4">
        <TdsChallanFilters form={form} hideSubmitBtn={true} />
      </PCardBody>
      <PCardBody className="mb-4">
        <Row gutter={[16, 16]}>
          <Col md={4} sm={12} xs={24}>
            <PSelect
              name="StrTransactionMode"
              label="Transaction Mode"
              options={[
                {
                  label: "Bank",
                  value: "Bank",
                },
                {
                  label: "MFS",
                  value: "MFS",
                },
              ]}
              placeholder="Select Transaction Mode"
              onChange={(value) => {
                fetchBankMfs(value);
              }}
              rules={[
                { required: true, message: "Transaction Mode is required" },
              ]}
            />
          </Col>
          <Col md={4} sm={12} xs={24}>
            <PSelect
              name="IntBankWalletId"
              label={`${getBankMfsLabel()} Name`}
              options={bankOrMfsOptions}
              loading={loadingBankOrMfs}
              onChange={(value, op) => {
                form.setFieldsValue({ IntBankWalletId: op });
              }}
              placeholder={`Select ${getBankMfsLabel()} Name`}
              rules={[
                {
                  required: true,
                  message: `${getBankMfsLabel()} Name is required`,
                },
              ]}
            />
          </Col>
          <Col md={4} sm={12} xs={24}>
            <PInput
              name="StrBranchName"
              label={getBranchMfsLabel()}
              placeholder={`Enter ${getBranchMfsLabel()}`}
              type="text"
              rules={[
                {
                  required: true,
                  message: `${getBranchMfsLabel()} is required`,
                },
              ]}
            />
          </Col>
          <Col md={4} sm={12} xs={24}>
            <PInput
              name="DteChallanDateF"
              label="Challan Date"
              type="date"
              format="YYYY-MM-DD"
              placeholder="Select Date"
              onChange={(date, formatDate) => {
                form.setFieldsValue({ DteChallanDate: formatDate });
              }}
              rules={[
                { required: true, message: "Transaction Date is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              name="StrChallanNumber"
              label="Challan Number"
              placeholder="Enter Transaction Number"
              type="text"
              rules={[
                { required: true, message: "Transaction Number is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              name="NumChallanAmount"
              label="TDS Amount"
              placeholder="Enter TDS Amount"
              type="number"
              rules={[{ required: true, message: "TDS Amount is required" }]}
            />
          </Col>
          <Col md={10} sm={12} xs={24}>
            <PInput
              name="StrComment"
              label="Comments"
              placeholder="Enter any comments"
              type="text"
              rules={[]}
            />
          </Col>
          <Col md={4} sm={12} xs={24} style={{ marginTop: "22px" }}>
            <FileUploadComponents
              propsObj={{
                title: "Upload Attachment",
                isOpen,
                setIsOpen,
                destroyOnClose: false,
                attachmentList,
                setAttachmentList,
                accountId: orgId,
                tableReferrence: "TransactionForm",
                documentTypeId: 2,
                userId: employeeId,
                buId,
                maxCount: 1,
              }}
            />
          </Col>
          <Col style={{ marginTop: "23px" }}>
            <PButton
              type="primary"
              action="button"
              content="Add"
              onClick={() => {
                addData(
                  attachmentList?.[0]?.response?.[0]?.globalFileUrlId ?? 0
                );
              }}
            />
          </Col>
        </Row>
      </PCardBody>
    </>
  );
};

export default TdsChallanFormFields;
