import "../../employeeOverview.css";
import Gmails from "./Gmail/index";

function OAuth({ index, tabIndex, empId }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <Gmails empId={empId} />
            {/* <FaceBook empId={empId} /> */}
          </div>
        </div>
      </>
    )
  );
}

export default OAuth;
