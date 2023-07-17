/* eslint-disable no-unused-vars */
import { MenuItem } from "@material-ui/core";
import {
  AddOutlined, ArrowDropDown, ArrowDropUp, SearchOutlined, SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Select } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getPeopleDeskAllLanding } from "./../../../common/api/index";
import FormikInput from "./../../../common/FormikInput";
import Loading from "./../../../common/loading/Loading";
import NoResult from "./../../../common/NoResult";
import PrimaryButton from "./../../../common/PrimaryButton";
import ResetButton from "./../../../common/ResetButton";
import AddEditFormComponent from "./addEditForm/index";
import BusinessUnitTableItem from "./component/BusinessUnitTableItem";
import { filterData } from "./helper";
import "./styles.css";
import ViewFormComponent from "./viewForm";

// status DDL
const statusDDL = [
  { value: "Active", label: "Active" },
  { value: "InActive", label: "Inactive" },
];

const initData = {
  search: "",
  status: "",
};

const validationSchema = Yup.object({});

function SBUUnit() {
  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");

  // filter
  const [viewOrder, setViewOrder] = useState("desc");
  const [buViewOrder, setBuViewOrder] = useState("desc");
  const [status, setStatus] = useState("");

  // for create state
  const [open, setOpen] = useState(false);

  // for view state
  const [viewModal, setViewModal] = useState(false);

  // for create Modal
  const handleOpen = () => {
    setViewModal(false);
    setOpen(true);
  };
  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
  };

  // for view Modal
  const handleViewOpen = () => setViewModal(true);
  const handleViewClose = () => setViewModal(false);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);

  const saveHandler = (values) => {};

  useEffect(() => {
    getPeopleDeskAllLanding(
      "SBU",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // active & inactive filter
  const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Active") {
      modifyRowData = newRowData?.filter((item) => item?.Status === true);
    } else {
      modifyRowData = newRowData?.filter((item) => item?.Status === false);
    }
    setRowDto({ Result: modifyRowData });
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
    setRowDto({ Result: modifyRowData });
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 49) {
      permission = item;
    }
  });

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
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card sbuUnit-wrapper">
                  <div className="table-card-heading">
                    <div></div>
                    <ul className="d-flex flex-wrap">
                      {(values?.search || status) && (
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
                              setRowDto({ Result: allData });
                              setFieldValue("search", "");
                              setStatus("");
                            }}
                          />
                        </li>
                      )}
                      <li style={{ marginRight: "24px" }}>
                        <FormikInput
                          classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
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
                          label={"SBU"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "11px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            e.stopPropagation();
                            setOpen(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  {/* table body */}
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.Result?.length > 0 ? (
                        <>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setViewOrder(
                                        viewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(viewOrder, "SBUName");
                                    }}
                                  >
                                    <span>SBU</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={viewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setBuViewOrder(
                                        buViewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        buViewOrder,
                                        "BusinessUnitName"
                                      );
                                    }}
                                  >
                                    <span>Business Unit</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={buViewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable">
                                    <span>Address</span>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable justify-content-center">
                                    <span>Status</span>
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
                                          status && status !== "Active"
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
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.Result?.map((item, index) => {
                                return (
                                  <BusinessUnitTableItem
                                    {...item}
                                    item={item}
                                    key={index}
                                    handleOpen={handleOpen}
                                    handleClose={handleClose}
                                    setOpen={setOpen}
                                    setViewModal={setViewModal}
                                    orgId={orgId}
                                    buId={buId}
                                    setLoading={setLoading}
                                    setSingleData={setSingleData}
                                    permission={permission}
                                  />
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

              {/* View Form Modal */}
              <ViewFormComponent
                show={viewModal}
                title={"SBU Details"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                orgId={orgId}
                buId={buId}
                singleData={singleData}
                setSingleData={setSingleData}
              />

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={open}
                title={singleData?.SBUName ? "Edit SBU" : "Create SBU"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal configure-modal"
                orgId={orgId}
                buId={buId}
                setRowDto={setRowDto}
                setAllData={setAllData}
                singleData={singleData}
                setSingleData={setSingleData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default SBUUnit;
