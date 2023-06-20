import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import FormikCheckBox from "../../../common/FormikCheckbox";
import { gray500, gray900, greenColor } from "../../../utility/customColor";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
import { Cell } from "../../../utility/customExcel/createExcelHelper";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";

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
// bonus name DDL
export const getBonusNameDDL = async (payload, setter) => {
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    setter(res?.data);
  } catch (error) {}
};

// bonus generate landing
export const getBonusGenerateLanding = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      cb?.(res?.data)
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// bonus generate request
export const createBonusGenerateRequest = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CRUDBonusGenerate`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong!");
    setLoading && setLoading(false);
  }
};

// get bonus generate list data for approval
export const getAllBonusGenerateListDataForApproval = async (
  payload,
  setter,
  setFilterData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderLandingEngine`,
      payload
    );
    if (res?.data) {
      setter(res?.data);
      setFilterData(res?.data);
    }
    // cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setFilterData([]);
    setLoading && setLoading(false);
  }
};

// bonus generate approve and reject
export const bonusGenerateApproveReject = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const columns = (rowDto, setRowDto, setFieldValue) => {
  return [
    {
      title: () => <div style={{ color: "#475467" }}>SL</div>,
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: () => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={
                rowDto?.length > 0 && rowDto?.every((item) => item?.isChecked)
              }
              onChange={(e) => {
                e.stopPropagation();
                let modifyRowDto = rowDto?.map((item) => ({
                  ...item,
                  isChecked: e.target.checked,
                }));
                setRowDto(modifyRowDto);
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          </div>
          <div>Employee Name</div>
        </div>
      ),
      dataIndex: "strEmployeeName",
      render: (strEmployeeName, record) => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="isBonusGenerate"
              color={greenColor}
              checked={record?.isChecked}
              onChange={(e) => {
                const modifiedRowDto = rowDto.map((item) =>
                  item?.intEmployeeId === record?.intEmployeeId
                    ? { ...item, isChecked: e.target.checked }
                    : item
                );
                setRowDto(modifiedRowDto);
              }}
              // disabled={item?.ApplicationStatus === "Approved"}
            />
          </div>
          <AvatarComponent
            classess=""
            letterCount={1}
            label={strEmployeeName}
          />
          <span className="ml-2">{strEmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
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
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
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
      title: "Payroll Group",
      dataIndex: "strPayrollGroup",
      sorter: true,
      filter: true,
    },
  ];
};

const bonusExcelHeader = {
  sl: "SL",
  intEmployeeId: "Employee Id",
  employeeName: "Employee Name",
  strDesignationName: "Designation",
  dteJoiningDate: "Joining Date",
  strServiceLength: "Job Duration",
  numSalary: "Gross Salary (TK)",
  numBonusPercentage: "Bonus Percentage",
  numBonusAmount: "Bonus Amount(TK)",
  remarks: "Remarks/Signature",
};
export const createBonusGenExcelHandeler = ({
  monthYear,
  buAddress,
  businessUnit,
  data,
  lastRow,
  effectiveDate,
  headeTitle,
}) => {
  createCommonExcelFile({
    titleWithDate: headeTitle,
    fromDate: "",
    toDate: "",
    buAddress,
    businessUnit,
    tableHeader: bonusExcelHeader,
    getTableData: () => getExcelTableData(data),
    tableFooter: bonusExcelFooter(lastRow),
    tableHeadFontSize: "10",
    widthList: {
      A: 25,
      B: 20,
      C: 30,
      D: 20,
      E: 20,
      F: 25,
      J: 30,

    },
    commonCellRange: "A1:J1",
    CellAlignment: "right",
    subHeaderInfoArr: [`Effective Data: ${dateFormatter(effectiveDate)}`],
    // extraInfo: {
    //   text: `In Word: ${withDecimal(
    //     colSumForDetailsReport(data, "TotalCostOfSalary")
    //   )} Taka Only`,
    //   fontSize: 13,
    //   bold: true,
    //   cellRange: "A1:J1",
    //   merge: true,
    //   alignment: "left:middle",
    // },
  });
};

const getExcelTableData = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? "Sub-Total:"
            : `Depertment: ${item?.DeptName}`
          : item?.SL,
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.strEmployeeCode : " ",
        "center",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.strEmployeeName : " ",
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),

      new Cell(
        !item?.DeptName?.trim() ? item?.strDesignationName : " ",
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? dateFormatter(item?.dteJoiningDate) : " ",
        "center",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.strServiceLength : " ",
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numSalary)}`
            : ""
          : item?.numSalary,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName
          ? item?.DeptName === "Sub-Total:"
            ? ` `
            : ` `
          : `${item?.numBonusPercentage}%`,
        "center",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numBonusAmount)}`
            : ""
          : item?.numBonusAmount,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        " ",
        "center",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
    ];
  });
  return data;
};

const bonusExcelFooter = (lastRow) => {
  return [
    " ",
    " ",
    "Total",
    " ",
    " ",
    " ",
    numberWithCommas(lastRow.numSalary.toFixed(2)),
    " ",
    numberWithCommas(lastRow.numBonusAmount.toFixed(2)),
    " ",
  ];
};

export const bonusGenerateColumn = (
  page,
  paginationSize,
  sendForApprovalHandler,
  values,
  history
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Bonus System",
      dataIndex: "strBonusSystem",
      sorter: true,
      filter: true,
    },
    {
      title: "Bonus Name",
      dataIndex: "strBonusName",
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
      title: "Effected Date",
      dataIndex: "strSalaryPolicyName",
      sorter: false,
      filter: false,
      render: (_, item) => dateFormatter(item?.dteEffectedDateTime),
    },
    {
      title: "Net Amount",
      dataIndex: "numBonusAmount",
      sorter: false,
      filter: false,
      className: "text-right",
      render: (_, item) => (
        <>
          {item?.numBonusAmount ? numberWithCommas(item?.numBonusAmount) : "0"}
        </>
      ),
    },
    {
      title: "Approval Status",
      dataIndex: "numNetPayableSalary",
      sorter: false,
      filter: false,
      className: "text-right",
      render: (_, data) => (
        <>
          {data?.strStatus.includes("Approved") && (
            <p style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}>
              {data?.strStatus}
            </p>
          )}
          {!data?.strStatus && (
            <div className="d-flex align-items-center justify-content-end">
              <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                  backgroundColor: "#0BA5EC",
                }}
                className="btn btn-default"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sendForApprovalHandler(data, values);
                }}
              >
                Send for Approval
              </button>
            </div>
          )}
          {data?.strStatus.includes("Pending") && (
            <p style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}>
              {data?.strStatus}
            </p>
          )}
          {data?.strStatus.includes("Reject") && (
            <p style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}>
              {data?.strStatus}
            </p>
          )}
        </>
      ),
    },
    {
      title: "",
      dataIndex: "",
      sorter: false,
      filter: false,
      className: "text-right",
      render: (_, data) => {
        return (
          <>
            {!data?.strStatus && (
              <div>
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push({
                      pathname: `/compensationAndBenefits/payrollProcess/bonusGenerate/edit/${data?.intBonusHeaderId}`,
                      state: {
                        bonusObj: data,
                      },
                    });
                  }}
                >
                  Re-Generate
                </button>
              </div>
            )}
          </>
        );
      },
    },
  ];
};
