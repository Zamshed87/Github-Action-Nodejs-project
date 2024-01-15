import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import NoResult from "../../../../common/NoResult";
import MasterFilter from "../../../../common/MasterFilter";
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import ResetButton from "../../../../common/ResetButton";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { paginationSize } from "../../../../common/AntTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import axios from "axios";
import { toast } from "react-toastify";
import {
  employeeIdCardLandingColumns,
} from "./helper";
import IConfirmModal from "../../../../common/IConfirmModal";
import { downloadFile } from "../../../../utility/downloadFile";

const EmployeeIdCardLanding = () => {
  const {
    permissionList,
    profileData: { buId, wgName, wgId, wId },
  } = useSelector((state) => state?.auth, shallowEqual);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const initHeaderList = {
    departmentList: [],
    designationList: [],
    supervisorList: [],
    linemanagerList: [],
    employmentTypeList: [],
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

  const { values, setFieldValue } = useFormik({
    initialValues: {},
    onSubmit: (values) => {
    },
  });

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    checkedList,
    currentFilterSelection,
    checkedHeaderList,
    isAssigned = null
  ) => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
    };

    setLandingLoading(true);
    try {
      const res = await axios.post(`/Employee/EmployeeInfoLandingForIdPrint`, {
        ...payload,
        ...modifiedPayload,
      });
      if (res?.data?.data) {
        setLandingLoading(false);
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "employeeInfoHeader",
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

        setEmpIDString(res?.data?.employeeIdList);
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
    isAssigned
  ) => {
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

  let permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30350),
    [permissionList]
  );

  const downloadEmpIdCardZipFile = (isAll, singleEmpData) => {
    let payload = isAll ? empIDString : "";
    if (singleEmpData?.employeeId) {
      payload = singleEmpData?.employeeId + "";
    } else if (isAll) {
      payload = empIDString;
    } else {
      const modifyFilterRowDto = checkedList.filter((itm) => itm.isSelected === true);
      const empIdList = modifyFilterRowDto.map((data) => {
        return data?.employeeId;
      });
      payload = empIdList.join(",");
    }
    let confirmObject = {
      closeOnClickOutside: false,
      message: isAll
        ? `Download All Employees Card?`
        : `Download Selected Employees Card?`,
      yesAlertFunc: () => {
        downloadFile(
          `/PdfAndExcelReport/EmployeeIDCardPDF?EmployeeIds=${payload}`,
          "Employee ID Cards",
          "pdf",
          setIsLoading
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

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
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {(isLoading || landingLoading) && <Loading />}
      {permission?.isView && (
        <div className="table-card">
          <div className="table-card-heading pb-2">
            {checkedList.length > 0 ? (
              <h6 className="count">
                Employee ID Card [ {checkedList.length}{" "}
                {`employee${checkedList.length > 1 ? "s" : ""}`} selected from{" "}
                {pages?.total} ]
              </h6>
            ) : (
              <h6 className="count">
                Employee ID Card [ Total {rowDto?.length > 0 ? pages.total : 0}{" "}
                Employees ]
              </h6>
            )}

            <div className="table-card-head-right">
              <ul>
                {checkedList.length > 1 && (
                  <li>
                    <ResetButton
                      title="reset"
                      icon={
                        <SettingsBackupRestoreOutlined
                          sx={{ marginRight: "10px" }}
                        />
                      }
                      onClick={() => {
                        getData(
                          { current: 1, pageSize: paginationSize },
                          "",
                          [],
                          -1,
                          filterOrderList,
                          checkedHeaderList
                        );
                        // setRowDto(allData);
                        setCheckedList([]);
                        setFieldValue("searchString", "");
                      }}
                    />
                  </li>
                )}
                <li>
                  {rowDto?.length > 0 && (
                    <div className="d-flex">
                      <button
                        className="btn btn-green"
                        style={{
                          marginRight: "10px",
                          height: "30px",
                          minWidth: "120px",
                          fontSize: "12px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!permission?.isCreate)
                            return toast.warn("You don't have permission");
                          downloadEmpIdCardZipFile(true);
                        }}
                      >
                        Download {pages.total}
                      </button>
                      {rowDto?.filter((item) => item?.isSelected).length > 0 ? (
                        <button
                          className="btn btn-green"
                          style={{
                            height: "30px",
                            minWidth: "120px",
                            fontSize: "12px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            downloadEmpIdCardZipFile(false, {});
                          }}
                        >
                          Download {checkedList.length}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </li>
                <li>
                  <MasterFilter
                    isHiddenFilter
                    value={values?.searchString}
                    setValue={(value) => {
                      setFieldValue("searchString", value);
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
                      setFieldValue("searchString", "");
                      getData(
                        { current: 1, pageSize: paginationSize },
                        "",
                        [],
                        -1,
                        filterOrderList,
                        checkedHeaderList,
                        0
                      );
                    }}
                    handleClick={(event) => {
                      // setAnchorEl(event.currentTarget);
                    }}
                    width="200px"
                    inputWidth="200px"
                  />
                </li>
              </ul>
            </div>
          </div>

          {rowDto?.length > 0 ? (
            <PeopleDeskTable
              columnData={employeeIdCardLandingColumns(
                pages,
                permission,
                rowDto,
                setRowDto,
                checkedList,
                setCheckedList,
                headerList,
                wgName,
                downloadEmpIdCardZipFile
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
              uniqueKey="employeeCode"
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
              isScrollAble={true}
            />
          ) : (
            !landingLoading && <NoResult title="No Result Found" para="" />
          )}
        </div>
      )}
    </>
  );
};

export default EmployeeIdCardLanding;
