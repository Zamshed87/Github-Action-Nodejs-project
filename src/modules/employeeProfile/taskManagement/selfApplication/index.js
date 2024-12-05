import React, { useEffect } from "react";
import NoResult from "../../../../common/NoResult";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import { AddOutlined } from "@mui/icons-material";
import MasterFilter from "../../../../common/MasterFilter";
import PrimaryButton from "../../../../common/PrimaryButton";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import {
  getTask,
  initDataForLanding,
  taskLandingTableCol,
  validationSchemaForLanding,
} from "../helper";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";

const SelfTaskManagement = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // let permission = null;
  // permissionList.forEach((item) => {
  //   if (item?.menuReferenceId === 30351) {
  //     permission = item;
  //   }
  // });

  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [, getAllTasks, loading] = useAxiosGet([]);

  const getData = (values, pages) => {
    getTask({
      getAllTasks,
      setRowDto,
      fDate: values?.filterFromDate || "",
      tDate: values?.filterToDate || "",
      employeeId: employeeId,
      isManagement: false,
      srcTxt: values?.search,
      isPaginated: true,
      pageNo: pages?.current,
      pageSize: pages?.pageSize,
      setPages,
    });
  };

  const { setFieldValue, values, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchemaForLanding,
    initialValues: initDataForLanding,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      getData(values, pages);
    },
  });
  const handleChangePage = (_, newPage, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(values, {
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event, values) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(values, {
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  useEffect(() => {
    getData(values, pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, [dispatch]);

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card businessUnit-wrapper dashboard-scroll">
          <div className="table-card-heading">
            <div>{/* <h6>Separation</h6> */}</div>
            <ul className="d-flex flex-wrap">
              <li>
                <MasterFilter
                  inputWidth="200"
                  width="200px"
                  isHiddenFilter
                  value={values?.search}
                  setValue={(value) => {
                    setFieldValue("search", value);
                    getTask({
                      getAllTasks,
                      setRowDto,
                      fDate: values?.filterFromDate || "",
                      tDate: values?.filterToDate || "",
                      employeeId: values?.employee?.value || employeeId,
                      isManagement: true,
                      srcTxt: value,
                      isPaginated: true,
                      pageNo: pages?.current,
                      pageSize: pages?.pageSize,
                      setPages,
                    });
                  }}
                  cancelHandler={() => {
                    setFieldValue("search", "");
                    getTask({
                      getAllTasks,
                      setRowDto,
                      fDate: values?.filterFromDate || "",
                      tDate: values?.filterToDate || "",
                      employeeId: values?.employee?.value || employeeId,
                      isManagement: true,
                      srcTxt: "",
                      isPaginated: true,
                      pageNo: pages?.current,
                      pageSize: pages?.pageSize,
                      setPages,
                    });
                  }}
                />
              </li>
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Create"}
                  icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push("/SelfService/taskManagement/create");
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
                    name="filterFromDate"
                    max={values?.filterToDate}
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("filterFromDate", e.target.value);
                      setFieldValue("filterToDate", "");
                    }}
                    errors={errors}
                    touched={touched}
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
                    name="filterToDate"
                    min={values?.filterFromDate}
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("filterToDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <button
                  className="btn btn-green btn-green-disable mt-4"
                  type="submit"
                >
                  View
                </button>
              </div>
            </div>
          </div>
          {rowDto?.length > 0 ? (
            <div className="table-card-body">
              <PeopleDeskTable
                columnData={taskLandingTableCol(
                  pages?.current,
                  pages?.pageSize
                )}
                pages={pages}
                rowDto={rowDto}
                setRowDto={setRowDto}
                handleChangePage={(e, newPage) =>
                  handleChangePage(e, newPage, values)
                }
                handleChangeRowsPerPage={(e) =>
                  handleChangeRowsPerPage(e, values)
                }
                onRowClick={(res) => {
                  history.push(
                    `/SelfService/taskManagement/view/${res?.headerId}`
                  );
                }}
                uniqueKey="headerId"
              />
            </div>
          ) : (
            <>{!loading && <NoResult title="No Result Found" para="" />}</>
          )}
        </div>
      </form>
    </>
  );
};

export default SelfTaskManagement;
