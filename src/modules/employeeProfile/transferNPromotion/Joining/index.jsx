/* eslint-disable no-unused-vars */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { getDateOfYear } from "../../../../utility/dateFormatter";
import { getAllTransferAndPromotionLanding } from "../helper";
import JoiningTable from "./components/joiningTable";
import { MenuItem, Pagination, Select } from "@mui/material";
// import { getAllTransferAndPromotionLanding } from "./helper";

const initialValues = {
  search: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
};

const validationSchema = Yup.object({});
const paginationSize = 25;

export default function Joining() {
  const dispatch = useDispatch();
  const history = useHistory();
  const debounce = useDebounce();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Joining";
  }, []);

  const [singleData, setSingleData] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const { buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { values } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
  });

  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    fromDate,
    toDate,
    srcTxt = ""
  ) => {
    getAllTransferAndPromotionLanding(
      buId,
      wgId,
      "transfer",
      fromDate ? fromDate : getDateOfYear("first"),
      toDate ? toDate : getDateOfYear("last"),
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      srcTxt,
      wId
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId, wId]);

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      values?.filterFromDate,
      values?.filterToDate,
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      values?.filterFromDate,
      values?.filterToDate,
      searchText
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 217) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {
          // saveHandler(values, () => {
          //   resetForm(initData);
          // });
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            {loading && <Loading />}
            <div className="overtime-entry">
              {permission?.isView ? (
                <div>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div></div>
                      <div className="table-card-head-right">
                        <ul>
                          {isFilter && (
                            <li>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{ marginRight: "10px" }}
                                  />
                                }
                                onClick={() => {
                                  setIsFilter(false);
                                  setFieldValue("search", "");
                                  getData(
                                    {
                                      current: pages.current,
                                      pageSize: pages.pageSize,
                                    },
                                    values?.filterFromDate,
                                    values?.filterToDate,
                                    ""
                                  );
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              isHiddenFilter
                              inputWidth="200px"
                              width="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                debounce(() => {
                                  getData(
                                    {
                                      current: pages.current,
                                      pageSize: pages.pageSize,
                                    },
                                    values?.filterFromDate,
                                    values?.filterToDate,
                                    value
                                  );
                                }, 500);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData(
                                  {
                                    current: pages.current,
                                    pageSize: pages.pageSize,
                                  },
                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  ""
                                );
                              }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body mt-2 pt-1">
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterFromDate}
                                placeholder=""
                                name="filterFromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "filterFromDate",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterToDate}
                                placeholder="Month"
                                name="filterToDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("filterToDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-1">
                            <button
                              disabled={
                                !values?.filterToDate || !values?.filterFromDate
                              }
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(
                                  {
                                    current: pages.current,
                                    pageSize: pages.pageSize,
                                  },
                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  values?.search
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="table-card-styled tableOne formCardTwoWithTable">
                        {rowDto?.length > 0 ? (
                          <table className="table table-bordered table-colored">
                            <thead>
                              <tr className="heading-row">
                                <th rowSpan="2" className="table-heading">
                                  <div>SL</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Employee</div>
                                </th>
                                <th
                                  className="table-heading text-center"
                                  colSpan="2"
                                >
                                  <div>From</div>
                                </th>
                                <th
                                  className="table-heading text-center"
                                  colSpan="2"
                                >
                                  <div>To</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Type</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Effective Date</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Release Date</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Status</div>
                                </th>
                              </tr>
                              <tr
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "400",
                                  color: "rgba(82, 82, 82, 1)",
                                }}
                              >
                                <td
                                  style={{
                                    backgroundColor: "rgba(247, 220, 92, 1)",
                                    width: "200px",
                                  }}
                                >
                                  <div> B.Unit, Workplace Group, Workplace</div>
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgba(247, 220, 92, 1)",
                                    width: "150px",
                                  }}
                                >
                                  Dept, Section & Designation
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgba(129, 225, 255, 1)",
                                    width: "200px",
                                  }}
                                >
                                  <div> B.Unit, Workplace Group, Workplace</div>
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgba(129, 225, 255, 1)",
                                    width: "150px",
                                  }}
                                >
                                  Dept, Section & Designation
                                </td>
                              </tr>
                            </thead>
                            <tbody
                              style={{ color: "var(--gray600)!important" }}
                            >
                              {rowDto?.map((item, index) => (
                                <tr
                                  style={{
                                    color: "var(--gray600)!important",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                  }}
                                  key={index}
                                  onClick={() =>
                                    history.push(
                                      `/profile/transferandpromotion/joining/view/${item?.intTransferNpromotionId}`,
                                      {
                                        employeeId: item?.intEmployeeId,
                                        businessUnitId: item?.intBusinessUnitId,
                                        workplaceGroupId:
                                          item?.intWorkplaceGroupId,
                                      }
                                    )
                                  }
                                >
                                  <JoiningTable
                                    item={item}
                                    index={index}
                                    singleData={singleData}
                                    setSingleData={setSingleData}
                                    permission={permission}
                                    getData={getData}
                                    setLoading={setLoading}
                                    page={pages?.current}
                                    paginationSize={pages?.pageSize}
                                    values={values}
                                  />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          !loading && <NoResult />
                        )}
                      </div>
                      {rowDto?.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "right",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Select
                            value={pages?.pageSize}
                            onChange={handleChangeRowsPerPage}
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: "16px", fontSize: "14px" }}
                          >
                            <MenuItem value={25}>25 per page</MenuItem>
                            <MenuItem value={50}>50 per page</MenuItem>
                            <MenuItem value={100}>100 per page</MenuItem>
                            <MenuItem value={500}>500 per page</MenuItem>
                          </Select>
                          <Pagination
                            count={Math.ceil(pages?.total / pages?.pageSize)}
                            page={pages.current}
                            onChange={handleChangePage}
                            size="small"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
