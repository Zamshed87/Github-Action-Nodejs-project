import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../utility/customColor";
import { createArearSalaryGenerateRequest } from "../helper";

export const arrearSalaryDtoCol = (
  eligibleEmployee,
  setEligibleEmployee,
  setFieldValue,
  setFilterEmpList,
  filterEmpList
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => <div>{index + 1}</div>,
      sorter: false,
      filter: false,
    },
    {
      title: () => (
        <div className="d-flex align-items-center">
          <div className="mr-2">
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={
                filterEmpList?.length > 0 &&
                filterEmpList?.every((item) => item?.isArrearSalaryGenerate)
              }
              onChange={(e) => {
                let modifyRowDto = filterEmpList?.map((item) => ({
                  ...item,
                  isArrearSalaryGenerate: e.target.checked,
                }));
                let modifyRowDto2 = eligibleEmployee?.map((item) => ({
                  ...item,
                  isArrearSalaryGenerate: e.target.checked,
                }));
                setEligibleEmployee(modifyRowDto2);
                setFilterEmpList(modifyRowDto);
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          </div>
          <div>Employee Name</div>
        </div>
      ),
      dataIndex: "EmployeeName",
      render: (EmployeeName, record, index) => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="isArrearSalaryGenerate"
              color={greenColor}
              checked={record?.isArrearSalaryGenerate}
              onChange={(e) => {
                let data = filterEmpList?.map((item) => {
                  if (item?.EmployeeCode === record?.EmployeeCode) {
                    return {
                      ...item,
                      isArrearSalaryGenerate: e.target.checked,
                    };
                  } else return item;
                });
                let data2 = eligibleEmployee?.map((item) => {
                  if (item?.EmployeeCode === record?.EmployeeCode) {
                    return {
                      ...item,
                      isArrearSalaryGenerate: e.target.checked,
                    };
                  } else return item;
                });
                setEligibleEmployee(data2);
                setFilterEmpList(data);
              }}
              // disabled={item?.ApplicationStatus === "Approved"}
            />
          </div>
          <div className="d-flex align-items-center">
            <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
            <span className="ml-2">{EmployeeName}</span>
          </div>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Code",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Type",
      dataIndex: "EmployeeType",
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: "Department Section",
      dataIndex: "strDepartmentSection",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
    },
    {
      title: "Salary Policy",
      dataIndex: "strSalaryPolicyName",
      sorter: true,
      filter: true,
    },
  ];
};

export const arrearSalaryGenerateHandeler = (
  filterEmpList,
  params,
  orgId,
  values,
  employeeId,
  getById,
  resetForm,
  initialValues,
  setEligibleEmployee,
  setLoading
) => {
  const modifyRowDto = filterEmpList
    ?.filter((itm) => itm?.isArrearSalaryGenerate === true)
    ?.map((itm) => {
      return {
        intEmployeeId: itm?.EmployeeId,
        strEmployeeName: itm?.EmployeeName,
      };
    });

  if (modifyRowDto?.length <= 0) {
    return toast.warning("Selected Employee list is empty!!!");
  }
  const payload = {
    strPartName: "ArearSalaryGenerateNReGenerateRequest",
    intArearSalaryGenerateRequestId: +params?.id || 0,
    intAccountId: orgId,
    intBusinessUnitId: values?.businessUnit?.value,
    strBusinessUnit: values?.businessUnit?.label,
    dteEffectiveFrom: values?.fromDate,
    dteEffectiveTo: values?.toDate,
    strDescription: values?.description,
    intCreatedBy: employeeId,
    numPercentOfGross: values?.percentOfGross,
    intSalaryPolicyId: values?.payrollPolicy?.value,
    employeeIdList: modifyRowDto,
  };
  const callBack = () => {
    if (+params?.id) {
      getById();
    } else {
      resetForm(initialValues);
      setEligibleEmployee([]);
    }
  };
  createArearSalaryGenerateRequest(payload, setLoading, callBack);
};
