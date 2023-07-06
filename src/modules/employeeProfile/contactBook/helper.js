import axios from "axios";
import AvatarComponent from "../../../common/AvatarComponent";
export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
export const getEmployeeContactInfo = async (
  tableName,
  accId,
  busId,
  id,
  setter,
  setAllData,
  setLoading,
  statusId,
  setTableRowDto
) => {
  setLoading && setLoading(true);

  let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${busId}&intId=${id}${status}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setTableRowDto((prev) => ({
        ...prev,
        data: res?.data,
        totalCount: res?.data?.length,
      }));
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmpContactInfoNew = async ({
  setLoading,
  setter,
  buId,
  pageNo,
  pageSize,
  srcTxt,
  setPages,
  isExcel,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeContactInfo?businessUnitId=${buId}&pageSize=${pageSize}&pageNo=${pageNo}&isForEXL=${isExcel}&searchText=${srcTxt}`
    );
    if (res?.data) {
      setter(res?.data);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const empSelfContactBookCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      width: 100,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sort: true,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.employeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Reference Id",
      dataIndex: "strReferenceId",
      sorter: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Mobile No",
      dataIndex: "phone",
      fieldType: "string",
      sorter: false,
      filter: false,
    },
    {
      title: "Email",
      dataIndex: "email",
      fieldType: "string",
      sorter: false,
      filter: false,
    },
  ];
};
