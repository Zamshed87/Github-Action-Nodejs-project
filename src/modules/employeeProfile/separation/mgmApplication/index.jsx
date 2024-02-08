import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { paginationSize } from "../../../../common/AntTable";
import DefaultInput from "../../../../common/DefaultInput";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  getSeparationLanding,
  separationApplicationLandingTableColumn,
} from "../helper";
import {
  monthFirstDate,
  monthLastDate,
} from "./../../../../utility/dateFormatter";
import ManagementSeparationApproverView from "./viewForm/ModalView";
import { PModal } from "Components/Modal";

const initData = {
  status: "",
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

export default function ManagementSeparation() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 10) {
      permission = item;
    }
  });

  // state
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);

  // landing
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination, searchText) => {
    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      searchText,
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      wId
    );
  };

  const handleChangePage = (_, newPage, searchText = "") => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText = "") => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  // useFormik
  const { setFieldValue, values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {},
  });

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Separation";
  }, [dispatch]);

  useEffect(() => {
    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      wId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card businessUnit-wrapper dashboard-scroll">
            <div className="table-card-heading">
              <div>{/* <h6>Separation</h6> */}</div>
              <ul className="d-flex flex-wrap">
                {(status || values?.search) && (
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
                        setFieldValue("status", "");
                        setFieldValue("search", "");
                        setStatus("");

                        getSeparationLanding(
                          "EmployeeSeparationList",
                          buId,
                          wgId,
                          values?.filterFromDate || "",
                          values?.filterToDate || "",
                          "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          wId
                        );
                      }}
                    />
                  </li>
                )}
                <li>
                  <MasterFilter
                    inputWidth="200"
                    width="200px"
                    isHiddenFilter
                    value={values?.search}
                    setValue={(value) => {
                      setFieldValue("search", value);
                      if (value) {
                        getSeparationLanding(
                          "EmployeeSeparationList",
                          buId,
                          wgId,
                          values?.filterFromDate || "",
                          values?.filterToDate || "",
                          value,
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          wId
                        );
                      } else {
                        getSeparationLanding(
                          "EmployeeSeparationList",
                          buId,
                          wgId,
                          values?.filterFromDate || "",
                          values?.filterToDate || "",
                          "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          wId
                        );
                      }
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getSeparationLanding(
                        "EmployeeSeparationList",
                        buId,
                        wgId,
                        values?.filterFromDate || "",
                        values?.filterToDate || "",
                        "",
                        setRowDto,
                        setLoading,
                        1,
                        paginationSize,
                        setPages,
                        wId
                      );
                    }}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label={"Apply"}
                    icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permission?.isCreate)
                        return toast.warn("You don't have permission");
                      history.push("/profile/separation/create");
                    }}
                  />
                </li>
              </ul>
            </div>

            <div className="card-style pb-0 mb-2" style={{ marginTop: "12px" }}>
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
                      getData(pages, values?.search);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            {rowDto?.length > 0 ? (
              <>
                <PeopleDeskTable
                  customClass="iouManagementTable"
                  columnData={separationApplicationLandingTableColumn(
                    pages?.current,
                    pages?.pageSize,
                    history,
                    dispatch,
                    setOpenModal,
                    permission,
                    setId,
                  )}
                  pages={pages}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.search)
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(e, values?.search)
                  }
                  uniqueKey="strEmployeeCode"
                  isCheckBox={false}
                  isScrollAble={false}
                  onRowClick={(data) => {
                    history.push(
                      `/profile/separation/view/${data?.separationId}`
                    );
                  }}
                />
                <PModal
                  title="Separation Approver View"
                  open={openModal}
                  onCancel={() => {
                    setOpenModal(false);
                  }}
                  components={<ManagementSeparationApproverView id={id} />}
                  width={1000}
                />
              </>
            ) : (
              <>{!loading && <NoResult title="No Result Found" para="" />}</>
            )}
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
