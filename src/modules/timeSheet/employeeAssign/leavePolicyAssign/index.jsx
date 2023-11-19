import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import MasterFilter from "../../../../common/MasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../../../common/loading/Loading";
import NoResult from "./../../../../common/NoResult";
import AddEditFormComponent from "./addEditForm";
import ResetButton from "./../../../../common/ResetButton";
import "./calendar.css";
import {
  bgColors,
  colors,
  columns,
  getData,
  handleChangePage,
  handleChangeRowsPerPage,
  initData,
  initHeaderList,
  statusDDL,
  validationSchema,
} from "./helper";
import { Clear, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import Calender from "./component/Calender";
import { IconButton, Popover } from "@mui/material";
import { gray900 } from "../../../../utility/customColor";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";

import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { useLocation } from "react-router-dom";
import { yearDDLAction } from "utility/yearDDL";

function LeavePolicyAssign() {
  // redux
  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const { orgId, buId, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 44) {
      permission = item;
    }
  });
  const dispatch = useDispatch();
  const { state } = useLocation();

  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);
  // const [checked, setChecked] = useState([]);

  // shift info
  const [singleShiftData, setSingleShiftData] = useState([]);
  const [uniqueShift, setUniqueShift] = useState([]);

  // colors
  const [uniqueShiftColor, setUniqueShiftColor] = useState({});
  const [uniqueShiftBg, setUniqueShiftBg] = useState({});

  // modals
  const [createModal, setCreateModal] = useState(false);
  const handleCreateClose = () => setCreateModal(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  // pagination
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // peopledesk states
  const [landingLoading, setLandingLoading] = useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [checkedList, setCheckedList] = useState([]);
  const [empIDString, setEmpIDString] = useState("");
  const [isAssignAll, setIsAssignAll] = useState(false);

  // sidebar
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // landing data
  useEffect(() => {
    let temp = state?.list?.length > 0 ? state?.list : [];
    getData(
      { current: 1, pageSize: paginationSize, total: 0 },
      setLandingLoading,
      buId,
      wgId,
      wId,
      headerList,
      setHeaderList,
      setFilterOrderList,
      initialHeaderListData,
      setInitialHeaderListData,
      setPages,
      setEmpIDString,
      setRowDto,
      "",
      [],
      -1,
      [],
      initHeaderList,
      null,
      temp,
      values?.year?.value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);
  // assign colors to shift on shift load
  useEffect(() => {
    setUniqueShift([]);
    if (singleShiftData?.length > 0) {
      const data = [
        ...new Set(singleShiftData.map((item) => item.strCalendarName)),
      ];
      let colorData = {};
      let colorDataBg = {};
      data.forEach((status, index) => {
        colorData[status] = colors[index % colors.length];
      });
      setUniqueShiftColor(colorData);
      data.forEach((status, index) => {
        colorDataBg[status] = bgColors[index % bgColors.length];
      });
      setUniqueShiftBg(colorDataBg);
      setUniqueShift(data);
    }
    // eslint-disable-next-line
  }, [singleShiftData]);
  const {
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: initData,

    onSubmit: (values, { setSubmitting, resetForm }) => {
      resetForm(initData);
    },
  });
  return (
    <>
      {landingLoading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div className="table-card">
            <>
              <div className="table-card-heading">
                <div style={{ paddingLeft: "6px" }}>
                  {checkedList.length > 0 ? (
                    <h6 className="count">
                      Total {checkedList.length}{" "}
                      {`employee${checkedList.length > 1 ? "s" : ""}`} selected
                      from {pages?.total}
                    </h6>
                  ) : (
                    <h6 className="count">
                      {" "}
                      Total {rowDto?.length > 0 ? pages.total : 0} Employees
                    </h6>
                  )}
                </div>
                <div className="table-card-head-right">
                  <ul>
                    {checkedList.length > 1 && (
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
                              setLandingLoading,
                              buId,
                              wgId,
                              wId,
                              headerList,
                              setHeaderList,
                              setFilterOrderList,
                              initialHeaderListData,
                              setInitialHeaderListData,
                              setPages,
                              setEmpIDString,
                              setRowDto,
                              "",
                              [],
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );

                            // setRowDto(allData);
                            setCheckedList([]);
                            setFieldValue("searchString", "");
                          }}
                        />
                      </li>
                    )}
                    <li>
                      {rowDto?.length > 0 && (
                        <div className="d-flex">
                          <button
                            className="btn btn-green"
                            style={{
                              marginRight: "10px",
                              height: "30px",
                              minWidth: "120px",
                              fontSize: "12px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!permission?.isCreate)
                                return toast.warn("You don't have permission");
                              setIsAssignAll(true);
                              setCreateModal(true);
                            }}
                          >
                            Assign {pages.total}
                          </button>
                          {rowDto?.filter((item) => item?.isSelected).length >
                          0 ? (
                            <button
                              className="btn btn-green"
                              style={{
                                height: "30px",
                                minWidth: "120px",
                                fontSize: "12px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!permission?.isCreate)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setIsAssignAll(false);
                                setCreateModal(true);
                              }}
                            >
                              Assign {checkedList.length}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </li>
                    {/* <li className="mr-3" style={{ width: "150px" }}>
                      <FormikSelect
                        name="salaryStatus"
                        options={[
                          { value: "unassigned", label: "unassigned" },
                          { value: "assigned", label: "assigned" },
                        ]}
                        value={values?.salaryStatus}
                        onChange={(valueOption) => {
                          setFieldValue("salaryStatus", valueOption);
                          setFieldValue("searchString", "");
                          getData(
                            { current: 1, pageSize: paginationSize },
                            setLandingLoading,
                            buId,
                            wgId,
                            wId,
                            headerList,
                            setHeaderList,
                            setFilterOrderList,
                            initialHeaderListData,
                            setInitialHeaderListData,
                            setPages,
                            setEmpIDString,
                            setRowDto,
                            "",
                            checkedList,
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            valueOption?.value,
                            [],
                            values?.year?.value
                          );
                        }}
                        styles={customStyles}
                        isClearable={false}
                      />
                    </li> */}
                    <li className="mr-3" style={{ width: "150px" }}>
                      <FormikSelect
                        name="year"
                        options={yearDDLAction(5, 10)}
                        value={values?.year}
                        onChange={(valueOption) => {
                          getData(
                            { current: 1, pageSize: paginationSize },
                            setLandingLoading,
                            buId,
                            wgId,
                            wId,
                            headerList,
                            setHeaderList,
                            setFilterOrderList,
                            initialHeaderListData,
                            setInitialHeaderListData,
                            setPages,
                            setEmpIDString,
                            setRowDto,
                            "",
                            checkedList,
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            null,
                            state?.list,
                            valueOption?.value
                          );
                          setFieldValue("year", valueOption);
                        }}
                        styles={customStyles}
                        isClearable={false}
                      />
                    </li>
                    <li>
                      <MasterFilter
                        isHiddenFilter
                        value={values?.searchString}
                        setValue={(value) => {
                          setFieldValue("searchString", value);
                          if (value) {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              setLandingLoading,
                              buId,
                              wgId,
                              wId,
                              headerList,
                              setHeaderList,
                              setFilterOrderList,
                              initialHeaderListData,
                              setInitialHeaderListData,
                              setPages,
                              setEmpIDString,
                              setRowDto,
                              value,
                              checkedList,
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              null,
                              state?.list,
                              values?.year?.value
                            );
                          } else {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              setLandingLoading,
                              buId,
                              wgId,
                              wId,
                              headerList,
                              setHeaderList,
                              setFilterOrderList,
                              initialHeaderListData,
                              setInitialHeaderListData,
                              setPages,
                              setEmpIDString,
                              setRowDto,
                              "",
                              [],
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              null,
                              state?.list,
                              values?.year?.value
                            );
                          }
                        }}
                        cancelHandler={() => {
                          setFieldValue("searchString", "");
                          getData(
                            { current: 1, pageSize: paginationSize },
                            setLandingLoading,
                            buId,
                            wgId,
                            wId,
                            headerList,
                            setHeaderList,
                            setFilterOrderList,
                            initialHeaderListData,
                            setInitialHeaderListData,
                            setPages,
                            setEmpIDString,
                            setRowDto,
                            "",
                            [],
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            0
                          );
                        }}
                        handleClick={handleClick}
                        width="200px"
                        inputWidth="200px"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              {rowDto?.length > 0 ? (
                <PeopleDeskTable
                  columnData={columns(
                    pages,
                    permission,
                    rowDto,
                    setRowDto,
                    checkedList,
                    setCheckedList,
                    setSingleData,
                    setCreateModal,
                    setSingleShiftData,
                    setAnchorEl2,
                    headerList,
                    wgName
                  )}
                  pages={pages}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                  checkedHeaderList={checkedHeaderList}
                  setCheckedHeaderList={setCheckedHeaderList}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(
                      e,
                      newPage,
                      values?.search,
                      setLandingLoading,
                      buId,
                      wgId,
                      wId,
                      headerList,
                      setHeaderList,
                      setFilterOrderList,
                      initialHeaderListData,
                      setInitialHeaderListData,
                      setPages,
                      setEmpIDString,
                      setRowDto,
                      checkedList,
                      pages,
                      filterOrderList,
                      checkedHeaderList,
                      state?.list,
                      values?.year?.value
                    )
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(
                      e,
                      values?.search,
                      setLandingLoading,
                      buId,
                      wgId,
                      wId,
                      headerList,
                      setHeaderList,
                      setFilterOrderList,
                      initialHeaderListData,
                      setInitialHeaderListData,
                      setPages,
                      setEmpIDString,
                      setRowDto,
                      checkedList,
                      pages,
                      filterOrderList,
                      checkedHeaderList,
                      state?.list,
                      values?.year?.value
                    )
                  }
                  filterOrderList={filterOrderList}
                  setFilterOrderList={setFilterOrderList}
                  uniqueKey="intEmpId"
                  getFilteredData={(
                    currentFilterSelection,
                    updatedFilterData,
                    updatedCheckedHeaderData
                  ) => {
                    getData(
                      {
                        current: 1,
                        pageSize: paginationSize,
                        total: 0,
                      },
                      setLandingLoading,
                      buId,
                      wgId,
                      wId,
                      headerList,
                      setHeaderList,
                      setFilterOrderList,
                      initialHeaderListData,
                      setInitialHeaderListData,
                      setPages,
                      setEmpIDString,
                      setRowDto,
                      "",
                      [],
                      currentFilterSelection,
                      updatedFilterData,
                      updatedCheckedHeaderData,
                      [],
                      state?.list,
                      values?.year?.value
                    );
                  }}
                  isCheckBox={true}
                  isScrollAble={true}
                />
              ) : (
                !landingLoading && <NoResult title="No Result Found" para="" />
              )}
            </>
          </div>
        ) : (
          <NotPermittedPage />
        )}

        {/* View Form Modal */}
        <AddEditFormComponent
          show={createModal}
          title={id ? "Edit Assign Calendar" : "Assign Calendar"}
          onHide={handleCreateClose}
          size="lg"
          backdrop="static"
          classes="default-modal"
          id={id}
          orgId={orgId}
          buId={buId}
          singleData={singleData}
          setSingleData={setSingleData}
          checked={checkedList}
          getData={(checked) =>
            getData(
              { current: 1, pageSize: paginationSize },
              setLandingLoading,
              buId,
              wgId,
              wId,
              headerList,
              setHeaderList,
              setFilterOrderList,
              initialHeaderListData,
              setInitialHeaderListData,
              setPages,
              setEmpIDString,
              setRowDto,
              "",
              checked,
              -1,
              filterOrderList,
              checkedHeaderList
            )
          }
          setChecked={setCheckedList}
          setFieldValueParent={setFieldValue}
          isAssignAll={isAssignAll}
          setIsAssignAll={setIsAssignAll}
          empIDString={empIDString}
          setRowDto={setRowDto}
          rowDto={rowDto}
        />

        {/* i button calendar view */}
        {singleShiftData.length > 0 ? (
          <Popover
            sx={{
              "& .MuiPaper-root": {
                width: "675px",
                minHeight: "200px",
                borderRadius: "4px",
              },
            }}
            id={id2}
            open={open2}
            anchorEl={anchorEl2}
            onClose={() => {
              setAnchorEl2(null);
            }}
            anchorOrigin={{
              horizontal: "middle",
            }}
          >
            <div
              className="master-filter-modal-container employeeProfile-src-filter-main"
              style={{ height: "auto" }}
            >
              <div className="master-filter-header employeeProfile-src-filter-header">
                <div></div>
                <IconButton
                  onClick={() => {
                    setAnchorEl2(null);
                    setSingleShiftData([]);
                  }}
                >
                  <Clear sx={{ fontSize: "18px", color: gray900 }} />
                </IconButton>
              </div>
              <hr />

              {singleShiftData?.length > 0 ? (
                <>
                  <h6 className="ml-3 fs-1 text-center">
                    {" "}
                    {moment().format("MMMM")}-{moment().format("YYYY")}
                  </h6>

                  <div
                    className="body-employeeProfile-master-filter d-flex"
                    style={{ height: "380px" }}
                  >
                    <div className="row ml-3  my-2">
                      <Calender
                        monthYear={moment().format("YYYY-MM")}
                        singleShiftData={singleShiftData}
                        uniqueShiftColor={uniqueShiftColor}
                        uniqueShiftBg={uniqueShiftBg}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <NoResult title="No Result Found" para="" />
              )}

              <div className=" mt-2 mb-3 d-flex justify-content-around">
                {uniqueShift.length > 0 &&
                  uniqueShift.map((item, index) => (
                    <div key={index} className="text-center">
                      {/* <p style={getChipStyleShift(item)}>{`${item} Shift `}</p> */}
                      <p
                        style={{
                          borderRadius: "99px",
                          fontSize: "14px",
                          padding: "2px 5px",
                          fontWeight: 500,
                          color: `${uniqueShiftColor[item]}`,
                          backgroundColor: `${uniqueShiftBg[item]}`,
                        }}
                      >{`${item} Shift `}</p>
                    </div>
                  ))}
              </div>
            </div>
          </Popover>
        ) : (
          ""
        )}
      </form>
    </>
  );
}
export default LeavePolicyAssign;
