import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { APIUrl } from "../../../../App";
import DemoImg from "../../../../assets/images/demo.png";
import AntTable from "../../../../common/AntTable";
import FormikSelect from "../../../../common/FormikSelect";
import LeaveApplicationForm from "../../../../common/HOCLeave/component/LeaveApplicationForm";
import LeaveBalanceTable from "../../../../common/HOCLeave/component/LeaveBalanceTable";
import LeaveSingleViewModal from "../../../../common/HOCLeave/component/LeaveSingleViewModal";
import withLeaveApplication from "../../../../common/HOCLeave/withLeaveApplication";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import "./leaveApplication.css";

function LeaveApplication(props) {
  const {
    allData,
    singleData,
    imageFile,
    leaveHistoryData,
    viewModal,
    employeeInfo,
    isEdit,
    isFilter,
    leaveTypeDDL,
    leaveBalanceData,
    loading,
    id,
    handleOpen,
    handleClick,
    handleViewClose,
    saveHandler,
    searchData,
    getData,
    setSingleData,
    setImageFile,
    setViewModal,
    setIsEdit,
    setIsFilter,
    setLoading,
    setLeaveHistoryData,
    userName,
    intProfileImageUrl,
    empMgmtLeaveApplicationDtoColumn,
    initDataForLeaveApplication,
    validationSchemaForLeaveApplication,
    employeeId,
    orgId,
    buId,
    setAllData,
    demoPopupForDelete,
  } = props?.propjObj;

  const scrollRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initDataForLeaveApplication,
          employee: {
            value: employeeInfo?.[0]?.EmployeeId || employeeId,
            label: employeeInfo?.[0]?.EmployeeName || userName,
          },
        }}
        validationSchema={validationSchemaForLeaveApplication}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initDataForLeaveApplication);
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
          setErrors,
        }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              <div className="table-card">
                <div ref={scrollRef} className="table-card-heading pb-1 pr-0">
                  <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
                    {employeeInfo?.[0]?.strProfileImageUrl ? (
                      <img
                        src={
                          employeeInfo?.[0]?.strProfileImageUrl
                            ? `${APIUrl}/Document/DownloadFile?id=${employeeInfo?.[0]?.strProfileImageUrl}`
                            : DemoImg
                        }
                        alt="Profile"
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src={
                          intProfileImageUrl
                            ? `${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`
                            : DemoImg
                        }
                        alt="Profile"
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="employeeTitle ml-2">
                      <p className="employeeName">
                        {employeeInfo?.[0]?.EmployeeName
                          ? employeeInfo?.[0]?.EmployeeName
                          : userName}
                      </p>
                      <p className="employeePosition">
                        {employeeInfo?.[0]?.DesignationName}
                      </p>
                    </div>
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      {isFilter && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            styles={{
                              marginRight: "16px",
                            }}
                            onClick={() => {
                              setIsFilter(false);
                              setFieldValue("search", "");
                              getData();
                              resetForm();
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <div
                          className="input-field-main"
                          style={{ width: "200px" }}
                        >
                          <FormikSelect
                            name="year"
                            options={yearDDLAction(5, 10) || []}
                            value={values?.year}
                            onChange={(valueOption) => {
                              setIsEdit(false);
                              setSingleData("");
                              setFieldValue("year", valueOption);
                              getData(
                                values?.employee?.value,
                                valueOption?.value
                              );
                            }}
                            isClearable={false}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-10 leave-movement-FormCard">
                    <LeaveApplicationForm
                      propsObj={{
                        singleData,
                        handleSubmit,
                        initDataForLeaveApplication,
                        resetForm,
                        values,
                        setValues,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                        imageFile,
                        setImageFile,
                        setLeaveHistoryData,
                        isEdit,
                        setIsEdit,
                        setSingleData,
                        leaveTypeDDL,
                        setLoading,
                        loading,
                        show: true,
                      }}
                    />
                  </div>
                  <div className="col-lg-6 col-md-10 leave-movement-FormCard">
                    <LeaveBalanceTable
                      leaveBalanceData={leaveBalanceData}
                      show={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 my-3">
                    <div className="table-card-body pl-lg-1 pl-md-3">
                      <div>
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 style={{ color: gray500, fontSize: "14px" }}>
                            Leave List
                          </h2>
                          <MasterFilter
                            isHiddenFilter
                            styles={{
                              marginRight: "0px",
                            }}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              searchData(value, allData, setLeaveHistoryData);
                              setFieldValue("search", value);
                            }}
                            cancelHandler={() => {
                              getData();
                              setFieldValue("search", "");
                            }}
                            handleClick={handleClick}
                          />
                        </div>
                      </div>

                      <div
                        className="table-card-styled table-responsive tableOne mt-2"
                        style={{ height: "190px" }}
                      >
                        {leaveHistoryData?.length > 0 ? (
                          <AntTable
                            data={leaveHistoryData}
                            columnsData={empMgmtLeaveApplicationDtoColumn(
                              setValues,
                              values,
                              dispatch,
                              setIsEdit,
                              scrollRef,
                              setSingleData,
                              setImageFile,
                              demoPopupForDelete
                            )}
                            onRowClick={(item) => {
                              setSingleData(item);
                              setViewModal(true);
                            }}
                            removePagination
                            rowClassName="pointer"
                            rowKey={(item) => item?.intApplicationId}
                          />
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

              {/* View Form Modal */}
              <LeaveSingleViewModal
                show={viewModal}
                title={"Leave Details"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                id={id}
                orgId={orgId}
                buId={buId}
                singleData={singleData}
                setSingleData={setSingleData}
                setValues={setValues}
                values={values}
                setImageFile={setImageFile}
                scrollRef={scrollRef}
                setLeaveHistoryData={setLeaveHistoryData}
                setIsEdit={setIsEdit}
                setAllData={setAllData}
                getData={getData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
export default withLeaveApplication(LeaveApplication);
