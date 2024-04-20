import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import * as Yup from "yup";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ViewModal from "../../../../common/ViewModal";
import { gray900, greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import AddTrainingName from "./AddTrainingName";
import SingleScheduleCard from "./SingleScheduleCard";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";
import { getPeopleDeskAllDDL } from "../../../announcement/helper";
import {
  createSchedule,
  editSchedule,
  getSingleSchedule,
  getTrainingNameAllDDL,
} from "./helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";

const initialValues = {
  trainingName: "",
  resourcePerson: "",
  requestedBy: "",
  batchSize: "",
  batchNo: "",
  fromDate: "",
  toDate: "",
  duration: "",
  venue: "",
  remarks: "",
  isRequested: false,
};

const validationSchema = Yup.object().shape({
  trainingName: Yup.object()
    .shape({
      label: Yup.string().required("Training Name is required"),
      value: Yup.string().required("Training Name is required"),
    })
    .typeError("Training Name is required"),
  resourcePerson: Yup.string().required("Resource Person is required"),
  // .matches(/^([a-zA-Z]+\s)*(?:(?:\. |[' ])[a-zA-Z]+)+$/, "Person Name is not valid!"),
  requestedBy: Yup.object().when("isRequested", {
    is: true,
    then: Yup.object()
      .shape({
        label: Yup.string().required("Request person is required"),
        value: Yup.string().required("Request person is required"),
      })
      .typeError("Request person is required"),
  }),
  batchSize: Yup.number().required("Batch Size is required"),
  batchNo: Yup.string(),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
  duration: Yup.string().required("Duration is required"),
  venue: Yup.string()
    .required("Venue is required")
    .matches(/^[a-zA-Z0-9\s,'-]{3,}$/, "Venue is not valid!"),
  remarks: Yup.string(),
});

const CreateEditSchedule = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orgId, buId, employeeId, intAccountId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmployeeDDL
    );

    getTrainingNameAllDDL(orgId, buId, setTrainingNameDDL);
  }, [orgId, employeeId, buId, wgId]);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(1);
  const [editField, setEditField] = useState({});
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [trainingNameDDL, setTrainingNameDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  //   let permission = null;
  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  permissionList.forEach((item) => {
    if (
      item?.menuReferenceId === 30352 &&
      editField?.strStatus !== "Approved"
    ) {
      permission = item;
    }
  });

  const handleRowDtoDelete = (id) => {
    const updatedData = rowDto.filter((item) => item.id !== id);
    setRowDto(updatedData);
  };

  const { setFieldValue, values, errors, touched, handleSubmit, setValues } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: initialValues,
      onSubmit: (values, { resetForm }) => {
        if (params?.id) {
          editSchedule([{ ...values, ...editField }], employeeId, orgId, buId);
        } else {
          if (editField?.id) {
            const updated = rowDto?.filter((item) => item.id !== editField?.id);
            setRowDto([...updated, { id: editField?.id, ...values }]);
          } else {
            const currId = id;
            setId(currId + 1);
            const newData = [...rowDto, { ...values, id: currId }];
            setRowDto(newData);
          }
          resetForm(initialValues);
        }
      },
    });

  const modifyPayload = (payload) => {
    const newPayload = {
      trainingName: {
        label: payload?.strTrainingName,
        value: payload?.intTrainingId,
      },
      resourcePerson: payload?.strResourcePersonName,
      requestedBy: {
        label: payload?.strEmployeeName,
        value: payload?.intRequestedByEmp,
      },
      batchSize: payload?.intBatchSize,
      batchNo: payload?.strBatchNo,
      fromDate: dateFormatterForInput(payload?.dteFromDate),
      toDate: dateFormatterForInput(payload?.dteToDate),
      duration: payload?.numTotalDuration,
      venue: payload?.strVenue,
      remarks: payload?.strRemarks,
      isRequested: payload?.isRequestedSchedule,
    };

    return newPayload;
  };

  const handleEdit = (id) => {
    const updatedData = rowDto.filter((item) => item.id === id)[0];
    setEditField(updatedData);
    const newFieldValue = {
      trainingName: {
        label: updatedData?.trainingName?.label,
        value: updatedData?.trainingName?.value,
      },
      resourcePerson: updatedData?.resourcePerson,
      requestedBy: {
        label: updatedData?.requestedBy?.label,
        value: updatedData?.requestedBy?.value,
      },
      batchSize: updatedData?.batchSize,
      batchNo: updatedData?.batchNo,
      fromDate: dateFormatterForInput(updatedData?.fromDate),
      toDate: dateFormatterForInput(updatedData?.toDate),
      duration: updatedData?.duration,
      venue: updatedData?.venue,
      remarks: updatedData?.remarks,
      isRequested: updatedData?.requestedBy ? true : false,
    };
    setValues(newFieldValue);
  };

  const handleScheduleSubmit = () => {
    if (rowDto?.length) {
      const cb = () => {
        history.push(`/trainingAndDevelopment/training/schedule`);
      };
      createSchedule(rowDto, employeeId, orgId, buId, cb);
    }
  };

  useEffect(() => {
    if (params?.id) {
      const cb = (res) => {
        setValues(modifyPayload(res));
      };
      getSingleSchedule(setEditField, setLoading, orgId, buId, params?.id, cb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="table-card">
              <div className="table-card-heading mb12">
                <div className="d-flex align-items-center">
                  <BackButton />
                  <h2>
                    {params?.id
                      ? "Edit Training Schedule"
                      : "New Training Schedule"}
                  </h2>
                </div>
                {!params?.id && (
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        className="btn btn-default flex-center"
                        onClick={handleScheduleSubmit}
                        disabled={!rowDto?.length}
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <div className="table-card-body">
                <div className="col-md-12 px-0 mt-3">
                  <div className="card-style">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="d-flex align-items-center">
                          <label>Training Name</label>
                          <button
                            type="button"
                            className="ml-3"
                            style={{
                              fontSize: "12px",
                              border: "none",
                              padding: "0px",
                              color: greenColor,
                              cursor: "pointer",
                              marginBottom: "2px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShow(true);
                            }}
                          >
                            Add New
                          </button>
                        </div>
                        <div className="policy-category-ddl-wrapper">
                          <FormikSelect
                            placeholder=" "
                            classes="input-sm"
                            styles={customStyles}
                            name="trainingName"
                            options={trainingNameDDL || []}
                            value={values?.trainingName}
                            onChange={(valueOption) => {
                              setFieldValue("trainingName", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <label>Duration (Hours)</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.duration}
                          name="duration"
                          min={1}
                          type="number"
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("duration", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>From Date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.fromDate}
                          name="fromDate"
                          type="date"
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>To date</label>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.toDate}
                            name="toDate"
                            type="date"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <label>Venue</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.venue}
                          name="venue"
                          type="text"
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("venue", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Resource Person</label>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.resourcePerson}
                            name="resourcePerson"
                            type="text"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("resourcePerson", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Batch Size</label>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.batchSize}
                            name="batchSize"
                            type="number"
                            min={1}
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("batchSize", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Batch No (Optional)</label>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.batchNo}
                            name="batchNo"
                            type="text"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("batchNo", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Remarks</label>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.remarks}
                            name="remarks"
                            type="text"
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("remarks", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>

                      {values?.isRequested && (
                        <div className="col-lg-3">
                          <label>Requested By</label>
                          <div className="policy-category-ddl-wrapper">
                            <FormikSelect
                              placeholder=" "
                              classes="input-sm"
                              styles={customStyles}
                              name="requestedBy"
                              options={employeeDDL || []}
                              value={values?.requestedBy}
                              onChange={(valueOption) => {
                                setFieldValue("requestedBy", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-3">
                        <label> </label>
                        <div className="d-flex align-items-center small-checkbox">
                          <FormikCheckBox
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                            }}
                            labelFontSize="13px"
                            label="Requested Schedule"
                            checked={values?.isRequested}
                            onChange={(e) => {
                              setFieldValue("isRequested", e.target.checked);
                              if (!e.target.checked) {
                                setFieldValue("requestedBy", "");
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 mt-4">
                        {params?.id ? (
                          <div className="">
                            <button
                              type="submit"
                              className="btn btn-default flex-center"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <div className="">
                            <button
                              type="submit"
                              className="btn btn-default flex-center"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* View Modal */}
            <ViewModal
              size="lg"
              title="Create Training Name"
              backdrop="static"
              classes="default-modal preview-modal"
              show={show}
              onHide={() => setShow(false)}
              //   onHide={() => {}}
            >
              <AddTrainingName
                orgId={orgId}
                wgId={wgId}
                employeeId={employeeId}
                accountId={intAccountId}
                buId={buId}
                setTrainingNameDDL={setTrainingNameDDL}
                setShow={setShow}
                setLoading={setLoading}
              />
            </ViewModal>
          </form>

          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {rowDto?.map((item, index) => {
              return (
                <SingleScheduleCard
                  key={index}
                  item={{ serialNo: index + 1, ...item }}
                  handleRowDtoDelete={handleRowDtoDelete}
                  handleEdit={handleEdit}
                />
              );
            })}
          </div>
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default CreateEditSchedule;
