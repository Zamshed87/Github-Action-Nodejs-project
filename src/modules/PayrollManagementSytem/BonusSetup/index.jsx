import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import {
  SettingsBackupRestoreOutlined,
  EditOutlined,
  AddOutlined,
} from "@mui/icons-material";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getBonusSetupLanding } from "./helper";
import Loading from "../../../common/loading/Loading";
import ResetButton from "../../../common/ResetButton";
import PrimaryButton from "../../../common/PrimaryButton";
import Chips from "../../../common/Chips";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { createPayloadStructure } from "common/peopleDeskTable/helper";
import PeopleDeskTable from "common/peopleDeskTable";

export default function BonusSetupLanding() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const initData = {
    status: "",
  };

  const initHeaderList = {
    strBonusNameList: [],
    strWorkplaceList: [],
    strReligionNameList: [],
    strEmploymentTypeList: [],
    hrPositionNameList: [],
  };

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 72) {
      permission = item;
    }
  });

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const [status, setStatus] = useState("");
  const [headerList, setHeaderList] = useState({});
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Bonus Setup";
  }, [dispatch]);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });

  const getData = async (
    pagination,
    IsForXl = "false",
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList },
    values
  ) => {
    setLoading(true);
    const modifiedPayload = createPayloadStructure({
      initHeaderList,
      currentFilterSelection,
      checkedHeaderList,
      filterOrderList,
    });
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
    };

    getBonusSetupLanding(
      payload,
      modifiedPayload,
      setRowDto,
      setLoading,
      pagination,
      searchText,
      currentFilterSelection,
      checkedHeaderList,
      values,
      headerList,
      setHeaderList,
      filterOrderList,
      setFilterOrderList,
      initialHeaderListData,
      setInitialHeaderListData,
      setPages
    );
  };

  const handleChangePage = (_, newPage, searchText, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList,
      values
    );
  };

  const handleChangeRowsPerPage = (event, searchText, values) => {
    setPages({
      current: 1,
      total: pages?.total,
      pageSize: +event.target.value,
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList,
      values
    );
  };

  // const getData = () => {
  //   getBonusSetupLanding(
  //     {
  //       strPartName: "BonusSetupList",
  //       intBonusHeaderId: 0,
  //       intAccountId: orgId,
  //       intBusinessUnitId: buId,
  //       intBonusId: 0,
  //       intPayrollGroupId: 0,
  //       intWorkplaceGroupId: wgId,
  //       intWorkplaceId: wId,
  //       intReligionId: 0,
  //       dteEffectedDate: todayDate(),
  //       intCreatedBy: employeeId,
  //     },
  //     setRowDto,
  //     setLoading
  //   );
  // };

  useEffect(() => {
    setHeaderList({});
    getData(pages);
    // getBonusSetupLanding(
    //   {
    //     strPartName: "BonusSetupList",
    //     intBonusHeaderId: 0,
    //     intAccountId: orgId,
    //     intBusinessUnitId: buId,
    //     intBonusId: 0,
    //     intPayrollGroupId: 0,
    //     intWorkplaceGroupId: wgId,
    //     intWorkplaceId: wId,
    //     intReligionId: 0,
    //     dteEffectedDate: todayDate(),
    //     intCreatedBy: employeeId,
    //   },
    //   setRowDto,
    //   setLoading
    // );
  }, [orgId, buId, employeeId, wId, wgId]);

  const { setFieldValue, handleSubmit, values } = useFormik({
    enableReinitialize: true,
    // validationSchema: validationSchema,
    initialValues: initData,
    onSubmit: (values, { resetForm }) => {
      resetForm(initData);
    },
  });
  const columns = (page, paginationSize, wgId, headerList) => {
    return [
      {
        title: "SL",
        render: (_, index) => (page - 1) * paginationSize + index + 1,
        sort: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Bonus Name",
        dataIndex: "strBonusName",
        sort: true,
        filter: true,
        filterDropDownList: headerList[`strBonusNameList`] || [],
        width: 200,
      },
      {
        title: "Religion",
        dataIndex: "strReligionName",
        filterDropDownList: headerList[`strReligionNameList`] || [],
        sort: true,
        filter: true,
      },
      {
        title: "Employee Type",
        dataIndex: "strEmploymentType",
        filterDropDownList: headerList[`strEmploymentTypeList`] || [],
        sort: true,
        filter: true,
      },
      {
        title: "Workplace Name",
        dataIndex: "strWorkplace",
        filterDropDownList: headerList[`strWorkplaceList`] || [],
        sort: true,
        filter: true,
        width: "120px",
      },
      {
        title: "HR Position Name",
        dataIndex: "hrPositionName",
        filterDropDownList: headerList[`hrPositionNameList`] || [],
        sort: true,
        filter: true,
        width: "120px",
      },
      {
        title: "Service Length Type",
        render: (item) => (
          <>{item?.isServiceLengthInDays ? "Days" : "Month"}</>
        ),
        sort: true,
        filter: false,
      },
      {
        title: "Min. Service Length",
        // dataIndex: "intMaximumServiceLengthMonth",
        render: (item) => (
          <>
            {item?.intMaximumServiceLengthMonth > 0
              ? item?.intMaximumServiceLengthMonth
              : item?.intMinimumServiceLengthDays || "0"}
          </>
        ),
        sort: true,
        filter: false,
      },
      {
        title: `Max. Service Length`,
        // dataIndex: "intMaximumServiceLengthMonth",
        render: (item) => (
          <>
            {item?.intMaximumServiceLengthMonth > 0
              ? item?.intMaximumServiceLengthMonth
              : item?.intMaximumServiceLengthDays || "-"}
          </>
        ),
        sort: true,
        filter: false,
      },
      {
        title: "Bonus Percentage On",
        dataIndex: "strBonusPercentageOn",
        sort: true,
        filter: false,
      },
      {
        title: "Bonus Percentage",
        dataIndex: "numBonusPercentage",
        sort: true,
        filter: false,
      },
      {
        title: "Divided by Service Length",
        dataIndex: "isDividedbyServiceLength",
        render: (data) => <>{data?.isDividedbyServiceLength ? "True" : "False"}</>,
        sort: true,
        filter: false,
      },
      {
        title: "Status",
        // dataIndex: "isActive",
        render: (item) => (
          <Chips
            label={item?.isActive ? "Active" : "Inactive"}
            classess={`${item?.isActive ? "success" : "danger"} p-2`}
          />
        ),
        sort: true,
        filter: false,
      },
      {
        title: "Action",
        dataIndex: "",
        render: (item) => (
          <div className="d-flex">
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    history.push({
                      pathname: `/administration/payrollConfiguration/bonusSetup/edit/${item?.intBonusSetupId}`,
                      state: item,
                    });
                  }}
                />
              </button>
            </Tooltip>
          </div>
        ),
        sort: false,
        filter: false,
      },
    ];
  };
  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="table-card businessUnit-wrapper dashboard-scroll">
              <div className="table-card-heading">
                <div>
                  <h6>Bonus Setup</h6>
                </div>
                <ul className="d-flex flex-wrap">
                  {status && (
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
                          setFieldValue("status", "");
                          setStatus("");
                          getData();
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label={"Create"}
                      icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!permission?.isCreate)
                          return toast.warn("You don't have permission");
                        history.push(
                          "/administration/payrollConfiguration/bonusSetup/create"
                        );
                      }}
                    />
                  </li>
                </ul>
              </div>
              {rowDto?.length > 0 ? (
                // <AntTable data={rowDto} columnsData={columns} />
                <PeopleDeskTable
                  columnData={columns(
                    pages?.current,
                    pages?.pageSize,
                    wgId,
                    headerList
                  )}
                  pages={pages}
                  rowDto={rowDto}
                  setRowDto={loading}
                  checkedHeaderList={checkedHeaderList}
                  setCheckedHeaderList={setCheckedHeaderList}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.searchString, values)
                  }
                  handleChangeRowsPerPage={(e) => {
                    handleChangeRowsPerPage(e, values?.searchString, values);
                  }}
                  filterOrderList={filterOrderList}
                  setFilterOrderList={setFilterOrderList}
                  uniqueKey="strEmployeeCode"
                  getFilteredData={(
                    currentFilterSelection,
                    updatedFilterData,
                    updatedCheckedHeaderData
                  ) => {
                    getData(
                      {
                        current: 1,
                        pageSize: 25,
                        total: 0,
                      },
                      "false",
                      "",
                      currentFilterSelection,
                      updatedFilterData,
                      updatedCheckedHeaderData,
                      values
                    );
                  }}
                  isCheckBox={false}
                  isScrollAble={true}
                  scrollCustomClass="emp-report-landing-table"
                  handleSortingData={(obj) => {
                    console.log("obj", obj);
                  }}
                />
              ) : (
                <>{!loading && <NoResult title="You have no application." />}</>
              )}
            </div>
          </form>
        </>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </>
  );
}
