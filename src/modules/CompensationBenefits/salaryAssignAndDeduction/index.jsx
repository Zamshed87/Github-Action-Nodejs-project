import { AddCircle, AddOutlined } from "@mui/icons-material";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import AvatarComponent from "../../../common/AvatarComponent";
import BtnActionMenu from "../../../common/BtnActionMenu";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import useDebounce from "../../../utility/customHooks/useDebounce";
import FilterModal from "./components/FilterModal";
import { getSalaryAdditionAndDeductionLanding } from "./helper";
import "./styles.css";
import DefaultInput from "../../../common/DefaultInput";

let date = new Date();
let initYear = date.getFullYear(); // 2022
let initMonth = date.getMonth() + 1; // 6
let modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

const initData = {
  searchString: "",
  fromMonth: `${initYear}-${modifyMonthResult}`,
  // master filter
  workplace: "",
  department: "",
  employee: "",
  attendenceDate: "",
  attendenceStatus: "",
  employmentType: "",
  monthYear: "",
};

const validationSchema = Yup.object({});

function SalaryAssignAndDeduction() {
  const debounce = useDebounce();
  const dispatch = useDispatch();
  const history = useHistory();
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const openFilter = Boolean(filterAnchorEl);

  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isFilter, setIsFilter] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  // master filter
  const [anchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const handleSearch = (values) => {
    getData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };

  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getData();
  };

  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  // page
  const [pageSize] = useState(15);
  const [pageNo] = useState(0);

  // useFormik hooks
  const {
    handleSubmit,
    resetForm,
    values,
    errors,
    touched,
    setFieldValue,
    dirty,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initData,
    },
    onSubmit: (values) => resetForm(initData),
  });

  const getData = () => {
    getSalaryAdditionAndDeductionLanding(
      "",
      orgId,
      buId,
      pageNo,
      pageSize,
      setRowDto,
      setLoading,
      "",
      setAllData,
      wgId
    );
  };

  useEffect(() => {
    getSalaryAdditionAndDeductionLanding(
      values?.fromMonth,
      orgId,
      buId,
      pageNo,
      pageSize,
      setRowDto,
      setLoading,
      "",
      setAllData,
      wgId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId, values]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30257) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.strWorkplace?.toLowerCase()) ||
          regex.test(item?.strWorkplaceGroup?.toLowerCase()) ||
          regex.test(item?.strBusinessUnit?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const allowanceAndDeductionColumn = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Employee Name",
        dataIndex: "strEmployeeName",
        render: (_, record) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={record?.strEmployeeName}
              />
              <span className="ml-2">{record?.strEmployeeName}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
        width: 300,
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sorter: true,
        filter: true,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sorter: true,
        filter: true,
      },
      {
        title: "Workplace",
        dataIndex: "strWorkplace",
        sorter: true,
        filter: true,
      },
      {
        title: "Workplace Group",
        dataIndex: "strWorkplaceGroup",
        sorter: true,
        filter: true,
      },
      {
        title: "Business Unit",
        dataIndex: "strBusinessUnit",
        sorter: true,
        filter: true,
      },
    ];
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="employeeProfile-form-main">
        <div className="employee-profile-main">
          {/* box-employee-profile  */}
          {employeeFeature?.isView ? (
            <div className="table-card">
              {/* header-employee-profile  */}
              <div className="table-card-heading">
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <div className="input-field-main">
                      {/* <label>From Month</label> */}
                      <DefaultInput
                        classes="input-sm month-picker"
                        value={values?.fromMonth}
                        name="fromMonth"
                        type="month"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("fromMonth", e.target.value);
                          getSalaryAdditionAndDeductionLanding(
                            e.target.value,
                            orgId,
                            buId,
                            pageNo,
                            pageSize,
                            setRowDto,
                            setLoading,
                            "",
                            setAllData,
                            wgId
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <ul className="d-flex flex-wrap">
                  <li>
                    <MasterFilter
                      inputWidth="250px"
                      width="250px"
                      isHiddenFilter
                      value={values?.searchString}
                      setValue={(value) => {
                        setFieldValue("searchString", value);
                        debounce(() => {
                          searchData(value, allData, setRowDto);
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("searchString", "");
                        getData();
                      }}
                      handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                    />
                  </li>
                  <li>
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Assign"
                      options={[
                        {
                          value: 1,
                          label: "Single Assign",
                          icon: (
                            <AddCircle
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (employeeFeature?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/employeeSalary/allowanceNDeduction/singleAssign/create",
                                { state: { isCreate: true } }
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                        {
                          value: 2,
                          label: "Bulk Assign",
                          icon: (
                            <PlaylistAddCircleIcon
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (employeeFeature?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssign/create",
                                { state: { isCreate: true } }
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>

              <FilterBadgeComponent
                propsObj={{
                  filterBages,
                  setFieldValue,
                  clearBadge,
                  values: filterValues,
                  resetForm,
                  initData,
                  clearFilter,
                }}
              />
              <div className="table-card-body">
                {rowDto?.length > 0 ? (
                  <div className="table-card-styled employee-table-card tableOne">
                    <AntTable
                      data={rowDto?.length > 0 ? rowDto : []}
                      // removePagination
                      columnsData={allowanceAndDeductionColumn(
                        page,
                        paginationSize
                      )}
                      rowClassName="pointer"
                      onRowClick={(item) => {
                        history.push(
                          "/compensationAndBenefits/employeeSalary/allowanceNDeduction/view",
                          {
                            state: {
                              isView: true,
                              empId: item?.intEmployeeBasicInfoId,
                              businessUnitId: item?.intBusinessUnitId,
                              workplaceGroupId: item?.intWorkplaceGroupId,
                            },
                          }
                        );
                      }}
                      setPage={setPage}
                      setPaginationSize={setPaginationSize}
                    />
                    {/* <table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setEmployeeOrder(
                                        employeeOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        employeeOrder,
                                        "strEmployeeName"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Employee</span>
                                    <SortingIcon viewOrder={employeeOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setDesignationOrder(
                                        designationOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        designationOrder,
                                        "strDesignation"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Designation</span>
                                    <SortingIcon viewOrder={designationOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setDepartmentOrder(
                                        departmentOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        departmentOrder,
                                        "strDepartment"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Department</span>
                                    <SortingIcon viewOrder={departmentOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setWorkplaceOrder(
                                        workplaceOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        workplaceOrder,
                                        "strWorkplace"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Workplace</span>
                                    <SortingIcon viewOrder={workplaceOrder} />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setworkplaceGroupOrder(
                                        workplaceGroupOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        workplaceGroupOrder,
                                        "strWorkplaceGroup"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Workplace Group</span>
                                    <SortingIcon
                                      viewOrder={workplaceGroupOrder}
                                    />
                                  </div>
                                </th>
                                <th>
                                  <div
                                    onClick={(e) => {
                                      setbusinessUnitOrder(
                                        businessUnitOrder === "desc"
                                          ? "asc"
                                          : "desc"
                                      );
                                      commonSortByFilter(
                                        businessUnitOrder,
                                        "strBusinessUnit"
                                      );
                                    }}
                                    className="sortable"
                                  >
                                    <span>Business Unit</span>
                                    <SortingIcon
                                      viewOrder={businessUnitOrder}
                                    />
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => {
                                return (
                                  <tr
                                    key={index}
                                    className="hasEvent"
                                    onClick={(e) =>
                                      history.push(
                                        "/compensationAndBenefits/employeeSalary/allowanceNDeduction/view",
                                        {
                                          state: {
                                            isView: true,
                                            empId: item?.intEmployeeBasicInfoId,
                                          },
                                        }
                                      )
                                    }
                                  >
                                    <td>
                                      <div className="pl-1">{index + 1}</div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="emp-avatar">
                                          <AvatarComponent
                                            classess=""
                                            letterCount={1}
                                            label={item?.strEmployeeName}
                                          />
                                        </div>
                                        <div className="ml-2">
                                          <span className="tableBody-title">
                                            {item?.strEmployeeName}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {" "}
                                        {item?.strDesignation}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strDepartment}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strWorkplace}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strWorkplaceGroup}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.strBusinessUnit}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table> */}
                    {/* <div>
                            <PaginationHandlerUI
                              count={rowDto?.totalCount}
                              setPaginationHandler={setPaginationHandler}
                              pageNo={pageNo}
                              setPageNo={setPageNo}
                              pageSize={pageSize}
                              setPageSize={setPageSize}
                              isPaginatable={true}
                            />
                          </div> */}
                  </div>
                ) : (
                  <>
                    {!loading && (
                      <div className="col-12">
                        <NoResult title={"No Data Found"} para={""} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <NotPermittedPage />
          )}
        </div>
        <PopOverMasterFilter
          propsObj={{
            id,
            open: openFilter,
            anchorEl: filterAnchorEl,
            handleClose: () => setfilterAnchorEl(null),
            handleSearch,
            values: filterValues,
            dirty,
            initData,
            resetForm,
            clearFilter,
            sx: {},
            size: "lg",
          }}
        >
          <FilterModal
            propsObj={{
              getFilterValues,
              setFieldValue,
              values,
              errors,
              touched,
            }}
          />
        </PopOverMasterFilter>
      </form>
    </>
  );
}

export default SalaryAssignAndDeduction;
