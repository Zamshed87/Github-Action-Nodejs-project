import {
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Avatar, IconButton, Popover } from "@mui/material";
import { Clear } from "@mui/icons-material";
// import { Avatar } from "@mui/material";

import AntTable, { AntPageSize } from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
// import { getCalendarAssignFilter } from "../calendar/helper";
// import AddEditFormComponent from "./addEditForm";
import { getShiftAssignFilter, getShiftInfo } from "./helper";
import Calender from "./component/Calender";
import ViewModal from "../../../../common/ViewModal";
import CommonEmpInfo from "../../../../common/CommonEmpInfo";
import SingleShiftAssign from "./singleShiftAssign";
// import AvatarCustom from "./component/AvatarCustom";
const initData = {
  searchString: "",
};
const validationSchema = Yup.object({});

function ShiftManagement() {
  // const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleShiftData, setSingleShiftData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [ismulti, setIsmulti] = useState(false);

  const [uniqueShiftBg, setUniqueShiftBg] = useState({});
  const [uniqueShift, setUniqueShift] = useState([]);
  const [uniqueShiftColor, setUniqueShiftColor] = useState({});
  // eslint-disable-next-line
  // const [colors, setColors] = useState([
  //   "#6927DA",
  //   "#B42318",
  //   "#299647",
  //   "#B54708",
  //   "#722F37",
  //   "#3538CD",
  //   "#667085",
  // ]);
  const colors = [
    "#299647",
    "#B54708",
    "#B42318",
    "#6927DA",
     "#3538CD",
    "#667085",
    
    "#667085",
  ];
  // eslint-disable-next-line
  const [bgColors, setBgColors] = useState([
    "#E6F9E9",
    "#FEF0C7",
    "#FEE4E2",
    "#ECE9FE",
    "#E0EAFF",
    "#F2F4F7",
    "#FEF0D7",
  ]);
  const [isFilter, setIsFilter] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  // const handleCreateClose = () => setCreateModal(false);
  const [singleAssign, setSingleAssign] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
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

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [pages, setPages] = useState({
    current: 1,
    pageSize: AntPageSize,
    total: 0,
  });
  const dispatch = useDispatch();

  const getData = (pagination, srcText) => {
    getShiftAssignFilter(
      setAllData,
      setRowDto,
      setLoading,
      rowDto,
      {
        departmentId: 0,
        designationId: 0,
        supervisorId: 0,
        employmentTypeId: 0,
        employeeId: 0,
        workplaceGroupId: 0,
        Status: "all",
        accountId: orgId,
        businessUnitId: buId,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        searchText: srcText || "",
      },
      (res) => {
        setPages({
          ...pages,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: res?.[0]?.totalCount,
        });
      }
    );
  };

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

  useEffect(() => {
    getData(pages);
    setCalendarData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   permission
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30369) {
      permission = item;
    }
  });
  const saveHandler = () => {};
  const columns = () => [
    {
      title: () => (
        <span style={{ color: gray600, textAlign: "text-center" }}>SL</span>
      ),
      render: (text, record, index) => {
        return (
          <span>
            {pages?.current === 1
              ? index + 1
              : (pages.current - 1) * pages?.pageSize + (index + 1)}
          </span>
        );
      },

      className: "text-center",
    },
    {
      title: () => (
        <div style={{ minWidth: "100px" }}>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              padding: "0 !important",
              color: gray900,
              checkedColor: greenColor,
            }}
            name="allSelected"
            checked={
              rowDto?.length > 0 && rowDto?.every((item) => item?.isAssigned)
            }
            onChange={(e) => {
              let data = rowDto?.map((item) => ({
                ...item,
                isAssigned: e.target.checked,
              }));
              let data2 = allData.map((item) => ({
                ...item,
                isAssigned: e.target.checked,
              }));
              setRowDto(data);
              setAllData(data2);
            }}
          />

          <span style={{ marginLeft: "5px", color: gray600 }}>Employee ID</span>
        </div>
      ),
      dataIndex: "EmployeeCode",
      render: (_, record, index) => (
        <div style={{ minWidth: "80px" }}>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              color: gray900,
              checkedColor: greenColor,
              padding: "0px",
            }}
            name="selectCheckbox"
            color={greenColor}
            checked={record?.isAssigned}
            onChange={(e) => {
              let data = rowDto?.map((item) =>
                item?.EmployeeId === record?.EmployeeId
                  ? { ...item, isAssigned: !item?.isAssigned }
                  : item
              );
              let data2 = allData?.map((item) =>
                item?.EmployeeId === record?.EmployeeId
                  ? { ...item, isAssigned: !item?.isAssigned }
                  : item
              );
              setRowDto(data);
              setAllData(data2);
            }}
          />

          <span style={{ marginLeft: "5px" }}>{record?.EmployeeCode}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Employee",
      dataIndex: "EmployeeName",
      render: (EmployeeName, record) => (
        <div className="d-flex align-items-center">
          <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
          <span className="ml-2">{EmployeeName}</span>
          {/* {singleShiftData.length === 0 && */}
          <InfoOutlined
            style={{ cursor: "pointer" }}
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setSingleShiftData([]);
              getShiftInfo(record?.EmployeeId, setSingleShiftData, setLoading);
              setAnchorEl(e.currentTarget);
            }}
          />
    {/* } */}
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Supervisor",
      dataIndex: "SupervisorName",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Generate Date</span>,
      dataIndex: "GenerateDate",
      render: (GenerateDate) => dateFormatter(GenerateDate),
      sorter: true,
      filter: true,
      isDate: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Joining Date</span>,
      dataIndex: "JoiningDate",
      render: (JoiningDate) => dateFormatter(JoiningDate),
      sorter: true,
      filter: true,
      isDate: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Roster Name</span>,
      dataIndex: "RosterGroupName",
      sorter: true,
      filter: true,
    },
    // {
    //   title: () => <span style={{ color: gray600 }}>Calender Name</span>,
    //   dataIndex: "CalendarName",
    //   sorter: true,
    //   filter: true,
    //   render: (_, record) => (
    //     <>
    //       {record?.CalendarName ? (
    //         <div className="d-flex align-items-center">
    //           <RoasterInfo item={record} />
    //           <div className="pl-2">{record.CalendarName} </div>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //     </>
    //   ),
    // },
    {
      className: "text-center",
      render: (_, record, index) => (
        <div className="d-flex justify-content-around">
          {/* <InfoOutlined
            onClick={(e) => {
              e.stopPropagation();
              getShiftInfo(record?.EmployeeId, setSingleShiftData, setLoading);
              setAnchorEl(e.currentTarget);
            }}
          /> */}
          <div className="assign-btn">
            {/* {singleShiftData.length ===0 &&  */}
            <button
              style={{
                marginRight: "25px",
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              type="button"
              className="btn btn-default"
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                // history.push({
                //   pathname: `/administration/timeManagement/shiftManagement/assign/${record?.EmployeeId}`,
                // });
                setSingleShiftData([]);
                setIsmulti(false);
                setCalendarData([]);
                setCreateModal(true);
                setSelectedSingleEmployee([record]);
                setSingleAssign(true);
                getShiftInfo(
                  record?.EmployeeId,
                  setSingleShiftData,
                  setLoading
                );
              }}
            >
              Assign
            </button>
            {/* } */}
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="">
              {permission?.isView ? (
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
                                getData(
                                  { current: 1, pageSize: AntPageSize },
                                  ""
                                );
                                setIsFilter(false);
                                setRowDto(allData);
                                resetForm(initData);
                                setFieldValue("searchString", "");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          {rowDto &&
                          rowDto?.filter((item) => item?.isAssigned).length >
                            0 ? (
                            <button
                              className="btn btn-green"
                              style={{ marginRight: "40px", height: "30px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSingleShiftData([]);
                                if (!permission?.isCreate)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setSingleAssign(false);
                                setIsmulti(true);
                                setCreateModal(true);
                                setCalendarData([]);
                              }}
                            >
                              Assign
                            </button>
                          ) : (
                            ""
                          )}
                        </li>
                        <li>
                          <MasterFilter
                            isHiddenFilter
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
                              if (value) {
                                getData(
                                  { current: 1, pageSize: AntPageSize },
                                  value
                                );
                              } else {
                                getData(
                                  { current: 1, pageSize: AntPageSize },
                                  ""
                                );
                              }
                            }}
                            cancelHandler={() => {
                              setFieldValue("searchString", "");
                              getData(
                                { current: 1, pageSize: AntPageSize },
                                ""
                              );
                            }}
                            // handleClick={handleClick}
                            width="200px"
                            inputWidth="200px"
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {allData?.length > 0 ? (
                        <>
                          <AntTable
                            data={allData}
                            columnsData={columns()}
                            setColumnsData={(dataRow) => {
                              if (dataRow?.length === allData?.length) {
                                let temp = dataRow?.map((item) => {
                                  return {
                                    ...item,
                                    isAssigned: false,
                                  };
                                });
                                setRowDto(temp);
                                setAllData(temp);
                              } else {
                                setRowDto(dataRow);
                              }
                            }}
                            onRowClick={(dataRow) => {}}
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
                        </>
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
      {singleShiftData.length > 0 || ismulti ? (
        <ViewModal
          show={createModal}
          title={`Assign Shift (${moment().format("MMM, YYYY")})`}
          onHide={() => {
            setCreateModal(false);
            setSingleAssign(false);
            setCalendarData([]);
          }}
          size="lg"
          backdrop="static"
          classes="default-modal creat-job-modal"
        >
          <div className="row">
            <div
              style={{ height: "550px", overflow: "scroll" }}
              className="col-4  px-2"
            >
              {!singleAssign && (
                <p className=" ml-4 ">
                  Total Selected{" "}
                  {rowDto?.filter((item) => item?.isAssigned).length}
                </p>
              )}

              {singleAssign ? (
                <div className="">
                  <div>
                    <Avatar
                      className="ml-4 mb-1"
                      sx={{
                        mt: 0.2,
                        "&.MuiAvatar-root": {
                          width: "22px!important",
                          height: "22px!important",
                        },
                      }}
                    />
                  </div>
                  <CommonEmpInfo
                    classes={"ml-4"}
                    employeeName={selectedSingleEmployee[0]?.EmployeeName}
                    designationName={selectedSingleEmployee[0]?.DesignationName}
                    departmentName={selectedSingleEmployee[0]?.DepartmentName}
                  />
                </div>
              ) : (
                rowDto?.map(
                  (data) =>
                    data?.isAssigned && (
                      <ol className="mb-2">
                        <li style={{ display: "list-item !important" }}>
                          <div className="">
                            <div>
                              <Avatar
                                className="ml-4 mb-1"
                                sx={{
                                  mt: 0.2,
                                  "&.MuiAvatar-root": {
                                    width: "22px!important",
                                    height: "22px!important",
                                  },
                                }}
                              />
                            </div>
                            <CommonEmpInfo
                              classes={"ml-4"}
                              employeeName={data?.EmployeeName}
                              designationName={data?.DesignationName}
                              departmentName={data?.DepartmentName}
                            />
                          </div>
                        </li>
                      </ol>
                    )
                )
              )}
            </div>
            <div
              //  style={{ height: "560px", overflow: "scroll" }}
              className="col-8"
            >
              <div className="mr-2">
                {singleAssign ? (
                  <>
                    <SingleShiftAssign
                      listId={[selectedSingleEmployee[0]?.EmployeeId]}
                      setCreateModal={setCreateModal}
                      setSingleAssign={setSingleAssign}
                      getData={getData}
                      pages={pages}
                      calendarData={calendarData}
                      setCalendarData={setCalendarData}
                      singleShiftData={singleShiftData}
                      uniqueShiftColor={uniqueShiftColor}
                      uniqueShiftBg={uniqueShiftBg}
                      uniqueShift={uniqueShift}
                    />
                    {/* <CalenderCommon
                    orgId={orgId}
                    setShowModal={setCreateModal}
                    monthYear={moment().format("YYYY-MM")}
                    calendarData={calendarData}
                    setCalendarData={setCalendarData}
                    isClickable={true}
                  /> */}
                  </>
                ) : (
                  <>
                    <SingleShiftAssign
                      listId={rowDto
                        .filter((item) => item?.isAssigned)
                        .map((item) => item?.EmployeeId)}
                      setCreateModal={setCreateModal}
                      setSingleAssign={setSingleAssign}
                      getData={getData}
                      pages={pages}
                      calendarData={calendarData}
                      setCalendarData={setCalendarData}
                    />

                    {/* <CalenderCommon
                    orgId={orgId}
                    setShowModal={setCreateModal}
                    monthYear={moment().format("YYYY-MM")}
                    calendarData={calendarData}
                    setCalendarData={setCalendarData}
                    isClickable={true}
                    
                  /> */}
                  </>
                )}
              </div>
            </div>
          </div>
          {/* <div className="d-flex justify-content-end p-2">
            <ul className="d-flex flex-wrap">
              <li>
                <button
                  onClick={() => {
                    setCreateModal(false);
                    setSingleAssign(false);
                  }}
                  type="button"
                  className="btn btn-cancel mr-2"
                >
                  Cancel
                </button>
              </li>
              <li>
                <button
                  // onClick={handleSave}
                  type="button"
                  className="btn btn-green flex-center"
                >
                  Save
                </button>
              </li>
            </ul>
          </div> */}
        </ViewModal>
      ) : (
        ''
        // !singleShiftData?.length  && toast.warn("No Data Found")

        // load && toast.warn("No Data Found")
      )}
      {singleShiftData.length > 0 ? (
        <Popover
          sx={{
            "& .MuiPaper-root": {
              width: "675px",
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
          <div
            className="master-filter-modal-container employeeProfile-src-filter-main"
            style={{ height: "auto" }}
          >
            <div className="master-filter-header employeeProfile-src-filter-header">
              <div></div>
              <IconButton
                onClick={() => {
                  setAnchorEl(null);
                  // setRowDto(allData);
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
                  style={{ height: "350px" }}
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
        ''
        // !singleShiftData?.length  && toast.warn("No Data Found")
      )}
    </>
  );
}
export default ShiftManagement;
