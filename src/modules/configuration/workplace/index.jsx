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
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import NoResult from "./../../../common/NoResult";
import ResetButton from "./../../../common/ResetButton";
import AddEditFormComponent from "./addEditForm/index";
import {
  adminWorkplaceDtoCol,
  filterData,
  getWorkplaceLanding,
} from "./helper";
import ViewFormComponent from "./viewForm/index";

const initData = {
  search: "",
  status: "",
};
const validationSchema = Yup.object({});

function Workplace() {
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [id, setId] = useState("");
  const saveHandler = (values) => {};

  //  Form modal hide show  func
  const [isFormModal, setIsFormModal] = useState(false);

  // Details modal Hide show func
  const [isDetailsModal, setIsDetailsModal] = useState(false);

  // for create Modal
  const handleOpen = () => {
    setIsDetailsModal(false);
    setIsFormModal(true);
  };

  const handleClose = () => {
    setIsDetailsModal(false);
    setIsFormModal(false);
    setId(null);
  };

  const handleViewClose = () => setIsDetailsModal(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getWorkplaceLanding(orgId, buId, wgId, setRowDto, setAllData, setLoading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 53) {
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
              <div className=" hr-position-main">
                {permission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading justify-content-end">
                      <div></div>
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
                            label={"Workplace"}
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
                              setIsFormModal(true);
                              setId("");
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
                              data={rowDto || []}
                              removePagination
                              columnsData={adminWorkplaceDtoCol(
                                permission,
                                setId,
                                setIsFormModal
                              )}
                              rowClassName="pointer"
                              onRowClick={(item) => {
                                if (!permission?.isEdit)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setIsDetailsModal(true);
                                setId(item?.intWorkplaceId);
                              }}
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
                  show={isDetailsModal}
                  title={"Workplace Details"}
                  onHide={handleViewClose}
                  size="lg"
                  backdrop="static"
                  classes="default-modal configure-modal"
                  handleOpen={handleOpen}
                  id={id}
                  orgId={orgId}
                  buId={buId}
                  singleData={singleData}
                  setSingleData={setSingleData}
                />

                {/* addEdit form Modal */}
                <AddEditFormComponent
                  show={isFormModal}
                  title={id ? "Edit Workplace" : "Create Workplace"}
                  onHide={handleClose}
                  size="lg"
                  backdrop="static"
                  classes="default-modal configure-modal"
                  id={id}
                  orgId={orgId}
                  buId={buId}
                  setRowDto={setRowDto}
                  setAllData={setAllData}
                  singleData={singleData}
                  setSingleData={setSingleData}
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default Workplace;

/* <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="tableBody-title"
                                  style={{ width: "30px" }}
                                >
                                  <div>SL</div>
                                </th>
                                <th>
                                  <div
                                    className=" d-flex sortable"
                                    onClick={() => {
                                      setViewOrder(
                                        viewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        viewOrder,
                                        "strWorkplace"
                                      );
                                    }}
                                  >
                                    <span>Workplace</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={viewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="d-flex sortable"
                                    onClick={() => {
                                      setPositionViewOrder(
                                        positionViewOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        positionViewOrder,
                                        "strWorkplaceCode"
                                      );
                                    }}
                                  >
                                    <span>Code</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={positionViewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="d-flex sortable"
                                    onClick={() => {
                                      setWgPositionViewOrder(
                                        wgViewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        wgViewOrder,
                                        "strWorkplaceGroup"
                                      );
                                    }}
                                  >
                                    <span>Workplace Group</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={wgViewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="d-flex sortable"
                                    onClick={() => {
                                      setBUViewOrder(
                                        BUViewOrder === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        BUViewOrder,
                                        "strBusinessUnit"
                                      );
                                    }}
                                  >
                                    <span>Business Unit</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={BUViewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th style={{ width: "120px" }}>
                                  <div className="">
                                    <div className="table-th d-flex align-items-center">
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
                              {rowDto.map((item, index) => {
                                return (
                                  <TableItem
                                    {...item}
                                    item={item}
                                    index={index}
                                    setIsFormModal={setIsFormModal}
                                    editId={id}
                                    setEditId={setId}
                                    setIsDetailsModal={setIsDetailsModal}
                                    permission={permission}
                                    key={index}
                                  />
                                );
                              })}
                            </tbody>
                          </table> */
