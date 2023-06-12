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

const initData = {
  search: "",
  allSelected: "",
};

const HolidayException = () => {
  const { buId, wgId, wgName } = useSelector(
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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    checkedHeaderList
  ) => {
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        isNotAssign: false,
        workplaceId: 0,
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
      console.log({ res });
      if (res?.data?.data) {
        setLandingLoading(true);

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

        setLandingLoading(false);
      }
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
    checkedHeaderList = { ...initHeaderList }
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
      checkedHeaderList
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
  }, [wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 43) {
      permission = item;
    }
  });
  console.log({ rowDto });
  console.log({ landingLoading });
  console.log({ checkedList });

  console.log("Rendered!!");

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
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "0px" }}
                  >
                    <div className="ml-2">
                      <h6 className="count">
                        {checkedList.length > 0 &&
                          `Total ${checkedList.length} employee${checkedList.length > 1 ? "s" : ""
                          } selected`}
                      </h6>
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
                                setFieldValue("search", "");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          {checkedList.length > 0 && (
                            <button
                              className="btn btn-green"
                              style={{ height: "30px" }}
                              onClick={(e) => {
                                if (!permission?.isCreate)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setIsMulti(true);
                                setSingleData(null);
                                setShow(true);
                              }}
                            >
                              Assign
                            </button>
                          )}
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
                                  checkedHeaderList
                                );
                              } else {
                                getData({ current: 1, pageSize: 25 }, "");
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
                                checkedHeaderList
                              );
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  {rowDto?.length > 0 ? (
                    <>
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
                  ) : (
                    !landingLoading && <NoResult />
                  )}
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
                      checkedList,
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
