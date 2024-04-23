import axios from "axios";
import AvatarComponent from "common/AvatarComponent";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.employee?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (e) {
    setRowDto([]);
  }
};

export const getOvertimeReportLanding = async (
  wId,
  partType,
  buId,
  workplaceGroupId,
  formDate,
  toDate,
  setter,
  setLoading,
  srcTxt,
  isPaginated,
  pageNo,
  pageSize,
  setPages,
  pages
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/OvertimeReportLanding?PartType=${partType}&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&WorkplaceId=${wId}&FromDate=${formDate}&ToDate=${toDate}&SearchText=${srcTxt}&IsPaginated=${isPaginated}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.data) {
      setter(res?.data);
      setPages({
        current: pageNo,
        pageSize: pageSize,
        total: res?.data[0]?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const empReportListColumns = (
  page,
  paginationSize,
  wgId,
  headerList
) => {
  console.log({page, paginationSize})
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      // width: 30,
      fixed: "left",
    },

    {
      title: "ID NO",
      dataIndex: "intEmployeeId",
      sort: false,
      filter: false,
      width: "200px",
      fieldType: "number",
    },

    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      sort: false,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.strEmployeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.strEmployeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: false,
      filter: false,
      width: "200px",
      fieldType: "string",
    },

    {
      title: "Basic Salary",
      dataIndex: "intBasicSalary",
      key: "intBasicSalary",
      width: "150px",
      sort: false,
      filter: false,
    },

    {
      title: "HR Position",
      dataIndex: "strHRPostionName",
      sort: false,
      filter: false,
      width: "200px",
      fieldType: "string",
    },

    {
      title: "Calender Name",
      dataIndex: "strCalendarName",
      sort: false,
      filter: false,
      width: "200px",
      fieldType: "string",
    },

    {
      title: "Log In",
      dataIndex: "EmpInTime",
      key: "EmpInTime",
      width: "150px",
      sort: false,
      filter: false,
    },
    
    {
      title: "Log Out",
      dataIndex: "EmpOutTime",
      key: "EmpOutTime",
      width: "150px",
      sort: false,
      filter: false,
    },

    {
      title: "Late",
      dataIndex: "intOTLate",
      key: "intOTLate",
      width: "150px",
      sort: false,
      filter: false,
    },

    {
      title: "OT Hour",
      dataIndex: "intOtbenefitsHour",
      key: "intOtbenefitsHour",
      width: "150px",
      sort: false,
      filter: false,
    },

    {
      title: "OT Rate",
      dataIndex: "numPerMinunitRate",
      key: "numPerMinunitRate",
      width: "150px",
      sort: false,
      filter: false,
    },

    {
      title: "Net Payable",
      dataIndex: "EmpOutTime",
      key: "EmpOutTime",
      width: "150px",
      sort: false,
      filter: false,
    },
    // {
    //   title: "Status",
    //   dataIndex: "empStatus",
    //   key: "empStatus",
    //   sort: false,
    //   filter: false,
    //   width: "100px",
    //   render: (record) => {
    //     return (
    //       <div>
    //         {record?.empStatus === "Active" ? (
    //           <Chips label="Active" classess="success" />
    //         ) : (
    //           <Chips label="Inactive" classess="mx-2 danger" />
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ].filter((item) => !item.hidden);
};