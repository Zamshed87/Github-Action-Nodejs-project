/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
import { customStyles } from "../../../../../utility/newSelectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import { holidayAndExceptionOffdayAssign, makePayload } from "../helper";
import "../holidayException.css";

const initData = {
  holidayEffectiveDate: "",
  holidayGroup: "",
  exceptionEffectiveDate: "",
  exceptionOffDayGroup: "",
};

const HolidayExceptionModal = ({
  setShow,
  setSingleData,
  singleData,
  getData,
  selectedDto,
  setSelectedDto,
  isMulti,
  setIsMulti,
  isEdit,
  setIsEdit,
}) => {
  const { orgId, buId, workPlaceGroupId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [allHolidayGroupDDL, setAllHolidayGroupDDL] = useState([]);
  const [exceptionOffdayGroupDDL, setExceptionOffdayGroupDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        holidayEffectiveDate:
          singleData[0]?.holidayEffectiveDate &&
          dateFormatterForInput(singleData[0]?.holidayEffectiveDate),
        holidayGroup: {
          value: singleData[0]?.holidayGroupId,
          label: singleData[0]?.holidayGroupName,
        },
        exceptionEffectiveDate: todayDate(),
        exceptionOffDayGroup: {
          value: singleData[0]?.exceptionOffdayGroupId,
          label: singleData[0]?.exceptionOffdayGroupName,
        },
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=HolidayGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "HolidayGroupId",
      "HolidayGroupName",
      setAllHolidayGroupDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=ExceptionOffdayGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "ExceptionOffdayGroupId",
      "ExceptionOffdayName",
      setExceptionOffdayGroupDDL
    );
  }, [orgId, buId, wgId]);
  const saveHandler = (values, cb) => {
    let payload = makePayload(
      isMulti ? selectedDto : singleData,
      {
        orgId,
        buId,
        workPlaceGroupId,
        employeeId,
      },
      values
    );
    holidayAndExceptionOffdayAssign(payload, setLoading, cb);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={isEdit ? modifySingleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setSelectedDto([]);
            setSingleData([]);
            getData();
            setIsMulti(false);
            setIsEdit(false);
            setShow(false);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="holiday-exception-modal">
                <div className="modal-body2" style={{ padding: "10px 16px" }}>
                  <div className="row">
                    <div className="col-12" style={{ paddingBottom: "10px" }}>
                      <h6 className="title-item-name mb-2">Holiday</h6>
                      <div className="row">
                        <div className="col-lg-6">
                          <label>Effective Date</label>
                          <FormikInput
                            classes="input-sm"
                            label=""
                            value={values?.holidayEffectiveDate}
                            name="holidayEffectiveDate"
                            onChange={(e) => {
                              setFieldValue(
                                "holidayEffectiveDate",
                                e.target.value
                              );
                            }}
                            type="date"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6">
                          <label>Holiday Group</label>
                          <FormikSelect
                            name="holidayGroup"
                            options={allHolidayGroupDDL || []}
                            menuPosition="fixed"
                            value={values?.holidayGroup}
                            label=""
                            onChange={(valueOption) => {
                              setFieldValue("holidayGroup", valueOption);
                            }}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer form-modal-footer">
                  <button
                    type="button"
                    onClick={(e) => {
                      setShow(false);
                      setSingleData([]);
                    }}
                    className="btn btn-cancel"
                    style={{
                      marginRight: "15px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-default"
                    type="submit"
                    disabled={
                      !(values?.holidayEffectiveDate && values?.holidayGroup) ||
                      loading
                    }
                  >
                    {values?.holidayEffectiveDate <= todayDate()
                      ? "Save And Process"
                      : "Save"}
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default HolidayExceptionModal;
