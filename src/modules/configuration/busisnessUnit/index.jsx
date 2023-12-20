import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getControlPanelAllLanding } from "../helper";
import FormikInput from "./../../../common/FormikInput";
import Loading from "./../../../common/loading/Loading";
import NoResult from "./../../../common/NoResult";
import PrimaryButton from "./../../../common/PrimaryButton";
import ResetButton from "./../../../common/ResetButton";
import AddEditFormComponent from "./addEditForm/index";
import { businesUnitDtoCol, filterData } from "./helper";
import ViewFormComponent from "./viewForm";

const initData = {
  search: "",
  status: "",
};

const validationSchema = Yup.object({});

function BusinessUnit() {
  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [businessUnitId, setBusinessUnitId] = useState(null);
  const [imageFile, setImageFile] = useState("");
  const [rowFileId, setRowFileId] = useState("");

  // filter
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
    setBusinessUnitId(null);
  };

  // for view Modal
  const handleViewClose = () => {
    setViewModal(false);
    setBusinessUnitId(null);
  };

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const saveHandler = (values) => {};

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Business-Unit";
  }, []);
  const getData = () => {
    getControlPanelAllLanding({
      apiUrl: `/SaasMasterData/GetAllBusinessUnit?accountId=${orgId}`,
      setLoading,
      setter: setRowDto,
      setAllData,
    });
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 48) {
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
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading justify-content-end">
                    <ul className="d-flex flex-wrap">
                      {(values?.search || status) && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            styles={{
                              marginRight: "16px",
                            }}
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
                          label={"Business Unit"}
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
                            setOpen(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <>
                        <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
                          <AntTable
                            data={rowDto}
                            removePagination
                            columnsData={businesUnitDtoCol(
                              permission,
                              setOpen,
                              setImageFile,
                              setBusinessUnitId
                            )}
                            rowClassName="pointer"
                          />
                        </div>
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
              ) : (
                <NotPermittedPage />
              )}

              {/* View Form Modal */}
              <ViewFormComponent
                show={viewModal}
                title={"View Business Unit"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                orgId={orgId}
                buId={buId}
                setImageFile={setImageFile}
                businessUnitId={businessUnitId}
                setBusinessUnitId={setBusinessUnitId}
              />

              {/* addEdit form Modal */}
              <AddEditFormComponent
                isVisibleHeading
                propsObj={{
                  show: open,
                  title: businessUnitId
                    ? "Edit Business Unit"
                    : "Create Business Unit",
                  onHide: handleClose,
                  size: "lg",
                  backdrop: "static",
                  classes: "default-modal",
                  orgId,
                  buId,
                  setRowDto,
                  setAllData,
                  businessUnitId,
                  setBusinessUnitId,
                  imageFile,
                  setImageFile,
                  rowFileId,
                  setRowFileId,
                }}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default BusinessUnit;

// active & inactive filter
/*   const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Active") {
      modifyRowData = newRowData?.filter((item) => item?.isActive === true);
    } else {
      modifyRowData = newRowData?.filter((item) => item?.isActive === false);
    }
    setRowDto(modifyRowData);
  }; */

// ascending & descending
/*   const sortByFilter = (filterType) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a?.strBusinessUnit.toLowerCase() > b.strBusinessUnit.toLowerCase())
          return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b?.strBusinessUnit.toLowerCase() > a.strBusinessUnit.toLowerCase())
          return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  }; */

/* 
  <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>
                                <div
                                  className="sortable"
                                  onClick={() => {
                                    setViewOrder(
                                      viewOrder === "desc" ? "asc" : "desc"
                                    );
                                    sortByFilter(viewOrder);
                                  }}
                                >
                                  <span>Business Unit</span>
                                  <div>
                                    <SortingIcon
                                      viewOrder={viewOrder}
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
                                <div className="sortable">
                                  <span>Website</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Status</span>
                                  <span>
                                    <Select
                                      sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                          border: "none !important",
                                        },
                                        "& .MuiSelect-select": {
                                          paddingRight: "15px !important",
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
                                        statusTypeFilter(e.target.value?.label);
                                      }}
                                    >
                                      {statusDDL?.length > 0 &&
                                        statusDDL?.map((item, index) => {
                                          return (
                                            <MenuItem key={index} value={item}>
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
                            {rowDto?.map((item, index) => {
                              return (
                                <BusinessUnitTableItem
                                  key={index}
                                  propsObj={{
                                    item,
                                    handleOpen,
                                    handleClose,
                                    setOpen,
                                    setViewModal,
                                    orgId,
                                    buId,
                                    setLoading,
                                    imageFile,
                                    setImageFile,
                                    permission,
                                    setBusinessUnitId,
                                    getData,
                                  }}
                                  index={index}
                                />
                              );
                            })}
                          </tbody>
                        </table>

*/
