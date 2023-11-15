import axios from "axios";
import { toast } from "react-toastify";

export const getTaxAssignLanding = async (
  buId,
  orgId,
  pages,
  values,
  wgId,
  wId,
  setter,
  setPages,
  setLoading,
  searchText = ""
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetAllEmployeeForTaxAssign?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${
        wgId || 0
      }&IntWorkplaceId=${wId || 0}&IntEmployeeId=${
        values?.employee?.value || 0
      }&searchTxt=${searchText}&PageNo=${pages?.current}&PageSize=${
        pages?.pageSize
      }`
      // `/Employee/GetAllEmployeeForTaxAssign?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${
      //   values?.workplaceGroup?.value || 0
      // }&IntWorkplaceId=${values?.workplace?.value || 0}&IntEmployeeId=${
      //   values?.employee?.value || 0
      // }`
    );
    const modifiedData = res?.data?.data?.map((item, index) => ({
      ...item,
      initialSerialNumber: index + 1,
    }));
    setter?.(modifiedData);
    setPages?.({
      current: res?.data?.currentPage,
      total: res?.data?.totalCount,
      pageSize: res?.data?.pageSize,
    });
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createTaxAssign = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/EmployeeTaxAssign`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const incomeTaxColumnData = (
  page,
  paginationSize,
  rowDtoHandler,
  errors,
  touched
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Take-Home Pay",
      dataIndex: "isTakeHomePay",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Gross Salary",
      dataIndex: "numGrossSalary",
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Tax Amount",
      dataIndex: "numTaxAmount",
      render: (record, index) => (
        <div className="input-field-main pl-2" style={{ height: "25px" }}>
          <input
            style={{
              height: "25px",
              width: "140px",
              fontSize: "12px",
            }}
            className="form-control text-right"
            value={record?.numTaxAmount}
            name={record?.numTaxAmount}
            placeholder=" "
            type="number"
            onChange={(e) => {
              const value = e.target.value;
              if (!value.includes(".") && value >= 0) {
                rowDtoHandler("numTaxAmount", index, value);
              } else {
                rowDtoHandler("numTaxAmount", index, "");
              }
            }}
            required
            errors={errors}
            touched={touched}
          />
        </div>
      ),
    },
  ];
};
