import { Close } from "@mui/icons-material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Form, Formik } from "formik";
import { DateRangePicker } from "materialui-daterange-picker";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import FormikInput from "../../../../../common/FormikInput";
import Loading from "../../../../../common/loading/Loading";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../../../utility/dateFormatter";
import {
  createLeaveApplication,
  getAllLeaveApplicatonListData,
} from "../../helper";

const initData = {
  dateRange: "",
};

export default function CreateModal({ objProps }) {
  const {
    show,
    size,
    backdrop,
    classes,
    title,
    onHide,
    singleData,
    setSingleData,
    setAllLeaveApplicatonData,
    filterValues,
    setAllData,
    isSupOrLineManager,
    isVisibleHeading = true,
    fullscreen = false,
  } = objProps;
  const [loading, setLoading] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [modifySingleData, setModifySingleData] = useState([]);
  const dataRanges = [{ label: "" }];
  const toggle = () => setDateOpen(false);
  const saveHandler = (values) => {};

  const { orgId, employeeId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const callback = () => {
    getAllLeaveApplicatonListData(
      {
        approverId: employeeId,
        workplaceGroupId: filterValues?.workplace?.id || 0,
        departmentId: filterValues?.department?.id || 0,
        designationId: filterValues?.designation?.id || 0,
        applicantId: filterValues?.employee?.id || 0,
        leaveTypeId: filterValues?.leaveType?.LeaveTypeId || 0,
        fromDate: filterValues?.fromDate || "",
        toDate: filterValues?.toDate || "",
        applicationStatus:
          filterValues?.appStatus?.label === "Rejected"
            ? "Reject"
            : filterValues?.appStatus?.label || "Pending",
        isAdmin: isOfficeAdmin,
        isSupOrLineManager: isSupOrLineManager?.value,
        accountId: orgId,
      },

      setAllLeaveApplicatonData,
      setAllData,
      setLoading
    );

    onHide();
    setSingleData("");
  };

  const handleEdit = (values) => {
    let payload = [
      {
        applicationId: singleData?.leaveApplication?.intApplicationId,
        // approverEmployeeId: singleData?.leaveApplication?.intEmployeeId,
        approverEmployeeId: employeeId,
        // isReject: true,
        fromDate: dateFormatterForInput(values?.dateRange?.startDate),
        toDate: dateFormatterForInput(values?.dateRange?.endDate),
        isAdmin: isOfficeAdmin,
      },
    ];

    createLeaveApplication(payload, callback);
  };

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        dateRange: {
          startDate: dateFormatterForInput(
            singleData?.leaveApplication?.dteFromDate
          ),
          endDate: dateFormatterForInput(
            singleData?.leaveApplication?.dteToDate
          ),
        },
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData ? modifySingleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
            {loading && <Loading />}
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
                      <div className="d-flex w-100 justify-content-between">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <div
                            className="crossIcon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              onHide();
                              setSingleData("");
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="createModal">
                      <div className="leave-form card">
                        <div className="row">
                          <div className="col-md-12">
                            <table className="table table-borderless">
                              <tr>
                                <td>Leave Type</td>
                                <td>{singleData?.leaveType}</td>
                              </tr>
                              <tr>
                                <td>Location</td>
                                <td>
                                  {
                                    singleData?.leaveApplication
                                      ?.strAddressDuetoLeave
                                  }
                                </td>
                              </tr>
                              <tr>
                                <td>Reason</td>
                                <td>
                                  {singleData?.leaveApplication?.strReason}
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                        <div>
                          <div onClick={() => setDateOpen(!dateOpen)}>
                            <FormikInput
                              classes="search-input input-sm"
                              inputClasses="search-inner-input"
                              placeholder="Select Date Range"
                              value={`${
                                values?.dateRange?.startDate || "Start Date"
                              } - ${values?.dateRange?.endDate || "End Date"}`}
                              name="dateRange"
                              type="text"
                              onChange={(e) => setFieldValue("dateRange", "")}
                              trailicon={
                                <DateRangeIcon sx={{ color: "#323232" }} />
                              }
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <DateRangePicker
                            open={dateOpen}
                            definedRanges={dataRanges}
                            toggle={toggle}
                            wrapperClassName="date-rang-picker simple-date-rang-picker"
                            onChange={(range) => {
                              if (range) {
                                setFieldValue("dateRange", {
                                  startDate: dateFormatter(range?.startDate),
                                  endDate: dateFormatter(range?.endDate),
                                });
                                setDateOpen(true);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="modal-btn modal-btn-cancel"
                      sx={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        onHide();
                        setSingleData("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="modal-btn modal-btn-save"
                      type="button"
                      onClick={() => {
                        if (singleData) {
                          handleEdit(values);
                        }
                      }}
                    >
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
