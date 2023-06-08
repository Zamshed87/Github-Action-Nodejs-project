import {
  AddOutlined,
  ArrowDropDown,
  ArrowDropUp,
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getControlPanelAllLanding } from "../helper";
import AddEditFormComponent from "./addEditForm/index";
import TableItem from "./components/tableItem/TableItem";
import { filterData } from "./helper";

const initData = {
  search: "",
  status: "",
};
const validationSchema = Yup.object({});

// status DDL
const statusDDL = [
  { value: "Active", label: "Active" },
  { value: "InActive", label: "Inactive" },
];

export default function DashboardComponent() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [id, setId] = useState("");

  // order
  const [viewOrder, setViewOrder] = useState("desc");
  const [positionViewOrder, setPositionViewOrder] = useState("desc");

  const saveHandler = (values) => {};

  //  Form modal hide show  func
  const [isFormModal, setIsFormModal] = useState(false);

  // Details modal Hide show func

  // for create Modal

  const handleClose = () => {
    setIsFormModal(false);
    setId(null);
    setSingleData("");
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    getControlPanelAllLanding({
      apiUrl: `/SaasMasterData/DashboardComponentLanding`,
      setLoading,
      setter: setRowDto,
      setAllData,
    });
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // active & inactive filter
  const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Active") {
      modifyRowData = newRowData?.filter((item) => item?.isActive === true);
    } else {
      modifyRowData = newRowData?.filter((item) => item?.isActive === false);
    }
    setRowDto(modifyRowData);
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

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 10234) {
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
                <div className="table-card hr-position-main">
                  <div className="table-card-heading">
                    <div></div>
                    <ul className="d-flex flex-wrap">
                      {(values?.search || status) && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px" }}
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
                          classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined sx={{ color: "#323232" }} />
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
                          label={"Create"}
                          icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            e.stopPropagation();
                            setIsFormModal(true);
                            setId("");
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
                                <th
                                  style={{ width: "40px", textAlign: "center" }}
                                >
                                  SL
                                </th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setViewOrder(
                                        viewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(viewOrder, "strName");
                                    }}
                                  >
                                    <span>Name</span>
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
                                      setPositionViewOrder(
                                        positionViewOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        positionViewOrder,
                                        "strDisplayName"
                                      );
                                    }}
                                  >
                                    <span>Display Name</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={positionViewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div className="">
                                    <div className="table-th d-flex align-items-center justify-content-center">
                                      Status
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
                                  </div>
                                </th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => {
                                return (
                                  <TableItem
                                    item={item}
                                    index={index}
                                    setIsFormModal={setIsFormModal}
                                    editId={id}
                                    setEditId={setId}
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

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={isFormModal}
                title={
                  id ? "Edit Dashboard Component" : "Create Dashboard Component"
                }
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal configure-modal"
                id={id}
                setRowDto={setRowDto}
                setAllData={setAllData}
                singleData={singleData}
                setSingleData={setSingleData}
                getData={getData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
