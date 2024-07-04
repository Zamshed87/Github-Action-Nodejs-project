import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";

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

// daily attendance generate landing
export const getIncrementData = async (
  values,
  setter,
  setLoading,
) => {
  setLoading && setLoading(true);
  const Year = values?.year?.value ? "Year=" + values?.year?.value : "";
  const Month = values?.month?.value ? "&Month=" + values?.month?.value : "";
  const dept = values?.department?.value
    ? "&DepartmentId=" + values?.department?.value
    : "";
  try {
    const res = await axios.get(
      `/Employee/GetIncrementReport?${Year}${Month}${dept}`
    );

    if (res?.data) {
      setter(res?.data);
      // setPages({
      //   current: res?.data?.currentPage,
      //   pageSize: res?.data?.pageSize,
      //   total: res?.data?.totalCount,
      // });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
// UI Table columns
export const incrementDtoCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      dataIndex: "SLNo",
      sort: false,
      filter: false,
      className: "text-center",
      width: 30,
      render: (record) => record?.SLNo,
    },
    {
      title: "Department",
      dataIndex: "Department",
      sort: false,
      filter: false,
      width: 120,
      render: (record) => record?.Department || "-",
    },
    {
      title: "Employee Id",
      dataIndex: "EmpID",
      sort: false,
      filter: false,
      width: 100,
      render: (record) => record?.EmpID || "-",
    },
    {
      title: "Employee Name",
      dataIndex: "NameOfEmployee",
      sort: false,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.NameOfEmployee}
            />
          </div>
          <div className="ml-2">
            <span>{item?.NameOfEmployee}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "Designation",
      sort: false,
      filter: false,
      render: (record) => record?.Designation || "N/A",
    },
    {
      title: "Date of Joining",
      dataIndex: "DateOfJoining",
      sort: false,
      filter: false,
      render: (record) => record?.DateOfJoining || "N/A",
    },
    {
      title: " Gross salary",
      dataIndex: "GrossSalary",
      sort: false,
      filter: false,
      render: (record) =>
        record?.GrossSalary
          ? parseFloat(record?.GrossSalary)?.toFixed(2)
          : "N/A",
    },
    {
      title: "Increment Amount",
      dataIndex: "IncrementAmount",
      sort: false,
      filter: false,
      render: (record) =>
        record?.IncrementAmount
          ? parseFloat(record?.IncrementAmount)?.toFixed(2)
          : "N/A",
    },
    {
      title: "New Gross salary after Increment",
      dataIndex: "NewGrossSalary",
      render: (record) =>
        record?.NewGrossSalary
          ? parseFloat(record?.NewGrossSalary)?.toFixed(2)
          : "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Percentage Of Increment",
      dataIndex: "PercentageOfIncrement",
      render: (record) =>
        record?.PercentageOfIncrement
          ? parseFloat(record?.PercentageOfIncrement)?.toFixed(2)
          : "N/A",
      sort: false,
      filter: false,
    },
  ];
};
