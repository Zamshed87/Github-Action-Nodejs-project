/* eslint-disable react-hooks/exhaustive-deps */
import { MenuItem } from "@material-ui/core";
import {
  AddOutlined,
  ArrowDropDown,
  ArrowDropUp,
  CreateOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Select } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import Chips from "../../../../common/Chips";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import SortingIcon from "../../../../common/SortingIcon";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import CreatePayrollElementsModal from "./components/CreatePayrollElementsModal";
import { filterData } from "./helper";
import "./payrollElements.css";

// status DDL
const statusDDL = [
  { value: "Active", label: "Active" },
  { value: "InActive", label: "Inactive" },
];

const initData = {
  search: "",
  status: "",
};

export default function PayrollElementsRules() {
  const [loading, setLoading] = useState(false);

  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");

  // filter
  const [viewOrder, setViewOrder] = useState("desc");
  const [status, setStatus] = useState("");

  // for create state
  const [open, setOpen] = useState(false);

  // for create Modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // single Data
  const [id, setId] = useState("");

  const saveHandler = (values) => { };

  useEffect(() => {
    getPeopleDeskAllLanding(
      "PayrollElementAndRules",
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
      modifyRowData = newRowData?.filter((item) => item?.IsActive === true);
    } else {
      modifyRowData = newRowData?.filter((item) => item?.IsActive === false);
    }
    setRowDto({ modifyRowData });
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
    setRowDto({ modifyRowData });
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 71) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, []);

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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {true || permission?.isView ? (
                <div className="col-md-12">
                  <div className="table-card">
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
                            label={"Payroll Elements"}
                            icon={<AddOutlined sx={{ fontSize: "15px" }} />}
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
                      <div className="payroll-elements-table">
                        <div className="table-card-styled">
                          {rowDto?.length > 0 ? (
                            <>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>
                                      <div
                                        className="sortable"
                                        onClick={() => {
                                          setViewOrder(
                                            viewOrder === "desc"
                                              ? "asc"
                                              : "desc"
                                          );
                                          commonSortByFilter(
                                            viewOrder,
                                            "PayrollElementName"
                                          );
                                        }}
                                      >
                                        <span>Elements</span>
                                        <div>
                                          <SortingIcon
                                            viewOrder={viewOrder}
                                          ></SortingIcon>
                                        </div>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="d-flex align-items-center">
                                        Type
                                      </div>
                                    </th>
                                    <th>
                                      <div className="d-flex align-items-center justify-content-center">
                                        Code
                                      </div>
                                    </th>
                                    <th>
                                      <div>
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
                                                  paddingRight:
                                                    "22px !important",
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
                                                setStatus(
                                                  e.target.value?.label
                                                );
                                                statusTypeFilter(
                                                  e.target.value?.label
                                                );
                                              }}
                                            >
                                              {statusDDL?.length > 0 &&
                                                statusDDL?.map(
                                                  (item, index) => {
                                                    return (
                                                      <MenuItem
                                                        key={index}
                                                        value={item}
                                                      >
                                                        {item?.label}
                                                      </MenuItem>
                                                    );
                                                  }
                                                )}
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
                                      <tr key={index}>
                                        <td>{item?.PayrollElementName}</td>
                                        <td>{item?.PayrollElementTypeName}</td>
                                        <td className="text-center">
                                          {item?.PayrollElementCode}
                                        </td>
                                        <td>
                                          <div>
                                            <div className="text-center">
                                              {item?.IsActive === true && (
                                                <Chips
                                                  label={"Active"}
                                                  classess="success p-2"
                                                  style={{
                                                    fontWeight: "500",
                                                    background: "#E4F8DD",
                                                  }}
                                                />
                                              )}
                                              {item?.IsActive === false && (
                                                <Chips
                                                  label={"Inactive"}
                                                  classess="danger p-2"
                                                  style={{
                                                    fontWeight: "500",
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex justify-content-center">
                                            <button
                                              type="button"
                                              className="iconButton"
                                              onClick={(e) => {
                                                if (!permission?.isEdit)
                                                  return toast.warn(
                                                    "You don't have permission"
                                                  );
                                                e.stopPropagation();
                                                setOpen(true);
                                                setId(item?.PayrollElementId);
                                              }}
                                            >
                                              <CreateOutlined />
                                            </button>
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
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* addEdit Form */}
              <ViewModal
                classes="default-modal preview-modal"
                show={open}
                title={id ? "Edit Payroll Elements" : "Create Payroll Elements"}
                size="lg"
                backdrop="static"
                handleOpen={handleOpen}
                onHide={handleClose}
              >
                <CreatePayrollElementsModal
                  show={open}
                  id={id}
                  orgId={orgId}
                  buId={buId}
                  wgId={wgId}
                  employeeId={employeeId}
                  singleData={singleData}
                  setSingleData={setSingleData}
                  handleOpen={handleOpen}
                  onHide={handleClose}
                  setRowDto={setRowDto}
                  setAllData={setAllData}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
