import React, { useState } from "react";
import HeaderView from "./HeaderView";
import DefaultInput from "common/DefaultInput";
import { useFormik } from "formik";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { shallowEqual, useSelector } from "react-redux";
import { PButton } from "Components";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import moment from "moment";
import { roundToDecimals } from "modules/CompensationBenefits/employeeSalary/salaryAssign/salaryAssignCal";

const EarlySettled = ({ loanByIdDto, headerId, setViewEarlySettled }) => {
  const [, saveData] = useAxiosPost({});

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);

  const { values, setFieldValue, handleSubmit, resetForm } = useFormik({
    initialValues: {
      interestOutstanding: 0,
    },
  });

  const saveHandler = (values) => {
    if (!values?.settlementDate) {
      return toast.error("Please select settlement date");
    }

    if (!values?.totalOutstanding) {
      return toast.error("Please enter total outstanding");
    }
    if (values?.totalOutstanding < 0) {
      return toast.error("Total outstanding cannot be negative");
    }

    const payload = {
      headerId: headerId,
      settlementDate: values?.settlementDate,
      principalAmount: values?.principalOutstanding || 0,
      interestAmount: values?.interestOutstanding || 0,
      concessionAmount: values?.concessionAmount || 0,
      totalOutstanding: values?.totalOutstanding || 0,
      remark: values?.comments || "",
      documentId:
        (attachmentList[0]?.response.length > 0 &&
          attachmentList[0]?.response[0]?.globalFileUrlId) ||
        0,
    };
    const cb = (res) => {
      if (res?.statusCode > 299) {
        return toast.error(res?.message);
      } else {
        resetForm();
        setViewEarlySettled(false);
        toast.success(res?.message || "Submitted Successfully");
      }
    };
    saveData(
      "/PfLoan/CreateEarlySettlement",
      payload,
      cb,
      true,
      {},
      {},
      (error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const messages = error.response.data.message;
          const errorMessage = Array.isArray(messages)
            ? messages.join(", ")
            : messages;
          toast.error(errorMessage);
        } else {
          toast.error("Something went wrong!");
        }
      }
    );
  };
  const numberOfDaysDifFromlastSalaryDateToSettlementDate = (
    settlementDate
  ) => {
    const lastSalaryDate = new Date(loanByIdDto?.objHeader?.lastSalaryDate);
    const timeDiff = Math.abs(new Date(settlementDate) - lastSalaryDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };
  return (
    <div className="mx-3">
      <div className="d-flex justify-content-between">
        <HeaderView loanByIdDto={loanByIdDto} />
        <div> </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* {(loading || dataLoading || loanByIdLoading) && <Loading />} */}
        <div className="table-card">
          <div className="table-card-heading" style={{ marginBottom: "12px" }}>
            <div className="table-card-head-right"></div>
          </div>
          <div className="card-style pb-0 mb-2">
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Date of Settlement *</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.settlementDate}
                    placeholder="Month"
                    name="settlementDate"
                    type="date"
                    className="form-control"
                    min={moment(loanByIdDto?.objHeader?.lastSalaryDate)
                      .add(1, "days")
                      .format("YYYY-MM-DD")}
                    onChange={(e) => {
                      setFieldValue("settlementDate", e.target.value);
                      setFieldValue(
                        "principalOutstanding",
                        loanByIdDto?.objHeader?.principalOutstandingAmount || 0
                      );
                      setFieldValue(
                        "interestOutstanding",
                        roundToDecimals(
                          loanByIdDto?.objHeader?.interestOutstandingAmount / 30
                        ) *
                          numberOfDaysDifFromlastSalaryDateToSettlementDate(
                            e.target.value
                          )
                      );
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Principal Outstanding</label>
                  <DefaultInput
                    classes="input-sm"
                    type="number"
                    min={0}
                    value={values?.principalOutstanding}
                    placeholder="Principal Outstanding"
                    name="principalOutstanding"
                    disabled={true}
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("principalOutstanding", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Interest Outstanding</label>
                  <DefaultInput
                    classes="input-sm"
                    type="number"
                    min={0}
                    value={values?.interestOutstanding}
                    placeholder="Interest Outstanding"
                    disabled={true}
                    name="interestOutstanding"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("interestOutstanding", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Concession Amount *</label>
                  <DefaultInput
                    classes="input-sm"
                    type="number"
                    min={0}
                    value={values?.concessionAmount}
                    placeholder="Concession Amount"
                    name="concessionAmount"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("concessionAmount", e.target.value);
                      const totalOutstanding =
                        values?.principalOutstanding +
                        values?.interestOutstanding -
                        e.target.value;
                      setFieldValue("totalOutstanding", totalOutstanding);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Total Outstanding</label>
                  <DefaultInput
                    classes="input-sm"
                    type="number"
                    min={0}
                    disabled={true}
                    value={values?.totalOutstanding}
                    placeholder="Total Outstanding"
                    name="totalOutstanding"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("totalOutstanding", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <FileUploadComponents
                  propsObj={{
                    isOpen,
                    setIsOpen,
                    destroyOnClose: false,
                    attachmentList,
                    setAttachmentList,
                    accountId: orgId,
                    tableReferrence: "EARLY_SETTLED",
                    documentTypeId: 38,
                    userId: employeeId,
                    buId: buId,
                    maxCount: 20,
                    isIcon: true,
                    isErrorInfo: true,
                    subText:
                      "Recommended file formats are: PDF, JPG and PNG. Maximum file size is 2 MB",
                  }}
                />
              </div>
              <div className="col-lg-12">
                <div className="input-field-main">
                  <label>Comments</label>
                  <DefaultInput
                    classes="input-sm"
                    type="textArea"
                    value={values?.comments}
                    placeholder="Comments"
                    name="comments"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("comments", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-10"></div>
              <div className="col-lg-2 d-flex justify-content-end">
                <PButton
                  className="mb-2"
                  type="primary"
                  content={"Save"}
                  onClick={() => {
                    saveHandler(values);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EarlySettled;
