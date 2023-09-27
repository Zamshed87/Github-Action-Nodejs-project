import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultInput from "../../../../common/DefaultInput";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import {
  expenseLandingTableColumn,
  onGetExpenseApplicationLanding,
} from "./helper";

const initData = {
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const MgtExpenseApplication = () => {
  // hook
  const debounce = useDebounce();
  const history = useHistory();
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, intWorkplaceId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // state
  const [loading, setLoading] = useState(false);
  const [, setfilterAnchorEl] = useState(null);

  // menu Permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30322) {
      permission = item;
    }
  });

  // useFormik
  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  // landing table
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination) => {
    onGetExpenseApplicationLanding(
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      "",
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      wId
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData({
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData({
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  useEffect(() => {
    onGetExpenseApplicationLanding(
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
  }, [buId, wgId, intWorkplaceId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <>
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center"></div>
              <ul className="d-flex flex-wrap">
                {values?.search && (
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
                        setFieldValue("search", "");

                        onGetExpenseApplicationLanding(
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
                    isHiddenFilter
                    styles={{
                      marginRight: "10px",
                    }}
                    inputWidth="200px"
                    width="200px"
                    value={values?.search}
                    setValue={(value) => {
                      setFieldValue("search", value);
                      debounce(() => {
                        onGetExpenseApplicationLanding(
                          buId,
                          wgId,
                          values?.filterFromDate || "",
                          values?.filterToDate || "",
                          value || "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          wId
                        );
                      }, 500);
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      onGetExpenseApplicationLanding(
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
                    handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label="Request Expense"
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
                        `/profile/expense/expenseApplication/create`
                      );
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
                      onGetExpenseApplicationLanding(
                        buId,
                        wgId,
                        values?.filterFromDate || "",
                        values?.filterToDate || "",
                        values?.search || "",
                        setRowDto,
                        setLoading,
                        1,
                        paginationSize,
                        setPages,
                        wId
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={expenseLandingTableColumn(
                  pages?.current,
                  pages?.pageSize,
                  history
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
                uniqueKey="expenseId"
                isCheckBox={false}
                isScrollAble={true}
                onRowClick={(res) => {
                  history.push(
                    `/profile/expense/expenseApplication/view/${res?.expenseId}`
                  );
                }}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default MgtExpenseApplication;
