import { Close } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import { updateLoanReschedule } from "../reschedule/helper";

const initData = {
  installmentAmount: "",
  installmentNo: "",
  purpose: "",
  effectiveDate: "",
};
const validationSchema = Yup.object().shape({
  installmentAmount: Yup.number()
    .integer("Must be integer")
    .required("Installment amount is required"),
  installmentNo: Yup.number()
    .integer("Must be integer")
    .required("Installment no is required"),
  purpose: Yup.string().required("Purpose is required"),
  effectiveDate: Yup.string().required("Effective date is required"),
});

export default function CreateModal({
  id,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  getData,
  singleData,
}) {
  const [loading, setLoading] = useState(false);

  const { userId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { state } = useLocation();

  const saveHandler = (values, cb) => {
    if (+values?.installmentNo > +singleData?.dueInstallment)
      return toast.warn("Installment number can't be greather than due amount");
    const payload = [
      {
        loanApplicationId: singleData?.loanApplicationId,
        isApprove: true,
        approveNumberOfInstallment: Math.ceil(values?.installmentNo),
        approveNumberOfInstallmentAmount: Math.floor(values?.installmentAmount),
        approveDate: values?.effectiveDate,
        isReject: false,
        rejectBy: "",
        updateByUserId: userId,
        reScheduleRemarks: values?.purpose,
      },
    ];
    updateLoanReschedule(payload, setLoading, cb);
  };

  const labelShowLastInstallmentAmt = (values) => {
    const lastAmount = singleData?.remainingBalance % values?.installmentAmount;
    if (lastAmount > 0) {
      return <p>Last Installment Amount : {lastAmount}</p>;
    } else {
      return null;
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? state : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            onHide();
            getData();
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
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
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <div
                            className="crossIcon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (id) {
                                resetForm(state);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    {loading && <Loading />}
                    <div className="create-modal">
                      <div className="d-flex p-1 px-4 align-items-center border-bottom">
                        <AvatarComponent
                          alt="Remy Sharp"
                          src=""
                          letterCount={1}
                          label={singleData?.employeeName}
                          sx={{
                            width: "40px !important",
                            height: "40px !important",
                          }}
                        />
                        <div className="employeeTitle ml-3">
                          <h6 className="title-item-name">
                            {singleData?.employeeName}
                            {` [${singleData?.employeeCode}]`}
                          </h6>
                          <p className="subtitle-p">
                            {singleData?.positionName}
                          </p>
                          <p className="subtitle-p">
                            {singleData?.positonGroupName}
                          </p>
                        </div>
                      </div>
                      <div className="row py-1 px-3 m-0 border-bottom">
                        <div className="col-md-6 ">
                          <table className="table table-borderless mb-2">
                            <tr>
                              <td>Loan Type</td>
                              <td>{singleData?.loanType}</td>
                            </tr>
                            <tr>
                              <td>Application Date</td>
                              <td>
                                {dateFormatter(singleData?.applicationDate)}
                              </td>
                            </tr>
                            <tr>
                              <td>Loan Amount</td>
                              <td>BDT {singleData?.loanAmount}</td>
                            </tr>
                            <tr>
                              <td>Installment Number</td>
                              <td>{singleData?.numberOfInstallment}</td>
                            </tr>
                          </table>
                        </div>
                        <div className="pl-2 border-left"></div>
                        <div className="col-md-5">
                          <table className="table table-borderless mb-2">
                            <tr>
                              <td>Paid Amount</td>
                              <td>{singleData?.paidAmount}</td>
                            </tr>
                            <tr>
                              <td>Paid Installment</td>
                              <td>{singleData?.paidInstallment}</td>
                            </tr>
                            <tr>
                              <td>Due Amount</td>
                              <td>BDT {singleData?.remainingBalance}</td>
                            </tr>
                            <tr>
                              <td>Due Installment</td>
                              <td>{singleData?.dueInstallment}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div className="formInput p-4">
                        <div className="row">
                          <div className="col-6">
                            <label>New Installment Amount</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.installmentAmount}
                              name="installmentAmount"
                              type="number"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue(
                                  "installmentAmount",
                                  e.target.value
                                );
                                const installmentNo =
                                  (singleData?.remainingBalance || 0) /
                                  e.target.value;
                                setFieldValue(
                                  "installmentNo",
                                  Math.ceil(installmentNo)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>New No of Installment</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.installmentNo}
                              name="installmentNo"
                              type="number"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("installmentNo", e.target.value);
                                const installmentAmount =
                                  (singleData?.remainingBalance || 0) /
                                  e.target.value;
                                setFieldValue(
                                  "installmentAmount",
                                  Math.floor(installmentAmount)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Purpose</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.purpose}
                              name="purpose"
                              type="text"
                              className="form-control"
                              placeholder="Purpose"
                              onChange={(e) => {
                                setFieldValue("purpose", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Effective Date</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.effectiveDate}
                              name="effectiveDate"
                              type="date"
                              className="form-control"
                              placeholder="effectiveDate"
                              onChange={(e) => {
                                setFieldValue("effectiveDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                              min={todayDate()}
                            />
                          </div>
                          <div className="col-lg-6">
                            {labelShowLastInstallmentAmt(values)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="modal-btn modal-btn-cancel"
                      onClick={() => {
                        resetForm(initData);
                        onHide();
                      }}
                    >
                      Cancel
                    </button>
                    <button className="modal-btn modal-btn-save" type="submit">
                      Save
                    </button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
