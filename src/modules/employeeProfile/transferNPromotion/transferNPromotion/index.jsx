import {
  AddOutlined,
  Clear,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import DefaultInput from "../../../../common/DefaultInput";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  dateFormatterForInput,
  getDateOfYear,
} from "../../../../utility/dateFormatter";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getAllTransferAndPromotionLanding } from "../helper";
import TransferPromotionTable from "./components/transferPromotionTable";
import { releaseEmpTransferNPromotion } from "./helper";

const initialValues = {
  search: "",
  releaseDate: "",
  substituteEmployee: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
};

const validationSchema = Yup.object({});

export default function TransferAndPromotion() {
  const dispatch = useDispatch();
  const history = useHistory();
  const debounce = useDebounce();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [singleData, setSingleData] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [substituteEmployeeDDL, setSubstituteEmployeeDDL] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const { setValues } = useFormik({
  //   enableReinitialize: true,
  //   validationSchema,
  //   initialValues,
  //   onSubmit: () => {},
  // });

  const getData = (fromDate, toDate) => {
    getAllTransferAndPromotionLanding(
      orgId,
      buId,
      "all",
      setAllData,
      setRowDto,
      setLoading,
      fromDate ? fromDate : getDateOfYear("first"),
      toDate ? toDate : getDateOfYear("last"),
      wgId
    );
  };

  useEffect(() => {
    getData();
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "EmployeeId",
      "EmployeeName",
      setSubstituteEmployeeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const releaseHandler = (values) => {
    releaseEmpTransferNPromotion(
      values,
      singleData,
      orgId,
      employeeId,
      setLoading,
      () => {
        setSingleData({});
        setAnchorEl(null);
        getData();
      }
    );
  };

  //Search Filter
  const filterData = (keywords) => {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter(
      (item) =>
        regex.test(item?.strEmployeeName?.toLowerCase()) ||
        regex.test(item?.strTransferNpromotionType?.toLowerCase())
    );
    setRowDto(newDta);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 217) {
      permission = item;
    }
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(initData);
          // });
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            {loading && <Loading />}
            <div className="overtime-entry">
              {permission?.isView ? (
                <div>
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
                                  setIsFilter(false);
                                  setFieldValue("search", "");
                                  getData();
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              isHiddenFilter
                              inputWidth="200px"
                              width="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                debounce(() => {
                                  filterData(value);
                                }, 500);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData();
                              }}
                            // handleClick={(e) =>

                            // }
                            />
                          </li>
                          <li>
                            <PrimaryButton
                              type="button"
                              className="btn btn-default flex-center"
                              label={"Transfer/Promotion"}
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
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                history.push(
                                  "/profile/transferandpromotion/transferandpromotion/create"
                                );
                              }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body mt-2 pt-1">
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterFromDate}
                                placeholder=""
                                name="filterFromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "filterFromDate",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterToDate}
                                placeholder="Month"
                                name="filterToDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("filterToDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-1">
                            <button
                              disabled={
                                !values?.filterToDate || !values?.filterFromDate
                              }
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(
                                  values?.filterFromDate,
                                  values?.filterToDate
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="table-card-styled tableOne">
                        {rowDto?.length > 0 ? (
                          <table className="table table-bordered table-colored">
                            <thead>
                              <tr className="heading-row">
                                <th rowSpan="2" className="table-heading">
                                  <div>SL</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Employee</div>
                                </th>
                                <th
                                  className="table-heading text-center"
                                  colSpan="2"
                                >
                                  <div>From</div>
                                </th>
                                <th
                                  className="table-heading text-center"
                                  colSpan="2"
                                >
                                  <div>To</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Type</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Effective Date</div>
                                </th>
                                <th rowSpan="2" className="table-heading">
                                  <div>Status</div>
                                </th>
                              </tr>
                              <tr
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "400",
                                  color: "rgba(82, 82, 82, 1)",
                                }}
                              >
                                <td
                                  style={{
                                    backgroundColor: "rgba(247, 220, 92, 1)",
                                    width: "200px",
                                  }}
                                >
                                  <div>
                                    B.Unit, Workplace Group, Wing, Sole Depo,
                                    Region, Area, Territory
                                  </div>
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgba(247, 220, 92, 1)",
                                    width: "200px",
                                  }}
                                >
                                  Dept & Designation
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgba(129, 225, 255, 1)",
                                    width: "200px",
                                  }}
                                >
                                  <div>
                                    B.Unit, Workplace Group, Wing, Sole Depo,
                                    Region, Area, Territory
                                  </div>
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgba(129, 225, 255, 1)",
                                    width: "200px",
                                  }}
                                >
                                  Dept & Designation
                                </td>
                              </tr>
                            </thead>
                            <tbody
                              style={{ color: "var(--gray600)!important" }}
                            >
                              {rowDto?.map((item, index) => (
                                <tr
                                  style={{
                                    color: "var(--gray600)!important",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                  }}
                                  key={index}
                                  onClick={() => {
                                    history.push(
                                      `/profile/transferandpromotion/transferandpromotion/view/${item?.intTransferNpromotionId}`,
                                      {
                                        employeeId: item?.intEmployeeId,
                                        businessUnitId: item?.intBusinessUnitId,
                                        workplaceGroupId:
                                          item?.intWorkplaceGroupId,
                                        showButton:
                                          item?.strStatus !== "Pending"
                                            ? false
                                            : true,
                                      }
                                    );
                                  }}
                                >
                                  <TransferPromotionTable
                                    item={item}
                                    index={index}
                                    setSingleData={setSingleData}
                                    permission={permission}
                                    setAnchorEl={setAnchorEl}
                                  />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <NoResult />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </div>
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
                vertical: "bottom",
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
                      setSingleData({});

                      setFieldValue("releaseDate", "");
                      setFieldValue("substituteEmployee", "");
                    }}
                  >
                    <Clear sx={{ fontSize: "18px", color: gray900 }} />
                  </IconButton>
                </div>
                <hr />
                <div
                  className="body-employeeProfile-master-filter"
                  style={{ height: "200px" }}
                >
                  <div className="row content-input-field">
                    <div className="col-6">
                      <div className="input-field-main">
                        <label>Release Date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.releaseDate}
                          onChange={(e) => {
                            setFieldValue("releaseDate", e.target.value);
                          }}
                          min={dateFormatterForInput(
                            singleData?.dteEffectiveDate
                          )}
                          name="releaseDate"
                          type="date"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-field-main">
                        <label>Substitute Employee</label>
                        <FormikSelect
                          name="substituteEmployee"
                          placeholder=""
                          options={substituteEmployeeDDL || []}
                          value={values?.substituteEmployee}
                          onChange={(valueOption) => {
                            setFieldValue("substituteEmployee", valueOption);
                            // setValues((prev) => ({
                            //   ...prev,
                            //   substituteEmployee: valueOption,
                            // }));
                          }}
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.releaseDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="master-filter-bottom footer-employeeProfile-src-filter">
                  <div className="master-filter-btn-group">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        setSingleData({});
                        setFieldValue("releaseDate", "");
                        setFieldValue("substituteEmployee", "");
                      }}
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-green btn-green-disable"
                      disabled={
                        !values?.releaseDate && !values?.substituteEmployee
                      }
                      style={{ width: "auto" }}
                      onClick={() => {
                        releaseHandler(values);
                      }}
                    >
                      Release
                    </button>
                  </div>
                </div>
              </div>
            </Popover>
          </form>
        )}
      </Formik>
    </>
  );
}
