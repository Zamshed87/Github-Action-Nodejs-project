/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  AddOutlined,
  EditOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import { getPeopleDeskAllDDL } from "../../../common/api";
import Chips from "../../../common/Chips";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { customStyles } from "../../../utility/selectCustomStyle";
import Loading from "./../../../common/loading/Loading";
import NoResult from "./../../../common/NoResult";
import PrimaryButton from "./../../../common/PrimaryButton";
import ResetButton from "./../../../common/ResetButton";
import AddEditFormComponent from "./addEditForm/index";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";

// status DDL
const statusDDL = [
  { value: "Active", label: "Active" },
  { value: "InActive", label: "Inactive" },
];

const initialValues = {
  search: "",
  status: "",
  bank: "",
};

const validationSchema = Yup.object({});

function BankBranch() {
  const debounce = useDebounce();
  const [loading, setLoading] = useState(false);
  const [rowDto, getData, getLoading, setRowDto] = useAxiosGet();
  const [allData, setAllData] = useState([]);
  const [landing, setLanding] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [id, setId] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // page
  const [pageSize, setPageSize] = useState(15);
  const [pageNo, setPageNo] = useState(0);
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

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}`,
      "BankID",
      "BankName",
      setBankDDL
    );
  }, []);

  const { setFieldValue, setValues, values, errors, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema,
      initialValues,
      onSubmit: () => { },
    });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLandingData = (search) => {
    const searchText = search ? `&search=${search}` : "";
    getData(
      `/SaasMasterData/BankBranchLanding?bankId=${values?.bank?.value || 0
      }&bankBranchId=0&accountId=${orgId}${searchText}
      `,
      (data) => {
        const modifiedData = data?.data?.map((item, index) => {
          return {
            ...item,
            finalStatus: item?.isActive ? "Active" : "Inactive",
            initialSerialNumber: index + 1,
          };
        });
        setLanding(modifiedData);
        setRowDto({ ...data, data: modifiedData });
        setAllData({ ...data, data: modifiedData });
      }
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 196) {
      permission = item;
    }
  });

  //   const handleChangePage = (_, newPage, searchText, values) => {
  //     setPages((prev) => {
  //       return { ...prev, current: newPage };
  //     });

  // //     getData(
  // //       `/SaasMasterData/BankBranchLanding?bankId=${
  // //         values?.bank?.value || 0
  // //       }&bankBranchId=0&accountId=${orgId}&pageNo=${newPage}&pageSize=${
  // //         pages?.pageSize
  // //       }${searchText}
  // // `,
  // //       (data) => {
  // //         const modifiedData = data?.data?.map((item) => {
  // //           return {
  // //             ...item,
  // //             finalStatus: item?.isActive ? "Active" : "Inactive",
  // //           };
  // //         });
  // //         setLanding(modifiedData);

  // //         setRowDto({ ...data, data: modifiedData });
  // //         setAllData({ ...data, data: modifiedData });
  // //       }
  // //     );

  //   };

  //   const handleChangeRowsPerPage = (event, searchText, values) => {
  //     setPages((prev) => {
  //       return { current: 1, total: pages?.total, pageSize: +event.target.value };
  //     });

  //     getData(
  //       `/SaasMasterData/BankBranchLanding?bankId=${
  //         values?.bank?.value || 0
  //       }&bankBranchId=0&accountId=${orgId}&pageNo=${1}&pageSize=${+event.target
  //         .value}${searchText}
  // `,
  //       (data) => {
  //         const modifiedData = data?.data?.map((item) => {
  //           return {
  //             ...item,
  //             finalStatus: item?.isActive ? "Active" : "Inactive",
  //           };
  //         });
  //         setLanding(modifiedData);

  //         setRowDto({ ...data, data: modifiedData });
  //         setAllData({ ...data, data: modifiedData });
  //       }
  //     );

  //   };

  const bankColumns = () => {
    return [
      {
        title: "SL",
        dataIndex: "sl",
        render: (_, index) => index + 1,
        sort: false,
        // filter: false,
        className: "text-center",
      },
      {
        title: "Bank Name",
        dataIndex: "strBankName",
        sort: true,
        // filter: true,
        fieldType: "string",
        width: 300,
      },
      {
        title: "Bank Code",
        dataIndex: "strBankCode",
        sort: true,
        // filter: true,
        fieldType: "string",
      },
      {
        title: "Branch Name",
        dataIndex: "strBankBranchName",
        sort: true,
        // filter: true,
        fieldType: "string",
      },
      {
        title: "Branch Code",
        dataIndex: "strBankBranchCode",
        sort: true,
        // filter: true,
        fieldType: "string",
      },
      {
        title: "District",
        dataIndex: "strDistrict",
        fieldType: "string",
      },
      {
        title: "Bank Address",
        dataIndex: "strBankBranchAddress",
        sort: true,
        // filter: true,
        fieldType: "string",
      },
      {
        title: "Routing No",
        dataIndex: "strRoutingNo",
        isDate: true,
        fieldType: "string",
      },
      {
        title: "Status",
        dataIndex: "finalStatus",
        key: "finalStatus",
        sort: true,
        // filter: true,
        render: (record) => (
          <Chips
            label={record?.finalStatus}
            classess={record?.isActive ? "success" : "danger"}
          />
        ),
      },
      {
        className: "text-center",
        dataIndex: "",
        render: (record) => (
          <div className="d-flex justify-content-center">
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    setOpen(true);
                    setId(record?.intBankBranchId);
                  }}
                />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ];
  };

  return (
    <>
      {(loading || getLoading) && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div className="table-card businessUnit-wrapper">
            <div className="table-card-heading">
              <div style={{ width: "200px" }}>
                {/* <FormikSelect
                  name="bank"
                  options={bankDDL}
                  value={values?.bank}
                  onChange={(valueOption) => {
                    setValues((prev) => ({
                      ...prev,
                      bank: valueOption,
                    }));
                    getData(
                      `/SaasMasterData/BankBranchLanding?bankId=${
                        valueOption?.value || 0
                      }&bankBranchId=0&accountId=${orgId}&pageNo=${pageNo}&pageSize=${pageSize}${
                        values?.search
                      }
                      `,
                      (data) => {
                        setAllData(data);
                      }
                    );
                  }}
                  placeholder="Select Bank"
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                /> */}
              </div>
              <ul className="d-flex flex-wrap justify-content-center align-items-center">
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
                        getLandingData();
                        setFieldValue("search", "");
                        setStatus("");
                      }}
                    />
                  </li>
                )}
                <li style={{ marginRight: "24px" }}>
                  <DefaultInput
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
                      debounce(() => {
                        getLandingData(e.target.value);
                      }, 500);
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
                    label={"Bank Branch"}
                    icon={
                      <AddOutlined
                        sx={{
                          marginRight: "0px",
                          fontSize: "15px",
                        }}
                      />
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permission?.isCreate)
                        return toast.warn("You don't have permission");
                      setOpen(true);
                    }}
                  />
                </li>
              </ul>
            </div>
            {/* table body */}
            <div className="table-card-body">
              <div className="card-style mb-2" style={{ marginTop: "13px" }}>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Select Bank</label>
                      <FormikSelect
                        name="bank"
                        options={bankDDL}
                        value={values?.bank}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            bank: valueOption,
                          }));
                        }}
                        placeholder="Select Bank"
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  <div className="col-lg-1">
                    <button
                      disabled={!values?.bank}
                      style={{ marginTop: "23px" }}
                      className="btn btn-green"
                      onClick={() => {
                        getData(
                          `/SaasMasterData/BankBranchLanding?bankId=${values?.bank?.value || 0
                          }&bankBranchId=0&accountId=${orgId}&pageNo=${pages?.current
                          }&pageSize=${pages?.pageSize}${values?.search}
                    `,
                          (data) => {
                            const modifiedData = data?.data?.map((item) => {
                              return {
                                ...item,
                                finalStatus: item?.isActive
                                  ? "Active"
                                  : "Inactive",
                              };
                            });
                            setLanding(modifiedData);

                            setRowDto({ ...data, data: modifiedData });
                            setAllData({ ...data, data: modifiedData });
                          }
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div className="table-card-styled tableOne">
                {landing?.length > 0 ? (
                  <>
                    <PeopleDeskTable
                      columnData={bankColumns()}
                      rowDto={landing || []}
                      setRowDto={setLanding}
                      pages={pages}
                      uniqueKey="intBankBranchId"
                      isPagination={false}
                    />
                    {/* <AntTable
                      data={rowDto?.data?.length > 0 ? rowDto?.data : []}
                      // removePagination
                      columnsData={bankColumns()}
                    /> */}
                    {/* <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>
                            <div>SL</div>
                          </th>
                          <th>
                            <div
                              className="sortable"
                              onClick={() => {
                                setViewOrder(
                                  viewOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  viewOrder,
                                  "strBankBranchName"
                                );
                              }}
                            >
                              <span>Bank Name</span>
                              <div>
                                <SortingIcon
                                  viewOrder={viewOrder}
                                ></SortingIcon>
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="table-th">Branch Name</div>
                          </th>
                          <th>
                            <div className="table-th">District</div>
                          </th>
                          <th>
                            <div className="table-th">Branch Address</div>
                          </th>
                          <th>
                            <div className="table-th">Routing Number</div>
                          </th>
                          <th>
                            <div className="table-th d-flex align-items-center">
                              Status
                              <span>
                                <Select
                                  sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
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
                        {rowDto?.data.map((item, index) => {
                          return (
                            <BankBranchTableItem
                              {...item}
                              handleOpen={handleOpen}
                              handleClose={handleClose}
                              setOpen={setOpen}
                              item={item}
                              orgId={orgId}
                              buId={buId}
                              setLoading={setLoading}
                              permission={permission}
                              index={index}
                              key={index}
                              setId={setId}
                            />
                          );
                        })}
                      </tbody>
                    </table> */}
                  </>
                ) : (
                  <>
                    {!loading && <NoResult title="No Result Found" para="" />}
                  </>
                )}
              </div>
            </div>
            {/* {rowDto?.data?.length > 0 && (
              <PaginationHandlerUI
                count={rowDto?.totalCount}
                setPaginationHandler={setPaginationHandler}
                pageNo={pageNo}
                setPageNo={setPageNo}
                pageSize={pageSize}
                setPageSize={setPageSize}
                isPaginatable={true}
                values={values}
              />
            )} */}
          </div>
        ) : (
          <NotPermittedPage />
        )}

        {/* addEdit form Modal */}
        <AddEditFormComponent
          show={open}
          title={id ? "Edit Bank Branch" : "Create Bank Branch"}
          onHide={handleClose}
          size="lg"
          backdrop="static"
          classes="default-modal"
          orgId={orgId}
          buId={buId}
          setRowDto={setRowDto}
          setAllData={setAllData}
          getLandingData={getLandingData}
          id={id}
          setId={setId}
        />
      </form>
    </>
  );
}

export default BankBranch;
