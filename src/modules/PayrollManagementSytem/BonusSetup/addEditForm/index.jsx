import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import BackButton from "../../../../common/BackButton";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../common/DefaultInput";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { AddOutlined } from "@mui/icons-material";
import ViewModal from "../../../../common/ViewModal";
import AddBonusName from "./AddBonusName";
import { createBonusSetup, getBonusNameDDL } from "../helper";
import { todayDate } from "../../../../utility/todayDate";
import { useLocation } from "react-router-dom";

const initData = {
  bonusName: "",
  religion: "",
  employmentType: "",
  servicelength: "",
  maxServicelength: "",
  bonusPercentageOn: "",
  bonusPercentage: "",
  isActive: true,
};

const validationSchema = Yup.object().shape({
  bonusName: Yup.object()
    .shape({
      value: Yup.string().required("Bonus name is required"),
      label: Yup.string().required("Bonus name is required"),
    })
    .typeError("Bonus name is required"),
  religion: Yup.object()
    .shape({
      value: Yup.string().required("Religion is required"),
      label: Yup.string().required("Religion is required"),
    })
    .typeError("Religion is required"),
  servicelength: Yup.number()
    .min(0, "Must be positive number!!!")
    .required("Service Length is required"),
  bonusPercentageOn: Yup.object()
    .shape({
      value: Yup.string().required("Bonus Percentage On is required"),
      label: Yup.string().required("Bonus Percentage On is required"),
    })
    .typeError("Bonus Percentage on is required"),
  bonusPercentage: Yup.number()
    .min(1, "Must be greater than zero!!!")
    .required("Bonus Percentage is required"),
});

export default function BonusSetupForm() {
  const params = useParams();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 72) {
      permission = item;
    }
  });

  const [loading, setLoading] = useState(false);
  const [bonusNameDDL, setBonusNameDDL] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  useEffect(() => {
    getBonusNameDDL(
      {
        strPartName: "BonusNameList",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: 0,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
      },
      setBonusNameDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Religion&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      "ReligionId",
      "ReligionName",
      setReligionDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "Id",
      "EmploymentType",
      setEmploymentTypeDDL
    );
  }, [orgId, buId, wgId]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
    };

    let payload = {
      intBonusId: values?.bonusName?.value,
      strBonusName: values?.bonusName?.label,
      strBonusDescription: "",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intReligion: values?.religion?.value,
      strReligionName: values?.religion?.label,
      intEmploymentTypeId: values?.employmentType?.value,
      strEmploymentType: values?.employmentType?.label,
      intMinimumServiceLengthMonth: +values?.servicelength,
      intMaximumServiceLengthMonth: +values?.maxServicelength,
      strBonusPercentageOn: values?.bonusPercentageOn?.label,
      numBonusPercentage: +values?.bonusPercentage,
      intCreatedBy: employeeId,
      isActive: values?.isActive,
    };

    if (+params?.id) {
      payload = {
        ...payload,
        strPartName: "BonusSetupUpdate",
        intBonusSetupId: state?.intBonusSetupId,
      };
    } else {
      payload = {
        ...payload,
        strPartName: "BonusSetupCreate",
        intBonusSetupId: 0,
      };
    }
    createBonusSetup(payload, setLoading, callback);
  };

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: +params?.id
        ? {
          bonusName: {
            value: state?.intBonusId,
            label: state?.strBonusName,
          },
          religion: {
            value: state?.intReligion,
            label: state?.strReligionName,
          },
          employmentType: {
            value: state?.intEmploymentTypeId,
            label: state?.strEmploymentType,
          },
          servicelength: state?.intMinimumServiceLengthMonth || "0",
          maxServicelength: state?.intMaximumServiceLengthMonth || "0",
          bonusPercentageOn: {
            value: state?.strBonusPercentageOn === "Gross" ? 1 : 2,
            label: state?.strBonusPercentageOn,
          },
          bonusPercentage: state?.numBonusPercentage,
          isActive: state?.isActive,
        }
        : {
          ...initData,
        },
      onSubmit: (values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (params?.id) {
          } else {
            resetForm(initData);
          }
        });
      },
    });

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            <div className="table-card-heading mb12">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>
                  {params?.id ? "Edit Bonus Setup" : "Create Bonus Setup"}
                </h2>
              </div>
              <ul className="d-flex flex-wrap">
                <li>
                  <button
                    type="button"
                    className="btn btn-cancel mr-2"
                    onClick={() => {
                      resetForm(initData);
                    }}
                  >
                    Reset
                  </button>
                </li>
                <li>
                  <button type="submit" className="btn btn-default flex-center">
                    Save
                  </button>
                </li>
              </ul>
            </div>
            <div className="table-card-body">
              <div className="col-md-12 px-0 mt-3">
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>Bonus Name</label>
                      <div className="policy-category-ddl-wrapper">
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={customStyles}
                          name="bonusName"
                          options={bonusNameDDL || []}
                          value={values?.bonusName}
                          onChange={(valueOption) => {
                            setFieldValue("bonusName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                        <div className="category-add">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShow(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Religion</label>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={customStyles}
                        name="religion"
                        options={
                          [{ value: 0, label: "All" }, ...religionDDL] || []
                        }
                        value={values?.religion}
                        onChange={(valueOption) => {
                          setFieldValue("religion", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 d-none">
                      <label>Employment Type</label>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={customStyles}
                        name="employmentType"
                        options={employmentTypeDDL || []}
                        value={values?.employmentType}
                        onChange={(valueOption) => {
                          setFieldValue("employmentType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Min. Service Length (Month)</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.servicelength || " "}
                          name="servicelength"
                          type="number"
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("servicelength", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Max. Service Length (Month)</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.maxServicelength || " "}
                          name="maxServicelength"
                          type="number"
                          placeholder=" "
                          onChange={(e) => {
                            if (values?.servicelength <= e.target.value) {
                              setFieldValue("maxServicelength", e.target.value);
                            } else {
                              setFieldValue("maxServicelength", "");
                            }
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={!values?.servicelength}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Bonus Percentage On</label>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={customStyles}
                        name="bonusPercentageOn"
                        options={
                          [
                            { value: 1, label: "Gross" },
                            { value: 2, label: "Basic" },
                          ] || []
                        }
                        value={values?.bonusPercentageOn}
                        onChange={(valueOption) => {
                          setFieldValue("bonusPercentageOn", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Bonus Percentage (%)</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.bonusPercentage}
                          name="bonusPercentage"
                          type="number"
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("bonusPercentage", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    {/* {params?.id && (
                      <>
                        <div className="col-lg-3">
                          <div
                            className="d-flex align-items-center small-checkbox"
                            style={{ marginTop: "20px" }}
                          >
                            <FormikCheckBox
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              label="isActive ?"
                              checked={values?.isActive}
                              onChange={(e) => {
                                setFieldValue("isActive", e.target.checked);
                              }}
                              labelFontSize="12px"
                            />
                          </div>
                        </div>
                      </>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Modal */}
          <ViewModal
            size="lg"
            title="Create Bonus Name"
            backdrop="static"
            classes="default-modal preview-modal"
            show={show}
            onHide={() => setShow(false)}
          >
            <AddBonusName
              orgId={orgId}
              employeeId={employeeId}
              buId={buId}
              setBonusNameDDL={setBonusNameDDL}
              setShow={setShow}
              setLoading={setLoading}
            />
          </ViewModal>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
