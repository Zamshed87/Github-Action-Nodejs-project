import {
  AddOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormikDatePicker from "../../../../common/DatePicker";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";
import FormikInput from "./../../../../common/FormikInput";
import { monthFirstDate } from "./../../../../utility/dateFormatter";
import OutSideDutyEntryModal from "./components/OutsideDutyEntryModal";
import OutsideDutyViewModal from "./components/OutsideDutyViewModal";
import { extraSideLandingView } from "./helper";

const todayDate = dateFormatterForInput(new Date());
const initData = {
  // search: "",
  fromDate: monthFirstDate(),
  toDate: todayDate,
};

const OutsideDuty = () => {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setrowDto] = useState([]);
  const [singleItem, setSingleItem] = useState("");
  const [date, setDate] = useState({
    fromDate: monthFirstDate(),
    toDate: todayDate,
  });

  const getData = () => {
    let newDate = { fromDate: date?.fromDate, toDate: date?.toDate };
    extraSideLandingView(
      "ExtraSideDutyList",
      buId,
      newDate,
      "",
      "",
      setrowDto,
      setLoading
    );
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  // modal
  const [outsideDutyEntry, setOutsideDutyEntry] = useState(false);
  const [outsideDutyView, setOutsideDutyView] = useState(false);

  const handleClose = () => {
    setOutsideDutyEntry(false);
    setOutsideDutyView(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values) => {
    let date = { fromDate: values?.fromDate, toDate: values?.toDate };
    extraSideLandingView(
      "ExtraSideDutyList",
      buId,
      date,
      "",
      "",
      setrowDto,
      setLoading
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 47) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            //
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card attendence-report">
                  <div className="table-card-heading">
                    <div className="d-flex"></div>
                    <div className="table-card-head-right">
                      <ul>
                        {(values?.search || values?.dateRange) && (
                          <li>
                            <ResetButton
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{ marginRight: "10px" }}
                                />
                              }
                              onClick={() => {
                                setFieldValue("dateRange", "");
                                setFieldValue("search", "");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <div
                            className="d-flex align-items-end"
                            style={{ paddingBottom: "23px" }}
                          >
                            <div className="mr-3">
                              <small>From Date</small>
                              <FormikDatePicker
                                isSmall
                                value={values?.fromDate}
                                name="fromDate"
                                onChange={(e) => {
                                  setDate({
                                    ...date,
                                    fromDate: e.target.value,
                                  });
                                  setFieldValue("fromDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="mr-3">
                              <small>To Date</small>
                              <FormikInput
                                classes="input-sm"
                                value={values?.toDate}
                                name="toDate"
                                min={values?.fromDate || date?.fromDate}
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setDate({
                                    ...date,
                                    toDate: e.target.value,
                                  });
                                  setFieldValue("toDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                              {/* <FormikDatePicker
                                      isSmall
                                      // label="End Date"
                                      value={values?.toDate}
                                      name="toDate"
                                      type="date"
                                      onChange={(e) => {
                                        setDate({
                                          ...date,
                                          toDate: e.target.value
                                        })
                                        setFieldValue("toDate", e.target.value);
                                      }}
                                      min={values?.fromDate || date?.fromDate}
                                      errors={errors}
                                      touched={touched}
                                    /> */}
                            </div>
                            <div className="mr-3">
                              <PrimaryButton
                                type="submit"
                                className="btn btn-default flex-center"
                                label={"Apply"}
                                onClick={() => {}}
                                onSubmit={() => handleSubmit()}
                              />
                            </div>
                            <div>
                              <PrimaryButton
                                type="submit"
                                className="btn btn-default flex-center"
                                label={"Extra Side Duty"}
                                icon={
                                  <AddOutlined
                                    sx={{
                                      marginRight: "0px",
                                      fontSize: "15px",
                                    }}
                                  />
                                }
                                onClick={(e) => {
                                  if (!permission?.isCreate)
                                    return toast.warn(
                                      "You don't have permission"
                                    );
                                  e.stopPropagation();
                                  setOutsideDutyEntry(true);
                                }}
                                onSubmit={() => handleSubmit()}
                              />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: "60px" }}>
                              <div className="pl-3">SL</div>
                            </th>
                            <th>Employee </th>
                            <th> Code </th>
                            <th className="text-center">Extra Side Duty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((data, index) => (
                            <tr
                              key={index}
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSingleItem(data);
                                setOutsideDutyView(true);
                              }}
                            >
                              <td className="content tableBody-title">
                                <div className="pl-3">{index + 1}</div>
                              </td>
                              <td className="content tableBody-title">
                                {data?.strEmployeeName}
                              </td>
                              <td className="content tableBody-title">
                                {data?.strEmployeeCode}
                              </td>
                              <td className="text-center content tableBody-title">
                                {data?.DutyCount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
              <ViewModal
                show={outsideDutyEntry}
                title={"Create Extra Side Duty"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal form-modal"
              >
                <OutSideDutyEntryModal
                  onHide={handleClose}
                  setLoading={setLoading}
                  getData={getData}
                  handleClose={handleClose}
                />
              </ViewModal>
              <ViewModal
                show={outsideDutyView}
                title={`Extra Side Duty for ${singleItem?.strEmployeeName} [${singleItem?.strEmployeeCode}] `}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal form-modal"
              >
                <OutsideDutyViewModal
                  onHide={handleClose}
                  setLoading={setLoading}
                  setSingleItem={setSingleItem}
                  singleItem={singleItem}
                  values={values}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default OutsideDuty;
