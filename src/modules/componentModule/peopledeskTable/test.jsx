import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import AvatarComponent from "../../../common/AvatarComponent";
import PeopleDeskTable from ".";
import axios from "axios";
import { dateFormatter } from "../../../utility/dateFormatter";
import { Tooltip } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { useHistory } from "react-router-dom";

const Test = () => {
  const history = useHistory();
  const [checkedList, setCheckedList] = useState([]);
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    strDepartmentList: [],
    strDesignationList: [],
    strSupervisorNameList: [],
    strEmploymentTypeList: [],
    strLinemanagerList: [],
  });
  const [headerList, setHeaderList] = useState({});
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [filterOrderList,] = useState([]);

  const getLanding = async (pagination, IsForXl = "false", searchText = "") => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      employeeId: employeeId,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      isPaginated: true,
      isHeaderNeed: pagination.current === 1 ? true : false,
      searchTxt: "",
      strDepartmentList: checkedHeaderList?.strDepartmentList?.length
        ? checkedHeaderList?.strDepartmentList
        : [],
      strDesignationList: checkedHeaderList?.strDesignationList?.length
        ? checkedHeaderList?.strDesignationList
        : [],
      strSupervisorNameList: checkedHeaderList?.strSupervisorNameList?.length
        ? checkedHeaderList?.strSupervisorNameList
        : [],
      strEmploymentTypeList: checkedHeaderList?.strEmploymentTypeList?.length
        ? checkedHeaderList?.strEmploymentTypeList
        : [],
      strLinemanagerList: checkedHeaderList?.strLinemanagerList?.length
        ? checkedHeaderList?.strLinemanagerList
        : [],
    };
    const api = `/Employee/EmployeeProfileLandingPagination?accountId=${orgId}&businessUnitId=${buId}&PageNo=${pagination?.current
      }&PageSize=${pagination?.pageSize}&searchTxt=${searchText || ""
      }&WorkplaceGroupId=${wgId}&IsForXl=false`;

    const res = await axios.post(api, payload);
    if (res?.data?.data) {
      const modifiedData = res?.data?.data?.map((item) => ({
        ...item,
        isSelected: checkedList?.find(
          ({ strEmployeeCode }) => item?.strEmployeeCode === strEmployeeCode
        )
          ? true
          : false,
      }));
      if (res?.data?.currentPage === 1) {
        setHeaderList(res?.data?.employeeHeader);
      }

      setEmpLanding(modifiedData);
      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });
    }
  };

  useEffect(() => {
    getLanding(pages, "false");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const empListColumn = (page, paginationSize, headerList) => {
    return [
      {
        title: "SL",
        render: (_, index) => (page - 1) * paginationSize + index + 1,
        sort: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Employee ID",
        dataIndex: "strEmployeeCode",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Employee Name",
        dataIndex: "strEmployeeName",
        render: (record) => {
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
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sort: true,
        filter: true,
        filterDropDownList: headerList[`strDesignationList`],
        fieldType: "string",
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sort: true,
        filter: true,
        filterDropDownList: headerList[`strDepartmentList`],
        fieldType: "string",
      },
      {
        title: orgId === 10015 ? "Reporting Line" : "Supervisor",
        dataIndex: "strSupervisorName",
        sort: true,
        filter: true,
        filterDropDownList: headerList[`strSupervisorNameList`],
        fieldType: "string",
      },
      {
        title: orgId === 10015 ? "Team Leader" : "Line Manager",
        dataIndex: "strLinemanager",
        sort: true,
        filter: true,
        filterDropDownList: headerList[`strLinemanagerList`],
        fieldType: "string",
      },
      {
        title: "Type",
        dataIndex: "strEmploymentType",
        sort: true,
        filter: true,
        filterDropDownList: headerList[`strEmploymentTypeList`],
        fieldType: "string",
      },
      {
        title: "Joining Date",
        dataIndex: "dteJoiningDate",
        render: (record) => {
          return dateFormatter(record?.dteJoiningDate);
        },
        sort: true,
        filter: false,
        fieldType: "date",
      },
      {
        title: "",
        dataIndex: "",
        className: "text-center",
        render: (record) => (
          <div className="d-flex justify-content-center">
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={() =>
                    history.push({
                      pathname: `/profile/employee/${record?.intEmployeeBasicInfoId}`,
                    })
                  }
                />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ];
  };

  const handleChangePage = (event, newPage) => {
    setPages((prev) => {
      return { ...prev, current: newPage + 1 };
    });

    getLanding({
      current: newPage + 1,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPages((prev) => {
      return { ...prev, pageSize: +event.target.value };
    });
    getLanding({
      current: pages?.current,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  console.log({ filterOrderList });

  return (
    <>
      <div className="mt-5">
        <PeopleDeskTable
          columnData={empListColumn(
            pages?.current,
            pages?.pageSize,
            headerList
          )}
          pages={pages}
          rowDto={resEmpLanding}
          setRowDto={setEmpLanding}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          checkedHeaderList={checkedHeaderList}
          setCheckedHeaderList={setCheckedHeaderList}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          uniqueKey="strEmployeeCode"
          getFilteredData={() => getLanding(pages)}
          onRowClick={(res) => console.log("Row is clicked ", res)}
          isCheckBox={true}
        />
      </div>
    </>
  );
};

export default Test;
