import { Divider } from "@mui/material";
import NoResult from "../../../common/NoResult";
import { empAttenColumns } from "./helper";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { DataTable } from "Components";
import { MdPrint } from "react-icons/md";
import { getPDFAction } from "utility/downloadFile";

const EmpInOutModal = ({ propsObj }) => {
  const {
    setEmpData,
    setValue,
    prevMonth,
    getAttendanceData,
    setModalLoading,
    currMonthName,
    currYear,
    nextMonth,
    empData,
    modalLoading,
    empDetails,
    currMonth,
  } = propsObj;

  return (
    <div
      className="modal-body2 mx-3"
      style={{ height: "500px", overflow: "scroll" }}
    >
      <div className="d-flex justify-content-between">
        <div>
          <p>
            Employee :{" "}
            <span style={{ fontWeight: "bold" }}>
              {empDetails?.employeeName}
            </span>
          </p>
          <p>
            Designation :{" "}
            <span style={{ fontWeight: "bold" }}>
              {empDetails?.designation}
            </span>
          </p>
          <p>
            Department :{" "}
            <span style={{ fontWeight: "bold" }}>{empDetails?.departmant}</span>
          </p>
        </div>
        <div>
          <div
            className="export_icon"
            style={{
              background: "var(--gray200)",
              borderRadius: "50%",
              padding: "3px 6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              getPDFAction(
                `/PdfAndExcelReport/DailyAttendanceReportByEmployee?TypeId=0&EmployeeId=${
                  empDetails?.employeeId
                }&FromDate=${currYear()}-${currMonth()}-01&ToDate=${currYear()}-${currMonth()}-30`,
                setModalLoading
              );
            }}
          >
            <MdPrint />
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center mb-2">
        <KeyboardArrowLeftIcon
          className="pointer"
          onClick={() => {
            setEmpData(null);
            setValue(prevMonth());
            getAttendanceData(
              empDetails?.employeeId,
              setModalLoading,
              prevMonth().format("YYYY-MM")
            );
          }}
        />
        <p style={{ fontSize: "20px" }}>
          {currMonthName() + `, ` + currYear()}
        </p>
        <KeyboardArrowRightIcon
          className="pointer"
          onClick={() => {
            setEmpData(null);
            setValue(nextMonth());
            getAttendanceData(
              empDetails?.employeeId,
              setModalLoading,
              nextMonth().format("YYYY-MM")
            );
          }}
        />
      </div>
      <Divider />
      <div className="table-card-body">
        {empData?.length > 0 ? (
          <DataTable
            scroll={{ y: 300, x: 400 }}
            bordered
            data={empData?.length > 0 && empData}
            header={empAttenColumns()}
          />
        ) : (
          !modalLoading && <NoResult />
        )}
      </div>
    </div>
  );
};

export default EmpInOutModal;
