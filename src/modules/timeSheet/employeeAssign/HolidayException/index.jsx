import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { paginationSize } from "../../../../common/AntTable";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import ViewModal from "../../../../common/ViewModal";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import HolidayExceptionModal from "./components/HolidayExceptionModal";
import { columns } from "./helper";
import "./holidayException.css";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";

const initData = {
  search: "",
  allSelected: "",
  salaryStatus: "",
};

const statusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Assigned" },
  { value: 2, label: "Not Assigned" },
];

const HolidayException = () => {
  const { buId, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  //Assign Holiday & Exception Modal
  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [isMulti, setIsMulti] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [holidayExceptionDto, setHolidayExceptionDto] = useState([]);
  // const [checked, setChecked] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const initHeaderList = {
    designationList: [],
    departmentList: [],
    supervisorNameList: [],
    wingNameList: [],
    soleDepoNameList: [],
    regionNameList: [],
    areaNameList: [],
    territoryNameList: [],
  };
  const [landingLoading, setLandingLoading] = useState(false);

  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [checkedList, setCheckedList] = useState([]);
  const [empIDString, setEmpIDString] = useState("");
  const [isAssignAll, setIsAssignAll] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Holiday Assign";
  }, []);

  // const [
  //   resHolidayLanding,
  //   getHolidayLanding,
  //   loadingLanding,
  //   setHolidayLanding,
  // ] = useAxiosPost();

  // const isAlreadyPresent = (obj) => {
  //   for (let i = 0; i < checked.length; i++) {
  //     if (checked[i].EmployeeCode === obj.EmployeeCode) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // };

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    checkedList,
    currentFilterSelection,
    checkedHeaderList,
    isAssigned
  ) => {
    setLandingLoading(true);
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        isNotAssign: isAssigned === 1 ? false : isAssigned === 2 ? true : null,
        workplaceId: wId || 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(`/Employee/HolidayNExceptionFilter`, {
        ...payload,
        ...modifiedPayload,
      });
      if (res?.data?.data) {
        setEmpIDString(res?.data?.employeeList);
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "holidayAssignHeader",
          headerList,
          setHeaderList,
          response: res?.data,
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          // setEmpLanding,
          setPages,
        });

        const modifiedData = res?.data?.data?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
          isSelected: checkedList?.find(
            ({ employeeCode }) => item?.employeeCode === employeeCode
          )
            ? true
            : false,
        }));

        setRowDto(modifiedData);
      } else {
        setRowDto([]);
      }
      setLandingLoading(false);
    } catch (error) {
      setLandingLoading(false);
    }
  };
  const getData = async (
    pagination,
    searchText = "",
    checkedList = [],
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList },
    isAssigned = null
  ) => {
    setLandingLoading(true);
    const modifiedPayload = createPayloadStructure({
      initHeaderList,
      currentFilterSelection,
      checkedHeaderList,
      filterOrderList,
    });

    getDataApiCall(
      modifiedPayload,
      pagination,
      searchText,
      checkedList,
      currentFilterSelection,
      checkedHeaderList,
      isAssigned
    );
  };
  // const getData = (pagination, srcText, status = "") => {
  //   const payload = {
  //     departmentId: 0,
  //     designationId: 0,
  //     supervisorId: 0,
  //     employmentTypeId: 0,
  //     employeeId: 0,
  //     workplaceGroupId: wgId,
  //     accountId: orgId,
  //     businessUnitId: buId,
  //     isNotAssign: false,
  //     pageNo: pagination?.current,
  //     pageSize: pagination?.pageSize,
  //     searchText: srcText || "",
  //   };
  //   getHolidayLanding(`/Employee/HolidayNExceptionFilter`, payload, (res) => {
  //     setPages({
  //       ...pages,
  //       current: pagination.current,
  //       pageSize: pagination.pageSize,
  //       total: res?.[0]?.totalCount,
  //     });

  //     const newData = res.map((item) => ({
  //       ...item,
  //       selectCheckbox:
  //         status !== "saved" &&
  //         checked.length > 0 &&
  //         isAlreadyPresent(item) >= 0,
  //     }));

  //     setHolidayLanding(newData);
  //   });
  // };

  // const handleTableChange = ({ pagination, newRowDto }) => {
  //   if (newRowDto?.action === "filter") {
  //     return;
  //   }
  //   if (
  //     pages?.current === pagination?.current &&
  //     pages?.pageSize !== pagination?.pageSize
  //   ) {
  //     return getData(pagination, "");
  //   }
  //   if (pages?.current !== pagination?.current) {
  //     return getData(pagination, "");
  //   }
  // };

  useEffect(() => {
    getData(pages);
    // setChecked([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId, wId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 43) {
      permission = item;
    }
  });
  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText,
      checkedList,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText,
      checkedList,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
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
            <Form onSubmit={handleSubmit}>
              {landingLoading && <Loading />}
              {permission?.isView ? (
                <div className="table-card holiday-exception">
                  <>
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "0px" }}
                    >
                      <div style={{ paddingLeft: "6px" }}>
                        {checkedList.length > 0 ? (
                          <h6 className="count">
                            Total {checkedList.length}{" "}
                            {`employee${checkedList.length > 1 ? "s" : ""}`}{" "}
                            selected from {pages?.total}
                          </h6>
                        ) : (
                          <h6 className="count">
                            {" "}
                            Total {rowDto?.length > 0 ? pages.total : 0}{" "}
                            Employees
                          </h6>
                        )}
                      </div>

                      <div className="table-card-head-right">
                        <ul>
                          {checkedList.length > 0 && (
                            <li>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{
                                      marginRight: "10px",
                                      fontSize: "18px",
                                    }}
                                  />
                                }
                                onClick={() => {
                                  // setChecked([]);
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    "",
                                    [],
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList
                                  );
                                  setCheckedList([]);
                                  setFieldValue("search", "");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            {checkedList?.length > 0 && (
                              <button
                                className="btn btn-green"
                                style={{
                                  marginRight: "10px",
                                  height: "30px",
                                  minWidth: "120px",
                                }}
                                onClick={(e) => {
                                  if (!permission?.isCreate)
                                    return toast.warn(
                                      "You don't have permission"
                                    );
                                  setIsMulti(true);
                                  setSingleData(null);
                                  setShow(true);
                                  setIsAssignAll(false);
                                }}
                              >
                                Assign {checkedList.length}
                              </button>
                            )}
                          </li>
                          <li>
                            {rowDto?.length > 0 && (
                              <button
                                className="btn btn-green"
                                style={{
                                  marginRight: "10px",
                                  height: "30px",
                                  minWidth: "120px",
                                  fontSize: "12px",
                                }}
                                onClick={(e) => {
                                  if (!permission?.isCreate)
                                    return toast.warn(
                                      "You don't have permission"
                                    );
                                  setIsAssignAll(true);
                                  setShow(true);
                                }}
                              >
                                Assign {pages.total}
                              </button>
                            )}
                          </li>
                          <li className="mr-3" style={{ width: "150px" }}>
                            <FormikSelect
                              name="salaryStatus"
                              options={statusDDL}
                              value={values?.salaryStatus}
                              onChange={(valueOption) => {
                                setFieldValue("salaryStatus", valueOption);
                                setFieldValue("search", "");
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "",
                                  checkedList,
                                  -1,
                                  filterOrderList,
                                  checkedHeaderList,
                                  valueOption?.value
                                );
                              }}
                              styles={customStyles}
                              isClearable={false}
                            />
                          </li>
                          <li>
                            <MasterFilter
                              isHiddenFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                if (value) {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    value,
                                    checkedList,
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList,
                                    values?.salaryStatus?.value
                                  );
                                } else {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    "",
                                    [],
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList,
                                    values?.salaryStatus?.value
                                  );
                                }
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "",
                                  checkedList,
                                  -1,
                                  filterOrderList,
                                  checkedHeaderList,
                                  0
                                );
                              }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    {rowDto?.length > 0 ? (
                      <PeopleDeskTable
                        columnData={columns(
                          pages?.current,
                          pages?.pageSize,
                          headerList,
                          wgName,
                          setShow,
                          setIsEdit,
                          setSingleData,
                          singleData,
                          permission,
                          setIsMulti
                        )}
                        pages={pages}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        checkedList={checkedList}
                        setCheckedList={setCheckedList}
                        checkedHeaderList={checkedHeaderList}
                        setCheckedHeaderList={setCheckedHeaderList}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(e, newPage, values?.search)
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(e, values?.search)
                        }
                        filterOrderList={filterOrderList}
                        setFilterOrderList={setFilterOrderList}
                        uniqueKey="employeeId"
                        getFilteredData={(
                          currentFilterSelection,
                          updatedFilterData,
                          updatedCheckedHeaderData
                        ) => {
                          getData(
                            {
                              current: 1,
                              pageSize: paginationSize,
                              total: 0,
                            },
                            "",
                            [],
                            currentFilterSelection,
                            updatedFilterData,
                            updatedCheckedHeaderData
                          );
                        }}
                        isCheckBox={true}
                        isScrollAble={false}
                      />
                    ) : (
                      !landingLoading && <NoResult />
                    )}
                    {/* <AntTable
                data={resHolidayLanding}
                columnsData={columns()}
                onRowClick={(dataRow) => {}}
                pages={pages?.pageSize}
                pagination={pages}
                handleTableChange={handleTableChange}
                rowKey={(record) => record?.EmployeeCode}
              /> */}
                  </>

                  {/* <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      
                    </div>
                    <div>
                      <CardTable
                        objProps={{
                          setFieldValue,
                          holidayExceptionDto,
                          values,
                          setHolidayExceptionDto,
                          setShow,
                          setSingleData,
                          singleData,
                          setIsMulti,
                          setIsEdit,
                          permission,
                          rowDto,
                          setRowDto,
                          checked,
                          setChecked,
                          isAlreadyPresent,
                          pages,
                          // handleTableChange,
                          landingLoading,
                          setPages,
                          getData,
                          wgName,
                          initHeaderList,
                          filterOrderList,
                          setFilterOrderList,
                          initialHeaderListData,
                          setInitialHeaderListData,
                          headerList,
                          setHeaderList,
                          checkedHeaderList,
                          setCheckedHeaderList,
                          checkedList,
                          setCheckedList,
                        }}
                      />
                    </div>
                  </div> */}
                </div>
              ) : (
                <NotPermittedPage />
              )}
              <ViewModal
                size="lg"
                title="Assign Holiday"
                backdrop="static"
                classes="default-modal preview-modal"
                show={show}
                setSingleData={setSingleData}
                onHide={() => {
                  setShow(false);
                  setSingleData([]);
                }}
              >
                <HolidayExceptionModal
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  setShow={setShow}
                  singleData={singleData}
                  setSingleData={setSingleData}
                  getData={() =>
                    getData(
                      { current: 1, pageSize: paginationSize },
                      "",
                      [],
                      -1,
                      filterOrderList,
                      checkedHeaderList
                    )
                  }
                  selectedDto={checkedList}
                  setSelectedDto={setCheckedList}
                  isMulti={isMulti}
                  setIsMulti={setIsMulti}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  isAssignAll={isAssignAll}
                  setIsAssignAll={setIsAssignAll}
                  empIDString={empIDString}
                  setCheckedList={setCheckedList}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default HolidayException;
