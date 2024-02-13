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
  // master filter
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
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

  const initHeaderList = {
    designationList: [],
    departmentList: [],
    supervisorNameList: [],
    wingNameList: [],
    soleDepoNameList: [],
    regionNameList: [],
    areaNameList: [],
    territoryNameList: [],
    employmentTypeList: [],
    sectionList: [],
    hrPositionList: [],
  };

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
    setPages(() => {
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
