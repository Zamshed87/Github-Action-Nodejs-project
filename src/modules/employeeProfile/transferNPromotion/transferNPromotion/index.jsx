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
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  dateFormatter,
  dateFormatterForInput,
  getDateOfYear,
} from "../../../../utility/dateFormatter";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getAllTransferAndPromotionLanding } from "../helper";
import { releaseEmpTransferNPromotion } from "./helper";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { Avatar, DataTable } from "Components";
import { Tag } from "antd";
import { getSerial } from "Utils";
import NoResult from "common/NoResult";

const initialValues = {
  search: "",
  releaseDate: "",
  substituteEmployee: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
};

const validationSchema = Yup.object({});

export default function TransferAndPromotion() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const debounce = useDebounce();

  const [, processTransfer, loading2] = useAxiosGet();

  // redux
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 217) {
      permission = item;
    }
  });

  // state
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [substituteEmployeeDDL, setSubstituteEmployeeDDL] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // landing table
  const paginationSize = 25;
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (
    fromDate = getDateOfYear("first"),
    toDate = getDateOfYear("last"),
    srcStr = "",
    pagination = pages
  ) => {
    getAllTransferAndPromotionLanding(
      buId,
      wgId,
      "all",
      fromDate,
      toDate,
      setRowDto,
      setLoading,
      pagination.current,
      pagination.pageSize,
      setPages,
      srcStr,
      wId
    );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Transfer & Promotion";
  }, []);

  useEffect(() => {
    getData();
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "EmployeeId",
      "EmployeeName",
      setSubstituteEmployeeDDL
    );
  }, [buId, wgId, wId]);

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

  const transferNPromotionHeader = [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: pages?.current,
          pageSize: pages?.pageSize,
          index,
        }),
      fixed: "left",
      width: 20,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, rec) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        );
      },
      fixed: "left",
      width: 150,
    },
    {
      title: "From",
      children: [
        {
          title: "B.Unit, Workplace Group, Workplace",
          onHeaderCell: () => ({
            style: {
              backgroundColor: "rgba(247, 220, 92, 1)",
              padding: "0",
            },
          }),
          render: (_, rec) => {
            return {
              props: { style: { background: "rgba(254, 249, 223, 1)" } },
              children: (
                <div>
                  <div>{rec?.businessUnitNameFrom}</div>
                  <div>{rec?.workplaceGroupNameFrom}</div>
                  <div>{rec?.workplaceNameFrom}</div>
                </div>
              ),
            };
          },
          dataIndex: "collectionPrinciple",
          width: 100,
        },
        {
          title: "Dept, Section & Designation",
          onHeaderCell: () => ({
            style: {
              backgroundColor: "rgba(247, 220, 92, 1)",
              padding: "0",
            },
          }),
          render: (_, rec) => {
            return {
              props: { style: { background: "rgba(254, 249, 223, 1)" } },
              children: (
                <div>
                  <div>{rec?.departmentNameFrom}</div>
                  <div>{rec?.sectionNameFrom}</div>
                  <div>{rec?.designationNameFrom}</div>
                </div>
              ),
            };
          },
          dataIndex: "collectionInterest",
          width: 100,
        },
      ],
    },
    {
      title: "To",
      children: [
        {
          title: "B.Unit, Workplace Group, Workplace",
          onHeaderCell: () => ({
            style: {
              backgroundColor: "rgba(129, 225, 255, 1)",
              padding: "0",
            },
          }),
          render: (_, rec) => {
            return {
              props: { style: { background: "rgba(230, 246, 253, 1)" } },
              children: (
                <div>
                  <div>{rec?.businessUnitName}</div>
                  <div>{rec?.workplaceGroupName}</div>
                  <div>{rec?.workplaceName}</div>
                </div>
              ),
            };
          },
          dataIndex: "collectionPrinciple",
          width: 100,
        },
        {
          title: "Dept, Section & Designation",
          onHeaderCell: () => ({
            style: {
              backgroundColor: "rgba(129, 225, 255, 1)",
              padding: "0",
            },
          }),
          render: (_, rec) => {
            return {
              props: { style: { background: "rgba(230, 246, 253, 1)" } },
              children: (
                <div>
                  <div>{rec?.departmentName}</div>
                  <div>{rec?.sectionNameFrom}</div>
                  <div>{rec?.designationNameFrom}</div>
                </div>
              ),
            };
          },
          dataIndex: "collectionInterest",
          width: 100,
        },
      ],
    },
    {
      title: "Type",
      dataIndex: "strTransferNpromotionType",
      width: 50,
    },
    {
      title: "Effective Date",
      dataIndex: "dteEffectiveDate",
      render: (text) => dateFormatter(text),
      width: 50,
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, item) => (
        <div>
          {item?.strStatus === "Pending" && (
            <Tag style={{ borderRadius: "50px" }} color="gold">
              Pending
            </Tag>
          )}
          {item?.strStatus === "Rejected" && (
            <Tag style={{ borderRadius: "50px" }} color="red">
              Rejected
            </Tag>
          )}
          {item?.strStatus === "Released" && (
            <Tag style={{ borderRadius: "50px" }} color="purple">
              Released
            </Tag>
          )}
          {item?.strStatus === "Joined" && (
            <Tag style={{ borderRadius: "50px" }} color="blue">
              Joined
            </Tag>
          )}
          {item?.strStatus === "Approved" &&
            (item?.strTransferNpromotionType === "Promotion" ? (
              <Tag style={{ borderRadius: "50px" }} color="green">
                Approved
              </Tag>
            ) : (
              <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                className="btn btn-default"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setAnchorEl(e.currentTarget);
                  setSingleData(item);
                }}
              >
                Release
              </button>
            ))}
        </div>
      ),
      width: 50,
    },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            {(loading || loading2) && <Loading />}
            <div className="overtime-entry">
              {permission?.isView ? (
                <div>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div>
                        {pages?.total > 0 && (
                          <h6 className="count">
                            Total {pages?.total}{" "}
                            {`application${pages?.total > 1 ? "s" : ""}`}
                          </h6>
                        )}
                      </div>
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
                                  getAllTransferAndPromotionLanding(
                                    buId,
                                    wgId,
                                    "all",
                                    getDateOfYear("first"),
                                    getDateOfYear("last"),
                                    setRowDto,
                                    setLoading,
                                    1,
                                    paginationSize,
                                    setPages,
                                    "",
                                    wId
                                  );
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
                                  getAllTransferAndPromotionLanding(
                                    buId,
                                    wgId,
                                    "all",
                                    values?.filterFromDate || "",
                                    values?.filterToDate || "",
                                    setRowDto,
                                    setLoading,
                                    1,
                                    paginationSize,
                                    setPages,
                                    value || "",
                                    wId
                                  );
                                }, 500);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getAllTransferAndPromotionLanding(
                                  buId,
                                  wgId,
                                  "all",
                                  values?.filterFromDate || "",
                                  values?.filterToDate || "",
                                  setRowDto,
                                  setLoading,
                                  1,
                                  paginationSize,
                                  setPages,
                                  "",
                                  wId
                                );
                              }}
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
                              onClick={() => {
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
                          <li>
                            <button
                              style={{ minWidth: "150px" }}
                              className="btn-green"
                              onClick={() => {
                                processTransfer(
                                  `/Employee/promotionManualProcess`,
                                  (res) => {
                                    if (res?.statusCode === 200) {
                                      return toast.success(res?.message);
                                    } else {
                                      return toast.warning(
                                        "Something went wrong!!"
                                      );
                                    }
                                  }
                                );
                              }}
                            >
                              Process Manually
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="table-card-body">
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
                      {rowDto?.length > 0 ? (
                        <DataTable
                          bordered
                          data={rowDto?.length > 0 ? rowDto : []}
                          header={transferNPromotionHeader}
                          onChange={(pagination, filters, sorter, extra) => {
                            // Return if sort function is called
                            if (extra.action === "sort") return;
                            setPages({
                              current: pagination.current,
                              pageSize: pagination.pageSize,
                              total: pagination.total,
                            });
                            getData(
                              values?.filterFromDate,
                              values?.filterToDate,
                              values.search,
                              pagination
                            );
                          }}
                          onRow={(record) => ({
                            onClick: () => {
                              history.push(
                                `/profile/transferandpromotion/transferandpromotion/view/${record?.intTransferNpromotionId}`,
                                {
                                  employeeId: record?.intEmployeeId,
                                  businessUnitId: record?.intBusinessUnitId,
                                  workplaceGroupId: record?.intWorkplaceGroupId,
                                  showButton:
                                    record?.strStatus !== "Pending"
                                      ? false
                                      : true,
                                }
                              );
                            },
                            className: "pointer",
                          })}
                          pagination={{
                            pageSize: pages?.pageSize,
                            total: pages?.total,
                          }}
                        />
                      ) : (
                        <NoResult />
                      )}
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
                    <div className="col-6 d-none">
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
