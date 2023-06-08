/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import ScrollableTable from "../../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getAttendanceByRoster } from "../helper";
import "./attendanceByRoster.css";
import PopOverFilter from "./PopOverFilter";

let date = new Date();
let monthYear = date.getFullYear() + "-" + (date.getMonth() + 1).toString();
const initData = {
  search: "",
  monthYear: `${monthYear}`,
};

export default function AttendanceByRoster() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);
  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [rowDto, setRowDto] = useState(null);
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [year, setYear] = useState(date.getFullYear());
  const [isFilter, setIsFilter] = useState({
    monthYear: "",
    workplaceGroup: "",
    departmentList: "",
  });
  const getData = () => {
    getAttendanceByRoster(
      Math.abs(month),
      year,
      buId,
      0,
      orgId,
      0,
      "",
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 96) {
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
            resetForm(initData);
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
                <div className="attendence-report-by-roster">
                  <div className="table-card">
                    <div className="table-card-heading pb-2 mt-1">
                      <div className="d-flex">
                        {/* <Tooltip title="Export CSV" arrow>
                             <button
                               className="btn-save "
                               style={{
                                 border: "transparent",
                                 width: "40px",
                                 height: "40px",
                                 background: "#f2f2f7",
                                 borderRadius: "100px",
                               }}
                             >
                               <SaveAlt sx={{ color: "#637381" }} />
                             </button>
                           </Tooltip> */}
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {(values?.search ||
                            isFilter?.monthYear ||
                            isFilter?.workplaceGroup ||
                            isFilter?.departmentList) && (
                            <li>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{ marginRight: "10px" }}
                                  />
                                }
                                onClick={() => {
                                  getData();
                                  setIsFilter({
                                    monthYear: "",
                                    workplaceGroup: "",
                                    departmentList: "",
                                  });
                                  setFieldValue("search", "");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                getAttendanceByRoster(
                                  Math.abs(month),
                                  year,
                                  buId,
                                  0,
                                  0,
                                  0,
                                  value,
                                  setRowDto,
                                  setLoading
                                );
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData();
                              }}
                              handleClick={handleClick}
                            />
                          </li>
                        </ul>
                        {/* <div style={{ marginRight: "20px" }}>
                             <FormikDatePicker
                               isSmall
                               label=""
                               value={values?.monthYear}
                               name="monthYear"
                               type="month"
                               onChange={(e) => {
                                 setFieldValue("monthYear", e.target.value);
                                 let year = e.target.value.split("").slice(0, 4).join("")
                                 let month = e.target.value.split("").slice(-2).join("")
                                 setMonth(year);
                                 setYear(month);
                                 getAttendanceByRoster(month, year, buId, 0, 0, 0, "", setRowDto, setLoading);
                               }}
                               errors={errors}
                               touched={touched}
                             />

                           </div> */}
                      </div>
                    </div>
                    <div className="table-card-body ">
                      {rowDto?.tableRow?.length > 0 ? (
                        <ScrollableTable>
                          <thead>
                            <th
                              style={{
                                textAlign: "center",
                                minWidth: "40px",
                                color: "rgba(0, 0, 0, 0.7)",
                              }}
                            >
                              SL
                            </th>
                            {rowDto?.headingNames?.map((item, index) =>
                              index === 0 ? (
                                <th
                                  key={index}
                                  className="text-center"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {item}
                                </th>
                              ) : (
                                <th
                                  key={index}
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {item}
                                </th>
                              )
                            )}
                          </thead>
                          <tbody>
                            {rowDto.tableRow?.length > 0 &&
                              rowDto.tableRow?.map((item, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      minWidth: "40px",
                                      color: "rgba(0,0,0,0.6)",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td></td>
                                  {item?.tableData?.map((item, idx) =>
                                    idx === 0 ? (
                                      <td key={idx} className="">
                                        {item}
                                      </td>
                                    ) : (
                                      <td key={idx} className="">
                                        {item}
                                      </td>
                                    )
                                  )}
                                </tr>
                              ))}
                          </tbody>
                        </ScrollableTable>
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
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
      <PopOverFilter
        propsObj={{
          id,
          open,
          anchorEl,
          setAnchorEl,
          handleClose,
          month,
          year,
          setMonth,
          setYear,
          setRowDto,
        }}
        setIsFilter={setIsFilter}
        isFilter={isFilter}
      />
    </>
  );
}
