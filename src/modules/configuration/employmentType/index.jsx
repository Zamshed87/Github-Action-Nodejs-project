import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import { getAllGlobalEmploymentType } from "../../../common/api";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import FormikInput from "./../../../common/FormikInput";
import Loading from "./../../../common/loading/Loading";
import NoResult from "./../../../common/NoResult";
import PrimaryButton from "./../../../common/PrimaryButton";
import ResetButton from "./../../../common/ResetButton";
import AddEditFormComponent from "./addEditForm/index";
import { adminEmpTypeDtoCol, filterData } from "./helper";
import ViewFormComponent from "./viewForm/index";

const initData = {
  string: "",
  status: "",
};

const validationSchema = Yup.object({});
const saveHandler = (values) => {};

function EmploymentTypeCreate() {
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [id, setId] = useState("");
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
  const handleViewClose = () => {
    setViewModal(false);
    setId("");
  };

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllGlobalEmploymentType(setRowDto, setAllData, setLoading, orgId);
  }, [orgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30294) {
      permission = item;
    }
  });

  // active & inactive filter
  // const statusTypeFilter = (statusType) => {
  //   const newRowData = [...allData];
  //   let modifyRowData = [];
  //   if (statusType === "Active") {
  //     modifyRowData = newRowData?.filter((item) => item?.isActive === true);
  //   } else {
  //     modifyRowData = newRowData?.filter((item) => item?.isActive === false);
  //   }
  //   setRowDto(modifyRowData);
  // };

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
                <div className="table-card">
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "12px" }}
                  >
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
                          label={"Employment Type"}
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
                          <div
                            className="table-card-styled employee-table-card tableOne table- 
                            responsive"
                          >
                            <AntTable
                              data={rowDto || []}
                              removePagination
                              columnsData={adminEmpTypeDtoCol(
                                permission,
                                setOpen,
                                setId
                              )}
                              rowClassName="pointer"
                              onRowClick={(item) => {
                                if (!permission?.isEdit)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setViewModal(true);
                                setId(item?.intEmploymentTypeId);
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
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* View Form Modal */}
              <ViewFormComponent
                show={viewModal}
                title={"Document Type Details"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                id={id}
                setId={setId}
                orgId={orgId}
                buId={buId}
                setLoading={setLoading}
                allData={allData}
                singleData={singleData}
                setSingleData={setSingleData}
              />

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={open}
                title={id ? "Edit Employment Type" : "Create Employment Type"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                id={id}
                setId={setId}
                orgId={orgId}
                buId={buId}
                allData={allData}
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

export default EmploymentTypeCreate;

// update table
/* 
<table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th>
                                  <div className="sortable">
                                    <span>Employment Type Name</span>
                                  </div>
                                </th>
                                <th style={{ width: "120px" }}>
                                  <div className="sortable">
                                    <span>Status</span>
                                    <span>
                                      <Select
                                        sx={{
                                          "& .MuiOutlinedInput-notchedOutline":
                                            {
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
                                <th style={{ width: "120px" }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <EmploymentTypeTable
                                  {...item}
                                  handleOpen={handleOpen}
                                  handleClose={handleClose}
                                  setOpen={setOpen}
                                  setViewModal={setViewModal}
                                  setId={setId}
                                  id={id}
                                  orgId={orgId}
                                  buId={buId}
                                  setLoading={setLoading}
                                  setSingleData={setSingleData}
                                  permission={permission}
                                  key={index}
                                  index={index}
                                />
                              ))}
                            </tbody>
                          </table>


*/
