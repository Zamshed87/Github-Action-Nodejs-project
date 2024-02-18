/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntScrollTable from "../../../../common/AntScrollTable";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import {
  dateFormatterForInput,
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import "./application.css";
import CreateLoanApplicationModal from "./components/CreateLoanApplicationModal";
import ViewLoanApplicationModal from "./components/ViewLoanApplicationModal";
import { selfServiceLoanReqDtoColumns } from "./helper";

const initData = {
  search: "",
  status: "",
  loanStatus: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),

  //master filter
  loanType: "",
  designation: "",
  fromDate: monthFirstDate(),
  toDate: monthLastDate(),
  minimumAmount: "",
  applicationStatus: "",
  department: "",
  employee: "",
  maximumAmount: "",
  installmentStatus: "",
};

// status DDL
// const statusDDL = [
//   { value: "Pending", label: "Pending" },
//   { value: "Approved", label: "Approved" },
//   { value: "Process", label: "Process" },
//   { value: "Rejected", label: "Rejected" },
// ];

// loanStatus DDL
// const loanStatusDDL = [
//   { value: "Not Started", label: "Not Started" },
//   { value: "Hold", label: "Hold" },
//   { value: "Completed", label: "Completed" },
//   { value: "Running", label: "Running" },
// ];

const Application = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Loan Request";
  }, []);

  const [show, setShow] = useState(false);
  const [fileId, setFileId] = useState("");

  const [view, setView] = useState(false);

  const { orgId, buId, employeeId, intProfileImageUrl, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);
  // const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState(null);
  const [status, setStatus] = useState("");
  const [laonStatus, setLoanStatus] = useState("");
  const [selfEmployee, setSelfEmployee] = useState([]);
  const [rowDto, getLoanData, loadingData, setResLoanData] = useAxiosGet();
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const getData = (fromDate, toDate) => {
    // getPeopleDeskAllLanding(
    //   "LoanApplicationList",
    //   orgId,
    //   buId,
    //   "",
    //   setRowDto,
    //   setAllData
    //   setLoading
    // );
    // let status = statusId ? `&intStatusId=${statusId}` : "";
    const filterDate = `&fromDate=${fromDate}&toDate=${toDate}`;
    const url = `/Employee/PeopleDeskAllLanding?TableName=LoanApplicationList&intId=${employeeId}&AccountId=${orgId}&BusinessUnitId=${buId}${filterDate}`;
    getLoanData(url, (res) => {
      setResLoanData(res);
      // setAllData(res);
    });
  };

  useEffect(() => {
    getData(initData?.fromDate, initData?.toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  // active & inactive filter
  /*   const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Approved") {
      modifyRowData = newRowData?.filter(
        (item) => item?.applicationStatus === "Approved"
      );
    } else if (statusType === "Pending") {
      modifyRowData = newRowData?.filter(
        (item) => item?.applicationStatus === "Pending"
      );
    } else if (statusType === "Process") {
      modifyRowData = newRowData?.filter(
        (item) => item?.applicationStatus === "Process"
      );
    } else if (statusType === "Rejected") {
      modifyRowData = newRowData?.filter(
        (item) => item?.applicationStatus === "Rejected"
      );
    }
    setRowDto(modifyRowData);
  };
  const loanStatusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Not Started") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Not Started"
      );
    } else if (statusType === "Hold") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Hold"
      );
    } else if (statusType === "Completed") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Completed"
      );
    } else if (statusType === "Running") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Running"
      );
    }
    setRowDto(modifyRowData);
  }; */
  const setSingleDataAction = (data) => {
    setSingleData({
      status: data?.applicationStatus,
      employee: {
        label: data?.employeeName,
        value: data?.employeeId,
        code: data?.employeeCode,
        position: data?.positionName,
        department: data?.departmentName,
      },
      loanType: {
        value: data?.loanTypeId,
        label: data?.loanType,
      },
      insertDateTime: data?.insertDateTime,
      loanAmount: data?.loanAmount,
      installmentNumber: data?.numberOfInstallment,
      amountPerInstallment: data?.numberOfInstallmentAmount,
      description: data?.description,
      effectiveDate: dateFormatterForInput(data?.effectiveDate),
      fileUrl: data?.fileUrl,
      loanApplicationId: data?.loanApplicationId,
    });
    setFileId(data?.fileUrl);
  };

  useEffect(() => {
    const findSelfEmployee = rowDto?.filter(
      (item) => item?.employeeId === employeeId
    );
    setSelfEmployee(findSelfEmployee);
  }, [rowDto]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || loadingData) && <Loading />}
              <div className="table-card">
                <div className="table-card-heading">
                  <div></div>
                  <ul className="d-flex flex-wrap">
                    {(status || laonStatus) && (
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
                            setStatus("");
                            setLoanStatus("");
                            getData();
                          }}
                        />
                      </li>
                    )}
                    <li>
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Request Loan"}
                        icon={
                          <AddOutlined
                            sx={{ marginRight: "0px", fontSize: "15px" }}
                          />
                        }
                        onClick={() => setShow(true)}
                      />
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div
                    className="card-style pb-0 mb-2"
                    style={{ marginTop: "12px" }}
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>From Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.fromDate}
                            placeholder=""
                            name="fromDate"
                            type="date"
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>To Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.toDate}
                            placeholder="Month"
                            name="toDate"
                            type="date"
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-lg-1">
                        <button
                          disabled={!values?.toDate || !values?.fromDate}
                          style={{ marginTop: "21px" }}
                          className="btn btn-green"
                          onClick={() => {
                            getData(values?.fromDate, values?.toDate);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {selfEmployee?.length > 0 ? (
                    <>
                      <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                        <AntScrollTable
                          data={rowDto}
                          columnsData={selfServiceLoanReqDtoColumns(
                            dispatch,
                            setSingleDataAction,
                            setShow,
                            employeeId,
                            orgId,
                            getData,
                            setLoading,
                            values,
                            page,
                            paginationSize,
                            buId,
                            wgId
                          )}
                          onRowClick={(rowData) => {
                            setSingleDataAction(rowData);
                            setView(true);
                          }}
                          rowClassName="pointer"
                          x={2000}
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                        />
                      </div>
                    </>
                  ) : (
                    <>{<NoResult title="No Result Found" para="" />}</>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <ViewModal
        size="lg"
        title={singleData ? "Edit Loan Application" : "Create Loan Application"}
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => {
          setShow(false);
          setSingleData("");
          setFileId("");
        }}
      >
        <CreateLoanApplicationModal
          singleData={singleData}
          getData={getData}
          setShow={setShow}
          fileId={fileId}
          setFileId={setFileId}
          setSingleData={setSingleData}
        />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Loan Application Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={view}
        onHide={() => {
          setView(false);
          setSingleData("");
          setFileId("");
        }}
      >
        <ViewLoanApplicationModal
          singleData={singleData}
          rowDto={rowDto}
          setView={setView}
          setShow={setShow}
          setSingleData={setSingleData}
          setFileId={setFileId}
          intProfileImageUrl={intProfileImageUrl}
        />
      </ViewModal>
    </>
  );
};

export default Application;

//  demo table

/* 
                      <ScrollableTable
                        classes="salary-process-table"
                        secondClasses="table-card-styled tableOne scroll-table-height"
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Code</th>
                            <th>
                              <div>Employee</div>
                            </th>
                            <th>
                              <div>Designation</div>
                            </th>
                            <th>
                              <div>Department</div>
                            </th>
                            <th>
                              <div>Loan Type</div>
                            </th>
                            <th className="text-right">
                              <div>Loan Amount</div>
                            </th>
                            <th className="text-right">
                              <div>Installment Amount</div>
                            </th>
                            <th className="text-center">
                              <div>Installments</div>
                            </th>
                            <th className="text-right">
                              <div>Approve Loan Amount</div>
                            </th>
                            <th className="text-right">
                              <div>Approve Installment Amount</div>
                            </th>
                            <th className="text-center">
                              <div>Approve Installments</div>
                            </th>
                            <th>
                              <div className="table-th d-flex align-items-center">
                                Application Status
                                <span>
                                  <Select
                                    sx={{
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none !important",
                                      },
                                      "& .MuiSelect-select": {
                                        paddingRight: "22px !important",
                                        marginTop: "-15px",
                                      },
                                    }}
                                    className="selectBtn"
                                    name="status"
                                    IconComponent={ArrowDropDown}
                                    value={values?.status}
                                    onChange={(e) => {
                                      setFieldValue("status", "");
                                      setStatus(e.target.value?.label);
                                      statusTypeFilter(e.target.value?.label);
                                    }}
                                  >
                                    {statusDDL?.length > 0 &&
                                      statusDDL?.map((item, index) => {
                                        return (
                                          <MenuItem key={index} value={item}>
                                            {item?.label}
                                          </MenuItem>
                                        );
                                      })}
                                  </Select>
                                </span>
                              </div>
                            </th>
                            <th>
                              <div className="table-th d-flex align-items-center">
                                Loan Status
                                <span>
                                  <Select
                                    sx={{
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none !important",
                                      },
                                      "& .MuiSelect-select": {
                                        paddingRight: "22px !important",
                                        marginTop: "-15px",
                                      },
                                    }}
                                    className="selectBtn"
                                    name="loanStatus"
                                    IconComponent={ArrowDropDown}
                                    value={values?.loanStatus}
                                    onChange={(e) => {
                                      setFieldValue("loanStatus", "");
                                      setLoanStatus(e.target.value?.label);
                                      loanStatusTypeFilter(
                                        e.target.value?.label
                                      );
                                    }}
                                  >
                                    {loanStatusDDL?.length > 0 &&
                                      loanStatusDDL?.map((item, index) => {
                                        return (
                                          <MenuItem key={index} value={item}>
                                            {item?.label}
                                          </MenuItem>
                                        );
                                      })}
                                  </Select>
                                </span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <CardTable
                            rowDto={rowDto}
                            setView={setView}
                            getData={getData}
                            setSingleData={setSingleData}
                            setShow={setShow}
                            setFileId={setFileId}
                            setLoading={setLoading}
                            selfEmployee={selfEmployee}
                          />
                        </tbody>
                      </ScrollableTable>
                    */
