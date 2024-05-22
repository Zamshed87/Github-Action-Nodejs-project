/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";

const date = new Date();
const initYear = date.getFullYear(); // 2022
const initMonth = date.getMonth() + 1; // 6
const modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

export const allowanceAndDeductionColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
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
      filter: false,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    // instruction from maruf bhai
    // {
    //   title: "Workplace Group",
    //   dataIndex: "strWorkplaceGroup",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Business Unit",
    //   dataIndex: "businessUnit",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    {
      title: "Total Allowance",
      dataIndex: "totalAllowance",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Total Deduction",
      dataIndex: "totalDeduction",
      sort: true,
      filter: false,
      fieldType: "string",
    },
  ];
};

export const getSalaryAdditionAndDeductionLanding = async (
  wId,
  fromMonth,
  buId,
  setter,
  setLoading,
  search,
  pages,
  setPages,
  wgId
) => {
  setLoading && setLoading(true);
  // let searchTxt = search ? `&searchTxt=${search}` : "";
  const intMonth = fromMonth ? +fromMonth.split("-")[1] : +modifyMonthResult;
  const intYear = fromMonth ? +fromMonth?.split("-")[0] : initYear;

  try {
    const res = await axios.get(
      `/Employee/SalaryAdditionDeductionLanding?IntMonth=${intMonth}&IntYear=${intYear}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&searchTxt=${search}`
    );
    if (res?.data) {
      const modifiedData = res.data.data.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setter?.(modifiedData);
      setPages?.({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const createEditAllowanceAndDeduction = async (
  payload,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/SalaryAdditonNDeduction`, payload);
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    cb && cb();
    toast.warn(error?.response?.data?.message);
  }
};

export const getSalaryAdditionAndDeductionById = async (
  empId,
  wgId,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  const payload = {
    strEntryType: "GetEmpSalaryAdditionNDeductionByEmployeeId",
    intBusinessUnitId: buId,
    intWorkplaceGroupId: wgId,
    intEmployeeId: empId,
  };
  try {
    const res = await axios.post(`/Employee/SalaryAdditonNDeduction`, payload);
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    toast.warn(error?.response?.data?.message);
  }
};

export const getAllAllowanceAndDeduction = async (
  orgId,
  buId,
  wId,
  setter,
  AdditionAndDeduction,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetAllPayrollElementType?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}`
    );
    if (res?.data) {
      const additionDDL = res?.data
        ?.filter((item) => item?.isAddition && !item?.isPrimarySalary)
        .map((itm) => {
          return {
            ...itm,
            value: itm?.intPayrollElementTypeId,
            label: itm?.strPayrollElementName,
          };
        });
      const deductionDDL = res?.data
        ?.filter((item) => item?.isDeduction)
        .map((itm) => {
          return {
            ...itm,
            value: itm?.intPayrollElementTypeId,
            label: itm?.strPayrollElementName,
          };
        });
      if (AdditionAndDeduction) {
        setter(additionDDL);
      } else {
        setter(deductionDDL);
      }
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeProfileViewData = async (
  empId,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${empId}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeProfileLanding = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  setLoading && setLoading(true);
  const searchTxt = search ? `&searchTxt=${search}` : "";
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileLandingPagination?accountId=${accId}&businessUnitId=${buId}${searchTxt}&pageNo=${pageNo}&pageSize=${pageSize}`
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

export const employeeFilter = async ({
  orgId,
  buId,
  values,
  setter,
  setLoading,
  cb,
}) => {
  const payload = {
    strPart: "EmployeeBasicInfoMasterFilter",
    employeeId: 0,
    employmentTypeId: values?.employementType?.value || 0,
    departmentId: values?.department?.value || 0,
    designationId: values?.designation?.value || 0,
    positionId: 0,
    positionGroupId: 0,
    joiningDate: values?.joiningDate || null,
    confirmationDate: values?.confirmDate || null,
    dateOfBirth: null,
    religionId: values?.religion?.value || 0,
    genderId: values?.gender?.value || 0,
    supervisorId: values?.supervisor?.value || 0,
    lineManagerId: 0,
    workplaceId: 0,
    workplaceGroupId: values?.workplaceGroup?.value || 0,
    sbuId: 0,
    businessUnitId: buId,
    accountId: orgId,
    employmentStatusId: values?.employmentStatus?.value || 0,
    maritalStatus: "",
    bloodGroupId: 0,
    email: "",
    officialEmail: "",
    phone: "",
    officialPhone: "",
    payrollGroupId: values?.payrollGroup?.value || 0,
    payscaleGradeId: 0,
    isNID: values?.isNID?.value,
    isBIRTHID: values?.birthCertificate?.value,
    RosterGroupId: values?.rosterGroup?.value,
    CalenderId: values?.calendar?.value,
  };
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/emp/EmployeeProfile/EmployeeBasicInfoMasterFilter`,
      payload
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
      cb && cb();
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getAllAdditionNDeductionListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setFilterData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/SalaryAdditionNDeductionLanding`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setFilterData && setFilterData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setFilterData && setFilterData({});
    setLoading && setLoading(false);
  }
};

export const AdditionNDeductionApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/SalaryAdditionNDeductionApproval`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    const newDta = allData?.filter((item) =>
      regex.test(item?.EmployeeName?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const getTimeSheetAllLanding = async (
  partType,
  buId,
  setAllData,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/emp/EmployeeTimeSheet/TimeSheetAllLanding?PartType=${partType}&BuninessUnitId=${buId}`
    );
    if (res?.data) {
      const modifyRowData = res?.data?.Result?.map((item) => ({
        ...item,
        presentStatus: false,
      }));
      setAllData && setAllData(modifyRowData);
      setter(modifyRowData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const manualAttendanceAction = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/ManualAttendance`, payload);
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAttendanceAdjustmentFilter = async (
  setAllData,
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    const res = await axios.post(
      `/Employee/AttendanceAdjustmentFilter`,
      payload
    );
    setIsLoading(false);
    const newList = res?.data?.map((item) => ({
      ...item,
      presentStatus: false,
    }));
    setAllData && setAllData(newList);
    setter(newList);
    cb && cb();
  } catch (err) {
    setIsLoading(false);
    setter("");
  }
};
export const column = {
  sl: "SL",
  strWorkplace: "Workplace",
  strEmployeeName: "Employee Name",
  strDesignation: "Designation",
  strDepartment: "Department",
  totalAllowance: "Total Allowance",
  totalDeduction: "Total Deduction",
};
