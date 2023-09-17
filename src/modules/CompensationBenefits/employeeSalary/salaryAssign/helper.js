import axios from "axios";
import { toast } from "react-toastify";
import { getByIdSalaryAssignDDL, getSalaryAssignDDL } from "./salaryAssignCal";
import AvatarComponent from "../../../../common/AvatarComponent";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import Chips from "../../../../common/Chips";

export const reverseBasedOnBasicPercentage = (basicElement, payrollElement) => {
  let percentage = 0;
  percentage = (payrollElement * 100) / basicElement;
  return percentage;
};

export const getBreakdownPolicyDDL = async (
  reportType,
  accId,
  buId,
  employeeId,
  id,
  setter
) => {
  try {
    const res = await axios.get(
      `/Payroll/BreakdownNPolicyForSalaryAssign?StrReportType=${reportType}&IntEmployeeId=${employeeId}&IntAccountId=${accId}&IntBusinessUnitId=${buId}&IntSalaryBreakdownHeaderId=${id}`
    );
    if (res?.data) {
      const modifyData = res?.data?.map((itm) => {
        return {
          ...itm,
          value: itm?.intSalaryBreakdownHeaderId,
          label: itm?.strSalaryBreakdownTitle,
        };
      });
      setter(modifyData);
    }
  } catch (error) {}
};

export const getBreakdownListDDL = async (
  reportType,
  accId,
  id,
  grossSalaryAmount,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/BreakdownNPolicyForSalaryAssign?StrReportType=${reportType}&IntAccountId=${accId}&IntSalaryBreakdownHeaderId=${id}`
    );
    if (res?.data) {
      try {
        const resBasicAllowance = await axios.get(`/Payroll/GetGrossWiseBasicAmountNPercentage?BreakDownHeaderId=${id}&GrossAmount=${grossSalaryAmount || 0}`);
        if (resBasicAllowance?.data) {
          getSalaryAssignDDL(
            accId,
            res,
            grossSalaryAmount,
            setter,
            resBasicAllowance?.data
          );
          setLoading && setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading && setLoading(false);
      }
    }
  } catch (error) {
    console.log(error);
    setLoading && setLoading(false);
  }
};

export const getEmployeeSalaryInfo = async (
  setAllData,
  setter,
  payload,
  frontStatusId,
  setIsLoading,
  setIsHoldSalary,
  pages,
  setPages
) => {
  setIsLoading && setIsLoading(true);
  try {
    let res = await axios.post(`/Payroll/EmployeeSalaryManagement`, payload);
    setIsLoading && setIsLoading(false);

    let modifyData = [];

    if (frontStatusId === "NotAssigned") {
      modifyData = res?.data?.filter((item) => item?.Status === "Not Assigned");
      setter(modifyData);
      setAllData && setAllData(modifyData);
    } else {
      modifyData = res?.data?.filter((item) => item?.Status === "Assigned");
      setter(modifyData);
      setAllData && setAllData(modifyData);
    }
    setPages({
      ...pages,
      current: pages.current,
      pageSize: pages.pageSize,
      total: res?.data[0]?.totalCount,
    });

    // setter(res?.data);
    // setAllData && setAllData(modifyData);

    setIsHoldSalary &&
      setIsHoldSalary(res?.data?.[0]?.IsHold === 1 ? true : false);
  } catch (err) {
    setIsLoading && setIsLoading(false);
  }
};

export const createEmployeeSalaryAssign = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/EmployeeSalaryAssign`, payload);
    cb();
    toast.success(res.data?.message || "Successfully", { toastId: 101 });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong!!!", {
      toastId: 101,
    });
    setLoading && setLoading(false);
  }
};

