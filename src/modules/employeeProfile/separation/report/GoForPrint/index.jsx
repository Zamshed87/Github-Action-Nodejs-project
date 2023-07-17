import { shallowEqual, useSelector } from "react-redux";
import PrintView from "../../../../../common/PrintView";
import "./index.css";

const SeparationReportPrintPage = () => {
  // const history = useHistory();
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  return (
    <PrintView>
      <div className="d-flex justify-content-center mt-2 mb-2">
        Employee Separation Report
      </div>
      <div className="main-table-body">
        <div className="row m-0">
          <div className="col-md-8 d-flex col">
            <div className="input-label">Name:</div>
            <div className="dotted-input "></div>
          </div>
          <div className="col-md-4 d-flex col">
            <div className="input-label">ID:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col ">
            <div className="input-label">Department:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">Designation:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">{supervisor || "Supervisor"}:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">Line Manager:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">Date of Joining:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">Confirmation Date:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">Separation Date:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-6 d-flex col">
            <div className="input-label">Last Working Date:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-12 d-flex col">
            <div className="input-label">Reason:</div>
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-12 d-flex col">
            {/* <div className="input-label">Reason:</div> */}
            <div className="dotted-input"></div>
          </div>
          <div className="col-md-8 d-flex col">
            <div className="input-label">Net Pay:</div>
            <div className="dotted-input"></div>
          </div>
        </div>
      </div>
    </PrintView>
  );
};

export default SeparationReportPrintPage;
