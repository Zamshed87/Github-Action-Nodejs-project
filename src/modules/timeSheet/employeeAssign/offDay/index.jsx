/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
import AntTable, { paginationSize } from "../../../../common/AntTable";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import AddEditFormComponent from "./addEditForm";
import { getOffDayLandingHandler, offDayAssignDtoCol } from "./helper";
import "./offday.css";
import MasterFilter from "../../../../common/MasterFilter";
import { Popover } from "@mui/material";
import profileImg from "../../../../assets/images/profile.jpg";
import PopoverCalender from "../monthlyOffdayAssign/components/PopoverCalender";

const initData = {
  search: "",
};

function OffDay() {
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [calendarData, setCalendarData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [singleData, setSingleData] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [isMulti, setIsMulti] = useState(false);
  const [empId, setEmpId] = useState("");
  const handleCreateClose = () => setCreateModal(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const open = !loading && Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, []);
  const [resLanding, getLanding, loadingLanding, setLanding] = useAxiosPost();
  const [checked, setChecked] = useState([]);

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
      wgId,
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
    setChecked([])
  }, [buId, orgId, wgId]);

  const updateSingleData = (item) => {
    const newRowData = {
      ...item,
      effectiveDate: item?.EffectiveDate,
      isSaturday: item?.isSaturday,
      isSunday: item?.isSunday,
      isMonday: item?.isMonday,
      isTuesday: item?.isTuesday,
      isWednesday: item?.isWednesday,
      isThursday: item?.isThursday,
      isFriday: item?.isFriday,
      isEdit: true,
    };
    setSingleData(newRowData);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 45) {
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {loadingLanding && <Loading />}
            <Form onSubmit={handleSubmit}>
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
                                setFieldValue("search", "");
                                setChecked([]);
                              }}
                            />
                          </li>
                        )}
                        <li>
                          {checked.length > 0 && (
                            <button
                              className="btn btn-green"
                              style={{ marginRight: "40px", height: "30px" }}
                              onClick={(e) => {
                                if (!permission?.isCreate)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setIsMulti(true);
                                setSingleData(null);
                                setCreateModal(true);
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
                              getData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
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
                            updateSingleData,
                            setCreateModal,
                            setEmpId,
                            setSingleData,
                            setIsMulti,
                            checked,
                            setChecked,
                            isAlreadyPresent,
                            // filterLanding,
                            // setFilterLanding,
                            setLanding,
                            resLanding,
                            setSelectedSingleEmployee,
                            setAnchorEl,
                            setCalendarData,
                            setLoading,
                            loading
                          )}
                          setColumnsData={(dataRow) => {}}
                          pages={pages?.pageSize}
                          pagination={pages}
                          handleTableChange={({ pagination, newRowDto }) =>
                            handleTableChange(
                              pagination,
                              newRowDto,
                              values?.search || ""
                            )
                          }
                          rowKey={(record) => record?.EmployeeCode}
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
              {/* View Form Modal */}
              <AddEditFormComponent
                show={createModal}
                title={id ? "Edit Assign Day" : "Assign Day"}
                onHide={handleCreateClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                empId={empId}
                orgId={orgId}
                isMulti={isMulti}
                setIsMulti={setIsMulti}
                buId={buId}
                offDayLanding={resLanding}
                singleData={singleData}
                checked={checked}
                setChecked={setChecked}
                getData={(status) => getData(pages, "", status)}
                setFieldValueParent={setFieldValue}
              />
            </Form>
          </>
        )}
      </Formik>
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
            calendarData,
            setCalendarData,
          }}
        />
      </Popover>
    </>
  );
}
export default OffDay;
