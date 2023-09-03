import { AddOutlined } from "@mui/icons-material";
import React from "react";
import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import AntTable from "../../../common/AntTable";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { deleteSchedule, getScheduleLanding } from "./createSchedule/helper";
import {trainingScheduleColumn, updateSchedule } from "./helper";
import { gray900 } from "../../../utility/customColor";
import FormikInput from "../../../common/FormikInput";
import { getTodayDateAndTime } from "../../../utility/todayDateTime";
import { Form, Formik } from "formik";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
const initData = {
  confirmDate: getTodayDateAndTime(),
  extendDate: getTodayDateAndTime(),
  lastAssesmentDate: getTodayDateAndTime(),
};
const validationSchema = Yup.object({
 
  confirmDate: Yup.string().required("Confirmation  Date is required"),
  extendDate: Yup.string().required("Extend  Date is required"),
  lastAssesmentDate: Yup.string().required("Extend  Date is required"),
});
const TrainingScheduleLanding = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orgId, buId,employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
// popover confirm date
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
// popover extend date
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;
  const [anchorEl3, setAnchorEl3] = useState(null);
  const open3 = Boolean(anchorEl3);
  const id3 = open3 ? "simple-popover" : undefined;

  const [allData, setAllData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  // eslint-disable-next-line 
  const [isEdit, setIsEdit] = useState(false);
  // eslint-disable-next-line 
  const [singleData, setSingleData] = useState(false);

  useEffect(() => {
    getScheduleLanding(setAllData, setRowDto, setLoading, orgId, buId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30352) {
      permission = item;
    }
  });
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.strTrainingName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };
  const demoPopup = (scheduleId) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to Delete ? `,
      yesAlertFunc: () => {
        const cb = () => {
          history.push(`/trainingAndDevelopment/training/schedule`);
          getScheduleLanding(setAllData, setRowDto, setLoading, orgId, buId);
        };
        deleteSchedule(scheduleId, setLoading, cb);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  const confirmation = (values) => {
    const payload={...singleData,DteCourseCompletionDate:values?.confirmDate,IntAccountId: orgId,IntBusinessUnitId: buId,intActionBy: employeeId,}   
    const cb=()=>{
      getScheduleLanding(setAllData, setRowDto, setLoading, orgId, buId);
    }
    updateSchedule(payload,cb)
    setAnchorEl(null);
   
  };
  const extention = (values) => {
    const payload={...singleData,dteExtentedDate:values?.extendDate,dteToDate:values?.extendDate,IntAccountId: orgId,IntBusinessUnitId: buId,intActionBy: employeeId,}   
    const cb=()=>{
      getScheduleLanding(setAllData, setRowDto, setLoading, orgId, buId);
    }
    updateSchedule(payload,cb)
    setAnchorEl2(null);
   
  };
  const lastAssesment = (values) => {
    const payload={...singleData,dteLastAssesmentSubmissionDate:values?.lastAssesmentDate,IntAccountId: orgId,IntBusinessUnitId: buId,intActionBy: employeeId,}   
    const cb=()=>{
      getScheduleLanding(setAllData, setRowDto, setLoading, orgId, buId);
    }
    updateSchedule(payload,cb)
    setAnchorEl3(null);
    
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        // onSubmit={(values, { setSubmitting, resetForm }) => {
        //   saveHandler(values, () => {
        //     resetForm(initData);
        //   });
        // }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
    <>
         {loading && <Loading />}
      <Form onSubmit={handleSubmit}>
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center"></div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap">
                <li>
                  <MasterFilter
                    styles={{
                      marginRight: "10px",
                    }}
                    inputWidth="200px"
                    width="200px"
                    value={searchKey}
                    // value={""}
                    setValue={(value) => {
                      setSearchKey(value);
                      filterData(value);
                    }}
                    isHiddenFilter
                    cancelHandler={() => {
                      setSearchKey("");
                      setRowDto(allData);
                    }}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label="New Schedule"
                    icon={
                      <AddOutlined
                        sx={{
                          marginRight: "0px",
                          fontSize: "15px",
                        }}
                      />
                    }
                    onClick={() => {
                      if (!permission?.isCreate) {
                        return toast.warning("Your are not allowed to access");
                      }
                      history.push(
                        `/trainingAndDevelopment/training/schedule/create`
                      );
                    }}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="table-card-body">
            <div className="table-card-styled tableOne">
              {rowDto?.length > 0 ? (
                <>
                  <div className="table-card-styled employee-table-card tableOne">
                    <AntTable
                      data={rowDto}
                      columnsData={trainingScheduleColumn(
                        history,
                        // "",
                        page,
                        // 1,
                        paginationSize,
                        demoPopup,
                        setAnchorEl,
                        setAnchorEl2,
                        setIsEdit,
                        permission,
                        setSingleData,
                        setValues,
                        setAnchorEl3
                        // 15
                      )}
                      onRowClick={(item) => {
                        history.push(
                          `/trainingAndDevelopment/training/schedule/view/${item?.intScheduleId}`
                        );
                      }}
                      rowClassName="pointer"
                      setPage={setPage}
                      setPaginationSize={setPaginationSize}
                    />
                  </div>
                </>
              ) : (
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )}

<Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "675px",
                    minHeight: "200px",
                    borderRadius: "4px",
                  },
                }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                  setAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "middle",
                }}
              >
                <div
                  className="master-filter-modal-container employeeProfile-src-filter-main"
                  style={{ height: "auto" }}
                >
                  <div className="master-filter-header employeeProfile-src-filter-header">
                    <div></div>
                    <IconButton
                      onClick={() => {
                        setAnchorEl(null);
                        setSingleData(false);
                        setFieldValue("confirmDate", "");
                      }}
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>
                  <hr />
                  <div
                    className="body-employeeProfile-master-filter"
                    style={{ height: "250px" }}
                  >
                    <div className="row content-input-field">
                      
                      <div className="col-4">
                        <div className="input-field-main">
                          <label>Confirmation Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.confirmDate}
                            onChange={(e) => {
                              setFieldValue("confirmDate", e.target.value);
                            }}
                            name="confirmDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            min={dateFormatterForInput(singleData?.dteToDate)}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="master-filter-bottom footer-employeeProfile-src-filter">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(null);
                          setSingleData(false);
                          setFieldValue("confirmDate", "");
                        }}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        onClick={() => {
                          confirmation(values);
                        }}
                      >
                        {/* {isEdit ? "Save" : "Assign"} */}
                        Assign Date
                                              </button>
                    </div>
                  </div>
                </div>
              </Popover>

<Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "675px",
                    minHeight: "200px",
                    borderRadius: "4px",
                  },
                }}
                id={id2}
                open={open2}
                anchorEl={anchorEl2}
                onClose={() => {
                  setAnchorEl2(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "middle",
                }}
              >
                <div
                  className="master-filter-modal-container employeeProfile-src-filter-main"
                  style={{ height: "auto" }}
                >
                  <div className="master-filter-header employeeProfile-src-filter-header">
                    <div></div>
                    <IconButton
                      onClick={() => {
                        setAnchorEl2(null);
                        // setRowDto(allData);
                        setSingleData(false);
                        setIsEdit(false);
                        setFieldValue("extendDate", "");
                      }}
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>
                  <hr />
                  <div
                    className="body-employeeProfile-master-filter"
                    style={{ height: "250px" }}
                  >
                    <div className="row content-input-field">
                      
                      <div className="col-4">
                        <div className="input-field-main">
                          <label>Extend Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.extendDate}
                            onChange={(e) => {
                              setFieldValue("extendDate", e.target.value);
                            }}
                            name="extendDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            min={dateFormatterForInput(singleData?.dteToDate)}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="master-filter-bottom footer-employeeProfile-src-filter">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl2(null);
                          // setRowDto(allData);
                          setSingleData(false);
                          // setIsEdit(false);
                          setFieldValue("extendDate", "");
                        }}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        onClick={() => {
                          extention(values);
                        }}
                      >
                        {/* {isEdit ? "Save" : "Assign"} */}
                        Assign Date
                      </button>
                    </div>
                  </div>
                </div>
              </Popover>

<Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "675px",
                    minHeight: "200px",
                    borderRadius: "4px",
                  },
                }}
                id={id3}
                open={open3}
                anchorEl={anchorEl3}
                onClose={() => {
                  setAnchorEl3(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "middle",
                }}
              >
                <div
                  className="master-filter-modal-container employeeProfile-src-filter-main"
                  style={{ height: "auto" }}
                >
                  <div className="master-filter-header employeeProfile-src-filter-header">
                    <div></div>
                    <IconButton
                      onClick={() => {
                        setAnchorEl3(null);
                        // setRowDto(allData);
                        setSingleData(false);
                        setIsEdit(false);
                        setFieldValue("lastAssesmentDate", "");
                      }}
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>
                  <hr />
                  <div
                    className="body-employeeProfile-master-filter"
                    style={{ height: "250px" }}
                  >
                    <div className="row content-input-field">
                      
                      <div className="col-4">
                        <div className="input-field-main">
                          <label>Last Assesment Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.lastAssesmentDate}
                            onChange={(e) => {
                              setFieldValue("lastAssesmentDate", e.target.value);
                            }}
                            name="lastAssesmentDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            min={dateFormatterForInput(singleData?.dteToDate)}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="master-filter-bottom footer-employeeProfile-src-filter">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl3(null);
                          // setRowDto(allData);
                          setSingleData(false);
                          // setIsEdit(false);
                          setFieldValue("lastAssesmentDate", "");
                        }}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        onClick={() => {
                          lastAssesment(values);
                        }}
                      >
                        {/* {isEdit ? "Save" : "Assign"} */}
                        Assign Date
                      </button>
                    </div>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
     </Form>
    </>
     )}
     </Formik>
     </>
  );
};

export default TrainingScheduleLanding;
