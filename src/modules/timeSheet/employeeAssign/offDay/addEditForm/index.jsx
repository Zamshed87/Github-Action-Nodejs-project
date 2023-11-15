import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import Loading from "../../../../../common/loading/Loading";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
import { crudOffDayAssign } from "../helper";
import FormikInput from "./../../../../../common/FormikInput";

const initData = {
  effectiveDate: "",
  isSaturday: false,
  isSunday: false,
  isMonday: false,
  isTuesday: false,
  isWednesday: false,
  isThursday: false,
  isFriday: false,
};

export default function AddEditFormComponent({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  singleData,
  isMulti,
  setIsMulti,
  offDayLanding,
  checked,
  setChecked,
  getData,
  setFieldValueParent,
  isAssignAll,
  setIsAssignAll,
  empIDString,
}) {
  const [loading, setLoading] = useState(false);
  const { employeeId, buId, orgId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData?.isEdit ? singleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          let obj = {
            wId,
            values,
            orgId,
            buId,
            wgId,
            employeeId,
            offDayLanding: checked,
            isMulti,
            singleData,
            setLoading,
            isAssignAll,
            empIDString,
            cb: () => {
              setIsAssignAll(false);
              setChecked([]);
              resetForm(initData);
              setFieldValueParent("search", "");
              setIsMulti(false);
              getData();
            },
          };
          crudOffDayAssign(obj);
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
                          <IconButton
                            onClick={() => {
                              onHide();
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    {loading && <Loading />}
                    <div className="businessUnitModal">
                      <div
                        className="modalBody"
                        style={{ padding: "0px 12px" }}
                      >
                        <div className="row mx-0">
                          <div className="col-12 px-0">
                            <label>Effective Date</label>
                            <FormikInput
                              label=""
                              classes="input-sm"
                              value={dateFormatterForInput(
                                values?.effectiveDate
                              )}
                              type="date"
                              name="effectiveDate"
                              onChange={(e) => {
                                setFieldValue("effectiveDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-evenly">
                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isSaturday"
                              checked={values?.isSaturday}
                              onChange={(e) => {
                                setFieldValue("isSaturday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Saturday</p>
                          </div>
                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isSunday"
                              checked={values?.isSunday}
                              onChange={(e) => {
                                setFieldValue("isSunday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Sunday</p>
                          </div>
                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isMonday"
                              checked={values?.isMonday}
                              onChange={(e) => {
                                setFieldValue("isMonday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Monday</p>
                          </div>
                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isTuesday"
                              checked={values?.isTuesday}
                              onChange={(e) => {
                                setFieldValue("isTuesday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Tuesday</p>
                          </div>

                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isWednesday"
                              checked={values?.isWednesday}
                              onChange={(e) => {
                                setFieldValue("isWednesday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Wednesday</p>
                          </div>
                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isTuesday"
                              checked={values?.isThursday}
                              onChange={(e) => {
                                setFieldValue("isThursday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Thursday</p>
                          </div>
                          <div
                            className="d-flex flex-column p-2"
                            style={{ width: "100px", alignItems: "center" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="isFriday"
                              checked={values?.isFriday}
                              onChange={(e) => {
                                setFieldValue("isFriday", e.target.checked);
                              }}
                            />
                            <p style={{ marginLeft: "-30px" }}>Friday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        style={{
                          marginRight: "15px",
                        }}
                        onClick={() => {
                          onHide();
                          resetForm(initData);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-green"
                        type="submit"
                        onClick={() => onHide()}
                      >
                        Save
                      </button>
                    </div>
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
