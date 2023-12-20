import { AddOutlined, Refresh } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSearchEmployeeList } from "../../../common/api";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import {
  createTaxAssign,
  getTaxAssignLanding,
  incomeTaxColumnData,
} from "./helper";
import ResetButton from "../../../common/ResetButton";
import { toast } from "react-toastify";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";

const initData = {
  search: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  employee: "",
  status: "",
};

// status DDL
// const statusDDL = [
//   { value: "Yes", label: "Yes" },
//   { value: "No", label: "No" },
// ];

export default function IncomeTaxAssign() {
  // hooks
  const dispatch = useDispatch();
  const debounce = useDebounce();
  const history = useHistory();

  // redux data
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const { handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: () => saveHandler(),
  });

  const saveHandler = () => {
    const callBack = () => {
      getTaxAssignLanding(
        buId,
        orgId,
        pages,
        values,
        wgId,
        wId,
        setRowDto,
        setPages,
        setLoading,
        ""
      );
    };
    const payload = rowDto.map((item) => {
      return {
        intTaxId: item?.intTaxId,
        intEmployeeId: item?.intEmployeeId,
        numTaxAmount: +item?.numTaxAmount,
        intCreatedBy: employeeId,
        intAccountId: item?.intAccountId,
        intBusinessUnitId: item?.intBusinessUnitId,
        intWorkplaceId: wId || 0,
        intWorkplaceGroupId: wgId || 0,
      };
    });
    createTaxAssign(payload, setLoading, callBack);
  };

  // Confirmed & not Confirmed filter
  // const statusTypeFilter = (statusType) => {
  //   const newRowData = [...allData];
  //   let modifyRowData = [];
  //   if (statusType === "Yes") {
  //     modifyRowData = newRowData?.filter(
  //       (item) => item?.isTakeHomePay === true
  //     );
  //   } else if (statusType === "No") {
  //     modifyRowData = newRowData?.filter(
  //       (item) => item?.isTakeHomePay === false || item?.isTakeHomePay === null
  //     );
  //   }
  //   setRowDto(modifyRowData);
  // };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Income Tax Assign";
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 126) {
      permission = item;
    }
  });

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getTaxAssignLanding(
      buId,
      orgId,
      {
        current: newPage,
        pageSize: paginationSize,
        total: pages?.total,
      },
      values,
      wgId,
      wId,
      setRowDto,
      setPages,
      setLoading,
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });

    getTaxAssignLanding(
      buId,
      orgId,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      values,
      wgId,
      wId,
      setRowDto,
      setPages,
      setLoading,
      searchText
    );
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        {console.log("values", values)}
        {permission?.isCreate ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div></div>
              <div className="table-card-head-right">
                <ul>
                  <li className="pr-2">
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label="Bulk Tax Assign"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      onClick={() => {
                        if (permission?.isCreate) {
                          history.push(
                            "/compensationAndBenefits/incometaxmgmt/taxassign/bulk"
                          );
                        } else {
                          toast.warn("You don't have permission");
                        }
                      }}
                    />
                  </li>
                  <li>
                    <PrimaryButton
                      className="btn btn-green btn-green-disable"
                      type="submit"
                      label="Save"
                      disabled={loading || !rowDto?.length}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-style with-form-card mt-3">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Select Employee</label>
                    {/* <FormikSelect
                      menuPosition="fixed"
                      name="employee"
                      options={employeeDDL || []}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        setRowDto([]);
                        setAllData([]);
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=""
                      touched={touched}
                    /> */}
                    <AsyncFormikSelect
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        setRowDto([]);
                        setAllData([]);
                      }}
                      placeholder="Search (min 3 letter)"
                      loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    />
                  </div>
                </div>
                <div className="col-lg-3 pb-3">
                  <div className="d-flex align-items-center">
                    <button
                      style={{ marginTop: "21px" }}
                      type="button"
                      className="btn btn-green btn-green-disable"
                      onClick={(e) => {
                        e.stopPropagation();
                        getTaxAssignLanding(
                          buId,
                          orgId,
                          {
                            current: 1,
                            pageSize: paginationSize,
                          },
                          values,
                          wgId,
                          wId,
                          setRowDto,
                          setPages,
                          setLoading
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* tax landing */}
            <div>
              <div className="table-card-heading" style={{ marginTop: "12px" }}>
                <div>
                  {/* {rowDto?.length > 0 && (
                    <> */}
                  <h6 className="count">Total {rowDto?.length} employees</h6>
                  {/* </>
                  )} */}
                </div>
                <ul className="d-flex flex-wrap">
                  {(isFilter || status) && (
                    <ResetButton
                      classes="btn-filter-reset"
                      title="Reset"
                      icon={<Refresh sx={{ marginRight: "10px" }} />}
                      onClick={() => {
                        getTaxAssignLanding(
                          buId,
                          orgId,
                          values,
                          wgId,
                          wId,
                          setRowDto,
                          setLoading,
                          setAllData
                        );
                        setRowDto(allData);
                        setFieldValue("search", "");
                        setIsFilter(false);
                        setStatus("");
                      }}
                      styles={{
                        height: "auto",
                        fontSize: "12px",
                        marginRight: "10px",
                        marginTop: "3px",
                        paddingTop: "0px",
                      }}
                    />
                  )}
                  {/* {values?.businessUnit?.value && ( */}
                  <li>
                    <MasterFilter
                      inputWidth="250px"
                      width="250px"
                      isHiddenFilter
                      value={values?.search}
                      setValue={(value) => {
                        setFieldValue("search", value);
                        debounce(() => {
                          getTaxAssignLanding(
                            buId,
                            orgId,
                            {
                              current: 1,
                              pageSize: pages?.pageSize,
                            },
                            values,
                            wgId,
                            wId,
                            setRowDto,
                            setPages,
                            setLoading,
                            value
                          );
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                        getTaxAssignLanding(
                          buId,
                          orgId,
                          pages,
                          values,
                          wgId,
                          wId,
                          setRowDto,
                          setPages,
                          setLoading,
                          ""
                        );
                      }}
                    />
                  </li>
                  {/* )} */}
                </ul>
              </div>
              <div className="row">
                <div className="col-12">
                  {rowDto?.length > 0 ? (
                    <>
                      <PeopleDeskTable
                        columnData={incomeTaxColumnData(
                          pages?.current,
                          pages?.pageSize,
                          rowDtoHandler,
                          errors,
                          touched
                        )}
                        pages={pages}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(e, newPage, values?.search)
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(e, values?.search)
                        }
                        uniqueKey="employeeCode"
                      />
                      {/* <div className="table-card-body">
                        <div className="table-card-styled tableOne">
                          <table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>
                                  <div>SL</div>
                                </th>
                                <th>
                                  <div>Employee Code</div>
                                </th>
                                <th>
                                  <div>Employee Name</div>
                                </th>
                                <th>
                                  <div>Designation</div>
                                </th>
                                <th>
                                  <div>Department</div>
                                </th>
                                <th>
                                  <div className="d-flex align-items-center justify-content-center">
                                    Take-Home Pay
                                    <span>
                                      <Select
                                        sx={{
                                          "& .MuiOutlinedInput-notchedOutline":
                                          {
                                            border: "none !important",
                                          },
                                          "& .MuiSelect-select": {
                                            paddingRight: "22px !important",
                                          },
                                        }}
                                        className="selectBtn"
                                        name="status"
                                        IconComponent={ArrowDropDown}
                                        value={values?.status}
                                        onChange={(e) => {
                                          setFieldValue("status", "");
                                          setStatus(e.target.value?.label);
                                          setIsFilter(true);
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
                                  <div className="text-right">Gross Salary</div>
                                </th>
                                <th>
                                  <div
                                    className="text-right"
                                    style={{ width: "140px" }}
                                  >
                                    Tax Amount
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>
                                      <div>
                                        <span className="tableBody-title">
                                          {item?.employeeCode}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <span className="tableBody-title">
                                          {item?.employeeName}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <span className="tableBody-title">
                                          {item?.strDesignation}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <span className="tableBody-title">
                                          {item?.strDepartment}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title text-center">
                                        {item?.isTakeHomePay ? "Yes" : "No"}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title text-right">
                                        {formatMoney(item?.numGrossSalary)}
                                      </div>
                                    </td>
                                    <td className="tableBody-title text-right">
                                      <div
                                        className="input-field-main pl-2"
                                        style={{ height: "25px" }}
                                      >
                                        <input
                                          style={{
                                            height: "25px",
                                            width: "140px",
                                            fontSize: "12px",
                                          }}
                                          className="form-control text-right"
                                          value={item?.numTaxAmount}
                                          name={item?.numTaxAmount}
                                          placeholder=" "
                                          type="number"
                                          onChange={(e) => {
                                            rowDtoHandler(
                                              "numTaxAmount",
                                              index,
                                              e.target.value
                                            );
                                          }}
                                          required
                                          errors={errors}
                                          touched={touched}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </>
                  ) : (
                    <>
                      {!loading && <NoResult title="No Data Found" para="" />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
