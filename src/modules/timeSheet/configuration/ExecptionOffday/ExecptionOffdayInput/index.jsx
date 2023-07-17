/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutline, Edit, EditOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import * as Yup from "yup";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import BackButton from "../../../../../common/BackButton";
import FormikSelect from "../../../../../common/FormikSelect";
import FormikTextArea from "../../../../../common/FormikTextArea";
import IConfirmModal from "../../../../../common/IConfirmModal";
import Loading from "../../../../../common/loading/Loading";
import NoResult from "../../../../../common/NoResult";
import SortingIcon from "../../../../../common/SortingIcon";
import ViewModal from "../../../../../common/ViewModal";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { createTimeSheetAction } from "../../../helper";
import CreateExecptionOffday from "../addEditForm";
import { dayDDL, generatePayload, monthDDL } from "../utility";
import "./styles.css";

const initData = {
  weekOfMonth: "",
  daysOfWeek: "",
  offDayRemark: "",
};
const validationSchema = Yup.object({
  weekOfMonth: Yup.object()
    .shape({
      label: Yup.string().required("Week Of Month  is required"),
      value: Yup.string().required("Week Of Month is required"),
    })
    .typeError("Month is required"),
  daysOfWeek: Yup.object()
    .shape({
      label: Yup.string().required("Week Of Day is required"),
      value: Yup.string().required("Week Of Day is required"),
    })
    .typeError("Week is required"),
  offDayRemark: Yup.string().required("Off Day Remark is required"),
});

