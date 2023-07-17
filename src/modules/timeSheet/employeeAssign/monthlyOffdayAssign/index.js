/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
// import MasterFilter from "../../../../common/MasterFilter";
import AntTable, { paginationSize } from "../../../../common/AntTable";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import {
  createMonthlyOffdayAssign,
  getOffDayLandingHandler,
  offDayAssignDtoCol,
} from "./helper";
import "./monthlyOffday.css";
import MasterFilter from "../../../../common/MasterFilter";
import ViewModal from "../../../../common/ViewModal";
import moment from "moment";
import { Popover } from "@mui/material";
import profileImg from "../../../../assets/images/profile.jpg";
import PopoverCalender from "./components/PopoverCalender";
import ViewModalCalender from "./components/ViewModalCalender";

const initData = {
  search: "",
  workplace: "",
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
  employee: "",
  isAssigned: false,
};

function MonthlyOffdayAssignLanding() {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const [anchorEl, setAnchorEl] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, []);
  const [resLanding, getLanding, loadingLanding, setLanding] = useAxiosPost();
  const [showModal, setShowModal] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState([]);
  const [singleAssign, setSingleAssign] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checked, setChecked] = useState([]);

  const open = !loading && Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const isAlreadyPresent = (obj) => {
    for (let i = 0; i < checked.length; i++) {
      if (checked[i].EmployeeCode === obj.EmployeeCode) {
        return i;
      }
    }
    return -1;
  };

  const getData = (pagination, srcText, status = "") => {
    getOffDayLandingHandler(
      buId,
      orgId,
      getLanding,
      setLanding,
      pagination,
      setPages,
      srcText,
      status,
      isAlreadyPresent,
      checked
    );
  };

  useEffect(() => {
    getData(pages);
  }, [buId, orgId]);

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30370) {
      permission = item;
    }
  });
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

  const { handleSubmit, values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        resetForm(initData);
      });
    },
  });

  const handleSave = () => {
    const offdays = calendarData?.map((data) => {
      return {
        date: moment().format(
          `YYYY-MM-${data?.dayId < 10 ? "0" : ""}${data?.dayId}`
        ),
        isOffDay: data?.isOffday,
        isActive: true,
      };
    });
    let empArr = [];
    const intEmployeeId = singleAssign
      ? [selectedSingleEmployee[0]?.EmployeeId]
      : resLanding?.map(
          (data) => data?.selectCheckbox && empArr.push(data?.EmployeeId)
        );
    const payload = {
      intEmployeeId: singleAssign ? intEmployeeId : empArr,
      offdays: singleAssign
        ? offdays
        : offdays?.filter((data) => data?.isOffDay === true),
      intActionBy: employeeId,
    };
    const callback = () => {
      setCalendarData([]);
      setChecked([]);
      setSingleAssign(false);
      setShowModal(false);
      getData(pages, "", "saved");
      setFieldValue("search", "");
    };
    payload?.offdays?.length > 0
      ? createMonthlyOffdayAssign(payload, setLoading, callback)
      : toast.error("Please select at least one day");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <>
          {(loadingLanding || loading) && <Loading />}
          {permission?.isView ? (
            <div className="table-card">
              <div className="table-card-heading">
                <div style={{ paddingLeft: "6px" }}>
                  {checked.length > 0 && (
                    <h6 className="count">
                      Total {checked.length}{" "}
                      {`employee${checked.length > 1 ? "s" : ""}`} selected
                    </h6>
                  )}
                </div>
                <div className="table-card-head-right">
                  <ul>
                    {checked.length > 0 && (
                      <li>
                        <ResetButton
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{ marginRight: "10px" }}
                            />
                          }
                          onClick={() => {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              "saved"
                            );
                            // setRowDto(allData);
                            setFieldValue("allSelected", false);
                            setFieldValue("workplace", "");
                            setFieldValue("department", "");
                            setFieldValue("designation", "");
                            setFieldValue("supervisor", "");
                            setFieldValue("employmentType", "");
                            setFieldValue("employee", "");
                            setFieldValue("isAssigned", false);
                            setFieldValue("search", "");
                            setChecked([]);
                          }}
                        />
                      </li>
                    )}
                    <li>
                      {checked?.filter((item) => item?.selectCheckbox).length >
                        0 && (
                        <button
                          className="btn btn-green"
                          style={{ marginRight: "40px", height: "30px" }}
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            setSingleAssign(false);
                            setShowModal(true);
                          }}
                        >
                          Assign
                        </button>
                      )}
                    </li>
                    <li>
                      <MasterFilter
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
                            getData(
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }
                        }}
                        cancelHandler={() => {
                          getData({ current: 1, pageSize: paginationSize }, "");
                          setFieldValue("search", "");
                        }}
                        width="200px"
                        inputWidth="200px"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="table-card-body">
                <div className="table-card-styled tableOne">
                  {resLanding.length > 0 ? (
                    <AntTable
                      data={resLanding}
                      columnsData={offDayAssignDtoCol(
                        pages,
                        paginationSize,
                        permission,
                        // filterLanding,
                        // setFilterLanding,
                        setLanding,
                        resLanding,
                        setShowModal,
                        setSelectedSingleEmployee,
                        setSingleAssign,
                        setAnchorEl,
                        checked,
                        setChecked,
                        setCalendarData,
                        isAlreadyPresent,
                        setLoading,
                        loading
                      )}
                      // setColumnsData={(dataRow) => {
                      //   if (dataRow?.length === resLanding?.length) {
                      //     let temp = dataRow?.map((item) => {
                      //       return {
                      //         ...item,
                      //         selectCheckbox: false,
                      //       };
                      //     });
                      //     setFilterLanding(temp);
                      //     setLanding(temp);
                      //     return;
                      //   }
                      //   setFilterLanding(dataRow);
                      // }}
                      pages={pages?.pageSize}
                      pagination={pages}
                      handleTableChange={({ pagination, newRowDto }) =>
                        handleTableChange(
                          pagination,
                          newRowDto,
                          values?.search || ""
                        )
                      }
                      rowKey={(record) => record?.EmployeeId}
                    />
                  ) : (
                    <>
                      {!loadingLanding && (
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
        </>
        {/* View Form Modal */}
        <ViewModal
          show={!loading && showModal}
          title={`Assign Monthly Calendar (${moment().format("MMM, YYYY")})`}
          onHide={() => {
            setShowModal(false);
            setSingleAssign(false);
            setCalendarData([]);
          }}
          size="lg"
          backdrop="static"
          classes="default-modal creat-job-modal"
        >
          <ViewModalCalender
            propsObj={{
              singleAssign,
              // filterLanding,
              resLanding,
              selectedSingleEmployee,
              profileImg,
              setShowModal,
              calendarData,
              setCalendarData,
              setSingleAssign,
              handleSave,
            }}
          />
        </ViewModal>
        <Popover
          sx={{
            "& .MuiPaper-root": {
              width: "600px",
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
            // vertical: "bottom",
            horizontal: "middle",
          }}
        >
          <PopoverCalender
            propsObj={{
              selectedSingleEmployee,
              profileImg,
              setShowModal,
              calendarData,
              setCalendarData,
            }}
          />
        </Popover>
      </form>
    </>
  );
}

export default MonthlyOffdayAssignLanding;
