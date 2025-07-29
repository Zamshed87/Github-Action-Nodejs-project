import React from "react";
import "../../employeeOverview.css";
import FamilyCommonComp from "./FamilyCommonComp";

function Family({ index, tabIndex, empId, getProgress }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <FamilyCommonComp
              mainTitle="Emergency Contact"
              subTitle="Add your emergency contact"
              typeId={1}
              typeName="Emergency"
              empId={empId}
              getProgress={getProgress}
            />
            <FamilyCommonComp
              mainTitle="Nominee Information"
              subTitle="Add your nominee information"
              typeId={2}
              typeName="Nominee"
              empId={empId}
              getProgress={getProgress}
            />
            <FamilyCommonComp
              mainTitle="Father/Mother Information"
              subTitle="Add your father/mother information"
              typeId={3}
              typeName="Grantor"
              empId={empId}
              getProgress={getProgress}
            />
            <FamilyCommonComp
              mainTitle="Guarantor/Reference Information"
              subTitle="Add your guarantor/reference information"
              typeId={4}
              typeName="Reference"
              empId={empId}
              getProgress={getProgress}
            />
          </div>
        </div>
      </>
    )
  );
}

export default Family;
