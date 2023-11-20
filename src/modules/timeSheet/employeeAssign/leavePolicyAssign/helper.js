import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { dateFormatter } from "../../../../utility/dateFormatter";

export const getShiftInfo = async (id, setter) => {
  try {
    const res = await axios.get(
      `Employee/GetEmployeeShiftInfo?intEmployeeId=${id}&intYear=${moment().format(
        "YYYY"
      )}&intMonth=${moment().format("M")}`
    );
    if (res?.data) {
      setter && setter(res?.data);
    }
    res?.data?.length === 0 && toast.warn("no data found");
  } catch (error) {
    // console.log(error?.message)
  }
};
export const getCalendarAssignFilter = async (
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/Employee/CalendarAssignFilter`, payload);
    setIsLoading(false);
    // const newList = res?.data?.map((item) => ({
    //   ...item,
    //   isAssigned: false,
    // }));
    res?.data?.length > 0 && cb?.(res?.data);
    // setAllData && setAllData(newList);
    // setter?.(newList);
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};

export const rosterGenerateAction = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/RosterGenerateList`, payload);
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const columns = (
  pages,
  permission,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  // isAlreadyPresent,
  setSingleData,
  setCreateModal,
  // rowDtoHandler,
  setSingleShiftData,
  setAnchorEl2,
  headerList,
  wgName
) =>
  [
    {
      title: "SL",
      render: (_, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "intEmpId",
      sort: true,
      filter: false,
      fieldType: "number",
      width: 150,
    },
    {
      title: "Employee Name",
      dataIndex: "",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.strEmpName}</span>
            {/* <InfoOutlined
              style={{ cursor: "pointer" }}
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setSingleShiftData([]);
                getShiftInfo(record?.employeeId, setSingleShiftData);
                setAnchorEl2(e.currentTarget);
              }}
            /> */}
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Department",
      dataIndex: "strEmpDepartment",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`departmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strEmpDesignation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },
    {
      title: "HR Position",
      dataIndex: "strHrPositionName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`hrList`],
      fieldType: "string",
    },
    {
      title: "Gender",
      dataIndex: "strGenderName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`genderList`],
      fieldType: "string",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      // sort: true,
      // filter: true,
      // filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },

    // {
    //   title: "Wing",
    //   dataIndex: "wingName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`wingNameList`],
    //   hidden: wgName === "Marketing" ? false : true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Sole Depo",
    //   dataIndex: "soleDepoName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`soleDepoNameList`],
    //   hidden: wgName === "Marketing" ? false : true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Region",
    //   dataIndex: "regionName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`regionNameList`],
    //   hidden: wgName === "Marketing" ? false : true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Area",
    //   dataIndex: "areaName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`areaNameList`],
    //   hidden: wgName === "Marketing" ? false : true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Territory",
    //   dataIndex: "territoryName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`territoryNameList`],
    //   hidden: wgName === "Marketing" ? false : true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Supervisor",
    //   dataIndex: "supervisorName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`supervisorNameList`],
    //   fieldType: "string",
    // },
    // {
    //   title: "Generate Date",
    //   dataIndex: "generateDate",
    //   render: (record) => dateFormatter(record?.generateDate),
    // },
    // {
    //   title: () => <span style={{ color: gray600 }}>Generate Date</span>,
    //   dataIndex: "GenerateDate",
    //   render: (GenerateDate) => dateFormatter(GenerateDate),
    //   sorter: true,
    //   filter: true,
    //   isDate: true,
    // },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (record) => dateFormatter(record?.joiningDate),
    },
    // {
    //   title: () => <span style={{ color: gray600 }}>Joining Date</span>,
    //   dataIndex: "JoiningDate",
    //   render: (JoiningDate) => dateFormatter(JoiningDate),
    //   sorter: true,
    //   filter: true,
    //   isDate: true,
    // },
    // {
    //   title: "Roster Name",
    //   dataIndex: "rosterGroupName",
    //   sort: true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Calender Name",
    //   dataIndex: "calendarName",
    //   render: (record) => (
    //     <>
    //       {record?.calendarName ? (
    //         <div className="d-flex align-items-center">
    //           <RoasterInfo item={record} />
    //           <div className="pl-2">{record?.calendarName} </div>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Action",
      className: "text-center",
      dataIndex: "",
      render: (record) => (
        <div>
          {!(record?.calendarAssignId || record?.isSelected) && (
            <div className="assign-btn">
              <button
                style={{
                  marginRight: "25px",
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                type="button"
                className="btn btn-default"
                onClick={(e) => {
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setSingleData([record]);
                  setCreateModal(true);
                  // rowDtoHandler(record);
                }}
                disabled={checkedList.length > 1}
              >
                Assign
              </button>
            </div>
          )}
        </div>
      ),
    },
  ].filter((item) => item.hidden !== true);

let date = new Date();
let currentYear = date.getFullYear();
export const initData = {
  searchString: "",
  allSelected: true,
  // master filter
  workplace: "",
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
  employee: "",
  assignStatus: { value: "all", label: "All" },
  salaryStatus: "",
  year: { value: currentYear, label: currentYear },
};
export const validationSchema = Yup.object({});

export const colors = [
  "#299647",
  "#B54708",
  "#B42318",
  "#6927DA",
  "#3538CD",
  "#667085",
  "#667085",
];
export const bgColors = [
  "#E6F9E9",
  "#FEF0C7",
  "#FEE4E2",
  "#ECE9FE",
  "#E0EAFF",
  "#F2F4F7",
  "#FEF0D7",
];
export const initHeaderList = {
  designations: [],
  departments: [],
  genders: [],
  hrLists: [],
  // soleDepoNameList: [],
  // regionNameList: [],
  // areaNameList: [],
  // territoryNameList: [],
  // employmentTypeList: [],
};
// export const statusDDL = [
//   { value: 0, label: "All" },
//   { value: 1, label: "Assigned" },
//   { value: 2, label: "Not Assigned" },
// ];
// landing api call
const getDataApiCall = async (
  modifiedPayload,
  pagination,
  searchText,
  checkedList,
  currentFilterSelection,
  checkedHeaderList,
  isAssigned = null,
  setLandingLoading,
  buId,
  wgId,
  wId,
  headerList,
  setHeaderList,
  filterOrderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setPages,
  setEmpIDString,
  setRowDto,
  list,
  year
) => {
  setLandingLoading(true);
  try {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      intPolicyIdList: list,
      workplaceId: wId,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      intYear: year,
    };

    const res = await axios.post(
      `/SaasMasterData/GetEmployeeLandingForLeavePolicy`,
      {
        ...payload,
        ...modifiedPayload,
      }
    );
    if (res?.data?.data) {
      setLandingLoading(true);
      setHeaderListDataDynamically({
        currentFilterSelection,
        checkedHeaderList,
        headerListKey: "employeeHeader",
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
        isSelected: true,
        // isSelected: checkedList?.find(
        //   ({ employeeCode }) => item?.employeeCode === employeeCode
        // )
        //   ? true
        //   : false,
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
export const getData = async (
  pagination,
  setLandingLoading,
  buId,
  wgId,
  wId,
  headerList,
  setHeaderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setPages,
  setEmpIDString,
  setRowDto,
  searchText = "",
  checkedList = [],
  currentFilterSelection = -1,
  filterOrderList = [],
  checkedHeaderList = { ...initHeaderList },
  isAssigned,
  list,
  year
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
    isAssigned,
    setLandingLoading,
    buId,
    wgId,
    wId,
    headerList,
    setHeaderList,
    filterOrderList,
    setFilterOrderList,
    initialHeaderListData,
    setInitialHeaderListData,
    setPages,
    setEmpIDString,
    setRowDto,
    list,
    year
  );
};

// pagination
export const handleChangePage = (
  _,
  newPage,
  searchText,
  setLandingLoading,
  buId,
  wgId,
  wId,
  headerList,
  setHeaderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setPages,
  setEmpIDString,
  setRowDto,
  checkedList,
  pages,
  filterOrderList,
  checkedHeaderList,
  list,
  year
) => {
  setPages((prev) => {
    return { ...prev, current: newPage };
  });
  getData(
    {
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    },
    setLandingLoading,
    buId,
    wgId,
    wId,
    headerList,
    setHeaderList,
    setFilterOrderList,
    initialHeaderListData,
    setInitialHeaderListData,
    setPages,
    setEmpIDString,
    setRowDto,
    searchText,
    checkedList,
    -1,
    filterOrderList,
    checkedHeaderList,
    null,
    list,
    year
  );
};

export const handleChangeRowsPerPage = (
  event,
  searchText,
  setLandingLoading,
  buId,
  wgId,
  wId,
  headerList,
  setHeaderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setPages,
  setEmpIDString,
  setRowDto,
  checkedList,
  pages,
  filterOrderList,
  checkedHeaderList,
  list,
  year
) => {
  setPages((prev) => {
    return { current: 1, total: pages?.total, pageSize: +event.target.value };
  });
  getData(
    {
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    },
    setLandingLoading,
    buId,
    wgId,
    wId,
    headerList,
    setHeaderList,
    setFilterOrderList,
    initialHeaderListData,
    setInitialHeaderListData,
    setPages,
    setEmpIDString,
    setRowDto,
    searchText,
    checkedList,
    -1,
    filterOrderList,
    checkedHeaderList,
    null,
    list,
    year
  );
};
