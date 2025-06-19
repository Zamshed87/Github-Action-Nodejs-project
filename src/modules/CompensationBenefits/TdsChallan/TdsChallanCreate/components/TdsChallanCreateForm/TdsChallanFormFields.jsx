import { PButton, PCardBody, PInput, PSelect } from "Components";
import useConfigSelectionHook from "./useConfigSelectionHook";
import { Col, Row } from "antd";
import TdsChallanFilters from "modules/CompensationBenefits/TdsChallan/components/filter/TdsChallanFilters";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

const TdsChallanFormFields = ({ form, addData }) => {
  const { contributionOpts, loadingContribution } = useConfigSelectionHook(
    form,
    {
      fetchContributionEnum: true,
    }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  return (
    <>
      <PCardBody className="mb-4">
        <TdsChallanFilters form={form} hideSubmitBtn={true} />
      </PCardBody>
      <PCardBody className="mb-4">
        <Row gutter={[16, 16]}>
          <Col md={4} sm={12} xs={24}>
            <PSelect
              name="transactionMode"
              label="Transaction Mode"
              options={[]} // [{ label: 'Bank', value: 'bank' }, ...]
              placeholder="Select Transaction Mode"
              rules={[
                { required: true, message: "Transaction Mode is required" },
              ]}
            />
          </Col>
          <Col md={4} sm={12} xs={24}>
            <PSelect
              name="bankMfsName"
              label="Bank / MFS Name"
              options={[]} // [{ label: 'bKash', value: 'bkash' }, ...]
              placeholder="Select Bank / MFS Name"
              rules={[
                { required: true, message: "Bank / MFS Name is required" },
              ]}
            />
          </Col>
          <Col md={4} sm={12} xs={24}>
            <PInput
              name="branchOrMfsNumber"
              label="Branch Name / MFS Number"
              placeholder="Enter Branch Name or MFS Number"
              type="text"
              rules={[
                {
                  required: true,
                  message: "Branch Name or MFS Number is required",
                },
              ]}
            />
          </Col>
          <Col md={4} sm={12} xs={24}>
            <PInput
              name="transactionDate"
              label="Challan / Transaction Date"
              type="date"
              format="YYYY-MM-DD"
              placeholder="Select Date"
              rules={[
                { required: true, message: "Transaction Date is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              name="transactionNumber"
              label="Challan / Transaction Number"
              placeholder="Enter Transaction Number"
              type="text"
              rules={[
                { required: true, message: "Transaction Number is required" },
              ]}
            />
          </Col>

          {/* TDS Amount */}
          <Col md={6} sm={12} xs={24}>
            <PInput
              name="tdsAmount"
              label="TDS Amount"
              placeholder="Enter TDS Amount"
              type="number"
              rules={[{ required: true, message: "TDS Amount is required" }]}
            />
          </Col>

          {/* Comments */}
          <Col md={10} sm={12} xs={24}>
            <PInput
              name="comments"
              label="Comments"
              placeholder="Enter any comments"
              type="text"
              rules={[]}
            />
          </Col>

          {/* Attachment Upload */}
          <Col md={4} sm={12} xs={24}>
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
              onClick={addData}
            />
          </Col>
        </Row>
      </PCardBody>
    </>
  );
};

export default TdsChallanFormFields;