export const salaryHoldAction = async (
  isHold,
  employeeId,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/Payroll/SalaryIsHold?isHold=${isHold}&EmployeeId=${employeeId}`
    );
    setIsLoading(false);
    toast.success(res?.data || "Update Successfull");
    cb && cb();
  } catch (err) {
    setIsLoading(false);
  }
};

export const getByIdBreakdownListDDL = async (
  reportType,
  accId,
  employeeId,
  id,
  setter,
  grossSalaryAmount,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/BreakdownNPolicyForSalaryAssign?StrReportType=${reportType}&IntAccountId=${accId}&IntEmployeeId=${employeeId}&IntSalaryBreakdownHeaderId=${id}`
    );
    if (res?.data) {
      try {
        const resBasicAllowance = await axios.get(
          `/Payroll/GetGrossWiseBasicAmountNPercentage?BreakDownHeaderId=${id}&GrossAmount=${
            grossSalaryAmount || 0
          }`
        );
        if (resBasicAllowance?.data) {
          getByIdSalaryAssignDDL(
            accId,
            res,
            grossSalaryAmount,
            setter,
            resBasicAllowance?.data
          );
          setLoading && setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading && setLoading(false);
      }
    }
  } catch (error) {
    console.log(error);
    setLoading && setLoading(false);
  }
};

export const getEmployeeIncrementByEmoloyeeId = async (
  accId,
  employeeId,
  setter,
  setLoading,
  wgId,
  buId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmployeeIncrementByEmoloyeeId?EmployeeId=${employeeId}&workplaceGroupId=${wgId}&businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// update peopledesk table handler for salary assign

export const salaryAssignLandingColumn = (page, paginationSize, wgName) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "PIN",
      dataIndex: "PIN",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Employee ID",
      dataIndex: "EmployeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.EmployeeName}
            />
            <span className="ml-2">{record?.EmployeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sort: true,
      // filter: true,
      // filterDropDownList: headerList[`DesignationName`],
      fieldType: "string",
    },

    {
      title: "Wing",
      dataIndex: "wingName",
      sort: true,
      // filter: true,
      // filterDropDownList: headerList[`wingNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sort: true,
      // filter: true,
      // filterDropDownList: headerList[`soleDepoNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sort: true,
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sort: true,
      // filter: true,
      // filterDropDownList: headerList[`areaNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Territory",
      dataIndex: "TerritoryName",
      sort: true,
      // filter: true,
      // filterDropDownList: headerList[`territoryNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sort: true,
      // filter: true,
      // filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
    },
    {
      title: "Perday Salary",
      dataIndex: "PerdaySalary",
      sort: true,
      fieldType: "number",
      render: (record) => (
        <div className="text-right">
          {record?.PerdaySalary !== 0
            ? numberWithCommas(record?.PerdaySalary)
            : ""}
        </div>
      ),
    },
    {
      title: "Basic Salary",
      dataIndex: "numBasicORGross",
      sort: true,
      fieldType: "number",
      render: (record) => (
        <div className="text-right">
          {numberWithCommas(record?.numBasicORGross)}
        </div>
      ),
    },
    {
      title: "Gross Salary",
      dataIndex: "numNetGrossSalary",
      sort: true,
      fieldType: "number",
      render: (data) => (
        <div className="text-right">
          {data?.numNetGrossSalary !== 0
            ? numberWithCommas(data?.numNetGrossSalary)
            : ""}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      sort: false,
      render: (data) => {
        return (
          <div>
            {data?.Status === "Assigned" && (
              <Chips label="Assigned" classess="success p-2" />
            )}
            {data?.Status === "Not Assigned" && (
              <Chips label="Not Assigned" classess="secondary p-2" />
            )}
          </div>
        );
      },
      width: 130,
    },
  ].filter((itm) => !itm?.hidden);
};
export const getSalaryAssignLanding = async ({
  reqApiHooks,
  pages,
  setPages,
  buId,
  wgId,
  setter,
  srcText,
  type,
  wId,
}) => {
  const payload = {
    partType: "SalaryAssignLanding",
    businessUnitId: buId,
    workplaceGroupId: wgId,
    workplaceId: wId,
    departmentId: 0,
    designationId: 0,
    supervisorId: 0,
    employeeId: 0,
    strStatus: type || "NotAssigned",
    strSearchTxt: srcText || "",
    pageNo: pages?.current,
    pageSize: pages?.pageSize,
    isPaginated: true,
  };
  reqApiHooks(`/Payroll/EmployeeSalaryManagement`, payload, (res) => {
    const modifiedResponseData = res?.map((data, index) => ({
      ...data,
      initialSerialNumber: index + 1,
    }));
    setter(modifiedResponseData);
    setPages({
      current: pages?.current,
      pageSize: pages?.pageSize,
      total: res?.[0]?.totalCount,
    });
  });
};
