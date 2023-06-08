import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable, { paginationSize } from "../../../../common/AntTable";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  getSeparationLanding,
  separationApplicationLandingTableColumn,
} from "../helper";
import {
  monthFirstDate,
  monthLastDate,
} from "./../../../../utility/dateFormatter";

const initData = {
  status: "",
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

export default function ManagementSeparation() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, wgId } = useSelector(
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

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  const getData = (pagination, searchText) => {
    getSeparationLanding({
      status: null,
      depId: null,
      desId: null,
      supId: null,
      empId: 0,
      workId: wgId,
      buId,
      orgId,
      setter: setRowDto,
      setLoading,
      separationTypeId: null,
      tableName: "EmployeeSeparationList",
      fromDate: values?.filterFromDate,
      toDate: values?.filterToDate,
      srcText: searchText || "",
      pages: pagination || pages,
      setPages,
    });
  };

  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getData(pagination, srcText);
    }
    if (pages?.current !== pagination?.current) {
      return getData(pagination, srcText);
    }
  };

  useEffect(() => {
    getData(pages, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId]);

  const { setFieldValue, values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      resetForm(initData);
    },
  });
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
                        getData({ current: 1, pageSize: paginationSize }, "");
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
                        getData(
                          { current: 1, pageSize: paginationSize },
                          value
                        );
                      } else {
                        getData({ current: 1, pageSize: paginationSize }, "");
                      }
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getData({ current: 1, pageSize: paginationSize }, "");
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
                      getData();
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            {rowDto?.length > 0 ? (
              <>
                <div className="table-card-body">
                  <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                    <AntTable
                      data={rowDto}
                      columnsData={separationApplicationLandingTableColumn(
                        dispatch,
                        history,
                        permission,
                        pages
                      )}
                      onRowClick={(data) => {
                        history.push(
                          `/profile/separation/view/${data?.SeparationId}`
                        );
                      }}
                      rowClassName="pointer"
                      pages={pages?.pageSize}
                      pagination={pages}
                      handleTableChange={({ pagination, newRowDto }) =>
                        handleTableChange(
                          pagination,
                          newRowDto,
                          values?.search || ""
                        )
                      }
                    />
                  </div>
                </div>
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
