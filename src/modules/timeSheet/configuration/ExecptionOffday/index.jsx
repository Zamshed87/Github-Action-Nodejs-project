/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "./../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import SortingIcon from "../../../../common/SortingIcon";
import {
  SettingsBackupRestoreOutlined,
  SearchOutlined,
  AddOutlined,
  ArrowDropUp,
  ArrowDropDown,
} from "@mui/icons-material";
import { Select } from "@mui/material";
import { MenuItem } from "@material-ui/core";
import ViewModal from "../../../../common/ViewModal";
import { useHistory } from "react-router";
import CreateExecptionOffday from "./addEditForm";
import Chips from "../../../../common/Chips";
import ResetButton from "./../../../../common/ResetButton";
import FormikInput from "./../../../../common/FormikInput";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import NoResult from "./../../../../common/NoResult";
import "./styles.css";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";

const initData = {
  search: "",
  status: "",
};

// status DDL
const statusDDL = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export default function ExecptionOffday() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // modal state
  const [isExecptionOffday, setIsExecptionOffday] = useState(false);

  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [status, setStatus] = useState("");
  const [viewOrder, setViewOrder] = useState("desc");
  const [createOrder, setCreateOrder] = useState("desc");

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPeopleDeskAllLanding(
      "ExceptionOffdayGroup",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading
    );
  }, [orgId, buId]);

  // Yes & No filter
  const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Yes") {
      modifyRowData = newRowData?.filter(
        (item) => item?.isAlternativeDay === true
      );
    } else {
      modifyRowData = newRowData?.filter(
        (item) => item?.isAlternativeDay === false
      );
    }
    setRowDto(modifyRowData);
  };

  // search
  const filterData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.ExceptionOffdayName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };

  const saveHandler = (values) => {};

  const handleClose = () => {
    setIsExecptionOffday(false);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 41) {
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
                <div className="table-card execption-offday-main">
                  <div className="table-card-heading">
                    <div className="total-result">
                      {rowDto?.length > 0 ? (
                        <>
                          <h6 style={{fontSize:"14px",color: "rgba(0, 0, 0, 0.6)"}}>Total {rowDto?.length} results</h6>
                        </>
                      ) : (
                        <>
                          <small>Total result 0</small>
                        </>
                      )}
                    </div>
                    <ul className="d-flex flex-wrap">
                      {(values?.search || status !== "") && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{
                                  marginRight: "10px",
                                  fontSize: "18px",
                                }}
                              />
                            }
                            onClick={() => {
                              setRowDto(allData);
                              setFieldValue("search", "");
                              setStatus("");
                            }}
                          />
                        </li>
                      )}
                      <li style={{ marginRight: "24px" }}>
                        <FormikInput
                          classes="search-input fixed-width"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined
                              sx={{
                                color: "#323232",
                                fontSize: "18px",
                              }}
                            />
                          }
                          onChange={(e) => {
                            filterData(e.target.value, allData, setRowDto);
                            setFieldValue("search", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Exception offday"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            e.stopPropagation();
                            setIsExecptionOffday(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          <table className="table">
                            <thead>
                              <tr>
                                <th style={{width:"60px"}}><div className="pl-3">SL</div></th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setViewOrder(
                                        viewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        viewOrder,
                                        "ExceptionOffdayName"
                                      );
                                    }}
                                  >
                                    <span>Exception Offday Name</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={viewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable justify-content-center">
                                    <span>Alternative Day</span>
                                    <span>
                                      <Select
                                        sx={{
                                          "& .MuiOutlinedInput-notchedOutline":
                                            {
                                              border: "none !important",
                                            },
                                          "& .MuiSelect-select": {
                                            paddingRight: "22px !important",
                                            marginTop: "-15px",
                                          },
                                        }}
                                        className="selectBtn"
                                        name="status"
                                        IconComponent={
                                          status && status !== "Yes"
                                            ? ArrowDropUp
                                            : ArrowDropDown
                                        }
                                        value={values?.status}
                                        onChange={(e) => {
                                          setFieldValue("status", "");
                                          setStatus(e.target.value?.label);
                                          statusTypeFilter(
                                            e.target.value?.label
                                          );
                                        }}
                                      >
                                        {statusDDL?.length > 0 &&
                                          statusDDL?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item}
                                              >
                                                {item?.label}
                                              </MenuItem>
                                            );
                                          })}
                                      </Select>
                                    </span>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setCreateOrder(
                                        createOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        createOrder,
                                        "InsertUserId"
                                      );
                                    }}
                                  >
                                    <span>Created By</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={createOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => {
                                return (
                                  <tr
                                    className="hasEvent"
                                    key={index}
                                    onClick={(e) => {
                                      if (!permission?.isEdit)
                                        return toast.warn(
                                          "You don't have permission"
                                        );
                                      e.stopPropagation();
                                      history.push({
                                        pathname: `/administration/timeManagement/exceptionOffDay/${item?.ExceptionOffdayGroupId}`,
                                        state: { calenderItem: item },
                                      });
                                    }}
                                  >
                                    <td>
                                      <div className="content tableBody-title pl-3">
                                        {" "}
                                        {index + 1}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title">
                                        {" "}
                                        {item?.ExceptionOffdayName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-center">
                                        {item?.isAlternativeDay ? (
                                          <Chips
                                            label="Yes"
                                            classess="success"
                                          />
                                        ) : (
                                          <Chips label="No" classess="danger" />
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.InsertUserId}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
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

              {/* addEditForm */}
              <ViewModal
                show={isExecptionOffday}
                title={"Create Exception Offday"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal form-modal"
              >
                <CreateExecptionOffday
                  setIsExecptionOffday={setIsExecptionOffday}
                  onHide={handleClose}
                  setRowDto={setRowDto}
                  setAllData={setAllData}
                  setLoading={setLoading}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