export default function ExecptionOffdayInput() {
  const history = useHistory();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [execeptionOffDay, setExceptionOffDay] = useState([]);
  const [allExceptionOffDay, setAllExceptionOffDay] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [createWeekOrder, setCreateWeekOrder] = useState("desc");
  const [createDayOrder, setCreateDayOrder] = useState("desc");
  const [createRemarkOrder, setCreateRemarkOrder] = useState("desc");

  const { orgId, buId, userId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllLanding(
      "ExceptionOffdayByExceptionOffdayGroupId",
      orgId,
      buId,
      params?.id,
      setExceptionOffDay,
      setAllExceptionOffDay,
      setLoading
    );
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    const payload = generatePayload({
      employeeId,
      userId,
      buId,
      orgId,
      autoId: values?.autoId,
      values,
      singleData,
      isDelete: false,
    });

    if (values?.autoId) {
      const callback = () => {
        cb();
        getPeopleDeskAllLanding(
          "ExceptionOffdayByExceptionOffdayGroupId",
          orgId,
          buId,
          params?.id,
          setExceptionOffDay,
          setAllExceptionOffDay,
          setLoading
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    } else {
      const callback = () => {
        cb();
        getPeopleDeskAllLanding(
          "ExceptionOffdayByExceptionOffdayGroupId",
          orgId,
          buId,
          params?.id,
          setExceptionOffDay,
          setAllExceptionOffDay,
          setLoading
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    }
  };

  const deleteHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you sure, you want to delete this exception off day item?",
      yesAlertFunc: () => {
        const payload = generatePayload({
          employeeId,
          userId,
          buId,
          orgId,
          autoId: item?.ExceptionOffdayId,
          values: item,
          singleData,
          isDelete: true,
        });
        const callback = () => {
          setSingleData("");
          getPeopleDeskAllLanding(
            "ExceptionOffdayByExceptionOffdayGroupId",
            orgId,
            buId,
            params?.id,
            setExceptionOffDay,
            setAllExceptionOffDay,
            setLoading
          );
        };
        createTimeSheetAction(
          {
            ...payload,
            exceptionOffdayName: item?.ExceptionOffdayName,
            exceptionOffdayGroupId: item?.ExceptionOffdayGroupId,
          },
          setLoading,
          callback
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getPeopleDeskAllLanding(
      "ExceptionOffdayGroupById",
      orgId,
      buId,
      params?.id,
      setSingleData
    );
  }, [orgId, buId]);

  // modal state
  const [isExecptionOffday, setIsExecptionOffday] = useState(false);

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...execeptionOffDay?.Result];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setExceptionOffDay({ Result: modifyRowData });
  };

  // const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // let permission = null;
  // permissionList.forEach((item) => {
  //   if (item?.menuReferenceId === 41) {
  //     permission = item;
  //   }
  // });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          setValues,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="execption-offday-input">
                {/* {permission?.isEdit ? ( */}
                <div className="col-md-12">
                  <div className="container-execption-offday-input">
                    <div className="header-execption-offday-input">
                      <div className="header-left">
                        <BackButton />
                        <h4>
                          {singleData?.length > 0 &&
                            singleData[0]?.ExceptionOffdayName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsExecptionOffday(true)}
                          className="border-icon holiday-icon-edit"
                        >
                          <Edit sx={{ fontSize: "1rem" }} />
                        </button>
                      </div>
                    </div>
                    <div
                      className="body-holiday-setup"
                      style={{ marginTop: "-25px" }}
                    >
                      <div className="col-md-6 p-0">
                        <div className="form-holiday-setup">
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <div className="col-12 p-0">
                                <div className="input-field">
                                  <label htmlFor="">Week of Month</label>
                                  <FormikSelect
                                    name="weekOfMonth"
                                    options={monthDDL}
                                    value={values?.weekOfMonth}
                                    onChange={(valueOption) => {
                                      setFieldValue("weekOfMonth", valueOption);
                                    }}
                                    placeholder=" "
                                    styles={customStyles}
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <label htmlFor="">Days of Week</label>
                              <FormikSelect
                                name="daysOfWeek"
                                options={dayDDL}
                                value={values?.daysOfWeek}
                                onChange={(valueOption) => {
                                  setFieldValue("daysOfWeek", valueOption);
                                }}
                                placeholder=" "
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field description-field">
                              <label htmlFor="">Off Day Remarks</label>
                              <FormikTextArea
                                className="form-control"
                                // label="Off Day Remarks"
                                value={values?.offDayRemark}
                                onChange={(e) => {
                                  setFieldValue("offDayRemark", e.target.value);
                                }}
                                name="offDayRemark"
                                type="text"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>

                          <button className="add-btn" type="submit">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="table-execption-offday-input-main">
                      <div className="heading-list-execption-offday-input">
                        <h4>Offday Lists</h4>
                        <small> . </small>
                        <div className="table-list-item-amount">
                          {execeptionOffDay?.length > 0
                            ? execeptionOffDay?.length
                            : 0}
                        </div>
                      </div>
                      <div className="table-card-body">
                        <div className="table-card-styled tableOne">
                          {execeptionOffDay?.length > 0 ? (
                            <table className="table">
                              <thead style={{ color: "#212529" }}>
                                <tr>
                                  <th>
                                    <div
                                      className="sortable"
                                      onClick={() => {
                                        setCreateWeekOrder(
                                          createWeekOrder === "desc"
                                            ? "asc"
                                            : "desc"
                                        );
                                        commonSortByFilter(
                                          createWeekOrder,
                                          "WeekOfMonth"
                                        );
                                      }}
                                    >
                                      <span>Week of Month</span>
                                      <div>
                                        <SortingIcon
                                          viewOrder={createWeekOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      className="sortable"
                                      onClick={() => {
                                        setCreateDayOrder(
                                          createDayOrder === "desc"
                                            ? "asc"
                                            : "desc"
                                        );
                                        commonSortByFilter(
                                          createDayOrder,
                                          "DaysOfWeek"
                                        );
                                      }}
                                    >
                                      <span>Day of Week</span>
                                      <div>
                                        <SortingIcon
                                          viewOrder={createDayOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      className="sortable"
                                      onClick={() => {
                                        setCreateRemarkOrder(
                                          createRemarkOrder === "desc"
                                            ? "asc"
                                            : "desc"
                                        );
                                        commonSortByFilter(
                                          createRemarkOrder,
                                          "Remarks"
                                        );
                                      }}
                                    >
                                      <span>offday</span>
                                      <div>
                                        <SortingIcon
                                          viewOrder={createRemarkOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {execeptionOffDay?.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className="tableBody-title">
                                          {item?.WeekOfMonth}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="tableBody-title">
                                          {" "}
                                          {item?.DaysOfWeek}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="tableBody-title">
                                          {item?.Remarks}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex">
                                          <button
                                            className="iconButton"
                                            type="button"
                                            style={{
                                              marginRight: "16px",
                                            }}
                                            onClick={() => {
                                              setValues({
                                                ...values,
                                                autoId: item?.ExceptionOffdayId,
                                                weekOfMonth: {
                                                  value: item?.WeekOfMonthId,
                                                  label: item?.WeekOfMonth,
                                                },
                                                daysOfWeek: {
                                                  value: item?.DaysOfWeekId,
                                                  label: item?.DaysOfWeek,
                                                },
                                                offDayRemark: item?.Remarks,
                                              });
                                            }}
                                          >
                                            <EditOutlined />
                                          </button>
                                          <button
                                            className="iconButton"
                                            type="button"
                                            onClick={() => {
                                              deleteHandler(item);
                                            }}
                                          >
                                            <DeleteOutline />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <>
                              {!loading && (
                                <NoResult title="No Result Found" para="" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ) : (
                      <NotPermittedPage />
                    )} */}
              </div>
            </Form>
          </>
        )}
      </Formik>
      {/* addEditForm */}
      <ViewModal
        show={isExecptionOffday}
        title={"Edit Exception Offday"}
        onHide={() => setIsExecptionOffday(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <CreateExecptionOffday
          setIsExecptionOffday={setIsExecptionOffday}
          onHide={() => setIsExecptionOffday(false)}
          singleData={singleData}
          id={params?.id}
          setSingleData={setSingleData}
          setRowDto={setRowDto}
          setAllData={setAllData}
          setLoading={setLoading}
        />
      </ViewModal>
    </>
  );
}
