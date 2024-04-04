import {
  CreateOutlined,
  VisibilityOutlined
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import AvatarComponent from "common/AvatarComponent";
import Chips from "common/Chips";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { numberWithCommas } from "utility/numberWithCommas";

const statusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Done" },
];

const initData = {
  employee: "",
  cardNumber: "",
  healthCard: "",
  salaryDues: "",
  lastDrawnMonth: "",
  dueMonth: "",
  advanceDues: "",
  taDaOtDues: "",
  otherDues: "",
  remarksHr: "",
  remarksStore: "",
};

const getFinalSettlementById = async (
  accId,
  buId,
  stlmntId,
  setter,
  setLoading,
  setEmployeeDDL,
  cb
) => {
  setLoading(true);

  try {
    const res = await axios.get(
      `/SaasMasterData/GetEmpFinalSettlementById?AccountId=${accId}&intBusinessUnitId=${buId}&FinalSettlementId=${stlmntId}`
    );
    if (res?.data) {
      setter?.(res.data);
      cb?.(res.data || []);
      setEmployeeDDL({
        value: res?.data?.intEmployeeId,
        label: res?.data?.strEmployeeCode,
      });
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

const getFinalSettlement = async (accId, buId, empId, setter, setLoading) => {
  setLoading(true);

  try {
    const res = await axios.get(
      `/SaasMasterData/GetEmpSeparationLoaderData?AccountId=${accId}&intBusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    if (res?.data) {
      const monthlyCompensation = [...res?.data?.monthlyCompensation];

      const totalGross = monthlyCompensation?.reduce((totalGross, element) => {
        return totalGross + element?.amount;
      }, 0);
      monthlyCompensation.push({
        salaryElement: "Total Gross",
        amount: totalGross,
      });
      setter({
        ...res?.data,
        monthlyCompensation,
      });
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

const getPeopleDeskAllDDL = async (apiUrl, value, label, setter) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter(newDDL);
  } catch (error) {}
};

const mapPayrollElementPaymentForFinalSattlement =
  (intCalculationStatus, strCalculationStatus) => (item) => ({
    //     primary-> 1
    //     addition-> 2
    //     deduction-> 3
    intFinalSettlementRowId: item?.intFinalSettlementRowId
      ? item?.intFinalSettlementRowId
      : 0,
    intFinalSettlementId: item?.intFinalSettlementId
      ? item?.intFinalSettlementId
      : 0,
    strPayrollElementName: item?.strPayrollElementName,
    strRemarks: item?.strRemarks || "",
    numAmount: item?.numAmount ? +item?.numAmount : 0,
    intCalculationStatus: intCalculationStatus,
    strCalculationStatus: strCalculationStatus,
  });

const calculateTotalAmountForFinalSattlement = (payroll) =>
  payroll.reduce((sum, item) => sum + (+item?.numAmount || 0), 0);

const saveEmpFinalSettlement = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/SaasMasterData/SaveEmpFinalSettlement`,
      payload
    );
    cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

const settlementData = (finalSettlement) => {
  return [
    {
      title: "Employee ID",
      value: finalSettlement?.employeeId,
    },
    {
      title: "Designation",
      value: finalSettlement?.designationName,
    },
    {
      title: "Department",
      value: finalSettlement?.departmentName,
    },
    {
      title: "Mobile (Official)",
      value: finalSettlement?.officialMobile,
    },
    {
      title: "Employment Status",
      value: finalSettlement?.employmentStatus,
    },
    {
      title: "Date of Joining",
      value: dateFormatter(finalSettlement?.dateOfJoining),
    },
    {
      title: "Confirmation Date",
      value: dateFormatter(finalSettlement?.confirmationDate),
    },
    {
      title: "Length of Service",
      value: finalSettlement?.lengthOfService,
    },
    {
      title: "Type of Separation",
      value: finalSettlement?.typeOfSeparation,
    },
    {
      title: "Date of Resign",
      value: dateFormatter(finalSettlement?.dateOfResign),
    },
    {
      title: "Last Working Date",
      value: dateFormatter(finalSettlement?.lastWorkingDate),
    },
    {
      title: "Notice Period",
      value: finalSettlement?.noticePeriod,
    },
  ];
};

const updatePayrollElementByIndex = ({
  index,
  fieldName,
  value,
  rowDto,
  setRowDto,
}) => {
  const newPayrollElement = [...rowDto];
  newPayrollElement[index][fieldName] = value;
  setRowDto(newPayrollElement);
};

const getFinalSettlementLanding = async (
  accId,
  buId,
  statusId,
  setter,
  setLoading,
  setAllData
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetEmpFinalSettlementLanding?AccountId=${accId}&intBusinessUnitId=${buId}&Status=${statusId}`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
const deleteFinalSettlement = async (
  accId,
  buId,
  stlmntId,
  employeeId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/DeleteEmpFinalSettlement?AccountId=${accId}&intBusinessUnitId=${buId}&FinalSettlementId=${stlmntId}&ActionBy=${employeeId}`
    );
    if (res?.data) {
      setLoading(false);
      cb();
      toast.success(res?.data?.message || "Deleted Successfully");
    }
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

const finalSettlementColumns = (
  demoPopup,
  history,
  orgId,
  buId,
  setLoading,
  setId,
  setOpenModal,
  setType,
  setEmpId,
  setEmpBasicInfo
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: "50px",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      render: (data) => <div>{data || "N/A"}</div>,
      filter: false,
      sorter: false,
      width: "100px",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName?.trim()}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      render: (designationName) => <div>{designationName || "N/A"}</div>,
      sorter: true,
      // filter: true,
      width: "150px",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      render: (departmentName) => <div>{departmentName || "N/A"}</div>,
      sorter: true,
      // filter: true,
      width: "150px",
    },
    {
      title: "Type of Separation",
      dataIndex: "typeOfSeparation",
      render: (typeOfSeparation) => <div>{typeOfSeparation || "N/A"}</div>,
      sorter: true,
      filter: true,
      width: "150px",
    },
    {
      title: "Date of Resign",
      dataIndex: "dateOfResign",
      render: (_, record) => (
        <div>{dateFormatter(record?.dateOfResign) || "N/A"}</div>
      ),
      filter: false,
      sorter: false,
      width: "100px",
    },
    {
      title: "Total Paid Amount  (BDT)",
      dataIndex: "numTotalAmount",
      render: (_, record) => (
        <div>{numberWithCommas(record?.numTotalAmount) || "N/A"}</div>
      ),
      filter: false,
      sorter: true,
      isNumber: true,
      width: "200px",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      filter: false,
      render: (item, record) => (
        <>
          {record?.status === "Done" && (
            <Chips label="Done" classess="success p-2" />
          )}
          {record?.status === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
        </>
      ),
      width: "100px",
      className: "text-center",
    },
    {
      title: "Action",
      dataIndex: "Status",
      render: (data, record) => (
        <div className="d-flex align-items-center">
          <Tooltip title="View" arrow>
            <button
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0"
              onClick={(e) => {
                e.stopPropagation();
                setId(record?.intSeparationId);
                setEmpId(null);
                setEmpBasicInfo(record);
                setOpenModal(true);
                setType("dueAmount");
              }}
            >
              <VisibilityOutlined />
            </button>
          </Tooltip>
          {record?.status === "Pending" && (
            <>
              <Tooltip title="Edit" arrow>
                <button
                  type="button"
                  className="iconButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    setId(record?.intSeparationId);
                    setEmpId(record?.intEmployeeId);
                    setEmpBasicInfo(record);
                    setOpenModal(true);
                    setType("dueAmount");
                  }}
                >
                  <CreateOutlined />
                </button>
              </Tooltip>
              {/* <Tooltip title="Delete" arrow>
                <button
                  type="button"
                  className="iconButton mt-0 mt-md-2 mt-lg-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // demoPopup(record?.intFinalSettlementId);
                  }}
                >
                  <DeleteOutlined />
                </button>
              </Tooltip> */}
            </>
          )}
          {/* <Tooltip title="Print/Pdf" arrow>
            <button
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0"
              onClick={(e) => {
                e.stopPropagation();
                const api = `/PdfAndExcelReport/FinalSettlementReportPDF?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntEmployeeId=${record?.intEmployeeId}&IntFinalSettlementId=${record?.intFinalSettlementId}`;
                getPDFAction(api, setLoading);
              }}
            >
              <Print sx={{}} />
            </button>
          </Tooltip> */}
        </div>
      ),
      sorter: false,
      filter: false,
      width: "150px",
    },
  ];
};

export {
  calculateTotalAmountForFinalSattlement,
  deleteFinalSettlement,
  finalSettlementColumns,
  getFinalSettlement,
  getFinalSettlementById,
  getFinalSettlementLanding,
  getPeopleDeskAllDDL,
  initData,
  mapPayrollElementPaymentForFinalSattlement,
  saveEmpFinalSettlement,
  settlementData,
  statusDDL,
  updatePayrollElementByIndex
};

