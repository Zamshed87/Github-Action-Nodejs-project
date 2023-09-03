import { Divider } from "@mui/material";
import NoResult from "../../../common/NoResult";
import { empAttenColumns } from "./helper";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AntScrollTable from "../../../common/AntScrollTable";

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
  } = propsObj;

  return (
    <div
      className="modal-body2 mx-3"
      style={{ height: "500px", overflow: "scroll" }}
    >
      <p>
        Employee :{" "}
        <span style={{ fontWeight: "bold" }}>{empDetails?.employeeName}</span>
      </p>
      <p>
        Designation :{" "}
        <span style={{ fontWeight: "bold" }}>{empDetails?.designation}</span>
      </p>
      <p>
        Department :{" "}
        <span style={{ fontWeight: "bold" }}>{empDetails?.departmant}</span>
      </p>
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
          <AntScrollTable
            data={empData?.length > 0 && empData}
            columnsData={empAttenColumns()}
            removePagination
            y={300}
            x={400}
          />
        ) : (
          !modalLoading && <NoResult />
        )}
      </div>
    </div>
  );
};

export default EmpInOutModal;
