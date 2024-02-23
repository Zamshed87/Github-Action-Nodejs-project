import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntScrollTable from "../../../common/AntScrollTable";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import ViewModal from "../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import "./application.css";
import CreateLoanApplicationModal from "./components/CreateLoanApplicationModal";
import ViewLoanApplicationModal from "./components/ViewLoanApplicationModal";
import {
  loanRequestLandingTableColumns,
  onFilterLoanApplication,
  onGetLoanRequestLanding,
  setSingleLoanApplication,
} from "./helper";

const initData = {
  search: "",
  status: "",
  loanStatus: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const EmLoanApplication = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Loan Request";
  }, []);
  const [show, setShow] = useState(false);
  const [fileId, setFileId] = useState("");

  const [view, setView] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false)

  const { orgId, buId, intProfileImageUrl, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [rowDto, setRowDto] = useState([]);
  const [loanRequestLanding, getLoanRequestLanding, loadingOnGetLoanLanding] =
    useAxiosGet();
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    onGetLoanRequestLanding(
      getLoanRequestLanding,
      orgId,
      buId,
      wgId,
      values,
      setRowDto
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 89) {
      permission = item;
    }
  });

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });
  return (
    <>
      <>
        {loadingOnGetLoanLanding && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "12px" }}
            >
              <div></div>
              <div className="table-card-head-right">
                <ul>
                  {values?.search && (
                    <li>
                      <ResetButton
                        title="reset"
                        icon={
                          <SettingsBackupRestoreOutlined
                            sx={{ marginRight: "10px" }}
                          />
                        }
                        onClick={() => {
                          setFieldValue("search", "");
                          setFieldValue("status", "");
                          setFieldValue("loanStatus", "");
                          setRowDto(loanRequestLanding);
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <MasterFilter
                      isHiddenFilter
                      width="200px"
                      inputWidth="200px"
                      value={values?.search}
                      setValue={(value) => {
                        setFieldValue("search", value);
                        onFilterLoanApplication(
                          value,
                          loanRequestLanding,
                          setRowDto
                        );
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                        setRowDto(loanRequestLanding);
                      }}
                    />
                  </li>
                </ul>

                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Request Loan"}
                  icon={
                    <AddOutlined
                      sx={{ marginRight: "0px", fontSize: "15px" }}
                    />
                  }
                  onClick={() => {
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    setShow(true);
                  }}
                />
              </div>
            </div>
            <div className="card-style pb-0 mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="toDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterFromDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterToDate}
                      placeholder="Month"
                      name="toDate"
                      min={values?.filterFromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterToDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-green btn-green-disable mt-4"
                    type="button"
                    disabled={!values?.filterFromDate || !values?.filterToDate}
                    onClick={() => {
                      onGetLoanRequestLanding(
                        getLoanRequestLanding,
                        orgId,
                        buId,
                        wgId,
                        values,
                        setRowDto
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {rowDto?.length > 0 ? (
              <>
                <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                  <AntScrollTable
                    data={rowDto}
                    columnsData={loanRequestLandingTableColumns(
                      dispatch,
                      setShow,
                      () =>
                        onGetLoanRequestLanding(
                          getLoanRequestLanding,
                          orgId,
                          buId,
                          wgId,
                          values,
                          setRowDto
                        ),
                      employeeId,
                      orgId,
                      setSingleData,
                      setFileId,
                      page,
                      paginationSize,
                      buId,
                      wgId,
                      setLoading
                    )}
                    onRowClick={(rowData) => {
                      setSingleLoanApplication(
                        rowData,
                        setSingleData,
                        setFileId
                      );
                      setView(true);
                    }}
                    rowClassName="pointer"
                    setPage={setPage}
                    setPaginationSize={setPaginationSize}
                  />
                </div>
              </>
            ) : (
              <>
                {!loadingOnGetLoanLanding && (
                  <NoResult title="No Result Found" para="" />
                )}
              </>
            )}
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </>

      <ViewModal
        size="xl"
        title={
          singleData === null
            ? "Create Loan Application"
            : "Update Loan Application"
        }
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => {
          setShow(false);
          setSingleData(null);
          setFileId("");
        }}
      >
        <CreateLoanApplicationModal
          singleData={singleData}
          getData={() => {
            onGetLoanRequestLanding(
              getLoanRequestLanding,
              orgId,
              buId,
              wgId,
              values,
              setRowDto
            );
          }}
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
          setSingleData(null);
        }}
      >
        <ViewLoanApplicationModal
          singleData={singleData}
          rowDto={rowDto}
          setView={setView}
          setShow={setShow}
          setSingleData={setSingleData}
          intProfileImageUrl={intProfileImageUrl}
        />
      </ViewModal>
    </>
  );
};

export default EmLoanApplication;
