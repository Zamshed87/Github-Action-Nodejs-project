import axios from "axios";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "common/peopleDeskTable/helper";
import * as Yup from "yup";

export const initHeaderList = {
  designationList: [],
  employmentTypeList: [],
  departmentList: [],
  hrPositionList: [],
  sectionList: [],
};

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
  setCheckedList
) => {
  setLandingLoading(true);
  try {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      isNotAssign: isAssigned,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
    };

    const res = await axios.post(
      `/AssignLatePunishmentPolicy/LatePunishmentPolicyAssignLoader`,
      {
        ...payload,
        ...modifiedPayload,
      }
    );
    console.log(res?.data);

    if (res?.data?.loaderDataList) {
      setLandingLoading(true);
      setHeaderListDataDynamically({
        currentFilterSelection,
        checkedHeaderList,
        headerListKey: "header",
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
      setEmpIDString(res?.data?.loaderDataList?.map((i) => i?.employeeId));

      //   const modifiedData = res?.data?.loaderDataList?.map((item, index) => ({
      //     ...item,
      //     initialSerialNumber: index + 1,
      //     isSelected: false,
      //     // isSelected: checkedList?.find(
      //     //   ({ employeeCode }) => item?.employeeCode === employeeCode
      //     // )
      //     //   ? true
      //     //   : false,
      //   }));
      //   console.log({ modifiedData });
      setRowDto(res?.data?.loaderDataList);
      //   setCheckedList?.([]);

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
  setCheckedList = {}
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

    setCheckedList
  );
};
export const validationSchema = Yup.object({});

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
  assigned
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
    assigned
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
  assigned = false
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
    assigned
  );
};

export const columns = (
  pages,
  permission,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  setSingleData,
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
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 150,
    },
    {
      title: "Employee Name",
      dataIndex: "",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.employeeName}</span>
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
      dataIndex: "department",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`departmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`hrPositionList`],
      fieldType: "string",
    },
    {
      title: "Section",
      dataIndex: "section",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`sectionList`],
      fieldType: "string",
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`employmentTypeList`],
      fieldType: "string",
    },
    {
      title: "Policy Name",
      dataIndex: "latePunishmentPolicyName",
      fieldType: "string",
      width: 150,
    },
  ].filter((item) => item.hidden !== true);
